import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from datetime import datetime

# Testing library and framework:
# Using pytest (Python) for integration-style tests that execute the Node ESM script.
# Rationale: We discovered/assumed pytest-based tests exist in this repository's tests/ tree.
# These tests do not introduce new dependencies and follow pytest idioms.

ISO_8601 = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,}Z?$")


def _copy_build_script(repo_root: Path, temp_root: Path) -> Path:
    """
    Copy the build-codex.mjs into an isolated temp workspace while preserving its
    directory structure depth so that `ROOT = path.resolve(__dirname, '..')` points
    to the temp root where we create /data and /dist.
    We try common locations; if not found we search heuristically.
    """
    candidates = [
        repo_root / "scripts" / "build-codex.mjs",
        repo_root / "tools" / "build-codex.mjs",
        repo_root / "bin" / "build-codex.mjs",
        repo_root / "build-codex.mjs",
    ]
    src = None
    for c in candidates:
        if c.is_file():
            src = c
            break
    if src is None:
        # Heuristic search
        found = list(repo_root.rglob("build-codex.mjs"))
        if not found:
            raise FileNotFoundError("Could not locate build-codex.mjs in repository.")
        src = found[0]

    # Mirror the containing directory one level deep to keep __dirname/.. resolution
    rel_dir = src.parent.name
    dest_dir = temp_root / rel_dir
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / src.name
    dest.write_bytes(src.read_bytes())
    return dest

def _run_node(script_path: Path, cwd: Path):
    # Run Node on the ESM script. We capture stdout/stderr for assertions.
    env = os.environ.copy()
    # Ensure UTF-8 and deterministic timezone for timestamps format (still ISO)
    env.setdefault("TZ", "UTC")
    return subprocess.run(
        ["node", str(script_path)],
        cwd=str(cwd),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

def _read_json(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))

def test_happy_path_writes_minified_bundle_and_logs(tmp_path: Path):
    repo_root = Path.cwd()
    temp_root = tmp_path

    script_path = _copy_build_script(repo_root, temp_root)

    # Per script logic, ROOT = dirname(script)/.. -> temp_root
    data_dir = temp_root / "data"
    dist_dir = temp_root / "dist"
    data_dir.mkdir(parents=True)
    # dist_dir intentionally not created to assert mkdir({recursive:true})

    (data_dir / "constants.json").write_text(json.dumps({"v": 1, "name": "codex"}), encoding="utf-8")
    (data_dir / "nodes.json").write_text(json.dumps([{"id": "n1"}, {"id": "n2"}]), encoding="utf-8")
    (data_dir / "citations.json").write_text(json.dumps(["c1", "c2"]), encoding="utf-8")
    (data_dir / "palette.json").write_text(json.dumps({"primary": "#123456"}), encoding="utf-8")

    result = _run_node(script_path, cwd=temp_root)
    assert result.returncode == 0, f"stderr: {result.stderr}"

    out_path = dist_dir / "codex.min.json"
    assert out_path.is_file(), "Expected output file codex.min.json to be created"

    # Output should be minified JSON without extraneous whitespace (single line or compact)
    raw = out_path.read_text(encoding="utf-8")
    # Quick minification heuristic: compact JSON has no newline characters
    assert "\n" not in raw, "Expected minified JSON (single line)"
    data = json.loads(raw)

    # Validate payload structure
    assert set(data.keys()) == {"generated_at", "constants", "nodes", "citations", "palette"}
    assert isinstance(data["constants"], dict) and data["constants"]["v"] == 1
    assert isinstance(data["nodes"], list) and len(data["nodes"]) == 2
    assert isinstance(data["citations"], list) and data["citations"] == ["c1", "c2"]
    assert isinstance(data["palette"], dict) and data["palette"]["primary"] == "#123456"
    assert isinstance(data["generated_at"], str) and ISO_8601.match(data["generated_at"])

    # Validate console output line format and byte size matches file content length
    stdout = result.stdout.strip().splitlines()

    assert stdout, "Expected stdout to contain a log line"
    last = stdout[-1]
    # Example: [build] wrote dist/codex.min.json (123 bytes)
    m = re.match(r"^\[build\] wrote (.+codex\.min\.json) \((\d+) bytes\)$", last)
    assert m, f"Unexpected log format: {last}"
    rel_path, size_str = m.groups()
    assert rel_path.endswith("dist/codex.min.json")
    assert int(size_str) == len(raw.encode("utf-8")), "Logged byte size should match actual file bytes"

def test_missing_optional_files_use_fallbacks_and_still_builds(tmp_path: Path):
    repo_root = Path.cwd()
    temp_root = tmp_path

    script_path = _copy_build_script(repo_root, temp_root)

    data_dir = temp_root / "data"
    dist_dir = temp_root / "dist"
    data_dir.mkdir(parents=True)

    # Only provide constants.json; omit nodes.json, citations.json, palette.json to trigger fallbacks
    (data_dir / "constants.json").write_text(json.dumps({"only": True}), encoding="utf-8")

    result = _run_node(script_path, cwd=temp_root)
    assert result.returncode == 0, f"stderr: {result.stderr}"

    out_path = dist_dir / "codex.min.json"
    data = _read_json(out_path)

    assert data["constants"] == {"only": True}
    assert data["nodes"] == []       # fallback
    assert data["citations"] == []   # fallback
    assert data["palette"] is None   # fallback
    assert isinstance(data["generated_at"], str) and ISO_8601.match(data["generated_at"])

def test_malformed_json_causes_failure_and_exit_code_nonzero(tmp_path: Path):
    repo_root = Path.cwd()
    temp_root = tmp_path

    script_path = _copy_build_script(repo_root, temp_root)

    data_dir = temp_root / "data"
    data_dir.mkdir(parents=True)

    # Write malformed JSON to trigger JSON.parse error path in readJSON (not ENOENT)
    (data_dir / "nodes.json").write_text("{ not: valid json", encoding="utf-8")

    result = _run_node(script_path, cwd=temp_root)

    # Script's top-level catch sets process.exitCode = 1 and logs error
    assert result.returncode != 0
    assert "[build] failed:" in result.stderr

def test_idempotent_overwrite_when_dist_exists(tmp_path: Path):
    repo_root = Path.cwd()
    temp_root = tmp_path

    script_path = _copy_build_script(repo_root, temp_root)

    data_dir = temp_root / "data"
    dist_dir = temp_root / "dist"
    data_dir.mkdir(parents=True)
    dist_dir.mkdir(parents=True)

    (data_dir / "constants.json").write_text(json.dumps({"v": 1}), encoding="utf-8")
    (data_dir / "nodes.json").write_text(json.dumps([]), encoding="utf-8")
    (data_dir / "citations.json").write_text(json.dumps([]), encoding="utf-8")
    (data_dir / "palette.json").write_text("null", encoding="utf-8")

    # First run
    r1 = _run_node(script_path, cwd=temp_root)
    assert r1.returncode == 0
    out_path = dist_dir / "codex.min.json"
    first_mtime = out_path.stat().st_mtime_ns

    # Second run should overwrite without error
    r2 = _run_node(script_path, cwd=temp_root)
    assert r2.returncode == 0
    second_mtime = out_path.stat().st_mtime_ns

    assert second_mtime >= first_mtime

def test_generated_at_is_current_iso_timestamp(tmp_path: Path):
    repo_root = Path.cwd()
    temp_root = tmp_path

    script_path = _copy_build_script(repo_root, temp_root)

    data_dir = temp_root / "data"
    data_dir.mkdir(parents=True)
    (data_dir / "constants.json").write_text("{}", encoding="utf-8")

    before = datetime.utcnow()
    res = _run_node(script_path, cwd=temp_root)
    assert res.returncode == 0

    out = (temp_root / "dist" / "codex.min.json")
    payload = _read_json(out)
    assert ISO_8601.match(payload["generated_at"])
    # Very loose freshness check (within ~1 day)
    # Parsing without extra deps: check date prefix equals today's UTC date
    today_prefix = before.strftime("%Y-%m-%d")
    assert payload["generated_at"].startswith(today_prefix)