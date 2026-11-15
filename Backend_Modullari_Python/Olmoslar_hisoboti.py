# ==========================================================================
# FAYL NOMI: Backend_Modullari_Python/Olmoslar_hisoboti.py
# VAZIFASI: O'quvchi va ustozlarga har bir kirgan kuniga +5 tadan olmos (💎)
#           berish, testlarni yechgani va darslarni o'zlashtirgani uchun
#           adolatli olmos taqsimlash hamda kunlik ishlagan vaqtni hisoblash.
# ==========================================================================

from typing import Dict, Any

KUNLIK_KIRISH_OLMOSI = 5
DARS_OZLASHTIRISH_OLMOSI = 5

DARAJA_KOEFFITSIYENTLARI = {
    "C": 1.0,
    "C+": 1.2,
    "B": 1.5,
    "B+": 1.8,
    "A": 2.2,
    "A+": 3.0
}


def kunlik_olmos_bonusini_berish(
    foydalanuvchi: Dict[str, Any],
    bugungi_sana: str
) -> Dict[str, Any]:
    """
    Agar foydalanuvchi bugun hali kunlik bonus olmagan bo'lsa, +5 ta olmos qo'shadi.
    """
    oxirgi_sana = foydalanuvchi.get("oxirgiKunlikBonusSana", "")
    joriy_olmos = int(foydalanuvchi.get("olmoslar", 0))

    if oxirgi_sana != bugungi_sana:
        foydalanuvchi["oxirgiKunlikBonusSana"] = bugungi_sana
        foydalanuvchi["olmoslar"] = joriy_olmos + KUNLIK_KIRISH_OLMOSI
        return {"berildi": True, "qoshilgan": KUNLIK_KIRISH_OLMOSI, "jami": foydalanuvchi["olmoslar"]}

    return {"berildi": False, "qoshilgan": 0, "jami": joriy_olmos}


def adolatli_test_olmosini_hisoblash(
    togri_soni: int,
    jami_soni: int,
    daraja: str = "B"
) -> int:
    """
    Test darajasi va to'g'ri javoblar soniga qarab adolatli olmos miqdorini hisoblaydi.
    """
    togri_soni = max(0, int(togri_soni))
    jami_soni = max(0, int(jami_soni))
    if togri_soni == 0 or jami_soni == 0:
        return 0

    koeff = DARAJA_KOEFFITSIYENTLARI.get(daraja, 1.5)
    olmos = round(togri_soni * koeff)
    if togri_soni == jami_soni:
        olmos += 5  # 100% natija uchun mukammallik bonusi
    return int(olmos)


def kunlik_vaqtni_formatlash(sekundlar: int) -> str:
    """
    Sekundlarni 'X soat Y daqiqa' ko'rinishiga o'giradi.
    """
    sek = max(0, int(sekundlar))
    soat = sek // 3600
    daqiqa = (sek % 3600) // 60
    return f"{soat} soat {daqiqa} daqiqa"
