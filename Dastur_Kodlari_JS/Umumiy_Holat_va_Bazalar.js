/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Umumiy_Holat_va_Bazalar.js
   VAZIFASI: Foydalanuvchi profili, olmoslari, ishlagan vaqti, olingan
             sertifikatlari, o'zlashtirilgan darslari, hamda 8 ta yangi
             startup modullari (Olmoslar do'koni, Duel, Grafik, Turnir/Streak,
             Ustoz sinfxonasi, Xatolar daftari, Sertifikat tekshiruvi, PRO obuna)
             ma'lumotlarini saqlash va Server API bilan sinxronlash.
   ========================================================================== */

(function (global) {
  const STORAGE_KEY = "algemath_uz_asosiy_baza_v1";

  const STANDART_FOYDALANUVCHI = {
    id: "user_default_1",
    ism: "Sardorbek",
    familiya: "Alimov",
    rol: "O'quvchi", // "O'quvchi" | "Ustoz" | "Admin"
    jins: "Erkak",   // "Erkak" | "Ayol"
    bio: "Matematika va Algebrani 0 dan A+ Milliy Sertifikat darajasigacha o'rganyapman! Maqsadim — xalqaro olimpiada va grant.",
    avatar: "👨‍🎓",
    avatarRasmUrl: "",
    kirishUsuli: "Telefon raqam (+998 90 123-45-67)",
    telefon: "+998 90 123 45 67",
    email: "sardorbek@algemath.uz",
    instagram: "@sardor_math_uz",
    viloyat: "Toshkent shahri",
    tanlanganDaraja: "B",
    maqsadDaraja: "A+",
    olmoslar: 65,
    oxirgiKunlikBonusSana: "",
    olmoslarTarixi: [
      { sana: "2026-11-15 09:00", miqdor: 50, sabab: "Ro'yxatdan o'tish va boshlang'ich startup rag'bati" },
      { sana: "2026-11-15 09:05", miqdor: 15, sabab: "Kunlik tashrif va dastlabki faollik bonusi" }
    ],
    ozlashtirilganDarslar: ["dars_c_1"],
    yechilganTestlarSoni: 2,
    togriJavoblarSoni: 17,
    sertifikatlar: [],
    // Yangi 8 ta modul uchun foydalanuvchi maydonlari:
    xaridlar: ["item_title_xorazmiy"],
    faolUnvon: "🌟 Al-Xorazmiy izdoshi",
    faolRamka: "Oltin ramka",
    kunlikZanjirSoni: 5, // 🔥 5 kunlik streak
    haftalikBonusOlindi: false,
    obunaTarifi: "Bepul", // "Bepul" | "O'quvchi PRO" | "Ustoz Ekspert PRO"
    obunaTugashSana: "",
    qoShilganSinfKodi: "MATH-77",
    xatolarDaftari: [
      {
        id: "err_init_1",
        savolId: "cert_18",
        manba: "Logarifmik tenglamalar (B+/A daraja)",
        savol: "log₂(x) + log₄(x) + log₁₆(x) = 7 tenglamaning ildizini toping.",
        variantlar: ["16", "8", "32", "4"],
        togriIndex: 0,
        tanlanganXatoIndex: 1,
        yordam_eslatma: "Xotira qoidasi (Memory): log_(a^k)(x) = (1/k)·log_a(x) asos darajasini oldinga chiqarish formulasidan foydalanib, barcha logarifmlarni 2 asosga keltiring.",
        tuzatildi: false
      },
      {
        id: "err_init_2",
        savolId: "cert_19",
        manba: "Kublar yig'indisi va Viyet teoremasi (B daraja)",
        savol: "x² - 4x + 1 = 0 tenglamaning ildizlari x₁ va x₂ bo'lsa, x₁³ + x₂³ ning qiymatini toping.",
        variantlar: ["52", "64", "48", "56"],
        togriIndex: 0,
        tanlanganXatoIndex: 1,
        yordam_eslatma: "Xotira qoidasi (Memory): x₁³ + x₂³ = (x₁ + x₂)³ - 3·x₁·x₂·(x₁ + x₂) ayniyatga Viyet teoremasi orqali yig'indi va ko'paytmani qo'ying.",
        tuzatildi: false
      }
    ],
    duellarTarixi: [
      {
        sana: "2026-11-15",
        raqib: "Algoritm Bot (B daraja)",
        hisob: "4 : 3",
        natija: "G'alaba",
        yutuqOlmos: 20
      }
    ]
  };

  const STANDART_TIZIM_BAZASI = {
    joriyFoydalanuvchi: { ...STANDART_FOYDALANUVCHI },
    tungiRejim: false,
    til: "uz",
    bugungiIshlanganSekundlar: 940,
    oxirgiVaqtSana: new Date().toISOString().slice(0, 10),
    foydalanuvchilarRoyxati: [
      { ...STANDART_FOYDALANUVCHI },
      {
        id: "user_2",
        ism: "Dilnoza",
        familiya: "Karimova",
        rol: "Ustoz",
        jins: "Ayol",
        viloyat: "Samarqand viloyati",
        bio: "Oliy toifali matematika ustozi, A+ Milliy Sertifikat sohibasi (96 ball).",
        avatar: "👩‍🏫",
        kirishUsuli: "Google (dilnoza.math@gmail.com)",
        olmoslar: 240,
        kunlikZanjirSoni: 14,
        tanlanganDaraja: "A+",
        faolUnvon: "👑 A+ Milliy Sertifikat Ustozi",
        obunaTarifi: "Ustoz Ekspert PRO"
      },
      {
        id: "user_3",
        ism: "Javohir",
        familiya: "Tursunov",
        rol: "O'quvchi",
        jins: "Erkak",
        viloyat: "Farg'ona viloyati",
        bio: "Algebra va sonlar nazariyasi ishqibozi.",
        avatar: "🚀",
        kirishUsuli: "Instagram (@javohir_algebra)",
        olmoslar: 165,
        kunlikZanjirSoni: 9,
        tanlanganDaraja: "A",
        faolUnvon: "⚔️ Matematik Duel Chempioni",
        obunaTarifi: "O'quvchi PRO"
      },
      {
        id: "user_4",
        ism: "Madina",
        familiya: "Rustamova",
        rol: "O'quvchi",
        jins: "Ayol",
        viloyat: "Buxoro viloyati",
        bio: "0 dan B+ darajagacha barcha darslarni tugatdim!",
        avatar: "👩‍🎓",
        kirishUsuli: "Email (madina@mail.uz)",
        olmoslar: 130,
        kunlikZanjirSoni: 7,
        tanlanganDaraja: "B+",
        faolUnvon: "🔥 7 Kunlik Zanjir Sohibasi",
        obunaTarifi: "Bepul"
      },
      {
        id: "user_admin",
        ism: "Ulug'bek",
        familiya: "Mirzayev",
        rol: "Admin",
        jins: "Erkak",
        viloyat: "Toshkent shahri",
        bio: "AlgeMath UZ platformasi bosh administratori va metodisti.",
        avatar: "🛡️",
        kirishUsuli: "Email (admin@algemath.uz)",
        email: "admin@algemath.uz",
        olmoslar: 300,
        kunlikZanjirSoni: 21,
        tanlanganDaraja: "A+",
        faolUnvon: "🛡️ Platforma Administratori",
        obunaTarifi: "Ustoz Ekspert PRO"
      }
    ],
    qoshimchaAdminSavollar: [],
    berilganSertifikatlarArxivi: [
      {
        sertifikatId: "MS-UZ-2026-1001",
        ismFamiliya: "Dilnoza Karimova",
        rol: "Ustoz",
        daraja: "A+",
        togriSoni: 43,
        jamiSavol: 45,
        foiz: 95.6,
        osonTogri: 15,
        ortachaTogri: 15,
        qiyinTogri: 13,
        sana: "2026-11-14"
      },
      {
        sertifikatId: "MS-UZ-2026-1002",
        ismFamiliya: "Javohir Tursunov",
        rol: "O'quvchi",
        daraja: "A",
        togriSoni: 37,
        jamiSavol: 45,
        foiz: 82.2,
        osonTogri: 15,
        ortachaTogri: 13,
        qiyinTogri: 9,
        sana: "2026-11-15"
      }
    ],
    ustozSinfxonalari: [
      {
        sinfKodi: "MATH-77",
        sinfNomi: "A+ Milliy Sertifikat Tayyorlov Guruhi",
        ustozIsmi: "Dilnoza Karimova",
        daraja: "B+",
        vazifaMavzusi: "Kvadrat tenglamalar, Viyet teoremasi va Progressiyalar (10 talik uyga vazifa)",
        mukofotOlmos: 25,
        muddat: "2026-11-20",
        oquvchilarNatijalari: [
          { ismFamiliya: "Javohir Tursunov", holat: "Bajarildi", ball: "10 / 10 (100%)", sana: "2026-11-15" },
          { ismFamiliya: "Madina Rustamova", holat: "Bajarildi", ball: "9 / 10 (90%)", sana: "2026-11-15" },
          { ismFamiliya: "Sardorbek Alimov", holat: "Kutilmoqda", ball: "—", sana: "—" }
        ]
      }
    ],
    tolovSorovlari: [],
    ishlatilganTranzaksiyalar: [],
    tolovRekvizitlari: {
      kartaTuri: "HUMO",
      kartaRaqami: "9860 1201 7157 4847",
      qabulQiluvchi: "OTABEK TOYCHIYEV",
      telegramAloqa: "@Tuychiyev_c",
      izoh: "Istalgan ilova (Click, Payme, Uzum, Paynet, Bank ilovasi) va istalgan kartadan (HUMO/UZCARD) o'tkazma qiling."
    }
  };

  const UmumiyHolatVaBazalar = {
    standartBazaOlish: function () {
      return JSON.parse(JSON.stringify(STANDART_TIZIM_BAZASI));
    },

    darajaKlassiniOlish: function (daraja) {
      const xarita = {
        "C": "grade-C",
        "C+": "grade-Cplus",
        "B": "grade-B",
        "B+": "grade-Bplus",
        "A": "grade-A",
        "A+": "grade-Aplus"
      };
      return xarita[daraja] || "grade-C";
    },

    holatniYuklash: function () {
      try {
        if (typeof localStorage !== "undefined") {
          const saqlangan = localStorage.getItem(STORAGE_KEY);
          if (saqlangan) {
            const parsed = JSON.parse(saqlangan);
            const saqlanganRekvizit = parsed.tolovRekvizitlari || {};
            return {
              ...STANDART_TIZIM_BAZASI,
              ...parsed,
              joriyFoydalanuvchi: {
                ...STANDART_FOYDALANUVCHI,
                ...(parsed.joriyFoydalanuvchi || {})
              },
              ustozSinfxonalari: parsed.ustozSinfxonalari && parsed.ustozSinfxonalari.length
                ? parsed.ustozSinfxonalari
                : STANDART_TIZIM_BAZASI.ustozSinfxonalari,
              tolovSorovlari: Array.isArray(parsed.tolovSorovlari) ? parsed.tolovSorovlari : [],
              ishlatilganTranzaksiyalar: Array.isArray(parsed.ishlatilganTranzaksiyalar) ? parsed.ishlatilganTranzaksiyalar : [],
              tolovRekvizitlari: {
                ...STANDART_TIZIM_BAZASI.tolovRekvizitlari,
                ...saqlanganRekvizit,
                kartaTuri: saqlanganRekvizit.kartaTuri || STANDART_TIZIM_BAZASI.tolovRekvizitlari.kartaTuri,
                kartaRaqami: saqlanganRekvizit.kartaRaqami || STANDART_TIZIM_BAZASI.tolovRekvizitlari.kartaRaqami,
                qabulQiluvchi: saqlanganRekvizit.qabulQiluvchi && saqlanganRekvizit.qabulQiluvchi !== "To'ychiyev Otabek"
                  ? saqlanganRekvizit.qabulQiluvchi
                  : STANDART_TIZIM_BAZASI.tolovRekvizitlari.qabulQiluvchi
              }
            };
          }
        }
      } catch (e) {}
      return JSON.parse(JSON.stringify(STANDART_TIZIM_BAZASI));
    },

    holatniSaqlash: function (yangiHolat) {
      let saqlandi = true;
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(yangiHolat));
        }
      } catch (e) {
        saqlandi = false;
      }
      try {
        if (typeof fetch !== "undefined" && typeof window !== "undefined" && window.location && typeof window.location.protocol === "string" && window.location.protocol.startsWith("http")) {
          fetch("/api/sinxronlash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(yangiHolat)
          }).catch(() => {});
        }
      } catch (e) {}
      yangiHolat._oxirgiSaqlashMuvaffaqiyatli = saqlandi;
      return yangiHolat;
    },

    foydalanuvchiniYangilash: function (ozgarishlar) {
      const holat = this.holatniYuklash();
      holat.joriyFoydalanuvchi = {
        ...holat.joriyFoydalanuvchi,
        ...ozgarishlar
      };
      const idx = holat.foydalanuvchilarRoyxati.findIndex(u => u.id === holat.joriyFoydalanuvchi.id);
      if (idx >= 0) {
        holat.foydalanuvchilarRoyxati[idx] = { ...holat.foydalanuvchilarRoyxati[idx], ...holat.joriyFoydalanuvchi };
      } else {
        holat.foydalanuvchilarRoyxati.unshift({ ...holat.joriyFoydalanuvchi });
      }
      this.holatniSaqlash(holat);
      return holat.joriyFoydalanuvchi;
    },

    foydalanuvchigaOtish: function (malumot) {
      const holat = this.holatniYuklash();
      // Avval joriy foydalanuvchini ro'yxatda saqlab qo'yamiz
      const joriyIdx = holat.foydalanuvchilarRoyxati.findIndex(u => u.id === holat.joriyFoydalanuvchi.id);
      if (joriyIdx >= 0) {
        holat.foydalanuvchilarRoyxati[joriyIdx] = { ...holat.foydalanuvchilarRoyxati[joriyIdx], ...holat.joriyFoydalanuvchi };
      }

      // Tanlangan yoki yangi foydalanuvchini topamiz
      let mavjud = null;
      if (malumot && malumot.id) {
        mavjud = holat.foydalanuvchilarRoyxati.find(u => u.id === malumot.id);
      }
      if (!mavjud && malumot && malumot.ism && malumot.familiya) {
        mavjud = holat.foydalanuvchilarRoyxati.find(
          u => u.ism.toLowerCase() === malumot.ism.toLowerCase() && u.familiya.toLowerCase() === malumot.familiya.toLowerCase()
        );
      }

      if (mavjud) {
        holat.joriyFoydalanuvchi = {
          ...STANDART_FOYDALANUVCHI,
          ...mavjud,
          ...malumot,
          id: mavjud.id,
          olmoslar: typeof mavjud.olmoslar === "number" ? mavjud.olmoslar : STANDART_FOYDALANUVCHI.olmoslar
        };
      } else {
        const yangiId = (malumot && malumot.id) || ("user_" + Date.now());
        holat.joriyFoydalanuvchi = {
          ...STANDART_FOYDALANUVCHI,
          olmoslar: 20,
          oxirgiKunlikBonusSana: "",
          olmoslarTarixi: [
            { sana: new Date().toISOString().replace("T", " ").slice(0, 16), miqdor: 20, sabab: "Ro'yxatdan o'tish va boshlang'ich rag'bat" }
          ],
          ozlashtirilganDarslar: [],
          sertifikatlar: [],
          ...malumot,
          id: yangiId
        };
      }

      const yangiIdx = holat.foydalanuvchilarRoyxati.findIndex(u => u.id === holat.joriyFoydalanuvchi.id);
      if (yangiIdx >= 0) {
        holat.foydalanuvchilarRoyxati[yangiIdx] = { ...holat.joriyFoydalanuvchi };
      } else {
        holat.foydalanuvchilarRoyxati.unshift({ ...holat.joriyFoydalanuvchi });
      }
      this.holatniSaqlash(holat);
      return holat.joriyFoydalanuvchi;
    },

    // Xato qilingan savolni avtomatik "Xatolar daftari"ga qo'shish funksiyasi
    xatoniDaftargaQoshish: function (savolObj, tanlanganXatoIndex, manbaNomi) {
      if (!savolObj || !savolObj.savol) return;
      const holat = this.holatniYuklash();
      if (!Array.isArray(holat.joriyFoydalanuvchi.xatolarDaftari)) {
        holat.joriyFoydalanuvchi.xatolarDaftari = [];
      }
      const mavjud = holat.joriyFoydalanuvchi.xatolarDaftari.find(
        x => x.savolId === savolObj.id || x.savol === savolObj.savol
      );
      if (!mavjud) {
        holat.joriyFoydalanuvchi.xatolarDaftari.unshift({
          id: "err_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          savolId: savolObj.id || "q_custom",
          manba: manbaNomi || "Matematik test",
          savol: savolObj.savol,
          variantlar: savolObj.variantlar || ["A", "B", "C", "D"],
          togriIndex: typeof savolObj.togriIndex === "number" ? savolObj.togriIndex : 0,
          tanlanganXatoIndex: typeof tanlanganXatoIndex === "number" ? tanlanganXatoIndex : 1,
          yordam_eslatma: savolObj.yordam_eslatma || "Xotira qoidasi (Memory): Misol shartidagi ifodani algebraik ayniyatlar va tenglama qoidalari yordamida qadamma-qadam soddalashtiring.",
          tuzatildi: false
        });
        this.holatniSaqlash(holat);
      }
    },

    mavzuniQoLash: function () {
      if (typeof document === "undefined") return;
      const holat = this.holatniYuklash();
      const tungi = !!holat.tungiRejim;
      if (tungi) {
        document.documentElement.setAttribute("data-theme", "dark");
        document.body && document.body.classList.add("dark-mode");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        document.body && document.body.classList.remove("dark-mode");
      }
    },

    tungiRejimniAlmashtirish: function (qiymat) {
      const holat = this.holatniYuklash();
      holat.tungiRejim = typeof qiymat === "boolean" ? qiymat : !holat.tungiRejim;
      this.holatniSaqlash(holat);
      this.mavzuniQoLash();
      return holat.tungiRejim;
    },

    xabarnomaKorsatish: function (matn) {
      if (typeof document === "undefined") return;
      const mavjud = document.querySelector(".toast-notification");
      if (mavjud) mavjud.remove();
      const toast = document.createElement("div");
      toast.className = "toast-notification";
      toast.innerHTML = `<span>${matn}</span>`;
      document.body.appendChild(toast);
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 4200);
    }
  };

  global.UmumiyHolatVaBazalar = UmumiyHolatVaBazalar;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = UmumiyHolatVaBazalar;
  }
})(typeof window !== "undefined" ? window : globalThis);
