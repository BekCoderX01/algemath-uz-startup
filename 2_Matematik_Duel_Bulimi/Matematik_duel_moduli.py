# ==========================================================================
# PAPKA VA FAYL: 2_Matematik_Duel_Bulimi/Matematik_duel_moduli.py
# VAZIFASI: 2-Modul (1 ga 1 Matematik Duel) uchun Python backend mantiqi.
# ==========================================================================

from typing import Dict, Any


def duel_natijasini_hisoblash(
    mening_ballim: int,
    raqib_balli: int,
    tikilgan_olmos: int
) -> Dict[str, Any]:
    """
    1v1 Duel natijasi va olmos o'zgarishini hisoblaydi.
    """
    tikilgan = max(5, int(tikilgan_olmos))
    if mening_ballim > raqib_balli:
        return {"natija": "G'alaba", "olmos_ozgarish": tikilgan, "hisob": f"{mening_ballim} : {raqib_balli}"}
    elif mening_ballim < raqib_balli:
        return {"natija": "Mag'lubiyat", "olmos_ozgarish": -(tikilgan // 2), "hisob": f"{mening_ballim} : {raqib_balli}"}
    return {"natija": "Durang", "olmos_ozgarish": 5, "hisob": f"{mening_ballim} : {raqib_balli}"}
