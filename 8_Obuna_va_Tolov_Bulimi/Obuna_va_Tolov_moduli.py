# ==========================================================================
# PAPKA VA FAYL: 8_Obuna_va_Tolov_Bulimi/Obuna_va_Tolov_moduli.py
# VAZIFASI: 8-Modul (PRO Obuna va To'lov Tizimi: Click, Payme, Uzum, Olmos)
#           uchun Python backend mantiqi.
#           To'lov tasdiqlanmasdan pullik PRO tarifga o'tib bo'lmaydi.
# ==========================================================================

from typing import Dict, Any, Optional

TARIFLAR = {
    "plan_free": {"nomi": "Bepul", "narx_olmos": 0, "bonus_olmos": 0},
    "plan_student_pro": {"nomi": "O'quvchi PRO", "narx_olmos": 120, "bonus_olmos": 50},
    "plan_teacher_pro": {"nomi": "Ustoz Ekspert PRO", "narx_olmos": 200, "bonus_olmos": 100}
}


def obunani_faollashtirish(
    foydalanuvchi: Dict[str, Any],
    tarif_id: str,
    tolov_usuli: str = "Click",
    tolov_tasdigi: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Click, Payme, Uzum yoki Olmoslar orqali PRO tarifni faollashtiradi.
    Pullik tariflar uchun tasdiqlangan to'lov isboti (tolandi=True va
    kamida 6 belgili tranzaksiya_id) talab qilinadi.
    """
    if tarif_id not in TARIFLAR:
        return {"muvaffaqiyat": False, "xabar": "Tarif topilmadi"}

    t = TARIFLAR[tarif_id]
    balans = int(foydalanuvchi.get("olmoslar", 0))

    if tarif_id == "plan_free":
        foydalanuvchi["obunaTarifi"] = t["nomi"]
        return {
            "muvaffaqiyat": True,
            "tarif": t["nomi"],
            "tolov_usuli": "Bepul",
            "olmoslar": balans
        }

    if tolov_usuli == "Olmos":
        if balans < t["narx_olmos"]:
            return {"muvaffaqiyat": False, "tolov_kerak": True, "xabar": "Olmoslar yetarli emas"}
        foydalanuvchi["olmoslar"] = balans - t["narx_olmos"]
    else:
        tx_id = str((tolov_tasdigi or {}).get("tranzaksiya_id", "")).strip()
        tolandi = bool((tolov_tasdigi or {}).get("tolandi", False))
        if not tolandi or len(tx_id) < 6:
            return {
                "muvaffaqiyat": False,
                "tolov_kerak": True,
                "holat": "tolov_kutilmoqda",
                "xabar": "To'lov tasdiqlanmagan! Avval Click/Payme/Uzum orqali to'lovni bajaring."
            }
        foydalanuvchi["olmoslar"] = balans + t["bonus_olmos"]

    foydalanuvchi["obunaTarifi"] = t["nomi"]
    return {
        "muvaffaqiyat": True,
        "tarif": t["nomi"],
        "tolov_usuli": tolov_usuli,
        "olmoslar": foydalanuvchi["olmoslar"]
    }
