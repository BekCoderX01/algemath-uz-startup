/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Qidiruv_bulimi.js
   VAZIFASI: Sayt bo'ylab tezkor Qidiruv (mavzular, formulalar, 0 dan o'rganish
             darslari, 45 talik sertifikat savollari va alohida sahifalar) hamda
             barcha 17 ta sahifaga oson o'tish uchun Kun.uz uslubida 4 ta
             yo'nalishga tartiblangan To'liq Mundarija.
   ========================================================================== */

(function (global) {
  const QidiruvBulimi = {
    qidiruvIndeksiniYaratish: function () {
      const indeks = [];
      const mundarija = typeof global.MundarijaVaNavigatsiya.korinadiganSahifalar === "function"
        ? global.MundarijaVaNavigatsiya.korinadiganSahifalar()
        : (global.MundarijaVaNavigatsiya.sahifalarMundarijasi || []).filter(s => !s.faqatAdmin);
      const darajalar = global.MatematikaSavollarBazasi.noldanUrganishDarajalari || [];
      const sertSavollar = global.MatematikaSavollarBazasi.sertifikat45Test || [];

      // 1. Sahifalar
      mundarija.forEach(s => {
        indeks.push({
          tur: "Sahifa",
          ikonka: s.ikonka,
          sarlavha: `${s.raqam}. ${s.nomi}`,
          tavsif: s.tavsif,
          havola: global.MundarijaVaNavigatsiya.sahifaManziliniOlish(s.fayl),
          kalitSozlar: `${s.nomi} ${s.qisqaNomi || ""} ${s.tavsif} sahifa mundarija`.toLowerCase()
        });
      });

      // 2. 0 dan o'rganish darslari va formulalari
      darajalar.forEach(d => {
        d.darslar.forEach(dars => {
          indeks.push({
            tur: `0 dan o'rganish (${d.daraja})`,
            ikonka: "📚",
            sarlavha: `${d.daraja} daraja — ${dars.nomi}`,
            tavsif: `${dars.nazariya} | Formula: ${dars.formula}`,
            havola: `${global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Noldan_urganish_sahifasi.html")}?daraja=${encodeURIComponent(d.daraja)}`,
            kalitSozlar: `${d.daraja} ${dars.nomi} ${dars.nazariya} ${dars.formula}`.toLowerCase()
          });
        });
      });

      // 3. Sertifikat savollari va mavzulari
      sertSavollar.forEach(q => {
        indeks.push({
          tur: `Sertifikat testi (${q.qiyinchilik})`,
          ikonka: "🏆",
          sarlavha: `Sertifikat #${q.tartib}-savol (${q.mavzu})`,
          tavsif: q.savol,
          havola: global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Sertifikat_olish_sahifasi.html"),
          kalitSozlar: `${q.mavzu} ${q.savol} ${q.qiyinchilik} sertifikat`.toLowerCase()
        });
      });

      return indeks;
    },

    qidirish: function (sorov, turFiltri) {
      const barcha = this.qidiruvIndeksiniYaratish();
      const s = (sorov || "").trim().toLowerCase();
      return barcha.filter(item => {
        const turMos = !turFiltri || turFiltri === "barchasi" || item.tur.toLowerCase().includes(turFiltri.toLowerCase());
        const sozMos = !s || item.kalitSozlar.includes(s) || item.sarlavha.toLowerCase().includes(s);
        return turMos && sozMos;
      });
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("qidiruv-va-mundarija-konteyner");
      if (!konteyner) return;

      konteyner.innerHTML = `
        <!-- 1. AQLLI GLOBAL QIDIRUV BO'LIMI (YUQORIDA QULAY JOYLASHGAN) -->
        <div class="card" style="margin-bottom:2.25rem; border-top:4px solid var(--accent-primary);">
          <div class="section-header">
            <div>
              <h1 class="section-title">🔍 Portal bo'ylab Global Qidiruv va Mundarija</h1>
              <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.25rem;">
                Matematik mavzu, formula (masalan: <em>Viyet, logarifm, integral, progressiya, EKUB</em>), daraja (<em>A+, B+</em>) yoki bo'lim nomini yozing:
              </p>
            </div>
          </div>

          <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            <input type="search"
                   id="global-qidiruv-input"
                   class="form-input"
                   style="flex:1; min-width:280px;"
                   placeholder="Mavzu, formula, test yoki sahifani qidiring (masalan: Sozlamalar, Viyet, logarifm, A+, Sertifikat)..." />
            <select id="global-qidiruv-tur" class="form-select" style="width:auto; font-weight:700;">
              <option value="barchasi">📂 Barcha bo'limlar</option>
              <option value="Sahifa">🧭 Sahifalar va Modullar</option>
              <option value="0 dan o'rganish">📚 0 dan o'rganish darslari</option>
              <option value="Sertifikat">🏆 45 talik Sertifikat savollari</option>
            </select>
          </div>

          <div id="global-qidiruv-natijalari"></div>
        </div>

        <!-- 2. KUN.UZ USLUBIDA 4 TA YO'NALISHGA GURUHLANGAN SAHIFA MUNDARIJASI -->
        <div>
          <div class="section-header">
            <div>
              <h2 class="section-title">🧭 Saytning To'liq Mundarijasi (4 ta yo'nalish bo'yicha)</h2>
              <p style="color:var(--text-secondary); font-size:0.94rem; margin-top:0.25rem;">
                Har bir bo'lim tartib bilan o'z yo'nalishiga ajratilgan — kerakli sahifaga 1 bosishda o'ting:
              </p>
            </div>
          </div>

          ${global.MundarijaVaNavigatsiya.kategoriyalanganMundarijaHtml()}
        </div>
      `;

      const inputEl = document.getElementById("global-qidiruv-input");
      const turEl = document.getElementById("global-qidiruv-tur");
      const natijaEl = document.getElementById("global-qidiruv-natijalari");

      try {
        if (typeof window !== "undefined" && window.location && window.location.search) {
          const params = new URLSearchParams(window.location.search);
          const urlQ = params.get("q");
          if (urlQ && inputEl) {
            inputEl.value = urlQ;
          }
        }
      } catch (e) {}

      const yangilash = () => {
        const natijalar = this.qidirish(inputEl.value, turEl.value);
        if (natijalar.length === 0) {
          natijaEl.innerHTML = `
            <div style="padding:2rem; text-align:center; color:var(--text-muted); background:var(--bg-primary); border-radius:var(--radius-md);">
              So'rovingiz bo'yicha hech narsa topilmadi. Boshqa kalit so'zni yozib ko'ring.
            </div>
          `;
          return;
        }
        natijaEl.innerHTML = `
          <div style="font-size:0.88rem; font-weight:700; color:var(--text-muted); margin-bottom:1rem;">
            Topilgan natijalar: <strong>${natijalar.length} ta</strong> (dastlabki 18 tasi ko'rsatilmoqda)
          </div>
          <div class="grid-2" style="gap:1.15rem;">
            ${natijalar.slice(0, 18).map(r => `
              <a href="${r.havola}" class="card card-interactive" style="background:var(--bg-primary); padding:1.25rem 1.4rem;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
                  <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">${r.ikonka} ${r.tur}</span>
                  <span style="font-size:0.82rem; font-weight:800; color:var(--accent-primary);">O'tish →</span>
                </div>
                <div style="font-weight:800; font-size:1.02rem; margin-bottom:0.35rem;">${r.sarlavha}</div>
                <div style="font-size:0.88rem; color:var(--text-secondary);">${r.tavsif}</div>
              </a>
            `).join("")}
          </div>
        `;
      };

      inputEl.addEventListener("input", yangilash);
      turEl.addEventListener("change", yangilash);
      yangilash();
    }
  };

  global.QidiruvBulimi = QidiruvBulimi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = QidiruvBulimi;
  }
})(typeof window !== "undefined" ? window : globalThis);
