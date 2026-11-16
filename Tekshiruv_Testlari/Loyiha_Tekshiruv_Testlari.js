/* ==========================================================================
   FAYL NOMI: Tekshiruv_Testlari/Loyiha_Tekshiruv_Testlari.js
   VAZIFASI: Loyihadagi barcha 17 ta modulni (9 ta asosiy sahifa + 8 ta yangi
             alohida papkadagi Startup modullari: Olmoslar do'koni, 1v1 Duel,
             Grafik chizuvchi, Kunlik Streak va Turnir, Ustoz sinfxonasi,
             Xatolar daftari, Sertifikat tekshiruvi, PRO Obuna) tekshirish.
   ISHGA TUSHIRISH: node Tekshiruv_Testlari/Loyiha_Tekshiruv_Testlari.js
   ========================================================================== */

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT = path.join(__dirname, "..");

const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => {
    store[k] = String(v);
  },
  removeItem: (k) => {
    delete store[k];
  },
};

const RasmlarVaBelgilar = require("../Dizayn_va_Uslublar/Rasmlar_va_Belgilar.js");
const TilVaTarjimalar = require("../Dastur_Kodlari_JS/Til_va_Tarjimalar.js");
const UmumiyHolatVaBazalar = require("../Dastur_Kodlari_JS/Umumiy_Holat_va_Bazalar.js");
const OlmoslarVaVaqtTizimi = require("../Dastur_Kodlari_JS/Olmoslar_va_Vaqt_tizimi.js");
const MatematikaSavollarBazasi = require("../Dastur_Kodlari_JS/Matematika_Savollar_Bazasi.js");
const MundarijaVaNavigatsiya = require("../Dastur_Kodlari_JS/Mundarija_va_Navigatsiya.js");
const QidiruvBulimi = require("../Dastur_Kodlari_JS/Qidiruv_bulimi.js");
const SertifikatBulimi = require("../Dastur_Kodlari_JS/Sertifikat_bulimi.js");
const SozlamalarVaProfil = require("../Dastur_Kodlari_JS/Sozlamalar_va_Profil.js");
const NoldanUrganishBulimi = require("../Dastur_Kodlari_JS/Noldan_urganish_bulimi.js");
const TestBulimi = require("../Dastur_Kodlari_JS/Test_bulimi.js");
const KirishVaRoyxatdanUtish = require("../Dastur_Kodlari_JS/Kirish_va_Royxatdan_utish.js");
const AdminPaneli = require("../Dastur_Kodlari_JS/Admin_paneli.js");

// 8 ta yangi maxsus papkadagi modullar:
const OlmoslarDukoniMantiqi = require("../1_Olmoslar_Dukoni_Bulimi/Olmoslar_dukoni_mantiqi.js");
const MatematikDuelMantiqi = require("../2_Matematik_Duel_Bulimi/Matematik_duel_mantiqi.js");
const GrafikVaFormulalarMantiqi = require("../3_Grafik_va_Formulalar_Bulimi/Grafik_va_Formulalar_mantiqi.js");
const KunlikZanjirVaTurnirMantiqi = require("../4_Kunlik_Zanjir_va_Turnir_Bulimi/Kunlik_zanjir_va_Turnir_mantiqi.js");
const UstozSinfxonasiMantiqi = require("../5_Ustoz_Sinfxonasi_Bulimi/Ustoz_sinfxonasi_mantiqi.js");
const XatolarDaftariMantiqi = require("../6_Xatolar_Daftari_Bulimi/Xatolar_daftari_mantiqi.js");
const SertifikatTekshirishMantiqi = require("../7_Sertifikat_Tekshirish_Bulimi/Sertifikat_tekshirish_mantiqi.js");
const ObunaVaTolovMantiqi = require("../8_Obuna_va_Tolov_Bulimi/Obuna_va_Tolov_mantiqi.js");

const { createServerInstance } = require("../Server_Asosiy.js");

let otdi = 0;
async function test(nomi, fn) {
  try {
    await fn();
    otdi++;
    console.log(`✅ [PASS] ${nomi}`);
  } catch (err) {
    console.error(`❌ [FAIL] ${nomi}:`, err.message);
    process.exitCode = 1;
  }
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = "";
        res.on("data", (c) => {
          body += c;
        });
        res.on("end", () => resolve({ statusCode: res.statusCode, body }));
      })
      .on("error", reject);
  });
}

function httpPost(url, payload, contentType = "application/json") {
  return new Promise((resolve, reject) => {
    const raw = typeof payload === "string" ? payload : JSON.stringify(payload);
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: "POST",
        headers: {
          "Content-Type": contentType,
          "Content-Length": Buffer.byteLength(raw),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => {
          body += c;
        });
        res.on("end", () => resolve({ statusCode: res.statusCode, body }));
      },
    );
    req.on("error", reject);
    req.write(raw);
    req.end();
  });
}

(async function runAllTests() {
  console.log(
    "=== ALGEMATH UZ STARTUP — 17 TA MODUL AVTOMATLASHTIRILGAN TESTLARI ===",
  );

  // 1. 45 talik Sertifikat savollari
  await test("1. Milliy Sertifikat bo'limida aniq 45 ta savol (15 oson, 15 o'rtacha, 15 qiyin) mavjudligi", () => {
    const savollar = MatematikaSavollarBazasi.sertifikat45Test;
    assert.strictEqual(savollar.length, 45);
    assert.strictEqual(
      savollar.filter((q) => q.qiyinchilik === "oson").length,
      15,
    );
    assert.strictEqual(
      savollar.filter((q) => q.qiyinchilik === "ortacha").length,
      15,
    );
    assert.strictEqual(
      savollar.filter((q) => q.qiyinchilik === "qiyin").length,
      15,
    );
  });

  // 2. 0 dan o'rganish 10 talik testlari va aniq javobsiz Yordam/Memory
  await test("2. 0 dan o'rganish bo'limida 6 ta daraja (C..A+), 10 talik test va Yordam/Memory borligi", () => {
    const darajalar = MatematikaSavollarBazasi.noldanUrganishDarajalari;
    assert.strictEqual(darajalar.length, 6);
    darajalar.forEach((d) => {
      assert.strictEqual(d.onTalikTest.length, 10);
      d.onTalikTest.forEach((q) =>
        assert.ok(q.yordam_eslatma && q.yordam_eslatma.length > 20),
      );
    });
  });

  // 3. [1-MODUL] Olmoslar Do'koni (Diamond Shop)
  await test("3. [1-Papkadagi Modul] Olmoslar Do'koni xarid qilish va balansni tekshirish", () => {
    UmumiyHolatVaBazalar.foydalanuvchiniYangilash({
      olmoslar: 100,
      xaridlar: [],
    });
    const res1 = OlmoslarDukoniMantiqi.xaridQilish("item_pdf_qkf_viyet"); // 15 olmos
    assert.strictEqual(res1.muvaffaqiyat, true);
    assert.strictEqual(res1.qolganOlmos, 85);

    // Qayta bosganda olmos yechmasdan faollashtirishi kerak
    const res2 = OlmoslarDukoniMantiqi.xaridQilish("item_pdf_qkf_viyet");
    assert.strictEqual(res2.allaqachonBor, true);
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.olmoslar,
      85,
    );
  });

  // 4. [2-MODUL] 1 ga 1 Matematik Duel Arenasi
  await test("4. [2-Papkadagi Modul] 1v1 Matematik Duel boshlash, 5 ta savolga javob berish va yutuq", () => {
    UmumiyHolatVaBazalar.foydalanuvchiniYangilash({ olmoslar: 100 });
    const startRes = MatematikDuelMantiqi.duelniBoshlash("bot_c");
    assert.strictEqual(startRes.muvaffaqiyat, true);
    assert.strictEqual(MatematikDuelMantiqi.duelSavollari.length, 5);

    // 5 ta savolning barchasiga to'g'ri javob beramiz
    MatematikDuelMantiqi.duelSavollari.forEach((q) => {
      MatematikDuelMantiqi.javobBerish(q.togriIndex);
    });
    assert.strictEqual(MatematikDuelMantiqi.holat, "yakun");
    assert.strictEqual(MatematikDuelMantiqi.meningBallim, 5);
  });

  // 5. [3-MODUL] Interaktiv Grafik Chizuvchi va Formula Doskasi
  await test("5. [3-Papkadagi Modul] Grafik Chizuvchi parabola uchi, diskriminant va ildizlarini aniqlashi", () => {
    // y = x^2 - 2x - 3 => D = 4 + 12 = 16, uchi (1; -4), ildizlar -1 va 3
    const tahlil = GrafikVaFormulalarMantiqi.kvadratFunksiyaniTahlilQilish(
      1,
      -2,
      -3,
    );
    assert.strictEqual(tahlil.diskriminant, 16);
    assert.strictEqual(tahlil.x0, 1);
    assert.strictEqual(tahlil.y0, -4);
    assert.deepStrictEqual(tahlil.ildizlar, [-1, 3]);

    const svg = GrafikVaFormulalarMantiqi.svgGrafikChizish(1, -2, -3);
    assert.ok(svg.includes("<svg") && svg.includes("<polyline"));
    assert.strictEqual(GrafikVaFormulalarMantiqi.formulalarDoskasi.length, 6);
  });

  // 6. [4-MODUL] Kunlik Olovli Zanjir (Streak) va 7 kunlik +50 💎 Super-Bonus
  await test("6. [4-Papkadagi Modul] Olovli Zanjir (Streak) 7 kunga yetganda +50 💎 Super-Bonus berishi", () => {
    UmumiyHolatVaBazalar.foydalanuvchiniYangilash({
      kunlikZanjirSoni: 6,
      haftalikBonusOlindi: false,
      olmoslar: 50,
    });
    const res = KunlikZanjirVaTurnirMantiqi.zanjirniFaollashtirish();
    assert.strictEqual(res.zanjirSoni, 7);
    assert.strictEqual(res.bonusOlmos, 50);
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.olmoslar,
      100,
    );
  });

  // 7. [5-MODUL] Ustoz Sinfxonasi — 6 xonali sinf kodi va Uyga vazifa
  await test("7. [5-Papkadagi Modul] Ustoz yangi sinf (MATH-XX) yaratishi, o'quvchi qo'shilishi va vazifa topshirishi", () => {
    const yangiSinf = UstozSinfxonasiMantiqi.yangiSinfYaratish(
      "Olimpiada 11-A",
      "A",
      "Logarifmlar",
      30,
    );
    assert.ok(yangiSinf.sinfKodi.startsWith("MATH-"));

    const joinRes = UstozSinfxonasiMantiqi.sinfgaQoshilish(yangiSinf.sinfKodi);
    assert.strictEqual(joinRes.muvaffaqiyat, true);

    const hwRes = UstozSinfxonasiMantiqi.uygaVazifaniTopshirish(
      yangiSinf.sinfKodi,
      5,
      5,
    );
    assert.strictEqual(hwRes.foiz, 100);
    assert.strictEqual(hwRes.mukofot, 30);
  });

  // 8. [6-MODUL] Aqlli Xatolar Ustida Ishlash Daftari (+3 💎 mukofot)
  await test("8. [6-Papkadagi Modul] Xatolar daftariga savol tushishi va uni tuzatganda +3 💎 berilishi", () => {
    UmumiyHolatVaBazalar.xatoniDaftargaQoshish(
      {
        id: "test_err_99",
        savol: "2x = 10 tenglamadan x ni toping",
        variantlar: ["5", "4", "6", "2"],
        togriIndex: 0,
      },
      1,
      "Sinov testi",
    );

    const daftar =
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.xatolarDaftari;
    const xato = daftar.find((x) => x.savolId === "test_err_99");
    assert.ok(xato);

    // Avval xato javob berib ko'ramiz
    const xatoUrinish = XatolarDaftariMantiqi.xatoniTuzatishgaUrinish(
      xato.id,
      2,
    );
    assert.strictEqual(xatoUrinish.togri, false);

    // Endi to'g'ri javob berib tuzatamiz
    const oldOlmos =
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.olmoslar;
    const togriUrinish = XatolarDaftariMantiqi.xatoniTuzatishgaUrinish(
      xato.id,
      0,
    );
    assert.strictEqual(togriUrinish.togri, true);
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.olmoslar,
      oldOlmos + 3,
    );
  });

  // 9. [7-MODUL] Milliy Sertifikat Haqiqiyligini Tekshirish (ID va Ism bo'yicha)
  await test("9. [7-Papkadagi Modul] Sertifikat ID raqami (MS-UZ-2026-1001) orqali haqiqiyligini tekshirish", () => {
    const topilgan =
      SertifikatTekshirishMantiqi.sertifikatniTekshirish("MS-UZ-2026-1001");
    assert.strictEqual(topilgan.topildi, true);
    assert.strictEqual(topilgan.sertifikat.daraja, "A+");

    const topilmadi =
      SertifikatTekshirishMantiqi.sertifikatniTekshirish("MS-YOQ-0000");
    assert.strictEqual(topilmadi.topildi, false);
  });

  // 10. [8-MODUL] Startup Monetizatsiyasi — To'lovsiz PRO ga o'tib ketmasligi va to'lov tasdiqlangach ochilishi
  await test("10. [8-Papkadagi Modul] To'lov qilinmasdan PRO ochilmasligi, chek yuborish va tasdiqlangach faollashishi", () => {
    UmumiyHolatVaBazalar.foydalanuvchiniYangilash({
      olmoslar: 200,
      obunaTarifi: "Bepul",
    });

    // 1) To'lovsiz to'g'ridan-to'g'ri Click/Payme bosilganda Bepuldan PRO ga O'TMASLIGI shart!
    const tolovsizUrinish = ObunaVaTolovMantiqi.tarifniFaollashtirish(
      "plan_teacher_pro",
      "Click",
    );
    assert.strictEqual(tolovsizUrinish.muvaffaqiyat, false);
    assert.strictEqual(tolovsizUrinish.tolovKerak, true);
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.obunaTarifi,
      "Bepul",
    );
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.olmoslar,
      200,
    );

    // 2) Kassa ochilganda ham hali Bepul tarifda qolishi kerak
    const kassaRes = ObunaVaTolovMantiqi.kassaniOchish("plan_teacher_pro");
    assert.strictEqual(kassaRes.kassaOchildi, true);
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.obunaTarifi,
      "Bepul",
    );

    // 3) To'lov so'rovi yuborilganda holat "kutilmoqda", foydalanuvchi hali "Bepul"
    const sorovRes = ObunaVaTolovMantiqi.tolovSoroviniYuborish(
      "plan_teacher_pro",
      "Click",
      "+998901234567",
      "CLK-998877",
    );
    assert.strictEqual(sorovRes.muvaffaqiyat, true);
    assert.strictEqual(sorovRes.kutilmoqda, true);
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.obunaTarifi,
      "Bepul",
    );

    // 4) Admin to'lov tushganini tasdiqlagandan keyingina PRO ochiladi (+100 bonus olmos)
    const tasdiqRes = ObunaVaTolovMantiqi.tolovniTasdiqlash(
      sorovRes.sorov.invoysId,
    );
    assert.strictEqual(tasdiqRes.muvaffaqiyat, true);
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.obunaTarifi,
      "Ustoz Ekspert PRO",
    );
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.olmoslar,
      300,
    );

    // 5) Bir xil tranzaksiya kodi qayta ishlatilmasligi kerak
    const qaytaRes = ObunaVaTolovMantiqi.tarifniFaollashtirish(
      "plan_student_pro",
      "Click",
      { tolandi: true, tranzaksiyaId: "CLK-998877" },
    );
    assert.strictEqual(qaytaRes.muvaffaqiyat, false);

    // 6) Olmos evaziga xarid balansdan yechib faollashtiradi (va yetarli bo'lmasa rad etadi)
    UmumiyHolatVaBazalar.foydalanuvchiniYangilash({
      olmoslar: 200,
      obunaTarifi: "Bepul",
    });
    const resOlmos = ObunaVaTolovMantiqi.tarifniFaollashtirish(
      "plan_student_pro",
      "Olmos",
    );
    assert.strictEqual(resOlmos.muvaffaqiyat, true);
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.obunaTarifi,
      "O'quvchi PRO",
    );
    assert.strictEqual(
      UmumiyHolatVaBazalar.holatniYuklash().joriyFoydalanuvchi.olmoslar,
      80,
    ); // 200 - 120
  });

  // 11. Server barcha 17 ta sahifani hamda Backend PRO to'lov tekshiruv API va Click webhook ni to'g'ri ishlashi
  await test("11. Server barcha 17 ta alohida sahifani va Backend to'lov tekshiruv API (/api/tolov/*, /api/webhook/click) ni xatosiz uzatishi", async () => {
    const dbPath = path.join(ROOT, "Malumotlar_Bazasi", "Baza_Malumotlari.json");
    const dbBackup = fs.existsSync(dbPath) ? fs.readFileSync(dbPath, "utf8") : null;
    const prevSecret = process.env.CLICK_SECRET_KEY;
    delete process.env.CLICK_SECRET_KEY;

    const server = createServerInstance();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;

    try {
      assert.strictEqual(
        MundarijaVaNavigatsiya.sahifalarMundarijasi.length,
        17,
      );
      for (const s of MundarijaVaNavigatsiya.sahifalarMundarijasi) {
        const pageRes = await httpGet(`${base}/${s.papka}/${s.fayl}`);
        assert.strictEqual(
          pageRes.statusCode,
          200,
          `${s.papka}/${s.fayl} 200 qaytarishi kerak`,
        );
      }

      // 1) Backend to'lov so'rovi yaratiladi, lekin holat "kutilmoqda" (tasdiqlandi: false)
      const invoysId = "INV-TEST-9001";
      const postSorov = await httpPost(`${base}/api/tolov/sorov`, {
        invoysId,
        foydalanuvchiId: "user_default_1",
        foydalanuvchiIsmi: "Sardorbek Alimov",
        tarifId: "plan_student_pro",
        tolovUsuli: "Paynet",
        kartaYokiTel: "+998901234567",
        tranzaksiyaId: "PAYNET-123456",
      });
      assert.strictEqual(postSorov.statusCode, 200);
      const sorovJson = JSON.parse(postSorov.body);
      assert.strictEqual(sorovJson.kutilmoqda, true);

      const statusRes1 = await httpGet(`${base}/api/tolov/holat?invoysId=${invoysId}`);
      assert.strictEqual(statusRes1.statusCode, 200);
      assert.strictEqual(JSON.parse(statusRes1.body).tasdiqlandi, false);

      // 2) CLICK_SECRET_KEY sozlanmagan paytda soxta webhook rad etiladi (503)
      const unauthWebhook = await httpPost(
        `${base}/api/webhook/click`,
        "action=1&merchant_trans_id=" + invoysId,
        "application/x-www-form-urlencoded",
      );
      assert.strictEqual(unauthWebhook.statusCode, 503);

      // 3) CLICK_SECRET_KEY sozlanganda haqiqiy MD5 imzoli webhook Backend da to'lovni tasdiqlab PRO ga o'tkazadi
      process.env.CLICK_SECRET_KEY = "test_click_secret_key";
      const clickTransId = "777888";
      const serviceId = "101";
      const prepareId = "999";
      const amount = "39000";
      const action = "1";
      const signTime = "2026-11-16 11:30:00";
      const signStr = crypto
        .createHash("md5")
        .update(`${clickTransId}${serviceId}test_click_secret_key${invoysId}${prepareId}${amount}${action}${signTime}`)
        .digest("hex");
      const webhookBody = new URLSearchParams({
        click_trans_id: clickTransId,
        service_id: serviceId,
        merchant_trans_id: invoysId,
        merchant_prepare_id: prepareId,
        amount,
        action,
        sign_time: signTime,
        sign_string: signStr,
      }).toString();

      const okWebhook = await httpPost(`${base}/api/webhook/click`, webhookBody, "application/x-www-form-urlencoded");
      assert.strictEqual(okWebhook.statusCode, 200);
      assert.strictEqual(JSON.parse(okWebhook.body).error, 0);

      const statusRes2 = await httpGet(`${base}/api/tolov/holat?invoysId=${invoysId}`);
      assert.strictEqual(JSON.parse(statusRes2.body).tasdiqlandi, true);
      const dbAfter = JSON.parse(fs.readFileSync(dbPath, "utf8"));
      assert.strictEqual(dbAfter.joriyFoydalanuvchi.obunaTarifi, "O'quvchi PRO");
    } finally {
      if (prevSecret === undefined) delete process.env.CLICK_SECRET_KEY;
      else process.env.CLICK_SECRET_KEY = prevSecret;
      if (dbBackup !== null) {
        fs.writeFileSync(dbPath, dbBackup, "utf8");
      }
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // 12. Kun.uz uslubidagi 4 ta rubrika, 2 qavatli navigatsiya va 4 blokli Sozlamalar tekshiruvi
  await test("12. Kun.uz uslubidagi 4 ta rubrikali mundarija va tartibli Sozlamalar tuzilmasi", () => {
    assert.strictEqual(MundarijaVaNavigatsiya.rubrikalarGuruhi.length, 4);
    MundarijaVaNavigatsiya.sahifalarMundarijasi.forEach((s) => {
      assert.ok(s.kategoriyaId, `${s.id} uchun kategoriyaId bo'lishi kerak`);
      assert.ok(s.qisqaNomi, `${s.id} uchun qisqaNomi bo'lishi kerak`);
    });
    const rubrikaHtml = MundarijaVaNavigatsiya.kategoriyalanganMundarijaHtml();
    assert.ok(rubrikaHtml.includes("kun-rubric-block"));
    assert.ok(rubrikaHtml.includes("Sozlamalar_sahifasi.html"));

    const cssContent = fs.readFileSync(
      path.join(ROOT, "Dizayn_va_Uslublar", "Asosiy_Dizayn.css"),
      "utf8",
    );
    assert.ok(cssContent.includes(".kun-header-top"));
    assert.ok(cssContent.includes(".kun-category-bar"));
    assert.ok(cssContent.includes(".kun-settings-section-card"));
    assert.ok(typeof SozlamalarVaProfil.sozlamalarSahifasiniChizish === "function");

    // DOM simulyatsiyasi orqali navigatsiya va Sozlamalar 4 ta bloki chizilishini tekshirish
    const elements = {};
    const makeEl = (id) => ({
      id,
      innerHTML: "",
      textContent: "",
      value: "",
      style: {},
      classList: { add() {}, remove() {}, toggle() {} },
      addEventListener() {},
      querySelectorAll() { return []; },
      setAttribute() {},
      getAttribute() { return ""; },
    });
    [
      "umumiy-navigatsiya-joyi",
      "umumiy-pastki-qism-joyi",
      "sozlamalar-asosiy-konteyner",
      "profil-asosiy-konteyner",
      "qidiruv-va-mundarija-konteyner",
      "global-qidiruv-input",
      "global-qidiruv-tur",
      "global-qidiruv-natijalari",
      "noldan-urganish-konteyner",
      "test-yechish-konteyner",
      "sertifikat-asosiy-konteyner",
      "kirish-asosiy-konteyner",
      "admin-asosiy-konteyner",
      "olmoslar-dukoni-konteyner",
      "matematik-duel-konteyner",
      "grafik-va-formulalar-konteyner",
      "reyting-va-turnir-konteyner",
      "ustoz-sinfxonasi-konteyner",
      "xatolar-daftari-konteyner",
      "sertifikat-tekshirish-konteyner",
      "obuna-va-tolov-konteyner",
    ].forEach((id) => {
      elements[id] = makeEl(id);
    });
    global.document = {
      documentElement: { lang: "uz", setAttribute() {}, removeAttribute() {} },
      body: { classList: { add() {}, remove() {}, toggle() {} }, appendChild() {} },
      getElementById: (id) => elements[id] || makeEl(id),
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => makeEl("created"),
    };
    global.window = {
      location: { pathname: "/Sahifalar/Sozlamalar_sahifasi.html", search: "" },
      dispatchEvent() {},
      addEventListener() {},
    };

    try {
      MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
      assert.ok(elements["umumiy-navigatsiya-joyi"].innerHTML.includes("kun-header-top"));
      assert.ok(elements["umumiy-navigatsiya-joyi"].innerHTML.includes("kun-category-bar"));
      assert.ok(elements["umumiy-navigatsiya-joyi"].innerHTML.includes("kun-settings-top-btn"));
      assert.ok(elements["umumiy-navigatsiya-joyi"].innerHTML.includes("kun-rubric-sibling-pills"));

      // Rus va Ingliz tilida yuqori menyu, rubrikalar va pastki yaratuvchi blokini tekshirish
      TilVaTarjimalar.tilniOzgartirish("ru");
      MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
      assert.ok(elements["umumiy-navigatsiya-joyi"].innerHTML.includes("Настройки"));
      assert.ok(elements["umumiy-navigatsiya-joyi"].innerHTML.includes("Магазин Алмазов"));
      assert.ok(elements["umumiy-pastki-qism-joyi"].innerHTML.includes("Основатель и главный разработчик:"));
      assert.ok(elements["umumiy-pastki-qism-joyi"].innerHTML.includes("@BekCoderX01"));

      TilVaTarjimalar.tilniOzgartirish("en");
      MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
      assert.ok(elements["umumiy-navigatsiya-joyi"].innerHTML.includes("Settings"));
      assert.ok(elements["umumiy-navigatsiya-joyi"].innerHTML.includes("Diamond Shop"));
      assert.ok(elements["umumiy-pastki-qism-joyi"].innerHTML.includes("Founder & Lead Developer:"));

      TilVaTarjimalar.tilniOzgartirish("uz");
      MundarijaVaNavigatsiya.navigatsiyaniChizish("settings");
      assert.ok(elements["umumiy-pastki-qism-joyi"].innerHTML.includes("Sayt asoschisi va Bosh dasturchisi:"));
      assert.ok(elements["umumiy-pastki-qism-joyi"].innerHTML.includes("To'ychiyev Otabek"));
      assert.ok(elements["umumiy-pastki-qism-joyi"].innerHTML.includes("https://github.com/BekCoderX01"));
      assert.ok(elements["umumiy-pastki-qism-joyi"].innerHTML.includes("https://t.me/Tuychiyev_c"));
      assert.ok(elements["umumiy-pastki-qism-joyi"].innerHTML.includes("https://instagram.com/tuychiyev_2009"));

      SozlamalarVaProfil.sozlamalarSahifasiniChizish();
      assert.ok(elements["sozlamalar-asosiy-konteyner"].innerHTML.includes("settings-sec-theme"));
      assert.ok(elements["sozlamalar-asosiy-konteyner"].innerHTML.includes("settings-sec-lang"));
      assert.ok(elements["sozlamalar-asosiy-konteyner"].innerHTML.includes("settings-sec-avatar"));
      assert.ok(elements["sozlamalar-asosiy-konteyner"].innerHTML.includes("settings-sec-profile"));

      SozlamalarVaProfil.profilSahifasiniChizish();
      assert.ok(elements["profil-asosiy-konteyner"].innerHTML.includes("Olmoslar To'planish Tarixi"));

      QidiruvBulimi.sahifaniIshgaTushirish();
      assert.ok(elements["qidiruv-va-mundarija-konteyner"].innerHTML.includes("kun-rubric-block"));

      // Qolgan barcha 12 ta bo'limning Kun.uz uslubida chizilishini tekshirish
      NoldanUrganishBulimi.sahifaniIshgaTushirish();
      assert.ok(elements["noldan-urganish-konteyner"].innerHTML.includes("kun-settings-section-card"));

      TestBulimi.sahifaniIshgaTushirish();
      assert.ok(elements["test-yechish-konteyner"].innerHTML.includes("kun-settings-section-card"));

      SertifikatBulimi.sahifaniIshgaTushirish();
      assert.ok(elements["sertifikat-asosiy-konteyner"].innerHTML.includes("kun-settings-section-card"));

      KirishVaRoyxatdanUtish.sahifaniIshgaTushirish();
      assert.ok(elements["kirish-asosiy-konteyner"].innerHTML.includes("kun-settings-section-card"));

      AdminPaneli.sahifaniIshgaTushirish();
      assert.ok(elements["admin-asosiy-konteyner"].innerHTML.includes("kun-settings-section-card"));
      assert.ok(elements["admin-asosiy-konteyner"].innerHTML.includes("PRO Obuna To'lovlarini Tasdiqlash"));

      OlmoslarDukoniMantiqi.sahifaniIshgaTushirish();
      assert.ok(elements["olmoslar-dukoni-konteyner"].innerHTML.includes("kun-page-banner"));

      MatematikDuelMantiqi.holat = "kutish";
      MatematikDuelMantiqi.sahifaniIshgaTushirish();
      assert.ok(elements["matematik-duel-konteyner"].innerHTML.includes("kun-page-banner"));

      GrafikVaFormulalarMantiqi.sahifaniIshgaTushirish();
      assert.ok(elements["grafik-va-formulalar-konteyner"].innerHTML.includes("kun-settings-section-card"));

      KunlikZanjirVaTurnirMantiqi.sahifaniIshgaTushirish();
      assert.ok(elements["reyting-va-turnir-konteyner"].innerHTML.includes("kun-page-banner"));

      UstozSinfxonasiMantiqi.sahifaniIshgaTushirish();
      assert.ok(elements["ustoz-sinfxonasi-konteyner"].innerHTML.includes("kun-page-banner"));

      XatolarDaftariMantiqi.sahifaniIshgaTushirish();
      assert.ok(elements["xatolar-daftari-konteyner"].innerHTML.includes("kun-page-banner"));

      SertifikatTekshirishMantiqi.sahifaniIshgaTushirish();
      assert.ok(elements["sertifikat-tekshirish-konteyner"].innerHTML.includes("kun-settings-section-card"));

      ObunaVaTolovMantiqi.kassaniOchish("plan_student_pro");
      ObunaVaTolovMantiqi.sahifaniIshgaTushirish();
      assert.ok(elements["obuna-va-tolov-konteyner"].innerHTML.includes("kun-page-banner"));
      assert.ok(elements["obuna-va-tolov-konteyner"].innerHTML.includes("tolov-kassa-bloki"));
      assert.ok(elements["obuna-va-tolov-konteyner"].innerHTML.includes("9860 1201 7157 4847"));
      assert.ok(elements["obuna-va-tolov-konteyner"].innerHTML.includes("OTABEK TOYCHIYEV"));
      assert.ok(elements["obuna-va-tolov-konteyner"].innerHTML.includes("HUMO"));
      assert.ok(elements["obuna-va-tolov-konteyner"].innerHTML.includes("pay-ilova-nomi"));
    } finally {
      if (typeof OlmoslarVaVaqtTizimi.kunlikTaymerniToxtatish === "function") {
        OlmoslarVaVaqtTizimi.kunlikTaymerniToxtatish();
      }
      delete global.document;
      delete global.window;
    }
  });

  console.log(
    `\n🎉 Jami ${otdi} ta avtomatlashtirilgan kompleks test muvaffaqiyatli o'tdi!`,
  );
})();
