# ==========================================================================
# PAPKA VA FAYL: 3_Grafik_va_Formulalar_Bulimi/Grafik_tahlil_moduli.py
# VAZIFASI: 3-Modul (Grafik Chizuvchi) uchun kvadrat funksiyani tahlil qilish
#           Python moduli.
# ==========================================================================

import math
from typing import Dict, Any


def kvadrat_funksiyani_tahlil_qilish(a: float, b: float, c: float) -> Dict[str, Any]:
    """
    y = ax^2 + bx + c parabola uchi, diskriminanti va ildizlarini hisoblaydi.
    """
    if a == 0:
        ildiz = round(-c / b, 2) if b != 0 else None
        return {"tur": "Chiziqli", "diskriminant": None, "x0": 0.0, "y0": float(c), "ildizlar": [ildiz] if ildiz is not None else []}

    d = round(b * b - 4 * a * c, 2)
    x0 = round(-b / (2 * a), 2)
    y0 = round(a * x0 * x0 + b * x0 + c, 2)
    ildizlar = []
    if d > 0:
        x1 = round((-b - math.sqrt(d)) / (2 * a), 2)
        x2 = round((-b + math.sqrt(d)) / (2 * a), 2)
        ildizlar = sorted([x1, x2])
    elif d == 0:
        ildizlar = [x0]

    return {
        "tur": "Parabola",
        "diskriminant": d,
        "x0": x0,
        "y0": y0,
        "ildizlar": ildizlar
    }
