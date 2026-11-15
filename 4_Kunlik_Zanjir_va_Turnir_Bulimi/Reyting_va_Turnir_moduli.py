# ==========================================================================
# PAPKA VA FAYL: 4_Kunlik_Zanjir_va_Turnir_Bulimi/Reyting_va_Turnir_moduli.py
# VAZIFASI: 4-Modul (Kunlik Olovli Zanjir va Turnir) uchun Python backend mantiqi.
# ==========================================================================

from typing import Dict, Any, List


def kunlik_zanjirni_oshirish(foydalanuvchi: Dict[str, Any]) -> Dict[str, Any]:
    """
    Foydalanuvchining uzluksiz kunlar zanjirini (streak) +1 ga oshiradi va
    7 kunga yetganda +50 olmos super-bonus beradi.
    """
    joriy_zanjir = int(foydalanuvchi.get("kunlikZanjirSoni", 0)) + 1
    foydalanuvchi["kunlikZanjirSoni"] = joriy_zanjir
    bonus = 5
    if joriy_zanjir >= 7 and not foydalanuvchi.get("haftalikBonusOlindi", False):
        foydalanuvchi["haftalikBonusOlindi"] = True
        bonus = 50
    foydalanuvchi["olmoslar"] = int(foydalanuvchi.get("olmoslar", 0)) + bonus
    return {"zanjir_soni": joriy_zanjir, "bonus_olmos": bonus, "jami_olmos": foydalanuvchi["olmoslar"]}


def reytingni_saralash(foydalanuvchilar: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Foydalanuvchilarni olmoslar soni bo'yicha kamayish tartibida saralaydi.
    """
    return sorted(foydalanuvchilar, key=lambda u: int(u.get("olmoslar", 0)), reverse=True)
