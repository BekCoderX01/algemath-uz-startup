# ==========================================================================
# FAYL NOMI: Tekshiruv_Testlari/Python_Modullar_Testi.py
# VAZIFASI: Asosiy Python modullari hamda 1 dan 8 gacha bo'lgan yangi
#           maxsus papkalardagi barcha Python modullarini tekshirish.
# ISHGA TUSHIRISH: python Tekshiruv_Testlari/Python_Modullar_Testi.py
# ==========================================================================

import sys
sys.dont_write_bytecode = True
import json
import os
import threading
import unittest
import urllib.error
import urllib.request

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)
for folder in [
    "Backend_Modullari_Python",
    "1_Olmoslar_Dukoni_Bulimi",
    "2_Matematik_Duel_Bulimi",
    "3_Grafik_va_Formulalar_Bulimi",
    "4_Kunlik_Zanjir_va_Turnir_Bulimi",
    "5_Ustoz_Sinfxonasi_Bulimi",
    "6_Xatolar_Daftari_Bulimi",
    "7_Sertifikat_Tekshirish_Bulimi",
    "8_Obuna_va_Tolov_Bulimi"
]:
    sys.path.insert(0, os.path.join(ROOT_DIR, folder))

from Sertifikat_baholash_tizimi import (
    nomzod_ism_familiyasini_tekshirish,
    milliy_sertifikat_darajasini_hisoblash
)
from Olmoslar_hisoboti import kunlik_olmos_bonusini_berish, adolatli_test_olmosini_hisoblash
from Foydalanuvchi_va_Profil import profil_sozlamalarini_yangilash, kirish_usulini_tekshirish
from Test_bulimi import daraja_testlarini_saralash, test_natijasini_tekshirish
from Olmoslar_dukoni_moduli import mahsulot_xarid_qilish
from Matematik_duel_moduli import duel_natijasini_hisoblash
from Grafik_tahlil_moduli import kvadrat_funksiyani_tahlil_qilish
from Reyting_va_Turnir_moduli import kunlik_zanjirni_oshirish
from Ustoz_sinfxonasi_moduli import sinfxona_yaratish, sinfga_oquvchi_qoshish
from Xatolar_daftari_moduli import xatoni_tuzatish
from Sertifikat_tekshirish_moduli import sertifikat_id_boyicha_qidirish
from Obuna_va_Tolov_moduli import obunani_faollashtirish
from Server_Asosiy import AlgeMathServerHandler, ReusableTCPServer, ruxsat_etilgan_statik_yolmi


class BarchaPythonModullarTesti(unittest.TestCase):
    def test_1_olmoslar_dukoni(self):
        user = {"olmoslar": 50, "xaridlar": []}
        res = mahsulot_xarid_qilish(user, "item_pdf_qkf_viyet")
        self.assertTrue(res["muvaffaqiyat"])
        self.assertEqual(res["qolgan_olmos"], 35)

    def test_2_matematik_duel(self):
        win = duel_natijasini_hisoblash(5, 3, 20)
        self.assertEqual(win["natija"], "G'alaba")
        self.assertEqual(win["olmos_ozgarish"], 20)

    def test_3_grafik_tahlil(self):
        g = kvadrat_funksiyani_tahlil_qilish(1, -2, -3)
        self.assertEqual(g["diskriminant"], 16)
        self.assertEqual(g["x0"], 1.0)
        self.assertEqual(g["y0"], -4.0)
        self.assertEqual(g["ildizlar"], [-1.0, 3.0])

    def test_4_kunlik_zanjir_streak(self):
        u = {"kunlikZanjirSoni": 6, "olmoslar": 10, "haftalikBonusOlindi": False}
        r = kunlik_zanjirni_oshirish(u)
        self.assertEqual(r["zanjir_soni"], 7)
        self.assertEqual(r["bonus_olmos"], 50)
        self.assertEqual(r["jami_olmos"], 60)

    def test_5_ustoz_sinfxonasi(self):
        s = sinfxona_yaratish("math-77", "11-A guruh", "Dilnoza Karimova", "A")
        self.assertEqual(s["sinfKodi"], "MATH-77")
        self.assertTrue(sinfga_oquvchi_qoshish(s, "Sardorbek Alimov"))

    def test_6_xatolar_daftari(self):
        xato = {"togriIndex": 0, "tuzatildi": False}
        self.assertFalse(xatoni_tuzatish(xato, 2)["togri"])
        res = xatoni_tuzatish(xato, 0)
        self.assertTrue(res["togri"])
        self.assertEqual(res["olmos_mukofoti"], 3)

    def test_7_sertifikat_tekshirish(self):
        reestr = [{"sertifikatId": "MS-UZ-2026-1001", "ismFamiliya": "Dilnoza Karimova", "daraja": "A+"}]
        top = sertifikat_id_boyicha_qidirish(reestr, "MS-UZ-2026-1001")
        self.assertIsNotNone(top)
        self.assertEqual(top["daraja"], "A+")

    def test_8_obuna_va_tolov(self):
        # To'lovsiz Click/Payme urinishida Bepul tarifda qolishi shart
        u_click = {"olmoslar": 50, "obunaTarifi": "Bepul"}
        rad = obunani_faollashtirish(u_click, "plan_student_pro", "Click")
        self.assertFalse(rad["muvaffaqiyat"])
        self.assertTrue(rad.get("tolov_kerak"))
        self.assertEqual(u_click["obunaTarifi"], "Bepul")
        self.assertEqual(u_click["olmoslar"], 50)

        # Tasdiqlangan to'lov bilan PRO ochilishi
        ok = obunani_faollashtirish(
            u_click,
            "plan_student_pro",
            "Click",
            {"tolandi": True, "tranzaksiya_id": "CLK-556677"}
        )
        self.assertTrue(ok["muvaffaqiyat"])
        self.assertEqual(u_click["obunaTarifi"], "O'quvchi PRO")

        # Olmos evaziga xarid
        u = {"olmoslar": 150, "obunaTarifi": "Bepul"}
        res = obunani_faollashtirish(u, "plan_student_pro", "Olmos")
        self.assertTrue(res["muvaffaqiyat"])
        self.assertEqual(u["obunaTarifi"], "O'quvchi PRO")
        self.assertEqual(u["olmoslar"], 30)

    def test_milliy_sertifikat_va_kunlik_olmos(self):
        self.assertTrue(nomzod_ism_familiyasini_tekshirish("Sardor", "Alimov"))
        self.assertEqual(milliy_sertifikat_darajasini_hisoblash(15, 15, 13)["daraja"], "A+")
        u = {"olmoslar": 10, "oxirgiKunlikBonusSana": "2026-11-10"}
        self.assertEqual(kunlik_olmos_bonusini_berish(u, "2026-11-16")["jami"], 15)
        self.assertEqual(adolatli_test_olmosini_hisoblash(10, 10, "A+"), 35)

    def test_profil_va_test_saralash_modullari(self):
        p = profil_sozlamalarini_yangilash({}, "Sardorbek", "Alimov", "Erkak", "A+ maqsad")
        self.assertEqual(p["ism"], "Sardorbek")
        self.assertTrue(kirish_usulini_tekshirish("telefon", "+998901234567")["muvaffaqiyat"])
        savollar = [{"id": "q1", "daraja": "A+", "togriIndex": 0}, {"id": "q2", "daraja": "B", "togriIndex": 1}]
        saralangan = daraja_testlarini_saralash(savollar, "O'quvchi", "A+")
        self.assertEqual(len(saralangan), 1)
        natija = test_natijasini_tekshirish(saralangan, {"q1": 0})
        self.assertEqual(natija["foiz"], 100.0)

    def test_python_server_admin_maxfiylik_himoyasi(self):
        self.assertTrue(ruxsat_etilgan_statik_yolmi("/index.html"))
        self.assertTrue(ruxsat_etilgan_statik_yolmi("/Sahifalar/Asosiy_sahifa.html"))
        self.assertFalse(ruxsat_etilgan_statik_yolmi("/.env"))
        self.assertFalse(ruxsat_etilgan_statik_yolmi("/Malumotlar_Bazasi/Baza_Malumotlari.json"))
        self.assertFalse(ruxsat_etilgan_statik_yolmi("/Server_Asosiy.py"))

        db_path = os.path.join(ROOT_DIR, "Malumotlar_Bazasi", "Baza_Malumotlari.json")
        db_backup = None
        if os.path.exists(db_path):
            with open(db_path, "r", encoding="utf-8") as rf:
                db_backup = rf.read()
        prev_secret = os.environ.get("ADMIN_SECRET")

        server = ReusableTCPServer(("127.0.0.1", 0), AlgeMathServerHandler)
        port = server.server_address[1]
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{port}"

        def req(path, method="GET", data=None, headers=None):
            raw = json.dumps(data).encode("utf-8") if data is not None else None
            hdrs = dict(headers or {})
            if raw is not None:
                hdrs["Content-Type"] = "application/json"
            r = urllib.request.Request(f"{base}{path}", data=raw, method=method, headers=hdrs)
            try:
                with urllib.request.urlopen(r) as resp:
                    return resp.status, resp.read().decode("utf-8")
            except urllib.error.HTTPError as err:
                return err.code, err.read().decode("utf-8")

        try:
            os.environ["ADMIN_SECRET"] = "py_test_admin_secret"
            self.assertEqual(req("/.env")[0], 403)
            self.assertEqual(req("/Malumotlar_Bazasi/Baza_Malumotlari.json")[0], 403)
            self.assertEqual(req("/api/admin/holat")[0], 403)
            self.assertEqual(req("/api/tolov/holat")[0], 403)

            st, body = req("/api/holat")
            self.assertEqual(st, 200)
            holat = json.loads(body)
            self.assertNotIn("tolovSorovlari", holat)
            self.assertNotIn("ishlatilganTranzaksiyalar", holat)

            st_bad, _ = req("/api/admin/kirish", "POST", {"adminKalit": "wrong"})
            self.assertEqual(st_bad, 403)

            st_ok, login_body = req("/api/admin/kirish", "POST", {"adminKalit": "py_test_admin_secret"})
            self.assertEqual(st_ok, 200)
            token = json.loads(login_body)["adminToken"]

            st_adm, adm_body = req("/api/admin/holat", headers={"x-admin-token": token})
            self.assertEqual(st_adm, 200)
            self.assertIn("tolovSorovlari", json.loads(adm_body))
        finally:
            if prev_secret is None:
                os.environ.pop("ADMIN_SECRET", None)
            else:
                os.environ["ADMIN_SECRET"] = prev_secret
            if db_backup is not None:
                with open(db_path, "w", encoding="utf-8") as wf:
                    wf.write(db_backup)
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    unittest.main(verbosity=2)
