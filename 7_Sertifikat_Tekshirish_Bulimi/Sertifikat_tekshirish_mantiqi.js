/* ==========================================================================

   PAPKA VA FAYL: 7_Sertifikat_Tekshirish_Bulimi/Sertifikat_tekshirish_mantiqi.js
   VAZIFASI: 7-Modul — "Milliy Sertifikat Haqiqiyligini Tekshirish Reestri".
             Sertifikat ID raqami (masalan: MS-UZ-2026-1001) yoki nomzodning
             Ism-Familiyasi orqali sertifikatning haqiqiyligini, darajasini
             (A+..C) va 45 talik savollar kesimidagi natijasini rasmiy tasdiqlash.
   ========================================================================== */

(function (global) {
  const SertifikatTekshirishMantiqi = {
    oxirgiQidiruv: "MS-UZ-2026-1001",

    sertifikatniTekshirish: function (sorov) {
      const q = (sorov || "").trim().toLowerCase();
      if (!q) return { topildi: false, sertifikat: null };

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const arxiv = baza.berilganSertifikatlarArxivi || [];
      const shaxsiy =
        (baza.joriyFoydalanuvchi && baza.joriyFoydalanuvchi.sertifikatlar) ||
        [];
      const barchasi = [...shaxsiy, ...arxiv];

      const topilgan = barchasi.find(
        (s) =>
          (s.sertifikatId && s.sertifikatId.toLowerCase() === q) ||
          (s.ismFamiliya && s.ismFamiliya.toLowerCase().includes(q)),
      );

      return {
        topildi: !!topilgan,
        sertifikat: topilgan || null,
      };
    },

    qrKodSvgChizish: function (sertifikatId) {
      return `
        <svg viewBox="0 0 80 80" width="84" height="84" style="background:#fff; padding:6px; border-radius:10px; border:2px solid #d97706;">
          <rect x="6" y="6" width="22" height="22" fill="none" stroke="#1e293b" stroke-width="4"/>
          <rect x="13" y="13" width="8" height="8" fill="#1e293b"/>
          <rect x="52" y="6" width="22" height="22" fill="none" stroke="#1e293b" stroke-width="4"/>
          <rect x="59" y="13" width="8" height="8" fill="#1e293b"/>
          <rect x="6" y="52" width="22" height="22" fill="none" stroke="#1e293b" stroke-width="4"/>
          <rect x="13" y="59" width="8" height="8" fill="#1e293b"/>
          <rect x="34" y="10" width="6" height="6" fill="#1e293b"/>
          <rect x="34" y="24" width="10" height="6" fill="#1e293b"/>
          <rect x="34" y="36" width="12" height="12" fill="#183568"/>
          <rect x="52" y="36" width="8" height="14" fill="#1e293b"/>
          <rect x="36" y="56" width="14" height="6" fill="#1e293b"/>
          <rect x="56" y="56" width="14" height="14" fill="#1e293b"/>
          <title>Rasmiy QR: ${sertifikatId}</title>
        </svg>
      `;
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById(
        "sertifikat-tekshirish-konteyner",
      );
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const arxiv = baza.berilganSertifikatlarArxivi || [];
      const natija = this.sertifikatniTekshirish(this.oxirgiQidiruv);

      konteyner.innerHTML = `
        <div class="kun-settings-layout">
          <div class="kun-settings-section-card">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">✅ 7-MAXSUS MODUL • SERTIFIKAT REESTRI VA VERIFIKATSIYA</span>
                <h1 class="section-title">
                  🔍 Milliy Sertifikat Haqiqiyligini Tekshirish Markazi
                </h1>
              </div>
            </div>
            <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:1.25rem;">
              Sertifikatning maxsus ID raqamini (masalan: <strong>MS-UZ-2026-1001</strong>) yoki egasining Ism-Familiyasini kiriting:
            </p>

            <form id="verify-cert-form" style="display:flex; gap:0.85rem; flex-wrap:wrap; margin-bottom:1.25rem;">
              <input type="text"
                     id="verify-cert-input"
                     class="form-input"
                     style="flex:1; min-width:260px; font-weight:800;"
                     value="${this.oxirgiQidiruv}"
                     placeholder="Sertifikat ID (MS-UZ-2026-1001) yoki Ism-Familiya..." />
              <button type="submit" class="btn btn-primary" style="padding:0.85rem 1.85rem;">
                🔍 Haqiqiyligini Tekshirish
              </button>
            </form>

            <div style="display:flex; gap:0.65rem; flex-wrap:wrap; align-items:center; font-size:0.86rem;">
              <span style="color:var(--text-muted); font-weight:700;">Tezkor tekshirib ko'rish:</span>
              ${arxiv
                .slice(0, 5)
                .map(
                  (item) => `
                <button type="button" class="btn btn-outline" data-quick-verify="${item.sertifikatId}" style="padding:0.45rem 0.85rem; font-size:0.82rem;">
                  📜 ${item.sertifikatId} (${item.ismFamiliya} • ${item.daraja})
                </button>
              `,
                )
                .join("")}
            </div>
          </div>

          <!-- TEKSHIRUV NATIJASI -->
          ${
            natija.topildi && natija.sertifikat
              ? `
            <div class="kun-settings-section-card" style="border-top:4px solid var(--success);">
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.25rem; padding-bottom:1.15rem; border-bottom:1px solid var(--border-color); margin-bottom:1.4rem;">
                <div style="display:flex; align-items:center; gap:1rem;">
                  <div style="width:56px; height:56px; border-radius:50%; background:rgba(5,150,105,0.16); color:var(--success); display:flex; align-items:center; justify-content:center; font-size:1.75rem; font-weight:900;">
                    ✓
                  </div>
                  <div>
                    <span class="badge-pill" style="background:rgba(5,150,105,0.18); color:var(--success);">
                      ✅ RASMIY TASDIQLANGAN MILLIY SERTIFIKAT
                    </span>
                    <h2 style="font-size:1.45rem; font-weight:900; margin-top:0.25rem;">
                      ${natija.sertifikat.ismFamiliya} (${natija.sertifikat.rol})
                    </h2>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:1.15rem;">
                  ${this.qrKodSvgChizish(natija.sertifikat.sertifikatId)}
                  <div class="certificate-seal" style="margin:0; width:76px; height:76px;">
                    <div style="font-size:1.45rem;">${natija.sertifikat.daraja}</div>
                    <div style="font-size:0.6rem;">DARAJA</div>
                  </div>
                </div>
              </div>

              <div class="grid-4">
                <div class="card" style="background:var(--bg-primary);">
                  <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Sertifikat ID raqami</div>
                  <div style="font-size:1.15rem; font-weight:900; color:var(--accent-primary); margin:0.25rem 0;">${natija.sertifikat.sertifikatId}</div>
                  <div style="font-size:0.78rem; color:var(--text-secondary);">Berilgan sana: ${natija.sertifikat.sana}</div>
                </div>
                <div class="card" style="background:var(--bg-primary);">
                  <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Umumiy ko'rsatkich (45 savol)</div>
                  <div style="font-size:1.3rem; font-weight:900; color:var(--success); margin:0.25rem 0;">${natija.sertifikat.togriSoni} / 45 (${natija.sertifikat.foiz}%)</div>
                </div>
                <div class="card" style="background:var(--bg-primary);">
                  <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Oson va O'rtacha bosqich</div>
                  <div style="font-size:1.05rem; font-weight:800; margin:0.25rem 0;">Oson: ${natija.sertifikat.osonTogri || 0}/15 • O'rtacha: ${natija.sertifikat.ortachaTogri || 0}/15</div>
                </div>
                <div class="card" style="background:var(--bg-primary);">
                  <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Qiyin (Olimpiada) bosqich</div>
                  <div style="font-size:1.25rem; font-weight:900; color:#e11d48; margin:0.25rem 0;">${natija.sertifikat.qiyinTogri || 0} / 15 ta to'g'ri</div>
                </div>
              </div>
            </div>
          `
              : `
            <div class="card" style="border:2px solid var(--danger); text-align:center; padding:2.25rem;">
              <div style="font-size:2.5rem; margin-bottom:0.5rem;">⚠️</div>
              <h2 style="font-size:1.3rem; font-weight:900;">"${this.oxirgiQidiruv}" bo'yicha Sertifikat topilmadi</h2>
              <p style="color:var(--text-secondary); margin-top:0.4rem;">
                ID raqam to'g'ri yozilganini tekshiring (masalan: <code>MS-UZ-2026-1001</code>) yoki avval 45 talik Sertifikat imtihonini topshiring.
              </p>
            </div>
          `
          }
        </div>
      `;

      document
        .getElementById("verify-cert-form")
        ?.addEventListener("submit", (e) => {
          e.preventDefault();
          this.oxirgiQidiruv =
            document.getElementById("verify-cert-input").value;
          this.interfeysniChizish(konteyner);
        });

      konteyner.querySelectorAll("[data-quick-verify]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.oxirgiQidiruv = btn.getAttribute("data-quick-verify");
          this.interfeysniChizish(konteyner);
        });
      });
    },
  };

  global.SertifikatTekshirishMantiqi = SertifikatTekshirishMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = SertifikatTekshirishMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
