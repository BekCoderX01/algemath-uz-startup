# ==========================================================================
# FAYL NOMI: Backend_Modullari_Python/Sertifikat_baholash_tizimi.py
# VAZIFASI: O'zbekiston Milliy Sertifikat tizimi bo'yicha 45 talik matematik
#           imtihonni (15 ta oson, 15 ta o'rtacha, 15 ta qiyin) baholash va
#           A+, A, B+, B, C+, C darajalarini belgilash moduli.
# ==========================================================================

from typing import Dict, Any


def nomzod_ism_familiyasini_tekshirish(ism: str, familiya: str) -> bool:
    """
    Sertifikat testini boshlashdan oldin Ism va Familiya kiritilganligini tekshiradi.
    """
    if not isinstance(ism, str) or not isinstance(familiya, str):
        return False
    return len(ism.strip()) >= 2 and len(familiya.strip()) >= 2


def milliy_sertifikat_darajasini_hisoblash(
    oson_togri: int,
    ortacha_togri: int,
    qiyin_togri: int
) -> Dict[str, Any]:
    """
    45 talik test natijasi bo'yicha (15 ta oson, 15 ta o'rtacha, 15 ta qiyin)
    Milliy Sertifikat darajasini (A+, A, B+, B, C+, C) aniqlaydi.
    """
    oson_togri = max(0, min(15, int(oson_togri)))
    ortacha_togri = max(0, min(15, int(ortacha_togri)))
    qiyin_togri = max(0, min(15, int(qiyin_togri)))

    togri_soni = oson_togri + ortacha_togri + qiyin_togri
    foiz = round((togri_soni / 45.0) * 100.0, 1)
    jami_ball = round(oson_togri * 1.5 + ortacha_togri * 2.2 + qiyin_togri * 2.9667, 1)

    if foiz >= 86 or togri_soni >= 39:
        daraja = "A+"
        otgan = True
        olmos = 100
    elif foiz >= 78 or togri_soni >= 35:
        daraja = "A"
        otgan = True
        olmos = 70
    elif foiz >= 70 or togri_soni >= 31:
        daraja = "B+"
        otgan = True
        olmos = 50
    elif foiz >= 60 or togri_soni >= 27:
        daraja = "B"
        otgan = True
        olmos = 35
    elif foiz >= 55 or togri_soni >= 25:
        daraja = "C+"
        otgan = True
        olmos = 25
    elif foiz >= 46 or togri_soni >= 21:
        daraja = "C"
        otgan = True
        olmos = 15
    else:
        daraja = "Sertifikat berilmadi"
        otgan = False
        olmos = 5

    return {
        "daraja": daraja,
        "otgan": otgan,
        "togri_soni": togri_soni,
        "jami_savol": 45,
        "oson_togri": oson_togri,
        "ortacha_togri": ortacha_togri,
        "qiyin_togri": qiyin_togri,
        "foiz": foiz,
        "jami_ball": jami_ball,
        "olmos_mukofoti": olmos
    }
