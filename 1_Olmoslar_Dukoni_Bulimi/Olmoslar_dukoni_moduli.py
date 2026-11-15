# ==========================================================================
# PAPKA VA FAYL: 1_Olmoslar_Dukoni_Bulimi/Olmoslar_dukoni_moduli.py
# VAZIFASI: 1-Modul (Olmoslar Do'koni) uchun Python backend mantiqi.
# ==========================================================================

from typing import Dict, Any

DUKON_KATALOGI = {
    "item_pdf_qkf_viyet": {"nomi": "100 ta Oltin Algebra Formulasi", "narx": 15},
    "item_pdf_aplus_sirlari": {"nomi": "A+ Milliy Sertifikat Yechimlari", "narx": 30},
    "item_title_xorazmiy": {"nomi": "Unvon: Al-Xorazmiy izdoshi", "narx": 20},
    "item_title_aplus_king": {"nomi": "Unvon: A+ Milliy Sertifikat Qiroli", "narx": 45},
    "item_frame_gold": {"nomi": "Oltin Akademik Profil Ramkasi", "narx": 25},
    "item_frame_diamond": {"nomi": "Zumrad-Olmos Chempion Ramkasi", "narx": 40}
}


def mahsulot_xarid_qilish(foydalanuvchi: Dict[str, Any], mahsulot_id: str) -> Dict[str, Any]:
    """
    Foydalanuvchining olmos balansini tekshirib, mahsulotni xarid qiladi.
    """
    if mahsulot_id not in DUKON_KATALOGI:
        return {"muvaffaqiyat": False, "xabar": "Mahsulot topilmadi"}

    xaridlar = foydalanuvchi.setdefault("xaridlar", [])
    if mahsulot_id in xaridlar:
        return {"muvaffaqiyat": True, "allaqachon_bor": True, "qolgan_olmos": foydalanuvchi.get("olmoslar", 0)}

    narx = DUKON_KATALOGI[mahsulot_id]["narx"]
    balans = int(foydalanuvchi.get("olmoslar", 0))
    if balans < narx:
        return {"muvaffaqiyat": False, "xabar": "Olmoslar yetarli emas"}

    foydalanuvchi["olmoslar"] = balans - narx
    xaridlar.append(mahsulot_id)
    return {
        "muvaffaqiyat": True,
        "allaqachon_bor": False,
        "qolgan_olmos": foydalanuvchi["olmoslar"],
        "mahsulot": DUKON_KATALOGI[mahsulot_id]["nomi"]
    }
