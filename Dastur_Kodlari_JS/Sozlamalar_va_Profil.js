/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Sozlamalar_va_Profil.js
   VAZIFASI:
     1) Sozlamalar bo'limi:
        - Kunduzgi rejim (☀️) va Tungi rejim (🌙) tanlash
        - O'zbek (🇺🇿 O'zbekiston bayrog'i), Rus (🇷🇺 Rossiya bayrog'i) va
          Ingliz (🇺🇸 Amerika bayrog'i) tillarini tanlash
        - Profilni boshqarish: Rasm qo'yish (fayl yuklash yoki avatar tanlash),
          "BIO" yozish, Erkak yoki Ayol ekanligini tanlash
     2) Shaxsiy Profil, Olmoslar (💎) va Kunlik Ishlangan Vaqt sahifasi.
   ========================================================================== */

(function (global) {
  const SozlamalarVaProfil = {
    // SOZLAMALAR SAHIFASINI ISHGA TUSHIRISH
    sozlamalarSahifasiniChizish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("sozlamalar-asosiy-konteyner");
      if (!konteyner) return;

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const joriyTil = global.TilVaTarjimalar.joriyTilniOlish();
      const avatarlar = global.RasmlarVaBelgilar ? global.RasmlarVaBelgilar.standartAvatarlar : [];

      konteyner.innerHTML = `
        <div class="section-header">
          <h1 class="section-title" data-i18n="settings_title">
            ${global.TilVaTarjimalar.matn("settings_title", joriyTil)}
          </h1>
        </div>

        <div class="grid-2" style="align-items:start;">
          <!-- 1-USTUN: TUNGI/KUNDUZGI REJIM VA DAVLAT BAYROQLI TILLAR -->
          <div style="display:flex; flex-direction:column; gap:1.5rem;">
            <!-- TUNGI YOKI KUNDUZGI REJIM -->
            <div class="card">
              <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:0.85rem;" data-i18n="settings_theme_label">
                ${global.TilVaTarjimalar.matn("settings_theme_label", joriyTil)}
              </h2>
              <div class="grid-2" style="gap:0.85rem;">
                <button type="button"
                        class="language-flag-option ${!baza.tungiRejim ? "active" : ""}"
                        id="set-light-mode-btn">
                  <span style="font-size:1.6rem;">☀️</span>
                  <div>
                    <div data-i18n="theme_light">${global.TilVaTarjimalar.matn("theme_light", joriyTil)}</div>
                    <div style="font-size:0.78rem; color:var(--text-muted); font-weight:500;">Yorug' va tiniq kunduzgi dizayn</div>
                  </div>
                </button>
                <button type="button"
                        class="language-flag-option ${baza.tungiRejim ? "active" : ""}"
                        id="set-dark-mode-btn">
                  <span style="font-size:1.6rem;">🌙</span>
                  <div>
                    <div data-i18n="theme_dark">${global.TilVaTarjimalar.matn("theme_dark", joriyTil)}</div>
                    <div style="font-size:0.78rem; color:var(--text-muted); font-weight:500;">Ko'zni charchatmaydigan tungi rejim</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- TIL TANLASH (YONIDA DAVLAT BAYROG'I BILAN: O'ZBEKISTON, ROSSIYA, AMERIKA) -->
            <div class="card">
              <h2 style="font-size:1.2rem; font-weight:800; margin-bottom:0.5rem;" data-i18n="settings_lang_label">
                ${global.TilVaTarjimalar.matn("settings_lang_label", joriyTil)}
              </h2>
              <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:1rem;">
                Har bir til yonida mos davlat bayrog'i (O'zbek tili — O'zbekiston bayrog'i, Rus tili — Rossiya bayrog'i, Ingliz tili — Amerika bayrog'i) joylashtirilgan:
              </p>
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${global.TilVaTarjimalar.tillarRoyxati.map(t => `
                  <button type="button"
                          class="language-flag-option ${joriyTil === t.kod ? "active" : ""}"
                          data-lang-pick="${t.kod}">
                    ${global.TilVaTarjimalar.bayroqHtmlOlish(t.kod)}
                    <div style="text-align:left; flex:1;">
                      <div style="font-size:1rem; font-weight:800;">${t.emojiBayroq} ${t.nomi}</div>
                      <div style="font-size:0.78rem; color:var(--text-muted); font-weight:600;">${t.davlat}</div>
                    </div>
                    ${joriyTil === t.kod ? `<span class="badge-pill" style="background:var(--accent-primary); color:#fff;">Faol til</span>` : ""}
                  </button>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- 2-USTUN: PROFILNI BOSHQARISH (RASM QO'YISH, BIO YOZISH, ERKAK/AYOL TANLASH) -->
          <div class="card">
            <h2 style="font-size:1.25rem; font-weight:800; margin-bottom:1rem;" data-i18n="settings_profile_label">
              ${global.TilVaTarjimalar.matn("settings_profile_label", joriyTil)}
            </h2>

            <!-- PROFIL RASMI PREVYU VA YUKLASH -->
            <div style="display:flex; align-items:center; gap:1.1rem; padding:1rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color); margin-bottom:1.15rem;">
              <div id="settings-avatar-preview" style="width:74px; height:74px; border-radius:50%; background:var(--accent-gradient); color:#fff; display:flex; align-items:center; justify-content:center; font-size:2.3rem; overflow:hidden; flex-shrink:0;">
                ${u.avatarRasmUrl ? `<img src="${u.avatarRasmUrl}" alt="Profil rasmi" style="width:100%;height:100%;object-fit:cover;"/>` : (u.avatar || "👨‍🎓")}
              </div>
              <div style="flex:1;">
                <label class="form-label" for="profil-rasm-fayl" style="margin-bottom:0.35rem;">📸 Kompyuter yoki telefondan rasm qo'yish:</label>
                <input type="file" id="profil-rasm-fayl" accept="image/*" class="form-input" style="padding:0.45rem;" />
                ${u.avatarRasmUrl ? `<button type="button" id="rasmni-ochirish-btn" class="btn btn-outline" style="margin-top:0.4rem; padding:0.3rem 0.7rem; font-size:0.78rem;">Rasmni olib tashlash</button>` : ""}
              </div>
            </div>

            <!-- TAYYOR AVATAR TANLASH -->
            <div class="form-group">
              <label class="form-label">Yoki tayyor matematik belgilardan birini tanlang:</label>
              <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
                ${avatarlar.map(av => `
                  <button type="button"
                          class="btn ${u.avatar === av.svg && !u.avatarRasmUrl ? "btn-primary" : "btn-outline"}"
                          data-avatar-pick="${av.svg}"
                          style="padding:0.5rem 0.85rem; font-size:1.3rem;"
                          title="${av.label}">
                    ${av.svg}
                  </button>
                `).join("")}
              </div>
            </div>

            <form id="sozlamalar-profil-formasi">
              <div class="grid-2" style="gap:0.85rem;">
                <div class="form-group">
                  <label class="form-label" for="set-ism">Ismingiz *</label>
                  <input type="text" id="set-ism" class="form-input" value="${u.ism || ""}" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="set-familiya">Familiyangiz *</label>
                  <input type="text" id="set-familiya" class="form-input" value="${u.familiya || ""}" required />
                </div>
              </div>

              <!-- ERKAK YOKI AYOL EKANLIGINI TANLASH -->
              <div class="form-group">
                <label class="form-label">Jinsingizni tanlang (Erkak yoki Ayol) *</label>
                <div class="grid-2" style="gap:0.85rem;">
                  <label class="language-flag-option ${u.jins === "Erkak" ? "active" : ""}" style="cursor:pointer;">
                    <input type="radio" name="set_jins_radio" value="Erkak" ${u.jins === "Erkak" ? "checked" : ""} />
                    <span>👨 <span data-i18n="gender_male">${global.TilVaTarjimalar.matn("gender_male", joriyTil)}</span></span>
                  </label>
                  <label class="language-flag-option ${u.jins === "Ayol" ? "active" : ""}" style="cursor:pointer;">
                    <input type="radio" name="set_jins_radio" value="Ayol" ${u.jins === "Ayol" ? "checked" : ""} />
                    <span>👩 <span data-i18n="gender_female">${global.TilVaTarjimalar.matn("gender_female", joriyTil)}</span></span>
                  </label>
                </div>
              </div>

              <!-- MAQOM: O'QUVCHI YOKI USTOZ -->
              <div class="form-group">
                <label class="form-label" for="set-rol">Maqomingiz (O'quvchi yoki Ustoz)</label>
                <select id="set-rol" class="form-select">
                  <option value="O'quvchi" ${u.rol === "O'quvchi" ? "selected" : ""}>🎓 O'quvchi</option>
                  <option value="Ustoz" ${u.rol === "Ustoz" ? "selected" : ""}>👨‍🏫 Ustoz (O'qituvchi)</option>
                  <option value="Admin" ${u.rol === "Admin" ? "selected" : ""}>🛡️ Administrator</option>
                </select>
              </div>

              <!-- "BIO" YOZISH -->
              <div class="form-group">
                <label class="form-label" for="set-bio">📝 "BIO" (O'zingiz va matematik maqsadlaringiz haqida):</label>
                <textarea id="set-bio" rows="3" class="form-textarea" placeholder="O'zingiz haqingizda BIO yozing...">${u.bio || ""}</textarea>
              </div>

              <button type="submit" class="btn btn-primary" style="width:100%; font-size:1.02rem;">
                💾 <span data-i18n="save_btn">${global.TilVaTarjimalar.matn("save_btn", joriyTil)}</span>
              </button>
            </form>
          </div>
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
          this.sozlamalarSahifasiniChizish();
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
        <div class="card" style="margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.5rem;">
            <div style="display:flex; align-items:center; gap:1.25rem; flex-wrap:wrap;">
              <div style="width:92px; height:92px; border-radius:50%; background:var(--accent-gradient); color:#fff; display:flex; align-items:center; justify-content:center; font-size:2.8rem; overflow:hidden; box-shadow:var(--shadow-md);">
                ${u.avatarRasmUrl ? `<img src="${u.avatarRasmUrl}" alt="Profil" style="width:100%;height:100%;object-fit:cover;"/>` : (u.avatar || "👨‍🎓")}
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
                  <h1 style="font-size:1.65rem; font-weight:900;">${u.ism} ${u.familiya}</h1>
                  <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">${u.rol}</span>
                  <span class="badge-pill" style="background:rgba(5,205,153,0.16); color:var(--success);">${u.jins}</span>
                </div>
                <p style="color:var(--text-secondary); margin:0.45rem 0; max-width:640px;">
                  <strong>BIO:</strong> "${u.bio || "Matematika va Algebra o'rganuvchisi"}"
                </p>
                <div style="font-size:0.84rem; color:var(--text-muted);">
                  Kirish usuli: <strong>${u.kirishUsuli || "Telefon raqam"}</strong> • Maqsad daraja: <strong>${u.maqsadDaraja || "A+"}</strong>
                </div>
              </div>
            </div>

            <a href="${global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Sozlamalar_sahifasi.html")}" class="btn btn-outline">
              ⚙️ Profilni tahrirlash (Rasm, BIO, Jins)
            </a>
          </div>
        </div>

        <!-- 4 TA ASOSIY KO'RSATKICHLAR (OLMOS, VAQT, DARSLAR, SERTIFIKAT) -->
        <div class="grid-4" style="margin-bottom:1.5rem;">
          <div class="card" style="background:linear-gradient(135deg, rgba(0,198,255,0.14), rgba(0,114,255,0.18));">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">💎 Jami to'plangan Olmoslar</div>
            <div style="font-size:2.1rem; font-weight:900; color:#0284c7; margin:0.3rem 0;" data-live-diamonds>${u.olmoslar || 0}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Har kuni kirganda +5 💎 va test/darslar uchun</div>
          </div>
          <div class="card" style="background:linear-gradient(135deg, rgba(5,205,153,0.12), rgba(0,168,120,0.18));">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">⏱️ Bugun misol ishlagan vaqt</div>
            <div style="font-size:1.35rem; font-weight:900; color:var(--success); margin:0.55rem 0;" data-live-study-time>${vaqtMatn}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Real vaqtda avtomatik hisoblanadi</div>
          </div>
          <div class="card">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">📚 O'zlashtirilgan darslar</div>
            <div style="font-size:2.1rem; font-weight:900; color:var(--accent-primary); margin:0.3rem 0;">${(u.ozlashtirilganDarslar || []).length} ta</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">0 dan o'rganish bo'limida</div>
          </div>
          <div class="card">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">🏆 Olingan Sertifikatlar</div>
            <div style="font-size:2.1rem; font-weight:900; color:#d97706; margin:0.3rem 0;">${sertifikatlar.length} ta</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Milliy Sertifikat (45 talik imtihon)</div>
          </div>
        </div>

        <div class="grid-2" style="align-items:start;">
          <!-- OLMOSLAR TARIXI -->
          <div class="card">
            <h2 style="font-size:1.25rem; font-weight:900; margin-bottom:1rem;">💎 Olmoslar To'planish Tarixi</h2>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${tarix.map(item => `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:0.8rem 1rem; border-radius:var(--radius-sm); background:var(--bg-primary); border:1px solid var(--border-color);">
                  <div>
                    <div style="font-weight:700; font-size:0.92rem;">${item.sabab}</div>
                    <div style="font-size:0.76rem; color:var(--text-muted);">${item.sana}</div>
                  </div>
                  <span class="stat-pill diamond-pill">+${item.miqdor} 💎</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- OLINGAN MILLIY SERTIFIKATLAR VA REYTING -->
          <div class="card">
            <h2 style="font-size:1.25rem; font-weight:900; margin-bottom:1rem;">📜 Mening Milliy Sertifikatlarim</h2>
            ${sertifikatlar.length === 0 ? `
              <div style="padding:1.5rem; text-align:center; background:var(--bg-primary); border-radius:var(--radius-md); margin-bottom:1.25rem;">
                <p style="color:var(--text-secondary); margin-bottom:0.85rem;">Siz hali 45 talik Milliy Sertifikat imtihonini topshirmagansiz.</p>
                <a href="${global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Sertifikat_olish_sahifasi.html")}" class="btn btn-amber">
                  🏆 Hozir 45 talik Sertifikat testini boshlash
                </a>
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.25rem;">
                ${sertifikatlar.map(s => `
                  <div style="padding:1rem; border-radius:var(--radius-md); background:var(--bg-primary); border-left:4px solid #f59e0b; display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <div style="font-weight:800;">${s.ismFamiliya} • ID: ${s.sertifikatId}</div>
                      <div style="font-size:0.82rem; color:var(--text-muted);">Natija: ${s.togriSoni}/45 (${s.foiz}%) • Sana: ${s.sana}</div>
                    </div>
                    <span class="grade-badge ${global.UmumiyHolatVaBazalar.darajaKlassiniOlish(s.daraja)}">${s.daraja}</span>
                  </div>
                `).join("")}
              </div>
            `}

            <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.75rem;">🏅 Eng ko'p Olmos to'plagan foydalanuvchilar</h3>
            <div style="display:flex; flex-direction:column; gap:0.55rem;">
              ${(baza.foydalanuvchilarRoyxati || [])
                .slice()
                .sort((a, b) => (b.olmoslar || 0) - (a.olmoslar || 0))
                .map((f, i) => `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:0.65rem 0.9rem; border-radius:var(--radius-sm); background:var(--bg-tertiary);">
                    <div>
                      <strong>#${i + 1} ${f.avatar || "👨‍🎓"} ${f.ism} ${f.familiya}</strong>
                      <span style="font-size:0.78rem; color:var(--text-muted);">(${f.rol})</span>
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
