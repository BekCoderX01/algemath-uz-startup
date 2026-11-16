/* ==========================================================================
   FAYL NOMI: Server_Asosiy.js
   VAZIFASI: Loyihaning asosiy Node.js Backend Serveri.
             - Barcha alohida sahifalar (Sahifalar/*.html, 1..8 modullar),
               JavaScript va CSS fayllarni brauzerga uzatadi;
             - /api/holat va /api/sinxronlash REST API nuqtalari orqali
               foydalanuvchi olmoslari, sertifikatlari va sozlamalarini
               Malumotlar_Bazasi/Baza_Malumotlari.json faylida saqlaydi;
             - /api/tolov/* hamda rasmiy /api/webhook/click, /api/webhook/payme
               nuqtalari orqali PRO obuna to'lovlarini Backend da tekshiradi
               va faqat tasdiqlangan to'lovdan keyingina PRO ni faollashtiradi.
   ISHGA TUSHIRISH: node Server_Asosiy.js
   ========================================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_FILE = path.join(ROOT_DIR, "Malumotlar_Bazasi", "Baza_Malumotlari.json");

const TARIF_QOIDALARI = {
  plan_student_pro: { nomi: "O'quvchi PRO", sarlavha: "🚀 O'quvchi PRO (Eng Ommabop)", summaSom: 39000, summaMatn: "39,000 so'm / oy", bonusOlmos: 50 },
  plan_teacher_pro: { nomi: "Ustoz Ekspert PRO", sarlavha: "👑 Ustoz va Repetitor Ekspert PRO", summaSom: 69000, summaMatn: "69,000 so'm / oy", bonusOlmos: 100 }
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon"
};

function bazaniOqish() {
  if (!fs.existsSync(DB_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8") || "{}");
  } catch (e) {
    return {};
  }
}

function bazaniYozish(baza) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(baza, null, 2), "utf8");
}

function jsonJavob(res, status, obyekt) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obyekt));
}

function sorovTanasiOqish(req, callback) {
  let body = "";
  let toxtatildi = false;
  req.on("data", chunk => {
    body += chunk;
    if (body.length > 5 * 1024 * 1024) {
      toxtatildi = true;
      req.destroy();
    }
  });
  req.on("end", () => {
    if (!toxtatildi) callback(null, body);
  });
  req.on("error", err => callback(err));
}

function serverdaTolovniTasdiqlash(baza, invoysId, manba = "Admin") {
  if (!Array.isArray(baza.tolovSorovlari)) baza.tolovSorovlari = [];
  if (!Array.isArray(baza.ishlatilganTranzaksiyalar)) baza.ishlatilganTranzaksiyalar = [];

  const sorov = baza.tolovSorovlari.find(s => s.invoysId === invoysId);
  if (!sorov) return { muvaffaqiyat: false, xabar: "To'lov so'rovi topilmadi." };
  if (sorov.holat === "tasdiqlandi") {
    return { muvaffaqiyat: true, allaqachon: true, sorov, xabar: "To'lov allaqachon tasdiqlangan." };
  }

  const tarif = TARIF_QOIDALARI[sorov.tarifId];
  if (!tarif) return { muvaffaqiyat: false, xabar: "Tarif topilmadi." };

  const txUpper = String(sorov.tranzaksiyaId || "").trim().toUpperCase();
  if (txUpper && !baza.ishlatilganTranzaksiyalar.includes(txUpper)) {
    baza.ishlatilganTranzaksiyalar.push(txUpper);
  }

  const tugash = new Date();
  tugash.setDate(tugash.getDate() + 30);
  const tugashSana = tugash.toISOString().slice(0, 10);
  const hozir = new Date().toISOString().replace("T", " ").slice(0, 16);

  const userYangila = (u) => {
    if (!u || u.id !== sorov.foydalanuvchiId) return u;
    const yangi = {
      ...u,
      obunaTarifi: tarif.nomi,
      obunaTugashSana: tugashSana,
      olmoslar: (u.olmoslar || 0) + tarif.bonusOlmos
    };
    if (!Array.isArray(yangi.olmoslarTarixi)) yangi.olmoslarTarixi = [];
    yangi.olmoslarTarixi.unshift({
      sana: hozir,
      miqdor: tarif.bonusOlmos,
      sabab: `${tarif.nomi} to'lov bonusi (+${tarif.bonusOlmos} 💎)`
    });
    return yangi;
  };

  if (Array.isArray(baza.foydalanuvchilarRoyxati)) {
    baza.foydalanuvchilarRoyxati = baza.foydalanuvchilarRoyxati.map(userYangila);
  }
  if (baza.joriyFoydalanuvchi && baza.joriyFoydalanuvchi.id === sorov.foydalanuvchiId) {
    baza.joriyFoydalanuvchi = userYangila(baza.joriyFoydalanuvchi);
  }

  sorov.holat = "tasdiqlandi";
  sorov.tasdiqlaganManba = manba;
  sorov.tasdiqlanganSana = hozir;
  sorov.chek = {
    chekId: "PAY-UZ-" + Math.floor(100000 + Math.random() * 900000),
    tarifNomi: tarif.sarlavha,
    tolovUsuli: sorov.tolovUsuli,
    tranzaksiyaId: txUpper,
    summa: tarif.summaMatn,
    sana: hozir,
    foydalanuvchi: sorov.foydalanuvchiIsmi
  };

  bazaniYozish(baza);
  return {
    muvaffaqiyat: true,
    sorov,
    chek: sorov.chek,
    xabar: `✅ Backend tasdiqladi: ${sorov.foydalanuvchiIsmi} uchun "${tarif.nomi}" yoqildi!`
  };
}

function createServerInstance() {
  return http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. REST API: Holatni olish
    if (pathname === "/api/holat" && req.method === "GET") {
      try {
        const data = fs.existsSync(DB_FILE)
          ? fs.readFileSync(DB_FILE, "utf8")
          : JSON.stringify({ status: "ok" });
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(data);
      } catch (err) {
        jsonJavob(res, 500, { xato: err.message });
      }
      return;
    }

    // 2. REST API: Foydalanuvchi va baza ma'lumotlarini sinxronlash
    if (pathname === "/api/sinxronlash" && req.method === "POST") {
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xato: err.message });
        try {
          const parsed = JSON.parse(body || "{}");
          const mavjud = bazaniOqish();
          const birlashgan = { ...mavjud, ...parsed };
          bazaniYozish(birlashgan);
          jsonJavob(res, 200, { muvaffaqiyat: true });
        } catch (parseErr) {
          jsonJavob(res, 400, { muvaffaqiyat: false, xato: parseErr.message });
        }
      });
      return;
    }

    // 3. BACKEND TO'LOV API: Yangi to'lov chekini ro'yxatdan o'tkazish (PRO hali yoqilmaydi)
    if (pathname === "/api/tolov/sorov" && req.method === "POST") {
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xato: err.message });
        try {
          const d = JSON.parse(body || "{}");
          const tarif = TARIF_QOIDALARI[d.tarifId];
          if (!tarif) return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: "Pullik PRO tarif tanlanmadi." });

          const manba = String(d.kartaYokiTel || "").trim();
          if ((manba.match(/\d/g) || []).length < 4) {
            return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: "Telefon raqam yoki karta oxirgi 4 raqami noto'g'ri." });
          }

          const txId = String(d.tranzaksiyaId || "").trim().toUpperCase();
          if (txId.length < 6 || !/^[A-Z0-9\-_]+$/.test(txId)) {
            return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: "Tranzaksiya ID kamida 6 ta belgidan iborat bo'lishi shart." });
          }

          const baza = bazaniOqish();
          if (!Array.isArray(baza.tolovSorovlari)) baza.tolovSorovlari = [];
          if (!Array.isArray(baza.ishlatilganTranzaksiyalar)) baza.ishlatilganTranzaksiyalar = [];

          const takror = baza.ishlatilganTranzaksiyalar.includes(txId) ||
            baza.tolovSorovlari.some(s => String(s.tranzaksiyaId).toUpperCase() === txId && s.holat !== "rad_etildi");
          if (takror) {
            return jsonJavob(res, 409, { muvaffaqiyat: false, xabar: "Bu tranzaksiya ID allaqachon ro'yxatdan o'tgan." });
          }

          const sorov = {
            invoysId: d.invoysId || ("INV-UZ-" + Math.floor(100000 + Math.random() * 900000)),
            foydalanuvchiId: d.foydalanuvchiId || (baza.joriyFoydalanuvchi && baza.joriyFoydalanuvchi.id) || "user_default_1",
            foydalanuvchiIsmi: d.foydalanuvchiIsmi || "Foydalanuvchi",
            tarifId: d.tarifId,
            tarifNomi: tarif.nomi,
            tarifSarlavha: tarif.sarlavha,
            tolovUsuli: d.tolovUsuli || "Istalgan ilova / Karta",
            summa: tarif.summaMatn,
            summaSom: tarif.summaSom,
            kartaYokiTel: manba,
            tranzaksiyaId: txId,
            holat: "kutilmoqda",
            yaratilganSana: new Date().toISOString().replace("T", " ").slice(0, 16)
          };

          baza.tolovSorovlari.unshift(sorov);
          bazaniYozish(baza);
          jsonJavob(res, 200, {
            muvaffaqiyat: true,
            kutilmoqda: true,
            sorov,
            xabar: `⏳ To'lov so'rovi (${sorov.invoysId}) Backend da ro'yxatga olindi. Tasdiqlangach PRO avtomatik ochiladi.`
          });
        } catch (parseErr) {
          jsonJavob(res, 400, { muvaffaqiyat: false, xabar: parseErr.message });
        }
      });
      return;
    }

    // 4. BACKEND TO'LOV API: Foydalanuvchi yoki invoys to'lov holatini avtomatik tekshirish
    if (pathname === "/api/tolov/holat" && req.method === "GET") {
      const invoysId = parsedUrl.searchParams.get("invoysId");
      const userId = parsedUrl.searchParams.get("foydalanuvchiId");
      const baza = bazaniOqish();
      const sorovlar = baza.tolovSorovlari || [];

      if (invoysId) {
        const sorov = sorovlar.find(s => s.invoysId === invoysId);
        if (!sorov) return jsonJavob(res, 404, { muvaffaqiyat: false, xabar: "Invoys topilmadi" });
        return jsonJavob(res, 200, {
          muvaffaqiyat: true,
          tasdiqlandi: sorov.holat === "tasdiqlandi",
          holat: sorov.holat,
          sorov
        });
      }

      const foydalanuvchiSorovlari = userId
        ? sorovlar.filter(s => s.foydalanuvchiId === userId)
        : sorovlar;
      const tasdiqlangan = foydalanuvchiSorovlari.find(s => s.holat === "tasdiqlandi") || null;
      return jsonJavob(res, 200, {
        muvaffaqiyat: true,
        tasdiqlandi: Boolean(tasdiqlangan),
        sorovlar: foydalanuvchiSorovlari,
        oxirgiTasdiqlangan: tasdiqlangan
      });
    }

    // 5. BACKEND TO'LOV API: Admin tomonidan to'lovni tasdiqlash / rad etish
    if (pathname === "/api/tolov/tasdiqlash" && req.method === "POST") {
      if (process.env.ADMIN_SECRET && req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
        return jsonJavob(res, 403, { muvaffaqiyat: false, xabar: "Admin ruxsati (x-admin-secret) noto'g'ri." });
      }
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: err.message });
        try {
          const d = JSON.parse(body || "{}");
          const baza = bazaniOqish();
          const natija = serverdaTolovniTasdiqlash(baza, d.invoysId, "Admin Backend");
          return jsonJavob(res, natija.muvaffaqiyat ? 200 : 400, natija);
        } catch (parseErr) {
          return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: parseErr.message });
        }
      });
      return;
    }

    if (pathname === "/api/tolov/rad-etish" && req.method === "POST") {
      if (process.env.ADMIN_SECRET && req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
        return jsonJavob(res, 403, { muvaffaqiyat: false, xabar: "Admin ruxsati (x-admin-secret) noto'g'ri." });
      }
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: err.message });
        try {
          const d = JSON.parse(body || "{}");
          const baza = bazaniOqish();
          const sorov = (baza.tolovSorovlari || []).find(s => s.invoysId === d.invoysId);
          if (!sorov) return jsonJavob(res, 404, { muvaffaqiyat: false, xabar: "So'rov topilmadi." });
          sorov.holat = "rad_etildi";
          sorov.radSababi = d.sabab || "To'lov hisobga tushmagani aniqlandi";
          sorov.tasdiqlanganSana = new Date().toISOString().replace("T", " ").slice(0, 16);
          bazaniYozish(baza);
          return jsonJavob(res, 200, { muvaffaqiyat: true, sorov });
        } catch (parseErr) {
          return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: parseErr.message });
        }
      });
      return;
    }

    // 6. RASMIY CLICK MERCHANT WEBHOOK (Server .env da CLICK_SECRET_KEY sozlanganda avtomatik tasdiqlaydi)
    if (pathname === "/api/webhook/click" && req.method === "POST") {
      const secret = process.env.CLICK_SECRET_KEY;
      if (!secret) {
        return jsonJavob(res, 503, { error: -8, error_note: "CLICK_SECRET_KEY serverda (.env) sozlanmagan" });
      }
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { error: -8, error_note: err.message });
        try {
          const params = Object.fromEntries(new URLSearchParams(body));
          const { click_trans_id, service_id, merchant_trans_id, merchant_prepare_id, amount, action, sign_time, sign_string } = params;
          const signPayload = `${click_trans_id || ""}${service_id || ""}${secret}${merchant_trans_id || ""}${action === "1" ? (merchant_prepare_id || "") : ""}${amount || ""}${action || ""}${sign_time || ""}`;
          const expectedSign = crypto.createHash("md5").update(signPayload).digest("hex");
          if (expectedSign !== sign_string) {
            return jsonJavob(res, 200, { error: -1, error_note: "SIGN CHECK FAILED!" });
          }

          const baza = bazaniOqish();
          const sorov = (baza.tolovSorovlari || []).find(s => s.invoysId === merchant_trans_id);
          if (!sorov) return jsonJavob(res, 200, { error: -5, error_note: "Order not found" });

          const tarif = TARIF_QOIDALARI[sorov.tarifId];
          if (!tarif || Number(amount) !== Number(tarif.summaSom)) {
            return jsonJavob(res, 200, { error: -2, error_note: "Incorrect parameter amount" });
          }

          if (action === "0") {
            return jsonJavob(res, 200, {
              click_trans_id,
              merchant_trans_id,
              merchant_prepare_id: Date.now(),
              error: 0,
              error_note: "Success"
            });
          }

          if (action === "1") {
            serverdaTolovniTasdiqlash(baza, merchant_trans_id, "Click Merchant Webhook");
            return jsonJavob(res, 200, {
              click_trans_id,
              merchant_trans_id,
              merchant_confirm_id: Date.now(),
              error: 0,
              error_note: "Success"
            });
          }
          return jsonJavob(res, 200, { error: -3, error_note: "Action not found" });
        } catch (e) {
          return jsonJavob(res, 400, { error: -8, error_note: e.message });
        }
      });
      return;
    }

    // 7. RASMIY PAYME MERCHANT WEBHOOK (Server .env da PAYME_SECRET_KEY sozlanganda avtomatik tasdiqlaydi)
    if (pathname === "/api/webhook/payme" && req.method === "POST") {
      const secret = process.env.PAYME_SECRET_KEY;
      if (!secret) {
        return jsonJavob(res, 503, { error: { code: -32504, message: "PAYME_SECRET_KEY serverda (.env) sozlanmagan" } });
      }
      const expectedAuth = "Basic " + Buffer.from(`Paycom:${secret}`).toString("base64");
      if (req.headers.authorization !== expectedAuth) {
        return jsonJavob(res, 200, { error: { code: -32504, message: "Unauthorized" } });
      }
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { error: { code: -32700, message: err.message } });
        try {
          const rpc = JSON.parse(body || "{}");
          const invoysId = rpc.params && rpc.params.account && rpc.params.account.invoys_id;
          const baza = bazaniOqish();
          const sorov = (baza.tolovSorovlari || []).find(s => s.invoysId === invoysId);
          if (!sorov) {
            return jsonJavob(res, 200, { id: rpc.id, error: { code: -31050, message: "Order not found" } });
          }
          const tarif = TARIF_QOIDALARI[sorov.tarifId];
          if (rpc.method === "CheckPerformTransaction") {
            if (!tarif || Number(rpc.params.amount) !== Number(tarif.summaSom) * 100) {
              return jsonJavob(res, 200, { id: rpc.id, error: { code: -31001, message: "Incorrect amount" } });
            }
            return jsonJavob(res, 200, { id: rpc.id, result: { allow: true } });
          }
          if (rpc.method === "PerformTransaction") {
            serverdaTolovniTasdiqlash(baza, invoysId, "Payme Merchant Webhook");
            return jsonJavob(res, 200, { id: rpc.id, result: { transaction: invoysId, perform_time: Date.now(), state: 2 } });
          }
          return jsonJavob(res, 200, { id: rpc.id, result: { allow: true } });
        } catch (e) {
          return jsonJavob(res, 200, { error: { code: -32700, message: e.message } });
        }
      });
      return;
    }

    // 8. Statik sahifa va fayllarni uzatish
    if (pathname === "/" || pathname === "") {
      pathname = "/index.html";
    }

    const safePath = path.normalize(path.join(ROOT_DIR, pathname));
    if (!safePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      res.end("Ruxsat yo'q");
      return;
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(safePath).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h1>404 - Sahifa topilmadi</h1><p><a href="/index.html">Asosiy sahifaga qaytish</a></p>`);
    }
  });
}

if (require.main === module) {
  const server = createServerInstance();
  server.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`🚀 AlgeMath UZ Startup serveri ishga tushdi!`);
    console.log(`🌐 Manzil: http://localhost:${PORT}`);
    console.log(`=============================================================`);
  });
}

module.exports = { createServerInstance };
