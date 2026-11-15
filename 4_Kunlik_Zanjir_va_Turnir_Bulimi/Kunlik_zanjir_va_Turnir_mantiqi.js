/* ==========================================================================
   PAPKA VA FAYL: 4_Kunlik_Zanjir_va_Turnir_Bulimi/Kunlik_zanjir_va_Turnir_mantiqi.js
   VAZIFASI: 4-Modul — "Olovli Kunlar Zanjiri (Streak) va Viloyatlar Turniri".
             - Duolingo uslubidagi 7 kunlik olovli zanjir (Streak) va
               7 kunga yetganda +50 💎 super-bonus berish;
             - O'zbekistonning 14 hududi bo'yicha Viloyatlar va Top O'quvchilar
               haftalik turnir reytingi.
   ========================================================================== */

(function (global) {
  const HUDUDLAR_ROYXATI = [
    { nomi: "Toshkent shahri", jamiOlmos: 4850, faolOquvchilar: 142 },
    { nomi: "Samarqand viloyati", jamiOlmos: 4520, faolOquvchilar: 128 },
    { nomi: "Farg'ona viloyati", jamiOlmos: 4390, faolOquvchilar: 119 },
    { nomi: "Buxoro viloyati", jamiOlmos: 4180, faolOquvchilar: 105 },
    { nomi: "Xorazm viloyati", jamiOlmos: 3960, faolOquvchilar: 98 },
    { nomi: "Andijon viloyati", jamiOlmos: 3820, faolOquvchilar: 94 },
    { nomi: "Namangan viloyati", jamiOlmos: 3710, faolOquvchilar: 91 },
    { nomi: "Qashqadaryo viloyati", jamiOlmos: 3590, faolOquvchilar: 87 },
    { nomi: "Qoraqalpog'iston Resp.", jamiOlmos: 3440, faolOquvchilar: 82 },
    { nomi: "Navoiy viloyati", jamiOlmos: 3310, faolOquvchilar: 76 }
  ];

  const KunlikZanjirVaTurnirMantiqi = {
    hududlar: HUDUDLAR_ROYXATI,

    // Kunlik zanjirni +1 kunga oshirish va 7 kunda +50 💎 super-bonus berish
    zanjirniFaollashtirish: function () {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      u.kunlikZanjirSoni = (u.kunlikZanjirSoni || 5) + 1;

      let bonusOlmos = 5;
      let xabar = `🔥 Kunlik olovli zanjiringiz ${u.kunlikZanjirSoni} kunga yetdi! (+5 💎)`;

      if (u.kunlikZanjirSoni >= 7 && !u.haftalikBonusOlindi) {
        u.haftalikBonusOlindi = true;
        bonusOlmos = 50;
        xabar = `🎉 7 KUNLIK OLOVLI ZANJIR TO'LDI! Sizga +50 💎 Super-Bonus taqdim etildi!`;
      }

      u.olmoslar = (u.olmoslar || 0) + bonusOlmos;
      if (!Array.isArray(u.olmoslarTarixi)) u.olmoslarTarixi = [];
      u.olmoslarTarixi.unshift({
        sana: new Date().toISOString().replace("T", " ").slice(0, 16),
        miqdor: bonusOlmos,
        sabab: `🔥 Olovli Zanjir (${u.kunlikZanjirSoni} kunlik Streak) mukofoti`
      });

      const idx = baza.foydalanuvchilarRoyxati.findIndex(f => f.id === u.id);
      if (idx >= 0) baza.foydalanuvchilarRoyxati[idx] = { ...u };

      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      if (global.OlmoslarVaVaqtTizimi) {
        global.OlmoslarVaVaqtTizimi.ekrandagiOlmosVaVaqtniYangilash();
      }
      return { zanjirSoni: u.kunlikZanjirSoni, bonusOlmos, xabar };
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("reyting-va-turnir-konteyner");
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const streak = u.kunlikZanjirSoni || 5;
      const kunlar = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

      const saralanganFoydalanuvchilar = (baza.foydalanuvchilarRoyxati || [])
        .slice()
        .sort((a, b) => (b.olmoslar || 0) - (a.olmoslar || 0));

      konteyner.innerHTML = `
        <!-- 1. OLOVLI ZANJIR (STREAK) KARTASI -->
        <div class="card" style="margin-bottom:1.5rem; background:linear-gradient(135deg, #7c2d12 0%, #ea580c 55%, #f59e0b 100%); color:#fff;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.5rem;">
            <div>
              <span class="badge-pill" style="background:rgba(255,255,255,0.22); color:#fff; margin-bottom:0.5rem; display:inline-block;">
                🔥 4-MAXSUS MODUL • OLOVLI ZANJIR VA TURNIR
              </span>
              <h1 style="font-size:1.8rem; font-weight:900; margin-bottom:0.4rem;">
                🔥 Sizning Olovli Kunlar Zanjiringiz: ${streak} kun!
              </h1>
              <p style="opacity:0.94; max-width:650px;">
                Har kuni uzluksiz misol ishlab 7 kunlik zanjirni to'ldiring va <strong>+50 💎 Haftalik Super-Bonusni</strong> qo'lga kiriting!
              </p>

              <!-- 7 KUNLIK KALENDAR DOIRALARI -->
              <div style="display:flex; gap:0.65rem; flex-wrap:wrap; margin-top:1.1rem;">
                ${kunlar.map((k, idx) => {
                  const yondi = idx < Math.min(7, streak);
                  return `
                    <div style="width:52px; height:64px; border-radius:14px; background:${yondi ? "#ffffff" : "rgba(255,255,255,0.18)"}; color:${yondi ? "#ea580c" : "#ffffff"}; display:flex; flex-direction:column; align-items:center; justify-content:center; font-weight:900;">
                      <span style="font-size:1.25rem;">${yondi ? "🔥" : "⚪"}</span>
                      <span style="font-size:0.76rem;">${k}</span>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <div style="text-align:center; background:rgba(255,255,255,0.15); padding:1.25rem; border-radius:var(--radius-lg); backdrop-filter:blur(8px);">
              <div style="font-size:2.6rem;">🔥</div>
              <div style="font-weight:800; margin-bottom:0.65rem;">
                ${streak >= 7 ? "✅ 7 kunlik maqsad bajarildi!" : `Super-bonusgacha ${7 - streak} kun qoldi`}
              </div>
              <button type="button" class="btn btn-white" id="btn-claim-streak" style="color:#ea580c;">
                🔥 Bugungi mashqni tasdiqlash (+Olmos)
              </button>
            </div>
          </div>
        </div>

        <div class="grid-2" style="align-items:start;">
          <!-- CHAP TOMON: TOP ISHTIROKCHILAR TURNIRI -->
          <div class="card">
            <h2 style="font-size:1.3rem; font-weight:900; margin-bottom:0.85rem;">
              🏆 Haftalik Shaxsiy Liga (Top Matematiklar)
            </h2>
            <div style="display:flex; flex-direction:column; gap:0.7rem;">
              ${saralanganFoydalanuvchilar.map((f, i) => `
                <div style="padding:0.9rem 1rem; border-radius:var(--radius-md); background:${f.id === u.id ? "var(--bg-tertiary)" : "var(--bg-primary)"}; border:2px solid ${f.id === u.id ? "var(--accent-primary)" : "var(--border-color)"}; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <span style="font-size:1.25rem; font-weight:900; width:28px;">
                      ${i === 0 ? "🥇" : (i === 1 ? "🥈" : (i === 2 ? "🥉" : `#${i + 1}`))}
                    </span>
                    <div>
                      <div style="font-weight:800;">
                        ${f.avatar || "👨‍🎓"} ${f.ism} ${f.familiya}
                        ${f.id === u.id ? `<span class="badge-pill" style="background:var(--accent-primary); color:#fff;">Siz</span>` : ""}
                      </div>
                      <div style="font-size:0.76rem; color:var(--text-muted);">
                        ${f.faolUnvon || f.rol} • 📍 ${f.viloyat || "Toshkent shahri"} • 🔥 ${f.kunlikZanjirSoni || 5} kun
                      </div>
                    </div>
                  </div>
                  <span class="stat-pill diamond-pill">${f.olmoslar || 0} 💎</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- O'NG TOMON: VILOYATLAR REYTINGI -->
          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.85rem;">
              <h2 style="font-size:1.3rem; font-weight:900;">🇺🇿 Hududlar (Viloyatlar) Turniri</h2>
              <select id="user-region-select" class="form-select" style="width:auto; padding:0.4rem 0.75rem; font-size:0.85rem;">
                ${HUDUDLAR_ROYXATI.map(h => `
                  <option value="${h.nomi}" ${u.viloyat === h.nomi ? "selected" : ""}>📍 ${h.nomi}</option>
                `).join("")}
              </select>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              ${HUDUDLAR_ROYXATI.map((h, idx) => `
                <div style="padding:0.75rem 1rem; border-radius:var(--radius-sm); background:${u.viloyat === h.nomi ? "var(--bg-tertiary)" : "var(--bg-primary)"}; display:flex; align-items:center; justify-content:space-between;">
                  <div>
                    <strong>#${idx + 1} ${h.nomi}</strong>
                    <div style="font-size:0.76rem; color:var(--text-muted);">Faol ishtirokchilar: ${h.faolOquvchilar} nafar</div>
                  </div>
                  <span style="font-weight:900; color:#0284c7;">${h.jamiOlmos + (u.viloyat === h.nomi ? (u.olmoslar || 0) : 0)} 💎</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;

      const streakBtn = document.getElementById("btn-claim-streak");
      if (streakBtn) {
        streakBtn.addEventListener("click", () => {
          const res = this.zanjirniFaollashtirish();
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("streak");
          this.interfeysniChizish(konteyner);
        });
      }

      const regSelect = document.getElementById("user-region-select");
      if (regSelect) {
        regSelect.addEventListener("change", () => {
          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ viloyat: regSelect.value });
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`📍 Hududingiz yangilandi: ${regSelect.value}`);
          this.interfeysniChizish(konteyner);
        });
      }
    }
  };

  global.KunlikZanjirVaTurnirMantiqi = KunlikZanjirVaTurnirMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = KunlikZanjirVaTurnirMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
