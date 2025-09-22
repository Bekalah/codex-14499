import json
import os
import re
import subprocess
from pathlib import Path

ISO_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,}Z?$")

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = ROOT / "scripts" / "build-codex.mjs"


def copy_script(temp_root: Path) -> Path:
    dest_dir = temp_root / "scripts"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / SCRIPT_PATH.name
    dest.write_bytes(SCRIPT_PATH.read_bytes())
    return dest


def run_node(script: Path, cwd: Path) -> subprocess.CompletedProcess:
    env = os.environ.copy()
    env.setdefault("TZ", "UTC")
    return subprocess.run(
        ["node", str(script)],
        cwd=str(cwd),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def test_bundle_contains_expected_fields(tmp_path: Path):
    script = copy_script(tmp_path)
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    (data_dir / "constants.json").write_text(json.dumps({"THREE": 3}), encoding="utf-8")
    (data_dir / "nodes.json").write_text(json.dumps([{ "id": 0 }]), encoding="utf-8")
    (data_dir / "citations.json").write_text(json.dumps(["c1"]), encoding="utf-8")
    (data_dir / "palette.json").write_text(json.dumps({"bg": "#000000", "ink": "#ffffff", "layers": ["#111111"] * 6}), encoding="utf-8")

    result = run_node(script, tmp_path)
    assert result.returncode == 0, result.stderr
    bundle = tmp_path / "dist" / "codex.min.json"
    assert bundle.exists()
    raw = bundle.read_text(encoding="utf-8")
    assert "\n" not in raw
    payload = json.loads(raw)
    assert payload["name"]
    assert payload["version"]
    assert ISO_PATTERN.match(payload["generated_at"])
    assert payload["constants"]["THREE"] == 3
    assert payload["nodes"][0]["id"] == 0
    assert payload["citations"] == ["c1"]
    assert payload["palette"]["bg"] == "#000000"
    log_line = result.stdout.strip().splitlines()[-1]
    assert "dist/codex.min.json" in log_line


def test_missing_optional_inputs(tmp_path: Path):
    script = copy_script(tmp_path)
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    (data_dir / "constants.json").write_text("{}", encoding="utf-8")

    result = run_node(script, tmp_path)
    assert result.returncode == 0
    payload = read_json(tmp_path / "dist" / "codex.min.json")
    assert payload["constants"] == {}
    assert payload["nodes"] == []
    assert payload["citations"] == []
    assert payload["palette"] is None


def test_malformed_json_fails(tmp_path: Path):
    script = copy_script(tmp_path)
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    (data_dir / "nodes.json").write_text("{ bad json", encoding="utf-8")

    result = run_node(script, tmp_path)
    assert result.returncode != 0
    assert "[build] failed" in result.stderr


def test_repeated_runs_overwrite(tmp_path: Path):
    script = copy_script(tmp_path)
    data_dir = tmp_path / "data"
    dist_dir = tmp_path / "dist"
    data_dir.mkdir()
    dist_dir.mkdir()
    (data_dir / "constants.json").write_text("{}", encoding="utf-8")
    (data_dir / "nodes.json").write_text("[]", encoding="utf-8")
    (data_dir / "citations.json").write_text("[]", encoding="utf-8")
    (data_dir / "palette.json").write_text("null", encoding="utf-8")

    first = run_node(script, tmp_path)
    assert first.returncode == 0
    bundle = dist_dir / "codex.min.json"
    stamp1 = bundle.stat().st_mtime_ns
    second = run_node(script, tmp_path)
    assert second.returncode == 0
    stamp2 = bundle.stat().st_mtime_ns
    assert stamp2 >= stamp1
