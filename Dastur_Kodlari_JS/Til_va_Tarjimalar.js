/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Til_va_Tarjimalar.js
   VAZIFASI: Saytni O'zbek (🇺🇿 O'zbekiston bayrog'i), Rus (🇷🇺 Rossiya bayrog'i)
             va Ingliz (🇺🇸 Amerika bayrog'i) tillarida ishlatish lug'ati va
             tilni almashtirish funksiyalari.
   ========================================================================== */

(function (global) {
  const TILLAR_ROYXATI = [
    {
      kod: "uz",
      nomi: "O'zbek tili",
      qisqaNomi: "O'ZB",
      davlat: "O'zbekiston bayrog'i",
      emojiBayroq: "🇺🇿"
    },
    {
      kod: "ru",
      nomi: "Русский язык",
      qisqaNomi: "РУС",
      davlat: "Флаг России",
      emojiBayroq: "🇷🇺"
    },
    {
      kod: "en",
      nomi: "English (USA)",
      qisqaNomi: "ENG",
      davlat: "Amerika (AQSh) bayrog'i",
      emojiBayroq: "🇺🇸"
    }
  ];

  const TARJIMALAR = {
    uz: {
      app_name: "AlgeMath UZ",
      app_tagline: "Matematika va Algebrani 0 dan A+ Milliy Sertifikatgacha o'rganing!",
      nav_home: "Asosiy sahifa",
      nav_learn: "0 dan o'rganish",
      nav_tests: "Darajali Testlar",
      nav_certificate: "Sertifikat (45 test)",
      nav_search: "Qidiruv va Mundarija",
      nav_profile: "Profil va Olmoslar",
      nav_settings: "Sozlamalar",
      nav_admin: "Admin Panel",
      nav_login: "Kirish",
      btn_mundarija: "Mundarija",
      stat_diamonds: "Olmoslar",
      stat_today_time: "Bugun ishlagan vaqtingiz",
      theme_light: "Kunduzgi rejim",
      theme_dark: "Tungi rejim",
      hero_badge: "✨ O'zbekiston Milliy Sertifikat standartiga mos platforma",
      hero_title: "Matematika va Algebrani o'rganing, misollar yeching va A+ Sertifikat oling!",
      hero_subtitle: "O'quvchilar va ustozlar uchun darajali testlar (C dan A+ gacha), 0 dan o'rganish darslari, har kungi +5 💎 olmos mukofoti va 45 talik Milliy Sertifikat imtihoni.",
      btn_start_learn: "📚 0 dan o'rganishni boshlash",
      btn_start_test: "🧮 Bilim darajasini sinash",
      btn_get_cert: "🏆 45 talik Sertifikat topshirish",
      bottom_cert_title: "🎓 O'zbekiston Milliy Sertifikat (A+, A, B+, B, C+, C) bo'limi",
      bottom_cert_desc: "Ism va familiyangizni kiriting, 15 ta oson (o'ylantiradigan), 15 ta o'rtacha va 15 ta qiyin — jami 45 ta matematik testni yechib, rasmiy darajali sertifikat va 100 tagacha 💎 olmos yutib oling!",
      bottom_cert_btn: "Sertifikat imtihoniga o'tish →",
      daily_bonus_toast: "🎉 Kunlik tashrif uchun +5 ta Olmos (💎) profilingizga qo'shildi!",
      settings_title: "⚙️ Tizim va Profil Sozlamalari",
      settings_theme_label: "Sayt ko'rinishi (Tungi yoki Kunduzgi rejim)",
      settings_lang_label: "Sayt tilini tanlang (Davlat bayrog'i bilan)",
      settings_profile_label: "Shaxsiy profilni boshqarish (Rasm, BIO, Jins)",
      gender_male: "Erkak",
      gender_female: "Ayol",
      role_student: "O'quvchi",
      role_teacher: "Ustoz (O'qituvchi)",
      role_admin: "Administrator",
      save_btn: "O'zgarishlarni saqlash",
      search_placeholder: "Mavzu, formula, daraja (A+, B...) yoki sahifa nomini qidiring..."
    },
    ru: {
      app_name: "AlgeMath UZ",
      app_tagline: "Изучайте математику и алгебру с нуля до Национального Сертификата A+!",
      nav_home: "Главная",
      nav_learn: "Обучение с 0",
      nav_tests: "Тесты по уровням",
      nav_certificate: "Сертификат (45 тестов)",
      nav_search: "Поиск и Оглавление",
      nav_profile: "Профиль и Алмазы",
      nav_settings: "Настройки",
      nav_admin: "Админ Панель",
      nav_login: "Вход",
      btn_mundarija: "Оглавление",
      stat_diamonds: "Алмазы",
      stat_today_time: "Время решения сегодня",
      theme_light: "Дневной режим",
      theme_dark: "Ночной режим",
      hero_badge: "✨ Платформа по стандарту Национального Сертификата Узбекистана",
      hero_title: "Изучайте математику и алгебру, решайте задачи и получите сертификат A+!",
      hero_subtitle: "Уровневые тесты для учеников и учителей (от C до A+), уроки с нуля с подсказками без готовых ответов, +5 💎 алмазов каждый день и экзамен из 45 вопросов.",
      btn_start_learn: "📚 Начать обучение с 0",
      btn_start_test: "🧮 Проверить уровень знаний",
      btn_get_cert: "🏆 Сдать тест на Сертификат (45)",
      bottom_cert_title: "🎓 Раздел Национального Сертификата (A+, A, B+, B, C+, C)",
      bottom_cert_desc: "Введите имя и фамилию, решите 45 тестов (15 легких на логику, 15 средних и 15 сложных) и получите именной сертификат и до 100 💎 алмазов!",
      bottom_cert_btn: "Перейти к экзамену на Сертификат →",
      daily_bonus_toast: "🎉 Ежедневный бонус: +5 Алмазов (💎) зачислено в ваш профиль!",
      settings_title: "⚙️ Настройки системы и профиля",
      settings_theme_label: "Тема оформления (Дневной или Ночной режим)",
      settings_lang_label: "Выберите язык сайта (с флагом государства)",
      settings_profile_label: "Управление профилем (Фото, БИО, Пол)",
      gender_male: "Мужской",
      gender_female: "Женский",
      role_student: "Ученик",
      role_teacher: "Учитель (Преподаватель)",
      role_admin: "Администратор",
      save_btn: "Сохранить изменения",
      search_placeholder: "Поиск тем, формул, уровней (A+, B...) или страниц..."
    },
    en: {
      app_name: "AlgeMath UZ",
      app_tagline: "Master Mathematics & Algebra from 0 to A+ National Certificate!",
      nav_home: "Home",
      nav_learn: "Learn from 0",
      nav_tests: "Level Tests",
      nav_certificate: "Certificate (45 Qs)",
      nav_search: "Search & Directory",
      nav_profile: "Profile & Diamonds",
      nav_settings: "Settings",
      nav_admin: "Admin Panel",
      nav_login: "Login",
      btn_mundarija: "Directory",
      stat_diamonds: "Diamonds",
      stat_today_time: "Solved Today",
      theme_light: "Day (Light) Mode",
      theme_dark: "Night (Dark) Mode",
      hero_badge: "✨ Built on Uzbekistan's National Math Certificate Standard",
      hero_title: "Learn Math & Algebra, Solve Problems, and Earn Your A+ Certificate!",
      hero_subtitle: "Adaptive tests for students and teachers (C to A+), zero-to-hero lessons with conceptual hints, +5 💎 daily login diamonds, and the 45-question Certificate Exam.",
      btn_start_learn: "📚 Start Learning from 0",
      btn_start_test: "🧮 Take a Level Test",
      btn_get_cert: "🏆 Take 45-Question Certificate Exam",
      bottom_cert_title: "🎓 National Certificate Exam Section (A+, A, B+, B, C+, C)",
      bottom_cert_desc: "Enter your first and last name, solve 45 math problems (15 thought-provoking easy, 15 medium, 15 hard), and earn your graded certificate plus up to 100 💎 diamonds!",
      bottom_cert_btn: "Go to Certificate Exam →",
      daily_bonus_toast: "🎉 Daily login bonus: +5 Diamonds (💎) added to your profile!",
      settings_title: "⚙️ System & Profile Settings",
      settings_theme_label: "Appearance (Day / Night Mode)",
      settings_lang_label: "Select Website Language (with Country Flag)",
      settings_profile_label: "Manage Personal Profile (Photo, BIO, Gender)",
      gender_male: "Male",
      gender_female: "Female",
      role_student: "Student",
      role_teacher: "Teacher / Instructor",
      role_admin: "Administrator",
      save_btn: "Save Changes",
      search_placeholder: "Search lessons, formulas, grades (A+, B...) or pages..."
    }
  };

  const TilVaTarjimalar = {
    tillarRoyxati: TILLAR_ROYXATI,
    tarjimalar: TARJIMALAR,

    joriyTilniOlish: function () {
      try {
        if (typeof localStorage !== "undefined") {
          const saqlangan = localStorage.getItem("algemath_til");
          if (saqlangan && TARJIMALAR[saqlangan]) return saqlangan;
        }
      } catch (e) {}
      return "uz";
    },

    tilniOzgartirish: function (yangiTilKodi) {
      if (!TARJIMALAR[yangiTilKodi]) return false;
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("algemath_til", yangiTilKodi);
        }
      } catch (e) {}
      this.sahifadagiMatnlarniYangilash();
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("tilOzgardi", { detail: { til: yangiTilKodi } }));
      }
      return true;
    },

    matn: function (kalit, tilKodi) {
      const til = tilKodi || this.joriyTilniOlish();
      const lugat = TARJIMALAR[til] || TARJIMALAR.uz;
      return lugat[kalit] || TARJIMALAR.uz[kalit] || kalit;
    },

    bayroqHtmlOlish: function (tilKodi) {
      const kod = tilKodi || this.joriyTilniOlish();
      if (global.RasmlarVaBelgilar && global.RasmlarVaBelgilar.bayroqlar[kod]) {
        return global.RasmlarVaBelgilar.bayroqlar[kod];
      }
      const topilgan = TILLAR_ROYXATI.find(t => t.kod === kod);
      return topilgan ? topilgan.emojiBayroq : "🇺🇿";
    },

    sahifadagiMatnlarniYangilash: function () {
      if (typeof document === "undefined") return;
      const til = this.joriyTilniOlish();
      document.documentElement.lang = til;
      const elementlar = document.querySelectorAll("[data-i18n]");
      elementlar.forEach(el => {
        const kalit = el.getAttribute("data-i18n");
        if (kalit) {
          el.textContent = this.matn(kalit, til);
        }
      });
      const placeholderlar = document.querySelectorAll("[data-i18n-placeholder]");
      placeholderlar.forEach(el => {
        const kalit = el.getAttribute("data-i18n-placeholder");
        if (kalit) {
          el.setAttribute("placeholder", this.matn(kalit, til));
        }
      });
    }
  };

  global.TilVaTarjimalar = TilVaTarjimalar;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = TilVaTarjimalar;
  }
})(typeof window !== "undefined" ? window : globalThis);
