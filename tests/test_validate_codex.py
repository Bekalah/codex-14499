import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "validate_codex.py"
SCHEMA = ROOT / "schema" / "codex-node.schema.json"


def copy_validator(temp_root: Path) -> Path:
    scripts_dir = temp_root / "scripts"
    schema_dir = temp_root / "schema"
    scripts_dir.mkdir(parents=True, exist_ok=True)
    schema_dir.mkdir(parents=True, exist_ok=True)
    script_path = scripts_dir / SCRIPT.name
    script_path.write_bytes(SCRIPT.read_bytes())
    schema_path = schema_dir / SCHEMA.name
    schema_path.write_bytes(SCHEMA.read_bytes())
    return script_path


def write_bundle(tmp_path: Path, nodes):
    dist_dir = tmp_path / "dist"
    dist_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "name": "codex-14499",
        "version": "1.0.0",
        "generated_at": "2024-06-01T00:00:00.000Z",
        "constants": {},
        "nodes": nodes,
        "citations": [],
        "palette": None
    }
    (dist_dir / "codex.min.json").write_text(json.dumps(payload), encoding="utf-8")


def run_validator(tmp_path: Path, script_path: Path):
    return subprocess.run(
        [sys.executable, str(script_path)],
        cwd=str(tmp_path),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def base_node():
    return {
        "id": 0,
        "slug": "vesica-seed",
        "title": "Test",
        "layer": "vesica",
        "summary": "placeholder",
        "keywords": ["vesica"],
        "geometry": {"grid": {"columns": 3, "rows": 3, "radius": 22}},
        "numerology": {"triad": 3, "heptad": 7, "ennead": 9, "paths": 22, "lattice": 33},
        "safety": {"ndSafe": True, "motionOptIn": False, "minSweepSec": None, "notes": "static"},
        "provenance": {"sources": ["notes"], "reviewed": "2024-05-01", "confidence": "stable"},
        "notes": "ok"
    }


def test_validator_passes_on_valid_payload(tmp_path: Path):
    script = copy_validator(tmp_path)
    nodes = [base_node(), {**base_node(), "id": 1, "slug": "helix", "layer": "helix", "safety": {"ndSafe": True, "motionOptIn": True, "minSweepSec": 18, "notes": "consent"}}]
    write_bundle(tmp_path, nodes)
    result = run_validator(tmp_path, script)
    assert result.returncode == 0
    assert "[OK]" in result.stdout


def test_validator_catches_fast_motion(tmp_path: Path):
    script = copy_validator(tmp_path)
    bad_node = base_node()
    bad_node["safety"] = {"ndSafe": True, "motionOptIn": True, "minSweepSec": 5, "notes": "too fast"}
    write_bundle(tmp_path, [bad_node])
    result = run_validator(tmp_path, script)
    assert result.returncode == 1
    assert "minSweepSec" in result.stdout


def test_validator_detects_schema_issue(tmp_path: Path):
    script = copy_validator(tmp_path)
    broken = base_node()
    broken.pop("provenance")
    write_bundle(tmp_path, [broken])
    result = run_validator(tmp_path, script)
    assert result.returncode == 1
    assert "provenance" in result.stdout
