/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Sozlamalar_va_Profil.js
   VAZIFASI:
     1) Sozlamalar bo'limi (Kun.uz portali uslubida 4 ta alohida, keng va
        tartibli bloklarga ajratilgan):
        - 1-blok: Kunduzgi rejim (☀️) va Tungi rejim (🌙) tanlash
        - 2-blok: O'zbek (🇺🇿 O'zbekiston bayrog'i), Rus (🇷🇺 Rossiya bayrog'i) va
          Ingliz (🇺🇸 Amerika bayrog'i) tillarini tanlash
        - 3-blok: Profil rasmi (kompyuter/telefondan yuklash yoki matematik
          avatar tanlash)
        - 4-blok: Ism-familiya, Erkak/Ayol jinsi, O'quvchi/Ustoz maqomi va "BIO"
     2) Shaxsiy Profil, Olmoslar (💎) va Kunlik Ishlangan Vaqt sahifasi.
   ========================================================================== */

(function (global) {
  const SozlamalarVaProfil = {
    // SOZLAMALAR SAHIFASINI ISHGA TUSHIRISH (TARTIBLI VA KENG KUN.UZ MAKETIDA)
    sozlamalarSahifasiniChizish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("sozlamalar-asosiy-konteyner");
      if (!konteyner) return;

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const joriyTil = global.TilVaTarjimalar.joriyTilniOlish();
      const joriyTilObj = global.TilVaTarjimalar.tillarRoyxati.find(t => t.kod === joriyTil) || global.TilVaTarjimalar.tillarRoyxati[0];
      const avatarlar = global.RasmlarVaBelgilar ? global.RasmlarVaBelgilar.standartAvatarlar : [];

      konteyner.innerHTML = `
        <div class="kun-settings-layout">
          <!-- YUQORI SARLAVHA VA JORIY HOLAT XULOSASI -->
          <div class="card" style="border-left:6px solid var(--accent-primary);">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.5rem;">
              <div style="display:flex; align-items:center; gap:1.25rem; flex-wrap:wrap;">
                <div style="width:78px; height:78px; border-radius:50%; background:var(--accent-gradient); color:#fff; display:flex; align-items:center; justify-content:center; font-size:2.4rem; overflow:hidden; flex-shrink:0; box-shadow:var(--shadow-md);">
                  ${u.avatarRasmUrl ? `<img src="${u.avatarRasmUrl}" alt="Profil" style="width:100%;height:100%;object-fit:cover;"/>` : (u.avatar || "👨‍🎓")}
                </div>
                <div>
                  <span class="kun-settings-step-badge">⚙️ TIZIM VA SHAXSIY KABINET SOZLAMALARI</span>
                  <h1 style="font-size:1.65rem; font-weight:900; margin-bottom:0.25rem;" data-i18n="settings_title">
                    ${global.TilVaTarjimalar.matn("settings_title", joriyTil)}
                  </h1>
                  <p style="color:var(--text-secondary); font-size:0.94rem;">
                    Foydalanuvchi: <strong>${u.ism} ${u.familiya}</strong> (${u.rol} • ${u.jins}) — Barcha sozlamalar 4 ta alohida bo'limga tartibli joylashtirilgan.
                  </p>
                </div>
              </div>

              <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                <span class="stat-pill">
                  ${baza.tungiRejim ? "🌙 Tungi rejim" : "☀️ Kunduzgi rejim"}
                </span>
                <span class="stat-pill">
                  ${joriyTilObj.emojiBayroq} ${joriyTilObj.nomi}
                </span>
                <a href="${global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Profil_va_Olmoslar_sahifasi.html")}" class="btn btn-outline" style="padding:0.55rem 1rem; font-size:0.86rem;">
                  👤 Profilga o'tish →
                </a>
              </div>
            </div>
          </div>

          <!-- TEZKOR BO'LIMLARGA O'TISH NAVIGATSIYASI -->
          <nav class="kun-settings-nav-pills" aria-label="Sozlamalar bo'limlari">
            <a href="#settings-sec-theme" class="kun-settings-nav-link">1. ☀️/🌙 Kunduzgi va Tungi rejim</a>
            <a href="#settings-sec-lang" class="kun-settings-nav-link">2. 🌐 Sayt tili va Davlat bayroqlari</a>
            <a href="#settings-sec-avatar" class="kun-settings-nav-link">3. 📸 Profil rasmi va Avatar</a>
            <a href="#settings-sec-profile" class="kun-settings-nav-link">4. 👤 Shaxsiy ma'lumotlar, Jins va BIO</a>
          </nav>

          <!-- 1-BO'LIM: TUNGI YOKI KUNDUZGI REJIM -->
          <section class="kun-settings-section-card" id="settings-sec-theme">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">1-BO'LIM • TASHQI KO'RINISH</span>
                <h2 class="section-title" data-i18n="settings_theme_label">
                  ${global.TilVaTarjimalar.matn("settings_theme_label", joriyTil)}
                </h2>
              </div>
              <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">
                Faol: ${baza.tungiRejim ? "🌙 Tungi rejim" : "☀️ Kunduzgi rejim"}
              </span>
            </div>

            <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:1.4rem;">
              O'qish va test ishlash uchun o'zingizga qulay rang rejimini tanlang:
            </p>

            <div class="grid-2">
              <button type="button"
                      class="language-flag-option ${!baza.tungiRejim ? "active" : ""}"
                      id="set-light-mode-btn"
                      style="padding:1.4rem 1.6rem;">
                <span style="font-size:2.2rem;">☀️</span>
                <div style="flex:1;">
                  <div style="font-size:1.08rem; font-weight:900; margin-bottom:0.2rem;" data-i18n="theme_light">
                    ${global.TilVaTarjimalar.matn("theme_light", joriyTil)}
                  </div>
                  <div style="font-size:0.86rem; color:var(--text-muted); font-weight:500;">
                    Kun.uz uslubidagi yorug', oq-ko'k klassik kunduzgi portal dizayni
                  </div>
                </div>
                ${!baza.tungiRejim ? `<span class="badge-pill" style="background:var(--accent-primary); color:#fff;">✓ Tanlangan</span>` : ""}
              </button>

              <button type="button"
                      class="language-flag-option ${baza.tungiRejim ? "active" : ""}"
                      id="set-dark-mode-btn"
                      style="padding:1.4rem 1.6rem;">
                <span style="font-size:2.2rem;">🌙</span>
                <div style="flex:1;">
                  <div style="font-size:1.08rem; font-weight:900; margin-bottom:0.2rem;" data-i18n="theme_dark">
                    ${global.TilVaTarjimalar.matn("theme_dark", joriyTil)}
                  </div>
                  <div style="font-size:0.86rem; color:var(--text-muted); font-weight:500;">
                    Kechqurun misol ishlaganda ko'zni charchatmaydigan to'q ko'k tungi rejim
                  </div>
                </div>
                ${baza.tungiRejim ? `<span class="badge-pill" style="background:var(--accent-primary); color:#fff;">✓ Tanlangan</span>` : ""}
              </button>
            </div>
          </section>

          <!-- 2-BO'LIM: TIL TANLASH (DAVLAT BAYROG'I BILAN: O'ZBEKISTON, ROSSIYA, AMERIKA) -->
          <section class="kun-settings-section-card" id="settings-sec-lang">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">2-BO'LIM • TIL VA MINTAQA</span>
                <h2 class="section-title" data-i18n="settings_lang_label">
                  ${global.TilVaTarjimalar.matn("settings_lang_label", joriyTil)}
                </h2>
              </div>
              <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">
                Faol til: ${joriyTil.toUpperCase()}
              </span>
            </div>

            <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:1.4rem;">
              Har bir til yonida mos davlat bayrog'i (O'zbek tili — O'zbekiston bayrog'i 🇺🇿, Rus tili — Rossiya bayrog'i 🇷🇺, Ingliz tili — AQSh bayrog'i 🇺🇸) joylashtirilgan:
            </p>

            <div class="grid-3">
              ${global.TilVaTarjimalar.tillarRoyxati.map(t => `
                <button type="button"
                        class="language-flag-option ${joriyTil === t.kod ? "active" : ""}"
                        data-lang-pick="${t.kod}"
                        style="padding:1.35rem 1.5rem;">
                  ${global.TilVaTarjimalar.bayroqHtmlOlish(t.kod)}
                  <div style="text-align:left; flex:1;">
                    <div style="font-size:1.06rem; font-weight:900; margin-bottom:0.2rem;">${t.emojiBayroq} ${t.nomi}</div>
                    <div style="font-size:0.82rem; color:var(--text-muted); font-weight:600;">${t.davlat}</div>
                  </div>
                  ${joriyTil === t.kod ? `<span class="badge-pill" style="background:var(--accent-primary); color:#fff;">Faol</span>` : ""}
                </button>
              `).join("")}
            </div>
          </section>

          <!-- 3-BO'LIM: PROFIL RASMI VA MATEMATIK AVATARLAR -->
          <section class="kun-settings-section-card" id="settings-sec-avatar">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">3-BO'LIM • PROFIL RASMI VA BELGISI</span>
                <h2 class="section-title">
                  📸 Profil rasmini yuklash yoki Matematik Avatar tanlash
                </h2>
              </div>
            </div>

            <div class="grid-2" style="align-items:center;">
              <!-- CHAP: KOMPYUTER YOKI TELEFONDAN RASM YUKLASH -->
              <div style="display:flex; align-items:center; gap:1.35rem; padding:1.5rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1.5px solid var(--border-color);">
                <div id="settings-avatar-preview" style="width:92px; height:92px; border-radius:50%; background:var(--accent-gradient); color:#fff; display:flex; align-items:center; justify-content:center; font-size:2.75rem; overflow:hidden; flex-shrink:0; box-shadow:var(--shadow-md);">
                  ${u.avatarRasmUrl ? `<img src="${u.avatarRasmUrl}" alt="Profil rasmi" style="width:100%;height:100%;object-fit:cover;"/>` : (u.avatar || "👨‍🎓")}
                </div>
                <div style="flex:1;">
                  <label class="form-label" for="profil-rasm-fayl" style="margin-bottom:0.5rem;">
                    📸 Kompyuter yoki telefondan shaxsiy rasm yuklash:
                  </label>
                  <input type="file" id="profil-rasm-fayl" accept="image/*" class="form-input" style="padding:0.6rem;" />
                  ${u.avatarRasmUrl ? `
                    <button type="button" id="rasmni-ochirish-btn" class="btn btn-outline" style="margin-top:0.65rem; padding:0.45rem 0.95rem; font-size:0.84rem;">
                      🗑️ Yuklangan rasmni olib tashlash
                    </button>
                  ` : `
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.4rem;">
                      JPG, PNG yoki WEBP formatdagi rasm tanlang (avtomatik moslashtiriladi).
                    </div>
                  `}
                </div>
              </div>

              <!-- O'NG: TAYYOR MATEMATIK AVATARLAR -->
              <div style="padding:1.5rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1.5px solid var(--border-color);">
                <div class="form-label" style="margin-bottom:0.85rem;">
                  🎯 Yoki tayyor matematik belgilardan birini tanlang:
                </div>
                <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                  ${avatarlar.map(av => `
                    <button type="button"
                            class="btn ${u.avatar === av.svg && !u.avatarRasmUrl ? "btn-primary" : "btn-outline"}"
                            data-avatar-pick="${av.svg}"
                            style="padding:0.65rem 1.05rem; font-size:1.35rem;"
                            title="${av.label}">
                      <span>${av.svg}</span>
                      <span style="font-size:0.82rem; font-weight:700;">${av.label.split(" ")[0]}</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>
          </section>

          <!-- 4-BO'LIM: SHAXSIY MA'LUMOTLAR, JINS (ERKAK/AYOL), MAQOM VA BIO -->
          <section class="kun-settings-section-card" id="settings-sec-profile">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">4-BO'LIM • SHAXSIY ANKETA VA BIO</span>
                <h2 class="section-title" data-i18n="settings_profile_label">
                  ${global.TilVaTarjimalar.matn("settings_profile_label", joriyTil)}
                </h2>
              </div>
            </div>

            <form id="sozlamalar-profil-formasi">
              <div class="grid-2" style="margin-bottom:0.5rem;">
                <div class="form-group">
                  <label class="form-label" for="set-ism">Ismingiz (Sertifikat va Reytingda ko'rinadi) *</label>
                  <input type="text" id="set-ism" class="form-input" value="${u.ism || ""}" placeholder="Masalan: Sardorbek" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="set-familiya">Familiyangiz *</label>
                  <input type="text" id="set-familiya" class="form-input" value="${u.familiya || ""}" placeholder="Masalan: Alimov" required />
                </div>
              </div>

              <div class="grid-2" style="margin-bottom:0.5rem;">
                <!-- ERKAK YOKI AYOL EKANLIGINI TANLASH -->
                <div class="form-group">
                  <label class="form-label">Jinsingizni tanlang (Erkak yoki Ayol) *</label>
                  <div class="grid-2" style="gap:1rem; grid-template-columns: 1fr 1fr;">
                    <label class="language-flag-option ${u.jins === "Erkak" ? "active" : ""}" style="cursor:pointer; padding:0.9rem 1.15rem;">
                      <input type="radio" name="set_jins_radio" value="Erkak" ${u.jins === "Erkak" ? "checked" : ""} />
                      <span>👨 <span data-i18n="gender_male">${global.TilVaTarjimalar.matn("gender_male", joriyTil)}</span></span>
                    </label>
                    <label class="language-flag-option ${u.jins === "Ayol" ? "active" : ""}" style="cursor:pointer; padding:0.9rem 1.15rem;">
                      <input type="radio" name="set_jins_radio" value="Ayol" ${u.jins === "Ayol" ? "checked" : ""} />
                      <span>👩 <span data-i18n="gender_female">${global.TilVaTarjimalar.matn("gender_female", joriyTil)}</span></span>
                    </label>
                  </div>
                </div>

                <!-- MAQOM: O'QUVCHI YOKI USTOZ -->
                <div class="form-group">
                  <label class="form-label" for="set-rol">Platformadagi maqomingiz (O'quvchi yoki Ustoz)</label>
                  <select id="set-rol" class="form-select">
                    <option value="O'quvchi" ${u.rol === "O'quvchi" ? "selected" : ""}>🎓 O'quvchi / Abituriyent</option>
                    <option value="Ustoz" ${u.rol === "Ustoz" ? "selected" : ""}>👨‍🏫 Ustoz (O'qituvchi / Repetitor)</option>
                  </select>
                </div>
              </div>

              <!-- "BIO" YOZISH -->
              <div class="form-group" style="margin-bottom:1.65rem;">
                <label class="form-label" for="set-bio">📝 "BIO" (O'zingiz, maktabingiz/OTM va matematik maqsadlaringiz haqida):</label>
                <textarea id="set-bio" rows="3" class="form-textarea" placeholder="O'zingiz haqingizda BIO yozing...">${u.bio || ""}</textarea>
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; padding-top:1.25rem; border-top:1px solid var(--border-color);">
                <div style="font-size:0.88rem; color:var(--text-muted);">
                  💡 Barcha o'zgarishlar brauzer xotirasida (localStorage) avtomatik saqlanadi.
                </div>
                <button type="submit" class="btn btn-primary" style="font-size:1.05rem; padding:0.95rem 2.25rem;">
                  💾 <span data-i18n="save_btn">${global.TilVaTarjimalar.matn("save_btn", joriyTil)}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      `;

      // Tungi va kunduzgi rejim hodisalari
      const lightBtn = document.getElementById("set-light-mode-btn");
      const darkBtn = document.getElementById("set-dark-mode-btn");
      if (lightBtn) {
        lightBtn.addEventListener("click", () => {
          global.UmumiyHolatVaBazalar.tungiRejimniAlmashtirish(false);
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
          this.sozlamalarSahifasiniChizish();
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish("☀️ Kunduzgi rejim yoqildi!");
        });
      }
      if (darkBtn) {
        darkBtn.addEventListener("click", () => {
          global.UmumiyHolatVaBazalar.tungiRejimniAlmashtirish(true);
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
          this.sozlamalarSahifasiniChizish();
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish("🌙 Tungi rejim yoqildi!");
        });
      }

      // Tilni o'zgartirish
      konteyner.querySelectorAll("[data-lang-pick]").forEach(btn => {
        btn.addEventListener("click", () => {
          const yangiTil = btn.getAttribute("data-lang-pick");
          global.TilVaTarjimalar.tilniOzgartirish(yangiTil);
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
          this.sozlamalarSahifasiniChizish();
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`🌐 Sayt tili o'zgartirildi: ${yangiTil.toUpperCase()}`);
        });
      });

      // Avatar tanlash
      konteyner.querySelectorAll("[data-avatar-pick]").forEach(btn => {
        btn.addEventListener("click", () => {
          const belgi = btn.getAttribute("data-avatar-pick");
          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ avatar: belgi, avatarRasmUrl: "" });
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
          this.sozlamalarSahifasiniChizish();
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`🎯 Profil belgisi (${belgi}) o'rnatildi!`);
        });
      });

      // Rasm fayl yuklash (hajm tekshiruvi va avtomatik siqish bilan)
      const rasmInput = document.getElementById("profil-rasm-fayl");
      if (rasmInput) {
        rasmInput.addEventListener("change", (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          if (file.size > 10 * 1024 * 1024) {
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish("⚠️ Rasm hajmi juda katta (>10MB). Iltimos, kichikroq rasm tanlang!");
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            this.profilRasminiSiqibSaqlash(dataUrl);
          };
          reader.readAsDataURL(file);
        });
      }

      const rasmOchirishBtn = document.getElementById("rasmni-ochirish-btn");
      if (rasmOchirishBtn) {
        rasmOchirishBtn.addEventListener("click", () => {
          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ avatarRasmUrl: "" });
          this.sozlamalarSahifasiniChizish();
        });
      }

      // Profil formasini saqlash
      const forma = document.getElementById("sozlamalar-profil-formasi");
      if (forma) {
        forma.addEventListener("submit", (e) => {
          e.preventDefault();
          const ism = (document.getElementById("set-ism")?.value || "").trim();
          const familiya = (document.getElementById("set-familiya")?.value || "").trim();
          const rol = document.getElementById("set-rol")?.value || "O'quvchi";
          const bio = (document.getElementById("set-bio")?.value || "").trim();
          const jinsEl = document.querySelector('input[name="set_jins_radio"]:checked');
          const jins = jinsEl ? jinsEl.value : "Erkak";

          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ ism, familiya, rol, jins, bio });
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
          this.sozlamalarSahifasiniChizish();
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish("✅ Profil ma'lumotlaringiz (Ism, BIO, Jins) saqlandi!");
        });
      }
    },

    // Rasmni brauzer xotirasi (localStorage) kvotasidan oshib ketmasligi uchun tekshirish va siqish
    profilRasminiSiqibSaqlash: function (dataUrl) {
      const MAX_CHARS = 1500000; // ~1.5 MB xavfsiz chegara
      const saqlashniBajarish = (yakuniyUrl) => {
        if (!yakuniyUrl || yakuniyUrl.length > MAX_CHARS) {
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish("⚠️ Rasm hajmi juda katta (>5MB). Xotira to'lib qolmasligi uchun rasm qabul qilinmadi!");
          return { muvaffaqiyat: false, sabab: "hajm_katta" };
        }
        const oldingi = global.UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.avatarRasmUrl || "";
        global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ avatarRasmUrl: yakuniyUrl });
        const tek = global.UmumiyHolatVaBazalar.holatniYuklash();
        if (tek.joriyFoydalanuvchi.avatarRasmUrl !== yakuniyUrl) {
          global.UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ avatarRasmUrl: oldingi });
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish("⚠️ Brauzer xotirasi (localStorage) to'ldi! Kichikroq rasm tanlang.");
          return { muvaffaqiyat: false, sabab: "kvota_toldi" };
        }
        this.sozlamalarSahifasiniChizish();
        global.UmumiyHolatVaBazalar.xabarnomaKorsatish("📸 Profil rasmingiz muvaffaqiyatli yuklandi!");
        return { muvaffaqiyat: true };
      };

      if (typeof Image !== "undefined" && typeof document !== "undefined" && dataUrl && dataUrl.length > 150000) {
        try {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              const maxDim = 256;
              let w = img.width || maxDim;
              let h = img.height || maxDim;
              if (w > h && w > maxDim) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else if (h >= w && h > maxDim) {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, w, h);
                const compressed = canvas.toDataURL("image/jpeg", 0.82);
                saqlashniBajarish(compressed);
                return;
              }
            } catch (e) {}
            saqlashniBajarish(dataUrl);
          };
          img.onerror = () => saqlashniBajarish(dataUrl);
          img.src = dataUrl;
          return { muvaffaqiyat: dataUrl.length <= MAX_CHARS };
        } catch (e) {}
      }
      return saqlashniBajarish(dataUrl);
    },

    // PROFIL VA OLMOSLAR SAHIFASINI CHIZISH
    profilSahifasiniChizish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("profil-asosiy-konteyner");
      if (!konteyner) return;

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const vaqtMatn = global.OlmoslarVaVaqtTizimi.vaqtniFormatlash(baza.bugungiIshlanganSekundlar || 0);
      const tarix = u.olmoslarTarixi || [];
      const sertifikatlar = u.sertifikatlar || [];

      konteyner.innerHTML = `
        <!-- PROFIL KARTASI -->
        <div class="card" style="margin-bottom:2rem; border-left:6px solid var(--accent-primary);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.75rem;">
            <div style="display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap;">
              <div style="width:96px; height:96px; border-radius:50%; background:var(--accent-gradient); color:#fff; display:flex; align-items:center; justify-content:center; font-size:2.9rem; overflow:hidden; box-shadow:var(--shadow-md);">
                ${u.avatarRasmUrl ? `<img src="${u.avatarRasmUrl}" alt="Profil" style="width:100%;height:100%;object-fit:cover;"/>` : (u.avatar || "👨‍🎓")}
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap; margin-bottom:0.35rem;">
                  <h1 style="font-size:1.7rem; font-weight:900;">${u.ism} ${u.familiya}</h1>
                  <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">${u.rol}</span>
                  <span class="badge-pill" style="background:rgba(5,150,105,0.14); color:var(--success);">${u.jins}</span>
                  ${u.faolUnvon ? `<span class="badge-pill" style="background:rgba(245,158,11,0.18); color:#d97706;">${u.faolUnvon}</span>` : ""}
                </div>
                <p style="color:var(--text-secondary); margin:0.45rem 0; max-width:680px; font-size:0.95rem;">
                  <strong>BIO:</strong> "${u.bio || "Matematika va Algebra o'rganuvchisi"}"
                </p>
                <div style="font-size:0.85rem; color:var(--text-muted);">
                  Kirish usuli: <strong>${u.kirishUsuli || "Telefon raqam"}</strong> • Maqsad daraja: <strong>${u.maqsadDaraja || "A+"}</strong>
                </div>
              </div>
            </div>

            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
              <a href="${global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Sozlamalar_sahifasi.html")}" class="btn btn-primary">
                ⚙️ Sozlamalar va Profilni tahrirlash
              </a>
              <a href="${global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Olmoslar_dukoni_sahifasi.html")}" class="btn btn-outline">
                🛒 Olmoslar Do'koni
              </a>
            </div>
          </div>
        </div>

        <!-- 4 TA ASOSIY KO'RSATKICHLAR (OLMOS, VAQT, DARSLAR, SERTIFIKAT) -->
        <div class="grid-4" style="margin-bottom:2rem;">
          <div class="card" style="border-top:4px solid #0284c7;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">💎 Jami to'plangan Olmoslar</div>
            <div style="font-size:2.15rem; font-weight:900; color:#0284c7; margin:0.4rem 0;" data-live-diamonds>${u.olmoslar || 0}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Har kuni kirganda +5 💎 va test/darslar uchun</div>
          </div>
          <div class="card" style="border-top:4px solid var(--success);">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">⏱️ Bugun misol ishlagan vaqt</div>
            <div style="font-size:1.4rem; font-weight:900; color:var(--success); margin:0.6rem 0;" data-live-study-time>${vaqtMatn}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Real vaqtda avtomatik hisoblanadi</div>
          </div>
          <div class="card" style="border-top:4px solid var(--accent-primary);">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">📚 O'zlashtirilgan darslar</div>
            <div style="font-size:2.15rem; font-weight:900; color:var(--accent-primary); margin:0.4rem 0;">${(u.ozlashtirilganDarslar || []).length} ta</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">0 dan o'rganish bo'limida</div>
          </div>
          <div class="card" style="border-top:4px solid #d97706;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">🏆 Olingan Sertifikatlar</div>
            <div style="font-size:2.15rem; font-weight:900; color:#d97706; margin:0.4rem 0;">${sertifikatlar.length} ta</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Milliy Sertifikat (45 talik imtihon)</div>
          </div>
        </div>

        <div class="grid-2" style="align-items:start;">
          <!-- OLMOSLAR TARIXI -->
          <div class="card">
            <div class="section-header">
              <h2 class="section-title" style="font-size:1.25rem;">💎 Olmoslar To'planish Tarixi</h2>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.8rem;">
              ${tarix.map(item => `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:0.95rem 1.15rem; border-radius:var(--radius-sm); background:var(--bg-primary); border:1px solid var(--border-color);">
                  <div>
                    <div style="font-weight:700; font-size:0.94rem;">${item.sabab}</div>
                    <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">${item.sana}</div>
                  </div>
                  <span class="stat-pill diamond-pill">${item.miqdor >= 0 ? "+" + item.miqdor : item.miqdor} 💎</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- OLINGAN MILLIY SERTIFIKATLAR VA REYTING -->
          <div class="card">
            <div class="section-header">
              <h2 class="section-title" style="font-size:1.25rem;">📜 Mening Milliy Sertifikatlarim</h2>
            </div>
            ${sertifikatlar.length === 0 ? `
              <div style="padding:1.75rem; text-align:center; background:var(--bg-primary); border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1.5rem;">
                <p style="color:var(--text-secondary); margin-bottom:1rem;">Siz hali 45 talik Milliy Sertifikat imtihonini topshirmagansiz.</p>
                <a href="${global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Sertifikat_olish_sahifasi.html")}" class="btn btn-amber">
                  🏆 Hozir 45 talik Sertifikat testini boshlash
                </a>
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:0.85rem; margin-bottom:1.5rem;">
                ${sertifikatlar.map(s => `
                  <div style="padding:1.1rem; border-radius:var(--radius-md); background:var(--bg-primary); border-left:4px solid #f59e0b; display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <div style="font-weight:800;">${s.ismFamiliya} • ID: ${s.sertifikatId}</div>
                      <div style="font-size:0.84rem; color:var(--text-muted);">Natija: ${s.togriSoni}/45 (${s.foiz}%) • Sana: ${s.sana}</div>
                    </div>
                    <span class="grade-badge ${global.UmumiyHolatVaBazalar.darajaKlassiniOlish(s.daraja)}">${s.daraja}</span>
                  </div>
                `).join("")}
              </div>
            `}

            <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.85rem;">🏅 Eng ko'p Olmos to'plagan foydalanuvchilar</h3>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${(baza.foydalanuvchilarRoyxati || [])
                .filter(f => f && f.rol !== "Admin")
                .slice()
                .sort((a, b) => (b.olmoslar || 0) - (a.olmoslar || 0))
                .map((f, i) => `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border-radius:var(--radius-sm); background:var(--bg-tertiary);">
                    <div>
                      <strong>#${i + 1} ${f.avatar || "👨‍🎓"} ${f.ism} ${f.familiya}</strong>
                      <span style="font-size:0.8rem; color:var(--text-muted);">(${f.rol})</span>
                    </div>
                    <span style="font-weight:800; color:#0284c7;">${f.olmoslar || 0} 💎</span>
                  </div>
                `).join("")}
            </div>
          </div>
        </div>
      `;
    }
  };

  global.SozlamalarVaProfil = SozlamalarVaProfil;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = SozlamalarVaProfil;
  }
})(typeof window !== "undefined" ? window : globalThis);
