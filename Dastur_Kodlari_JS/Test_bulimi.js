/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Test_bulimi.js
   VAZIFASI: O'quvchilar va Ustozlar o'z maqomini (O'quvchi / Ustoz) hamda
             bilim darajasini (C, C+, B, B+, A, A+) tanlagandan so'ng, aynan
             shu darajaga mos matematik va algebraik testlarni chiqarish,
             baholash va adolatli olmos (💎) taqdim etish.
   ========================================================================== */

(function (global) {
  const TestBulimi = {
    tanlanganRol: "O'quvchi",
    tanlanganDaraja: "B",
    testBoshlandi: false,
    testYakunlandi: false,
    joriySavollar: [],
    javoblar: {},

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("test-yechish-konteyner");
      if (!konteyner) return;

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      this.tanlanganRol = baza.joriyFoydalanuvchi.rol === "Ustoz" ? "Ustoz" : "O'quvchi";
      this.tanlanganDaraja = baza.joriyFoydalanuvchi.tanlanganDaraja || "B";
      this.interfeysniChizish(konteyner);
    },

    savollarniTayyorlash: function () {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const asosiySavollar = global.MatematikaSavollarBazasi.darajaTestlariniOlish(this.tanlanganRol, this.tanlanganDaraja);
      const adminSavollar = (baza.qoshimchaAdminSavollar || []).filter(
        q => !q.daraja || q.daraja === this.tanlanganDaraja
      );
      this.joriySavollar = [...adminSavollar, ...asosiySavollar];
    },

    interfeysniChizish: function (konteyner) {
      const darajalar = [
        { kod: "C", nom: "C — Boshlang'ich daraja", tavsif: "Arifmetika, kasrlar, foiz va oddiy chiziqli tenglamalar" },
        { kod: "C+", nom: "C+ — Tayanch algebra", tavsif: "Qisqa ko'paytirish formulalari, ildizlar va tenglamalar sistemasi" },
        { kod: "B", nom: "B — O'rta daraja", tavsif: "Kvadrat tenglamalar, Viyet teoremasi va ratsional tengsizliklar" },
        { kod: "B+", nom: "B+ — O'rta-yuqori daraja", tavsif: "Arifmetik/geometrik progressiyalar, funksiyalar va trigonometriya" },
        { kod: "A", nom: "A — Yuqori akademik daraja", tavsif: "Logarifm, ko'rsatkichli tenglamalar, hosila va urinma" },
        { kod: "A+", nom: "A+ — Ekspert va Olimpiada darajasi", tavsif: "Aniq integral, parametrli masalalar, kombinatorika va murakkab algebra" }
      ];

      konteyner.innerHTML = `
        <div class="card" style="margin-bottom:1.5rem;">
          <div class="section-header">
            <div>
              <h1 style="font-size:1.55rem; font-weight:900;">🧮 O'quvchi va Ustozlar uchun Darajali Test Bo'limi</h1>
              <p style="color:var(--text-secondary); font-size:0.94rem;">
                Avval kim ekanligingizni (<strong>O'quvchi</strong> yoki <strong>Ustoz</strong>) va bilim darajangizni tanlang — tizim sizning darajangizga mos matematik testlarni shakllantiradi!
              </p>
            </div>
          </div>

          <!-- 1-QADAM: O'QUVCHI YOKI USTOZ TANLASH -->
          <div style="margin-bottom:1.25rem;">
            <div class="form-label">1. Kim sifatida test yechmoqchisiz?</div>
            <div style="display:flex; gap:0.85rem; flex-wrap:wrap;">
              <button type="button" class="btn ${this.tanlanganRol === "O'quvchi" ? "btn-primary" : "btn-outline"}" data-role-pick="O'quvchi">
                🎓 O'quvchi darajasidagi testlar
              </button>
              <button type="button" class="btn ${this.tanlanganRol === "Ustoz" ? "btn-primary" : "btn-outline"}" data-role-pick="Ustoz">
                👨‍🏫 Ustoz (O'qituvchi) malaka va metodika testlari
              </button>
            </div>
          </div>

          <!-- 2-QADAM: BILIM DARAJASINI TANLASH -->
          <div style="margin-bottom:1.4rem;">
            <div class="form-label">2. O'z bilim darajangizni tanlang:</div>
            <div class="grid-3" style="gap:0.85rem;">
              ${darajalar.map(d => `
                <div class="card card-interactive"
                     data-level-pick="${d.kod}"
                     style="cursor:pointer; padding:1rem; background:${this.tanlanganDaraja === d.kod ? "var(--bg-tertiary)" : "var(--bg-primary)"}; border-color:${this.tanlanganDaraja === d.kod ? "var(--accent-primary)" : "var(--border-color)"};">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
                    <span style="font-weight:800;">${d.nom}</span>
                    ${this.tanlanganDaraja === d.kod ? `<span class="badge-pill" style="background:var(--accent-primary); color:#fff;">Tanlandi</span>` : ""}
                  </div>
                  <div style="font-size:0.82rem; color:var(--text-muted);">${d.tavsif}</div>
                </div>
              `).join("")}
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; padding-top:0.5rem; border-top:1px solid var(--border-color);">
            <div>
              Tanlangan rejim: <strong>${this.tanlanganRol}</strong> • Daraja: <strong>${this.tanlanganDaraja}</strong>
            </div>
            <button type="button" class="btn btn-emerald" id="daraja-testni-boshlash-btn" style="font-size:1.05rem; padding:0.85rem 1.75rem;">
              🚀 ${this.tanlanganRol} (${this.tanlanganDaraja} daraja) testini boshlash
            </button>
          </div>
        </div>

        <!-- TEST SAVOLLARI MAYDONI -->
        <div id="daraja-test-savollar-joyi">
          ${this.testMaydoniniChizish()}
        </div>
      `;

      // Rolni tanlash
      konteyner.querySelectorAll("[data-role-pick]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.tanlanganRol = btn.getAttribute("data-role-pick");
          this.testBoshlandi = false;
          this.testYakunlandi = false;
          this.interfeysniChizish(konteyner);
        });
      });

      // Darajani tanlash
      konteyner.querySelectorAll("[data-level-pick]").forEach(card => {
        card.addEventListener("click", () => {
          this.tanlanganDaraja = card.getAttribute("data-level-pick");
          this.testBoshlandi = false;
          this.testYakunlandi = false;
          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ tanlanganDaraja: this.tanlanganDaraja });
          this.interfeysniChizish(konteyner);
        });
      });

      // Testni boshlash
      const boshlashBtn = document.getElementById("daraja-testni-boshlash-btn");
      if (boshlashBtn) {
        boshlashBtn.addEventListener("click", () => {
          this.savollarniTayyorlash();
          this.javoblar = {};
          this.testBoshlandi = true;
          this.testYakunlandi = false;
          this.interfeysniChizish(konteyner);
        });
      }

      // Savol variantlarini belgilash
      konteyner.querySelectorAll("[data-level-q]").forEach(btn => {
        btn.addEventListener("click", () => {
          if (this.testYakunlandi) return;
          const qId = btn.getAttribute("data-level-q");
          const optIdx = Number(btn.getAttribute("data-level-opt"));
          this.javoblar[qId] = optIdx;
          this.interfeysniChizish(konteyner);
        });
      });

      // Testni yakunlash
      const yakunlashBtn = document.getElementById("daraja-test-yakunlash-btn");
      if (yakunlashBtn) {
        yakunlashBtn.addEventListener("click", () => {
          this.testYakunlandi = true;
          let togri = 0;
          this.joriySavollar.forEach(q => {
            if (this.javoblar[q.id] === q.togriIndex) {
              togri++;
            } else if (typeof this.javoblar[q.id] === "number") {
              global.UmumiyHolatVaBazalar.xatoniDaftargaQoshish(
                q,
                this.javoblar[q.id],
                `${this.tanlanganRol} (${this.tanlanganDaraja} daraja)`
              );
            }
          });
          const jami = this.joriySavollar.length;
          const olmos = global.OlmoslarVaVaqtTizimi.adolatliTestOlmosiHisoblash(togri, jami, this.tanlanganDaraja);

          const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({
            yechilganTestlarSoni: (baza.joriyFoydalanuvchi.yechilganTestlarSoni || 0) + 1,
            togriJavoblarSoni: (baza.joriyFoydalanuvchi.togriJavoblarSoni || 0) + togri
          });
          if (olmos > 0) {
            global.OlmoslarVaVaqtTizimi.olmosQoshish(
              olmos,
              `${this.tanlanganRol} (${this.tanlanganDaraja} daraja) testida ${togri}/${jami} to'g'ri javob uchun`
            );
          }
          this.interfeysniChizish(konteyner);
        });
      }
    },

    testMaydoniniChizish: function () {
      if (!this.testBoshlandi) {
        return `
          <div class="card" style="text-align:center; padding:2.5rem;">
            <div style="font-size:3rem; margin-bottom:0.75rem;">🎯</div>
            <h2 style="font-size:1.3rem; font-weight:800; margin-bottom:0.4rem;">
              ${this.tanlanganRol} uchun ${this.tanlanganDaraja} darajali test tayyor!
            </h2>
            <p style="color:var(--text-secondary);">
              Yuqoridagi <strong>"${this.tanlanganRol} (${this.tanlanganDaraja} daraja) testini boshlash"</strong> tugmasini bosing.
            </p>
          </div>
        `;
      }

      let togri = 0;
      this.joriySavollar.forEach(q => {
        if (this.javoblar[q.id] === q.togriIndex) togri++;
      });
      const jami = this.joriySavollar.length;
      const olmos = global.OlmoslarVaVaqtTizimi.adolatliTestOlmosiHisoblash(togri, jami, this.tanlanganDaraja);

      return `
        <div class="card">
          <div class="section-header">
            <h2 style="font-size:1.3rem; font-weight:900;">
              📋 ${this.tanlanganRol} • ${this.tanlanganDaraja} daraja savollari (${jami} ta savol)
            </h2>
            <span class="stat-pill diamond-pill">Maksimal mukofot: +${global.OlmoslarVaVaqtTizimi.adolatliTestOlmosiHisoblash(jami, jami, this.tanlanganDaraja)} 💎</span>
          </div>

          ${this.testYakunlandi ? `
            <div class="card" style="margin-bottom:1.25rem; background:linear-gradient(135deg, rgba(5,205,153,0.16), rgba(67,24,255,0.12)); border:2px solid var(--success);">
              <h3 style="font-size:1.35rem; font-weight:900;">🏆 Test Natijasi: ${togri} / ${jami} (${Math.round((togri/jami)*100)}%)</h3>
              <p style="margin-top:0.35rem; font-weight:700;">
                Sizga adolatli taqsimot asosida <strong>+${olmos} 💎 olmos</strong> taqdim etildi!
              </p>
            </div>
          ` : ""}

          ${this.joriySavollar.map((q, idx) => {
            const tanlangan = this.javoblar[q.id];
            return `
              <div class="question-card">
                <div class="question-meta">
                  <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">
                    ${idx + 1}-savol • ${q.manba || this.tanlanganDaraja}
                  </span>
                </div>
                <div class="question-text">${q.savol}</div>
                <div class="options-grid">
                  ${q.variantlar.map((v, vIdx) => {
                    const harf = ["A", "B", "C", "D"][vIdx] || "A";
                    let klass = "option-btn";
                    if (tanlangan === vIdx) klass += " selected";
                    if (this.testYakunlandi) {
                      if (vIdx === q.togriIndex) klass += " correct";
                      else if (tanlangan === vIdx && vIdx !== q.togriIndex) klass += " wrong";
                    }
                    return `
                      <button type="button"
                              class="${klass}"
                              data-level-q="${q.id}"
                              data-level-opt="${vIdx}"
                              ${this.testYakunlandi ? "disabled" : ""}>
                        <span class="option-letter">${harf}</span>
                        <span>${v}</span>
                      </button>
                    `;
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}

          ${!this.testYakunlandi ? `
            <button type="button" class="btn btn-primary" id="daraja-test-yakunlash-btn" style="width:100%; font-size:1.05rem; padding:1rem;">
              ✅ Javoblarni tasdiqlash va Natijani ko'rish
            </button>
          ` : ""}
        </div>
      `;
    }
  };

  global.TestBulimi = TestBulimi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = TestBulimi;
  }
})(typeof window !== "undefined" ? window : globalThis);
