# ==========================================================================
# FAYL NOMI: Tekshiruv_Testlari/Python_Modullar_Testi.py
# VAZIFASI: Asosiy Python modullari hamda 1 dan 8 gacha bo'lgan yangi
#           maxsus papkalardagi barcha Python modullarini tekshirish.
# ISHGA TUSHIRISH: python Tekshiruv_Testlari/Python_Modullar_Testi.py
# ==========================================================================

import sys
import os
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
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
from Olmoslar_dukoni_moduli import mahsulot_xarid_qilish
from Matematik_duel_moduli import duel_natijasini_hisoblash
from Grafik_tahlil_moduli import kvadrat_funksiyani_tahlil_qilish
from Reyting_va_Turnir_moduli import kunlik_zanjirni_oshirish
from Ustoz_sinfxonasi_moduli import sinfxona_yaratish, sinfga_oquvchi_qoshish
from Xatolar_daftari_moduli import xatoni_tuzatish
from Sertifikat_tekshirish_moduli import sertifikat_id_boyicha_qidirish
from Obuna_va_Tolov_moduli import obunani_faollashtirish


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


if __name__ == "__main__":
    unittest.main(verbosity=2)
