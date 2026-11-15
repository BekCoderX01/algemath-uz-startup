/* ==========================================================================
   PAPKA VA FAYL: 2_Matematik_Duel_Bulimi/Matematik_duel_mantiqi.js
   VAZIFASI: 2-Modul — "1 ga 1 Matematik Duel Arenasi".
             60 soniya ichida raqib bilan 5 ta algebra misolini tezlikka yechib,
             g'alaba qozonganda tikilgan olmoslarni 2 barobar qilib yutib olish!
   ========================================================================== */

(function (global) {
  const DUEL_RAQIBLARI = [
    { id: "bot_c", nomi: "🤖 Al-Jabr Boti (C/C+ daraja)", daraja: "C", aniqlikEhtimoli: 0.55, tikishOlmos: 10 },
    { id: "bot_b", nomi: "⚡ Tezkor Matematik (B/B+ daraja)", daraja: "B", aniqlikEhtimoli: 0.72, tikishOlmos: 20 },
    { id: "bot_a", nomi: "🔥 Olimpiada Grossmeysteri (A/A+ daraja)", daraja: "A", aniqlikEhtimoli: 0.85, tikishOlmos: 35 }
  ];

  const MatematikDuelMantiqi = {
    raqiblar: DUEL_RAQIBLARI,
    tanlanganRaqib: DUEL_RAQIBLARI[1],
    holat: "kutish", // "kutish" | "jarayon" | "yakun"
    qolganSekund: 60,
    taymerId: null,
    duelSavollari: [],
    joriySavolIndex: 0,
    meningBallim: 0,
    raqibBalli: 0,
    oxirgiDuelNatija: null,

    duelniBoshlash: function (raqibId) {
      const raqib = DUEL_RAQIBLARI.find(r => r.id === raqibId) || this.tanlanganRaqib;
      this.tanlanganRaqib = raqib;

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      if ((baza.joriyFoydalanuvchi.olmoslar || 0) < raqib.tikishOlmos) {
        return {
          muvaffaqiyat: false,
          xabar: `⚠️ Duelga kirish uchun kamida ${raqib.tikishOlmos} 💎 kerak!`
        };
      }

      const barchaSavollar = global.MatematikaSavollarBazasi.darajaTestlariniOlish("O'quvchi", raqib.daraja);
      this.duelSavollari = barchaSavollar.slice(0, 5);
      this.joriySavolIndex = 0;
      this.meningBallim = 0;
      this.raqibBalli = 0;
      this.qolganSekund = 60;
      this.holat = "jarayon";

      if (typeof window !== "undefined") {
        if (this.taymerId) clearInterval(this.taymerId);
        this.taymerId = setInterval(() => {
          this.qolganSekund--;
          const el = document.getElementById("duel-timer-val");
          if (el) el.textContent = `${this.qolganSekund} s`;
          if (this.qolganSekund <= 0) {
            this.duelniYakunlash();
          }
        }, 1000);
      }
      return { muvaffaqiyat: true };
    },

    javobBerish: function (variantIndex) {
      if (this.holat !== "jarayon") return;
      const joriySavol = this.duelSavollari[this.joriySavolIndex];
      if (!joriySavol) return;

      if (variantIndex === joriySavol.togriIndex) {
        this.meningBallim++;
      } else if (global.UmumiyHolatVaBazalar) {
        global.UmumiyHolatVaBazalar.xatoniDaftargaQoshish(joriySavol, variantIndex, "1v1 Matematik Duel");
      }

      // Raqibning javobini ehtimollik asosida simulyatsiya qilamiz
      if (Math.random() < this.tanlanganRaqib.aniqlikEhtimoli) {
        this.raqibBalli++;
      }

      this.joriySavolIndex++;
      if (this.joriySavolIndex >= this.duelSavollari.length) {
        this.duelniYakunlash();
      }
    },

    duelniYakunlash: function () {
      if (this.taymerId) {
        clearInterval(this.taymerId);
        this.taymerId = null;
      }
      this.holat = "yakun";

      const tikish = this.tanlanganRaqib.tikishOlmos;
      let natijaMatn = "Durang";
      let olmosOzgarish = 5;

      if (this.meningBallim > this.raqibBalli) {
        natijaMatn = "G'alaba";
        olmosOzgarish = tikish; // Sof foyda +tikish (tikilgan + yutuq)
      } else if (this.meningBallim < this.raqibBalli) {
        natijaMatn = "Mag'lubiyat";
        olmosOzgarish = -Math.floor(tikish / 2);
      }

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      u.olmoslar = Math.max(0, (u.olmoslar || 0) + olmosOzgarish);

      const duelYozuv = {
        sana: new Date().toISOString().slice(0, 10),
        raqib: this.tanlanganRaqib.nomi,
        hisob: `${this.meningBallim} : ${this.raqibBalli}`,
        natija: natijaMatn,
        yutuqOlmos: olmosOzgarish
      };
      if (!Array.isArray(u.duellarTarixi)) u.duellarTarixi = [];
      u.duellarTarixi.unshift(duelYozuv);
      this.oxirgiDuelNatija = duelYozuv;

      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      if (global.OlmoslarVaVaqtTizimi) {
        global.OlmoslarVaVaqtTizimi.ekrandagiOlmosVaVaqtniYangilash();
      }

      if (typeof document !== "undefined") {
        const konteyner = document.getElementById("matematik-duel-konteyner");
        if (konteyner) this.interfeysniChizish(konteyner);
      }
      return duelYozuv;
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("matematik-duel-konteyner");
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const tarix = u.duellarTarixi || [];

      if (this.holat === "jarayon") {
        const q = this.duelSavollari[this.joriySavolIndex];
        konteyner.innerHTML = `
          <div class="card" style="max-width:860px; margin:0 auto; border:2px solid var(--accent-primary);">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color); margin-bottom:1.25rem;">
              <div>
                <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">SIZ (${u.ism})</div>
                <div style="font-size:1.85rem; font-weight:900; color:var(--success);">${this.meningBallim} ball</div>
              </div>
              <div style="text-align:center;">
                <span class="badge-pill" style="background:rgba(238,93,80,0.16); color:var(--danger); font-size:1.1rem; padding:0.5rem 1.2rem;">
                  ⏱️ <span id="duel-timer-val">${this.qolganSekund} s</span>
                </span>
                <div style="font-size:0.82rem; font-weight:700; margin-top:0.35rem;">
                  Savol: ${this.joriySavolIndex + 1} / 5 • Mukofot: +${this.tanlanganRaqib.tikishOlmos} 💎
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">${this.tanlanganRaqib.nomi}</div>
                <div style="font-size:1.85rem; font-weight:900; color:var(--danger);">${this.raqibBalli} ball</div>
              </div>
            </div>

            <div class="question-text" style="font-size:1.25rem;">${q.savol}</div>
            <div class="options-grid">
              ${q.variantlar.map((v, idx) => `
                <button type="button" class="option-btn" data-duel-opt="${idx}">
                  <span class="option-letter">${["A", "B", "C", "D"][idx]}</span>
                  <span>${v}</span>
                </button>
              `).join("")}
            </div>
          </div>
        `;

        konteyner.querySelectorAll("[data-duel-opt]").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = Number(btn.getAttribute("data-duel-opt"));
            this.javobBerish(idx);
            if (this.holat === "jarayon") this.interfeysniChizish(konteyner);
          });
        });
        return;
      }

      konteyner.innerHTML = `
        <div class="card" style="margin-bottom:1.5rem; background:linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #ec4899 100%); color:#fff;">
          <span class="badge-pill" style="background:rgba(255,255,255,0.2); color:#fff; margin-bottom:0.5rem; display:inline-block;">
            ⚔️ 2-MAXSUS MODUL • 1 GA 1 MATEMATIK DUEL
          </span>
          <h1 style="font-size:1.8rem; font-weight:900; margin-bottom:0.4rem;">
            ⚔️ 1 ga 1 Matematik Duel Arenasi (60 Soniyalik Bellashuv)
          </h1>
          <p style="opacity:0.92; max-width:680px;">
            Raqib darajasini tanlang, 60 soniya ichida 5 ta algebra misolini tez va aniq yechib, tikilgan olmoslarni yutib oling!
          </p>
        </div>

        ${this.holat === "yakun" && this.oxirgiDuelNatija ? `
          <div class="card" style="margin-bottom:1.5rem; border:2px solid var(--accent-primary); text-align:center;">
            <h2 style="font-size:1.6rem; font-weight:900; margin-bottom:0.4rem;">
              ${this.oxirgiDuelNatija.natija === "G'alaba" ? "🏆 G'ALABA QOZONDINGIZ!" : (this.oxirgiDuelNatija.natija === "Durang" ? "🤝 DURANG NATIJA!" : "💪 KEYINGI SAFAR ALBATTA YUTASIZ!")}
            </h2>
            <p style="font-size:1.15rem; font-weight:800; margin-bottom:0.75rem;">
              Hisob: ${this.oxirgiDuelNatija.hisob} (${this.oxirgiDuelNatija.raqib} ga qarshi) •
              Olmos natijasi: ${this.oxirgiDuelNatija.yutuqOlmos >= 0 ? "+" + this.oxirgiDuelNatija.yutuqOlmos : this.oxirgiDuelNatija.yutuqOlmos} 💎
            </p>
          </div>
        ` : ""}

        <div class="grid-3" style="margin-bottom:1.5rem;">
          ${DUEL_RAQIBLARI.map(r => `
            <div class="card card-interactive" style="display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.65rem;">
                  <span class="grade-badge grade-${r.daraja}">${r.daraja} daraja</span>
                  <span class="stat-pill diamond-pill">Tikish: ${r.tikishOlmos} 💎</span>
                </div>
                <h3 style="font-size:1.12rem; font-weight:900; margin-bottom:0.4rem;">${r.nomi}</h3>
                <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.1rem;">
                  5 ta tezkor savol • 60 soniya vaqt • G'alaba mukofoti: <strong>+${r.tikishOlmos} 💎 sof olmos</strong>
                </p>
              </div>
              <button type="button" class="btn btn-primary" data-start-duel="${r.id}" style="width:100%;">
                ⚔️ Duelga chorlash (${r.tikishOlmos} 💎)
              </button>
            </div>
          `).join("")}
        </div>

        <div class="card">
          <h2 style="font-size:1.25rem; font-weight:900; margin-bottom:0.85rem;">📜 Sizning Duellar Tarixingiz</h2>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            ${tarix.map(d => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border-radius:var(--radius-sm); background:var(--bg-primary); border:1px solid var(--border-color);">
                <div>
                  <strong>${d.raqib}</strong> • Hisob: <strong>${d.hisob}</strong>
                  <div style="font-size:0.76rem; color:var(--text-muted);">${d.sana}</div>
                </div>
                <span class="badge-pill" style="background:${d.natija === "G'alaba" ? "rgba(5,205,153,0.16)" : "rgba(255,181,71,0.16)"}; color:${d.natija === "G'alaba" ? "var(--success)" : "#d97706"};">
                  ${d.natija} (${d.yutuqOlmos >= 0 ? "+" + d.yutuqOlmos : d.yutuqOlmos} 💎)
                </span>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      konteyner.querySelectorAll("[data-start-duel]").forEach(btn => {
        btn.addEventListener("click", () => {
          const rId = btn.getAttribute("data-start-duel");
          const res = this.duelniBoshlash(rId);
          if (!res.muvaffaqiyat) {
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
            return;
          }
          this.interfeysniChizish(konteyner);
        });
      });
    }
  };

  global.MatematikDuelMantiqi = MatematikDuelMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MatematikDuelMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
