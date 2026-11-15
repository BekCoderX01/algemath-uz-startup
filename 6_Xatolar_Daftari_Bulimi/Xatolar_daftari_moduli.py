# ==========================================================================
# PAPKA VA FAYL: 6_Xatolar_Daftari_Bulimi/Xatolar_daftari_moduli.py
# VAZIFASI: 6-Modul (Xatolar Daftari) uchun Python backend mantiqi.
# ==========================================================================

from typing import Dict, Any


def xatoni_tuzatish(xato_yozuvi: Dict[str, Any], tanlangan_index: int) -> Dict[str, Any]:
    """
    O'quvchining xatolar daftaridagi savolga bergan yangi javobini tekshiradi.
    To'g'ri bo'lsa +3 olmos beradi.
    """
    if int(tanlangan_index) == int(xato_yozuvi.get("togriIndex", 0)):
        oldin_tuzatilgan = bool(xato_yozuvi.get("tuzatildi", False))
        xato_yozuvi["tuzatildi"] = True
        return {"togri": True, "olmos_mukofoti": 0 if oldin_tuzatilgan else 3}
    return {"togri": False, "olmos_mukofoti": 0}
