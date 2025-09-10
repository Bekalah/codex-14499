"""
color_utils.py
Pure color space conversions, ND-safe, offline.
All functions are small and side-effect free.
"""

from typing import Tuple


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    """Clamp value into [low, high]."""
    return max(low, min(high, value))


def ycocg_to_rgb(y: float, co: float, cg: float) -> Tuple[float, float, float]:
    """Convert yCoCg to RGB (all components expected in 0..1)."""
    r = clamp(y + co - cg)
    g = clamp(y + cg)
    b = clamp(y - co - cg)
    return r, g, b


def ycocg_to_hsl(y: float, co: float, cg: float) -> Tuple[float, float, float]:
    """Convert yCoCg to HSL while preserving luminance."""
    r, g, b = ycocg_to_rgb(y, co, cg)
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    delta = max_c - min_c

    if delta == 0:
        h = 0.0
    elif max_c == r:
        h = ((g - b) / delta) % 6
    elif max_c == g:
        h = (b - r) / delta + 2
    else:
        h = (r - g) / delta + 4
    h /= 6

    l = clamp(y)
    denom = 1 - abs(2 * l - 1)
    s = 0.0 if delta == 0 or denom == 0 else clamp(delta / denom)
    return h, s, l
