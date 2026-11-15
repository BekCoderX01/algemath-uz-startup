/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Olmoslar_va_Vaqt_tizimi.js
   VAZIFASI:
     1) O'quvchi yoki o'qituvchiga har bir kirgan kuniga +5 tadan olmos (💎) berish;
     2) Yechilgan testlar, o'zlashtirilgan darslar va olingan sertifikatlar
        uchun olmoslarni adolatli taqsimlash va profilda jamlash;
     3) Bir kunda necha soat va necha daqiqa misol ishlaganini real vaqtda
        hisoblab borish va ko'rsatish.
   ========================================================================== */

(function (global) {
  let vaqtIntervalId = null;

  const OlmoslarVaVaqtTizimi = {
    // 1. Har bir yangi kirgan kunda +5 ta olmos berish
    kunlikKirishBonusiniTekshirish: function () {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const bugun = new Date().toISOString().slice(0, 10);

      if (baza.joriyFoydalanuvchi.oxirgiKunlikBonusSana !== bugun) {
        baza.joriyFoydalanuvchi.oxirgiKunlikBonusSana = bugun;
        baza.joriyFoydalanuvchi.olmoslar = (baza.joriyFoydalanuvchi.olmoslar || 0) + 5;
        if (!Array.isArray(baza.joriyFoydalanuvchi.olmoslarTarixi)) {
          baza.joriyFoydalanuvchi.olmoslarTarixi = [];
        }
        baza.joriyFoydalanuvchi.olmoslarTarixi.unshift({
          sana: `${bugun} ${new Date().toTimeString().slice(0, 5)}`,
          miqdor: 5,
          sabab: "Kunlik saytga kirish bonusi (+5 💎)"
        });
        global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
        this.ekrandagiOlmosVaVaqtniYangilash();

        const xabar = global.TilVaTarjimalar
          ? global.TilVaTarjimalar.matn("daily_bonus_toast")
          : "🎉 Kunlik tashrif uchun +5 ta Olmos (💎) profilingizga qo'shildi!";
        setTimeout(() => {
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(xabar);
        }, 600);
        return { berildi: true, miqdor: 5, jami: baza.joriyFoydalanuvchi.olmoslar };
      }

      return { berildi: false, miqdor: 0, jami: baza.joriyFoydalanuvchi.olmoslar };
    },

    // 2. Foydalanuvchi profiliga olmos qo'shish va tarixda saqlash
    olmosQoshish: function (miqdor, sabab) {
      const soni = Math.max(0, Math.round(Number(miqdor) || 0));
      if (soni <= 0) return 0;

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      baza.joriyFoydalanuvchi.olmoslar = (baza.joriyFoydalanuvchi.olmoslar || 0) + soni;
      if (!Array.isArray(baza.joriyFoydalanuvchi.olmoslarTarixi)) {
        baza.joriyFoydalanuvchi.olmoslarTarixi = [];
      }
      const vaqtSatri = new Date().toISOString().replace("T", " ").slice(0, 16);
      baza.joriyFoydalanuvchi.olmoslarTarixi.unshift({
        sana: vaqtSatri,
        miqdor: soni,
        sabab: sabab || "Matematik faollik uchun mukofot"
      });

      // Foydalanuvchilar ro'yxatida ham yangilaymiz
      const idx = baza.foydalanuvchilarRoyxati.findIndex(u => u.id === baza.joriyFoydalanuvchi.id);
      if (idx >= 0) {
        baza.foydalanuvchilarRoyxati[idx].olmoslar = baza.joriyFoydalanuvchi.olmoslar;
      }

      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      this.ekrandagiOlmosVaVaqtniYangilash();
      global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`💎 +${soni} ta Olmos qo'shildi: ${sabab}`);
      return baza.joriyFoydalanuvchi.olmoslar;
    },

    // 3. Testlarni yechganlik uchun adolatli olmos hisoblash
    adolatliTestOlmosiHisoblash: function (togriSoni, jamiSoni, darajaKodi) {
      // Daraja koeffitsiyenti: C=1, C+=1.2, B=1.5, B+=1.8, A=2.2, A+=3
      const koeffitsiyentlar = {
        "C": 1,
        "C+": 1.2,
        "B": 1.5,
        "B+": 1.8,
        "A": 2.2,
        "A+": 3.0
      };
      const k = koeffitsiyentlar[darajaKodi] || 1.5;
      let olmos = Math.round(togriSoni * k);
      // Agar 100% barcha testni to'g'ri yechsa, +5 ta mukammallik bonusi
      if (jamiSoni > 0 && togriSoni === jamiSoni) {
        olmos += 5;
      }
      return Math.max(0, olmos);
    },

    // 4. Bir kunda necha soat va daqiqa misol ishlaganini formatlash
    vaqtniFormatlash: function (sekundlar, majburiyTil) {
      const jamiSek = Math.max(0, Math.floor(Number(sekundlar) || 0));
      const soat = Math.floor(jamiSek / 3600);
      const daqiqa = Math.floor((jamiSek % 3600) / 60);
      const soniya = jamiSek % 60;

      const til = majburiyTil || (global.TilVaTarjimalar ? global.TilVaTarjimalar.joriyTilniOlish() : "uz");
      if (til === "ru") {
        return `${soat} ч ${daqiqa} мин (${soniya} с)`;
      } else if (til === "en") {
        return `${soat} hr ${daqiqa} min (${soniya} s)`;
      }
      return `${soat} soat ${daqiqa} daqiqa (${soniya} s)`;
    },

    // 5. Kunlik ishlash vaqti taymerini ishga tushirish
    kunlikTaymerniBoshlash: function () {
      if (typeof window === "undefined") return;
      if (vaqtIntervalId) clearInterval(vaqtIntervalId);

      // Har 1 sekundda saytda misol ishlayotgan vaqtni yangilab boramiz
      vaqtIntervalId = setInterval(() => {
        const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
        const bugun = new Date().toISOString().slice(0, 10);
        if (baza.oxirgiVaqtSana !== bugun) {
          baza.oxirgiVaqtSana = bugun;
          baza.bugungiIshlanganSekundlar = 0;
        }
        baza.bugungiIshlanganSekundlar = (baza.bugungiIshlanganSekundlar || 0) + 1;
        try {
          localStorage.setItem("algemath_uz_asosiy_baza_v1", JSON.stringify(baza));
        } catch (e) {}
        this.ekrandagiOlmosVaVaqtniYangilash();
      }, 1000);
    },

    // 6. Ekrandagi barcha olmos va vaqt ko'rsatkichlarini jonli yangilash
    ekrandagiOlmosVaVaqtniYangilash: function () {
      if (typeof document === "undefined") return;
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const olmosSoni = baza.joriyFoydalanuvchi.olmoslar || 0;
      const vaqtMatni = this.vaqtniFormatlash(baza.bugungiIshlanganSekundlar || 0);

      document.querySelectorAll("[data-live-diamonds]").forEach(el => {
        el.textContent = olmosSoni;
      });
      document.querySelectorAll("[data-live-study-time]").forEach(el => {
        el.textContent = vaqtMatni;
      });
    }
  };

  global.OlmoslarVaVaqtTizimi = OlmoslarVaVaqtTizimi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = OlmoslarVaVaqtTizimi;
  }
})(typeof window !== "undefined" ? window : globalThis);
