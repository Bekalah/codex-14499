import json
from pathlib import Path


def read_text(path):
    return Path(path).read_text(encoding="utf-8")


def test_palette_structure():
    data = json.loads(read_text("data/palette.json"))
    assert set(data.keys()) == {"bg", "ink", "layers"}
    assert len(data["layers"]) == 6
    assert all(color.startswith("#") for color in [data["bg"], data["ink"], *data["layers"]])


def test_geometry_structure():
    data = json.loads(read_text("data/geometry.json"))
    keys = {"THREE","SEVEN","NINE","ELEVEN","TWENTYTWO","THIRTYTHREE","NINETYNINE","ONEFORTYFOUR"}
    assert set(data.keys()) == keys


def test_index_references():
    txt = read_text("index.html")
    assert 'js/helix-renderer.mjs' in txt
    assert 'canvas id="stage"' in txt
    assert 'width="1440"' in txt and 'height="900"' in txt
    assert 'geometry.json' in txt


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


def test_palette_contrast():
    def hex_to_rgb(h):
        h = h.lstrip('#')
        return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))

    def luminance(rgb):
        def adj(c):
            return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
        r,g,b = map(adj, rgb)
        return 0.2126*r + 0.7152*g + 0.0722*b

    def contrast(a,b):
        l1,l2 = sorted([luminance(hex_to_rgb(a)), luminance(hex_to_rgb(b))])
        return (l2+0.05)/(l1+0.05)

    data = json.loads(read_text("data/palette.json"))
    bg = data["bg"]
    ink = data["ink"]
    layers = data["layers"]
    assert contrast(bg, ink) >= 7
    for layer in layers:
        assert contrast(bg, layer) >= 7
