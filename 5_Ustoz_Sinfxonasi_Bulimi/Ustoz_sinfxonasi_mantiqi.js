/* ==========================================================================
   PAPKA VA FAYL: 5_Ustoz_Sinfxonasi_Bulimi/Ustoz_sinfxonasi_mantiqi.js
   VAZIFASI: 5-Modul — "Ustoz Xonasi: Sinf Kodi va Uyga Vazifa Tizimi".
             - Ustoz 6 xonali sinf kodi (masalan: MATH-77) yaratib, o'quvchilarga
               uyga vazifa biriktiradi va kim necha ball olganini jadvalda ko'radi;
             - O'quvchi sinf kodini kiritib guruhga qo'shiladi, uyga vazifa testini
               yechadi va olmos mukofotini oladi.
   ========================================================================== */

(function (global) {
  const UstozSinfxonasiMantiqi = {
    faolVazifaSinfi: null,
    vazifaJavoblar: {},

    // 1. Ustoz yangi sinfxona va uyga vazifa yaratishi
    yangiSinfYaratish: function (sinfNomi, daraja, vazifaMavzusi, mukofotOlmos) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const kod = "MATH-" + Math.floor(10 + Math.random() * 89);

      const yangiSinf = {
        sinfKodi: kod,
        sinfNomi: (sinfNomi || "Algebra Maxsus Guruhi").trim(),
        ustozIsmi: `${u.ism} ${u.familiya}`,
        daraja: daraja || "B+",
        vazifaMavzusi: (vazifaMavzusi || "Kvadrat tenglamalar va Viyet teoremasi").trim(),
        mukofotOlmos: Number(mukofotOlmos) || 25,
        muddat: "2026-11-25",
        oquvchilarNatijalari: [
          { ismFamiliya: `${u.ism} ${u.familiya}`, holat: "Guruh sardori", ball: "10 / 10 (100%)", sana: new Date().toISOString().slice(0, 10) }
        ]
      };

      if (!Array.isArray(baza.ustozSinfxonalari)) baza.ustozSinfxonalari = [];
      baza.ustozSinfxonalari.unshift(yangiSinf);
      baza.joriyFoydalanuvchi.qoShilganSinfKodi = kod;
      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      return yangiSinf;
    },

    // 2. O'quvchi 6 xonali kod orqali sinfga qo'shilishi
    sinfgaQoshilish: function (kiritilganKod) {
      const kod = (kiritilganKod || "").trim().toUpperCase();
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const sinf = (baza.ustozSinfxonalari || []).find(s => s.sinfKodi.toUpperCase() === kod);
      if (!sinf) {
        return { muvaffaqiyat: false, xabar: `⚠️ "${kod}" kodli sinfxona topilmadi! (Masalan: MATH-77 deb kiriting)` };
      }

      const u = baza.joriyFoydalanuvchi;
      u.qoShilganSinfKodi = sinf.sinfKodi;
      const toliqIsm = `${u.ism} ${u.familiya}`;
      const mavjud = sinf.oquvchilarNatijalari.find(o => o.ismFamiliya === toliqIsm);
      if (!mavjud) {
        sinf.oquvchilarNatijalari.push({
          ismFamiliya: toliqIsm,
          holat: "Kutilmoqda",
          ball: "—",
          sana: "—"
        });
      }
      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      return { muvaffaqiyat: true, sinf, xabar: `✅ "${sinf.sinfNomi}" (${sinf.sinfKodi}) sinfiga muvaffaqiyatli qo'shildingiz!` };
    },

    // 3. Uyga vazifani topshirish va baholash
    uygaVazifaniTopshirish: function (sinfKodi, togriSoni, jamiSoni) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const sinf = (baza.ustozSinfxonalari || []).find(s => s.sinfKodi === sinfKodi);
      if (!sinf) return null;

      const u = baza.joriyFoydalanuvchi;
      const toliqIsm = `${u.ism} ${u.familiya}`;
      const foiz = Math.round((togriSoni / Math.max(1, jamiSoni)) * 100);
      const bugun = new Date().toISOString().slice(0, 10);

      const qator = sinf.oquvchilarNatijalari.find(o => o.ismFamiliya === toliqIsm);
      if (qator) {
        qator.holat = "Bajarildi ✅";
        qator.ball = `${togriSoni} / ${jamiSoni} (${foiz}%)`;
        qator.sana = bugun;
      } else {
        sinf.oquvchilarNatijalari.unshift({
          ismFamiliya: toliqIsm,
          holat: "Bajarildi ✅",
          ball: `${togriSoni} / ${jamiSoni} (${foiz}%)`,
          sana: bugun
        });
      }

      const mukofot = Math.max(5, Math.round((togriSoni / Math.max(1, jamiSoni)) * (sinf.mukofotOlmos || 25)));
      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      if (global.OlmoslarVaVaqtTizimi) {
        global.OlmoslarVaVaqtTizimi.olmosQoshish(mukofot, `Sinfxona (${sinf.sinfKodi}) uyga vazifasi uchun`);
      }
      return { foiz, mukofot };
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("ustoz-sinfxonasi-konteyner");
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const sinflar = baza.ustozSinfxonalari || [];

      if (this.faolVazifaSinfi) {
        const savollar = global.MatematikaSavollarBazasi.darajaTestlariniOlish("O'quvchi", this.faolVazifaSinfi.daraja).slice(0, 5);
        konteyner.innerHTML = `
          <div class="card">
            <div class="section-header">
              <div>
                <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">
                  Sinf kodi: ${this.faolVazifaSinfi.sinfKodi} • Ustoz: ${this.faolVazifaSinfi.ustozIsmi}
                </span>
                <h2 style="font-size:1.4rem; font-weight:900; margin-top:0.35rem;">
                  📝 Uyga Vazifa: ${this.faolVazifaSinfi.vazifaMavzusi}
                </h2>
              </div>
              <button type="button" class="btn btn-outline" id="btn-back-classroom">← Sinfxonaga qaytish</button>
            </div>

            ${savollar.map((q, idx) => `
              <div class="question-card">
                <div class="question-text">${idx + 1}) ${q.savol}</div>
                <div class="options-grid">
                  ${q.variantlar.map((v, vIdx) => `
                    <button type="button"
                            class="option-btn ${this.vazifaJavoblar[q.id] === vIdx ? "selected" : ""}"
                            data-hw-q="${q.id}"
                            data-hw-opt="${vIdx}">
                      <span class="option-letter">${["A", "B", "C", "D"][vIdx]}</span>
                      <span>${v}</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            `).join("")}

            <button type="button" class="btn btn-emerald" id="btn-submit-hw" style="width:100%; font-size:1.05rem; padding:1rem;">
              ✅ Uyga vazifani Ustozga yuborish va +${this.faolVazifaSinfi.mukofotOlmos} 💎 olish
            </button>
          </div>
        `;

        document.getElementById("btn-back-classroom")?.addEventListener("click", () => {
          this.faolVazifaSinfi = null;
          this.interfeysniChizish(konteyner);
        });

        konteyner.querySelectorAll("[data-hw-q]").forEach(btn => {
          btn.addEventListener("click", () => {
            this.vazifaJavoblar[btn.getAttribute("data-hw-q")] = Number(btn.getAttribute("data-hw-opt"));
            this.interfeysniChizish(konteyner);
          });
        });

        document.getElementById("btn-submit-hw")?.addEventListener("click", () => {
          let togri = 0;
          savollar.forEach(q => {
            if (this.vazifaJavoblar[q.id] === q.togriIndex) togri++;
          });
          this.uygaVazifaniTopshirish(this.faolVazifaSinfi.sinfKodi, togri, savollar.length);
          this.faolVazifaSinfi = null;
          this.vazifaJavoblar = {};
          this.interfeysniChizish(konteyner);
        });
        return;
      }

      konteyner.innerHTML = `
        <div class="kun-settings-layout">
          <div class="kun-page-banner">
            <div>
              <span class="badge-pill" style="background:rgba(255,255,255,0.2); color:#6ee7b7; margin-bottom:0.5rem; display:inline-block;">
                👨‍🏫 5-MAXSUS MODUL • USTOZ SINFXONASI VA UYGA VAZIFA
              </span>
              <h1 style="font-size:1.75rem; font-weight:900; margin-bottom:0.4rem;">
                👨‍🏫 Ustoz Xonasi — Sinf Kodi va Uyga Vazifa Boshqaruvi
              </h1>
              <p style="opacity:0.92; max-width:700px;">
                Ustozlar 6 xonali kod bilan yangi sinf va uyga vazifa ochadi. O'quvchilar esa shu kod orqali guruhga qo'shilib, vazifalarni bajaradi va olmos oladi!
              </p>
            </div>
          </div>

          <div class="grid-2" style="align-items:start;">
            <!-- CHAP TOMON: O'QUVCHI SINFGA QO'SHILISHI -->
            <div class="kun-settings-section-card">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">1-BO'LIM • O'QUVCHI KIRISH KODI</span>
                  <h2 class="section-title">🎓 O'quvchi: Sinf Kodini Kiritish</h2>
                </div>
              </div>
              <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:1.15rem;">
                Ustozingiz bergan 6 xonali sinf kodini kiriting (masalan: <strong>MATH-77</strong>):
              </p>
              <div style="display:flex; gap:0.85rem;">
                <input type="text" id="inp-join-code" class="form-input" value="${u.qoShilganSinfKodi || "MATH-77"}" placeholder="MATH-77" />
                <button type="button" class="btn btn-primary" id="btn-join-class">Qo'shilish</button>
              </div>
            </div>

            <!-- O'NG TOMON: USTOZ YANGI SINF OCHISHI -->
            <div class="kun-settings-section-card">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">2-BO'LIM • USTOZ VAZIFA PANELI</span>
                  <h2 class="section-title">👨‍🏫 Ustoz: Yangi Sinf va Vazifa Yaratish</h2>
                </div>
              </div>
              <form id="form-create-class">
                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label" for="cls-name">Guruh / Sinf nomi *</label>
                    <input type="text" id="cls-name" class="form-input" placeholder="11-A Olimpiada Guruhi" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="cls-level">Vazifa darajasi</label>
                    <select id="cls-level" class="form-select">
                      <option value="C">C daraja</option>
                      <option value="C+">C+ daraja</option>
                      <option value="B">B daraja</option>
                      <option value="B+" selected>B+ daraja</option>
                      <option value="A">A daraja</option>
                      <option value="A+">A+ daraja</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="cls-topic">Uyga vazifa mavzusi *</label>
                  <input type="text" id="cls-topic" class="form-input" placeholder="Logarifmik va ko'rsatkichli tenglamalar (5 ta misol)" required />
                </div>
                <button type="submit" class="btn btn-emerald" style="width:100%;">
                  ➕ 6 Xonali Sinf Kodi Yaratish va Vazifa E'lon Qilish
                </button>
              </form>
            </div>
          </div>

          <!-- FAOL SINFXONALAR VA JURNAL -->
          <div style="display:flex; flex-direction:column; gap:1.5rem;">
            ${sinflar.map(s => `
              <div class="kun-settings-section-card">
                <div class="section-header">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap; margin-bottom:0.45rem;">
                      <span class="badge-pill" style="background:var(--accent-primary); color:#fff; font-size:0.9rem;">🔑 Kod: ${s.sinfKodi}</span>
                      <span class="grade-badge grade-${s.daraja.replace("+", "plus")}">${s.daraja} daraja</span>
                      <span class="stat-pill diamond-pill">+${s.mukofotOlmos} 💎 mukofot</span>
                    </div>
                    <h3 style="font-size:1.35rem; font-weight:900;">${s.sinfNomi}</h3>
                    <div style="font-size:0.9rem; color:var(--text-secondary); margin-top:0.2rem;">
                      👨‍🏫 Ustoz: <strong>${s.ustozIsmi}</strong> • 📚 Vazifa: <strong>${s.vazifaMavzusi}</strong>
                    </div>
                  </div>
                  <button type="button" class="btn btn-primary" data-do-hw="${s.sinfKodi}">
                    ✍️ Uyga vazifani ishlash (+${s.mukofotOlmos} 💎)
                  </button>
                </div>

                <h4 style="font-size:0.98rem; font-weight:800; margin-bottom:0.8rem;">📊 Sinf Jurnali (O'quvchilar natijalari):</h4>
                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                  ${s.oquvchilarNatijalari.map(o => `
                    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; padding:0.85rem 1.15rem; border-radius:var(--radius-sm); background:var(--bg-primary); border:1px solid var(--border-color);">
                      <div><strong>🎓 ${o.ismFamiliya}</strong></div>
                      <div style="display:flex; gap:1.25rem; align-items:center; font-size:0.88rem; flex-wrap:wrap;">
                        <span>Holat: <strong>${o.holat}</strong></span>
                        <span>Natija: <strong style="color:var(--accent-primary);">${o.ball}</strong></span>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      document.getElementById("btn-join-class")?.addEventListener("click", () => {
        const kod = document.getElementById("inp-join-code").value;
        const res = this.sinfgaQoshilish(kod);
        global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
        this.interfeysniChizish(konteyner);
      });

      document.getElementById("form-create-class")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const nomi = document.getElementById("cls-name").value;
        const daraja = document.getElementById("cls-level").value;
        const mavzu = document.getElementById("cls-topic").value;
        const yangi = this.yangiSinfYaratish(nomi, daraja, mavzu, 25);
        global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`🎉 Yangi sinf ochildi! Sinf kodi: ${yangi.sinfKodi}`);
        this.interfeysniChizish(konteyner);
      });

      konteyner.querySelectorAll("[data-do-hw]").forEach(btn => {
        btn.addEventListener("click", () => {
          const kod = btn.getAttribute("data-do-hw");
          this.faolVazifaSinfi = sinflar.find(x => x.sinfKodi === kod) || null;
          this.vazifaJavoblar = {};
          this.interfeysniChizish(konteyner);
        });
      });
    }
  };

  global.UstozSinfxonasiMantiqi = UstozSinfxonasiMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = UstozSinfxonasiMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
