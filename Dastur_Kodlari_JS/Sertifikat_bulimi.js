/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Sertifikat_bulimi.js
   VAZIFASI: O'zbekiston Milliy Sertifikat (Matematika va Algebra) imtihoni:
             1) Testni boshlashdan avval Ism va Familiya kiritishni majburiy
                tekshirish;
             2) 45 talik test:
                - 1..15: Oson (lekin o'ylantiradigan mantiqiy-algebraik) — 15 ta
                - 16..30: O'rtacha — 15 ta
                - 31..45: Qiyin — 15 ta
                (Sertifikat bo'limida yordam/eslatma BERILMAYDI!)
             3) Natijaga ko'ra A+, A, B+, B, C+, C darajali Sertifikat berish
                va olmoslar bilan mukofotlash.
   ========================================================================== */

(function (global) {
  const EXAM_STATE_KEY = "algemath_uz_faol_imtihon_v1";

  const SertifikatBulimi = {
    nomzodIsm: "",
    nomzodFamiliya: "",
    nomzodRol: "O'quvchi",
    imtihonBoshlandi: false,
    imtihonYakunlandi: false,
    tanlanganFiltr: "barchasi", // "barchasi" | "oson" | "ortacha" | "qiyin"
    javoblar: {},
    oxirgiNatija: null,

    faolImtihonniSaqlash: function () {
      try {
        if (typeof localStorage === "undefined") return;
        if (this.imtihonBoshlandi && !this.imtihonYakunlandi) {
          localStorage.setItem(EXAM_STATE_KEY, JSON.stringify({
            nomzodIsm: this.nomzodIsm,
            nomzodFamiliya: this.nomzodFamiliya,
            nomzodRol: this.nomzodRol,
            imtihonBoshlandi: this.imtihonBoshlandi,
            tanlanganFiltr: this.tanlanganFiltr,
            javoblar: this.javoblar
          }));
        } else {
          localStorage.removeItem(EXAM_STATE_KEY);
        }
      } catch (e) {}
    },

    faolImtihonniYuklash: function () {
      try {
        if (typeof localStorage === "undefined") return false;
        const saqlangan = localStorage.getItem(EXAM_STATE_KEY);
        if (!saqlangan) return false;
        const parsed = JSON.parse(saqlangan);
        if (parsed && parsed.imtihonBoshlandi && parsed.nomzodIsm && parsed.nomzodFamiliya) {
          this.nomzodIsm = parsed.nomzodIsm;
          this.nomzodFamiliya = parsed.nomzodFamiliya;
          this.nomzodRol = parsed.nomzodRol || "O'quvchi";
          this.imtihonBoshlandi = true;
          this.imtihonYakunlandi = false;
          this.tanlanganFiltr = parsed.tanlanganFiltr || "barchasi";
          this.javoblar = parsed.javoblar || {};
          return true;
        }
      } catch (e) {}
      return false;
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("sertifikat-asosiy-konteyner");
      if (!konteyner) return;

      if (!this.imtihonBoshlandi && !this.imtihonYakunlandi) {
        this.faolImtihonniYuklash();
      }

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      if (!this.nomzodIsm) this.nomzodIsm = baza.joriyFoydalanuvchi.ism || "";
      if (!this.nomzodFamiliya) this.nomzodFamiliya = baza.joriyFoydalanuvchi.familiya || "";
      if (!this.imtihonBoshlandi) {
        this.nomzodRol = baza.joriyFoydalanuvchi.rol === "Ustoz" ? "Ustoz" : "O'quvchi";
      }

      this.interfeysniChizish(konteyner);

      if (typeof window !== "undefined" && !this._tilListenerUlangan) {
        this._tilListenerUlangan = true;
        window.addEventListener("tilOzgardi", () => {
          const k = document.getElementById("sertifikat-asosiy-konteyner");
          if (k) this.interfeysniChizish(k);
        });
      }
    },

    interfeysniChizish: function (konteyner) {
      if (!this.imtihonBoshlandi) {
        konteyner.innerHTML = this.kirishShakliHtml();
        this.kirishHodisalariniUlash(konteyner);
        return;
      }

      if (this.imtihonYakunlandi && this.oxirgiNatija) {
        konteyner.innerHTML = this.natijaVaSertifikatHtml();
        this.natijaHodisalariniUlash(konteyner);
        return;
      }

      konteyner.innerHTML = this.imtihonJarayoniHtml();
      this.imtihonHodisalariniUlash(konteyner);
    },

    kirishShakliHtml: function () {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const arxiv = baza.berilganSertifikatlarArxivi || [];

      return `
        <div class="grid-2" style="align-items:start;">
          <!-- CHAP TOMON: ISM FAMILIYA KIRITISH VA IMTIHONNI BOSHLASH -->
          <div class="card">
            <div style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.35rem 0.85rem; border-radius:999px; background:rgba(245,158,11,0.16); color:#d97706; font-weight:800; font-size:0.82rem; margin-bottom:0.75rem;">
              🏆 O'ZBEKISTON MILLIY SERTIFIKAT STANDARTI
            </div>
            <h1 style="font-size:1.65rem; font-weight:900; margin-bottom:0.65rem;">
              Matematika va Algebradan 45 talik Sertifikat Imtihoni
            </h1>
            <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:1.25rem;">
              Sertifikat olish uchun avval <strong>Ism va Familiyangizni</strong> kiriting. Imtihon 3 bosqichli <strong>45 ta savoldan</strong> iborat (bu bo'limda yordam/xotira eslatmalari berilmaydi):
            </p>

            <div class="grid-3" style="gap:0.75rem; margin-bottom:1.35rem;">
              <div style="padding:0.85rem; border-radius:var(--radius-md); background:var(--bg-primary); border-left:4px solid var(--success);">
                <div style="font-weight:900; font-size:1.1rem;">1–15 savollar</div>
                <div style="font-size:0.85rem; font-weight:700; color:var(--success);">15 ta Oson (o'ylantiradigan)</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">Har biri 1.5 balldan</div>
              </div>
              <div style="padding:0.85rem; border-radius:var(--radius-md); background:var(--bg-primary); border-left:4px solid var(--warning);">
                <div style="font-weight:900; font-size:1.1rem;">16–30 savollar</div>
                <div style="font-size:0.85rem; font-weight:700; color:#d97706;">15 ta O'rtacha</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">Har biri 2.2 balldan</div>
              </div>
              <div style="padding:0.85rem; border-radius:var(--radius-md); background:var(--bg-primary); border-left:4px solid var(--danger);">
                <div style="font-weight:900; font-size:1.1rem;">31–45 savollar</div>
                <div style="font-size:0.85rem; font-weight:700; color:var(--danger);">15 ta Qiyin (Olimpiada/A+)</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">Har biri ~2.97 balldan</div>
              </div>
            </div>

            <form id="sertifikat-boshlash-formasi">
              <div class="grid-2" style="gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="cert-ism-input">Ismingiz (Sertifikatga yoziladi) *</label>
                  <input type="text" id="cert-ism-input" class="form-input" value="${this.nomzodIsm}" placeholder="Masalan: Sardorbek" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="cert-familiya-input">Familiyangiz (Sertifikatga yoziladi) *</label>
                  <input type="text" id="cert-familiya-input" class="form-input" value="${this.nomzodFamiliya}" placeholder="Masalan: Alimov" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="cert-rol-select">Topshiruvchi maqomi</label>
                <select id="cert-rol-select" class="form-select">
                  <option value="O'quvchi" ${this.nomzodRol === "O'quvchi" ? "selected" : ""}>🎓 O'quvchi / Abituriyent</option>
                  <option value="Ustoz" ${this.nomzodRol === "Ustoz" ? "selected" : ""}>👨‍🏫 Ustoz (O'qituvchi)</option>
                </select>
              </div>

              <div id="cert-xato-xabar" style="display:none; color:var(--danger); font-weight:700; margin-bottom:0.85rem;"></div>

              <button type="submit" class="btn btn-primary" style="width:100%; font-size:1.08rem; padding:1rem;">
                ✍️ Ism-familiyani tasdiqlash va 45 talik Testni Boshlash
              </button>
            </form>
          </div>

          <!-- O'NG TOMON: MILLIY SERTIFIKAT BAHOLASH SHKALASI VA MEZONLARI -->
          <div class="card">
            <h2 style="font-size:1.25rem; font-weight:900; margin-bottom:0.85rem;">
              📊 Milliy Sertifikat Darajalari va Baholash Tizimi
            </h2>
            <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1rem;">
              O'zbekistondagi Milliy Sertifikat baholash mezoniga mos ravishda 45 ta savoldan to'plangan natijangiz quyidagicha baholanadi:
            </p>

            <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.4rem;">
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.7rem 1rem; border-radius:var(--radius-sm); background:var(--bg-primary);">
                <span><span class="grade-badge grade-Aplus">A+</span> <strong>Eng yuqori imtiyozli daraja</strong></span>
                <span style="font-weight:800;">39 – 45 ta to'g'ri (≥86%) • +100 💎</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.7rem 1rem; border-radius:var(--radius-sm); background:var(--bg-primary);">
                <span><span class="grade-badge grade-A">A</span> <strong>Maksimal imtiyozli daraja</strong></span>
                <span style="font-weight:800;">35 – 38 ta to'g'ri (78–85%) • +70 💎</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.7rem 1rem; border-radius:var(--radius-sm); background:var(--bg-primary);">
                <span><span class="grade-badge grade-Bplus">B+</span> <strong>Yuqori proporsional daraja</strong></span>
                <span style="font-weight:800;">31 – 34 ta to'g'ri (70–77%) • +50 💎</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.7rem 1rem; border-radius:var(--radius-sm); background:var(--bg-primary);">
                <span><span class="grade-badge grade-B">B</span> <strong>Yaxshi daraja</strong></span>
                <span style="font-weight:800;">27 – 30 ta to'g'ri (60–69%) • +35 💎</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.7rem 1rem; border-radius:var(--radius-sm); background:var(--bg-primary);">
                <span><span class="grade-badge grade-Cplus">C+</span> <strong>O'rta-tayanch daraja</strong></span>
                <span style="font-weight:800;">25 – 26 ta to'g'ri (55–59%) • +25 💎</span>
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.7rem 1rem; border-radius:var(--radius-sm); background:var(--bg-primary);">
                <span><span class="grade-badge grade-C">C</span> <strong>Boshlang'ich sertifikat darajasi</strong></span>
                <span style="font-weight:800;">21 – 24 ta to'g'ri (46–54%) • +15 💎</span>
              </div>
            </div>

            <h3 style="font-size:1rem; font-weight:800; margin-bottom:0.6rem;">📜 Oxirgi berilgan sertifikatlar reestri:</h3>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${arxiv.slice(0, 3).map(item => `
                <div style="padding:0.65rem 0.9rem; border-radius:var(--radius-sm); background:var(--bg-tertiary); display:flex; align-items:center; justify-content:space-between; font-size:0.86rem;">
                  <div>
                    <strong>${item.ismFamiliya}</strong> (${item.rol})
                    <div style="font-size:0.76rem; color:var(--text-muted);">ID: ${item.sertifikatId} • ${item.sana}</div>
                  </div>
                  <span class="grade-badge grade-${item.daraja.replace("+", "plus")}">${item.daraja} (${item.togriSoni}/45)</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    },

    kirishHodisalariniUlash: function (konteyner) {
      const forma = document.getElementById("sertifikat-boshlash-formasi");
      if (forma) {
        forma.addEventListener("submit", (e) => {
          e.preventDefault();
          const ism = (document.getElementById("cert-ism-input")?.value || "").trim();
          const familiya = (document.getElementById("cert-familiya-input")?.value || "").trim();
          const rol = document.getElementById("cert-rol-select")?.value || "O'quvchi";
          const xatoEl = document.getElementById("cert-xato-xabar");

          if (!ism || !familiya) {
            if (xatoEl) {
              xatoEl.style.display = "block";
              xatoEl.textContent = "⚠️ Diqqat! Sertifikat olish uchun avval Ism va Familiyangizni to'liq kiritishingiz shart!";
            }
            return;
          }

          this.nomzodIsm = ism;
          this.nomzodFamiliya = familiya;
          this.nomzodRol = rol;
          this.javoblar = {};
          this.imtihonBoshlandi = true;
          this.imtihonYakunlandi = false;
          this.faolImtihonniSaqlash();
          this.interfeysniChizish(konteyner);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    },

    imtihonJarayoniHtml: function () {
      const barcha45 = global.MatematikaSavollarBazasi.sertifikat45Test;
      const belgilanganSoni = Object.keys(this.javoblar).length;

      const filtrlangan = barcha45.filter(q => {
        if (this.tanlanganFiltr === "oson") return q.qiyinchilik === "oson";
        if (this.tanlanganFiltr === "ortacha") return q.qiyinchilik === "ortacha";
        if (this.tanlanganFiltr === "qiyin") return q.qiyinchilik === "qiyin";
        return true;
      });

      return `
        <div class="card" style="margin-bottom:1.25rem; position:sticky; top:74px; z-index:900; background:var(--bg-glass); backdrop-filter:blur(12px);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
            <div>
              <div style="font-size:0.84rem; color:var(--text-muted); font-weight:700;">
                Nomzod: <strong style="color:var(--text-primary);">${this.nomzodIsm} ${this.nomzodFamiliya}</strong> (${this.nomzodRol})
              </div>
              <h2 style="font-size:1.25rem; font-weight:900;">
                🏆 Milliy Sertifikat Imtihoni • Belgilangan javoblar: ${belgilanganSoni} / 45
              </h2>
            </div>

            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button type="button" class="btn ${this.tanlanganFiltr === "barchasi" ? "btn-primary" : "btn-outline"}" data-cert-filter="barchasi" style="padding:0.5rem 0.9rem; font-size:0.85rem;">
                Barchasi (45)
              </button>
              <button type="button" class="btn ${this.tanlanganFiltr === "oson" ? "btn-primary" : "btn-outline"}" data-cert-filter="oson" style="padding:0.5rem 0.9rem; font-size:0.85rem;">
                🟢 1–15 Oson (15)
              </button>
              <button type="button" class="btn ${this.tanlanganFiltr === "ortacha" ? "btn-primary" : "btn-outline"}" data-cert-filter="ortacha" style="padding:0.5rem 0.9rem; font-size:0.85rem;">
                🟡 16–30 O'rtacha (15)
              </button>
              <button type="button" class="btn ${this.tanlanganFiltr === "qiyin" ? "btn-primary" : "btn-outline"}" data-cert-filter="qiyin" style="padding:0.5rem 0.9rem; font-size:0.85rem;">
                🔴 31–45 Qiyin (15)
              </button>
            </div>

            <div style="display:flex; gap:0.6rem;">
              <button type="button" class="btn btn-amber" id="cert-finish-exam-btn">
                🏁 Imtihonni yakunlash va Sertifikat olish
              </button>
            </div>
          </div>
        </div>

        <!-- 45 TA SAVOL RO'YXATI -->
        <div>
          ${filtrlangan.map(q => {
            const tanlangan = this.javoblar[q.id];
            const rangBadge = q.qiyinchilik === "oson"
              ? `<span class="badge-pill" style="background:rgba(5,205,153,0.16); color:var(--success);">🟢 Oson (o'ylantiradigan) • ${q.ball} ball</span>`
              : q.qiyinchilik === "ortacha"
                ? `<span class="badge-pill" style="background:rgba(255,181,71,0.18); color:#d97706;">🟡 O'rtacha • ${q.ball} ball</span>`
                : `<span class="badge-pill" style="background:rgba(238,93,80,0.18); color:var(--danger);">🔴 Qiyin (A/A+ daraja) • ${q.ball} ball</span>`;

            return `
              <div class="question-card" id="cert_q_card_${q.tartib}">
                <div class="question-meta">
                  <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                    <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">
                      ${q.tartib} / 45-savol
                    </span>
                    ${rangBadge}
                    <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Mavzu: ${q.mavzu}</span>
                  </div>
                </div>
                <div class="question-text">${q.savol}</div>
                <div class="options-grid">
                  ${q.variantlar.map((v, vIdx) => {
                    const harf = ["A", "B", "C", "D"][vIdx] || "A";
                    return `
                      <button type="button"
                              class="option-btn ${tanlangan === vIdx ? "selected" : ""}"
                              data-cert-q="${q.id}"
                              data-cert-opt="${vIdx}">
                        <span class="option-letter">${harf}</span>
                        <span>${v}</span>
                      </button>
                    `;
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="card" style="text-align:center; margin-top:1.5rem;">
          <p style="margin-bottom:1rem; font-weight:700;">
            Jami 45 ta savoldan <strong>${belgilanganSoni} tasiga</strong> javob belgiladingiz.
          </p>
          <button type="button" class="btn btn-primary" id="cert-finish-exam-bottom-btn" style="font-size:1.1rem; padding:1rem 2.2rem;">
            🏆 45 talik Imtihonni Yakunlash va Milliy Sertifikatni Chiqarish
          </button>
        </div>
      `;
    },

    imtihonHodisalariniUlash: function (konteyner) {
      // Filtr tugmalari
      konteyner.querySelectorAll("[data-cert-filter]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.tanlanganFiltr = btn.getAttribute("data-cert-filter");
          this.faolImtihonniSaqlash();
          this.interfeysniChizish(konteyner);
        });
      });

      // Javob tanlash
      konteyner.querySelectorAll("[data-cert-q]").forEach(btn => {
        btn.addEventListener("click", () => {
          const qId = btn.getAttribute("data-cert-q");
          const optIdx = Number(btn.getAttribute("data-cert-opt"));
          this.javoblar[qId] = optIdx;
          this.faolImtihonniSaqlash();
          this.interfeysniChizish(konteyner);
        });
      });

      // Imtihonni yakunlash
      const finishBtns = [
        document.getElementById("cert-finish-exam-btn"),
        document.getElementById("cert-finish-exam-bottom-btn")
      ];
      finishBtns.forEach(b => {
        if (b) {
          b.addEventListener("click", () => {
            this.imtihonniBaholash();
            this.interfeysniChizish(konteyner);
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        }
      });
    },

    imtihonniBaholash: function () {
      const barcha45 = global.MatematikaSavollarBazasi.sertifikat45Test;
      let osonTogri = 0;
      let ortachaTogri = 0;
      let qiyinTogri = 0;
      let jamiBall = 0;

      barcha45.forEach(q => {
        if (this.javoblar[q.id] === q.togriIndex) {
          jamiBall += q.ball;
          if (q.qiyinchilik === "oson") osonTogri++;
          else if (q.qiyinchilik === "ortacha") ortachaTogri++;
          else qiyinTogri++;
        }
      });

      const togriSoni = osonTogri + ortachaTogri + qiyinTogri;
      const baho = global.MatematikaSavollarBazasi.sertifikatDarajasiniHisoblash(togriSoni, jamiBall);
      const sertifikatId = "MS-UZ-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
      const sana = new Date().toISOString().slice(0, 10);

      this.oxirgiNatija = {
        ...baho,
        sertifikatId: baho.otgan ? sertifikatId : ("SINOV-" + Date.now()),
        ismFamiliya: `${this.nomzodIsm} ${this.nomzodFamiliya}`,
        rol: this.nomzodRol,
        osonTogri,
        ortachaTogri,
        qiyinTogri,
        sana
      };
      this.imtihonYakunlandi = true;
      this.faolImtihonniSaqlash();

      // Bazaga va profilga saqlash (Faqat imtihondan o'tganlarga rasmiy sertifikat beriladi!)
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      baza.joriyFoydalanuvchi.yechilganTestlarSoni = (baza.joriyFoydalanuvchi.yechilganTestlarSoni || 0) + 1;
      baza.joriyFoydalanuvchi.togriJavoblarSoni = (baza.joriyFoydalanuvchi.togriJavoblarSoni || 0) + togriSoni;

      if (baho.otgan) {
        if (!Array.isArray(baza.joriyFoydalanuvchi.sertifikatlar)) {
          baza.joriyFoydalanuvchi.sertifikatlar = [];
        }
        baza.joriyFoydalanuvchi.sertifikatlar.unshift(this.oxirgiNatija);
        if (!Array.isArray(baza.berilganSertifikatlarArxivi)) {
          baza.berilganSertifikatlarArxivi = [];
        }
        baza.berilganSertifikatlarArxivi.unshift(this.oxirgiNatija);
      }
      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);

      if (baho.olmosMukofoti > 0) {
        global.OlmoslarVaVaqtTizimi.olmosQoshish(
          baho.olmosMukofoti,
          `Milliy Sertifikat imtihoni (${baho.daraja}, ${togriSoni}/45) natijasi uchun`
        );
      }
    },

    natijaVaSertifikatHtml: function () {
      const n = this.oxirgiNatija;
      return `
        <div class="card" style="margin-bottom:1.5rem;">
          <div class="certificate-diploma">
            <div style="font-size:0.85rem; font-weight:800; letter-spacing:2px; color:#92400e; text-transform:uppercase; margin-bottom:0.4rem;">
              O'ZBEKISTON RESPUBLIKASI MATEMATIKA VA ALGEBRA MILLIY SERTIFIKATI
            </div>
            <h1 style="font-size:2rem; font-weight:900; color:#78350f; margin-bottom:1rem;">
              ${n.otgan ? "MILLIY SERTIFIKAT DIPLOMI" : "IMTIHON NATIJASI VARAQASI"}
            </h1>

            <div class="certificate-seal">
              <div style="font-size:1.75rem; line-height:1;">${n.otgan ? n.daraja : "—"}</div>
              <div style="font-size:0.65rem; letter-spacing:1px;">DARAJA</div>
            </div>

            <p style="font-size:1rem; color:#475569; margin-bottom:0.35rem;">Ushbu sertifikat egasi:</p>
            <div style="font-size:1.85rem; font-weight:900; color:#1e293b; border-bottom:2px solid #d97706; display:inline-block; padding:0.2rem 2rem; margin-bottom:1rem;">
              ${n.ismFamiliya} (${n.rol})
            </div>

            <p style="max-width:620px; margin:0 auto 1.25rem; font-size:0.98rem; color:#334155;">
              45 talik (15 ta oson, 15 ta o'rtacha, 15 ta qiyin) Matematika va Algebra test sinovidan
              <strong>${n.togriSoni} / 45 (${n.foiz}%)</strong> natija ko'rsatib,
              <strong>${n.daraja}</strong> darajani qayd etdi. ${n.tavsif}
            </p>

            <div class="grid-3" style="gap:0.8rem; max-width:660px; margin:0 auto 1.5rem;">
              <div style="background:#ffffff; padding:0.75rem; border-radius:10px; border:1px solid #fde68a;">
                <div style="font-size:0.78rem; color:#64748b;">Oson (1–15)</div>
                <div style="font-size:1.2rem; font-weight:900; color:#059669;">${n.osonTogri} / 15</div>
              </div>
              <div style="background:#ffffff; padding:0.75rem; border-radius:10px; border:1px solid #fde68a;">
                <div style="font-size:0.78rem; color:#64748b;">O'rtacha (16–30)</div>
                <div style="font-size:1.2rem; font-weight:900; color:#d97706;">${n.ortachaTogri} / 15</div>
              </div>
              <div style="background:#ffffff; padding:0.75rem; border-radius:10px; border:1px solid #fde68a;">
                <div style="font-size:0.78rem; color:#64748b;">Qiyin (31–45)</div>
                <div style="font-size:1.2rem; font-weight:900; color:#e11d48;">${n.qiyinTogri} / 15</div>
              </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; font-size:0.85rem; color:#475569; border-top:1px dashed #d97706; padding-top:1rem;">
              <div>Sertifikat raqami: <strong>${n.sertifikatId}</strong></div>
              <div>Taqdim etilgan olmos: <strong>+${n.olmosMukofoti} 💎</strong></div>
              <div>Sana: <strong>${n.sana}</strong></div>
            </div>
          </div>

          <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; margin-top:1.5rem;">
            <button type="button" class="btn btn-primary" onclick="window.print()">
              🖨️ Sertifikatni chop etish / PDF saqlash
            </button>
            <button type="button" class="btn btn-outline" id="cert-retry-btn">
              🔄 Imtihonni qayta topshirish
            </button>
          </div>
        </div>
      `;
    },

    natijaHodisalariniUlash: function (konteyner) {
      const retryBtn = document.getElementById("cert-retry-btn");
      if (retryBtn) {
        retryBtn.addEventListener("click", () => {
          this.imtihonBoshlandi = false;
          this.imtihonYakunlandi = false;
          this.javoblar = {};
          this.faolImtihonniSaqlash();
          this.interfeysniChizish(konteyner);
        });
      }
    }
  };

  global.SertifikatBulimi = SertifikatBulimi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = SertifikatBulimi;
  }
})(typeof window !== "undefined" ? window : globalThis);
