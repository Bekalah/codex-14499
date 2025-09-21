# pytest-based tests for index.html
# Framework: pytest
# These tests validate structure and critical content of index.html as per PR diff.
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH_CANDIDATES = [
    ROOT / "index.html",
    ROOT / "public" / "index.html",
    ROOT / "static" / "index.html",
]

def _load_index_html():
    for p in INDEX_PATH_CANDIDATES:
        if p.exists():
            return p.read_text(encoding="utf-8"), str(p)
    # Fallback to fixture content if file not found; allows CI to still run validations against provided source.
    raise FileNotFoundError("index.html not found in expected locations: " + ", ".join(map(str, INDEX_PATH_CANDIDATES)))


def test_doctype_and_language():
    html, path = _load_index_html()
    assert html.lstrip().lower().startswith("<\!doctype html>"), f"Missing/incorrect doctype in {path}"
    assert re.search(r'<html[^>]*\blang=["\']en["\']', html, re.I), "html lang=en is required for a11y"

def test_head_meta_and_title_present():
    html, _ = _load_index_html()
    assert "<meta charset=" in html
    assert re.search(r'<title>\s*Cosmic Helix Renderer \(ND-safe, Offline\)\s*</title>', html), "Exact title per diff required"
    # viewport and color-scheme
    assert re.search(r'<meta\s+name=["\']viewport["\']\s+content=["\']width=device-width,initial-scale=1,viewport-fit=cover["\']', html)
    assert re.search(r'<meta\s+name=["\']color-scheme["\']\s+content=["\']light dark["\']', html)

def test_css_root_custom_properties_exist():
    html, _ = _load_index_html()
    # Verify --bg, --ink, --muted presence with expected hex colors (from diff)
    assert re.search(r'--bg:\s*#0b0b12\s*;', html)
    assert re.search(r'--ink:\s*#e8e8f0\s*;', html)
    assert re.search(r'--muted:\s*#a6a6c1\s*;', html)

def test_header_and_status_elements():
    html, _ = _load_index_html()
    assert re.search(r'<header>', html)
    assert re.search(r'id=["\']status["\']', html)
    assert re.search(r'class=["\']status["\']', html)
    # Initial loading text
    assert "Loading palette..." in html

def test_canvas_presence_and_attributes():
    html, _ = _load_index_html()
    # id, width, height, aria-label as specified in diff
    assert re.search(r'<canvas[^>]*\bid=["\']stage["\']', html)
    assert re.search(r'<canvas[^>]*\bwidth=["\']?1440["\']?', html)
    assert re.search(r'<canvas[^>]*\bheight=["\']?900["\']?', html)
    assert re.search(r'<canvas[^>]*\baria-label=["\']Layered sacred geometry canvas["\']', html)

def test_note_text_mentions_all_layers():
    html, _ = _load_index_html()
    note_re = re.compile(r'Static Vesica grid, Tree-of-Life scaffold, Fibonacci curve, and double-helix lattice', re.I)
    assert note_re.search(html), "The descriptive note should enumerate key layers per diff"

def test_module_script_and_import_present():
    html, _ = _load_index_html()
    # Ensure <script type="module"> and import path to helix-renderer.mjs
    assert re.search(r'<script[^>]*\btype=["\']module["\']', html)
    assert re.search(r'import\s*\{\s*renderHelix\s*\}\s*from\s*["\']\./js/helix-renderer\.mjs["\']\s*;', html)

def test_status_helper_and_loadjson_defined():
    html, _ = _load_index_html()
    assert re.search(r'function\s+setStatus\s*\(\s*text\s*\)\s*\{', html)
    # loadJSON async function with fetch and error handling
    assert re.search(r'async\s+function\s+loadJSON\s*\(\s*path\s*\)\s*\{', html)
    assert "fetch(path, { cache: \"no-store\" })" in html
    assert re.search(r'return\s+null\s*;\s*\}\s*$', html, re.M), "loadJSON should return null in catch per ND-safe comment"

def test_fallback_palette_object_and_properties():
    html, _ = _load_index_html()
    # Verify FALLBACK structure and colors match diff
    assert re.search(r'const\s+FALLBACK\s*=\s*\{\s*palette:\s*\{', html)
    assert re.search(r'bg:\s*"#0b0b12"', html)
    assert re.search(r'ink:\s*"#e8e8f0"', html)
    # Array of layers includes specific hexes
    for hex_color in ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]:
        assert hex_color in html, f"Missing fallback layer color {hex_color}"

def test_palette_resolution_logic_and_status_message_texts_present():
    html, _ = _load_index_html()
    # Ensure code references paletteData, activePalette with nullish coalescing, and status strings
    assert re.search(r'const\s+paletteData\s*=\s*await\s+loadJSON\(\s*["\']\./data/palette\.json["\']\s*\)\s*;', html)
    assert re.search(r'const\s+activePalette\s*=\s*paletteData\s*\?\?\s*FALLBACK\.palette\s*;', html)
    assert re.search(r'const\s+statusMessage\s*=\s*paletteData\s*\?\s*["\']Palette loaded\.["\']\s*:\s*["\']Palette missing; using safe fallback\.["\']\s*;', html)

def test_css_custom_properties_synced_from_active_palette():
    html, _ = _load_index_html()
    # rootStyle.setProperty calls for --bg, --ink, --muted
    assert re.search(r'rootStyle\.setProperty\(\s*["\']--bg["\']\s*,\s*activePalette\.bg\s*\)\s*;', html)
    assert re.search(r'rootStyle\.setProperty\(\s*["\']--ink["\']\s*,\s*activePalette\.ink\s*\)\s*;', html)
    assert re.search(r'rootStyle\.setProperty\(\s*["\']--muted["\']\s*,\s*["\']#a6a6c1["\']\s*\)\s*;', html)

def test_numerology_constants_defined_exactly():
    html, _ = _load_index_html()
    constants = {
        "THREE": 3, "SEVEN": 7, "NINE": 9, "ELEVEN": 11,
        "TWENTYTWO": 22, "THIRTYTHREE": 33, "NINETYNINE": 99, "ONEFORTYFOUR": 144
    }
    for name, val in constants.items():
        assert re.search(rf'\\b{name}\\b\\s*:\\s*{val}\\s*,?', html), f"NUM.{name} should equal {val}"

def test_rendering_invocation_and_ctx_guard_present():
    html, _ = _load_index_html()
    # Guard when ctx is falsy
    assert re.search(r'if\s*\(\s*\!\s*ctx\s*\)\s*\{', html)
    # renderHelix invocation with expected object properties
    call_pattern = re.compile(
        r'renderHelix\\(\\s*ctx\\s*,\\s*\\{[^}]*\\bwidth\\s*:\\s*canvas\\.width\\b[^}]*\\bheight\\s*:\\s*canvas\\.height\\b[^}]*\\bpalette\\s*:\\s*activePalette\\b[^}]*\\bNUM\\b[^}]*\\}\\s*\\)\\s*;',
        re.S
    )
    assert call_pattern.search(html), "renderHelix(ctx, { width, height, palette, NUM }) call missing or malformed"

def test_accessibility_and_nd_safe_comments_present():
    html, _ = _load_index_html()
    assert "ND-safe" in html, "Expect ND-safe commentary present"
    # aria-label is already tested; verify presence of comments describing a11y/ND safety
    assert re.search(r'ND-safe styling', html)
    assert re.search(r'Offline-first ND safety', html)
    assert re.search(r'ND-safe shell', html)
    assert re.search(r'ND-safe rationale', html)
