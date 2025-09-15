
import json
from pathlib import Path

def read_text(path):
    return Path(path).read_text(encoding="utf-8")

def test_palette_structure():
    data = json.loads(read_text("data/palette.json"))
    assert set(data.keys()) == {"bg", "ink", "layers"}
    assert len(data["layers"]) == 6
    assert all(color.startswith("#") for color in [data["bg"], data["ink"], *data["layers"]])

def test_index_references():
    txt = read_text("index.html")
    assert 'js/helix-renderer.mjs' in txt
    assert 'canvas id="stage"' in txt
    assert 'width="1440"' in txt and 'height="900"' in txt

def test_js_functions_present():
    txt = read_text("js/helix-renderer.mjs")
    for name in ["drawVesica", "drawTree", "drawFibonacci", "drawHelix"]:
        assert f"function {name}" in txt

def test_numerology_constants_defined():
    txt = read_text("index.html")
    for constant in ["THREE", "SEVEN", "NINE", "ELEVEN", "TWENTYTWO", "THIRTYTHREE", "NINETYNINE", "ONEFORTYFOUR"]:
        assert constant in txt

def test_golden_ratio_comment_present():
    txt = read_text("js/helix-renderer.mjs")
    assert "Golden Ratio" in txt
