# ==========================================================================
# PAPKA VA FAYL: 7_Sertifikat_Tekshirish_Bulimi/Sertifikat_tekshirish_moduli.py
# VAZIFASI: 7-Modul (Sertifikat Haqiqiyligini Tekshirish) uchun Python backend mantiqi.
# ==========================================================================

from typing import Dict, Any, List, Optional


def sertifikat_id_boyicha_qidirish(
    reestr: List[Dict[str, Any]],
    sorov: str
) -> Optional[Dict[str, Any]]:
    """
    Sertifikat ID yoki nomzodning ism-familiyasi bo'yicha reestrdan qidiradi.
    """
    q = (sorov or "").strip().lower()
    if not q:
        return None
    for s in reestr:
        s_id = str(s.get("sertifikatId", "")).lower()
        ism = str(s.get("ismFamiliya", "")).lower()
        if s_id == q or q in ism:
            return s
    return None
