"""
Tests for README_RENDERER.md content and referenced artifacts.

Focus:
- Validate headings, sections, and specific statements introduced/changed in the PR diff.
- Verify key claims (offline, ND-safe, numerology anchors, palette fallback).
- Sanity-check referenced files when present.

Testing framework: pytest
"""

import re
import json
from pathlib import Path
import pytest

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README_RENDERER.md"


@pytest.fixture(scope="session")
def readme_text() -> str:
    assert README.exists(), "README_RENDERER.md must exist at repo root"
    text = README.read_text(encoding="utf-8")
    assert text.strip(), "README_RENDERER.md is empty"
    return text


def get_section(text: str, header: str) -> str:
    # Capture the section content until the next H2 or EOF
    pat = rf"(?ms)^##\s+{re.escape(header)}\s*\n(.*?)(?=^\s*##\s+|\Z)"
    m = re.search(pat, text)
    assert m, f"Section '{header}' not found in README_RENDERER.md"
    return m.group(1)


def test_title_and_tagline(readme_text):
    assert "# Cosmic Helix Renderer" in readme_text
    assert "Static offline HTML5 canvas renderer" in readme_text
    assert "Codex 144:99" in readme_text


@pytest.mark.parametrize("header", [
    "Files",
    "Layer Stack",
    "Numerology Anchors",
    "Palette and Fallback",
    "ND-safe Design Choices",
    "Offline Use",
])
def test_required_headers_present(readme_text, header):
    assert f"## {header}" in readme_text


def test_files_section_details(readme_text):
    sec = get_section(readme_text, "Files")
    # File bullets
    assert "`index.html`" in sec and "1440x900" in sec and "palette loader" in sec
    assert "`js/helix-renderer.mjs`" in sec and "ES module" in sec and "renderHelix" in sec
    assert "`data/palette.json`" in sec and "palette override" in sec
    assert "`README_RENDERER.md`" in sec and "usage and safety guide" in sec


def test_layer_stack_numbering_and_keywords(readme_text):
    sec = get_section(readme_text, "Layer Stack")
    # Ensure numbered 1..4 and key phrases
    assert "1." in sec and "Vesica field" in sec and "intersecting circles" in sec
    assert "2." in sec and "Tree-of-Life scaffold" in sec and "sephirot" in sec
    assert "3." in sec and "Fibonacci curve" in sec and "golden spiral" in sec
    assert "4." in sec and "Double-helix lattice" in sec and "crossbars" in sec


def test_numerology_constants_listed(readme_text):
    sec = get_section(readme_text, "Numerology Anchors")
    for c in [3, 7, 9, 11, 22, 33, 99, 144]:
        assert str(c) in sec, f"Missing sacred constant {c} in Numerology Anchors"


def test_palette_and_fallback_guidance(readme_text):
    sec = get_section(readme_text, "Palette and Fallback")
    assert "data/palette.json" in sec
    assert "fallback palette" in sec.lower()
    assert "WCAG AA" in sec
    # mention background, ink, and six layer colors
    assert "background" in sec.lower() and "ink" in sec.lower()
    assert "six layer colors" in sec.lower()


def test_nd_safe_design_choices(readme_text):
    sec = get_section(readme_text, "ND-safe Design Choices")
    assert "No animation, flashing, or autoplay" in sec
    assert "renders once on load" in sec
    assert "Calm contrast" in sec or "readable typography" in sec
    assert "Pure functions" in sec
    assert "trauma-informed" in readme_text.lower()


def test_offline_use_steps_and_browsers(readme_text):
    sec = get_section(readme_text, "Offline Use")
    for n in ["1.", "2.", "3.", "4."]:
        assert n in sec, f"Missing numbered step {n} in Offline Use"
    # Check browser mentions and file:// context
    for browser in ["Chromium", "Firefox", "WebKit"]:
        assert browser in sec
    assert "file://" in sec or "file:// contexts" in sec


def test_canvas_dimensions_claim_present(readme_text):
    assert "1440x900" in readme_text


def test_inline_code_backticks_for_paths(readme_text):
    # Verify key inline code path formatting
    for frag in ["index.html", "data/palette.json", "js/", "data/"]:
        assert f"`{frag}" in readme_text, f"Expected inline code formatting for {frag}"


def test_referenced_files_when_present():
    # These files exist in this repo; validate basic properties without over-constraining
    index_html = ROOT / "index.html"
    renderer_mjs = ROOT / "js" / "helix-renderer.mjs"
    # palette.json is optional per README; only validate if present
    assert index_html.exists(), "index.html should exist at repo root"
    assert renderer_mjs.exists(), "js/helix-renderer.mjs should exist"

    # index.html sanity checks
    html = index_html.read_text(encoding="utf-8").lower()
    assert "<canvas" in html, "index.html should include a canvas element"
    # Encourage relative module usage
    assert "js/helix-renderer.mjs" in html or "type=\"module\"" in html, \
        "index.html should reference helix-renderer.mjs as module"

    # renderer module export check (lightweight)
    js = renderer_mjs.read_text(encoding="utf-8")
    assert "export " in js, "helix-renderer.mjs should use ES module exports"
    assert re.search(r"export\s+(?:function|const|default)\s+renderHelix", js) or "renderHelix" in js, \
        "renderHelix export should be present"

    # Optional palette.json schema
    palette_json = ROOT / "data" / "palette.json"
    if palette_json.exists():
        data = json.loads(palette_json.read_text(encoding="utf-8"))
        # Required keys
        for key in ["background", "ink"]:
            assert key in data, f"palette.json missing '{key}'"
        # Expect 6 additional layer colors (names are project-defined; only count)
        other_keys = [k for k in data.keys() if k not in {"background", "ink"}]
        assert len(other_keys) == 6, f"Expected 6 layer colors, found {len(other_keys)}"
        # Hex color format
        for k, v in data.items():
            assert isinstance(v, str) and re.fullmatch(r"#[0-9A-Fa-f]{6}", v), f"Invalid hex color for {k}: {v}"


def test_no_remote_dependencies_in_index_html():
    # Offline use implies no network URLs in the HTML shell
    index_html = ROOT / "index.html"
    html = index_html.read_text(encoding="utf-8")
    # Allow README/documentation links in comments, but the HTML shell should not require network at runtime
    assert "http://" not in html and "https://" not in html, \
        "index.html should avoid remote URLs to support offline use"


def test_readme_has_no_raw_html_tags(readme_text):
    # Ensure markdown purity (no embedded HTML tags)
    tags = re.findall(r"<[^>]+>", readme_text)
    # Allow nothing for now (tighten to catch regressions)
    assert len(tags) == 0, f"Unexpected HTML tags found in README: {tags[:3]}"


@pytest.mark.parametrize("phrase", [
    "vesica", "sephirot", "fibonacci", "double-helix"
])
def test_domain_terms_present(readme_text, phrase):
    assert phrase.lower() in readme_text.lower()


def test_relative_imports_guidance_present(readme_text):
    # Validate guidance text on relative imports
    assert "relative imports" in readme_text or "relative imports resolve" in readme_text


def test_claims_about_dependencies_and_workflows(readme_text):
    # Confirm the explicit claims in the diff
    lower = readme_text.lower()
    assert "no workflows" in lower
    assert "no dependencies" in lower
    assert "no background services" in lower