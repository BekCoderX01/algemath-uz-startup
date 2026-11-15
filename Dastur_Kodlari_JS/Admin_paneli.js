/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Admin_paneli.js
   VAZIFASI: Saytning Admin Paneli (Boshqaruv markazi):
             1) Foydalanuvchilar ro'yxati, kirish usullari (Telefon, Google,
                Email, Instagram) va ularga qo'shimcha Olmos (💎) taqdim etish;
             2) Bazaga yangi matematik/algebraik test savollarini qo'shish;
             3) Berilgan Milliy Sertifikatlar (A+, A, B+, B, C+, C) reestrini
                nazorat qilish.
   ========================================================================== */

(function (global) {
  const AdminPaneli = {
    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("admin-asosiy-konteyner");
      if (!konteyner) return;

      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const foydalanuvchilar = baza.foydalanuvchilarRoyxati || [];
      const sertifikatlar = baza.berilganSertifikatlarArxivi || [];
      const qoshimchaSavollar = baza.qoshimchaAdminSavollar || [];
      const jamiOlmoslar = foydalanuvchilar.reduce((s, u) => s + (u.olmoslar || 0), 0);

      konteyner.innerHTML = `
        <div class="section-header">
          <div>
            <h1 style="font-size:1.6rem; font-weight:900;">🛡️ Admin Panel — Platformani Boshqarish Markazi</h1>
            <p style="color:var(--text-secondary); font-size:0.93rem;">
              O'quvchilar va ustozlar faoliyati, 4 xil login usuli statistikasi, yangi test qo'shish va Milliy Sertifikatlar nazorati.
            </p>
          </div>
          <span class="badge-pill" style="background:rgba(67,24,255,0.14); color:var(--accent-primary); font-size:0.88rem;">
            Faol Admin: ${baza.joriyFoydalanuvchi.ism} ${baza.joriyFoydalanuvchi.familiya}
          </span>
        </div>

        <!-- 4 TA STATISTIKA KARTASI -->
        <div class="grid-4" style="margin-bottom:1.5rem;">
          <div class="card">
            <div style="font-size:0.84rem; color:var(--text-muted); font-weight:700;">👥 Foydalanuvchilar</div>
            <div style="font-size:2rem; font-weight:900; color:var(--accent-primary);">${foydalanuvchilar.length} nafar</div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">Telefon, Google, Email, Instagram</div>
          </div>
          <div class="card">
            <div style="font-size:0.84rem; color:var(--text-muted); font-weight:700;">🧮 Bazadagi Jami Savollar</div>
            <div style="font-size:2rem; font-weight:900; color:var(--success);">${105 + qoshimchaSavollar.length} ta</div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">45 Sertifikat + 60 O'quv + ${qoshimchaSavollar.length} Admin</div>
          </div>
          <div class="card">
            <div style="font-size:0.84rem; color:var(--text-muted); font-weight:700;">🏆 Berilgan Sertifikatlar</div>
            <div style="font-size:2rem; font-weight:900; color:#d97706;">${sertifikatlar.length} ta</div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">Milliy Sertifikat (A+ dan C gacha)</div>
          </div>
          <div class="card">
            <div style="font-size:0.84rem; color:var(--text-muted); font-weight:700;">💎 Jami Olmoslar Fondi</div>
            <div style="font-size:2rem; font-weight:900; color:#0284c7;">${jamiOlmoslar} 💎</div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">Adolatli taqsimlangan</div>
          </div>
        </div>

        <div class="grid-2" style="align-items:start; margin-bottom:1.5rem;">
          <!-- CHAP TOMON: YANGI MATEMATIK TEST QO'SHISH -->
          <div class="card">
            <h2 style="font-size:1.25rem; font-weight:900; margin-bottom:0.85rem;">➕ Bazaga Yangi Matematik Test Qo'shish</h2>
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

              <div class="grid-2" style="gap:0.75rem;">
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

              <button type="submit" class="btn btn-primary" style="width:100%;">
                ✅ Savolni testlar bazasiga qo'shish
              </button>
            </form>

            ${qoshimchaSavollar.length > 0 ? `
              <div style="margin-top:1.1rem; padding-top:1rem; border-top:1px solid var(--border-color);">
                <div style="font-weight:800; font-size:0.9rem; margin-bottom:0.5rem;">Admin tomonidan qo'shilgan savollar (${qoshimchaSavollar.length} ta):</div>
                ${qoshimchaSavollar.map(q => `
                  <div style="font-size:0.84rem; padding:0.5rem 0.75rem; background:var(--bg-primary); border-radius:8px; margin-bottom:0.4rem;">
                    <strong>[${q.daraja}]</strong> ${q.savol} → <em>To'g'ri: ${q.variantlar[q.togriIndex || 0]}</em>
                  </div>
                `).join("")}
              </div>
            ` : ""}
          </div>

          <!-- O'NG TOMON: FOYDALANUVCHILAR VA OLMOS BOSHQARUVI -->
          <div class="card">
            <h2 style="font-size:1.25rem; font-weight:900; margin-bottom:0.85rem;">👥 Foydalanuvchilar va Olmoslar Nazorati</h2>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${foydalanuvchilar.map(u => `
                <div style="padding:0.9rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
                  <div>
                    <div style="font-weight:800; font-size:0.98rem;">
                      ${u.avatar || "👨‍🎓"} ${u.ism} ${u.familiya}
                      <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">${u.rol}</span>
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-muted);">
                      Kirish: ${u.kirishUsuli || "Telefon"} • Jins: ${u.jins || "Erkak"} • Daraja: ${u.tanlanganDaraja || "B"}
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap:0.6rem;">
                    <span class="stat-pill diamond-pill">${u.olmoslar || 0} 💎</span>
                    <button type="button" class="btn btn-emerald" data-gift-user="${u.id}" style="padding:0.42rem 0.75rem; font-size:0.8rem;">
                      +10 💎 rag'bat
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- BERILGAN MILLIY SERTIFIKATLAR REESTRI -->
        <div class="card">
          <h2 style="font-size:1.25rem; font-weight:900; margin-bottom:0.85rem;">📜 Berilgan Milliy Sertifikatlar Reestri</h2>
          <div class="grid-3">
            ${sertifikatlar.map(s => `
              <div class="card" style="background:var(--bg-primary);">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
                  <span style="font-weight:800; font-size:0.82rem; color:var(--text-muted);">${s.sertifikatId}</span>
                  <span class="grade-badge ${global.UmumiyHolatVaBazalar.darajaKlassiniOlish(s.daraja)}">${s.daraja}</span>
                </div>
                <div style="font-weight:900; font-size:1.05rem;">${s.ismFamiliya} (${s.rol})</div>
                <div style="font-size:0.84rem; color:var(--text-secondary); margin-top:0.25rem;">
                  Natija: <strong>${s.togriSoni}/45 (${s.foiz}%)</strong> • Sana: ${s.sana}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      // Yangi savol qo'shish
      const forma = document.getElementById("admin-savol-formasi");
      if (forma) {
        forma.addEventListener("submit", (e) => {
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

          const holat = global.UmumiyHolatVaBazalar.holatniYuklash();
          if (!Array.isArray(holat.qoshimchaAdminSavollar)) holat.qoshimchaAdminSavollar = [];
          holat.qoshimchaAdminSavollar.unshift(yangiSavol);
          global.UmumiyHolatVaBazalar.holatniSaqlash(holat);
          this.interfeysniChizish(konteyner);
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`✅ Yangi savol (${daraja} daraja) bazaga qo'shildi!`);
        });
      }

      // Foydalanuvchiga +10 olmos berish
      konteyner.querySelectorAll("[data-gift-user]").forEach(btn => {
        btn.addEventListener("click", () => {
          const userId = btn.getAttribute("data-gift-user");
          const holat = global.UmumiyHolatVaBazalar.holatniYuklash();
          const f = holat.foydalanuvchilarRoyxati.find(u => u.id === userId);
          if (f) {
            f.olmoslar = (f.olmoslar || 0) + 10;
            if (holat.joriyFoydalanuvchi.id === userId) {
              holat.joriyFoydalanuvchi.olmoslar = f.olmoslar;
            }
            global.UmumiyHolatVaBazalar.holatniSaqlash(holat);
            global.OlmoslarVaVaqtTizimi.ekrandagiOlmosVaVaqtniYangilash();
            this.interfeysniChizish(konteyner);
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`💎 ${f.ism} ${f.familiya} hisobiga +10 ta Olmos qo'shildi!`);
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
