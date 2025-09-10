import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from color_utils import ycocg_to_hsl


def almost_equal(a, b, tol=1e-6):
    return abs(a - b) <= tol


def test_gray_luminance_preserved():
    h, s, l = ycocg_to_hsl(0.5, 0.0, 0.0)
    assert almost_equal(h, 0.0)
    assert almost_equal(s, 0.0)
    assert almost_equal(l, 0.5)


def test_black_and_white():
    hb, sb, lb = ycocg_to_hsl(0.0, 0.0, 0.0)
    hw, sw, lw = ycocg_to_hsl(1.0, 0.0, 0.0)
    assert (hb, sb, lb) == (0.0, 0.0, 0.0)
    assert (hw, sw, lw) == (0.0, 0.0, 1.0)


def test_primary_red_and_blue():
    h_red, s_red, l_red = ycocg_to_hsl(0.25, 0.5, -0.25)
    h_blue, s_blue, l_blue = ycocg_to_hsl(0.25, -0.5, -0.25)
    assert almost_equal(h_red, 0.0)
    assert almost_equal(s_red, 1.0)
    assert almost_equal(l_red, 0.25)
    assert almost_equal(h_blue, 2/3)
    assert almost_equal(s_blue, 1.0)
    assert almost_equal(l_blue, 0.25)


def test_random_color_luminance_clamped():
    h, s, l = ycocg_to_hsl(1.2, 0.1, -0.05)
    assert 0.0 <= h <= 1.0
    assert 0.0 <= s <= 1.0
    assert l == 1.0
