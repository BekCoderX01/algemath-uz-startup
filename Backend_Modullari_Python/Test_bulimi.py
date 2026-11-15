# ==========================================================================
# FAYL NOMI: Backend_Modullari_Python/Test_bulimi.py
# VAZIFASI: O'quvchilar va Ustozlar uchun tanlangan darajaga (C, C+, B, B+, A, A+)
#           qarab test savollarini saralash, javoblarni tekshirish va
#           0 dan o'rganish bo'limidagi 10 talik testlar uchun aniq javobsiz
#           "Yordam / Memory" tushuntirishlarini qaytarish moduli.
# ==========================================================================

from typing import List, Dict, Any

RUXSAT_ETILGAN_DARAJALAR = ["C", "C+", "B", "B+", "A", "A+"]
RUXSAT_ETILGAN_ROLLAR = ["O'quvchi", "Ustoz", "Admin"]


def daraja_testlarini_saralash(
    barcha_savollar: List[Dict[str, Any]],
    rol: str = "O'quvchi",
    daraja: str = "B"
) -> List[Dict[str, Any]]:
    """
    O'quvchi yoki Ustoz tanlagan darajaga mos keladigan testlarni qaytaradi.
    """
    if daraja not in RUXSAT_ETILGAN_DARAJALAR:
        daraja = "B"
    if rol not in RUXSAT_ETILGAN_ROLLAR:
        rol = "O'quvchi"

    mos_savollar = [
        s for s in barcha_savollar
        if s.get("daraja", daraja) == daraja
    ]
    return mos_savollar


def test_natijasini_tekshirish(
    savollar: List[Dict[str, Any]],
    foydalanuvchi_javoblari: Dict[str, int]
) -> Dict[str, Any]:
    """
    Berilgan savollar ro'yxati va foydalanuvchi javoblarini solishtirib,
    to'g'ri javoblar soni va foiz ko'rsatkichini hisoblaydi.
    """
    jami = len(savollar)
    if jami == 0:
        return {"togri_soni": 0, "jami_soni": 0, "foiz": 0.0}

    togri = 0
    for savol in savollar:
        s_id = str(savol.get("id"))
        if s_id in foydalanuvchi_javoblari:
            if foydalanuvchi_javoblari[s_id] == savol.get("togriIndex"):
                togri += 1

    foiz = round((togri / jami) * 100, 1)
    return {
        "togri_soni": togri,
        "jami_soni": jami,
        "foiz": foiz
    }
