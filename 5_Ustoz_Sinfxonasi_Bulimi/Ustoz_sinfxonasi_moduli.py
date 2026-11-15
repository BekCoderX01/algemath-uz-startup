# ==========================================================================
# PAPKA VA FAYL: 5_Ustoz_Sinfxonasi_Bulimi/Ustoz_sinfxonasi_moduli.py
# VAZIFASI: 5-Modul (Ustoz Sinfxonasi va Uyga Vazifa) uchun Python backend mantiqi.
# ==========================================================================

from typing import Dict, Any, List


def sinfxona_yaratish(sinf_kodi: str, sinf_nomi: str, ustoz_ismi: str, daraja: str = "B+") -> Dict[str, Any]:
    """
    Ustoz uchun 6 xonali sinf kodi bilan yangi guruh yaratadi.
    """
    return {
        "sinfKodi": sinf_kodi.strip().upper(),
        "sinfNomi": sinf_nomi.strip(),
        "ustozIsmi": ustoz_ismi.strip(),
        "daraja": daraja,
        "oquvchilarNatijalari": []
    }


def sinfga_oquvchi_qoshish(sinfxona: Dict[str, Any], oquvchi_ism_familiya: str) -> bool:
    """
    O'quvchini sinfxona ro'yxatiga qo'shadi.
    """
    royxat: List[Dict[str, Any]] = sinfxona.setdefault("oquvchilarNatijalari", [])
    if not any(o.get("ismFamiliya") == oquvchi_ism_familiya for o in royxat):
        royxat.append({"ismFamiliya": oquvchi_ism_familiya, "holat": "Kutilmoqda", "ball": "—"})
        return True
    return False
