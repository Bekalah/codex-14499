import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


def load_html() -> str:
    assert INDEX.exists(), "index.html must exist at repo root"
    text = INDEX.read_text(encoding="utf-8")
    assert text.strip(), "index.html is empty"
    return text


def test_head_and_canvas_structure():
    html = load_html()
    assert html.lstrip().lower().startswith("<!doctype html>"), "doctype must be html"
    assert re.search(r"<html[^>]*\blang=['\"]en['\"]", html, re.I)
    assert re.search(r"<meta charset=", html)
    assert re.search(r"Cosmic Helix Renderer \(ND-safe, Offline\)", html)
    assert "width=\"1440\"" in html and "height=\"900\"" in html
    assert "aria-label=\"Layered sacred geometry canvas\"" in html


def test_css_variables_and_status():
    html = load_html()
    assert "--bg: #0b0b12" in html
    assert "--ink: #e8e8f0" in html
    assert "--muted: #a6a6c1" in html
    assert "Loading palette" in html
    assert "ND-safe styling" in html


def test_module_script_and_helpers():
    html = load_html()
    assert re.search(r"<script[^>]+type=\"module\"", html)
    assert "import { renderHelix } from \"./js/helix-renderer.mjs\"" in html
    assert re.search(r"function\s+setStatus\s*\(", html)
    assert re.search(r"async\s+function\s+loadJSON\s*\(", html)
    assert "fetch(path, { cache: \"no-store\" })" in html
    assert "Offline-first ND safety" in html


def test_fallback_palette_definition():
    html = load_html()
    assert "const FALLBACK" in html
    for color in ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]:
        assert color in html


def test_numerology_constants_and_render_call():
    html = load_html()
    for constant, value in [
        ("THREE", 3),
        ("SEVEN", 7),
        ("NINE", 9),
        ("ELEVEN", 11),
        ("TWENTYTWO", 22),
        ("THIRTYTHREE", 33),
        ("NINETYNINE", 99),
        ("ONEFORTYFOUR", 144),
    ]:
        assert re.search(rf"{constant}\s*:\s*{value}", html)
    assert re.search(r"renderHelix\(\s*ctx\s*,\s*\{[^}]*palette: activePalette[^}]*NUM[^}]*\}\s*\)", html)


def test_note_mentions_all_layers():
    html = load_html()
    assert "Vesica" in html
    assert "Tree-of-Life" in html
    assert "Fibonacci" in html
    assert "double-helix" in html


def test_offline_shell_has_no_http_links():
    html = load_html()
    assert "http://" not in html and "https://" not in html
