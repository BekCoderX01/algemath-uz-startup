/* ==========================================================================
   PAPKA VA FAYL: 8_Obuna_va_Tolov_Bulimi/Obuna_va_Tolov_mantiqi.js
   VAZIFASI: 8-Modul — "Startup Monetizatsiyasi (PRO Obuna va To'lov Tizimi)".
             - Bepul, O'quvchi PRO va Ustoz Ekspert PRO tariflari;
             - XAVFSIZLIK QOIDASI: Bepul tarifdan PRO tarifga o'tish FAQAT
               haqiqiy to'lov tasdiqlangandan keyin (yoki yetarli 💎 Olmos
               balansi yechilgandan so'ng) faollashadi! To'lov qilinmasidan
               PRO ochilmaydi.
   ========================================================================== */

(function (global) {
  const OBUNA_TARIFLARI = [
    {
      id: "plan_free",
      nomi: "Bepul",
      sarlavha: "🌱 Boshlang'ich (Bepul)",
      narxSom: "0 so'm / oy",
      narxOlmos: 0,
      bonusOlmos: 0,
      imkoniyatlar: [
        "✅ Har kungi kirish uchun +5 💎 Olmos bonusi",
        "✅ 0 dan C, C+, B darajagacha barcha darslar va 10 talik testlar",
        "✅ O'quvchi va Ustoz darajali testlari",
        "✅ 45 talik Milliy Sertifikat imtihonini topshirish"
      ]
    },
    {
      id: "plan_student_pro",
      nomi: "O'quvchi PRO",
      sarlavha: "🚀 O'quvchi PRO (Eng Ommabop)",
      narxSom: "39,000 so'm / oy",
      narxOlmos: 120,
      bonusOlmos: 50,
      imkoniyatlar: [
        "✅ Barcha C dan A+ Olimpiada darajagacha to'liq darslar",
        "✅ Har bir 10 talik testda kengaytirilgan Yordam/Memory formulalari",
        "✅ Cheksiz 1v1 Matematik Duel va Grafik Kalkulyator",
        "✅ To'lov tasdiqlanganda darhol +50 💎 PRO Bonus Olmos!"
      ]
    },
    {
      id: "plan_teacher_pro",
      nomi: "Ustoz Ekspert PRO",
      sarlavha: "👑 Ustoz va Repetitor Ekspert PRO",
      narxSom: "69,000 so'm / oy",
      narxOlmos: 200,
      bonusOlmos: 100,
      imkoniyatlar: [
        "✅ Cheksiz 6 xonali Ustoz Sinfxonalari (MATH-XX) ochish",
        "✅ O'quvchilarga avtomatik tekshiriluvchi Uyga Vazifalar berish",
        "✅ A+ Milliy Sertifikat metodik bazasi va PDF eksport",
        "✅ To'lov tasdiqlanganda darhol +100 💎 Ekspert Bonus Olmos!"
      ]
    }
  ];

  function foydalanuvchiniRoyxatdaYangilash(baza, userObj) {
    if (!Array.isArray(baza.foydalanuvchilarRoyxati)) {
      baza.foydalanuvchilarRoyxati = [];
    }
    const idx = baza.foydalanuvchilarRoyxati.findIndex(u => u.id === userObj.id);
    if (idx >= 0) {
      baza.foydalanuvchilarRoyxati[idx] = {
        ...baza.foydalanuvchilarRoyxati[idx],
        ...userObj
      };
    }
    if (baza.joriyFoydalanuvchi && baza.joriyFoydalanuvchi.id === userObj.id) {
      baza.joriyFoydalanuvchi = {
        ...baza.joriyFoydalanuvchi,
        ...userObj
      };
    }
  }

  const ObunaVaTolovMantiqi = {
    tariflar: OBUNA_TARIFLARI,
    tanlanganTolovUsuli: "Click", // "Click" | "Payme" | "Uzum" | "Olmos"
    kassaTarifId: null,
    oxirgiChek: null,

    kassaniOchish: function (tarifId) {
      const tarif = OBUNA_TARIFLARI.find(t => t.id === tarifId);
      if (!tarif) return { muvaffaqiyat: false, xabar: "Tarif topilmadi" };

      if (tarif.id === "plan_free") {
        return this.tarifniFaollashtirish("plan_free", "Bepul");
      }

      this.kassaTarifId = tarifId;
      return {
        muvaffaqiyat: true,
        kassaOchildi: true,
        tarifId,
        xabar: `💳 "${tarif.nomi}" uchun to'lov oynasi ochildi. Avval to'lovni tasdiqlang.`
      };
    },

    kassaniYopish: function () {
      this.kassaTarifId = null;
    },

    // Pullik tariflar (Click / Payme / Uzum) uchun to'lov chekini tekshirishga yuborish.
    // DIQQAT: Bu funksiya obunani DARHOL PRO ga o'tkazmaydi — obuna faqat to'lov tasdiqlangach ochiladi!
    tolovSoroviniYuborish: function (tarifId, tolovUsuli, kartaYokiTel, tranzaksiyaId) {
      const tarif = OBUNA_TARIFLARI.find(t => t.id === tarifId);
      if (!tarif || tarif.narxOlmos <= 0) {
        return { muvaffaqiyat: false, xabar: "⚠️ Pullik PRO tarif tanlanmadi." };
      }

      const usul = tolovUsuli || this.tanlanganTolovUsuli;
      if (usul === "Olmos") {
        return this.tarifniFaollashtirish(tarifId, "Olmos");
      }

      const manba = String(kartaYokiTel || "").trim();
      const raqamlarSoni = (manba.match(/\d/g) || []).length;
      if (raqamlarSoni < 4) {
        return {
          muvaffaqiyat: false,
          xabar: "⚠️ To'lov qilgan telefon raqamingiz (+998...) yoki karta oxirgi 4 ta raqamini kiriting!"
        };
      }

      const txId = String(tranzaksiyaId || "").trim();
      if (txId.length < 6 || !/^[A-Za-z0-9\-_]+$/.test(txId)) {
        return {
          muvaffaqiyat: false,
          xabar: "⚠️ Click / Payme / Uzum chekidagi haqiqiy Tranzaksiya ID raqamini kiriting (kamida 6 ta belgi)!"
        };
      }

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      if (!Array.isArray(baza.tolovSorovlari)) baza.tolovSorovlari = [];
      if (!Array.isArray(baza.ishlatilganTranzaksiyalar)) baza.ishlatilganTranzaksiyalar = [];

      const takror = baza.ishlatilganTranzaksiyalar.includes(txId.toUpperCase()) ||
        baza.tolovSorovlari.some(s => String(s.tranzaksiyaId).toUpperCase() === txId.toUpperCase() && s.holat !== "rad_etildi");
      if (takror) {
        return {
          muvaffaqiyat: false,
          xabar: "⚠️ Bu tranzaksiya ID raqami allaqachon ishlatilgan yoki tekshirilmoqda!"
        };
      }

      const u = baza.joriyFoydalanuvchi;
      const sorov = {
        invoysId: "INV-UZ-" + Math.floor(100000 + Math.random() * 900000),
        foydalanuvchiId: u.id,
        foydalanuvchiIsmi: `${u.ism} ${u.familiya}`,
        tarifId: tarif.id,
        tarifNomi: tarif.nomi,
        tarifSarlavha: tarif.sarlavha,
        tolovUsuli: usul,
        summa: tarif.narxSom,
        kartaYokiTel: manba,
        tranzaksiyaId: txId.toUpperCase(),
        holat: "kutilmoqda",
        yaratilganSana: new Date().toISOString().replace("T", " ").slice(0, 16)
      };

      baza.tolovSorovlari.unshift(sorov);
      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      this.kassaTarifId = null;

      return {
        muvaffaqiyat: true,
        kutilmoqda: true,
        sorov,
        xabar: `⏳ To'lov so'rovi (${sorov.invoysId}) yuborildi! To'lov tushgani tasdiqlangach "${tarif.nomi}" avtomatik ochiladi.`
      };
    },

    // Admin panelda to'lov tushganini tasdiqlash -> PRO tarifni faollashtirish
    tolovniTasdiqlash: function (invoysId) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      if (!Array.isArray(baza.tolovSorovlari)) baza.tolovSorovlari = [];
      const sorov = baza.tolovSorovlari.find(s => s.invoysId === invoysId);
      if (!sorov) {
        return { muvaffaqiyat: false, xabar: "To'lov so'rovi topilmadi." };
      }
      if (sorov.holat === "tasdiqlandi") {
        return { muvaffaqiyat: false, xabar: "Bu to'lov allaqachon tasdiqlangan." };
      }

      const res = this.tarifniFaollashtirish(sorov.tarifId, sorov.tolovUsuli, {
        tolandi: true,
        tranzaksiyaId: sorov.tranzaksiyaId,
        foydalanuvchiId: sorov.foydalanuvchiId
      });

      if (res.muvaffaqiyat) {
        const yangiBaza = global.UmumiyHolatVaBazalar.holatniYuklash();
        const sRef = (yangiBaza.tolovSorovlari || []).find(s => s.invoysId === invoysId);
        if (sRef) {
          sRef.holat = "tasdiqlandi";
          sRef.tasdiqlanganSana = new Date().toISOString().replace("T", " ").slice(0, 16);
          sRef.chek = res.chek;
        }
        global.UmumiyHolatVaBazalar.holatniSaqlash(yangiBaza);
      }
      return res;
    },

    // Admin panelda soxta yoki tushmagan to'lovni rad etish
    tolovniRadEtish: function (invoysId, sabab) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      if (!Array.isArray(baza.tolovSorovlari)) baza.tolovSorovlari = [];
      const sorov = baza.tolovSorovlari.find(s => s.invoysId === invoysId);
      if (!sorov) {
        return { muvaffaqiyat: false, xabar: "To'lov so'rovi topilmadi." };
      }
      sorov.holat = "rad_etildi";
      sorov.radSababi = sabab || "To'lov hisobga tushmagani aniqlandi";
      sorov.tasdiqlanganSana = new Date().toISOString().replace("T", " ").slice(0, 16);
      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      return {
        muvaffaqiyat: true,
        xabar: `❌ ${sorov.invoysId} raqamli to'lov rad etildi — foydalanuvchi Bepul tarifda qoldi.`
      };
    },

    tarifniFaollashtirish: function (tarifId, tolovUsuli, tolovTasdigi) {
      const tarif = OBUNA_TARIFLARI.find(t => t.id === tarifId);
      if (!tarif) return { muvaffaqiyat: false, xabar: "Tarif topilmadi" };

      const usul = tolovUsuli || this.tanlanganTolovUsuli;
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      if (!Array.isArray(baza.ishlatilganTranzaksiyalar)) {
        baza.ishlatilganTranzaksiyalar = [];
      }

      const nishonId = (tolovTasdigi && tolovTasdigi.foydalanuvchiId) || baza.joriyFoydalanuvchi.id;
      const royxatdagiUser = (baza.foydalanuvchilarRoyxati || []).find(item => item.id === nishonId);
      const u = royxatdagiUser ? { ...royxatdagiUser } : { ...baza.joriyFoydalanuvchi };
      if (baza.joriyFoydalanuvchi && baza.joriyFoydalanuvchi.id === u.id) {
        Object.assign(u, baza.joriyFoydalanuvchi);
      }

      // 1. Bepul tarifga qaytish (hech qanday bonus olmos bermaydi)
      if (tarif.id === "plan_free") {
        u.obunaTarifi = "Bepul";
        u.obunaTugashSana = "";
        foydalanuvchiniRoyxatdaYangilash(baza, u);
        global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
        this.kassaTarifId = null;
        return {
          muvaffaqiyat: true,
          xabar: "🌱 Siz Bepul boshlang'ich tarifiga o'tdingiz."
        };
      }

      // 2. Olmoslar evaziga to'lov (yetarli balans bo'lishi shart)
      if (usul === "Olmos") {
        if ((u.olmoslar || 0) < tarif.narxOlmos) {
          return {
            muvaffaqiyat: false,
            tolovKerak: true,
            xabar: `⚠️ Olmoslar evaziga aktivlashtirish uchun ${tarif.narxOlmos} 💎 kerak! (Sizda: ${u.olmoslar || 0} 💎)`
          };
        }
        u.olmoslar -= tarif.narxOlmos;
        if (!Array.isArray(u.olmoslarTarixi)) u.olmoslarTarixi = [];
        u.olmoslarTarixi.unshift({
          sana: new Date().toISOString().replace("T", " ").slice(0, 16),
          miqdor: -tarif.narxOlmos,
          sabab: `${tarif.nomi} obunasi uchun to'lov (-${tarif.narxOlmos} 💎)`
        });
      } else {
        // 3. Click / Payme / Uzum to'lovi -> TASDIQLANGAN TO'LOV ISBOTI MAJBURIY!
        const txId = tolovTasdigi && String(tolovTasdigi.tranzaksiyaId || "").trim().toUpperCase();
        if (!tolovTasdigi || tolovTasdigi.tolandi !== true || !txId || txId.length < 6) {
          return {
            muvaffaqiyat: false,
            tolovKerak: true,
            xabar: `⚠️ To'lov qilinmasidan "${tarif.nomi}" ga o'tib bo'lmaydi! Avval ${usul} orqali ${tarif.narxSom} to'lovini tasdiqlang.`
          };
        }
        if (baza.ishlatilganTranzaksiyalar.includes(txId)) {
          return {
            muvaffaqiyat: false,
            tolovKerak: true,
            xabar: `⚠️ "${txId}" tranzaksiya kodi allaqachon ishlatilgan!`
          };
        }
        baza.ishlatilganTranzaksiyalar.push(txId);

        if (tarif.bonusOlmos > 0) {
          u.olmoslar = (u.olmoslar || 0) + tarif.bonusOlmos;
          if (!Array.isArray(u.olmoslarTarixi)) u.olmoslarTarixi = [];
          u.olmoslarTarixi.unshift({
            sana: new Date().toISOString().replace("T", " ").slice(0, 16),
            miqdor: tarif.bonusOlmos,
            sabab: `${tarif.nomi} to'lov bonusi (+${tarif.bonusOlmos} 💎)`
          });
        }
      }

      u.obunaTarifi = tarif.nomi;
      const tugash = new Date();
      tugash.setDate(tugash.getDate() + 30);
      u.obunaTugashSana = tugash.toISOString().slice(0, 10);

      this.oxirgiChek = {
        chekId: "PAY-UZ-" + Math.floor(100000 + Math.random() * 900000),
        tarifNomi: tarif.sarlavha,
        tolovUsuli: usul,
        tranzaksiyaId: usul === "Olmos" ? `DIAMOND-${tarif.narxOlmos}` : String(tolovTasdigi.tranzaksiyaId).toUpperCase(),
        summa: usul === "Olmos" ? `${tarif.narxOlmos} 💎 Olmos` : tarif.narxSom,
        sana: new Date().toISOString().replace("T", " ").slice(0, 16),
        foydalanuvchi: `${u.ism} ${u.familiya}`
      };
      this.kassaTarifId = null;

      foydalanuvchiniRoyxatdaYangilash(baza, u);
      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      if (global.OlmoslarVaVaqtTizimi) {
        global.OlmoslarVaVaqtTizimi.ekrandagiOlmosVaVaqtniYangilash();
      }
      return {
        muvaffaqiyat: true,
        chek: this.oxirgiChek,
        xabar: `🎉 Tabriklaymiz! To'lov tasdiqlandi va "${tarif.nomi}" tarifi (${usul} orqali) faollashtirildi!`
      };
    },

    sahifaniIshgaTushirish: function () {
      if (typeof document === "undefined") return;
      const konteyner = document.getElementById("obuna-va-tolov-konteyner");
      if (!konteyner) return;
      this.interfeysniChizish(konteyner);
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const rekvizit = baza.tolovRekvizitlari || {};
      const meningSorovlarim = (baza.tolovSorovlari || []).filter(s => s.foydalanuvchiId === u.id);
      const kassaTarif = this.kassaTarifId
        ? OBUNA_TARIFLARI.find(t => t.id === this.kassaTarifId)
        : null;

      konteyner.innerHTML = `
        <div class="kun-settings-layout">
          <div class="kun-page-banner">
            <div>
              <span class="badge-pill" style="background:rgba(255,255,255,0.2); color:#fde047; margin-bottom:0.5rem; display:inline-block;">
                💰 8-MAXSUS MODUL • STARTUP MONETIZATSIYASI VA PRO OBUNA
              </span>
              <h1 style="font-size:1.75rem; font-weight:900; margin-bottom:0.4rem;">
                💰 PRO Tariflar va Xavfsiz To'lov Tizimi (Click • Payme • Uzum • 💎 Olmos)
              </h1>
              <p style="opacity:0.92; max-width:700px;">
                Milliy to'lov tizimlari (Click, Payme, Uzum Bank) orqali to'lov qiling va tasdiqlang, yoki o'z bilimingiz bilan yig'gan <strong>💎 Olmoslaringiz</strong> evaziga PRO obunani oching. <strong>To'lov qilinmasdan PRO faollashtirilmaydi!</strong>
              </p>
            </div>
            <div style="background:rgba(255,255,255,0.14); padding:1.1rem 1.5rem; border-radius:var(--radius-lg); text-align:center;">
              <div style="font-size:0.8rem; opacity:0.85;">Joriy tarifingiz:</div>
              <div style="font-size:1.45rem; font-weight:900; color:#fde047;">👑 ${u.obunaTarifi || "Bepul"}</div>
              ${u.obunaTugashSana && u.obunaTarifi !== "Bepul" ? `<div style="font-size:0.75rem; opacity:0.85; margin-top:0.2rem;">Muddat: ${u.obunaTugashSana} gacha</div>` : ""}
            </div>
          </div>

          <!-- 1-BO'LIM: TO'LOV USULINI TANLASH -->
          <div class="kun-settings-section-card">
            <div class="section-header">
              <div>
                <span class="kun-settings-step-badge">1-BO'LIM • TO'LOV OPERATORINI TANLASH</span>
                <h2 class="section-title">
                  💳 Qulay to'lov usulini tanlang:
                </h2>
              </div>
            </div>
            <div class="grid-4">
              ${[
                { kod: "Click", nomi: "💙 CLICK Evolution", tavsif: "UZCARD / HUMO to'lov cheki bilan" },
                { kod: "Payme", nomi: "🩵 Payme Business", tavsif: "Tranzaksiya ID tasdig'i bilan" },
                { kod: "Uzum", nomi: "💜 Uzum Bank", tavsif: "Chek va tezkor o'tkazma" },
                { kod: "Olmos", nomi: "💎 Olmoslar evaziga", tavsif: `Balansingiz: ${u.olmoslar || 0} 💎` }
              ].map(m => `
                <button type="button"
                        class="language-flag-option ${this.tanlanganTolovUsuli === m.kod ? "active" : ""}"
                        data-pay-method="${m.kod}"
                        style="flex-direction:column; align-items:flex-start; gap:0.35rem;">
                  <div style="font-size:1rem; font-weight:900;">${m.nomi}</div>
                  <div style="font-size:0.82rem; color:var(--text-muted);">${m.tavsif}</div>
                </button>
              `).join("")}
            </div>
          </div>

          ${kassaTarif ? `
            <!-- TO'LOV KASSA / CHECKOUT OYNASI (TO'LOV QILMASDAN O'TISHNI BLOKLAYDI) -->
            <div class="kun-settings-section-card" id="tolov-kassa-bloki" style="border:2px solid var(--accent-primary); background:var(--bg-secondary);">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">🔒 2-BO'LIM • TO'LOVNI TASDIQLASH KASSASI</span>
                  <h2 class="section-title">
                    ${kassaTarif.sarlavha} — ${this.tanlanganTolovUsuli === "Olmos" ? `${kassaTarif.narxOlmos} 💎 Olmos` : kassaTarif.narxSom}
                  </h2>
                </div>
                <button type="button" class="btn btn-outline" id="kassa-yopish-btn">✕ Bekor qilish</button>
              </div>

              ${this.tanlanganTolovUsuli === "Olmos" ? `
                <div style="padding:1.25rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color);">
                  <p style="font-size:0.95rem; margin-bottom:0.85rem;">
                    Siz ushbu tarifni <strong>${kassaTarif.narxOlmos} 💎 Olmos</strong> evaziga xarid qilmoqdasiz. Hozirgi balansingiz: <strong>${u.olmoslar || 0} 💎</strong>.
                  </p>
                  ${(u.olmoslar || 0) >= kassaTarif.narxOlmos ? `
                    <button type="button" class="btn btn-emerald" id="olmos-tolov-tasdiq-btn" data-plan-id="${kassaTarif.id}">
                      💎 ${kassaTarif.narxOlmos} Olmos to'lab "${kassaTarif.nomi}" ni faollashtirish
                    </button>
                  ` : `
                    <div style="padding:0.85rem 1rem; border-radius:8px; background:rgba(220,38,38,0.1); color:var(--danger); font-weight:700;">
                      ⚠️ Olmoslaringiz yetarli emas! Yana ${kassaTarif.narxOlmos - (u.olmoslar || 0)} 💎 to'plang yoki Click / Payme / Uzum orqali to'lang.
                    </div>
                  `}
                </div>
              ` : `
                <form id="pro-tolov-formasi" style="display:flex; flex-direction:column; gap:1rem;">
                  <div style="padding:1.1rem 1.25rem; border-radius:var(--radius-md); background:var(--bg-tertiary); border:1px solid var(--border-color);">
                    <div style="font-weight:800; margin-bottom:0.4rem;">📌 ${this.tanlanganTolovUsuli} orqali to'lov yo'riqnomasi:</div>
                    <div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6;">
                      1. To'lov summasi: <strong style="color:var(--accent-primary);">${kassaTarif.narxSom}</strong><br/>
                      2. Qabul qiluvchi hisob / karta: <strong>${rekvizit.kartaRaqami ? `${rekvizit.kartaRaqami} (${rekvizit.qabulQiluvchi || "To'ychiyev Otabek"})` : `Admin bilan Telegramda bog'laning (@Tuychiyev_c) yoki Admin Paneldan karta raqamini sozlang`}</strong><br/>
                      3. To'lovni amalga oshirgach, quyidagi maydonlarga chekdagi <strong>Tranzaksiya ID</strong> raqamini kiriting — to'lov tekshirilgach PRO darhol faollashadi.
                    </div>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label" for="pay-karta-tel">To'lov qilgan telefon raqam yoki karta oxirgi 4 raqami *</label>
                      <input type="text" id="pay-karta-tel" class="form-input" placeholder="Masalan: +998 90 123 45 67 yoki *4589" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="pay-tranzaksiya-id">${this.tanlanganTolovUsuli} chek / Tranzaksiya ID raqami *</label>
                      <input type="text" id="pay-tranzaksiya-id" class="form-input" placeholder="Masalan: CLK-984512 yoki 10495823" required />
                    </div>
                  </div>

                  <div style="display:flex; gap:0.85rem; flex-wrap:wrap; align-items:center;">
                    <button type="submit" class="btn btn-primary" data-submit-payment="${kassaTarif.id}">
                      📤 To'lov chekini tekshirishga yuborish
                    </button>
                    <a href="https://t.me/Tuychiyev_c" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                      ✈️ Chekni Telegramda yuborish (@Tuychiyev_c)
                    </a>
                  </div>
                </form>
              `}
            </div>
          ` : ""}

          ${this.oxirgiChek ? `
            <div class="card" style="border:2px solid var(--success); background:var(--bg-tertiary);">
              <h3 style="font-size:1.25rem; font-weight:900; color:var(--success); margin-bottom:0.4rem;">
                🧾 Rasmiy Tasdiqlangan To'lov Cheki (${this.oxirgiChek.chekId})
              </h3>
              <div style="font-size:0.92rem; display:flex; gap:1.5rem; flex-wrap:wrap;">
                <span>👤 Foydalanuvchi: <strong>${this.oxirgiChek.foydalanuvchi}</strong></span>
                <span>📦 Tarif: <strong>${this.oxirgiChek.tarifNomi}</strong></span>
                <span>💳 Usul: <strong>${this.oxirgiChek.tolovUsuli}</strong></span>
                <span>🔢 Tranzaksiya: <strong>${this.oxirgiChek.tranzaksiyaId || "-"}</strong></span>
                <span>💰 Qiymat: <strong>${this.oxirgiChek.summa}</strong></span>
                <span>🕒 Sana: <strong>${this.oxirgiChek.sana}</strong></span>
              </div>
            </div>
          ` : ""}

          <!-- 3 TA TARIF KARTALARI -->
          <div class="grid-3">
            ${OBUNA_TARIFLARI.map(t => {
              const faol = u.obunaTarifi === t.nomi;
              const tugmaMatni = faol
                ? "✅ Sizning joriy tarifingiz"
                : t.id === "plan_free"
                  ? "🌱 Bepul tarifga qaytish"
                  : this.tanlanganTolovUsuli === "Olmos"
                    ? `💎 ${t.narxOlmos} Olmos bilan olish`
                    : `💳 ${this.tanlanganTolovUsuli} orqali to'lovga o'tish`;
              return `
                <div class="card card-interactive" style="display:flex; flex-direction:column; justify-content:space-between; border-width:2px; border-color:${faol ? "var(--success)" : "var(--border-color)"};">
                  <div>
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.8rem;">
                      <span class="badge-pill" style="background:var(--bg-tertiary); color:var(--accent-primary);">${t.nomi}</span>
                      ${faol ? `<span class="badge-pill" style="background:rgba(5,150,105,0.18); color:var(--success);">✅ Faol tarif</span>` : ""}
                    </div>
                    <h3 style="font-size:1.3rem; font-weight:900; margin-bottom:0.45rem;">${t.sarlavha}</h3>
                    <div style="font-size:1.6rem; font-weight:900; color:var(--accent-primary); margin-bottom:0.25rem;">
                      ${this.tanlanganTolovUsuli === "Olmos" && t.narxOlmos > 0 ? `${t.narxOlmos} 💎 Olmos` : t.narxSom}
                    </div>
                    <div style="font-size:0.84rem; color:var(--text-muted); margin-bottom:1.15rem;">
                      ${t.narxOlmos > 0 ? `Yoki ${t.narxOlmos} 💎 Olmos evaziga xarid qilish` : "Doimiy bepul asosiy imkoniyatlar"}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.65rem; font-size:0.92rem;">
                      ${t.imkoniyatlar.map(imk => `<div>${imk}</div>`).join("")}
                    </div>
                  </div>

                  <button type="button"
                          class="btn ${faol ? "btn-emerald" : "btn-primary"}"
                          data-activate-plan="${t.id}"
                          ${faol ? "disabled" : ""}
                          style="width:100%;">
                    ${tugmaMatni}
                  </button>
                </div>
              `;
            }).join("")}
          </div>

          ${meningSorovlarim.length > 0 ? `
            <div class="kun-settings-section-card">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">3-BO'LIM • TO'LOVLARIM HOLATI</span>
                  <h2 class="section-title">📋 Mening PRO To'lov So'rovlarim</h2>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${meningSorovlarim.map(s => {
                  const holatRangi = s.holat === "tasdiqlandi"
                    ? "var(--success)"
                    : s.holat === "rad_etildi"
                      ? "var(--danger)"
                      : "#d97706";
                  const holatMatn = s.holat === "tasdiqlandi"
                    ? "✅ To'lov tasdiqlandi (PRO yoqildi)"
                    : s.holat === "rad_etildi"
                      ? `❌ Rad etildi (${s.radSababi || "To'lov topilmadi"})`
                      : "⏳ To'lov tekshirilmoqda (Admin tasdig'i kutilmoqda)";
                  return `
                    <div style="padding:0.95rem 1.15rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.8rem;">
                      <div>
                        <div style="font-weight:800;">${s.invoysId} • ${s.tarifNomi} (${s.tolovUsuli})</div>
                        <div style="font-size:0.83rem; color:var(--text-muted);">
                          Summa: ${s.summa} • Tranzaksiya: <strong>${s.tranzaksiyaId}</strong> • Sana: ${s.yaratilganSana}
                        </div>
                      </div>
                      <span class="badge-pill" style="background:var(--bg-tertiary); color:${holatRangi}; font-weight:800;">
                        ${holatMatn}
                      </span>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      `;

      konteyner.querySelectorAll("[data-pay-method]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.tanlanganTolovUsuli = btn.getAttribute("data-pay-method");
          this.interfeysniChizish(konteyner);
        });
      });

      konteyner.querySelectorAll("[data-activate-plan]").forEach(btn => {
        btn.addEventListener("click", () => {
          const planId = btn.getAttribute("data-activate-plan");
          const res = this.kassaniOchish(planId);
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("pricing");
          this.interfeysniChizish(konteyner);
        });
      });

      const yopishBtn = document.getElementById("kassa-yopish-btn");
      if (yopishBtn) {
        yopishBtn.addEventListener("click", () => {
          this.kassaniYopish();
          this.interfeysniChizish(konteyner);
        });
      }

      const olmosTasdiqBtn = document.getElementById("olmos-tolov-tasdiq-btn");
      if (olmosTasdiqBtn) {
        olmosTasdiqBtn.addEventListener("click", () => {
          const planId = olmosTasdiqBtn.getAttribute("data-plan-id");
          const res = this.tarifniFaollashtirish(planId, "Olmos");
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("pricing");
          this.interfeysniChizish(konteyner);
        });
      }

      const tolovForm = document.getElementById("pro-tolov-formasi");
      if (tolovForm) {
        tolovForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const submitBtn = tolovForm.querySelector("[data-submit-payment]");
          const planId = submitBtn ? submitBtn.getAttribute("data-submit-payment") : this.kassaTarifId;
          const kartaTel = (document.getElementById("pay-karta-tel") || {}).value || "";
          const txId = (document.getElementById("pay-tranzaksiya-id") || {}).value || "";

          const res = this.tolovSoroviniYuborish(planId, this.tanlanganTolovUsuli, kartaTel, txId);
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(res.xabar);
          global.MundarijaVaNavigatsiya.navigatsiyaniChizish("pricing");
          this.interfeysniChizish(konteyner);
        });
      }
    }
  };

  global.ObunaVaTolovMantiqi = ObunaVaTolovMantiqi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ObunaVaTolovMantiqi;
  }
})(typeof window !== "undefined" ? window : globalThis);
