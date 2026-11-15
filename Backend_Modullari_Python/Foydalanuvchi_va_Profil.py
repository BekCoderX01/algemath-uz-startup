# ==========================================================================
# FAYL NOMI: Backend_Modullari_Python/Foydalanuvchi_va_Profil.py
# VAZIFASI: Telefon raqam, Google, Email va Instagram orqali kirish,
#           shaxsiy profilni (Rasm, BIO, Erkak/Ayol jinsi) boshqarish hamda
#           Tungi/Kunduzgi rejim va 3 til (O'zbek 🇺🇿, Rus 🇷🇺, Ingliz 🇺🇸)
#           sozlamalarini tekshirish moduli.
# ==========================================================================

from typing import Dict, Any

RUXSAT_ETILGAN_KIRISH_USULLARI = ["telefon", "google", "email", "instagram"]
RUXSAT_ETILGAN_JINSLAR = ["Erkak", "Ayol"]
RUXSAT_ETILGAN_TILLAR = {
    "uz": {"nomi": "O'zbek tili", "bayroq": "🇺🇿 O'zbekiston bayrog'i"},
    "ru": {"nomi": "Русский язык", "bayroq": "🇷🇺 Флаг России"},
    "en": {"nomi": "English (USA)", "bayroq": "🇺🇸 Amerika (AQSh) bayrog'i"}
}


def profil_sozlamalarini_yangilash(
    profil: Dict[str, Any],
    ism: str,
    familiya: str,
    jins: str,
    bio: str,
    rasm_url: str = ""
) -> Dict[str, Any]:
    """
    Foydalanuvchi profilini (Ism, Familiya, Erkak/Ayol jinsi, BIO, Rasm) yangilaydi.
    """
    if jins not in RUXSAT_ETILGAN_JINSLAR:
        jins = "Erkak"

    profil["ism"] = ism.strip() or profil.get("ism", "Foydalanuvchi")
    profil["familiya"] = familiya.strip()
    profil["jins"] = jins
    profil["bio"] = bio.strip()
    if rasm_url is not None:
        profil["avatarRasmUrl"] = rasm_url
    return profil


def kirish_usulini_tekshirish(usul: str, qiymat: str) -> Dict[str, Any]:
    """
    Telefon raqam, Google, Email yoki Instagram orqali kirish ma'lumotini tekshiradi.
    """
    u = (usul or "").strip().lower()
    q = (qiymat or "").strip()
    if u not in RUXSAT_ETILGAN_KIRISH_USULLARI or not q:
        return {"muvaffaqiyat": False, "xabar": "Kirish usuli yoki ma'lumot noto'g'ri"}

    return {
        "muvaffaqiyat": True,
        "usul": u,
        "qiymat": q,
        "tavsif": f"{u.capitalize()} ({q})"
    }
