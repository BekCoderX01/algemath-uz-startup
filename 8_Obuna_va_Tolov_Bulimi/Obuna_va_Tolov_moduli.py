# ==========================================================================
# PAPKA VA FAYL: 8_Obuna_va_Tolov_Bulimi/Obuna_va_Tolov_moduli.py
# VAZIFASI: 8-Modul (PRO Obuna va To'lov Tizimi: Click, Payme, Uzum, Olmos)
#           uchun Python backend mantiqi.
# ==========================================================================

from typing import Dict, Any

TARIFLAR = {
    "plan_free": {"nomi": "Bepul", "narx_olmos": 0, "bonus_olmos": 0},
    "plan_student_pro": {"nomi": "O'quvchi PRO", "narx_olmos": 120, "bonus_olmos": 50},
    "plan_teacher_pro": {"nomi": "Ustoz Ekspert PRO", "narx_olmos": 200, "bonus_olmos": 100}
}


def obunani_faollashtirish(
    foydalanuvchi: Dict[str, Any],
    tarif_id: str,
    tolov_usuli: str = "Click"
) -> Dict[str, Any]:
    """
    Click, Payme, Uzum yoki Olmoslar orqali PRO tarifni faollashtiradi.
    """
    if tarif_id not in TARIFLAR:
        return {"muvaffaqiyat": False, "xabar": "Tarif topilmadi"}

    t = TARIFLAR[tarif_id]
    balans = int(foydalanuvchi.get("olmoslar", 0))

    if tolov_usuli == "Olmos" and t["narx_olmos"] > 0:
        if balans < t["narx_olmos"]:
            return {"muvaffaqiyat": False, "xabar": "Olmoslar yetarli emas"}
        foydalanuvchi["olmoslar"] = balans - t["narx_olmos"]
    else:
        foydalanuvchi["olmoslar"] = balans + t["bonus_olmos"]

    foydalanuvchi["obunaTarifi"] = t["nomi"]
    return {
        "muvaffaqiyat": True,
        "tarif": t["nomi"],
        "tolov_usuli": tolov_usuli,
        "olmoslar": foydalanuvchi["olmoslar"]
    }
