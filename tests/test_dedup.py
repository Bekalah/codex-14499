
from pathlib import Path
import sys


def load():
    root = Path(__file__).resolve().parents[1]
    sys.path.append(str(root / 'scripts'))
    from dedup import dedup_file
    return dedup_file


def test_dedup_file(tmp_path):
    dedup_file = load()
    p = tmp_path / 'sample.txt'
    p.write_text('a\na\nb\nb\n', encoding='utf-8')
    dups = dedup_file(p, fix=True)
    assert dups == [(2, 'a'), (4, 'b')]
    assert p.read_text(encoding='utf-8') == 'a\nb\n'
