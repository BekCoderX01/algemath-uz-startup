/* ==========================================================================
   PAPKA VA FAYL: 3_Grafik_va_Formulalar_Bulimi/Grafik_va_Formulalar_mantiqi.js
   VAZIFASI: 3-Modul — "Interaktiv Grafik Chizuvchi va Formula Doskasi".
             - y = ax² + bx + c parabola va boshqa funksiyalarni koordinata
               tekisligida jonli chizish, Diskriminant (D), Parabola uchi (x₀; y₀)
               va ildizlarini (x₁, x₂) avtomatik hisoblash;
             - Barcha Algebra va Matematik analiz formulalari doskasi.
   ========================================================================== */

(function (global) {
  const OLTIN_FORMULALAR_DOSKASI = [
    {
      boLim: "1. Qisqa Ko'paytirish Formulalari (QKF)",
      rang: "#4318ff",
      formulalar: [
        "(a + b)² = a² + 2ab + b²",
        "(a - b)² = a² - 2ab + b²",
        "a² - b² = (a - b)(a + b)",
        "a³ + b³ = (a + b)(a² - ab + b²)",
        "a³ - b³ = (a - b)(a² + ab + b²)",
        "(a + b)³ = a³ + 3a²b + 3ab² + b³"
      ]
    },
    {
      boLim: "2. Kvadrat Tenglama va Viyet Teoremasi",
      rang: "#05cd99",
      formulalar: [
        "ax² + bx + c = 0 (a ≠ 0),  D = b² - 4ac",
        "x₁,₂ = (-b ± √D) / (2a)",
        "Viyet: x₁ + x₂ = -b / a,   x₁ · x₂ = c / a",
        "x₁² + x₂² = (x₁ + x₂)² - 2x₁x₂",
        "x₁³ + x₂³ = (x₁ + x₂)³ - 3x₁x₂(x₁ + x₂)",
        "Parabola uchi: x₀ = -b/(2a),  y₀ = -D/(4a)"
      ]
    },
    {
      boLim: "3. Arifmetik va Geometrik Progressiya",
      rang: "#f59e0b",
      formulalar: [
        "a_n = a₁ + (n - 1)d",
        "S_n = ((a₁ + a_n) / 2) · n",
        "O'rta had: a_n = (a_(n-1) + a_(n+1)) / 2",
        "b_n = b₁ · q^(n - 1)",
        "S_n = b₁(q^n - 1) / (q - 1)",
        "Cheksiz kamayuvchi (|q|<1): S = b₁ / (1 - q)"
      ]
    },
    {
      boLim: "4. Logarifm va Daraja Xossalari",
      rang: "#0284c7",
      formulalar: [
        "a^(log_a(b)) = b  (a > 0, a ≠ 1, b > 0)",
        "log_a(x · y) = log_a(x) + log_a(y)",
        "log_a(x / y) = log_a(x) - log_a(y)",
        "log_(a^k)(x^m) = (m / k) · log_a(x)",
        "log_a(b) = 1 / log_b(a)",
        "log_a(b) · log_b(c) = log_a(c)"
      ]
    },
    {
      boLim: "5. Trigonometriya Asosiy Formulalari",
      rang: "#7c3aed",
      formulalar: [
        "sin²α + cos²α = 1,   tgα · ctgα = 1",
        "1 + tg²α = 1 / cos²α",
        "sin(2α) = 2·sinα·cosα",
        "cos(2α) = cos²α - sin²α = 2cos²α - 1",
        "sin(α ± β) = sinα·cosβ ± cosα·sinβ",
        "cos(α ± β) = cosα·cosβ ∓ sinα·sinβ"
      ]
    },
    {
      boLim: "6. Hosila va Aniq Integral (A / A+ daraja)",
      rang: "#e11d48",
      formulalar: [
        "(x^n)' = n · x^(n - 1),   (√x)' = 1 / (2√x)",
        "(u · v)' = u'v + uv',   (u/v)' = (u'v - uv')/v²",
        "Urinma tenglamasi: y = f(x₀) + f'(x₀)(x - x₀)",
        "∫ x^n dx = x^(n + 1) / (n + 1) + C",
        "Nyuton-Leybnits: ∫_a^b f(x)dx = F(b) - F(a)",
        "Koshi tengsizligi: a + b ≥ 2√(ab) (a,b > 0)"
      ]
    }
  ];

  const GrafikVaFormulalarMantiqi = {
    koeffA: 1,
    koeffB: -2,
    koeffC: -3,
    formulalarDoskasi: OLTIN_FORMULALAR_DOSKASI,

    // Kvadrat funksiyani to'liq matematik tahlil qilish
    kvadratFunksiyaniTahlilQilish: function (a, b, c) {
      a = Number(a) || 0;
      b = Number(b) || 0;
      c = Number(c) || 0;

      if (a === 0) {
        // Chiziqli funksiya: y = bx + c
        const ildiz = b !== 0 ? Math.round((-c / b) * 100) / 100 : null;
        return {
          tur: "Chiziqli funksiya (a = 0)",
          diskriminant: null,
          x0: 0,
          y0: c,
          ildizlarMatni: ildiz !== null ? `x = ${ildiz}` : "Ildizi yo'q (yoki cheksiz)",
          ildizlar: ildiz !== null ? [ildiz] : [],
          yonalish: b > 0 ? "O'suvchi to'g'ri chiziq" : (b < 0 ? "Kamayuvchi to'g'ri chiziq" : "Gorizontal chiziq")
        };
      }

      const D = Math.round((b * b - 4 * a * c) * 100) / 100;
      const x0 = Math.round((-b / (2 * a)) * 100) / 100;
      const y0 = Math.round((a * x0 * x0 + b * x0 + c) * 100) / 100;

      let ildizlarMatni = "Haqiqiy ildizlari yo'q (D < 0)";
      let ildizlar = [];
      if (D > 0) {
        const x1 = Math.round(((-b - Math.sqrt(D)) / (2 * a)) * 100) / 100;
        const x2 = Math.round(((-b + Math.sqrt(D)) / (2 * a)) * 100) / 100;
        ildizlar = [x1, x2].sort((m, n) => m - n);
        ildizlarMatni = `x₁ = ${ildizlar[0]},  x₂ = ${ildizlar[1]}`;
      } else if (D === 0) {
        ildizlar = [x0];
        ildizlarMatni = `Bitta (ikkita teng) ildiz: x = ${x0}`;
      }

      return {
        tur: "Parabola (Kvadrat funksiya)",
        diskriminant: D,
        x0,
        y0,
        ildizlarMatni,
        ildizlar,
        yonalish: a > 0 ? "Shoxlari yuqoriga qaragan (a > 0)" : "Shoxlari pastga qaragan (a < 0)"
      };
    },

    // SVG koordinata tekisligida funksiya grafigini chizish
    svgGrafikChizish: function (a, b, c) {
      const width = 560;
      const height = 360;
      const cx = width / 2;
      const cy = height / 2;
      const scale = 24; // 1 birlik = 24px

      let gridLines = "";
      for (let i = -10; i <= 10; i++) {
        const gx = cx + i * scale;
        const gy = cy - i * scale;
        gridLines += `<line x1="${gx}" y1="0" x2="${gx}" y2="${height}" stroke="rgba(148,163,184,0.22)" stroke-width="1"/>`;
        gridLines += `<line x1="0" y1="${gy}" x2="${width}" y2="${gy}" stroke="rgba(148,163,184,0.22)" stroke-width="1"/>`;
      }

      // Nuqtalar ketma-ketligi
      const points = [];
      for (let x = -10; x <= 10; x += 0.15) {
        const y = a * x * x + b * x + c;
        const px = cx + x * scale;
        const py = cy - y * scale;
        if (py >= -60 && py <= height + 60) {
          points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }
      }

      const tahlil = this.kvadratFunksiyaniTahlilQilish(a, b, c);
      const vx = cx + tahlil.x0 * scale;
      const vy = cy - tahlil.y0 * scale;

      const rootCircles = tahlil.ildizlar.map(r => {
        const rx = cx + r * scale;
        return `<circle cx="${rx.toFixed(1)}" cy="${cy}" r="5.5" fill="#05cd99" stroke="#ffffff" stroke-width="2"/>`;
      }).join("");

      return `
        <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" style="background:var(--bg-primary); border-radius:var(--radius-md); border:2px solid var(--border-color);">
          ${gridLines}
          <!-- Ox va Oy o'qlari -->
          <line x1="0" y1="${cy}" x2="${width}" y2="${cy}" stroke="#64748b" stroke-width="2"/>
          <line x1="${cx}" y1="0" x2="${cx}" y2="${height}" stroke="#64748b" stroke-width="2"/>
          <text x="${width - 18}" y="${cy - 8}" fill="#64748b" font-size="12" font-weight="800">x</text>
          <text x="${cx + 8}" y="18" fill="#64748b" font-size="12" font-weight="800">y</text>

          <!-- Funksiya egri chizig'i -->
          <polyline fill="none" stroke="#4318ff" stroke-width="3.5" stroke-linecap="round" points="${points.join(" ")}"/>

          <!-- Ildiz nuqtalari (Ox bilan kesishish) -->
          ${rootCircles}

          <!-- Parabola uchi (x0, y0) -->
          ${vy >= 0 && vy <= height ? `
            <circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
            <text x="${(vx + 8).toFixed(1)}" y="${(vy - 8).toFixed(1)}" fill="#ef4444" font-size="11" font-weight="800">
              (${tahlil.x0}; ${tahlil.y0})
            </text>
          ` : ""}
        </svg>
      `;
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("grafik-va-formulalar-konteyner");
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const tahlil = this.kvadratFunksiyaniTahlilQilish(this.koeffA, this.koeffB, this.koeffC);

      konteyner.innerHTML = `
        <div class="card" style="margin-bottom:1.5rem;">
          <div class="section-header">
            <div>
              <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary); margin-bottom:0.4rem; display:inline-block;">
                📈 3-MAXSUS MODUL • GRAFIK KALKULYATOR VA FORMULALAR
              </span>
              <h1 style="font-size:1.65rem; font-weight:900;">
                📈 Interaktiv Grafik Chizuvchi va Oltin Formulalar Doskasi
              </h1>
              <p style="color:var(--text-secondary); font-size:0.94rem;">
                <strong>y = ax² + bx + c</strong> funksiya koeffitsiyentlarini o'zgartiring — grafik, parabola cho'qqisi, diskriminant va ildizlar jonli chiziladi!
              </p>
            </div>
          </div>

          <div class="grid-2" style="align-items:start;">
            <!-- CHAP TOMON: GRAFIK KOORDINATA TEKISLIGI -->
            <div>
              ${this.svgGrafikChizish(this.koeffA, this.koeffB, this.koeffC)}
              <div style="display:flex; gap:1rem; justify-content:center; margin-top:0.65rem; font-size:0.82rem; font-weight:700;">
                <span style="color:#4318ff;">━━ y = (${this.koeffA})x² + (${this.koeffB})x + (${this.koeffC})</span>
                <span style="color:#ef4444;">● Uchi: (${tahlil.x0}; ${tahlil.y0})</span>
                <span style="color:#05cd99;">● Ox kesishish ildizlari</span>
              </div>
            </div>

            <!-- O'NG TOMON: KOEFFITSIYENTLAR VA MATEMATIK TAHLIL -->
            <div class="card" style="background:var(--bg-primary);">
              <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:0.9rem;">⚙️ Koeffitsiyentlarni kiriting:</h2>
              <div class="grid-3" style="gap:0.75rem; margin-bottom:1rem;">
                <div>
                  <label class="form-label" for="inp-graph-a">a (x² oldida)</label>
                  <input type="number" step="0.5" id="inp-graph-a" class="form-input" value="${this.koeffA}" />
                </div>
                <div>
                  <label class="form-label" for="inp-graph-b">b (x oldida)</label>
                  <input type="number" step="0.5" id="inp-graph-b" class="form-input" value="${this.koeffB}" />
                </div>
                <div>
                  <label class="form-label" for="inp-graph-c">c (ozod had)</label>
                  <input type="number" step="0.5" id="inp-graph-c" class="form-input" value="${this.koeffC}" />
                </div>
              </div>

              <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.15rem;">
                <button type="button" class="btn btn-primary" id="btn-draw-graph">📈 Grafikni yangilash</button>
                <button type="button" class="btn btn-outline" data-preset-fn="1,-2,-3">y = x² - 2x - 3</button>
                <button type="button" class="btn btn-outline" data-preset-fn="-1,4,0">y = -x² + 4x</button>
                <button type="button" class="btn btn-outline" data-preset-fn="0.5,0,-4">y = 0.5x² - 4</button>
              </div>

              <div style="padding:1rem; border-radius:var(--radius-md); background:var(--bg-secondary); border:1px solid var(--border-color);">
                <h3 style="font-size:1rem; font-weight:800; margin-bottom:0.65rem; color:var(--accent-primary);">
                  🧮 Avtomatik Matematik Tahlil:
                </h3>
                <div style="display:flex; flex-direction:column; gap:0.45rem; font-size:0.9rem;">
                  <div>📌 <strong>Turi:</strong> ${tahlil.tur} (${tahlil.yonalish})</div>
                  <div>📌 <strong>Diskriminant (D = b² - 4ac):</strong> <code>${tahlil.diskriminant !== null ? tahlil.diskriminant : "—"}</code></div>
                  <div>📌 <strong>Parabola uchi (x₀; y₀):</strong> <code>(${tahlil.x0}; ${tahlil.y0})</code></div>
                  <div>📌 <strong>Tenglama ildizlari (y = 0):</strong> <code>${tahlil.ildizlarMatni}</code></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- OLTIN FORMULALAR DOSKASI -->
        <div class="card">
          <h2 style="font-size:1.4rem; font-weight:900; margin-bottom:0.5rem;">
            📋 Matematika va Algebra Oltin Formulalar Doskasi (0 dan A+ gacha)
          </h2>
          <p style="color:var(--text-secondary); font-size:0.92rem; margin-bottom:1.25rem;">
            Test va Milliy Sertifikat masalalarini yechishda eng ko'p ishlatiladigan asosiy formulalar jamlanmasi:
          </p>

          <div class="grid-3">
            ${OLTIN_FORMULALAR_DOSKASI.map(blok => `
              <div class="card" style="background:var(--bg-primary); border-top:4px solid ${blok.rang};">
                <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:0.75rem;">${blok.boLim}</h3>
                <div style="display:flex; flex-direction:column; gap:0.45rem;">
                  ${blok.formulalar.map(f => `
                    <div style="padding:0.45rem 0.65rem; background:var(--bg-secondary); border-radius:8px; font-family:monospace; font-weight:700; font-size:0.86rem; border:1px solid var(--border-color);">
                      ${f}
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      const chizishBtn = document.getElementById("btn-draw-graph");
      if (chizishBtn) {
        chizishBtn.addEventListener("click", () => {
          this.koeffA = Number(document.getElementById("inp-graph-a").value) || 0;
          this.koeffB = Number(document.getElementById("inp-graph-b").value) || 0;
          this.koeffC = Number(document.getElementById("inp-graph-c").value) || 0;
          this.interfeysniChizish(konteyner);
        });
      }

      konteyner.querySelectorAll("[data-preset-fn]").forEach(btn => {
        btn.addEventListener("click", () => {
          const parts = btn.getAttribute("data-preset-fn").split(",").map(Number);
          this.koeffA = parts[0];
          this.koeffB = parts[1];
          this.koeffC = parts[2];
          this.interfeysniChizish(konteyner);
        });
      });
    }
  };

  global.GrafikVaFormulalarMantiqi = GrafikVaFormulalarMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = GrafikVaFormulalarMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
