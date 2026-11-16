# ==========================================================================
# FAYL NOMI: Server_Asosiy.py
# VAZIFASI: Loyihaning muqobil Python Backend Serveri.
#           Dasturchi hohlasa Node.js (node Server_Asosiy.js), hohlasa
#           Python (python Server_Asosiy.py) orqali serverni ko'tarishi mumkin.
#           /api/tolov/* va rasmiy Click/Payme webhooklar orqali PRO
#           to'lovlarini Backend da tekshiradi.
# ==========================================================================

import base64
import hashlib
import http.server
import json
import os
import random
import re
import socketserver
from datetime import datetime, timedelta
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("PORT", 3000))
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(ROOT_DIR, "Malumotlar_Bazasi", "Baza_Malumotlari.json")

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

    def _json_javob(self, status, obyekt):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(obyekt, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/holat":
            if os.path.exists(DB_FILE):
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    self.wfile.write(f.read().encode("utf-8"))
            else:
                self._json_javob(200, {"status": "ok"})
            return

        if parsed.path == "/api/tolov/holat":
            qs = parse_qs(parsed.query)
            invoys_id = (qs.get("invoysId") or [None])[0]
            user_id = (qs.get("foydalanuvchiId") or [None])[0]
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
                    "sorov": sorov
                })
            user_sorovlar = [s for s in sorovlar if not user_id or s.get("foydalanuvchiId") == user_id]
            tasdiqlangan = next((s for s in user_sorovlar if s.get("holat") == "tasdiqlandi"), None)
            return self._json_javob(200, {
                "muvaffaqiyat": True,
                "tasdiqlandi": bool(tasdiqlangan),
                "sorovlar": user_sorovlar,
                "oxirgiTasdiqlangan": tasdiqlangan
            })

        return super().do_GET()

    def do_POST(self):
        uzunlik = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(uzunlik).decode("utf-8")

        if self.path == "/api/sinxronlash":
            try:
                data = json.loads(body or "{}")
                mavjud = bazani_oqish()
                mavjud.update(data)
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
                tx_id = str(d.get("tranzaksiyaId", "")).strip().upper()
                if len(tx_id) < 6 or not re.match(r"^[A-Z0-9\-_]+$", tx_id):
                    return self._json_javob(400, {"muvaffaqiyat": False, "xabar": "Tranzaksiya ID kamida 6 ta belgi bo'lishi shart."})

                baza = bazani_oqish()
                sorovlar = baza.setdefault("tolovSorovlari", [])
                ishlatilgan = baza.setdefault("ishlatilganTranzaksiyalar", [])
                if tx_id in ishlatilgan or any(str(s.get("tranzaksiyaId", "")).upper() == tx_id and s.get("holat") != "rad_etildi" for s in sorovlar):
                    return self._json_javob(409, {"muvaffaqiyat": False, "xabar": "Bu tranzaksiya ID allaqachon ishlatilgan."})

                sorov = {
                    "invoysId": d.get("invoysId") or f"INV-UZ-{random.randint(100000, 999999)}",
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
                return self._json_javob(200, {"muvaffaqiyat": True, "kutilmoqda": True, "sorov": sorov})
            except Exception as e:
                return self._json_javob(400, {"muvaffaqiyat": False, "xabar": str(e)})

        if self.path == "/api/tolov/tasdiqlash":
            admin_secret = os.environ.get("ADMIN_SECRET")
            if admin_secret and self.headers.get("x-admin-secret") != admin_secret:
                return self._json_javob(403, {"muvaffaqiyat": False, "xabar": "Admin ruxsati noto'g'ri"})
            d = json.loads(body or "{}")
            res = serverda_tolovni_tasdiqlash(bazani_oqish(), d.get("invoysId"))
            return self._json_javob(200 if res.get("muvaffaqiyat") else 400, res)

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
            if self.headers.get("Authorization") != expected:
                return self._json_javob(200, {"error": {"code": -32504, "message": "Unauthorized"}})
            rpc = json.loads(body or "{}")
            invoys_id = ((rpc.get("params") or {}).get("account") or {}).get("invoys_id")
            if rpc.get("method") == "PerformTransaction":
                serverda_tolovni_tasdiqlash(bazani_oqish(), invoys_id, "Payme Merchant Webhook")
            return self._json_javob(200, {"id": rpc.get("id"), "result": {"allow": True}})

        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), AlgeMathServerHandler) as httpd:
        print("=============================================================")
        print(f"🚀 AlgeMath UZ Python Serveri ishga tushdi: http://localhost:{PORT}")
        print("=============================================================")
        httpd.serve_forever()
