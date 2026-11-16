/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Mundarija_va_Navigatsiya.js
   VAZIFASI: Barcha 17 ta alohida sahifa va maxsus papkalarni (9 ta asosiy
             sahifa + 8 ta Startup moduli papkalari) KUN.UZ portali uslubidagi
             2 qavatli tartibli menyu, yo'l ko'rsatkichi (Breadcrumb),
             kategoriyalangan "MUNDARIJA" oynasi va pastki "Milliy Sertifikat"
             bloki orqali o'zaro bog'lash.
   ========================================================================== */

(function (global) {
  // Barcha 17 ta alohida sahifa va papkalar ro'yxati (Kun.uz rubrikalari bo'yicha guruhlangan)
  const SAHIFALAR_MUNDARIJASI = [
    {
      raqam: "01",
      id: "home",
      kategoriyaId: "oquv",
      kategoriyaNomi: "📘 I. O'quv Kursi va Milliy Sertifikat",
      papka: "Sahifalar",
      fayl: "Asosiy_sahifa.html",
      ikonka: "🏠",
      i18nKalit: "nav_home",
      qisqaNomi: "Asosiy",
      nomi: "Asosiy sahifa va Kunlik Ko'rsatkichlar",
      tavsif: "Kunlik ishlangan vaqt, olmoslar hisobi, barcha 17 ta bo'limga tezkor kirish va statistika."
    },
    {
      raqam: "02",
      id: "learn",
      kategoriyaId: "oquv",
      kategoriyaNomi: "📘 I. O'quv Kursi va Milliy Sertifikat",
      papka: "Sahifalar",
      fayl: "Noldan_urganish_sahifasi.html",
      ikonka: "📚",
      i18nKalit: "nav_learn",
      qisqaNomi: "0 dan O'rganish",
      nomi: "Matematikani 0 dan O'rganish (C dan A+ gacha)",
      tavsif: "Maqsad darajani (masalan A+) tanlab, nazariy darslar va aniq javobsiz Yordam/Memory eslatmali 10 talik testlar yechish."
    },
    {
      raqam: "03",
      id: "tests",
      kategoriyaId: "oquv",
      kategoriyaNomi: "📘 I. O'quv Kursi va Milliy Sertifikat",
      papka: "Sahifalar",
      fayl: "Test_yechish_sahifasi.html",
      ikonka: "🧮",
      i18nKalit: "nav_tests",
      qisqaNomi: "Darajali Testlar",
      nomi: "O'quvchi va Ustozlar uchun Darajali Testlar",
      tavsif: "O'quvchi yoki Ustoz maqomini va bilim darajasini (C, C+, B, B+, A, A+) tanlab mos testlarni ishlash."
    },
    {
      raqam: "04",
      id: "certificate",
      kategoriyaId: "oquv",
      kategoriyaNomi: "📘 I. O'quv Kursi va Milliy Sertifikat",
      papka: "Sahifalar",
      fayl: "Sertifikat_olish_sahifasi.html",
      ikonka: "🏆",
      i18nKalit: "nav_certificate",
      qisqaNomi: "Sertifikat (45)",
      nomi: "Milliy Sertifikat Imtihoni (45 talik test)",
      tavsif: "Ism-familiya kiritib, 15 ta oson (o'ylantiradigan), 15 ta o'rtacha va 15 ta qiyin testni yechish hamda A+..C sertifikat olish."
    },
    {
      raqam: "05",
      id: "shop",
      kategoriyaId: "musobaqa",
      kategoriyaNomi: "🏆 III. Musobaqa, Turnir va Olmos Do'koni",
      papka: "1_Olmoslar_Dukoni_Bulimi",
      fayl: "Olmoslar_dukoni_sahifasi.html",
      ikonka: "🛒",
      i18nKalit: "nav_shop",
      qisqaNomi: "Olmos Do'koni",
      nomi: "1. 💎 Olmoslar Do'koni (Diamond Shop)",
      tavsif: "To'plangan olmoslarga PDF formula kitobchalar, Oltin profil ramkalari, VIP unvonlar va imtihon kuchaytirgichlarini xarid qilish."
    },
    {
      raqam: "06",
      id: "duel",
      kategoriyaId: "musobaqa",
      kategoriyaNomi: "🏆 III. Musobaqa, Turnir va Olmos Do'koni",
      papka: "2_Matematik_Duel_Bulimi",
      fayl: "Matematik_duel_sahifasi.html",
      ikonka: "⚔️",
      i18nKalit: "nav_duel",
      qisqaNomi: "1v1 Duel",
      nomi: "2. ⚔️ 1 ga 1 Matematik Duel Arenasi",
      tavsif: "60 soniya ichida raqib bilan 5 ta algebra misolini tezlikka yechib, tikilgan olmoslarni 2 barobar qilib yutib olish!"
    },
    {
      raqam: "07",
      id: "graph",
      kategoriyaId: "amaliyot",
      kategoriyaNomi: "📐 II. Interaktiv Laboratoriya va Ustoz Xonasi",
      papka: "3_Grafik_va_Formulalar_Bulimi",
      fayl: "Grafik_va_Formulalar_sahifasi.html",
      ikonka: "📈",
      i18nKalit: "nav_graph",
      qisqaNomi: "Grafik & Formula",
      nomi: "3. 📈 Interaktiv Grafik Chizuvchi va Formula Doskasi",
      tavsif: "Parabola, chiziqli, sinus va logarifmik funksiyalar grafigini koordinata tekisligida jonli chizish hamda barcha formulalar to'plami."
    },
    {
      raqam: "08",
      id: "streak",
      kategoriyaId: "musobaqa",
      kategoriyaNomi: "🏆 III. Musobaqa, Turnir va Olmos Do'koni",
      papka: "4_Kunlik_Zanjir_va_Turnir_Bulimi",
      fayl: "Reyting_va_Turnir_sahifasi.html",
      ikonka: "🔥",
      i18nKalit: "nav_streak",
      qisqaNomi: "Turnir & Streak",
      nomi: "4. 🔥 Olovli Kunlar Zanjiri (Streak) va Viloyatlar Turniri",
      tavsif: "7 kunlik uzluksiz olovli seriya (+50 💎 super-bonus) hamda O'zbekistonning 14 hududi bo'yicha haftalik turnir jadvali."
    },
    {
      raqam: "09",
      id: "classroom",
      kategoriyaId: "amaliyot",
      kategoriyaNomi: "📐 II. Interaktiv Laboratoriya va Ustoz Xonasi",
      papka: "5_Ustoz_Sinfxonasi_Bulimi",
      fayl: "Ustoz_sinfxonasi_sahifasi.html",
      ikonka: "👨‍🏫",
      i18nKalit: "nav_classroom",
      qisqaNomi: "Ustoz Xonasi",
      nomi: "5. 👨‍🏫 Ustoz Xonasi — Sinf Kodi va Uyga Vazifalar",
      tavsif: "Ustozlar uchun 6 xonali sinf kodi (MATH-77) ochib uyga vazifa berish, o'quvchilar uchun sinfga qo'shilib vazifa topshirish."
    },
    {
      raqam: "10",
      id: "mistakes",
      kategoriyaId: "amaliyot",
      kategoriyaNomi: "📐 II. Interaktiv Laboratoriya va Ustoz Xonasi",
      papka: "6_Xatolar_Daftari_Bulimi",
      fayl: "Xatolar_daftari_sahifasi.html",
      ikonka: "📓",
      i18nKalit: "nav_mistakes",
      qisqaNomi: "Xatolar Daftari",
      nomi: "6. 📸 Aqlli Xatolar Ustida Ishlash Daftari",
      tavsif: "Testlarda xato qilingan savollarni aniq javobsiz Yordam/Memory ko'magida qayta yechib tuzatish va har biriga +3 💎 olish."
    },
    {
      raqam: "11",
      id: "verify",
      kategoriyaId: "oquv",
      kategoriyaNomi: "📘 I. O'quv Kursi va Milliy Sertifikat",
      papka: "7_Sertifikat_Tekshirish_Bulimi",
      fayl: "Sertifikat_tekshirish_sahifasi.html",
      ikonka: "✅",
      i18nKalit: "nav_verify",
      qisqaNomi: "Sertifikat Tekshirish",
      nomi: "7. 🔍 Milliy Sertifikat Haqiqiyligini Tekshirish",
      tavsif: "Sertifikat ID raqami (masalan MS-UZ-2026-1001) yoki ism-familiya orqali diplomning haqiqiyligi va ballarini rasmiy tekshirish."
    },
    {
      raqam: "12",
      id: "pricing",
      kategoriyaId: "musobaqa",
      kategoriyaNomi: "🏆 III. Musobaqa, Turnir va Olmos Do'koni",
      papka: "8_Obuna_va_Tolov_Bulimi",
      fayl: "Obuna_va_Tolov_sahifasi.html",
      ikonka: "💰",
      i18nKalit: "nav_pricing",
      qisqaNomi: "PRO Obuna",
      nomi: "8. 💰 Startup Monetizatsiyasi (PRO Obuna: Click / Payme / Uzum)",
      tavsif: "Click, Payme, Uzum yoki to'plangan 200 💎 Olmos evaziga PRO tarifga o'tish va premium imkoniyatlarni ochish."
    },
    {
      raqam: "13",
      id: "search",
      kategoriyaId: "amaliyot",
      kategoriyaNomi: "📐 II. Interaktiv Laboratoriya va Ustoz Xonasi",
      papka: "Sahifalar",
      fayl: "Qidiruv_va_Mundarija_sahifasi.html",
      ikonka: "🔍",
      i18nKalit: "nav_search",
      qisqaNomi: "Qidiruv & Mundarija",
      nomi: "Qidiruv Bo'limi va To'liq Mundarija",
      tavsif: "Saytdagi barcha matematik mavzular, formulalar, testlar va 17 ta sahifani bir zumda topish."
    },
    {
      raqam: "14",
      id: "profile",
      kategoriyaId: "kabinet",
      kategoriyaNomi: "⚙️ IV. Shaxsiy Kabinet, Sozlamalar va Boshqaruv",
      papka: "Sahifalar",
      fayl: "Profil_va_Olmoslar_sahifasi.html",
      ikonka: "💎",
      i18nKalit: "nav_profile",
      qisqaNomi: "Profil",
      nomi: "Shaxsiy Profil, Olmoslar va Vaqt Tarixi",
      tavsif: "To'plangan olmoslar (💎), faol unvon, ishlangan soat/daqiqalar va olingan sertifikatlar."
    },
    {
      raqam: "15",
      id: "settings",
      kategoriyaId: "kabinet",
      kategoriyaNomi: "⚙️ IV. Shaxsiy Kabinet, Sozlamalar va Boshqaruv",
      papka: "Sahifalar",
      fayl: "Sozlamalar_sahifasi.html",
      ikonka: "⚙️",
      i18nKalit: "nav_settings",
      qisqaNomi: "Sozlamalar",
      nomi: "Sozlamalar (Tungi/Kunduzgi rejim, Tillar, Profil)",
      tavsif: "Tungi va kunduzgi rejim, O'zbek 🇺🇿 / Rus 🇷🇺 / Ingliz 🇺🇸 tillari, rasm qo'yish, BIO va jins (Erkak/Ayol) tanlash."
    },
    {
      raqam: "16",
      id: "login",
      kategoriyaId: "kabinet",
      kategoriyaNomi: "⚙️ IV. Shaxsiy Kabinet, Sozlamalar va Boshqaruv",
      papka: "Sahifalar",
      fayl: "Kirish_sahifasi.html",
      ikonka: "🔐",
      i18nKalit: "nav_login",
      qisqaNomi: "Kirish",
      nomi: "Kirish va Ro'yxatdan o'tish (Telefon, Google, Email, Instagram)",
      tavsif: "Telefon raqam, Google, Email yoki Instagram orqali o'quvchi yoki ustoz sifatida tizimga kirish."
    },
    {
      raqam: "17",
      id: "admin",
      faqatAdmin: true,
      kategoriyaId: "kabinet",
      kategoriyaNomi: "⚙️ IV. Shaxsiy Kabinet, Sozlamalar va Boshqaruv",
      papka: "Sahifalar",
      fayl: "Admin_panel_sahifasi.html",
      ikonka: "🛡️",
      i18nKalit: "nav_admin",
      qisqaNomi: "Admin Panel",
      nomi: "Admin Panel (Boshqaruv markazi)",
      tavsif: "Foydalanuvchilarni boshqarish, yangi matematik test qo'shish, sertifikatlar reestri va olmos taqdim etish."
    }
  ];

  // Kun.uz uslubidagi 4 ta asosiy rubrika (kategoriya)
  const RUBRIKALAR_GURUHI = [
    {
      id: "oquv",
      sarlavha: "📘 I BO'LIM: O'QUV KURSI, DARAJALI TESTLAR VA MILLIY SERTIFIKAT",
      izoh: "0 dan A+ gacha bosqichma-bosqich nazariy darslar, darajali sinovlar va 45 talik rasmiy Sertifikat imtihoni"
    },
    {
      id: "amaliyot",
      sarlavha: "📐 II BO'LIM: INTERAKTIV LABORATORIYA, USTOZ XONASI VA XATOLAR DAFTARI",
      izoh: "Jonli grafik chizuvchi, 6 xonali sinf kodi bilan uyga vazifalar, xatolarni tuzatish va global qidiruv"
    },
    {
      id: "musobaqa",
      sarlavha: "🏆 III BO'LIM: 1v1 DUEL, VILOYATLAR TURNIRI, OLMOS DO'KONI VA PRO OBUNA",
      izoh: "60 soniyalik bellashuv, 7 kunlik olovli streak, olmos evaziga xaridlar va Click/Payme/Uzum/Olmos PRO tariflar"
    },
    {
      id: "kabinet",
      sarlavha: "⚙️ IV BO'LIM: SHAXSIY KABINET, SOZLAMALAR VA PROFIL",
      izoh: "Tungi/Kunduzgi rejim, O'zbek/Rus/Ingliz tillari, profil rasmi va BIO, 4 xil login usuli"
    }
  ];

  const ICHKI_PAPKALAR = [
    "Sahifalar",
    "1_Olmoslar_Dukoni_Bulimi",
    "2_Matematik_Duel_Bulimi",
    "3_Grafik_va_Formulalar_Bulimi",
    "4_Kunlik_Zanjir_va_Turnir_Bulimi",
    "5_Ustoz_Sinfxonasi_Bulimi",
    "6_Xatolar_Daftari_Bulimi",
    "7_Sertifikat_Tekshirish_Bulimi",
    "8_Obuna_va_Tolov_Bulimi"
  ];

  const MundarijaVaNavigatsiya = {
    sahifalarMundarijasi: SAHIFALAR_MUNDARIJASI,
    rubrikalarGuruhi: RUBRIKALAR_GURUHI,

    adminSessiyasiFaolmi: function () {
      return Boolean(
        global.UmumiyHolatVaBazalar &&
        typeof global.UmumiyHolatVaBazalar.adminSessiyasiBormi === "function" &&
        global.UmumiyHolatVaBazalar.adminSessiyasiBormi()
      );
    },

    korinadiganSahifalar: function () {
      const adminFaol = this.adminSessiyasiFaolmi();
      return SAHIFALAR_MUNDARIJASI.filter(s => adminFaol || !s.faqatAdmin);
    },

    // Istalgan sahifadan boshqa sahifaga to'g'ri nisbiy manzilni hisoblash
    sahifaManziliniOlish: function (faylYokiNisbiyYol) {
      const topilgan = SAHIFALAR_MUNDARIJASI.find(
        s => s.fayl === faylYokiNisbiyYol || `${s.papka}/${s.fayl}` === faylYokiNisbiyYol || s.id === faylYokiNisbiyYol
      );
      const ildizdanYol = topilgan ? `${topilgan.papka}/${topilgan.fayl}` : (
        faylYokiNisbiyYol.includes("/") ? faylYokiNisbiyYol : `Sahifalar/${faylYokiNisbiyYol}`
      );

      if (typeof window === "undefined") return ildizdanYol;
      const joriyYol = window.location.pathname.replace(/\\/g, "/");
      const ichkiPapkadami = ICHKI_PAPKALAR.some(p => joriyYol.includes(`/${p}/`));
      if (ichkiPapkadami) {
        return "../" + ildizdanYol;
      }
      return ildizdanYol;
    },

    // Bo'limlarni Kun.uz uslubida 4 ta tartibli rubrikaga ajratib HTML qaytarish
    kategoriyalanganMundarijaHtml: function () {
      const self = this;
      const korinadiganlar = this.korinadiganSahifalar();
      return RUBRIKALAR_GURUHI.map(rub => {
        const sahifalar = korinadiganlar.filter(s => s.kategoriyaId === rub.id);
        return `
          <div class="kun-rubric-block">
            <div class="kun-rubric-header">
              <div>
                <div class="kun-rubric-title">${rub.sarlavha}</div>
                <div class="kun-rubric-subtitle">${rub.izoh}</div>
              </div>
              <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">
                ${sahifalar.length} ta bo'lim
              </span>
            </div>
            <div class="grid-3">
              ${sahifalar.map(s => `
                <a href="${self.sahifaManziliniOlish(s.fayl)}" class="card card-interactive" style="display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.85rem;">
                      <span class="mundarija-item-num">${s.raqam}</span>
                      <span style="font-size:1.75rem;">${s.ikonka}</span>
                    </div>
                    <h3 style="font-size:1.08rem; font-weight:800; margin-bottom:0.35rem; line-height:1.35;">${s.nomi}</h3>
                    <div style="font-size:0.75rem; color:var(--accent-primary); font-weight:700; margin-bottom:0.55rem;">📂 ${s.papka}/${s.fayl}</div>
                    <p style="font-size:0.89rem; color:var(--text-secondary); margin-bottom:1.15rem;">${s.tavsif}</p>
                  </div>
                  <div style="font-weight:800; font-size:0.86rem; color:var(--accent-primary); padding-top:0.65rem; border-top:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
                    <span>Bo'limga o'tish</span>
                    <span>→</span>
                  </div>
                </a>
              `).join("")}
            </div>
          </div>
        `;
      }).join("");
    },

    // KUN.UZ uslubidagi 2 qavatli yuqori navigatsiya, Breadcrumb va Mundarija oynasini chizish
    navigatsiyaniChizish: function (faolSahifaId) {
      if (typeof document === "undefined") return;

      global.UmumiyHolatVaBazalar.mavzuniQoLash();
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const foydalanuvchi = baza.joriyFoydalanuvchi;
      const joriyTil = global.TilVaTarjimalar.joriyTilniOlish();
      const vaqtMatn = global.OlmoslarVaVaqtTizimi.vaqtniFormatlash(baza.bugungiIshlanganSekundlar || 0);
      const joriySahifa = SAHIFALAR_MUNDARIJASI.find(s => s.id === faolSahifaId) || SAHIFALAR_MUNDARIJASI[0];
      const adminFaol = this.adminSessiyasiFaolmi();
      const korinadiganlar = this.korinadiganSahifalar();

      // 2-qavatdagi rubrikalar tartibi (eng ko'p ishlatiladigan tartibda)
      const rubrikaTartibi = [
        "home", "learn", "tests", "certificate", "graph",
        "duel", "streak", "classroom", "mistakes", "shop",
        "pricing", "verify", "search", "profile", "settings", "login", "admin"
      ];
      const tartiblanganSahifalar = rubrikaTartibi
        .map(id => korinadiganlar.find(s => s.id === id))
        .filter(Boolean);
      const shuRubrikaSahifalari = korinadiganlar.filter(
        s => s.kategoriyaId === joriySahifa.kategoriyaId
      );

      const headerEl = document.getElementById("umumiy-navigatsiya-joyi");
      if (headerEl) {
        headerEl.innerHTML = `
        <header class="top-navbar">
          <!-- 1-QAVAT: KUN.UZ YUQORI KO'K PANELI (BREND, TILLAR, SOZLAMALAR, PROFIL VA STATISTIKA) -->
          <div class="kun-header-top">
            <div class="navbar-container">
              <div style="display:flex; align-items:center; gap:1.1rem; flex-wrap:wrap;">
                <a href="${this.sahifaManziliniOlish("Asosiy_sahifa.html")}" class="brand-logo">
                  <span class="brand-logo-icon">∑</span>
                  <div>
                    <div style="line-height:1.1;">ALGEMATH<span class="brand-logo-badge">UZ</span></div>
                    <div style="font-size:0.71rem; font-weight:600; color:rgba(255,255,255,0.75); letter-spacing:0.3px;">
                      ${foydalanuvchi.obunaTarifi && foydalanuvchi.obunaTarifi !== "Bepul" ? `👑 ${foydalanuvchi.obunaTarifi} PORTALI` : `<span data-i18n="portal_subtitle">${global.TilVaTarjimalar.matn("portal_subtitle", joriyTil)}</span>`}
                    </div>
                  </div>
                </a>

                <!-- KUN.UZ USLUBIDAGI TEZKOR TIL ALMASHTIRGICH (O'ZB | РУС | ENG) -->
                <div class="kun-lang-switcher" role="group" aria-label="Sayt tilini tanlash">
                  <button type="button" class="kun-lang-btn ${joriyTil === "uz" ? "active" : ""}" data-top-lang="uz" title="O'zbek tili">🇺🇿 O'ZB</button>
                  <button type="button" class="kun-lang-btn ${joriyTil === "ru" ? "active" : ""}" data-top-lang="ru" title="Русский язык">🇷🇺 РУС</button>
                  <button type="button" class="kun-lang-btn ${joriyTil === "en" ? "active" : ""}" data-top-lang="en" title="English">🇺🇸 ENG</button>
                </div>
              </div>

              <div class="navbar-stats-bar">
                <!-- OLOVLI STREAK -->
                <a href="${this.sahifaManziliniOlish("Reyting_va_Turnir_sahifasi.html")}" class="stat-pill" title="Kunlik olovli zanjir (Streak)">
                  <span>🔥</span>
                  <span>${foydalanuvchi.kunlikZanjirSoni || 5} kun</span>
                </a>

                <!-- KUNLIK ISHLANGAN VAQT -->
                <a href="${this.sahifaManziliniOlish("Profil_va_Olmoslar_sahifasi.html")}" class="stat-pill timer-pill" title="Bugun misol ishlagan vaqtingiz">
                  <span>⏱️</span>
                  <span data-live-study-time>${vaqtMatn}</span>
                </a>

                <!-- OLMOSLAR HISOBI -->
                <a href="${this.sahifaManziliniOlish("Olmoslar_dukoni_sahifasi.html")}" class="stat-pill diamond-pill" title="Olmoslar do'koni va balans">
                  <span>💎</span>
                  <span data-live-diamonds>${foydalanuvchi.olmoslar || 0}</span>
                </a>

                <!-- SOZLAMALARGA TEZKOR O'TISH TUGMASI (HAR DOIM KO'RINIB TURADI) -->
                <a href="${this.sahifaManziliniOlish("Sozlamalar_sahifasi.html")}"
                   class="kun-settings-top-btn ${faolSahifaId === "settings" ? "active" : ""}"
                   title="Sozlamalar: Tungi/Kunduzgi rejim, Tillar, Profil rasmi va BIO">
                  <span>⚙️</span>
                  <span data-i18n="nav_settings">${global.TilVaTarjimalar.matn("nav_settings", joriyTil)}</span>
                </a>

                <!-- SHAXSIY PROFIL -->
                <a href="${this.sahifaManziliniOlish("Profil_va_Olmoslar_sahifasi.html")}"
                   class="stat-pill"
                   title="Shaxsiy profil: ${foydalanuvchi.ism} ${foydalanuvchi.familiya}">
                  <span>${foydalanuvchi.avatar || "👨‍🎓"}</span>
                  <span>${foydalanuvchi.ism || "Profil"}</span>
                </a>

                <!-- TUNGI / KUNDUZGI REJIM TUGMASI -->
                <button type="button" class="theme-toggle-btn" id="tezkor-rejim-btn" title="Tungi yoki Kunduzgi rejimni almashtirish" aria-label="Mavzuni o'zgartirish">
                  ${baza.tungiRejim ? "☀️" : "🌙"}
                </button>

                <!-- MUNDARIJA TUGMASI -->
                <button type="button" class="mundarija-toggle-btn" id="mundarija-ochish-btn" title="Barcha bo'limlar mundarijasi">
                  <span>🧭</span>
                  <span data-i18n="btn_mundarija">${global.TilVaTarjimalar.matn("btn_mundarija", joriyTil)}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 2-QAVAT: KUN.UZ USLUBIDAGI TOZA BIR QATORLI RUBRIKALAR MENYUSI -->
          <div class="kun-category-bar">
            <div class="kun-category-container">
              <nav class="nav-links" aria-label="Asosiy sahifalar menyusi">
                ${tartiblanganSahifalar.map(s => `
                  <a href="${this.sahifaManziliniOlish(s.fayl)}"
                     class="nav-link-item ${faolSahifaId === s.id ? "active" : ""}"
                     title="${s.nomi}">
                    <span>${s.ikonka}</span>
                    <span data-i18n="${s.i18nKalit}">${global.TilVaTarjimalar.matn(s.i18nKalit, joriyTil) || s.qisqaNomi}</span>
                  </a>
                `).join("")}
              </nav>
            </div>
          </div>

          <!-- 3-QAVAT: JORIY BO'LIM YO'L KO'RSATKICHI VA RUBRIKA BO'LIMLARI PILLARI -->
          <div class="kun-subbar">
            <div class="kun-subbar-inner">
              <div class="kun-breadcrumb">
                <a href="${this.sahifaManziliniOlish("Asosiy_sahifa.html")}" style="color:var(--accent-primary); font-weight:800;">
                  🏠 <span data-i18n="subbar_home">${global.TilVaTarjimalar.matn("subbar_home", joriyTil)}</span>
                </a>
                <span>/</span>
                <span data-i18n="rubric_${joriySahifa.kategoriyaId}">${global.TilVaTarjimalar.matn("rubric_" + joriySahifa.kategoriyaId, joriyTil)}</span>
                <span>/</span>
                ${joriySahifa.faqatAdmin && !adminFaol
                  ? `<strong>🔒 Cheklangan bo'lim</strong>`
                  : `<strong>${joriySahifa.ikonka} <span data-i18n="${joriySahifa.i18nKalit}">${global.TilVaTarjimalar.matn(joriySahifa.i18nKalit, joriyTil) || joriySahifa.nomi}</span></strong>`}
              </div>

              <div class="kun-rubric-sibling-pills" aria-label="Joriy yo'nalishdagi bo'limlar">
                ${shuRubrikaSahifalari.map(sib => `
                  <a href="${this.sahifaManziliniOlish(sib.fayl)}"
                     class="kun-sibling-pill ${sib.id === faolSahifaId ? "active" : ""}"
                     title="${sib.nomi}">
                    <span>${sib.ikonka}</span>
                    <span data-i18n="${sib.i18nKalit}">${global.TilVaTarjimalar.matn(sib.i18nKalit, joriyTil) || sib.qisqaNomi}</span>
                  </a>
                `).join("")}
                <a href="${this.sahifaManziliniOlish("Qidiruv_va_Mundarija_sahifasi.html")}" class="kun-sibling-pill" style="color:var(--accent-primary); font-weight:800;">
                  🔍 <span data-i18n="subbar_search">${global.TilVaTarjimalar.matn("subbar_search", joriyTil)}</span>
                </a>
                <a href="${this.sahifaManziliniOlish("Sozlamalar_sahifasi.html")}" class="kun-sibling-pill" style="color:var(--accent-primary); font-weight:800;">
                  ⚙️ <span data-i18n="nav_settings">${global.TilVaTarjimalar.matn("nav_settings", joriyTil)}</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <!-- MUNDARIJA (SAHIFALAR XARITASI) DRAWER OYNASI — 4 KATEGORIYAGA AJRATILGAN -->
        <div class="mundarija-drawer-backdrop" id="mundarija-oynasi">
          <aside class="mundarija-drawer" aria-label="Sayt Mundarijasi">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; padding-bottom:0.85rem; border-bottom:2px solid var(--border-color);">
              <div>
                <h2 style="font-size:1.22rem; font-weight:900;">🧭 Barcha Bo'limlar Mundarijasi (${korinadiganlar.length})</h2>
                <div style="font-size:0.8rem; color:var(--text-muted);">Kun.uz uslubida 4 ta yo'nalishga tartiblangan</div>
              </div>
              <button type="button" class="btn btn-outline" id="mundarija-yopish-btn" style="padding:0.45rem 0.85rem;">✕</button>
            </div>

            <div style="margin-bottom:1.15rem;">
              <input type="search" id="mundarija-qidiruv-input" class="form-input" placeholder="Bo'lim yoki sahifa nomini yozing (masalan: Sozlamalar, Duel)..." />
            </div>

            <div id="mundarija-royxat-konteyner">
              ${RUBRIKALAR_GURUHI.map(rub => {
                const guruhSahifalari = korinadiganlar.filter(s => s.kategoriyaId === rub.id);
                return `
                  <div class="mundarija-group-section">
                    <div class="mundarija-group-title">${rub.sarlavha}</div>
                    ${guruhSahifalari.map(s => `
                      <a href="${this.sahifaManziliniOlish(s.fayl)}"
                         class="mundarija-item-card"
                         data-mundarija-text="${(s.nomi + " " + s.qisqaNomi + " " + s.tavsif + " " + s.papka).toLowerCase()}">
                        <div class="mundarija-item-num">${s.raqam}</div>
                        <div style="flex:1;">
                          <div style="font-weight:800; font-size:0.95rem; margin-bottom:0.15rem;">${s.ikonka} ${s.nomi}</div>
                          <div style="font-size:0.74rem; color:var(--accent-primary); font-weight:700; margin-bottom:0.2rem;">📂 ${s.papka}/${s.fayl}</div>
                          <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.45;">${s.tavsif}</div>
                        </div>
                      </a>
                    `).join("")}
                  </div>
                `;
              }).join("")}
            </div>
          </aside>
        </div>
        `;
      }

      // Saytning pastki qismida alohida SERTIFIKAT OLISH BO'LIMI va Kun.uz uslubidagi Footer chizish
      const footerEl = document.getElementById("umumiy-pastki-qism-joyi");
      if (footerEl) {
        footerEl.innerHTML = `
        <section class="bottom-certificate-section" aria-label="Milliy Sertifikat olish bo'limi">
          <div class="bottom-certificate-card">
            <div style="max-width:740px;">
              <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(251,191,36,0.2); color:#fde047; padding:0.35rem 0.85rem; border-radius:6px; font-weight:800; font-size:0.82rem; margin-bottom:0.75rem;">
                🏆 O'ZBEKISTON MILLIY SERTIFIKAT TIZIMI (A+, A, B+, B, C+, C)
              </div>
              <h2 style="font-size:1.55rem; font-weight:900; margin-bottom:0.65rem;" data-i18n="bottom_cert_title">
                ${global.TilVaTarjimalar.matn("bottom_cert_title", joriyTil)}
              </h2>
              <p style="opacity:0.92; font-size:0.96rem; line-height:1.65;" data-i18n="bottom_cert_desc">
                ${global.TilVaTarjimalar.matn("bottom_cert_desc", joriyTil)}
              </p>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <a href="${this.sahifaManziliniOlish("Sertifikat_olish_sahifasi.html")}" class="btn btn-amber" style="font-size:1.02rem; padding:0.95rem 1.75rem;">
                <span data-i18n="bottom_cert_btn">${global.TilVaTarjimalar.matn("bottom_cert_btn", joriyTil)}</span>
              </a>
              <a href="${this.sahifaManziliniOlish("Sertifikat_tekshirish_sahifasi.html")}" class="btn btn-white" style="font-size:0.9rem; padding:0.7rem 1.25rem;">
                🔍 Sertifikat ID haqiqiyligini tekshirish
              </a>
            </div>
          </div>
        </section>

        <footer class="site-footer">
          <div style="max-width:1380px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.25rem;">
            <div>
              <strong style="color:var(--text-primary); font-size:1rem;">ALGEMATH.UZ PORTALI</strong> — 17 ta mustaqil moduldan iborat Matematika, Algebra va Milliy Sertifikat platformasi.
            </div>
            <div style="display:flex; gap:1.25rem; flex-wrap:wrap;">
              <a href="${this.sahifaManziliniOlish("Sozlamalar_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">⚙️ Sozlamalar</a>
              <a href="${this.sahifaManziliniOlish("Olmoslar_dukoni_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">💎 Olmoslar Do'koni</a>
              <a href="${this.sahifaManziliniOlish("Matematik_duel_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">⚔️ 1v1 Duel</a>
              <a href="${this.sahifaManziliniOlish("Grafik_va_Formulalar_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">📈 Grafik Chizuvchi</a>
              <a href="${this.sahifaManziliniOlish("Obuna_va_Tolov_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">💰 PRO Obuna</a>
            </div>
          </div>

          <div class="footer-creator-bar">
            <div class="footer-creator-info">
              <span>© 2026 <strong>AlgeMath UZ</strong></span>
              <span class="footer-dot">•</span>
              <span data-i18n="footer_creator_role">${global.TilVaTarjimalar.matn("footer_creator_role", joriyTil)}</span>
              <span class="footer-creator-badge">
                👨‍💻 To'ychiyev Otabek
              </span>
              <span class="footer-dot">•</span>
              <span data-i18n="footer_rights">${global.TilVaTarjimalar.matn("footer_rights", joriyTil)}</span>
            </div>
            <div class="footer-creator-links">
              <a href="https://github.com/BekCoderX01" target="_blank" rel="noopener noreferrer" class="footer-social-btn footer-social-github" title="GitHub: BekCoderX01">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
                <span>GitHub (@BekCoderX01)</span>
              </a>
              <a href="https://t.me/Tuychiyev_c" target="_blank" rel="noopener noreferrer" class="footer-social-btn footer-social-telegram" title="Telegram: @Tuychiyev_c">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                <span>Telegram (@Tuychiyev_c)</span>
              </a>
              <a href="https://instagram.com/tuychiyev_2009" target="_blank" rel="noopener noreferrer" class="footer-social-btn footer-social-instagram" title="Instagram: @tuychiyev_2009">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                <span>Instagram (@tuychiyev_2009)</span>
              </a>
            </div>
          </div>
        </footer>
        `;
      }

      // Yuqori bardagi til almashtirish tugmalari
      if (headerEl) {
        headerEl.querySelectorAll("[data-top-lang]").forEach(btn => {
          btn.addEventListener("click", () => {
            const tanlanganTil = btn.getAttribute("data-top-lang");
            global.TilVaTarjimalar.tilniOzgartirish(tanlanganTil);
            this.navigatsiyaniChizish(faolSahifaId);
            if (faolSahifaId === "settings" && global.SozlamalarVaProfil) {
              global.SozlamalarVaProfil.sozlamalarSahifasiniChizish();
            }
          });
        });
      }

      // Mundarija oynasi hodisalari
      const ochishBtn = document.getElementById("mundarija-ochish-btn");
      const yopishBtn = document.getElementById("mundarija-yopish-btn");
      const oyna = document.getElementById("mundarija-oynasi");
      const qidiruvInput = document.getElementById("mundarija-qidiruv-input");

      if (ochishBtn && oyna) {
        ochishBtn.addEventListener("click", () => oyna.classList.add("open"));
      }
      if (yopishBtn && oyna) {
        yopishBtn.addEventListener("click", () => oyna.classList.remove("open"));
      }
      if (oyna) {
        oyna.addEventListener("click", (e) => {
          if (e.target === oyna) oyna.classList.remove("open");
        });
      }
      if (qidiruvInput) {
        qidiruvInput.addEventListener("input", () => {
          const soz = qidiruvInput.value.trim().toLowerCase();
          document.querySelectorAll("#mundarija-royxat-konteyner .mundarija-item-card").forEach(karta => {
            const matn = karta.getAttribute("data-mundarija-text") || "";
            karta.style.display = matn.includes(soz) ? "flex" : "none";
          });
        });
      }

      const rejimBtn = document.getElementById("tezkor-rejim-btn");
      if (rejimBtn) {
        rejimBtn.addEventListener("click", () => {
          const tungi = global.UmumiyHolatVaBazalar.tungiRejimniAlmashtirish();
          rejimBtn.textContent = tungi ? "☀️" : "🌙";
          if (typeof window !== "undefined" && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent("rejimOzgardi", { detail: { tungiRejim: tungi } }));
          }
          if (faolSahifaId === "settings" && global.SozlamalarVaProfil) {
            global.SozlamalarVaProfil.sozlamalarSahifasiniChizish();
          }
        });
      }

      global.OlmoslarVaVaqtTizimi.kunlikKirishBonusiniTekshirish();
      global.OlmoslarVaVaqtTizimi.kunlikTaymerniBoshlash();
      global.TilVaTarjimalar.sahifadagiMatnlarniYangilash();
    }
  };

  global.MundarijaVaNavigatsiya = MundarijaVaNavigatsiya;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MundarijaVaNavigatsiya;
  }
})(typeof window !== "undefined" ? window : globalThis);
