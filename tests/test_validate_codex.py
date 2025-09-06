import json
import subprocess
import sys
from pathlib import Path
import importlib.util

# Load the validator module without requiring package imports
SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "validate_codex.py"
spec = importlib.util.spec_from_file_location("validate_codex", SCRIPT)
validate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validate)


def _write_nodes(tmp_path, nodes):
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    with (data_dir / "codex_nodes_full.json").open("w", encoding="utf-8") as f:
        json.dump(nodes, f, ensure_ascii=False)


def _run_validator(tmp_path):
    """Execute the script as a standalone process."""
    return subprocess.run(
        [sys.executable, str(SCRIPT)],
        cwd=tmp_path,
        capture_output=True,
        text=True,
    )


def _base_node():
    return {
        "node_id": 1,
        "name": "Test",
        "locked": True,
        "egregore_id": 1,
        "shem_angel": "A",
        "goetic_demon": "B",
        "gods": [],
        "goddesses": [],
        "chakra": "root",
        "planet": "earth",
        "zodiac": "aries",
        "element": "fire",
        "platonic_solid": "tetrahedron",
        "geometry": "vesica",
        "art_style": "minimal",
        "function": "test",
        "ritual_use": "none",
        "fusion_tags": [],
        "solfeggio_freq": 963,
        "music_profile": {},
        "color_scheme": {},
        "healing_profile": {},
        "symbolic_keywords": [],
    }


def test_validation_success(tmp_path):
    node = _base_node()
    node_copy = dict(node)
    node["lock_hash"] = validate.compute_lock_hash(node_copy)
    _write_nodes(tmp_path, [node])
    res = _run_validator(tmp_path)
    assert res.returncode == 0
    assert "[OK] 1 nodes validated" in res.stdout


def test_validation_lock_hash_mismatch(tmp_path):
    node = _base_node()
    node["lock_hash"] = "bad" * 16
    _write_nodes(tmp_path, [node])
    res = _run_validator(tmp_path)
    assert res.returncode == 1
    assert "lock_hash mismatch" in res.stdout


def test_validation_missing_field(tmp_path):
    node = _base_node()
    node.pop("name")
    node["lock_hash"] = validate.compute_lock_hash(node)
    _write_nodes(tmp_path, [node])
    res = _run_validator(tmp_path)
    assert res.returncode == 1
    assert "missing key 'name'" in res.stdout
