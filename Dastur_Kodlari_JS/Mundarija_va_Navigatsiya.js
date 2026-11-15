/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Mundarija_va_Navigatsiya.js
   VAZIFASI: Barcha 17 ta alohida sahifa va maxsus papkalarni (9 ta asosiy
             sahifa + 8 ta yangi Startup moduli papkalari) o'zaro bog'lovchi
             yuqori menyu, istalgan joydan 1 bosishda ochiladigan "MUNDARIJA"
             (sahifalar xaritasi) va pastki "Milliy Sertifikat" bloki.
   ========================================================================== */

(function (global) {
  // Barcha 17 ta alohida sahifa va papkalar ro'yxati (Mundarija uchun)
  const SAHIFALAR_MUNDARIJASI = [
    {
      raqam: "01",
      id: "home",
      papka: "Sahifalar",
      fayl: "Asosiy_sahifa.html",
      ikonka: "🏠",
      i18nKalit: "nav_home",
      nomi: "Asosiy sahifa va Kunlik Ko'rsatkichlar",
      tavsif: "Kunlik ishlangan vaqt, olmoslar hisobi, barcha 17 ta bo'limga tezkor kirish va statistika."
    },
    {
      raqam: "02",
      id: "learn",
      papka: "Sahifalar",
      fayl: "Noldan_urganish_sahifasi.html",
      ikonka: "📚",
      i18nKalit: "nav_learn",
      nomi: "Matematikani 0 dan O'rganish (C dan A+ gacha)",
      tavsif: "Maqsad darajani (masalan A+) tanlab, nazariy darslar va aniq javobsiz Yordam/Memory eslatmali 10 talik testlar yechish."
    },
    {
      raqam: "03",
      id: "tests",
      papka: "Sahifalar",
      fayl: "Test_yechish_sahifasi.html",
      ikonka: "🧮",
      i18nKalit: "nav_tests",
      nomi: "O'quvchi va Ustozlar uchun Darajali Testlar",
      tavsif: "O'quvchi yoki Ustoz maqomini va bilim darajasini (C, C+, B, B+, A, A+) tanlab mos testlarni ishlash."
    },
    {
      raqam: "04",
      id: "certificate",
      papka: "Sahifalar",
      fayl: "Sertifikat_olish_sahifasi.html",
      ikonka: "🏆",
      i18nKalit: "nav_certificate",
      nomi: "Milliy Sertifikat Imtihoni (45 talik test)",
      tavsif: "Ism-familiya kiritib, 15 ta oson (o'ylantiradigan), 15 ta o'rtacha va 15 ta qiyin testni yechish hamda A+..C sertifikat olish."
    },
    {
      raqam: "05",
      id: "shop",
      papka: "1_Olmoslar_Dukoni_Bulimi",
      fayl: "Olmoslar_dukoni_sahifasi.html",
      ikonka: "🛒",
      i18nKalit: "nav_shop",
      nomi: "1. 💎 Olmoslar Do'koni (Diamond Shop)",
      tavsif: "To'plangan olmoslarga PDF formula kitobchalar, Oltin profil ramkalari, VIP unvonlar va imtihon kuchaytirgichlarini xarid qilish."
    },
    {
      raqam: "06",
      id: "duel",
      papka: "2_Matematik_Duel_Bulimi",
      fayl: "Matematik_duel_sahifasi.html",
      ikonka: "⚔️",
      i18nKalit: "nav_duel",
      nomi: "2. ⚔️ 1 ga 1 Matematik Duel Arenasi",
      tavsif: "60 soniya ichida raqib bilan 5 ta algebra misolini tezlikka yechib, tikilgan olmoslarni 2 barobar qilib yutib olish!"
    },
    {
      raqam: "07",
      id: "graph",
      papka: "3_Grafik_va_Formulalar_Bulimi",
      fayl: "Grafik_va_Formulalar_sahifasi.html",
      ikonka: "📈",
      i18nKalit: "nav_graph",
      nomi: "3. 📈 Interaktiv Grafik Chizuvchi va Formula Doskasi",
      tavsif: "Parabola, chiziqli, sinus va logarifmik funksiyalar grafigini koordinata tekisligida jonli chizish hamda barcha formulalar to'plami."
    },
    {
      raqam: "08",
      id: "streak",
      papka: "4_Kunlik_Zanjir_va_Turnir_Bulimi",
      fayl: "Reyting_va_Turnir_sahifasi.html",
      ikonka: "🔥",
      i18nKalit: "nav_streak",
      nomi: "4. 🔥 Olovli Kunlar Zanjiri (Streak) va Viloyatlar Turniri",
      tavsif: "7 kunlik uzluksiz olovli seriya (+50 💎 super-bonus) hamda O'zbekistonning 14 hududi bo'yicha haftalik turnir jadvali."
    },
    {
      raqam: "09",
      id: "classroom",
      papka: "5_Ustoz_Sinfxonasi_Bulimi",
      fayl: "Ustoz_sinfxonasi_sahifasi.html",
      ikonka: "👨‍🏫",
      i18nKalit: "nav_classroom",
      nomi: "5. 👨‍🏫 Ustoz Xonasi — Sinf Kodi va Uyga Vazifalar",
      tavsif: "Ustozlar uchun 6 xonali sinf kodi (MATH-77) ochib uyga vazifa berish, o'quvchilar uchun sinfga qo'shilib vazifa topshirish."
    },
    {
      raqam: "10",
      id: "mistakes",
      papka: "6_Xatolar_Daftari_Bulimi",
      fayl: "Xatolar_daftari_sahifasi.html",
      ikonka: "📓",
      i18nKalit: "nav_mistakes",
      nomi: "6. 📸 Aqlli Xatolar Ustida Ishlash Daftari",
      tavsif: "Testlarda xato qilingan savollarni aniq javobsiz Yordam/Memory ko'magida qayta yechib tuzatish va har biriga +3 💎 olish."
    },
    {
      raqam: "11",
      id: "verify",
      papka: "7_Sertifikat_Tekshirish_Bulimi",
      fayl: "Sertifikat_tekshirish_sahifasi.html",
      ikonka: "✅",
      i18nKalit: "nav_verify",
      nomi: "7. 🔍 Milliy Sertifikat Haqiqiyligini Tekshirish",
      tavsif: "Sertifikat ID raqami (masalan MS-UZ-2026-1001) yoki ism-familiya orqali diplomning haqiqiyligi va ballarini rasmiy tekshirish."
    },
    {
      raqam: "12",
      id: "pricing",
      papka: "8_Obuna_va_Tolov_Bulimi",
      fayl: "Obuna_va_Tolov_sahifasi.html",
      ikonka: "💰",
      i18nKalit: "nav_pricing",
      nomi: "8. 💰 Startup Monetizatsiyasi (PRO Obuna: Click / Payme / Uzum)",
      tavsif: "Click, Payme, Uzum yoki to'plangan 200 💎 Olmos evaziga PRO tarifga o'tish va premium imkoniyatlarni ochish."
    },
    {
      raqam: "13",
      id: "search",
      papka: "Sahifalar",
      fayl: "Qidiruv_va_Mundarija_sahifasi.html",
      ikonka: "🔍",
      i18nKalit: "nav_search",
      nomi: "Qidiruv Bo'limi va To'liq Mundarija",
      tavsif: "Saytdagi barcha matematik mavzular, formulalar, testlar va 17 ta sahifani bir zumda topish."
    },
    {
      raqam: "14",
      id: "profile",
      papka: "Sahifalar",
      fayl: "Profil_va_Olmoslar_sahifasi.html",
      ikonka: "💎",
      i18nKalit: "nav_profile",
      nomi: "Shaxsiy Profil, Olmoslar va Vaqt Tarixi",
      tavsif: "To'plangan olmoslar (💎), faol unvon, ishlangan soat/daqiqalar va olingan sertifikatlar."
    },
    {
      raqam: "15",
      id: "settings",
      papka: "Sahifalar",
      fayl: "Sozlamalar_sahifasi.html",
      ikonka: "⚙️",
      i18nKalit: "nav_settings",
      nomi: "Sozlamalar (Tungi/Kunduzgi rejim, Tillar, Profil)",
      tavsif: "Tungi va kunduzgi rejim, O'zbek 🇺🇿 / Rus 🇷🇺 / Ingliz 🇺🇸 tillari, rasm qo'yish, BIO va jins (Erkak/Ayol) tanlash."
    },
    {
      raqam: "16",
      id: "login",
      papka: "Sahifalar",
      fayl: "Kirish_sahifasi.html",
      ikonka: "🔐",
      i18nKalit: "nav_login",
      nomi: "Kirish va Ro'yxatdan o'tish (Telefon, Google, Email, Instagram)",
      tavsif: "Telefon raqam, Google, Email yoki Instagram orqali o'quvchi, ustoz yoki admin sifatida tizimga kirish."
    },
    {
      raqam: "17",
      id: "admin",
      papka: "Sahifalar",
      fayl: "Admin_panel_sahifasi.html",
      ikonka: "🛡️",
      i18nKalit: "nav_admin",
      nomi: "Admin Panel (Boshqaruv markazi)",
      tavsif: "Foydalanuvchilarni boshqarish, yangi matematik test qo'shish, sertifikatlar reestri va olmos taqdim etish."
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

    // Yuqori navigatsiya va Mundarija oynasini chizish
    navigatsiyaniChizish: function (faolSahifaId) {
      if (typeof document === "undefined") return;

      global.UmumiyHolatVaBazalar.mavzuniQoLash();
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const foydalanuvchi = baza.joriyFoydalanuvchi;
      const joriyTil = global.TilVaTarjimalar.joriyTilniOlish();
      const bayroqHtml = global.TilVaTarjimalar.bayroqHtmlOlish(joriyTil);
      const vaqtMatn = global.OlmoslarVaVaqtTizimi.vaqtniFormatlash(baza.bugungiIshlanganSekundlar || 0);

      // Yuqori barda eng asosiy va yangi bo'limlar ko'rinib turadi, qolgan barchasi Mundarija tugmasida ham bor
      const headerEl = document.getElementById("umumiy-navigatsiya-joyi");
      if (headerEl) {
        headerEl.innerHTML = `
        <header class="top-navbar">
          <div class="navbar-container">
            <a href="${this.sahifaManziliniOlish("Asosiy_sahifa.html")}" class="brand-logo">
              <span class="brand-logo-icon">∑</span>
              <div>
                <div style="line-height:1.1;">AlgeMath <span style="color:var(--accent-primary);">UZ</span></div>
                <div style="font-size:0.72rem; font-weight:600; color:var(--text-muted);">
                  ${foydalanuvchi.obunaTarifi && foydalanuvchi.obunaTarifi !== "Bepul" ? `👑 ${foydalanuvchi.obunaTarifi}` : "Matematika & Algebra"}
                </div>
              </div>
            </a>

            <nav class="nav-links" aria-label="Asosiy sahifalar menyusi">
              ${SAHIFALAR_MUNDARIJASI.map(s => `
                <a href="${this.sahifaManziliniOlish(s.fayl)}"
                   class="nav-link-item ${faolSahifaId === s.id ? "active" : ""}"
                   title="${s.nomi}">
                  <span>${s.ikonka}</span>
                  <span>${s.nomi.replace(/^\d+\.\s*[^\s]+\s*/, "").split(" (")[0]}</span>
                </a>
              `).join("")}
            </nav>

            <div class="navbar-stats-bar">
              <!-- MUNDARIJA TUGMASI -->
              <button type="button" class="mundarija-toggle-btn" id="mundarija-ochish-btn" title="Barcha 17 ta sahifa mundarijasi">
                <span>🧭</span>
                <span>Mundarija (17)</span>
              </button>

              <!-- OLOVLI STREAK -->
              <a href="${this.sahifaManziliniOlish("Reyting_va_Turnir_sahifasi.html")}" class="stat-pill" title="Kunlik olovli zanjir (Streak)" style="color:#ea580c; border-color:rgba(234,88,12,0.35);">
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
                ${global.RasmlarVaBelgilar ? global.RasmlarVaBelgilar.olmosBelgisi(18) : "💎"}
                <span data-live-diamonds>${foydalanuvchi.olmoslar || 0}</span>
              </a>

              <!-- TIL VA DAVLAT BAYROG'I -->
              <a href="${this.sahifaManziliniOlish("Sozlamalar_sahifasi.html")}" class="stat-pill" title="Tilni o'zgartirish (Sozlamalar)">
                ${bayroqHtml}
                <span style="text-transform:uppercase;">${joriyTil}</span>
              </a>

              <!-- TUNGI / KUNDUZGI REJIM TUGMASI -->
              <button type="button" class="theme-toggle-btn" id="tezkor-rejim-btn" title="Tungi yoki Kunduzgi rejimni almashtirish" aria-label="Mavzuni o'zgartirish">
                ${baza.tungiRejim ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </header>

        <!-- MUNDARIJA (SAHIFALAR XARITASI) DRAWER OYNASI -->
        <div class="mundarija-drawer-backdrop" id="mundarija-oynasi">
          <aside class="mundarija-drawer" aria-label="Sayt Mundarijasi">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
              <h2 style="font-size:1.2rem; font-weight:800;">🧭 Sayt Mundarijasi (17 ta Bo'lim)</h2>
              <button type="button" class="btn btn-outline" id="mundarija-yopish-btn" style="padding:0.4rem 0.8rem;">✕</button>
            </div>
            <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:1rem;">
              Har bir modul alohida papka va sahifada joylashgan. 1 bosishda o'ting:
            </p>
            <div style="margin-bottom:1.1rem;">
              <input type="search" id="mundarija-qidiruv-input" class="form-input" placeholder="Sahifa yoki modul nomini yozing..." />
            </div>
            <div id="mundarija-royxat-konteyner">
              ${SAHIFALAR_MUNDARIJASI.map(s => `
                <a href="${this.sahifaManziliniOlish(s.fayl)}" class="mundarija-item-card" data-mundarija-text="${(s.nomi + " " + s.tavsif + " " + s.papka).toLowerCase()}">
                  <div class="mundarija-item-num">${s.raqam}</div>
                  <div>
                    <div style="font-weight:800; font-size:0.94rem;">${s.ikonka} ${s.nomi}</div>
                    <div style="font-size:0.74rem; color:var(--accent-primary); font-weight:700;">📂 ${s.papka}/${s.fayl}</div>
                    <div style="font-size:0.78rem; color:var(--text-muted);">${s.tavsif}</div>
                  </div>
                </a>
              `).join("")}
            </div>
          </aside>
        </div>
        `;
      }

      // Saytning pastki qismida alohida SERTIFIKAT OLISH BO'LIMI va Footer chizish
      const footerEl = document.getElementById("umumiy-pastki-qism-joyi");
      if (footerEl) {
        footerEl.innerHTML = `
        <section class="bottom-certificate-section" aria-label="Milliy Sertifikat olish bo'limi">
          <div class="bottom-certificate-card">
            <div style="max-width:740px;">
              <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(251,191,36,0.2); color:#fde047; padding:0.35rem 0.85rem; border-radius:999px; font-weight:800; font-size:0.82rem; margin-bottom:0.75rem;">
                🏆 O'ZBEKISTON MILLIY SERTIFIKAT TIZIMI (A+, A, B+, B, C+, C)
              </div>
              <h2 style="font-size:1.55rem; font-weight:900; margin-bottom:0.6rem;" data-i18n="bottom_cert_title">
                ${global.TilVaTarjimalar.matn("bottom_cert_title", joriyTil)}
              </h2>
              <p style="opacity:0.9; font-size:0.96rem;" data-i18n="bottom_cert_desc">
                ${global.TilVaTarjimalar.matn("bottom_cert_desc", joriyTil)}
              </p>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              <a href="${this.sahifaManziliniOlish("Sertifikat_olish_sahifasi.html")}" class="btn btn-amber" style="font-size:1.05rem; padding:0.95rem 1.75rem;">
                <span data-i18n="bottom_cert_btn">${global.TilVaTarjimalar.matn("bottom_cert_btn", joriyTil)}</span>
              </a>
              <a href="${this.sahifaManziliniOlish("Sertifikat_tekshirish_sahifasi.html")}" class="btn btn-white" style="font-size:0.9rem; padding:0.65rem 1.25rem;">
                🔍 Sertifikat ID haqiqiyligini tekshirish
              </a>
            </div>
          </div>
        </section>

        <footer class="site-footer">
          <div style="max-width:1320px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
            <div>
              <strong>AlgeMath UZ Startup</strong> — 17 ta mustaqil moduldan iborat Matematika va Algebra ekotizimi.
            </div>
            <div style="display:flex; gap:1rem; flex-wrap:wrap;">
              <a href="${this.sahifaManziliniOlish("Olmoslar_dukoni_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">💎 Olmoslar Do'koni</a>
              <a href="${this.sahifaManziliniOlish("Matematik_duel_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">⚔️ 1v1 Duel</a>
              <a href="${this.sahifaManziliniOlish("Grafik_va_Formulalar_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">📈 Grafik Chizuvchi</a>
              <a href="${this.sahifaManziliniOlish("Obuna_va_Tolov_sahifasi.html")}" style="font-weight:700; color:var(--accent-primary);">💰 PRO Obuna</a>
            </div>
          </div>
        </footer>
        `;
      }

      // Hodisalarni ulash
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
