/* ==========================================================================
   PAPKA VA FAYL: 8_Obuna_va_Tolov_Bulimi/Obuna_va_Tolov_mantiqi.js
   VAZIFASI: 8-Modul — "Startup Monetizatsiyasi (PRO Obuna va To'lov Tizimi)".
             - Bepul, O'quvchi PRO va Ustoz Ekspert PRO tariflari;
             - To'lov oynasida karta egasi (OTABEK TOYCHIYEV) va HUMO karta
               raqami (9860 1201 7157 4847) avtomatik ko'rsatiladi;
             - Foydalanuvchi o'zi xohlagan istalgan ilova (Click, Payme, Uzum,
               Paynet, Milliy va b.) hamda istalgan kartasidan (HUMO/UZCARD)
               to'lov qilishi mumkin;
             - XAVFSIZLIK: To'lov qilinmasidan va Backend da tasdiqlanmasdan
               Bepuldan PRO ga o'tib bo'lmaydi!
   ========================================================================== */

(function (global) {
  const DEFAULT_KARTA_TURI = "HUMO";
  const DEFAULT_KARTA_RAQAMI = "9860 1201 7157 4847";
  const DEFAULT_KARTA_EGASI = "OTABEK TOYCHIYEV";

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

  const ILOVA_TURLARI = [
    "Click Evolution",
    "Payme",
    "Uzum Bank",
    "Paynet",
    "Milliy / Bank ilovasi",
    "Alif Mobi / Boshqa HUMO-UZCARD ilova"
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

  function httpServerMavjudmi() {
    return (
      typeof fetch !== "undefined" &&
      typeof window !== "undefined" &&
      window.location &&
      typeof window.location.protocol === "string" &&
      window.location.protocol.startsWith("http")
    );
  }

  function servergaPostYuborish(endpoint, payload) {
    try {
      if (httpServerMavjudmi()) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).catch(() => {});
      }
    } catch (e) {}
  }

  let tekshiruvIntervalId = null;

  const ObunaVaTolovMantiqi = {
    tariflar: OBUNA_TARIFLARI,
    ilovaTurlari: ILOVA_TURLARI,
    tanlanganTolovUsuli: "Istalgan Ilova / Karta", // "Istalgan Ilova / Karta" | "Click" | "Payme" | "Uzum" | "Olmos"
    kassaTarifId: null,
    oxirgiChek: null,

    rekvizitniOlish: function (baza) {
      const r = (baza && baza.tolovRekvizitlari) || {};
      return {
        kartaTuri: r.kartaTuri || DEFAULT_KARTA_TURI,
        kartaRaqami: r.kartaRaqami || DEFAULT_KARTA_RAQAMI,
        qabulQiluvchi: (r.qabulQiluvchi && r.qabulQiluvchi !== "To'ychiyev Otabek")
          ? r.qabulQiluvchi
          : DEFAULT_KARTA_EGASI,
        telegramAloqa: r.telegramAloqa || "@Tuychiyev_c"
      };
    },

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
        xabar: `💳 "${tarif.nomi}" uchun to'lov oynasi ochildi. Karta raqamiga to'lov qilib chekni tasdiqlang.`
      };
    },

    kassaniYopish: function () {
      this.kassaTarifId = null;
    },

    // Pullik tariflar uchun to'lovni tasdiqlash so'rovini yuborish (Backend + LocalStorage).
    // DIQQAT: Tranzaksiya ID shart emas, lekin to'lov Backend da tasdiqlanmasdan PRO ochilmaydi!
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
      if ((manba.match(/\d/g) || []).length < 4) {
        return {
          muvaffaqiyat: false,
          xabar: "⚠️ To'lov qilgan telefon raqamingiz (+998...) yoki kartangizning oxirgi 4 raqamini kiriting!"
        };
      }

      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      if (!Array.isArray(baza.tolovSorovlari)) baza.tolovSorovlari = [];
      if (!Array.isArray(baza.ishlatilganTranzaksiyalar)) baza.ishlatilganTranzaksiyalar = [];

      const invoysId = "INV-UZ-" + Math.floor(100000 + Math.random() * 900000);
      const ixtiyoriyTx = String(tranzaksiyaId || "").trim().toUpperCase();
      const u = baza.joriyFoydalanuvchi;
      const sorov = {
        invoysId,
        foydalanuvchiId: u.id,
        foydalanuvchiIsmi: `${u.ism} ${u.familiya}`,
        tarifId: tarif.id,
        tarifNomi: tarif.nomi,
        tarifSarlavha: tarif.sarlavha,
        tolovUsuli: usul,
        summa: tarif.narxSom,
        kartaYokiTel: manba,
        tranzaksiyaId: ixtiyoriyTx || invoysId,
        holat: "kutilmoqda",
        yaratilganSana: new Date().toISOString().replace("T", " ").slice(0, 16)
      };

      baza.tolovSorovlari.unshift(sorov);
      global.UmumiyHolatVaBazalar.holatniSaqlash(baza);
      this.kassaTarifId = null;

      // Agar Backend server (Node.js/Python) ishlab turgan bo'lsa, serverga tekshirish uchun yuboramiz
      servergaPostYuborish("/api/tolov/sorov", sorov);

      return {
        muvaffaqiyat: true,
        kutilmoqda: true,
        sorov,
        xabar: `✅ To'lovni tasdiqlash so'rovingiz (${sorov.invoysId}) qabul qilindi! To'lov tekshirilgach "${tarif.nomi}" avtomatik faollashadi.`
      };
    },

    // Backend serverdan to'lov o'tgan-o'tmaganini avtomatik tekshirish
    tolovHolatiniBackenddaTekshirish: async function (konteyner) {
      if (!httpServerMavjudmi()) {
        return { tekshirildi: false, tasdiqlandi: false };
      }
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      try {
        const resp = await fetch(`/api/tolov/holat?foydalanuvchiId=${encodeURIComponent(u.id)}`);
        if (!resp.ok) return { tekshirildi: false, tasdiqlandi: false };
        const data = await resp.json();
        const serverSorovlar = Array.isArray(data.sorovlar) ? data.sorovlar : [];
        let yangilandi = false;

        serverSorovlar.forEach(srv => {
          const lokal = (baza.tolovSorovlari || []).find(l => l.invoysId === srv.invoysId);
          if (lokal && lokal.holat !== srv.holat) {
            lokal.holat = srv.holat;
            lokal.radSababi = srv.radSababi;
            lokal.tasdiqlanganSana = srv.tasdiqlanganSana;
            lokal.chek = srv.chek;
            yangilandi = true;
          }
          if (srv.holat === "tasdiqlandi" && u.obunaTarifi !== srv.tarifNomi) {
            const actRes = this.tarifniFaollashtirish(srv.tarifId, srv.tolovUsuli, {
              tolandi: true,
              tranzaksiyaId: srv.tranzaksiyaId,
              foydalanuvchiId: srv.foydalanuvchiId
            });
            if (actRes.muvaffaqiyat) yangilandi = true;
          }
        });

        if (yangilandi) {
          const yangiBaza = global.UmumiyHolatVaBazalar.holatniYuklash();
          yangiBaza.tolovSorovlari = (yangiBaza.tolovSorovlari || []).map(l => {
            const srv = serverSorovlar.find(s => s.invoysId === l.invoysId);
            return srv ? { ...l, ...srv } : l;
          });
          global.UmumiyHolatVaBazalar.holatniSaqlash(yangiBaza);
          if (konteyner) this.interfeysniChizish(konteyner);
          if (global.MundarijaVaNavigatsiya) global.MundarijaVaNavigatsiya.navigatsiyaniChizish("pricing");
        }
        return { tekshirildi: true, tasdiqlandi: Boolean(data.tasdiqlandi) };
      } catch (e) {
        return { tekshirildi: false, tasdiqlandi: false };
      }
    },

    // Admin panelda (va Backend da) to'lov tushganini tasdiqlash -> PRO tarifni faollashtirish
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
        servergaPostYuborish("/api/tolov/tasdiqlash", { invoysId });
      }
      return res;
    },

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
      servergaPostYuborish("/api/tolov/rad-etish", { invoysId, sabab: sorov.radSababi });

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
        const tasdiqKaliti = tolovTasdigi && String(tolovTasdigi.tranzaksiyaId || tolovTasdigi.invoysId || "").trim().toUpperCase();
        if (!tolovTasdigi || tolovTasdigi.tolandi !== true || !tasdiqKaliti || tasdiqKaliti.length < 4) {
          return {
            muvaffaqiyat: false,
            tolovKerak: true,
            xabar: `⚠️ To'lov qilinmasidan "${tarif.nomi}" ga o'tib bo'lmaydi! Avval to'lovni tasdiqlang.`
          };
        }
        if (baza.ishlatilganTranzaksiyalar.includes(tasdiqKaliti)) {
          return {
            muvaffaqiyat: false,
            tolovKerak: true,
            xabar: `⚠️ "${tasdiqKaliti}" to'lov kodi allaqachon ishlatilgan!`
          };
        }
        baza.ishlatilganTranzaksiyalar.push(tasdiqKaliti);

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
        tranzaksiyaId: usul === "Olmos" ? `DIAMOND-${tarif.narxOlmos}` : String(tolovTasdigi.tranzaksiyaId || tolovTasdigi.invoysId || "").toUpperCase(),
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
      this.tolovHolatiniBackenddaTekshirish(konteyner);

      if (tekshiruvIntervalId) clearInterval(tekshiruvIntervalId);
      if (typeof window !== "undefined" && window.setInterval) {
        tekshiruvIntervalId = window.setInterval(() => {
          const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
          const kutilmoqdaBor = (baza.tolovSorovlari || []).some(
            s => s.foydalanuvchiId === baza.joriyFoydalanuvchi.id && s.holat === "kutilmoqda"
          );
          if (kutilmoqdaBor) {
            this.tolovHolatiniBackenddaTekshirish(konteyner);
          }
        }, 5000);
      }
    },

    interfeysniChizish: function (konteyner) {
      const baza = global.UmumiyHolatVaBazalar.holatniYuklash();
      const u = baza.joriyFoydalanuvchi;
      const rekvizit = this.rekvizitniOlish(baza);
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
                💰 PRO Tariflar va Xavfsiz To'lov Tizimi (Istalgan Ilova va Karta • 💎 Olmos)
              </h1>
              <p style="opacity:0.92; max-width:720px;">
                O'zingiz xohlagan <strong>istalgan bank ilovasidan va istalgan kartangizdan (HUMO / UZCARD / Click / Payme / Uzum / Paynet)</strong> to'lov qiling yoki yig'gan <strong>💎 Olmoslaringiz</strong> bilan PRO oching. <strong>To'lov tasdiqlanmasdan PRO ochilmaydi!</strong>
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
                <span class="kun-settings-step-badge">1-BO'LIM • TO'LOV USULINI TANLASH</span>
                <h2 class="section-title">
                  💳 Istalgan ilova, karta yoki 💎 Olmosni tanlang:
                </h2>
              </div>
            </div>
            <div class="grid-4">
              ${[
                { kod: "Istalgan Ilova / Karta", nomi: "🏦 Istalgan Ilova / Karta", tavsif: "HUMO, UZCARD, Paynet, Milliy, Alif..." },
                { kod: "Click", nomi: "💙 CLICK Evolution", tavsif: "Istalgan kartadan Click orqali" },
                { kod: "Payme", nomi: "🩵 Payme / Uzum Bank", tavsif: "Tezkor o'tkazma va chek" },
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
            <!-- TO'LOV KASSA / CHECKOUT OYNASI (KARTA RAQAMI AVTOMATIK KIRITILGAN) -->
            <div class="kun-settings-section-card" id="tolov-kassa-bloki" style="border:2px solid var(--accent-primary); background:var(--bg-secondary);">
              <div class="section-header">
                <div>
                  <span class="kun-settings-step-badge">🔒 2-BO'LIM • TO'LOV KASSASI</span>
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
                      ⚠️ Olmoslaringiz yetarli emas! Yana ${kassaTarif.narxOlmos - (u.olmoslar || 0)} 💎 to'plang yoki istalgan bank ilovasidan HUMO kartaga to'lang.
                    </div>
                  `}
                </div>
              ` : `
                <form id="pro-tolov-formasi" style="display:flex; flex-direction:column; gap:1.1rem;">
                  <!-- AVTOMATIK TO'LDIRILGAN QABUL QILUVCHI HUMO KARTA -->
                  <div style="padding:1.25rem; border-radius:var(--radius-lg); background:linear-gradient(135deg, #0f172a 0%, #173776 60%, #0284c7 100%); color:#ffffff; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
                    <div>
                      <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em; opacity:0.85;">
                        💳 ${rekvizit.kartaTuri} KARTA • ISTALGAN ILOVA VA KARTADAN O'TKAZMA
                      </div>
                      <div id="qabul-karta-raqami" style="font-size:1.6rem; font-weight:900; letter-spacing:0.08em; margin:0.35rem 0;">
                        ${rekvizit.kartaRaqami}
                      </div>
                      <div style="font-size:0.95rem; font-weight:700;">
                        Karta egasi: <span style="color:#fde047;">${rekvizit.qabulQiluvchi}</span> • Summa: <span style="color:#fde047;">${kassaTarif.narxSom}</span>
                      </div>
                    </div>
                    <button type="button" class="btn btn-white" id="karta-nusxa-btn">
                      📋 Karta raqamini nusxalash
                    </button>
                  </div>

                  <div style="padding:1rem 1.2rem; border-radius:var(--radius-md); background:var(--bg-tertiary); border:1px solid var(--border-color); font-size:0.9rem; line-height:1.6;">
                    <strong>📌 Qanday to'lanadi?</strong><br/>
                    1. O'zingiz xohlagan <strong>istalgan ilovadan</strong> (Click, Payme, Uzum Bank, Paynet, Milliy, Alif, Agrobank, Kapitalbank va b.) va <strong>istalgan kartangizdan</strong> (HUMO / UZCARD) yuqoridagi <strong>${rekvizit.kartaTuri} (${rekvizit.kartaRaqami})</strong> kartasiga <strong>${kassaTarif.narxSom}</strong> o'tkazing.<br/>
                    2. To'lovni amalga oshirgach, qaysi ilovadan to'laganingizni hamda telefon yoki kartangizning oxirgi 4 raqamini kiriting va <strong>"✅ To'lovni tasdiqlash"</strong> tugmasini bosing.
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label" for="pay-ilova-nomi">Qaysi ilova orqali to'ladingiz? *</label>
                      <select id="pay-ilova-nomi" class="form-select">
                        ${ILOVA_TURLARI.map(ilova => `<option value="${ilova}">${ilova}</option>`).join("")}
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="pay-karta-tel">Telefon raqamingiz yoki kartangiz oxirgi 4 raqami *</label>
                      <input type="text" id="pay-karta-tel" class="form-input" placeholder="Masalan: +998 90 123 45 67 yoki *4589" required />
                    </div>
                  </div>

                  <div style="display:flex; gap:0.85rem; flex-wrap:wrap; align-items:center;">
                    <button type="submit" class="btn btn-primary" data-submit-payment="${kassaTarif.id}">
                      ✅ To'lovni tasdiqlash
                    </button>
                    <a href="https://t.me/Tuychiyev_c" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                      ✈️ Chek rasmini Telegramda yuborish (@Tuychiyev_c)
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
                    : `💳 To'lov oynasini ochish (${t.narxSom})`;
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
                  <span class="kun-settings-step-badge">3-BO'LIM • TO'LOV HOLATI</span>
                  <h2 class="section-title">📋 Mening PRO To'lov So'rovlarim</h2>
                </div>
                <button type="button" class="btn btn-outline" id="backend-tekshir-btn">
                  🔄 To'lov holatini tekshirish
                </button>
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
                      : "⏳ To'lov tekshirilmoqda";
                  return `
                    <div style="padding:0.95rem 1.15rem; border-radius:var(--radius-md); background:var(--bg-primary); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.8rem;">
                      <div>
                        <div style="font-weight:800;">${s.invoysId} • ${s.tarifNomi} (${s.tolovUsuli})</div>
                        <div style="font-size:0.83rem; color:var(--text-muted);">
                          Summa: ${s.summa} • Karta/Tel: <strong>${s.kartaYokiTel}</strong> • Sana: ${s.yaratilganSana}
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

      const nusxaBtn = document.getElementById("karta-nusxa-btn");
      if (nusxaBtn) {
        nusxaBtn.addEventListener("click", () => {
          const tozaRaqam = String(rekvizit.kartaRaqami || "").replace(/\s+/g, "");
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(tozaRaqam).catch(() => {});
          }
          global.UmumiyHolatVaBazalar.xabarnomaKorsatish(`📋 Karta raqami nusxalandi: ${rekvizit.kartaRaqami}`);
        });
      }

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

      const backendTekshirBtn = document.getElementById("backend-tekshir-btn");
      if (backendTekshirBtn) {
        backendTekshirBtn.addEventListener("click", async () => {
          const holatRes = await this.tolovHolatiniBackenddaTekshirish(konteyner);
          if (holatRes.tasdiqlandi) {
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish("✅ Backend to'lovni tasdiqladi! PRO obunangiz faol.");
          } else {
            global.UmumiyHolatVaBazalar.xabarnomaKorsatish("⏳ To'lov hali Backend da tasdiqlanish jarayonida.");
          }
        });
      }

      const tolovForm = document.getElementById("pro-tolov-formasi");
      if (tolovForm) {
        tolovForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const submitBtn = tolovForm.querySelector("[data-submit-payment]");
          const planId = submitBtn ? submitBtn.getAttribute("data-submit-payment") : this.kassaTarifId;
          const ilovaNomi = (document.getElementById("pay-ilova-nomi") || {}).value || this.tanlanganTolovUsuli;
          const kartaTel = (document.getElementById("pay-karta-tel") || {}).value || "";

          const res = this.tolovSoroviniYuborish(planId, ilovaNomi, kartaTel);
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
