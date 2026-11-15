# 🚀 AlgeMath UZ — Matematika va Algebra Ekotizimi (17 ta Modul)

Ushbu loyiha sizning talablaringiz asosida **har bir papka va har bir fayl o'zining bajaradigan vazifasiga ko'ra o'zbek tilida tushunarli nomlangan** holda yaratildi. Siz tasdiqlagan **1 dan 8 gacha bo'lgan barcha yangi startup funksiyalari** ham alohida papkalarga (`1_Olmoslar_Dukoni_Bulimi` .. `8_Obuna_va_Tolov_Bulimi`) ajratib, to'liq ishlaydigan holatda ulandi!

---

## 📁 Loyiha Papkalari va Fayllari Tuzilmasi (Mundarija)

```text
First STARTUP/
├── index.html                                  -> Bosh kirish sahifasi (Asosiy vitrina)
├── Server_Asosiy.js                            -> Node.js Backend Serveri (REST API + Statik fayllar)
├── Server_Asosiy.py                            -> Python Backend Serveri (Muqobil server)
├── package.json                                -> Node.js loyiha sozlamalari va test buyruqlari
├── LOYIHA_HUJJATI_README.md                    -> Dasturchi uchun to'liq qo'llanma
│
├── 1_Olmoslar_Dukoni_Bulimi/                   -> [1-YANGI MODUL] 💎 Olmoslar Do'koni (Diamond Shop)
│   ├── Olmoslar_dukoni_sahifasi.html           -> Do'kon sahifasi (PDF shpargalkalar, oltin ramkalar, unvonlar)
│   ├── Olmoslar_dukoni_mantiqi.js              -> Olmos evaziga xarid qilish va profilga o'rnatish mantiqi
│   └── Olmoslar_dukoni_moduli.py               -> Python backend xarid tekshiruvi moduli
│
├── 2_Matematik_Duel_Bulimi/                    -> [2-YANGI MODUL] ⚔️ 1 ga 1 Matematik Duel Arenasi
│   ├── Matematik_duel_sahifasi.html            -> 60 soniyalik tezkor bellashuv sahifasi
│   ├── Matematik_duel_mantiqi.js               -> Raqib tanlash, 5 ta misol va 2x olmos yutish mantiqi
│   └── Matematik_duel_moduli.py                -> Python backend duel hisoboti moduli
│
├── 3_Grafik_va_Formulalar_Bulimi/              -> [3-YANGI MODUL] 📈 Grafik Chizuvchi va Formula Doskasi
│   ├── Grafik_va_Formulalar_sahifasi.html      -> Koordinata tekisligida jonli grafik va formulalar sahifasi
│   ├── Grafik_va_Formulalar_mantiqi.js         -> Parabola uchi (x₀; y₀), D, ildizlar va SVG grafik chizuvchi
│   └── Grafik_tahlil_moduli.py                 -> Python matematik funksiya tahlili moduli
│
├── 4_Kunlik_Zanjir_va_Turnir_Bulimi/           -> [4-YANGI MODUL] 🔥 Olovli Kunlar Zanjiri (Streak) va Turnir
│   ├── Reyting_va_Turnir_sahifasi.html         -> 7 kunlik olovli kalendar (+50 💎) va 14 hudud turniri sahifasi
│   ├── Kunlik_zanjir_va_Turnir_mantiqi.js      -> Streak bonusi va viloyatlar reytingi mantiqi
│   └── Reyting_va_Turnir_moduli.py             -> Python reyting saralash moduli
│
├── 5_Ustoz_Sinfxonasi_Bulimi/                  -> [5-YANGI MODUL] 👨‍🏫 Ustoz Xonasi — Sinf Kodi va Uyga Vazifa
│   ├── Ustoz_sinfxonasi_sahifasi.html          -> 6 xonali kod (MATH-77) bilan sinf va jurnal sahifasi
│   ├── Ustoz_sinfxonasi_mantiqi.js             -> Sinf ochish, kod bilan qo'shilish va vazifa baholash
│   └── Ustoz_sinfxonasi_moduli.py              -> Python sinfxona va jurnal moduli
│
├── 6_Xatolar_Daftari_Bulimi/                   -> [6-YANGI MODUL] 📸 Aqlli Xatolar Ustida Ishlash Daftari
│   ├── Xatolar_daftari_sahifasi.html           -> Xato qilingan savollarni tuzatish sahifasi (+3 💎 mukofot)
│   ├── Xatolar_daftari_mantiqi.js              -> Aniq javobsiz Yordam/Memory bilan xatolarni yechish mantiqi
│   └── Xatolar_daftari_moduli.py               -> Python xatolar tahlili moduli
│
├── 7_Sertifikat_Tekshirish_Bulimi/             -> [7-YANGI MODUL] 🔍 Milliy Sertifikat Haqiqiyligini Tekshirish
│   ├── Sertifikat_tekshirish_sahifasi.html     -> ID raqam (MS-UZ-2026-1001) va QR kod skaneri sahifasi
│   ├── Sertifikat_tekshirish_mantiqi.js        -> Reestrdan sertifikat haqiqiyligini tekshirish mantiqi
│   └── Sertifikat_tekshirish_moduli.py         -> Python sertifikat verifikatsiya moduli
│
├── 8_Obuna_va_Tolov_Bulimi/                    -> [8-YANGI MODUL] 💰 Startup Monetizatsiyasi (PRO Obuna)
│   ├── Obuna_va_Tolov_sahifasi.html            -> Click, Payme, Uzum va Olmos orqali PRO tarif sahifasi
│   ├── Obuna_va_Tolov_mantiqi.js               -> Tariflarni aktivlashtirish va elektron chek chiqarish mantiqi
│   └── Obuna_va_Tolov_moduli.py                -> Python to'lov va obuna moduli
│
├── Sahifalar/                                  -> Asosiy 9 ta alohida HTML sahifalar
│   ├── Asosiy_sahifa.html                      -> Asosiy sahifa, kunlik taymer va tezkor mundarija
│   ├── Noldan_urganish_sahifasi.html           -> Matematikani 0 dan o'rganish (C..A+, 10 talik test va Yordam)
│   ├── Test_yechish_sahifasi.html              -> O'quvchi va Ustozlar uchun darajali testlar
│   ├── Sertifikat_olish_sahifasi.html          -> Milliy Sertifikat imtihoni (45 talik: 15 oson, 15 o'rtacha, 15 qiyin)
│   ├── Qidiruv_va_Mundarija_sahifasi.html      -> Global Qidiruv va Barcha 17 ta sahifa Mundarijasi
│   ├── Profil_va_Olmoslar_sahifasi.html        -> Shaxsiy profil, Olmoslar (💎) tarixi va ishlangan vaqt
│   ├── Sozlamalar_sahifasi.html                -> Sozlamalar (Tungi/Kunduzgi rejim, UZ/RU/EN tillar bayroqlar bilan, BIO, Jins, Rasm)
│   ├── Kirish_sahifasi.html                    -> Kirish (Telefon raqam, Google, Email, Instagram)
│   └── Admin_panel_sahifasi.html               -> Admin Panel (Foydalanuvchilar, yangi test qo'shish, sertifikatlar)
│
├── Dastur_Kodlari_JS/                          -> Asosiy JavaScript modullari
├── Backend_Modullari_Python/                   -> Asosiy Python modullari
├── Dizayn_va_Uslublar/                         -> CSS uslublar va SVG bayroqlar/rasmlar
├── Malumotlar_Bazasi/                          -> Server JSON bazasi
└── Tekshiruv_Testlari/                         -> Node.js va Python avtomatlashtirilgan testlar
```
