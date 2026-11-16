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
        <div class="kun-settings-layout">
          <!-- 1. OLOVLI ZANJIR (STREAK) KARTASI -->
          <div class="kun-page-banner">
            <div>
              <span class="badge-pill" style="background:rgba(255,255,255,0.22); color:#fde047; margin-bottom:0.5rem; display:inline-block;">
                🔥 4-MAXSUS MODUL • OLOVLI ZANJIR VA TURNIR
              </span>
              <h1 style="font-size:1.8rem; font-weight:900; margin-bottom:0.4rem;">
                🔥 Sizning Olovli Kunlar Zanjiringiz: ${streak} kun!
              </h1>
              <p style="opacity:0.94; max-width:650px;">
                Har kuni uzluksiz misol ishlab 7 kunlik zanjirni to'ldiring va <strong>+50 💎 Haftalik Super-Bonusni</strong> qo'lga kiriting!
              </p>

              <!-- 7 KUNLIK KALENDAR DOIRALARI -->
              <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1.25rem;">
                ${kunlar.map((k, idx) => {
                  const yondi = idx < Math.min(7, streak);
                  return `
                    <div style="width:54px; height:66px; border-radius:12px; background:${yondi ? "#ffffff" : "rgba(255,255,255,0.16)"}; color:${yondi ? "#12295d" : "#ffffff"}; display:flex; flex-direction:column; align-items:center; justify-content:center; font-weight:900;">
                      <span style="font-size:1.25rem;">${yondi ? "🔥" : "⚪"}</span>
                      <span style="font-size:0.78rem;">${k}</span>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <div style="text-align:center; background:rgba(255,255,255,0.15); padding:1.35rem; border-radius:var(--radius-lg); backdrop-filter:blur(8px);">
              <div style="font-size:2.6rem;">🔥</div>
              <div style="font-weight:800; margin-bottom:0.75rem;">
                ${streak >= 7 ? "✅ 7 kunlik maqsad bajarildi!" : `Super-bonusgacha ${7 - streak} kun qoldi`}
              </div>
              <button type="button" class="btn btn-amber" id="btn-claim-streak">
                🔥 Bugungi mashqni tasdiqlash (+Olmos)
              </button>
            </div>
          </div>

          <div class="grid-2" style="align-items:start;">
            <!-- CHAP TOMON: TOP ISHTIROKCHILAR TURNIRI -->
            <div class="kun-settings-section-card">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">1-BO'LIM • SHAXSIY REYTING</span>
                  <h2 class="section-title">
                    🏆 Haftalik Shaxsiy Liga (Top Matematiklar)
                  </h2>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.85rem;">
                ${saralanganFoydalanuvchilar.map((f, i) => `
                  <div style="padding:1rem 1.2rem; border-radius:var(--radius-md); background:${f.id === u.id ? "var(--accent-light)" : "var(--bg-primary)"}; border:2px solid ${f.id === u.id ? "var(--accent-primary)" : "var(--border-color)"}; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
                    <div style="display:flex; align-items:center; gap:0.85rem;">
                      <span style="font-size:1.25rem; font-weight:900; width:30px;">
                        ${i === 0 ? "🥇" : (i === 1 ? "🥈" : (i === 2 ? "🥉" : `#${i + 1}`))}
                      </span>
                      <div>
                        <div style="font-weight:800;">
                          ${f.avatar || "👨‍🎓"} ${f.ism} ${f.familiya}
                          ${f.id === u.id ? `<span class="badge-pill" style="background:var(--accent-primary); color:#fff;">Siz</span>` : ""}
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.15rem;">
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
            <div class="kun-settings-section-card">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">2-BO'LIM • VILOYATLAR LIGASI</span>
                  <h2 class="section-title">🇺🇿 Hududlar (Viloyatlar) Turniri</h2>
                </div>
                <select id="user-region-select" class="form-select" style="width:auto; padding:0.5rem 0.9rem; font-size:0.86rem;">
                  ${HUDUDLAR_ROYXATI.map(h => `
                    <option value="${h.nomi}" ${u.viloyat === h.nomi ? "selected" : ""}>📍 ${h.nomi}</option>
                  `).join("")}
                </select>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.8rem;">
                ${HUDUDLAR_ROYXATI.map((h, idx) => `
                  <div style="padding:0.9rem 1.15rem; border-radius:var(--radius-sm); background:${u.viloyat === h.nomi ? "var(--accent-light)" : "var(--bg-primary)"}; border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <strong>#${idx + 1} ${h.nomi}</strong>
                      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.15rem;">Faol ishtirokchilar: ${h.faolOquvchilar} nafar</div>
                    </div>
                    <span style="font-weight:900; color:#0284c7;">${h.jamiOlmos + (u.viloyat === h.nomi ? (u.olmoslar || 0) : 0)} 💎</span>
                  </div>
                `).join("")}
              </div>
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
