/* ==========================================================================
   PAPKA VA FAYL: 8_Obuna_va_Tolov_Bulimi/Obuna_va_Tolov_mantiqi.js
   VAZIFASI: 8-Modul — "Startup Monetizatsiyasi (PRO Obuna va To'lov Tizimi)".
             - Bepul, O'quvchi PRO va Ustoz Ekspert PRO tariflari;
             - Click, Payme, Uzum Bank yoki to'plangan 💎 Olmoslar evaziga
               PRO obunani faollashtirish hamda rasmiy elektron chek berish.
   ========================================================================== */

(function (global) {
  const OBUNA_TARIFLARI = [
    {
      id: "plan_free",
      nomi: "Bepul",
      sarlavha: "🌱 Boshlang'ich (Bepul)",
      narxSom: "0 so'm / oy",
      narxOlmos: 0,
      bonusOlmos: 0,
      imkoniyatlar: [
        "✅ Har kungi kirish uchun +5 💎 Olmos bonusi",
        "✅ 0 dan C, C+, B darajagacha barcha darslar va 10 talik testlar",
        "✅ O'quvchi va Ustoz darajali testlari",
        "✅ 45 talik Milliy Sertifikat imtihonini topshirish"
      ]
    },
    {
      id: "plan_student_pro",
      nomi: "O'quvchi PRO",
      sarlavha: "🚀 O'quvchi PRO (Eng Ommabop)",
      narxSom: "39,000 so'm / oy",
      narxOlmos: 120,
      bonusOlmos: 50,
      imkoniyatlar: [
        "✅ Barcha C dan A+ Olimpiada darajagacha to'liq darslar",
        "✅ Har bir 10 talik testda kengaytirilgan Yordam/Memory formulalari",
        "✅ Cheksiz 1v1 Matematik Duel va Grafik Kalkulyator",
        "✅ Aktivlashtirilganda darhol +50 💎 PRO Bonus Olmos!"
      ]
    },
    {
      id: "plan_teacher_pro",
      nomi: "Ustoz Ekspert PRO",
      sarlavha: "👑 Ustoz va Repetitor Ekspert PRO",
      narxSom: "69,000 so'm / oy",
      narxOlmos: 200,
      bonusOlmos: 100,
      imkoniyatlar: [
        "✅ Cheksiz 6 xonali Ustoz Sinfxonalari (MATH-XX) ochish",
        "✅ O'quvchilarga avtomatik tekshiriluvchi Uyga Vazifalar berish",
        "✅ A+ Milliy Sertifikat metodik bazasi va PDF eksport",
        "✅ Aktivlashtirilganda darhol +100 💎 Ekspert Bonus Olmos!"
      ]
    }
  ];

  const ObunaVaTolovMantiqi = {
    tariflar: OBUNA_TARIFLARI,
    tanlanganTolovUsuli: "Click", // "Click" | "Payme" | "Uzum" | "Olmos"
    oxirgiChek: null,

    tarifniFaollashtirish: function (tarifId, tolovUsuli) {
      const tarif = OBUNA_TARIFLARI.find(t => t.id === tarifId);
      if (!tarif) return { muvaffaqiyat: false, xabar: "Tarif topilmadi" };

      const usul = tolovUsuli || this.tanlanganTolovUsuli;
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;

      if (usul === "Olmos" && tarif.narxOlmos > 0) {
        if ((u.olmoslar || 0) < tarif.narxOlmos) {
          return {
            muvaffaqiyat: false,
            xabar: `⚠️ Olmoslar evaziga aktivlashtirish uchun ${tarif.narxOlmos} 💎 kerak! (Sizda: ${u.olmoslar || 0} 💎)`
          };
        }
        u.olmoslar -= tarif.narxOlmos;
      } else if (tarif.bonusOlmos > 0) {
        u.olmoslar = (u.olmoslar || 0) + tarif.bonusOlmos;
      }

      u.obunaTarifi = tarif.nomi;
      u.obunaTugashSana = "2026-12-16";

      this.oxirgiChek = {
        chekId: "PAY-UZ-" + Math.floor(100000 + Math.random() * 900000),
        tarifNomi: tarif.sarlavha,
        tolovUsuli: usul,
        summa: usul === "Olmos" ? `${tarif.narxOlmos} 💎 Olmos` : tarif.narxSom,
        sana: new Date().toISOString().replace("T", " ").slice(0, 16),
        foydalanuvchi: `${u.ism} ${u.familiya}`
      };

      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      if (global.OlmoslarVaVaqtTizimi) {
        global.OlmoslarVaVaqtTizimi.ekrandagiOlmosVaVaqtniYangilash();
      }
      return {
        muvaffaqiyat: true,
        chek: this.oxirgiChek,
        xabar: `🎉 Tabriklaymiz! "${tarif.nomi}" tarifi (${usul} orqali) muvaffaqiyatli faollashtirildi!`
      };
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("obuna-va-tolov-konteyner");
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;

      konteyner.innerHTML = `
        <div class="card" style="margin-bottom:1.5rem; background:linear-gradient(135deg, #1e1b4b 0%, #3730a3 55%, #4f46e5 100%); color:#fff;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.5rem;">
            <div>
              <span class="badge-pill" style="background:rgba(255,255,255,0.2); color:#fde047; margin-bottom:0.5rem; display:inline-block;">
                💰 8-MAXSUS MODUL • STARTUP MONETIZATSIYASI VA PRO OBUNA
              </span>
              <h1 style="font-size:1.75rem; font-weight:900; margin-bottom:0.4rem;">
                💰 PRO Tariflar va To'lov Tizimi (Click • Payme • Uzum • 💎 Olmos)
              </h1>
              <p style="opacity:0.92; max-width:680px;">
                Milliy to'lov tizimlari (Click, Payme, Uzum Bank) orqali yoki o'z bilimingiz bilan to'plagan <strong>💎 Olmoslaringiz</strong> evaziga PRO obunani bepul faollashtiring!
              </p>
            </div>
            <div style="background:rgba(255,255,255,0.14); padding:1rem 1.4rem; border-radius:var(--radius-lg); text-align:center;">
              <div style="font-size:0.8rem; opacity:0.85;">Joriy tarifingiz:</div>
              <div style="font-size:1.45rem; font-weight:900; color:#fde047;">👑 ${u.obunaTarifi || "Bepul"}</div>
            </div>
          </div>
        </div>

        <!-- TO'LOV USULINI TANLASH -->
        <div class="card" style="margin-bottom:1.5rem;">
          <h2 style="font-size:1.15rem; font-weight:800; margin-bottom:0.75rem;">
            💳 1-qadam: Qulay to'lov usulini tanlang:
          </h2>
          <div class="grid-4">
            ${[
              { kod: "Click", nomi: "💙 CLICK Evolution", tavsif: "UZCARD / HUMO tezkor to'lov" },
              { kod: "Payme", nomi: "🩵 Payme Business", tavsif: "Avtomatik elektron chek bilan" },
              { kod: "Uzum", nomi: "💜 Uzum Bank", tavsif: "Keshbek va tezkor o'tkazma" },
              { kod: "Olmos", nomi: "💎 Olmoslar evaziga (Bepul!)", tavsif: `Balansingiz: ${u.olmoslar || 0} 💎` }
            ].map(m => `
              <button type="button"
                      class="language-flag-option ${this.tanlanganTolovUsuli === m.kod ? "active" : ""}"
                      data-pay-method="${m.kod}"
                      style="flex-direction:column; align-items:flex-start; gap:0.25rem;">
                <div style="font-size:1rem; font-weight:900;">${m.nomi}</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">${m.tavsif}</div>
              </button>
            `).join("")}
          </div>
        </div>

        ${this.oxirgiChek ? `
          <div class="card" style="margin-bottom:1.5rem; border:2px solid var(--success); background:var(--bg-tertiary);">
            <h3 style="font-size:1.25rem; font-weight:900; color:var(--success); margin-bottom:0.4rem;">
              🧾 Rasmiy Elektron To'lov Cheki (${this.oxirgiChek.chekId})
            </h3>
            <div style="font-size:0.92rem; display:flex; gap:1.5rem; flex-wrap:wrap;">
              <span>👤 Foydalanuvchi: <strong>${this.oxirgiChek.foydalanuvchi}</strong></span>
              <span>📦 Tarif: <strong>${this.oxirgiChek.tarifNomi}</strong></span>
              <span>💳 Usul: <strong>${this.oxirgiChek.tolovUsuli}</strong></span>
              <span>💰 Qiymat: <strong>${this.oxirgiChek.summa}</strong></span>
              <span>🕒 Sana: <strong>${this.oxirgiChek.sana}</strong></span>
            </div>
          </div>
        ` : ""}

        <!-- 3 TA TARIF KARTALARI -->
        <div class="grid-3">
          ${OBUNA_TARIFLARI.map(t => {
            const faol = u.obunaTarifi === t.nomi;
            return `
              <div class="card card-interactive" style="display:flex; flex-direction:column; justify-content:space-between; border-width:2px; border-color:${faol ? "var(--success)" : "var(--border-color)"};">
                <div>
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.65rem;">
                    <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">${t.nomi}</span>
                    ${faol ? `<span class="badge-pill" style="background:rgba(5,205,153,0.18); color:var(--success);">✅ Faol tarif</span>` : ""}
                  </div>
                  <h3 style="font-size:1.3rem; font-weight:900; margin-bottom:0.35rem;">${t.sarlavha}</h3>
                  <div style="font-size:1.55rem; font-weight:900; color:var(--accent-primary); margin-bottom:0.2rem;">
                    ${this.tanlanganTolovUsuli === "Olmos" && t.narxOlmos > 0 ? `${t.narxOlmos} 💎 Olmos` : t.narxSom}
                  </div>
                  <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
                    Yoki ${t.narxOlmos} 💎 Olmos evaziga bepul aktivlashtirish
                  </div>
                  <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.4rem; font-size:0.9rem;">
                    ${t.imkoniyatlar.map(imk => `<div>${imk}</div>`).join("")}
                  </div>
                </div>

                <button type="button"
                        class="btn ${faol ? "btn-emerald" : "btn-primary"}"
                        data-activate-plan="${t.id}"
                        style="width:100%;">
                  ${faol ? "✅ Sizning joriy tarifingiz" : `🚀 ${this.tanlanganTolovUsuli} orqali faollashtirish`}
                </button>
              </div>
            `;
          }).join("")}
        </div>
      `;

      konteyner.querySelectorAll("[data-pay-method]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.tanlanganTolovUsuli = btn.getAttribute("data-pay-method");
          this.interfeysniChizish(konteyner);
        });
      });

      konteyner.querySelectorAll("[data-activate-plan]").forEach(btn => {
        btn.addEventListener("click", () => {
          const planId = btn.getAttribute("data-activate-plan");
          const res = this.tarifniFaollashtirish(planId, this.tanlanganTolovUsuli);
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("pricing");
          this.interfeysniChizish(konteyner);
        });
      });
    }
  };

  global.ObunaVaTolovMantiqi = ObunaVaTolovMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ObunaVaTolovMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
