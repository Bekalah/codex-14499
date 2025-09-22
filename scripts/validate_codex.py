#!/usr/bin/env python3
"""Codex 144:99 data validator.

Checks that dist/codex.min.json exists, loads the node schema, validates each
node object, and enforces ND-safe timing rules (minSweepSec >= 14 whenever
motionOptIn is true). Designed for offline use with no extra dependencies.
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Sequence

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_PATH = REPO_ROOT / "dist" / "codex.min.json"
DEFAULT_SCHEMA_PATH = REPO_ROOT / "schema" / "codex-node.schema.json"

TypeName = str

@dataclass
class ValidationIssue:
    path: str
    message: str


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def type_matches(value: Any, expected: Sequence[str]) -> bool:
    for kind in expected:
        if kind == "object" and isinstance(value, dict):
            return True
        if kind == "array" and isinstance(value, list):
            return True
        if kind == "string" and isinstance(value, str):
            return True
        if kind == "integer" and isinstance(value, int) and not isinstance(value, bool):
            return True
        if kind == "number" and isinstance(value, (int, float)) and not isinstance(value, bool):
            return True
        if kind == "boolean" and isinstance(value, bool):
            return True
        if kind == "null" and value is None:
            return True
    return False


def validate_schema(value: Any, schema: Dict[str, Any], path: str = "$") -> List[ValidationIssue]:
    issues: List[ValidationIssue] = []
    type_decl = schema.get("type")
    if type_decl:
        expected = [type_decl] if isinstance(type_decl, str) else list(type_decl)
        if not type_matches(value, expected):
            issues.append(ValidationIssue(path, f"expected type {expected}, received {type(value).__name__}"))
            return issues

    if "enum" in schema and value not in schema["enum"]:
        issues.append(ValidationIssue(path, f"expected one of {schema['enum']}, received {value!r}"))

    if "pattern" in schema and isinstance(value, str):
        if not re.search(schema["pattern"], value):
            issues.append(ValidationIssue(path, f"value '{value}' does not match pattern {schema['pattern']}"))

    if "minimum" in schema and isinstance(value, (int, float)) and not isinstance(value, bool):
        if value < schema["minimum"]:
            issues.append(ValidationIssue(path, f"value {value} below minimum {schema['minimum']}"))

    if "exclusiveMinimum" in schema and isinstance(value, (int, float)) and not isinstance(value, bool):
        if value <= schema["exclusiveMinimum"]:
            issues.append(ValidationIssue(path, f"value {value} must be greater than {schema['exclusiveMinimum']}"))

    schema_type = type_decl
    if schema_type == "object" or (not schema_type and isinstance(value, dict)):
        required = schema.get("required", [])
        for key in required:
            if key not in value:
                issues.append(ValidationIssue(f"{path}.{key}", "missing required property"))
        props = schema.get("properties", {})
        for key, subschema in props.items():
            if key in value:
                issues.extend(validate_schema(value[key], subschema, f"{path}.{key}"))
        if schema.get("additionalProperties") is False:
            allowed = set(props.keys())
            for key in value.keys():
                if key not in allowed:
                    issues.append(ValidationIssue(f"{path}.{key}", "additional properties are not allowed"))

    if schema_type == "array" or (not schema_type and isinstance(value, list)):
        min_items = schema.get("minItems")
        if min_items is not None and len(value) < min_items:
            issues.append(ValidationIssue(path, f"expected at least {min_items} items"))
        item_schema = schema.get("items")
        if isinstance(item_schema, dict):
            for index, item in enumerate(value):
                issues.extend(validate_schema(item, item_schema, f"{path}[{index}]"))
    return issues


def validate_node(node: Dict[str, Any], schema: Dict[str, Any], index: int) -> List[ValidationIssue]:
    issues = validate_schema(node, schema, f"node[{index}]")
    safety = node.get("safety", {})
    if safety.get("motionOptIn"):
        sweep = safety.get("minSweepSec")
        if sweep is None or sweep < 14:
            issues.append(ValidationIssue(f"node[{index}].safety.minSweepSec", "must be >= 14 seconds when motionOptIn is true"))
    return issues


def run_validation(data_path: Path, schema_path: Path) -> int:
    if not data_path.exists():
        print(f"[ERROR] Missing data bundle: {data_path}")
        return 2
    if not schema_path.exists():
        print(f"[ERROR] Missing schema file: {schema_path}")
        return 2

    payload = load_json(data_path)
    schema = load_json(schema_path)

    nodes = payload.get("nodes")
    if not isinstance(nodes, list):
        print("[ERROR] Payload missing 'nodes' array")
        return 1

    issues: List[ValidationIssue] = []
    for index, node in enumerate(nodes):
        if not isinstance(node, dict):
            issues.append(ValidationIssue(f"node[{index}]", "expected object"))
            continue
        issues.extend(validate_node(node, schema, index))

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue.path}: {issue.message}")
        print(f"[ERROR] Validation failed for {len(issues)} issues across {len(nodes)} nodes.")
        return 1

    print(f"[OK] {len(nodes)} nodes validated against schema and safety rules.")
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    argv = list(argv or sys.argv[1:])
    if len(argv) > 2:
        print("Usage: python scripts/validate_codex.py [data_path] [schema_path]")
        return 2

    data_path = Path(argv[0]) if argv else DEFAULT_DATA_PATH
    schema_path = Path(argv[1]) if len(argv) == 2 else DEFAULT_SCHEMA_PATH
    return run_validation(data_path, schema_path)


if __name__ == "__main__":
    sys.exit(main())
