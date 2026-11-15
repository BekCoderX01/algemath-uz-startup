/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Kirish_va_Royxatdan_utish.js
   VAZIFASI: Foydalanuvchilarni 4 xil usulda:
             1) Telefon raqam (+998...)
             2) Google akkaunt
             3) Email va parol
             4) Instagram profil
             orqali O'quvchi, Ustoz yoki Admin sifatida tizimga kiritish.
   ========================================================================== */

(function (global) {
  const KirishVaRoyxatdanUtish = {
    tanlanganUsul: "telefon", // "telefon" | "google" | "email" | "instagram"

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("kirish-asosiy-konteyner");
      if (!konteyner) return;

      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const joriy = baza.joriyFoydalanuvchi;

      konteyner.innerHTML = `
        <div class="grid-2" style="align-items:start;">
          <!-- CHAP TOMON: 4 XIL USULDA KIRISH FORMASI -->
          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
              <h1 style="font-size:1.5rem; font-weight:900;">🔐 Tizimga Kirish va Ro'yxatdan O'tish</h1>
              <span class="badge-pill" style="background:rgba(5,205,153,0.15); color:var(--success);">+5 💎 Kunlik bonus</span>
            </div>
            <p style="color:var(--text-secondary); margin-bottom:1.25rem; font-size:0.94rem;">
              O'zingizga qulay usulni tanlang: <strong>Telefon raqam</strong>, <strong>Google</strong>, <strong>Email</strong> yoki <strong>Instagram</strong> orqali bir zumda kiring.
            </p>

            <!-- 4 TA KIRISH USULI TABLARI -->
            <div class="grid-4" style="gap:0.6rem; margin-bottom:1.4rem;">
              <button type="button" class="btn ${this.tanlanganUsul === "telefon" ? "btn-primary" : "btn-outline"}" data-auth-tab="telefon" style="padding:0.65rem;">
                📱 Telefon
              </button>
              <button type="button" class="btn ${this.tanlanganUsul === "google" ? "btn-primary" : "btn-outline"}" data-auth-tab="google" style="padding:0.65rem;">
                🌐 Google
              </button>
              <button type="button" class="btn ${this.tanlanganUsul === "email" ? "btn-primary" : "btn-outline"}" data-auth-tab="email" style="padding:0.65rem;">
                ✉️ Email
              </button>
              <button type="button" class="btn ${this.tanlanganUsul === "instagram" ? "btn-primary" : "btn-outline"}" data-auth-tab="instagram" style="padding:0.65rem;">
                📸 Instagram
              </button>
            </div>

            <form id="kirish-formasi">
              <div class="grid-2" style="gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="auth-ism">Ismingiz *</label>
                  <input type="text" id="auth-ism" class="form-input" value="${joriy.ism || ""}" placeholder="Masalan: Sardorbek" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="auth-familiya">Familiyangiz *</label>
                  <input type="text" id="auth-familiya" class="form-input" value="${joriy.familiya || ""}" placeholder="Masalan: Alimov" required />
                </div>
              </div>

              <div class="grid-2" style="gap:1rem;">
                <div class="form-group">
                  <label class="form-label" for="auth-rol">Maqomingizni tanlang</label>
                  <select id="auth-rol" class="form-select">
                    <option value="O'quvchi" ${joriy.rol === "O'quvchi" ? "selected" : ""}>🎓 O'quvchi</option>
                    <option value="Ustoz" ${joriy.rol === "Ustoz" ? "selected" : ""}>👨‍🏫 Ustoz (O'qituvchi)</option>
                    <option value="Admin" ${joriy.rol === "Admin" ? "selected" : ""}>🛡️ Administrator (Admin panel)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="auth-jins">Jinsingiz</label>
                  <select id="auth-jins" class="form-select">
                    <option value="Erkak" ${joriy.jins === "Erkak" ? "selected" : ""}>👨 Erkak</option>
                    <option value="Ayol" ${joriy.jins === "Ayol" ? "selected" : ""}>👩 Ayol</option>
                  </select>
                </div>
              </div>

              <!-- TANLANGAN USULGA MOS MAYDON -->
              <div id="auth-usul-maydoni" style="margin-bottom:1.25rem; padding:1.1rem; border-radius:var(--radius-md); background:var(--bg-tertiary); border:1px solid var(--border-color);">
                ${this.usulMaydoniniOlish(this.tanlanganUsul, joriy)}
              </div>

              <button type="submit" class="btn btn-primary" style="width:100%; font-size:1.05rem; padding:0.95rem;">
                🚀 Tizimga kirish va +5 💎 Kunlik Olmos olish
              </button>
            </form>
          </div>

          <!-- O'NG TOMON: JORIY PROFIL HOLATI VA TEZKOR AKKAUNTLAR -->
          <div class="card">
            <h2 style="font-size:1.25rem; font-weight:800; margin-bottom:1rem;">👤 Joriy Faol Akkaunt</h2>
            <div style="display:flex; align-items:center; gap:1rem; padding:1.1rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color); margin-bottom:1.25rem;">
              <div style="width:64px; height:64px; border-radius:50%; background:var(--accent-gradient); color:#fff; display:flex; align-items:center; justify-content:center; font-size:2rem; overflow:hidden; flex-shrink:0;">
                ${joriy.avatarRasmUrl ? `<img src="${joriy.avatarRasmUrl}" alt="Profil" style="width:100%;height:100%;object-fit:cover;"/>` : (joriy.avatar || "👨‍🎓")}
              </div>
              <div>
                <div style="font-weight:900; font-size:1.15rem;">${joriy.ism} ${joriy.familiya}</div>
                <div style="font-size:0.86rem; color:var(--text-secondary);">
                  Maqom: <strong>${joriy.rol}</strong> • Jins: <strong>${joriy.jins}</strong>
                </div>
                <div style="font-size:0.82rem; color:var(--accent-primary); font-weight:700; margin-top:0.2rem;">
                  Kirish usuli: ${joriy.kirishUsuli || "Telefon raqam"}
                </div>
              </div>
            </div>

            <h3 style="font-size:1rem; font-weight:800; margin-bottom:0.75rem;">⚡ Sinov uchun 1-bosishda tayyor profilga o'tish:</h3>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              <button type="button" class="btn btn-outline" data-demo-login="student" style="justify-content:flex-start;">
                📱 <strong>O'quvchi (Telefon orqali):</strong> Sardorbek Alimov (+998 90 123-45-67)
              </button>
              <button type="button" class="btn btn-outline" data-demo-login="teacher" style="justify-content:flex-start;">
                🌐 <strong>Ustoz (Google orqali):</strong> Dilnoza Karimova (A+ Sertifikat ustozi)
              </button>
              <button type="button" class="btn btn-outline" data-demo-login="instagram" style="justify-content:flex-start;">
                📸 <strong>Instagram orqali:</strong> Javohir Tursunov (@javohir_algebra)
              </button>
              <button type="button" class="btn btn-outline" data-demo-login="admin" style="justify-content:flex-start;">
                🛡️ <strong>Admin Panel (Email orqali):</strong> Bosh Administrator (admin@algemath.uz)
              </button>
            </div>
          </div>
        </div>
      `;

      // Tab tugmalarini ulash
      konteyner.querySelectorAll("[data-auth-tab]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.tanlanganUsul = btn.getAttribute("data-auth-tab");
          this.interfeysniChizish(konteyner);
        });
      });

      // Formani yuborish
      const forma = document.getElementById("kirish-formasi");
      if (forma) {
        forma.addEventListener("submit", (e) => {
          e.preventDefault();
          this.kirishniBajarish();
        });
      }

      // Tezkor demo kirish tugmalari
      konteyner.querySelectorAll("[data-demo-login]").forEach(btn => {
        btn.addEventListener("click", () => {
          const tur = btn.getAttribute("data-demo-login");
          this.demoProfilgaOtish(tur);
          this.interfeysniChizish(konteyner);
        });
      });
    },

    usulMaydoniniOlish: function (usul, joriy) {
      if (usul === "telefon") {
        return `
          <div class="form-group" style="margin-bottom:0.75rem;">
            <label class="form-label" for="auth-credential">📱 Telefon raqamingiz *</label>
            <input type="tel" id="auth-credential" class="form-input" value="${joriy.telefon || "+998 90 123 45 67"}" placeholder="+998 90 123 45 67" required />
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="auth-otp">SMS Tasdiqlash kodi (ixtiyoriy 4 ta raqam)</label>
            <input type="text" id="auth-otp" class="form-input" value="7788" maxlength="6" placeholder="7788" />
          </div>
        `;
      }
      if (usul === "google") {
        return `
          <div class="form-group" style="margin-bottom:0.5rem;">
            <label class="form-label" for="auth-credential">🌐 Google (Gmail) manzilingiz *</label>
            <input type="email" id="auth-credential" class="form-input" value="${joriy.email || "math.student@gmail.com"}" placeholder="example@gmail.com" required />
          </div>
          <div style="font-size:0.82rem; color:var(--text-muted);">
            ✅ Google OAuth 2.0 xavfsiz avtorizatsiya orqali bir zumda tasdiqlanadi.
          </div>
        `;
      }
      if (usul === "email") {
        return `
          <div class="form-group" style="margin-bottom:0.75rem;">
            <label class="form-label" for="auth-credential">✉️ Elektron pochta (Email) *</label>
            <input type="email" id="auth-credential" class="form-input" value="${joriy.email || "sardorbek@algemath.uz"}" placeholder="ism@pochta.uz" required />
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" for="auth-pass">Parol *</label>
            <input type="password" id="auth-pass" class="form-input" value="algebra2026" required />
          </div>
        `;
      }
      return `
        <div class="form-group" style="margin-bottom:0.5rem;">
          <label class="form-label" for="auth-credential">📸 Instagram foydalanuvchi nomi (Username) *</label>
          <input type="text" id="auth-credential" class="form-input" value="${joriy.instagram || "@sardor_math_uz"}" placeholder="@username" required />
        </div>
        <div style="font-size:0.82rem; color:var(--text-muted);">
          ✅ Instagram profilingiz orqali tezkor ulanish va natijalarni ulashish imkoniyati.
        </div>
      `;
    },

    kirishniBajarish: function () {
      const ism = (document.getElementById("auth-ism")?.value || "Foydalanuvchi").trim();
      const familiya = (document.getElementById("auth-familiya")?.value || "").trim();
      const rol = document.getElementById("auth-rol")?.value || "O'quvchi";
      const jins = document.getElementById("auth-jins")?.value || "Erkak";
      const cred = (document.getElementById("auth-credential")?.value || "").trim();

      const usulNomlari = {
        telefon: `Telefon raqam (${cred})`,
        google: `Google (${cred})`,
        email: `Email (${cred})`,
        instagram: `Instagram (${cred.startsWith("@") ? cred : "@" + cred})`
      };

      const yangiMalumot = {
        ism,
        familiya,
        rol,
        jins,
        avatar: jins === "Ayol" ? (rol === "Ustoz" ? "👩‍🏫" : "👩‍🎓") : (rol === "Ustoz" ? "👨‍🏫" : "👨‍🎓"),
        kirishUsuli: usulNomlari[this.tanlanganUsul] || `Telefon (${cred})`
      };
      if (this.tanlanganUsul === "telefon") yangiMalumot.telefon = cred;
      if (this.tanlanganUsul === "google" || this.tanlanganUsul === "email") yangiMalumot.email = cred;
      if (this.tanlanganUsul === "instagram") yangiMalumot.instagram = cred;

      global.UmumiyHolatVaBazalar.foydalanuvchigaOtish(yangiMalumot);
      global.OlmoslarVaVaqtTizimi.kunlikKirishBonusiniTekshirish();
      global.MundarijaVaNavigatsiya.navigatsiyaniChizish("login");
      this.sahifaniIshgaTushirish();
      global.UmumiyHolatVaBazalar.xabarnomaKorsatish(
        `✅ Xush kelibsiz, ${ism} ${familiya}! (${yangiMalumot.kirishUsuli} orqali kirdingiz)`
      );
    },

    demoProfilgaOtish: function (tur) {
      if (tur === "teacher") {
        global.UmumiyHolatVaBazalar.foydalanuvchigaOtish({
          id: "user_2",
          ism: "Dilnoza",
          familiya: "Karimova",
          rol: "Ustoz",
          jins: "Ayol",
          avatar: "👩‍🏫",
          bio: "Oliy toifali matematika ustozi, A+ Milliy Sertifikat sohibasi.",
          kirishUsuli: "Google (dilnoza.math@gmail.com)",
          email: "dilnoza.math@gmail.com",
          tanlanganDaraja: "A+"
        });
      } else if (tur === "instagram") {
        global.UmumiyHolatVaBazalar.foydalanuvchigaOtish({
          id: "user_3",
          ism: "Javohir",
          familiya: "Tursunov",
          rol: "O'quvchi",
          jins: "Erkak",
          avatar: "🚀",
          bio: "Algebra va olimpiada masalalari ishqibozi.",
          kirishUsuli: "Instagram (@javohir_algebra)",
          instagram: "@javohir_algebra",
          tanlanganDaraja: "A"
        });
      } else if (tur === "admin") {
        global.UmumiyHolatVaBazalar.foydalanuvchigaOtish({
          id: "user_admin",
          ism: "Ulug'bek",
          familiya: "Mirzayev",
          rol: "Admin",
          jins: "Erkak",
          avatar: "🛡️",
          bio: "AlgeMath UZ platformasi bosh administratori va metodisti.",
          kirishUsuli: "Email (admin@algemath.uz)",
          email: "admin@algemath.uz",
          tanlanganDaraja: "A+"
        });
      } else {
        global.UmumiyHolatVaBazalar.foydalanuvchigaOtish({
          id: "user_default_1",
          ism: "Sardorbek",
          familiya: "Alimov",
          rol: "O'quvchi",
          jins: "Erkak",
          avatar: "👨‍🎓",
          kirishUsuli: "Telefon raqam (+998 90 123-45-67)",
          telefon: "+998 90 123 45 67",
          tanlanganDaraja: "B"
        });
      }
      global.OlmoslarVaVaqtTizimi.kunlikKirishBonusiniTekshirish();
      global.MundarijaVaNavigatsiya.navigatsiyaniChizish("login");
      global.UmumiyHolatVaBazalar.xabarnomaKorsatish("✅ Tanlangan profilga muvaffaqiyatli o'tildi!");
    }
  };

  global.KirishVaRoyxatdanUtish = KirishVaRoyxatdanUtish;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = KirishVaRoyxatdanUtish;
  }
})(typeof window !== "undefined" ? window : globalThis);
