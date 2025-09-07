#!/usr/bin/env python3
"""
dedup.py - scan for consecutive duplicate lines and optionally fix them.
ND-safe: plain text output, no network, deterministic.
Use --fix to remove duplicates in-place.
"""

import sys
from pathlib import Path

# watch simple text formats only
TEXT_EXT = {".js", ".mjs", ".html", ".json", ".md", ".py", ".txt"}
SKIP = {".git", "node_modules", "__pycache__"}

def iter_text_files(root):
    """Yield text files under root, skipping excluded dirs."""
    for path in Path(root).rglob("*"):
        if path.is_file() and path.suffix in TEXT_EXT and not any(part in SKIP for part in path.parts):
            yield path

def dedup_file(path, fix=False):
    """Return list of (line_no, text) duplicates; remove if fix."""
    lines = path.read_text(encoding="utf-8").splitlines()
    new_lines = []
    dups = []
    prev = None
    for no, line in enumerate(lines, 1):
        if line == prev and line.strip():
            dups.append((no, line))
            if not fix:
                new_lines.append(line)
        else:
            new_lines.append(line)
        prev = line
    if fix and dups:
        path.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
    return dups

def main():
    fix = "--fix" in sys.argv
    root = Path(__file__).resolve().parents[1]
    any_dups = False
    for file in iter_text_files(root):
        dups = dedup_file(file, fix)
        if dups:
            any_dups = True
            print(f"{file}:")
            for no, text in dups:
                print(f"  dup line {no}: {text}")
    if not any_dups:
        print("No duplicate lines found.")

if __name__ == "__main__":
    main()
