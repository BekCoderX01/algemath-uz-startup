# ==========================================================================
# FAYL NOMI: Server_Asosiy.py
# VAZIFASI: Loyihaning muqobil Python Backend Serveri.
#           - Faqat ruxsat etilgan ommaviy frontend fayllarni uzatadi
#             (.env, .git, Malumotlar_Bazasi va server fayllarini yopadi);
#           - /api/holat, /api/sinxronlash va /api/tolov/holat nuqtalarida
#             maxfiy admin/to'lov ma'lumotlarini oddiy foydalanuvchilardan himoyalaydi;
#           - /api/admin/* hamda /api/tolov/tasdiqlash, /api/tolov/rad-etish
#             nuqtalarida ADMIN_SECRET asosida majburiy admin tekshiruvini bajaradi.
# ==========================================================================

import base64
import hashlib
import hmac
import http.server
import json
import os
import random
import re
import secrets
import socketserver
import time
from datetime import datetime, timedelta
from urllib.parse import parse_qs, unquote, urlparse

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(ROOT_DIR, "Malumotlar_Bazasi", "Baza_Malumotlari.json")
ADMIN_SESSION_TTL_SEC = 4 * 60 * 60
ADMIN_SESSIONS = {}


def env_faylini_yuklash():
    env_yol = os.path.join(ROOT_DIR, ".env")
    if not os.path.exists(env_yol):
        return
    try:
        with open(env_yol, "r", encoding="utf-8") as rf:
            for qator in rf:
                toza = qator.strip()
                if not toza or toza.startswith("#") or "=" not in toza:
                    continue
                kalit, qiymat = toza.split("=", 1)
                kalit = kalit.strip()
                qiymat = qiymat.strip()
                if (qiymat.startswith('"') and qiymat.endswith('"')) or (qiymat.startswith("'") and qiymat.endswith("'")):
                    qiymat = qiymat[1:-1]
                if kalit and kalit not in os.environ:
                    os.environ[kalit] = qiymat
    except Exception:
        pass


env_faylini_yuklash()
PORT = int(os.environ.get("PORT", 3000))

TARIF_QOIDALARI = {
    "plan_student_pro": {
        "nomi": "O'quvchi PRO",
        "sarlavha": "🚀 O'quvchi PRO (Eng Ommabop)",
        "summa_som": 39000,
        "summa_matn": "39,000 so'm / oy",
        "bonus_olmos": 50
    },
    "plan_teacher_pro": {
        "nomi": "Ustoz Ekspert PRO",
        "sarlavha": "👑 Ustoz va Repetitor Ekspert PRO",
        "summa_som": 69000,
        "summa_matn": "69,000 so'm / oy",
        "bonus_olmos": 100
    }
}

RUXSAT_ETILGAN_STATIK_PAPKALAR = (
    "Sahifalar/",
    "Dastur_Kodlari_JS/",
    "Dizayn_va_Uslublar/",
    "1_Olmoslar_Dukoni_Bulimi/",
    "2_Matematik_Duel_Bulimi/",
    "3_Grafik_va_Formulalar_Bulimi/",
    "4_Kunlik_Zanjir_va_Turnir_Bulimi/",
    "5_Ustoz_Sinfxonasi_Bulimi/",
    "6_Xatolar_Daftari_Bulimi/",
    "7_Sertifikat_Tekshirish_Bulimi/",
    "8_Obuna_va_Tolov_Bulimi/",
)

RUXSAT_ETILGAN_KENGAYTMALAR = {".html", ".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".ico"}


def ruxsat_etilgan_statik_yolmi(pathname):
    nisbiy = unquote(pathname or "").lstrip("/").replace("\\", "/")
    if not nisbiy:
        return False
    qismlar = nisbiy.split("/")
    if any((not q or q == ".." or q.startswith(".")) for q in qismlar):
        return False
    ext = os.path.splitext(nisbiy)[1].lower()
    if ext not in RUXSAT_ETILGAN_KENGAYTMALAR:
        return False
    if nisbiy == "index.html":
        return True
    return nisbiy.startswith(RUXSAT_ETILGAN_STATIK_PAPKALAR)


def xavfsiz_taqqoslash(a, b):
    s1 = str(a or "")
    s2 = str(b or "")
    if not s1 or not s2:
        return False
    return hmac.compare_digest(s1.encode("utf-8"), s2.encode("utf-8"))


def bazani_oqish():
    if not os.path.exists(DB_FILE):
        return {}
    try:
        with open(DB_FILE, "r", encoding="utf-8") as rf:
            return json.load(rf) or {}
    except Exception:
        return {}


def bazani_yozish(baza):
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    with open(DB_FILE, "w", encoding="utf-8") as wf:
        json.dump(baza, wf, ensure_ascii=False, indent=2)


def ommaviy_user_tozalash(u):
    if not isinstance(u, dict):
        return None
    return {
        "id": u.get("id"),
        "ism": u.get("ism"),
        "familiya": u.get("familiya"),
        "rol": "Ustoz" if u.get("rol") == "Ustoz" else "O'quvchi",
        "jins": u.get("jins"),
        "avatar": u.get("avatar"),
        "avatarRasmUrl": u.get("avatarRasmUrl") or "",
        "viloyat": u.get("viloyat"),
        "tanlanganDaraja": u.get("tanlanganDaraja"),
        "faolUnvon": u.get("faolUnvon"),
        "faolRamka": u.get("faolRamka"),
        "kunlikZanjirSoni": u.get("kunlikZanjirSoni"),
        "olmoslar": u.get("olmoslar"),
        "obunaTarifi": u.get("obunaTarifi"),
    }


def ommaviy_holatni_tozalash(baza):
    if not isinstance(baza, dict):
        return {"status": "ok"}
    royxat = [
        ommaviy_user_tozalash(u)
        for u in (baza.get("foydalanuvchilarRoyxati") or [])
        if isinstance(u, dict) and u.get("rol") != "Admin"
    ]
    royxat = [u for u in royxat if u]

    joriy = None
    raw_joriy = baza.get("joriyFoydalanuvchi")
    if isinstance(raw_joriy, dict) and raw_joriy.get("rol") != "Admin":
        joriy = ommaviy_user_tozalash(raw_joriy)

    return {
        "loyihaNomi": baza.get("loyihaNomi"),
        "versiya": baza.get("versiya"),
        "joriyFoydalanuvchi": joriy,
        "tungiRejim": bool(baza.get("tungiRejim")),
        "til": baza.get("til") or "uz",
        "bugungiIshlanganSekundlar": baza.get("bugungiIshlanganSekundlar") or 0,
        "oxirgiVaqtSana": baza.get("oxirgiVaqtSana") or "",
        "foydalanuvchilarRoyxati": royxat,
        "qoshimchaAdminSavollar": baza.get("qoshimchaAdminSavollar") or [],
        "berilganSertifikatlarArxivi": baza.get("berilganSertifikatlarArxivi") or [],
        "ustozSinfxonalari": baza.get("ustozSinfxonalari") or [],
        "tolovRekvizitlari": baza.get("tolovRekvizitlari") or {},
    }


def karta_yoki_telni_maskalash(qiymat):
    raqamlar = re.sub(r"\D", "", str(qiymat or ""))
    if len(raqamlar) >= 4:
        return "****" + raqamlar[-4:]
    return "****"


def ommaviy_tolov_sorovini_tozalash(s):
    if not isinstance(s, dict):
        return None
    return {
        "invoysId": s.get("invoysId"),
        "foydalanuvchiId": s.get("foydalanuvchiId"),
        "tarifId": s.get("tarifId"),
        "tarifNomi": s.get("tarifNomi"),
        "tarifSarlavha": s.get("tarifSarlavha"),
        "tolovUsuli": s.get("tolovUsuli"),
        "summa": s.get("summa"),
        "summaSom": s.get("summaSom"),
        "kartaYokiTel": karta_yoki_telni_maskalash(s.get("kartaYokiTel")),
        "holat": s.get("holat"),
        "radSababi": s.get("radSababi"),
        "yaratilganSana": s.get("yaratilganSana"),
        "tasdiqlanganSana": s.get("tasdiqlanganSana"),
        "chek": s.get("chek"),
    }


def serverda_tolovni_tasdiqlash(baza, invoys_id, manba="Admin Backend"):
    sorovlar = baza.setdefault("tolovSorovlari", [])
    ishlatilgan = baza.setdefault("ishlatilganTranzaksiyalar", [])
    sorov = next((s for s in sorovlar if s.get("invoysId") == invoys_id), None)
    if not sorov:
        return {"muvaffaqiyat": False, "xabar": "To'lov so'rovi topilmadi."}
    if sorov.get("holat") == "tasdiqlandi":
        return {"muvaffaqiyat": True, "allaqachon": True, "sorov": sorov}

    tarif = TARIF_QOIDALARI.get(sorov.get("tarifId"))
    if not tarif:
        return {"muvaffaqiyat": False, "xabar": "Tarif topilmadi."}

    tx_upper = str(sorov.get("tranzaksiyaId", "")).strip().upper()
    if tx_upper and tx_upper not in ishlatilgan:
        ishlatilgan.append(tx_upper)

    tugash_sana = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    hozir = datetime.now().strftime("%Y-%m-%d %H:%M")

    def user_yangila(u):
        if not u or u.get("id") != sorov.get("foydalanuvchiId"):
            return u
        yangi = dict(u)
        yangi["obunaTarifi"] = tarif["nomi"]
        yangi["obunaTugashSana"] = tugash_sana
        yangi["olmoslar"] = int(yangi.get("olmoslar", 0)) + tarif["bonus_olmos"]
        tarix = list(yangi.get("olmoslarTarixi") or [])
        tarix.insert(0, {
            "sana": hozir,
            "miqdor": tarif["bonus_olmos"],
            "sabab": f"{tarif['nomi']} to'lov bonusi (+{tarif['bonus_olmos']} 💎)"
        })
        yangi["olmoslarTarixi"] = tarix
        return yangi

    if isinstance(baza.get("foydalanuvchilarRoyxati"), list):
        baza["foydalanuvchilarRoyxati"] = [user_yangila(u) for u in baza["foydalanuvchilarRoyxati"]]
    if isinstance(baza.get("joriyFoydalanuvchi"), dict) and baza["joriyFoydalanuvchi"].get("id") == sorov.get("foydalanuvchiId"):
        baza["joriyFoydalanuvchi"] = user_yangila(baza["joriyFoydalanuvchi"])

    sorov["holat"] = "tasdiqlandi"
    sorov["tasdiqlaganManba"] = manba
    sorov["tasdiqlanganSana"] = hozir
    sorov["chek"] = {
        "chekId": f"PAY-UZ-{random.randint(100000, 999999)}",
        "tarifNomi": tarif["sarlavha"],
        "tolovUsuli": sorov.get("tolovUsuli"),
        "tranzaksiyaId": tx_upper,
        "summa": tarif["summa_matn"],
        "sana": hozir,
        "foydalanuvchi": sorov.get("foydalanuvchiIsmi")
    }
    bazani_yozish(baza)
    return {"muvaffaqiyat": True, "sorov": sorov, "chek": sorov["chek"]}


class AlgeMathServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def _cookie_olish(self, nomi):
        raw = self.headers.get("Cookie", "")
        for qism in raw.split(";"):
            if "=" not in qism:
                continue
            k, v = qism.split("=", 1)
            if k.strip() == nomi:
                return unquote(v.strip())
        return ""

    def _admin_tekshir(self):
        env_secret = os.environ.get("ADMIN_SECRET", "")
        header_secret = self.headers.get("x-admin-secret", "")
        if env_secret and header_secret and xavfsiz_taqqoslash(header_secret, env_secret):
            return {"ruxsat": True, "usul": "secret"}

        token = (self.headers.get("x-admin-token") or self._cookie_olish("algemath_admin_session") or "").strip()
        if token and token in ADMIN_SESSIONS:
            sessiya = ADMIN_SESSIONS[token]
            if sessiya.get("muddat", 0) > time.time():
                return {"ruxsat": True, "usul": "session", "token": token}
            ADMIN_SESSIONS.pop(token, None)

        return {
            "ruxsat": False,
            "status": 503 if not env_secret else 403,
            "xabar": "Admin maxfiy kaliti (ADMIN_SECRET) serverda sozlanmagan." if not env_secret else "Admin ruxsati talab qilinadi."
        }

    def _json_javob(self, status, obyekt, qoshimcha_headers=None):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        if qoshimcha_headers:
            for k, v in qoshimcha_headers.items():
                self.send_header(k, v)
        self.end_headers()
        self.wfile.write(json.dumps(obyekt, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/admin/tekshir":
            tekshir = self._admin_tekshir()
            return self._json_javob(200, {"muvaffaqiyat": True, "admin": tekshir["ruxsat"]})

        if parsed.path == "/api/admin/holat":
            tekshir = self._admin_tekshir()
            if not tekshir["ruxsat"]:
                return self._json_javob(tekshir["status"], {"muvaffaqiyat": False, "xabar": tekshir["xabar"]})
            return self._json_javob(200, bazani_oqish())

        if parsed.path == "/api/holat":
            return self._json_javob(200, ommaviy_holatni_tozalash(bazani_oqish()))

        if parsed.path == "/api/tolov/holat":
            is_admin = self._admin_tekshir()["ruxsat"]
            qs = parse_qs(parsed.query)
            invoys_id = (qs.get("invoysId") or [None])[0]
            user_id = (qs.get("foydalanuvchiId") or [None])[0]
            if not is_admin and not invoys_id and not user_id:
                return self._json_javob(403, {
                    "muvaffaqiyat": False,
                    "xabar": "Ruxsat yo'q: faqat shaxsiy invoysId yoki foydalanuvchiId bo'yicha tekshirish mumkin."
                })

            baza = bazani_oqish()
            sorovlar = baza.get("tolovSorovlari") or []
            if invoys_id:
                sorov = next((s for s in sorovlar if s.get("invoysId") == invoys_id), None)
                if not sorov:
                    return self._json_javob(404, {"muvaffaqiyat": False, "xabar": "Invoys topilmadi"})
                return self._json_javob(200, {
                    "muvaffaqiyat": True,
                    "tasdiqlandi": sorov.get("holat") == "tasdiqlandi",
                    "holat": sorov.get("holat"),
                    "sorov": sorov if is_admin else ommaviy_tolov_sorovini_tozalash(sorov)
                })
            user_sorovlar = [s for s in sorovlar if not user_id or s.get("foydalanuvchiId") == user_id]
            natija_sorovlar = user_sorovlar if is_admin else [ommaviy_tolov_sorovini_tozalash(s) for s in user_sorovlar]
            tasdiqlangan = next((s for s in natija_sorovlar if s and s.get("holat") == "tasdiqlandi"), None)
            return self._json_javob(200, {
                "muvaffaqiyat": True,
                "tasdiqlandi": bool(tasdiqlangan),
                "sorovlar": natija_sorovlar,
                "oxirgiTasdiqlangan": tasdiqlangan
            })

        yol = "/index.html" if parsed.path in ("/", "") else parsed.path
        if not ruxsat_etilgan_statik_yolmi(yol):
            self.send_response(403)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write("Ruxsat yo'q".encode("utf-8"))
            return

        self.path = yol
        return super().do_GET()

    def do_POST(self):
        uzunlik = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(uzunlik).decode("utf-8") if uzunlik > 0 else ""

        if self.path == "/api/admin/kirish":
            env_secret = os.environ.get("ADMIN_SECRET", "")
            if not env_secret:
                return self._json_javob(503, {
                    "muvaffaqiyat": False,
                    "xabar": "Admin maxfiy kaliti (ADMIN_SECRET) serverda (.env) sozlanmagan."
                })
            try:
                d = json.loads(body or "{}")
                kalit = d.get("adminKalit") or self.headers.get("x-admin-secret") or ""
                if not xavfsiz_taqqoslash(kalit, env_secret):
                    return self._json_javob(403, {"muvaffaqiyat": False, "xabar": "Maxfiy admin kaliti noto'g'ri!"})
                token = secrets.token_hex(32)
                ADMIN_SESSIONS[token] = {"yaratilgan": time.time(), "muddat": time.time() + ADMIN_SESSION_TTL_SEC}
                return self._json_javob(
                    200,
                    {"muvaffaqiyat": True, "adminToken": token, "admin": {"ism": "Bosh", "familiya": "Administrator"}},
                    {"Set-Cookie": f"algemath_admin_session={token}; HttpOnly; Path=/; SameSite=Strict; Max-Age={ADMIN_SESSION_TTL_SEC}"}
                )
            except Exception as e:
                return self._json_javob(400, {"muvaffaqiyat": False, "xabar": str(e)})

        if self.path == "/api/admin/chiqish":
            token = (self.headers.get("x-admin-token") or self._cookie_olish("algemath_admin_session") or "").strip()
            ADMIN_SESSIONS.pop(token, None)
            return self._json_javob(
                200,
                {"muvaffaqiyat": True},
                {"Set-Cookie": "algemath_admin_session=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0"}
            )

        if self.path == "/api/admin/savol-qoshish":
            tekshir = self._admin_tekshir()
            if not tekshir["ruxsat"]:
                return self._json_javob(tekshir["status"], {"muvaffaqiyat": False, "xabar": tekshir["xabar"]})
            d = json.loads(body or "{}")
            savol = str(d.get("savol", "")).strip()
            variantlar = [str(v).strip() for v in (d.get("variantlar") or [])]
            if not savol or len(variantlar) < 2:
                return self._json_javob(400, {"muvaffaqiyat": False, "xabar": "Savol va variantlar to'liq emas."})
            daraja = d.get("daraja") if d.get("daraja") in ("C", "C+", "B", "B+", "A", "A+") else "B"
            yangi_savol = {
                "id": d.get("id") or f"admin_q_{int(time.time() * 1000)}",
                "daraja": daraja,
                "manba": f"Admin savoli ({daraja})",
                "savol": savol,
                "variantlar": variantlar,
                "togriIndex": max(0, min(3, int(d.get("togriIndex") or 0)))
            }
            baza = bazani_oqish()
            baza.setdefault("qoshimchaAdminSavollar", []).insert(0, yangi_savol)
            bazani_yozish(baza)
            return self._json_javob(200, {"muvaffaqiyat": True, "savol": yangi_savol})

        if self.path == "/api/admin/olmos-berish":
            tekshir = self._admin_tekshir()
            if not tekshir["ruxsat"]:
                return self._json_javob(tekshir["status"], {"muvaffaqiyat": False, "xabar": tekshir["xabar"]})
            d = json.loads(body or "{}")
            user_id = str(d.get("foydalanuvchiId", "")).strip()
            miqdor = max(1, min(1000, int(d.get("miqdor") or 10)))
            baza = bazani_oqish()
            royxat = baza.get("foydalanuvchilarRoyxati") or []
            user = next((u for u in royxat if u.get("id") == user_id), None)
            if not user:
                return self._json_javob(404, {"muvaffaqiyat": False, "xabar": "Foydalanuvchi topilmadi."})
            user["olmoslar"] = int(user.get("olmoslar", 0)) + miqdor
            if isinstance(baza.get("joriyFoydalanuvchi"), dict) and baza["joriyFoydalanuvchi"].get("id") == user_id:
                baza["joriyFoydalanuvchi"]["olmoslar"] = user["olmoslar"]
            bazani_yozish(baza)
            return self._json_javob(200, {"muvaffaqiyat": True, "olmoslar": user["olmoslar"]})

        if self.path == "/api/admin/rekvizit":
            tekshir = self._admin_tekshir()
            if not tekshir["ruxsat"]:
                return self._json_javob(tekshir["status"], {"muvaffaqiyat": False, "xabar": tekshir["xabar"]})
            d = json.loads(body or "{}")
            baza = bazani_oqish()
            rekvizit = dict(baza.get("tolovRekvizitlari") or {})
            rekvizit["kartaTuri"] = str(d.get("kartaTuri") or "HUMO").strip()
            rekvizit["kartaRaqami"] = str(d.get("kartaRaqami") or "9860 1201 7157 4847").strip()
            rekvizit["qabulQiluvchi"] = str(d.get("qabulQiluvchi") or "OTABEK TOYCHIYEV").strip()
            baza["tolovRekvizitlari"] = rekvizit
            bazani_yozish(baza)
            return self._json_javob(200, {"muvaffaqiyat": True, "tolovRekvizitlari": rekvizit})

        if self.path == "/api/sinxronlash":
            is_admin = self._admin_tekshir()["ruxsat"]
            try:
                data = json.loads(body or "{}")
                mavjud = bazani_oqish()
                if is_admin:
                    mavjud.update(data)
                    bazani_yozish(mavjud)
                    return self._json_javob(200, {"muvaffaqiyat": True})

                if isinstance(data.get("tungiRejim"), bool):
                    mavjud["tungiRejim"] = data["tungiRejim"]
                if data.get("til") in ("uz", "ru", "en"):
                    mavjud["til"] = data["til"]
                if isinstance(data.get("bugungiIshlanganSekundlar"), (int, float)):
                    mavjud["bugungiIshlanganSekundlar"] = int(data["bugungiIshlanganSekundlar"])
                if isinstance(data.get("oxirgiVaqtSana"), str):
                    mavjud["oxirgiVaqtSana"] = data["oxirgiVaqtSana"]
                if isinstance(data.get("ustozSinfxonalari"), list):
                    mavjud["ustozSinfxonalari"] = data["ustozSinfxonalari"]
                if isinstance(data.get("berilganSertifikatlarArxivi"), list):
                    mavjud["berilganSertifikatlarArxivi"] = data["berilganSertifikatlarArxivi"]

                if isinstance(data.get("joriyFoydalanuvchi"), dict):
                    joriy = dict(data["joriyFoydalanuvchi"])
                    if joriy.get("rol") == "Admin":
                        joriy["rol"] = "O'quvchi"
                    mavjud["joriyFoydalanuvchi"] = joriy
                    royxat = mavjud.setdefault("foydalanuvchilarRoyxati", [])
                    idx = next((i for i, u in enumerate(royxat) if u.get("id") == joriy.get("id") and u.get("rol") != "Admin"), -1)
                    if idx >= 0:
                        royxat[idx].update(joriy)
                    elif joriy.get("id") and joriy.get("id") != "user_admin":
                        royxat.insert(0, joriy)

                bazani_yozish(mavjud)
                self._json_javob(200, {"muvaffaqiyat": True})
            except Exception as e:
                self._json_javob(400, {"muvaffaqiyat": False, "xato": str(e)})
            return

        if self.path == "/api/tolov/sorov":
            try:
                d = json.loads(body or "{}")
                tarif = TARIF_QOIDALARI.get(d.get("tarifId"))
                if not tarif:
                    return self._json_javob(400, {"muvaffaqiyat": False, "xabar": "Pullik PRO tarif tanlanmadi."})
                manba = str(d.get("kartaYokiTel", "")).strip()
                if len(re.findall(r"\d", manba)) < 4:
                    return self._json_javob(400, {"muvaffaqiyat": False, "xabar": "Telefon yoki karta oxirgi 4 raqami noto'g'ri."})
                invoys_id = d.get("invoysId") or f"INV-UZ-{random.randint(100000, 999999)}"
                tx_id = str(d.get("tranzaksiyaId") or invoys_id).strip().upper()

                baza = bazani_oqish()
                sorovlar = baza.setdefault("tolovSorovlari", [])
                baza.setdefault("ishlatilganTranzaksiyalar", [])

                sorov = {
                    "invoysId": invoys_id,
                    "foydalanuvchiId": d.get("foydalanuvchiId") or "user_default_1",
                    "foydalanuvchiIsmi": d.get("foydalanuvchiIsmi") or "Foydalanuvchi",
                    "tarifId": d.get("tarifId"),
                    "tarifNomi": tarif["nomi"],
                    "tarifSarlavha": tarif["sarlavha"],
                    "tolovUsuli": d.get("tolovUsuli") or "Istalgan ilova / Karta",
                    "summa": tarif["summa_matn"],
                    "summaSom": tarif["summa_som"],
                    "kartaYokiTel": manba,
                    "tranzaksiyaId": tx_id,
                    "holat": "kutilmoqda",
                    "yaratilganSana": datetime.now().strftime("%Y-%m-%d %H:%M")
                }
                sorovlar.insert(0, sorov)
                bazani_yozish(baza)
                return self._json_javob(200, {"muvaffaqiyat": True, "kutilmoqda": True, "sorov": ommaviy_tolov_sorovini_tozalash(sorov)})
            except Exception as e:
                return self._json_javob(400, {"muvaffaqiyat": False, "xabar": str(e)})

        if self.path == "/api/tolov/tasdiqlash":
            tekshir = self._admin_tekshir()
            if not tekshir["ruxsat"]:
                return self._json_javob(tekshir["status"], {"muvaffaqiyat": False, "xabar": tekshir["xabar"]})
            d = json.loads(body or "{}")
            res = serverda_tolovni_tasdiqlash(bazani_oqish(), d.get("invoysId"))
            return self._json_javob(200 if res.get("muvaffaqiyat") else 400, res)

        if self.path == "/api/tolov/rad-etish":
            tekshir = self._admin_tekshir()
            if not tekshir["ruxsat"]:
                return self._json_javob(tekshir["status"], {"muvaffaqiyat": False, "xabar": tekshir["xabar"]})
            d = json.loads(body or "{}")
            baza = bazani_oqish()
            sorov = next((s for s in (baza.get("tolovSorovlari") or []) if s.get("invoysId") == d.get("invoysId")), None)
            if not sorov:
                return self._json_javob(404, {"muvaffaqiyat": False, "xabar": "So'rov topilmadi."})
            sorov["holat"] = "rad_etildi"
            sorov["radSababi"] = d.get("sabab") or "To'lov hisobga tushmagani aniqlandi"
            sorov["tasdiqlanganSana"] = datetime.now().strftime("%Y-%m-%d %H:%M")
            bazani_yozish(baza)
            return self._json_javob(200, {"muvaffaqiyat": True, "sorov": sorov})

        if self.path == "/api/webhook/click":
            secret = os.environ.get("CLICK_SECRET_KEY")
            if not secret:
                return self._json_javob(503, {"error": -8, "error_note": "CLICK_SECRET_KEY sozlanmagan"})
            params = {k: v[0] for k, v in parse_qs(body).items()}
            action = params.get("action", "")
            payload = (
                f"{params.get('click_trans_id', '')}{params.get('service_id', '')}{secret}"
                f"{params.get('merchant_trans_id', '')}{params.get('merchant_prepare_id', '') if action == '1' else ''}"
                f"{params.get('amount', '')}{action}{params.get('sign_time', '')}"
            )
            if hashlib.md5(payload.encode("utf-8")).hexdigest() != params.get("sign_string"):
                return self._json_javob(200, {"error": -1, "error_note": "SIGN CHECK FAILED!"})
            if action == "1":
                serverda_tolovni_tasdiqlash(bazani_oqish(), params.get("merchant_trans_id"), "Click Merchant Webhook")
            return self._json_javob(200, {"error": 0, "error_note": "Success"})

        if self.path == "/api/webhook/payme":
            secret = os.environ.get("PAYME_SECRET_KEY")
            if not secret:
                return self._json_javob(503, {"error": {"code": -32504, "message": "PAYME_SECRET_KEY sozlanmagan"}})
            expected = "Basic " + base64.b64encode(f"Paycom:{secret}".encode("utf-8")).decode("utf-8")
            if not xavfsiz_taqqoslash(self.headers.get("Authorization"), expected):
                return self._json_javob(200, {"error": {"code": -32504, "message": "Unauthorized"}})
            rpc = json.loads(body or "{}")
            invoys_id = ((rpc.get("params") or {}).get("account") or {}).get("invoys_id")
            if rpc.get("method") == "PerformTransaction":
                serverda_tolovni_tasdiqlash(bazani_oqish(), invoys_id, "Payme Merchant Webhook")
            return self._json_javob(200, {"id": rpc.get("id"), "result": {"allow": True}})

        self.send_response(404)
        self.end_headers()


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with ReusableTCPServer(("", PORT), AlgeMathServerHandler) as httpd:
        print("=============================================================")
        print(f"🚀 AlgeMath UZ Python Serveri ishga tushdi: http://localhost:{PORT}")
        print("=============================================================")
        httpd.serve_forever()
