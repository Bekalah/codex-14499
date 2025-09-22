import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PALETTE_PATH = ROOT / "data" / "palette.json"
MODULE_PATH = ROOT / "js" / "helix-renderer.mjs"


def read_module_text() -> str:
    text = MODULE_PATH.read_text(encoding="utf-8")
    assert text.strip(), "helix-renderer.mjs should not be empty"
    return text


def test_palette_structure():
    data = json.loads(PALETTE_PATH.read_text(encoding="utf-8"))
    assert set(data.keys()) == {"bg", "ink", "layers"}
    assert len(data["layers"]) == 6
    for value in [data["bg"], data["ink"], *data["layers"]]:
        assert isinstance(value, str) and value.startswith("#") and len(value) == 7


def test_module_exports_present():
    txt = read_module_text()
    for name in [
        "function drawVesica",
        "function drawTree",
        "function drawFibonacci",
        "function drawHelix",
        "function renderHelix",
    ]:
        assert name in txt
    assert "export {" in txt and "renderHelix" in txt


def test_helpers_documented():
    txt = read_module_text()
    assert "GOLDEN_RATIO" in txt
    assert "DEFAULT_NUM" in txt and "DEFAULT_PALETTE" in txt
    assert "function ensurePalette" in txt
    assert "function ensureNumerology" in txt
    assert "function normalizeOptions" in txt


def test_helix_point_formula_comment():
    txt = read_module_text()
    assert "helixPoint" in txt
    assert "Crossbars tie the two strands" in txt


def test_render_invocation_notes():
    txt = read_module_text()
    assert "prepareContext" in txt
    assert re.search(r"drawVesica\(ctx,", txt)
    assert re.search(r"drawTree\(ctx,", txt)
    assert re.search(r"drawFibonacci\(ctx,", txt)
    assert re.search(r"drawHelix\(ctx,", txt)
