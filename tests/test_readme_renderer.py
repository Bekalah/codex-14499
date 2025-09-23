import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README_RENDERER.md"


def read_readme() -> str:
    assert README.exists(), "README_RENDERER.md must exist"
    text = README.read_text(encoding="utf-8")
    assert text.strip(), "README_RENDERER.md is empty"
    return text


def extract_section(text: str, header: str) -> str:
    pattern = rf"(?ms)^##\s+{re.escape(header)}\s*\n(.*?)(?=^##\s+|\Z)"
    match = re.search(pattern, text)
    assert match, f"Section '{header}' not found"
    return match.group(1)


def test_title_and_intro():
    text = read_readme()
    assert text.startswith("# Cosmic Helix Renderer")
    assert "Static offline HTML5 canvas renderer" in text
    assert "Codex 144:99" in text


def test_required_sections_present():
    text = read_readme()
    for header in [
        "Files",
        "Layer Stack",
        "Numerology Anchors",
        "Palette and Fallback",
        "ND-safe Design Choices",
        "Offline Use",
        "Data Export",
    ]:
        assert f"## {header}" in text


def test_files_section_details():
    text = read_readme()
    section = extract_section(text, "Files")
    assert "`index.html`" in section and "1440x900" in section
    assert "`js/helix-renderer.mjs`" in section and "renderHelix" in section
    assert "`data/palette.json`" in section and "palette" in section
    assert "`dist/codex.min.json`" in section


def test_layer_stack_terms():
    section = extract_section(read_readme(), "Layer Stack")
    assert "Vesica" in section
    assert "Tree-of-Life" in section
    assert "Fibonacci" in section
    assert "Double-helix" in section


def test_numerology_constants_listed():
    section = extract_section(read_readme(), "Numerology Anchors")
    for number in [3, 7, 9, 11, 22, 33, 99, 144]:
        assert str(number) in section


def test_palette_guidance():
    section = extract_section(read_readme(), "Palette and Fallback")
    assert "data/palette.json" in section
    assert "fallback" in section.lower()
    assert "file://" in section
    assert "WCAG" in section


def test_nd_safe_commitments():
    section = extract_section(read_readme(), "ND-safe Design Choices")
    assert "No animation" in section
    assert "renders once" in section
    assert "Pure functions" in section
    assert "trauma-informed" in section.lower() or "trauma-informed" in read_readme().lower()
    assert "14 s" in section or "14" in section and "min" in section.lower()


def test_offline_use_steps():
    section = extract_section(read_readme(), "Offline Use")
    for step in ["1.", "2.", "3.", "4."]:
        assert step in section
    for browser in ["Chromium", "Firefox", "WebKit"]:
        assert browser in section


def test_data_export_mentions_validator():
    section = extract_section(read_readme(), "Data Export")
    assert "dist/codex.min.json" in section
    assert "scripts/build-codex.mjs" in section
    assert "scripts/validate_codex.py" in section
    assert "minSweepSec" in section


def test_no_html_tags():
    text = read_readme()
    assert not re.search(r"<[^>]+>", text)
