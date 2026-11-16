/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Admin_paneli.js
   VAZIFASI: Saytning Admin Paneli (Boshqaruv markazi):
             - Faqat serverda tasdiqlangan (ADMIN_SECRET orqali) maxsus
               Admin sessiyasi mavjud bo'lgandagina ochiladi;
             - Oddiy foydalanuvchilarga maxfiy admin ma'lumotlari (foydalanuvchilar
               ro'yxati, telefon/email, to'lov so'rovlari, karta rekvizitlari,
               test savollari javoblari va sertifikat reestri) ko'rsatilmaydi!
   ========================================================================== */

(function (global) {
  function htmlTozalash(qiymat) {
    return String(qiymat == null ? "" : qiymat)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function httpServerMavjudmi() {
    return (
      typeof fetch !== "undefined" &&
      typeof window !== "undefined" &&
      window.location &&
      typeof window.location.protocol === "string" &&
      window.location.protocol.startsWith("http")
    );
  }

  const AdminPaneli = {
    _serverAdminHolat: null,
    _kirishXatosi: "",

    adminRuxsatiBormi: function () {
      return Boolean(
        global.UmumiyHolatVaBazalar &&
        typeof global.UmumiyHolatVaBazalar.adminSessiyasiBormi === "function" &&
        global.UmumiyHolatVaBazalar.adminSessiyasiBormi()
      );
    },

    adminSarlavhalari: function (qoshimcha) {
      const headers = { ...(qoshimcha || {}) };
      const token = global.UmumiyHolatVaBazalar &&
        typeof global.UmumiyHolatVaBazalar.adminTokeniniOlish === "function"
        ? global.UmumiyHolatVaBazalar.adminTokeniniOlish()
        : "";
      if (token) {
        headers["x-admin-token"] = token;
      }
      return headers;
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("admin-asosiy-konteyner");
      if (!konteyner) return;

      if (!this.adminRuxsatiBormi()) {
        this._serverAdminHolat = null;
        this.kirishBlokiniChizish(konteyner);
        return;
      }

      if (httpServerMavjudmi()) {
        this.serverAdminHolatiniYuklash(konteyner);
        return;
      }

      this.interfeysniChizish(konteyner);
    },

    serverAdminHolatiniYuklash: async function (konteyner) {
      try {
        const resp = await fetch("/api/admin/holat", {
          headers: this.adminSarlavhalari()
        });
        if (!resp.ok) {
          this._serverAdminHolat = null;
          if (global.UmumiyHolatVaBazalar && typeof global.UmumiyHolatVaBazalar.adminSessiyasiniTozalash === "function") {
            global.UmumiyHolatVaBazalar.adminSessiyasiniTozalash();
          }
          if (global.MundarijaVaNavigatsiya) {
            global.MundarijaVaNavigatsiya.navigatsiyaniChizish("admin");
          }
          this._kirishXatosi = "Admin sessiyasi muddati tugagan yoki ruxsat tasdiqlanmadi.";
          this.kirishBlokiniChizish(konteyner);
          return false;
        }
        this._serverAdminHolat = await resp.json();
        this.interfeysniChizish(konteyner);
        return true;
      } catch (e) {
        this.interfeysniChizish(konteyner);
        return false;
      }
    },

    kirishBlokiniChizish: function (konteyner) {
      const boshSahifaYol = global.MundarijaVaNavigatsiya
        ? global.MundarijaVaNavigatsiya.sahifaManziliniOlish("Asosiy_sahifa.html")
        : "../index.html";
      const serverFaol = httpServerMavjudmi();

      konteyner.innerHTML = `
        <div class="kun-settings-layout" id="admin-kirish-oynasi">
          <div class="kun-settings-section-card" style="max-width:620px; margin:1.5rem auto; border-top:5px solid var(--accent-primary);">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">🔒 CHEKLANGAN BO'LIM</span>
                <h1 class="section-title">Kirish Cheklangan — Faqat Administratorlar Uchun</h1>
                <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.45rem;">
                  Ushbu bo'limdagi maxfiy ma'lumotlar oddiy foydalanuvchilardan himoyalangan. Davom etish uchun serverning maxfiy administrator kalitini kiriting.
                </p>
              </div>
            </div>

            ${this._kirishXatosi ? `
              <div style="padding:0.85rem 1rem; border-radius:8px; background:rgba(220,38,38,0.1); color:var(--danger); font-weight:700; margin-bottom:1.1rem;">
                ⚠️ ${htmlTozalash(this._kirishXatosi)}
              </div>
            ` : ""}

            ${serverFaol ? `
              <form id="admin-kirish-formasi" style="display:flex; flex-direction:column; gap:1rem;">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" for="admin-maxfiy-kalit-input">🔑 Maxfiy Admin Kaliti (ADMIN_SECRET) *</label>
                  <input type="password"
                         id="admin-maxfiy-kalit-input"
                         class="form-input"
                         autocomplete="current-password"
                         placeholder="Serverda sozlangan maxfiy kalitni kiriting..."
                         required />
                </div>
                <div style="display:flex; gap:0.85rem; flex-wrap:wrap;">
                  <button type="submit" id="admin-kirish-tugmasi" class="btn btn-primary" style="flex:1;">
                    🛡️ Tasdiqlash va Kirish
                  </button>
                  <a href="${boshSahifaYol}" class="btn btn-outline">
                    🏠 Asosiy sahifaga qaytish
                  </a>
                </div>
              </form>
            ` : `
              <div style="padding:1rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color); margin-bottom:1.1rem; font-size:0.9rem; color:var(--text-secondary);">
                🔒 Xavfsizlik talabi: Admin panel faqat Backend server (<code>Server_Asosiy.js</code> yoki <code>Server_Asosiy.py</code>) va <code>ADMIN_SECRET</code> orqali ishlaydi. Maxfiy kalit brauzer kodida saqlanmaydi.
              </div>
              <a href="${boshSahifaYol}" class="btn btn-primary" style="width:100%;">
                🏠 Asosiy sahifaga qaytish
              </a>
            `}
          </div>
        </div>
      `;

      const kirishForma = document.getElementById("admin-kirish-formasi");
      if (kirishForma) {
        kirishForma.addEventListener("submit", async (e) => {
          e.preventDefault();
          const kalitInput = document.getElementById("admin-maxfiy-kalit-input");
          const adminKalit = (kalitInput ? kalitInput.value : "").trim();
          if (!adminKalit) return;

          try {
            const resp = await fetch("/api/admin/kirish", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ adminKalit })
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data.muvaffaqiyat || !data.adminToken) {
              this._kirishXatosi = data.xabar || "Maxfiy admin kaliti noto'g'ri!";
              this.kirishBlokiniChizish(konteyner);
              return;
            }
            this._kirishXatosi = "";
            global.UmumiyHolatVaBazalar.adminSessiyasiniSaqlash(data.adminToken, data.admin);
            if (global.MundarijaVaNavigatsiya) {
              global.MundarijaVaNavigatsiya.navigatsiyaniChizish("admin");
            }
            await this.serverAdminHolatiniYuklash(konteyner);
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish("🛡️ Admin sessiyasi muvaffaqiyatli tasdiqlandi!");
          } catch (err) {
            this._kirishXatosi = "Server bilan bog'lanishda xatolik yuz berdi.";
            this.kirishBlokiniChizish(konteyner);
          }
        });
      }
    },

    interfeysniChizish: function (konteyner) {
      if (!this.adminRuxsatiBormi()) {
        this.kirishBlokiniChizish(konteyner);
        return;
      }

      const lokalBaza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const baza = this._serverAdminHolat
        ? { ...lokalBaza, ...this._serverAdminHolat }
        : lokalBaza;
      const foydalanuvchilar = baza.foydalanuvchilarRoyxati || [];
      const sertifikatlar = baza.berilganSertifikatlarArxivi || [];
      const qoshimchaSavollar = baza.qoshimchaAdminSavollar || [];
      const tolovSorovlari = baza.tolovSorovlari || [];
      const kutilayotganTolovlar = tolovSorovlari.filter(s => s.holat === "kutilmoqda");
      const rekvizit = baza.tolovRekvizitlari || {};
      const jamiOlmoslar = foydalanuvchilar.reduce((s, u) => s + (u.olmoslar || 0), 0);
      const sessiya = global.UmumiyHolatVaBazalar.adminSessiyasiniOlish();
      const adminNomi = (sessiya && sessiya.admin && `${sessiya.admin.ism || ""} ${sessiya.admin.familiya || ""}`.trim()) || "Bosh Administrator";

      konteyner.innerHTML = `
        <div class="kun-settings-layout">
          <div class="card" style="border-left:6px solid var(--accent-primary);">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.5rem;">
              <div>
                <span class="kun-settings-step-badge">🛡️ TIZIM VA BAZA BOSHQARUVI MARKAZI</span>
                <h1 class="section-title">Admin Panel — Platformani Boshqarish Markazi</h1>
                <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.35rem;">
                  O'quvchilar va ustozlar faoliyati, 4 xil login usuli statistikasi, yangi test qo'shish va Milliy Sertifikatlar nazorati.
                </p>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
                <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary); font-size:0.9rem; padding:0.5rem 1rem;">
                  🛡️ Faol Admin: ${htmlTozalash(adminNomi)}
                </span>
                <button type="button" id="admin-chiqish-btn" class="btn btn-outline" style="padding:0.45rem 0.9rem; font-size:0.85rem; color:var(--danger); border-color:var(--danger);">
                  🚪 Chiqish
                </button>
              </div>
            </div>
          </div>

          <!-- 4 TA STATISTIKA KARTASI -->
          <div class="grid-4">
            <div class="card" style="border-top:4px solid var(--accent-primary);">
              <div style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">👥 Foydalanuvchilar</div>
              <div style="font-size:2.1rem; font-weight:900; color:var(--accent-primary); margin:0.35rem 0;">${foydalanuvchilar.length} nafar</div>
              <div style="font-size:0.8rem; color:var(--text-secondary);">Telefon, Google, Email, Instagram</div>
            </div>
            <div class="card" style="border-top:4px solid var(--success);">
              <div style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">🧮 Bazadagi Jami Savollar</div>
              <div style="font-size:2.1rem; font-weight:900; color:var(--success); margin:0.35rem 0;">${105 + qoshimchaSavollar.length} ta</div>
              <div style="font-size:0.8rem; color:var(--text-secondary);">45 Sertifikat + 60 O'quv + ${qoshimchaSavollar.length} Admin</div>
            </div>
            <div class="card" style="border-top:4px solid #d97706;">
              <div style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">🏆 Berilgan Sertifikatlar</div>
              <div style="font-size:2.1rem; font-weight:900; color:#d97706; margin:0.35rem 0;">${sertifikatlar.length} ta</div>
              <div style="font-size:0.8rem; color:var(--text-secondary);">Milliy Sertifikat (A+ dan C gacha)</div>
            </div>
            <div class="card" style="border-top:4px solid #0284c7;">
              <div style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">💎 Jami Olmoslar Fondi</div>
              <div style="font-size:2.1rem; font-weight:900; color:#0284c7; margin:0.35rem 0;">${jamiOlmoslar} 💎</div>
              <div style="font-size:0.8rem; color:var(--text-secondary);">Adolatli taqsimlangan</div>
            </div>
          </div>

          <div class="grid-2" style="align-items:start;">
            <!-- CHAP TOMON: YANGI MATEMATIK TEST QO'SHISH -->
            <div class="kun-settings-section-card">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">1-BO'LIM • SAVOLLAR BAZASINI BOYITISH</span>
                  <h2 class="section-title">➕ Bazaga Yangi Matematik Test Qo'shish</h2>
                </div>
              </div>
              <form id="admin-savol-formasi">
                <div class="form-group">
                  <label class="form-label" for="adm-q-daraja">Qaysi daraja uchun?</label>
                  <select id="adm-q-daraja" class="form-select">
                    <option value="C">C — Boshlang'ich daraja</option>
                    <option value="C+">C+ — Tayanch algebra</option>
                    <option value="B" selected>B — O'rta daraja</option>
                    <option value="B+">B+ — O'rta-yuqori daraja</option>
                    <option value="A">A — Yuqori daraja</option>
                    <option value="A+">A+ — Ekspert / Olimpiada</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="adm-q-matn">Misol yoki savol matni *</label>
                  <input type="text" id="adm-q-matn" class="form-input" placeholder="Masalan: Agar 3x - 5 = 16 bo'lsa, x² ni toping." required />
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label" for="adm-opt-0">A) Variant *</label>
                    <input type="text" id="adm-opt-0" class="form-input" placeholder="49" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="adm-opt-1">B) Variant *</label>
                    <input type="text" id="adm-opt-1" class="form-input" placeholder="21" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="adm-opt-2">C) Variant *</label>
                    <input type="text" id="adm-opt-2" class="form-input" placeholder="36" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="adm-opt-3">D) Variant *</label>
                    <input type="text" id="adm-opt-3" class="form-input" placeholder="64" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="adm-togri-index">To'g'ri javob variantini tanlang</label>
                  <select id="adm-togri-index" class="form-select">
                    <option value="0" selected>A) Variant to'g'ri</option>
                    <option value="1">B) Variant to'g'ri</option>
                    <option value="2">C) Variant to'g'ri</option>
                    <option value="3">D) Variant to'g'ri</option>
                  </select>
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%; padding:0.95rem;">
                  ✅ Savolni testlar bazasiga qo'shish
                </button>
              </form>

              ${qoshimchaSavollar.length > 0 ? `
                <div style="margin-top:1.4rem; padding-top:1.15rem; border-top:1px solid var(--border-color);">
                  <div style="font-weight:800; font-size:0.95rem; margin-bottom:0.75rem;">Admin tomonidan qo'shilgan savollar (${qoshimchaSavollar.length} ta):</div>
                  <div style="display:flex; flex-direction:column; gap:0.65rem;">
                    ${qoshimchaSavollar.map(q => `
                      <div style="font-size:0.88rem; padding:0.75rem 1rem; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:8px;">
                        <strong>[${htmlTozalash(q.daraja)}]</strong> ${htmlTozalash(q.savol)} → <em>To'g'ri: ${htmlTozalash((q.variantlar || [])[q.togriIndex || 0] || "")}</em>
                      </div>
                    `).join("")}
                  </div>
                </div>
              ` : ""}
            </div>

            <!-- O'NG TOMON: FOYDALANUVCHILAR VA OLMOS BOSHQARUVI -->
            <div class="kun-settings-section-card">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">2-BO'LIM • FOYDALANUVCHILAR VA OLMOSLAR</span>
                  <h2 class="section-title">👥 Foydalanuvchilar va Olmoslar Nazorati</h2>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.9rem;">
                ${foydalanuvchilar.map(u => `
                  <div style="padding:1.05rem 1.2rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.85rem;">
                    <div>
                      <div style="font-weight:800; font-size:1rem;">
                        ${htmlTozalash(u.avatar || "👨‍🎓")} ${htmlTozalash(u.ism)} ${htmlTozalash(u.familiya)}
                        <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">${htmlTozalash(u.rol)}</span>
                      </div>
                      <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.2rem;">
                        Kirish: ${htmlTozalash(u.kirishUsuli || "Telefon")} • Jins: ${htmlTozalash(u.jins || "Erkak")} • Daraja: ${htmlTozalash(u.tanlanganDaraja || "B")}
                      </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                      <span class="stat-pill diamond-pill">${Number(u.olmoslar) || 0} 💎</span>
                      <button type="button" class="btn btn-emerald" data-gift-user="${htmlTozalash(u.id)}" style="padding:0.5rem 0.9rem; font-size:0.84rem;">
                        +10 💎 rag'bat
                      </button>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- BERILGAN MILLIY SERTIFIKATLAR REESTRI -->
          <div class="kun-settings-section-card">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">3-BO'LIM • SERTIFIKATLAR ARXIVI</span>
                <h2 class="section-title">📜 Berilgan Milliy Sertifikatlar Reestri</h2>
              </div>
            </div>
            <div class="grid-3">
              ${sertifikatlar.map(s => `
                <div class="card" style="background:var(--bg-primary);">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
                    <span style="font-weight:800; font-size:0.84rem; color:var(--text-muted);">${htmlTozalash(s.sertifikatId)}</span>
                    <span class="grade-badge ${global.UmumiyHolatVaBazalar.darajaKlassiniOlish(s.daraja)}">${htmlTozalash(s.daraja)}</span>
                  </div>
                  <div style="font-weight:900; font-size:1.08rem;">${htmlTozalash(s.ismFamiliya)} (${htmlTozalash(s.rol)})</div>
                  <div style="font-size:0.88rem; color:var(--text-secondary); margin-top:0.35rem;">
                    Natija: <strong>${Number(s.togriSoni) || 0}/45 (${Number(s.foiz) || 0}%)</strong> • Sana: ${htmlTozalash(s.sana)}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- 4-BO'LIM: PRO OBUNA TO'LOVLARINI TASDIQLASH VA REKVIZITLAR -->
          <div class="kun-settings-section-card">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">4-BO'LIM • PRO TO'LOVLAR NAZORATI</span>
                <h2 class="section-title">💳 PRO Obuna To'lovlarini Tasdiqlash (${kutilayotganTolovlar.length} ta kutilmoqda)</h2>
              </div>
            </div>

            <form id="admin-rekvizit-formasi" style="margin-bottom:1.35rem; padding:1.1rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color);">
              <div style="font-weight:800; margin-bottom:0.65rem;">🏦 To'lov qabul qiluvchi karta sozlamalari (Istalgan ilova va karta orqali):</div>
              <div class="grid-3">
                <div class="form-group">
                  <label class="form-label" for="adm-pay-type">Karta turi</label>
                  <input type="text" id="adm-pay-type" class="form-input" value="${htmlTozalash(rekvizit.kartaTuri || "HUMO")}" placeholder="HUMO yoki UZCARD" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="adm-pay-card">Karta raqami</label>
                  <input type="text" id="adm-pay-card" class="form-input" value="${htmlTozalash(rekvizit.kartaRaqami || "9860 1201 7157 4847")}" placeholder="9860 1201 7157 4847" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="adm-pay-owner">Karta egasi (F.I.Sh)</label>
                  <input type="text" id="adm-pay-owner" class="form-input" value="${htmlTozalash(rekvizit.qabulQiluvchi || "OTABEK TOYCHIYEV")}" />
                </div>
              </div>
              <button type="submit" class="btn btn-primary" style="margin-top:0.5rem;">💾 To'lov rekvizitini saqlash</button>
            </form>

            ${tolovSorovlari.length === 0 ? `
              <div style="padding:1rem; border-radius:8px; background:var(--bg-primary); border:1px dashed var(--border-color); color:var(--text-muted);">
                Hozircha kelib tushgan PRO to'lov so'rovlari yo'q. Foydalanuvchilar PRO sahifada to'lov chekini yuborganda shu yerda ko'rinadi.
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:0.85rem;">
                ${tolovSorovlari.map(s => `
                  <div style="padding:1rem 1.15rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.85rem;">
                    <div>
                      <div style="font-weight:900;">${htmlTozalash(s.invoysId)} • ${htmlTozalash(s.foydalanuvchiIsmi)} → ${htmlTozalash(s.tarifNomi)}</div>
                      <div style="font-size:0.84rem; color:var(--text-secondary); margin-top:0.2rem;">
                        Ilova: <strong>${htmlTozalash(s.tolovUsuli)}</strong> • Summa: <strong>${htmlTozalash(s.summa)}</strong> • Karta/Tel: <strong>${htmlTozalash(s.kartaYokiTel)}</strong> • Sana: <strong>${htmlTozalash(s.yaratilganSana)}</strong>
                      </div>
                    </div>
                    <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center;">
                      ${s.holat === "kutilmoqda" ? `
                        <button type="button" class="btn btn-emerald" data-approve-payment="${htmlTozalash(s.invoysId)}" style="padding:0.5rem 0.9rem; font-size:0.84rem;">
                          ✅ To'lov tushdi — PRO yoqish
                        </button>
                        <button type="button" class="btn btn-outline" data-reject-payment="${htmlTozalash(s.invoysId)}" style="padding:0.5rem 0.9rem; font-size:0.84rem; color:var(--danger); border-color:var(--danger);">
                          ❌ Rad etish
                        </button>
                      ` : `
                        <span class="badge-pill" style="background:var(--bg-tertiary); color:${s.holat === "tasdiqlandi" ? "var(--success)" : "var(--danger)"};">
                          ${s.holat === "tasdiqlandi" ? "✅ Tasdiqlangan" : "❌ Rad etilgan"}
                        </span>
                      `}
                    </div>
                  </div>
                `).join("")}
              </div>
            `}
          </div>
        </div>
      `;

      // Admin sessiyasidan chiqish
      const chiqishBtn = document.getElementById("admin-chiqish-btn");
      if (chiqishBtn) {
        chiqishBtn.addEventListener("click", async () => {
          if (httpServerMavjudmi()) {
            await fetch("/api/admin/chiqish", {
              method: "POST",
              headers: this.adminSarlavhalari()
            }).catch(() => {});
          }
          this._serverAdminHolat = null;
          this._kirishXatosi = "";
          global.UmumiyHolatVaBazalar.adminSessiyasiniTozalash();
          if (global.MundarijaVaNavigatsiya) {
            global.MundarijaVaNavigatsiya.navigatsiyaniChizish("admin");
          }
          this.kirishBlokiniChizish(konteyner);
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish("🔒 Admin sessiyasidan chiqildi.");
        });
      }

      // Yangi savol qo'shish
      const forma = document.getElementById("admin-savol-formasi");
      if (forma) {
        forma.addEventListener("submit", async (e) => {
          e.preventDefault();
          const daraja = document.getElementById("adm-q-daraja").value;
          const savol = document.getElementById("adm-q-matn").value.trim();
          const v0 = document.getElementById("adm-opt-0").value.trim();
          const v1 = document.getElementById("adm-opt-1").value.trim();
          const v2 = document.getElementById("adm-opt-2").value.trim();
          const v3 = document.getElementById("adm-opt-3").value.trim();
          const togriIdxEl = document.getElementById("adm-togri-index");
          const togriIndex = togriIdxEl ? Math.max(0, Math.min(3, Number(togriIdxEl.value) || 0)) : 0;

          if (!savol || !v0) return;

          const yangiSavol = {
            id: "admin_q_" + Date.now(),
            daraja,
            manba: `Admin savoli (${daraja})`,
            savol,
            variantlar: [v0, v1, v2, v3],
            togriIndex
          };

          if (httpServerMavjudmi()) {
            const resp = await fetch("/api/admin/savol-qoshish", {
              method: "POST",
              headers: this.adminSarlavhalari({ "Content-Type": "application/json" }),
              body: JSON.stringify(yangiSavol)
            }).catch(() => null);
            if (!resp || !resp.ok) {
              global.UmumiyHolatVaBazalar.xabarnomaKorsatish("⚠️ Serverga savol qo'shishda ruxsat rad etildi.");
              return;
            }
          }

          const holat = global.UmumiyHolatVaBazalar.holatniYuklash();
          if (!Array.isArray(holat.qoshimchaAdminSavollar)) holat.qoshimchaAdminSavollar = [];
          holat.qoshimchaAdminSavollar.unshift(yangiSavol);
          global.UmumiyHolatVaBazalar.holatniSaqlash(holat);
          if (httpServerMavjudmi()) {
            await this.serverAdminHolatiniYuklash(konteyner);
          } else {
            this.interfeysniChizish(konteyner);
          }
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`✅ Yangi savol (${daraja} daraja) bazaga qo'shildi!`);
        });
      }

      // Foydalanuvchiga +10 olmos berish
      konteyner.querySelectorAll("[data-gift-user]").forEach(btn => {
        btn.addEventListener("click", async () => {
          const userId = btn.getAttribute("data-gift-user");
          if (httpServerMavjudmi()) {
            const resp = await fetch("/api/admin/olmos-berish", {
              method: "POST",
              headers: this.adminSarlavhalari({ "Content-Type": "application/json" }),
              body: JSON.stringify({ foydalanuvchiId: userId, miqdor: 10 })
            }).catch(() => null);
            if (!resp || !resp.ok) {
              global.UmumiyHolatVaBazalar.xabarnomaKorsatish("⚠️ Olmos qo'shishda server ruxsati rad etildi.");
              return;
            }
          }
          const holat = global.UmumiyHolatVaBazalar.holatniYuklash();
          const f = holat.foydalanuvchilarRoyxati.find(u => u.id === userId);
          if (f) {
            f.olmoslar = (f.olmoslar || 0) + 10;
            if (holat.joriyFoydalanuvchi.id === userId) {
              holat.joriyFoydalanuvchi.olmoslar = f.olmoslar;
            }
            global.UmumiyHolatVaBazalar.holatniSaqlash(holat);
            global.OlmoslarVaVaqtTizimi.ekrandagiOlmosVaVaqtniYangilash();
          }
          if (httpServerMavjudmi()) {
            await this.serverAdminHolatiniYuklash(konteyner);
          } else {
            this.interfeysniChizish(konteyner);
          }
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`💎 Hisobga +10 ta Olmos qo'shildi!`);
        });
      });

      // To'lov qabul qiluvchi karta / hisob rekvizitini saqlash
      const rekvizitForm = document.getElementById("admin-rekvizit-formasi");
      if (rekvizitForm) {
        rekvizitForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const yangiRekvizit = {
            kartaTuri: ((document.getElementById("adm-pay-type") || {}).value || "HUMO").trim(),
            kartaRaqami: ((document.getElementById("adm-pay-card") || {}).value || "9860 1201 7157 4847").trim(),
            qabulQiluvchi: ((document.getElementById("adm-pay-owner") || {}).value || "OTABEK TOYCHIYEV").trim()
          };
          if (httpServerMavjudmi()) {
            const resp = await fetch("/api/admin/rekvizit", {
              method: "POST",
              headers: this.adminSarlavhalari({ "Content-Type": "application/json" }),
              body: JSON.stringify(yangiRekvizit)
            }).catch(() => null);
            if (!resp || !resp.ok) {
              global.UmumiyHolatVaBazalar.xabarnomaKorsatish("⚠️ Rekvizitni saqlashda server ruxsati rad etildi.");
              return;
            }
          }
          const holat = global.UmumiyHolatVaBazalar.holatniYuklash();
          holat.tolovRekvizitlari = {
            ...(holat.tolovRekvizitlari || {}),
            ...yangiRekvizit
          };
          global.UmumiyHolatVaBazalar.holatniSaqlash(holat);
          if (httpServerMavjudmi()) {
            await this.serverAdminHolatiniYuklash(konteyner);
          } else {
            this.interfeysniChizish(konteyner);
          }
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish("✅ To'lov qabul qiluvchi rekvizit saqlandi!");
        });
      }

      // PRO to'lov so'rovini tasdiqlash (PRO obunani yoqish)
      konteyner.querySelectorAll("[data-approve-payment]").forEach(btn => {
        btn.addEventListener("click", async () => {
          const invoysId = btn.getAttribute("data-approve-payment");
          if (httpServerMavjudmi()) {
            const resp = await fetch("/api/tolov/tasdiqlash", {
              method: "POST",
              headers: this.adminSarlavhalari({ "Content-Type": "application/json" }),
              body: JSON.stringify({ invoysId })
            }).catch(() => null);
            const data = resp ? await resp.json().catch(() => ({})) : {};
            if (!resp || !resp.ok || !data.muvaffaqiyat) {
              global.UmumiyHolatVaBazalar.xabarnomaKorsatish(data.xabar || "⚠️ To'lovni tasdiqlashda xatolik.");
              return;
            }
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish(data.xabar || "✅ To'lov tasdiqlandi!");
            await this.serverAdminHolatiniYuklash(konteyner);
            return;
          }
          if (global.ObunaVaTolovMantiqi) {
            const res = global.ObunaVaTolovMantiqi.tolovniTasdiqlash(invoysId);
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
            if (global.MundarijaVaNavigatsiya) {
              global.MundarijaVaNavigatsiya.navigatsiyaniChizish("admin");
            }
            this.interfeysniChizish(konteyner);
          }
        });
      });

      // PRO to'lov so'rovini rad etish
      konteyner.querySelectorAll("[data-reject-payment]").forEach(btn => {
        btn.addEventListener("click", async () => {
          const invoysId = btn.getAttribute("data-reject-payment");
          if (httpServerMavjudmi()) {
            const resp = await fetch("/api/tolov/rad-etish", {
              method: "POST",
              headers: this.adminSarlavhalari({ "Content-Type": "application/json" }),
              body: JSON.stringify({ invoysId })
            }).catch(() => null);
            const data = resp ? await resp.json().catch(() => ({})) : {};
            if (!resp || !resp.ok || !data.muvaffaqiyat) {
              global.UmumiyHolatVaBazalar.xabarnomaKorsatish(data.xabar || "⚠️ Rad etishda xatolik.");
              return;
            }
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish("❌ To'lov so'rovi rad etildi.");
            await this.serverAdminHolatiniYuklash(konteyner);
            return;
          }
          if (global.ObunaVaTolovMantiqi) {
            const res = global.ObunaVaTolovMantiqi.tolovniRadEtish(invoysId);
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
            this.interfeysniChizish(konteyner);
          }
        });
      });
    }
  };

  global.AdminPaneli = AdminPaneli;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = AdminPaneli;
  }
})(typeof window !== "undefined" ? window : globalThis);
