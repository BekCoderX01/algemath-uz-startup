/* ==========================================================================
   PAPKA VA FAYL: 1_Olmoslar_Dukoni_Bulimi/Olmoslar_dukoni_mantiqi.js
   VAZIFASI: 1-Modul — "Olmoslar Do'koni (Diamond Shop)".
             Foydalanuvchi har kuni kirganda (+5 💎) va test/darslardan
             to'plagan olmoslariga:
             - PDF / Bosma Algebra Formulalari To'plami
             - Profil uchun Oltin va Olmos ramkalar
             - Maxsus faxriy unvonlar ("Al-Xorazmiy vorisi", "A+ Chempioni")
             - Mashq imtihoni uchun 50/50 yordamchi paketlarni sotib olishi
             va profiliga o'rnatishi mumkin.
   ========================================================================== */

(function (global) {
  const DUKON_MAHSULOTLARI = [
    {
      id: "item_pdf_qkf_viyet",
      kategoriya: "📚 PDF Qo'llanmalar",
      ikonka: "📕",
      nomi: "100 ta Oltin Algebra Formulasi (Shpargalka)",
      tavsif: "Qisqa ko'paytirish, Viyet teoremasi, Ildizlar, Progressiyalar va Logarifmning barcha maxfiy usullari.",
      narxOlmos: 15,
      tur: "qollanma",
      kontent: "QKF: (a±b)² = a²±2ab+b² | a³±b³ = (a±b)(a²∓ab+b²) | Viyet: x₁+x₂ = -b/a, x₁x₂ = c/a | Logarifm: log_a(xy)=log_a(x)+log_a(y)"
    },
    {
      id: "item_pdf_aplus_sirlari",
      kategoriya: "📚 PDF Qo'llanmalar",
      ikonka: "📘",
      nomi: "A+ Milliy Sertifikat (31–45 Qiyin Savollar) Yechimlari",
      tavsif: "Parametrli tenglamalar, Koshi tengsizligi, Nyuton binomi va aniq integralni 30 soniyada ishlash metodikasi.",
      narxOlmos: 30,
      tur: "qollanma",
      kontent: "Koshi: a+b ≥ 2√(ab) | Nyuton-Leybnits: ∫_a^b f(x)dx = F(b)-F(a) | Urinma: y = f(x₀) + f'(x₀)(x-x₀)"
    },
    {
      id: "item_title_xorazmiy",
      kategoriya: "👑 Faxriy Unvonlar",
      ikonka: "🌟",
      nomi: "Unvon: «🌟 Al-Xorazmiy izdoshi»",
      tavsif: "Profilingiz va Reyting jadvalida ismingiz yonida ko'rinib turuvchi nufuzli unvon.",
      narxOlmos: 20,
      tur: "unvon",
      qiymat: "🌟 Al-Xorazmiy izdoshi"
    },
    {
      id: "item_title_aplus_king",
      kategoriya: "👑 Faxriy Unvonlar",
      ikonka: "👑",
      nomi: "Unvon: «👑 A+ Milliy Sertifikat Qiroli»",
      tavsif: "Eng yuqori darajaga intiluvchi o'quvchi va ustozlar uchun maxsus oltin unvon.",
      narxOlmos: 45,
      tur: "unvon",
      qiymat: "👑 A+ Milliy Sertifikat Qiroli"
    },
    {
      id: "item_frame_gold",
      kategoriya: "🖼️ Profil Ramkalari",
      ikonka: "✨",
      nomi: "Oltin Akademik Profil Ramkasi",
      tavsif: "Profil rasmingiz atrofida yaltirab turuvchi oltin hoshiya.",
      narxOlmos: 25,
      tur: "ramka",
      qiymat: "Oltin Akademik Ramka"
    },
    {
      id: "item_frame_diamond",
      kategoriya: "🖼️ Profil Ramkalari",
      ikonka: "💎",
      nomi: "Zumrad-Olmos Chempion Ramkasi",
      tavsif: "Top-reyting ishtirokchilari uchun maxsus ko'k-zumrad neon ramka.",
      narxOlmos: 40,
      tur: "ramka",
      qiymat: "Zumrad-Olmos Ramka"
    }
  ];

  const OlmoslarDukoniMantiqi = {
    mahsulotlar: DUKON_MAHSULOTLARI,
    tanlanganKategoriya: "barchasi",
    ochiqQollanma: null,

    xaridQilish: function (mahsulotId) {
      const mahsulot = DUKON_MAHSULOTLARI.find(m => m.id === mahsulotId);
      if (!mahsulot) return { muvaffaqiyat: false, xabar: "Mahsulot topilmadi" };

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      if (!Array.isArray(u.xaridlar)) u.xaridlar = [];

      // Agar allaqachon sotib olingan bo'lsa, uni faollashtiramiz
      if (u.xaridlar.includes(mahsulotId)) {
        if (mahsulot.tur === "unvon") u.faolUnvon = mahsulot.qiymat;
        if (mahsulot.tur === "ramka") u.faolRamka = mahsulot.qiymat;
        if (mahsulot.tur === "qollanma") this.ochiqQollanma = mahsulot;
        global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
        return { muvaffaqiyat: true, allaqachonBor: true, xabar: `✅ "${mahsulot.nomi}" faollashtirildi!` };
      }

      if ((u.olmoslar || 0) < mahsulot.narxOlmos) {
        return {
          muvaffaqiyat: false,
          xabar: `⚠️ Olmoslaringiz yetarli emas! Kerak: ${mahsulot.narxOlmos} 💎, Sizda: ${u.olmoslar || 0} 💎`
        };
      }

      u.olmoslar -= mahsulot.narxOlmos;
      u.xaridlar.push(mahsulotId);
      if (mahsulot.tur === "unvon") u.faolUnvon = mahsulot.qiymat;
      if (mahsulot.tur === "ramka") u.faolRamka = mahsulot.qiymat;
      if (mahsulot.tur === "qollanma") this.ochiqQollanma = mahsulot;

      if (!Array.isArray(u.olmoslarTarixi)) u.olmoslarTarixi = [];
      u.olmoslarTarixi.unshift({
        sana: new Date().toISOString().replace("T", " ").slice(0, 16),
        miqdor: -mahsulot.narxOlmos,
        sabab: `Olmoslar do'konidan xarid: "${mahsulot.nomi}"`
      });

      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      if (global.OlmoslarVaVaqtTizimi) {
        global.OlmoslarVaVaqtTizimi.ekrandagiOlmosVaVaqtniYangilash();
      }
      return {
        muvaffaqiyat: true,
        qolganOlmos: u.olmoslar,
        xabar: `🎉 Tabriklaymiz! "${mahsulot.nomi}" (${mahsulot.narxOlmos} 💎) xarid qilindi!`
      };
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("olmoslar-dukoni-konteyner");
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const xaridlar = u.xaridlar || [];

      const filtrlangan = DUKON_MAHSULOTLARI.filter(m =>
        this.tanlanganKategoriya === "barchasi" || m.tur === this.tanlanganKategoriya
      );

      konteyner.innerHTML = `
        <!-- DO'KON BOSH BANNERI -->
        <div class="kun-page-banner">
          <div>
            <span class="badge-pill" style="background:rgba(255,255,255,0.2); color:#38bdf8; margin-bottom:0.5rem; display:inline-block;">
              🛒 1-MAXSUS MODUL • OLMOSLAR DO'KONI
            </span>
            <h1 style="font-size:1.75rem; font-weight:900; margin-bottom:0.4rem;">
              💎 Olmoslar Do'koni (Diamond Shop)
            </h1>
            <p style="opacity:0.92; max-width:660px; font-size:0.95rem;">
              Har kungi kirishdan (+5 💎), darslar va testlardan yig'gan olmoslaringizni PDF formula kitobchalar, faxriy unvonlar va profil ramkalariga almashtiring!
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.14); padding:1.1rem 1.5rem; border-radius:var(--radius-lg); text-align:center; backdrop-filter:blur(8px);">
            <div style="font-size:0.82rem; opacity:0.85;">Mening hamyonim:</div>
            <div style="font-size:2rem; font-weight:900; color:#38bdf8;">
              <span data-live-diamonds>${u.olmoslar || 0}</span> 💎
            </div>
            <div style="font-size:0.78rem; margin-top:0.2rem;">Faol unvon: <strong>${u.faolUnvon || "Yo'q"}</strong></div>
          </div>
        </div>

        <!-- KATEGORIYA FILTRLARI -->
        <div class="kun-filter-bar">
          <div style="font-weight:800; color:var(--accent-primary);">📂 Mahsulot toifalari:</div>
          <div style="display:flex; gap:0.65rem; flex-wrap:wrap;">
            <button type="button" class="btn ${this.tanlanganKategoriya === "barchasi" ? "btn-primary" : "btn-outline"}" data-shop-cat="barchasi">
              🛍️ Barcha mahsulotlar (${DUKON_MAHSULOTLARI.length})
            </button>
            <button type="button" class="btn ${this.tanlanganKategoriya === "qollanma" ? "btn-primary" : "btn-outline"}" data-shop-cat="qollanma">
              📚 PDF Formula Shpargalkalar
            </button>
            <button type="button" class="btn ${this.tanlanganKategoriya === "unvon" ? "btn-primary" : "btn-outline"}" data-shop-cat="unvon">
              👑 Faxriy Unvonlar
            </button>
            <button type="button" class="btn ${this.tanlanganKategoriya === "ramka" ? "btn-primary" : "btn-outline"}" data-shop-cat="ramka">
              🖼️ Profil Ramkalari
            </button>
          </div>
        </div>

        ${this.ochiqQollanma ? `
          <div class="card" style="margin-bottom:1.5rem; border:2px solid var(--success); background:var(--bg-tertiary);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.6rem;">
              <h3 style="font-size:1.2rem; font-weight:900;">📖 ${this.ochiqQollanma.nomi} (Ochiq Qo'llanma)</h3>
              <button type="button" class="btn btn-outline" id="close-guide-btn" style="padding:0.35rem 0.8rem;">✕ Yopish</button>
            </div>
            <div style="padding:1rem; background:var(--bg-secondary); border-radius:var(--radius-md); font-family:monospace; font-weight:700; font-size:0.95rem; margin-bottom:0.75rem;">
              ${this.ochiqQollanma.kontent}
            </div>
            <button type="button" class="btn btn-primary" onclick="window.print()">🖨️ PDF sifatida chop etish / saqlash</button>
          </div>
        ` : ""}

        <!-- MAHSULOTLAR VITRINASI -->
        <div class="grid-3">
          ${filtrlangan.map(m => {
            const sotibOlingan = xaridlar.includes(m.id);
            const faolUnvonmi = u.faolUnvon === m.qiymat || u.faolRamka === m.qiymat;
            return `
              <div class="card card-interactive" style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                    <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">${m.kategoriya}</span>
                    <span class="stat-pill diamond-pill">${m.narxOlmos} 💎</span>
                  </div>
                  <div style="font-size:2.4rem; margin-bottom:0.5rem;">${m.ikonka}</div>
                  <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.4rem;">${m.nomi}</h3>
                  <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.2rem;">${m.tavsif}</p>
                </div>

                <button type="button"
                        class="btn ${sotibOlingan ? "btn-emerald" : "btn-primary"}"
                        data-buy-item="${m.id}"
                        style="width:100%;">
                  ${sotibOlingan
                    ? (faolUnvonmi ? "✅ Profilga o'rnatilgan" : (m.tur === "qollanma" ? "📖 Qo'llanmani ochish" : "✨ Profilga o'rnatish"))
                    : `🛒 Xarid qilish (${m.narxOlmos} 💎)`}
                </button>
              </div>
            `;
          }).join("")}
        </div>
      `;

      konteyner.querySelectorAll("[data-shop-cat]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.tanlanganKategoriya = btn.getAttribute("data-shop-cat");
          this.interfeysniChizish(konteyner);
        });
      });

      konteyner.querySelectorAll("[data-buy-item]").forEach(btn => {
        btn.addEventListener("click", () => {
          const itemId = btn.getAttribute("data-buy-item");
          const res = this.xaridQilish(itemId);
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
          this.interfeysniChizish(konteyner);
        });
      });

      const yopishBtn = document.getElementById("close-guide-btn");
      if (yopishBtn) {
        yopishBtn.addEventListener("click", () => {
          this.ochiqQollanma = null;
          this.interfeysniChizish(konteyner);
        });
      }
    }
  };

  global.OlmoslarDukoniMantiqi = OlmoslarDukoniMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = OlmoslarDukoniMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
