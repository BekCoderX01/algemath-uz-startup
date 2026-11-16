/* ==========================================================================
   PAPKA VA FAYL: 6_Xatolar_Daftari_Bulimi/Xatolar_daftari_mantiqi.js
   VAZIFASI: 6-Modul — "Aqlli Xatolar Ustida Ishlash Daftari".
             O'quvchi testlarda xato qilgan savollar avtomatik shu bo'limga
             tushadi. Har bir savol tagida aniq javobni aytmaydigan konseptual
             "Yordam / Memory" ko'rsatiladi va xatoni to'g'rilagan o'quvchiga
             +3 💎 Olmos beriladi!
   ========================================================================== */

(function (global) {
  const XatolarDaftariMantiqi = {
    tanlanganFiltr: "faol", // "faol" | "tuzatilgan" | "barchasi"

    xatoniTuzatishgaUrinish: function (xatoId, tanlanganVariantIndex) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const daftar = baza.joriyFoydalanuvchi.xatolarDaftari || [];
      const xatoObj = daftar.find(x => x.id === xatoId);
      if (!xatoObj) return { muvaffaqiyat: false, xabar: "Savol topilmadi" };

      if (Number(tanlanganVariantIndex) === xatoObj.togriIndex) {
        const oldinTuzatilganmi = !!xatoObj.tuzatildi;
        xatoObj.tuzatildi = true;
        global.UmumiyHolatVaBazalar.holatniSaqlash(baza);

        if (!oldinTuzatilganmi && global.OlmoslarVaVaqtTizimi) {
          global.OlmoslarVaVaqtTizimi.olmosQoshish(3, "Xatolar daftaridagi misolni to'g'ri yechganlik uchun");
        }
        return {
          muvaffaqiyat: true,
          togri: true,
          xabar: "🎉 Barakalla! Xatongizni to'g'riladingiz va +3 💎 Olmos oldingiz!"
        };
      }

      return {
        muvaffaqiyat: true,
        togri: false,
        xabar: "🤔 Hali xato. Pastdagi «💡 Yordam va Xotira qoidasi»ni diqqat bilan o'qib, qayta urinib ko'ring!"
      };
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("xatolar-daftari-konteyner");
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const daftar = baza.joriyFoydalanuvchi.xatolarDaftari || [];
      const faolSoni = daftar.filter(x => !x.tuzatildi).length;
      const tuzatilganSoni = daftar.filter(x => x.tuzatildi).length;

      const filtrlangan = daftar.filter(x => {
        if (this.tanlanganFiltr === "faol") return !x.tuzatildi;
        if (this.tanlanganFiltr === "tuzatilgan") return !!x.tuzatildi;
        return true;
      });

      konteyner.innerHTML = `
        <div class="kun-page-banner">
          <div>
            <span class="badge-pill" style="background:rgba(255,255,255,0.2); color:#fde047; margin-bottom:0.5rem; display:inline-block;">
              📓 6-MAXSUS MODUL • AQLLI XATOLAR DAFTARI
            </span>
            <h1 style="font-size:1.75rem; font-weight:900; margin-bottom:0.4rem;">
              📸 Xatolar Ustida Ishlash (Smart Mistakes Notebook)
            </h1>
            <p style="opacity:0.92; max-width:700px;">
              Testlarda xato qilgan har bir misolingiz bu yerga avtomatik yoziladi. Aniq javobsiz <strong>Yordam / Memory</strong> eslatmasi yordamida xatongizni tuzating va har bir tuzatilgan misol uchun <strong>+3 💎 Olmos</strong> oling!
            </p>
          </div>
        </div>

        <div class="kun-filter-bar">
          <div style="font-weight:800; color:var(--accent-primary);">📂 Xatolar filtri:</div>
          <div style="display:flex; gap:0.65rem; flex-wrap:wrap;">
            <button type="button" class="btn ${this.tanlanganFiltr === "faol" ? "btn-primary" : "btn-outline"}" data-err-filter="faol">
              ⏳ Tuzatilishi kerak (${faolSoni})
            </button>
            <button type="button" class="btn ${this.tanlanganFiltr === "tuzatilgan" ? "btn-primary" : "btn-outline"}" data-err-filter="tuzatilgan">
              ✅ Tuzatilgan xatolar (${tuzatilganSoni})
            </button>
            <button type="button" class="btn ${this.tanlanganFiltr === "barchasi" ? "btn-primary" : "btn-outline"}" data-err-filter="barchasi">
              📋 Barchasi (${daftar.length})
            </button>
          </div>
        </div>

        ${filtrlangan.length === 0 ? `
          <div class="card" style="text-align:center; padding:2.5rem;">
            <div style="font-size:3rem; margin-bottom:0.65rem;">🎉</div>
            <h2 style="font-size:1.35rem; font-weight:900;">Ajoyib! Hozircha tuzatilmagan xatolaringiz yo'q!</h2>
            <p style="color:var(--text-secondary); margin-top:0.4rem;">
              Yangi testlar ishlaganingizda xato qilingan savollar avtomatik ravishda shu daftarga tushadi.
            </p>
          </div>
        ` : `
          <div>
            ${filtrlangan.map((x, idx) => `
              <div class="question-card" style="border-color:${x.tuzatildi ? "var(--success)" : "var(--border-color)"};">
                <div class="question-meta">
                  <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">
                    #${idx + 1} • Manba: ${x.manba}
                  </span>
                  ${x.tuzatildi
                    ? `<span class="badge-pill" style="background:rgba(5,205,153,0.18); color:var(--success);">✅ Xato tuzatilgan (+3 💎 olindi)</span>`
                    : `<span class="badge-pill" style="background:rgba(238,93,80,0.16); color:var(--danger);">Avvalgi xato tanlov: ${["A", "B", "C", "D"][x.tanlanganXatoIndex] || "B"}) ${x.variantlar[x.tanlanganXatoIndex] || ""}</span>`}
                </div>

                <div class="question-text">${x.savol}</div>

                <div class="options-grid">
                  ${x.variantlar.map((v, vIdx) => `
                    <button type="button"
                            class="option-btn ${x.tuzatildi && vIdx === x.togriIndex ? "correct" : ""}"
                            data-fix-id="${x.id}"
                            data-fix-opt="${vIdx}"
                            ${x.tuzatildi ? "disabled" : ""}>
                      <span class="option-letter">${["A", "B", "C", "D"][vIdx]}</span>
                      <span>${v}</span>
                    </button>
                  `).join("")}
                </div>

                <div class="memory-hint-box">
                  <div class="memory-hint-title">💡 Yordam va Xotira qoidasi (Aniq javobsiz yo'nalish / Memory):</div>
                  <div class="memory-hint-text">${x.yordam_eslatma}</div>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      `;

      konteyner.querySelectorAll("[data-err-filter]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.tanlanganFiltr = btn.getAttribute("data-err-filter");
          this.interfeysniChizish(konteyner);
        });
      });

      konteyner.querySelectorAll("[data-fix-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          const xId = btn.getAttribute("data-fix-id");
          const optIdx = Number(btn.getAttribute("data-fix-opt"));
          const res = this.xatoniTuzatishgaUrinish(xId, optIdx);
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
          this.interfeysniChizish(konteyner);
        });
      });
    }
  };

  global.XatolarDaftariMantiqi = XatolarDaftariMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = XatolarDaftariMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
