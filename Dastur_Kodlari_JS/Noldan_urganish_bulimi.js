/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Noldan_urganish_bulimi.js
   VAZIFASI: Matematikani 0 dan boshlab tanlangan maqsad darajagacha
             (C, C+, B, B+, A, A+) bosqichma-bosqich o'rgatish:
             - Har bir darajada nazariy darslar va formulalar (+5 💎 mukofot)
             - Har bir darajada 10 talik sinov testi
             - Har bir test savoli tagida aniq javobni aytmaydigan konseptual
               "Yordam / Memory tushuntirish" bloki (faqat o'rganish bo'limida!).
   ========================================================================== */

(function (global) {
  const NoldanUrganishBulimi = {
    maqsadDaraja: "A+",
    joriyDarajaKodi: "C",
    tanlanganJavoblar: {},
    testYakunlandi: false,

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("noldan-urganish-konteyner");
      if (!konteyner) return;

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      this.maqsadDaraja = baza.joriyFoydalanuvchi.maqsadDaraja || "A+";
      this.joriyDarajaKodi = baza.joriyFoydalanuvchi.tanlanganDaraja || "C";

      try {
        if (typeof window !== "undefined" && window.location && window.location.search) {
          const params = new URLSearchParams(window.location.search);
          const urlDaraja = params.get("daraja");
          if (urlDaraja && ["C", "C+", "B", "B+", "A", "A+"].includes(urlDaraja)) {
            this.joriyDarajaKodi = urlDaraja;
          }
        }
      } catch (e) {}

      this.interfeysniChizish(konteyner);
    },

    darajaKlassiniOlish: function (kod) {
      const xarita = { "C": "grade-C", "C+": "grade-Cplus", "B": "grade-B", "B+": "grade-Bplus", "A": "grade-A", "A+": "grade-Aplus" };
      return xarita[kod] || "grade-B";
    },

    interfeysniChizish: function (konteyner) {
      const barchaDarajalar = global.MatematikaSavollarBazasi.noldanUrganishDarajalari;
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const ozlashtirilgan = baza.joriyFoydalanuvchi.ozlashtirilganDarslar || [];

      const maqsadObj = barchaDarajalar.find(d => d.daraja === this.maqsadDaraja) || barchaDarajalar[5];
      const joriyObj = barchaDarajalar.find(d => d.daraja === this.joriyDarajaKodi) || barchaDarajalar[0];

      // Maqsad darajagacha bo'lgan bosqichlar
      const maqsadYoli = barchaDarajalar.filter(d => d.tartib <= maqsadObj.tartib);

      konteyner.innerHTML = `
        <div class="kun-settings-layout">
          <!-- 1. MAQSAD DARAJANI TANLASH (0 dan A+ gacha yo'l xaritasi) -->
          <div class="kun-settings-section-card">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">1-QADAM • O'QUV YO'NALISHI VA MAQSAD DARAJA</span>
                <h1 class="section-title">📚 Matematikani 0 dan Maqsad Darajagacha O'rganish</h1>
                <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.35rem;">
                  Qaysi darajaga (masalan, <strong>A+</strong>) chiqmoqchi bo'lsangiz, o'sha darajani tanlang va 0 dan boshlab shu darajaga yetguncha darslar hamda 10 talik testlarni o'zlashtiring!
                </p>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <label for="maqsad-daraja-select" style="font-weight:800; font-size:0.92rem;">🎯 Mening maqsadim:</label>
                <select id="maqsad-daraja-select" class="form-select" style="width:auto; font-weight:800;">
                  ${barchaDarajalar.map(d => `
                    <option value="${d.daraja}" ${d.daraja === this.maqsadDaraja ? "selected" : ""}>
                      ${d.daraja} darajaga chiqish
                    </option>
                  `).join("")}
                </select>
              </div>
            </div>

            <!-- BOSQICHMA-BOSQICH YO'L XARITASI TUGMALARI -->
            <div>
              <div style="font-size:0.9rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.85rem;">
                0 dan <strong>${this.maqsadDaraja}</strong> darajagacha o'quv yo'lingiz (${maqsadYoli.length} ta bosqich — o'rganmoqchi bo'lgan bosqichni bosing):
              </div>
              <div class="grid-3">
                ${barchaDarajalar.map(d => {
                  const maqsadIchida = d.tartib <= maqsadObj.tartib;
                  const faol = d.daraja === this.joriyDarajaKodi;
                  return `
                    <button type="button"
                            class="language-flag-option ${faol ? "active" : ""}"
                            data-select-level="${d.daraja}"
                            style="${!maqsadIchida ? "opacity:0.6;" : ""}">
                      <span class="grade-badge ${this.darajaKlassiniOlish(d.daraja)}">${d.daraja}</span>
                      <div style="flex:1;">
                        <div style="font-weight:900; font-size:0.98rem;">${d.tartib}-bosqich • ${d.daraja} daraja</div>
                        <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">+${d.olmosMukofoti} 💎 mukofot</div>
                      </div>
                      ${faol ? `<span class="badge-pill" style="background:var(--accent-primary); color:#fff;">Faol</span>` : ""}
                    </button>
                  `;
                }).join("")}
              </div>
            </div>
          </div>

          <!-- 2. TANLANGAN DARAJA DARSLARI VA NAZARIY TUSHUNTIRISHLAR -->
          <div class="kun-settings-section-card">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">2-QADAM • NAZARIY DARSLAR VA FORMULALAR (${joriyObj.daraja} DARAJA)</span>
                <h2 class="section-title">${joriyObj.sarlavha}</h2>
                <p style="color:var(--text-secondary); font-size:0.94rem; margin-top:0.35rem;">${joriyObj.tavsif}</p>
              </div>
              <div class="stat-pill diamond-pill">
                💎 Bosqich mukofoti: +${joriyObj.olmosMukofoti} Olmos
              </div>
            </div>

            <div class="grid-3">
              ${joriyObj.darslar.map(dars => {
                const tugatilgan = ozlashtirilgan.includes(dars.id);
                return `
                  <div class="card" style="background:var(--bg-primary); display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                      <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; margin-bottom:0.85rem;">
                        <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">📖 Nazariy dars</span>
                        ${tugatilgan
                          ? `<span class="badge-pill" style="background:rgba(5,150,105,0.16); color:var(--success);">✅ O'zlashtirilgan</span>`
                          : `<span class="badge-pill" style="background:rgba(217,119,6,0.16); color:#d97706;">+5 💎 olmos</span>`}
                      </div>
                      <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.65rem;">${dars.nomi}</h3>
                      <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:1rem;">${dars.nazariya}</p>
                      <div style="padding:0.85rem 1rem; border-radius:var(--radius-sm); background:var(--bg-secondary); border-left:4px solid var(--accent-primary); font-family:monospace; font-weight:700; font-size:0.88rem; margin-bottom:0.9rem;">
                        📌 Formula: ${dars.formula}
                      </div>
                      <div style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.25rem;">
                        💡 <strong>Namuna:</strong> ${dars.namuna}
                      </div>
                    </div>
                    <button type="button"
                            class="btn ${tugatilgan ? "btn-emerald" : "btn-primary"}"
                            data-complete-lesson="${dars.id}"
                            data-lesson-title="${dars.nomi}">
                      ${tugatilgan ? "✅ Dars o'zlashtirilgan (+5 💎 olindi)" : "✨ Darsni tushundim va o'zlashtirdim (+5 💎)"}
                    </button>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- 3. SHU DARAJA UCHUN 10 TALIK TEST (HAR BIR SAVOL TAGIDA ANIQ JAVOBSIZ YORDAM/MEMORY BILAN) -->
          <div class="kun-settings-section-card">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">3-QADAM • 10 TALIK O'QUV SINOVI VA YORDAM (MEMORY)</span>
                <h2 class="section-title">
                  📝 ${joriyObj.daraja} Daraja uchun 10 talik O'quv Testi
                </h2>
                <p style="color:var(--text-secondary); font-size:0.94rem; margin-top:0.35rem;">
                  Har bir testning pastki qismida <strong>"💡 Yordam / Memory (Tushuntirish)"</strong> berilgan. U sizga aniq javobni aytmaydi, balki misolni o'zingiz yechishingiz uchun kerakli qoida va formulani eslatadi!
                </p>
              </div>
              <button type="button" class="btn btn-outline" id="learn-test-qayta-btn">🔄 Testni yangidan boshlash</button>
            </div>

          <div id="learn-10-questions-list">
            ${joriyObj.onTalikTest.map((savolObj, qIdx) => {
              const tanlangan = this.tanlanganJavoblar[savolObj.id];
              return `
                <div class="question-card" id="box_${savolObj.id}">
                  <div class="question-meta">
                    <span class="grade-badge ${this.darajaKlassiniOlish(joriyObj.daraja)}">
                      ${joriyObj.daraja} daraja • ${qIdx + 1}/10-savol
                    </span>
                    <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">
                      O'rganish bo'limi (Sertifikat emas)
                    </span>
                  </div>
                  <div class="question-text">${savolObj.savol}</div>
                  <div class="options-grid">
                    ${savolObj.variantlar.map((v, vIdx) => {
                      const harf = ["A", "B", "C", "D"][vIdx] || "A";
                      let klass = "option-btn";
                      if (tanlangan === vIdx) klass += " selected";
                      if (this.testYakunlandi) {
                        if (vIdx === savolObj.togriIndex) klass += " correct";
                        else if (tanlangan === vIdx && vIdx !== savolObj.togriIndex) klass += " wrong";
                      }
                      return `
                        <button type="button"
                                class="${klass}"
                                data-q-id="${savolObj.id}"
                                data-opt-idx="${vIdx}"
                                ${this.testYakunlandi ? "disabled" : ""}>
                          <span class="option-letter">${harf}</span>
                          <span>${v}</span>
                        </button>
                      `;
                    }).join("")}
                  </div>

                  <!-- HAR BIR TEST TAGIDAGI ANIQ JAVOBSIZ YORDAM / MEMORY TUSHUNTIRISH -->
                  <div class="memory-hint-box">
                    <div class="memory-hint-title">
                      💡 Yordam va Xotira eslatmasi (Aniq javobsiz yo'nalish / Memory):
                    </div>
                    <div class="memory-hint-text">
                      ${savolObj.yordam_eslatma}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <!-- TESTNI YAKUNLASH VA NATIJA BLOKI -->
          <div id="learn-test-natija-joyi" style="margin-top:1.5rem;">
            ${this.natijaBlokiniOlish(joriyObj)}
          </div>
          </div>
        </div>
      `;

      this.hodisalarniUlash(konteyner, joriyObj, barchaDarajalar);
    },

    natijaBlokiniOlish: function (joriyObj) {
      if (!this.testYakunlandi) {
        const belgilanganSoni = joriyObj.onTalikTest.filter(q => typeof this.tanlanganJavoblar[q.id] === "number").length;
        return `
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; padding:1.35rem 1.5rem; border-radius:var(--radius-md); background:var(--bg-tertiary); border:1px solid var(--border-color);">
            <div style="font-weight:700; font-size:0.98rem;">
              Belgilangan javoblar: <strong>${belgilanganSoni} / 10</strong>
            </div>
            <button type="button" class="btn btn-primary" id="learn-test-tekshirish-btn" style="font-size:1.02rem; padding:0.9rem 1.85rem;">
              ✅ 10 talik testni tekshirish va Olmos olish
            </button>
          </div>
        `;
      }

      let togri = 0;
      joriyObj.onTalikTest.forEach(q => {
        if (this.tanlanganJavoblar[q.id] === q.togriIndex) togri++;
      });
      const foiz = togri * 10;
      const olmos = global.OlmoslarVaVaqtTizimi.adolatliTestOlmosiHisoblash(togri, 10, joriyObj.daraja);

      return `
        <div class="card" style="background:var(--accent-light); border:2px solid var(--success);">
          <h3 style="font-size:1.35rem; font-weight:900; margin-bottom:0.5rem;">
            🎉 ${joriyObj.daraja} daraja 10 talik testi yakunlandi!
          </h3>
          <p style="font-size:1.02rem; margin-bottom:1.15rem;">
            To'g'ri javoblar: <strong>${togri} / 10 (${foiz}%)</strong> • Taqdim etilgan olmos: <strong>+${olmos} 💎</strong>
          </p>
          <div style="display:flex; gap:1rem; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" id="keyingi-darajaga-otish-btn">
              🚀 Keyingi daraja bosqichiga o'tish (${this.maqsadDaraja} maqsad sari)
            </button>
            <button type="button" class="btn btn-outline" id="learn-test-qayta-2-btn">
              🔄 Shu testni qayta ishlash
            </button>
          </div>
        </div>
      `;
    },

    hodisalarniUlash: function (konteyner, joriyObj, barchaDarajalar) {
      // Maqsad darajani o'zgartirish
      const maqsadSelect = document.getElementById("maqsad-daraja-select");
      if (maqsadSelect) {
        maqsadSelect.addEventListener("change", () => {
          this.maqsadDaraja = maqsadSelect.value;
          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ maqsadDaraja: this.maqsadDaraja });
          this.interfeysniChizish(konteyner);
        });
      }

      // Bosqich tugmalari
      konteyner.querySelectorAll("[data-select-level]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.joriyDarajaKodi = btn.getAttribute("data-select-level");
          this.tanlanganJavoblar = {};
          this.testYakunlandi = false;
          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ tanlanganDaraja: this.joriyDarajaKodi });
          this.interfeysniChizish(konteyner);
        });
      });

      // Nazariy darsni o'zlashtirish (+5 olmos)
      konteyner.querySelectorAll("[data-complete-lesson]").forEach(btn => {
        btn.addEventListener("click", () => {
          const darsId = btn.getAttribute("data-complete-lesson");
          const darsNomi = btn.getAttribute("data-lesson-title");
          const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
          const roixat = baza.joriyFoydalanuvchi.ozlashtirilganDarslar || [];
          if (!roixat.includes(darsId)) {
            roixat.push(darsId);
            global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ ozlashtirilganDarslar: roixat });
            global.OlmoslarVaVaqtTizimi.olmosQoshish(5, `"${darsNomi}" darsini o'zlashtirganlik uchun`);
            this.interfeysniChizish(konteyner);
          } else {
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish("ℹ️ Bu darsni allaqachon o'zlashtirib, +5 💎 olmos olgansiz!");
          }
        });
      });

      // Variantlarni tanlash
      konteyner.querySelectorAll("[data-q-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          if (this.testYakunlandi) return;
          const qId = btn.getAttribute("data-q-id");
          const optIdx = Number(btn.getAttribute("data-opt-idx"));
          this.tanlanganJavoblar[qId] = optIdx;
          this.interfeysniChizish(konteyner);
        });
      });

      // Testni tekshirish
      const tekshirishBtn = document.getElementById("learn-test-tekshirish-btn");
      if (tekshirishBtn) {
        tekshirishBtn.addEventListener("click", () => {
          this.testYakunlandi = true;
          let togri = 0;
          joriyObj.onTalikTest.forEach(q => {
            if (this.tanlanganJavoblar[q.id] === q.togriIndex) {
              togri++;
            } else if (typeof this.tanlanganJavoblar[q.id] === "number") {
              global.UmumiyHolatVaBazalar.xatoniDaftargaQoshish(
                q,
                this.tanlanganJavoblar[q.id],
                `0 dan o'rganish (${joriyObj.daraja} daraja)`
              );
            }
          });
          const olmos = global.OlmoslarVaVaqtTizimi.adolatliTestOlmosiHisoblash(togri, 10, joriyObj.daraja);
          if (olmos > 0) {
            global.OlmoslarVaVaqtTizimi.olmosQoshish(
              olmos,
              `0 dan o'rganish (${joriyObj.daraja} daraja) 10 talik testidan ${togri}/10 natija uchun`
            );
          }
          this.interfeysniChizish(konteyner);
        });
      }

      // Qayta boshlash
      const qayta1 = document.getElementById("learn-test-qayta-btn");
      const qayta2 = document.getElementById("learn-test-qayta-2-btn");
      [qayta1, qayta2].forEach(b => {
        if (b) {
          b.addEventListener("click", () => {
            this.tanlanganJavoblar = {};
            this.testYakunlandi = false;
            this.interfeysniChizish(konteyner);
          });
        }
      });

      // Keyingi darajaga o'tish
      const keyingiBtn = document.getElementById("keyingi-darajaga-otish-btn");
      if (keyingiBtn) {
        keyingiBtn.addEventListener("click", () => {
          const joriyIdx = barchaDarajalar.findIndex(d => d.daraja === this.joriyDarajaKodi);
          const maqsadIdx = barchaDarajalar.findIndex(d => d.daraja === this.maqsadDaraja);
          if (joriyIdx === maqsadIdx) {
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish(
              `🎉 Tabriklaymiz! Siz o'z maqsadingiz bo'lgan ${this.maqsadDaraja} daraja bosqichini to'liq yakunladingiz!`
            );
          }
          if (joriyIdx >= 0 && joriyIdx < barchaDarajalar.length - 1) {
            this.joriyDarajaKodi = barchaDarajalar[joriyIdx + 1].daraja;
            this.tanlanganJavoblar = {};
            this.testYakunlandi = false;
            global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ tanlanganDaraja: this.joriyDarajaKodi });
            this.interfeysniChizish(konteyner);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish("🏆 Tabriklaymiz! Siz eng yuqori A+ o'quv bosqichini ham yakunladingiz!");
          }
        });
      }
    }
  };

  global.NoldanUrganishBulimi = NoldanUrganishBulimi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = NoldanUrganishBulimi;
  }
})(typeof window !== "undefined" ? window : globalThis);
