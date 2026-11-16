/* ==========================================================================
   FAYL NOMI: Server_Asosiy.js
   VAZIFASI: Loyihaning asosiy Node.js Backend Serveri.
             - Faqat ruxsat etilgan ommaviy frontend sahifa va aktivlarni uzatadi
               (.env, .git, Malumotlar_Bazasi va server fayllarini yopadi);
             - /api/holat va /api/sinxronlash nuqtalarida maxfiy admin va
               to'lov ma'lumotlarini oddiy foydalanuvchilardan himoyalaydi;
             - /api/admin/* nuqtalari orqali ADMIN_SECRET asosida haqiqiy
               Admin sessiyasi va boshqaruvini ta'minlaydi;
             - /api/tolov/* hamda /api/webhook/click, /api/webhook/payme
               nuqtalari orqali PRO obuna to'lovlarini tekshiradi.
   ISHGA TUSHIRISH: node Server_Asosiy.js
   ========================================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT_DIR = __dirname;
const DB_FILE = path.join(ROOT_DIR, "Malumotlar_Bazasi", "Baza_Malumotlari.json");
const ADMIN_SESSION_TTL_MS = 4 * 60 * 60 * 1000;

function envFayliniYuklash() {
  const envYol = path.join(ROOT_DIR, ".env");
  if (!fs.existsSync(envYol)) return;
  try {
    const qatorlar = fs.readFileSync(envYol, "utf8").split(/\r?\n/);
    for (const qator of qatorlar) {
      const toza = qator.trim();
      if (!toza || toza.startsWith("#")) continue;
      const eqIdx = toza.indexOf("=");
      if (eqIdx <= 0) continue;
      const kalit = toza.slice(0, eqIdx).trim();
      let qiymat = toza.slice(eqIdx + 1).trim();
      if (
        (qiymat.startsWith('"') && qiymat.endsWith('"')) ||
        (qiymat.startsWith("'") && qiymat.endsWith("'"))
      ) {
        qiymat = qiymat.slice(1, -1);
      }
      if (kalit && !(kalit in process.env)) {
        process.env[kalit] = qiymat;
      }
    }
  } catch (e) {}
}

envFayliniYuklash();

const PORT = process.env.PORT || 3000;

const TARIF_QOIDALARI = {
  plan_student_pro: { nomi: "O'quvchi PRO", sarlavha: "🚀 O'quvchi PRO (Eng Ommabop)", summaSom: 39000, summaMatn: "39,000 so'm / oy", bonusOlmos: 50 },
  plan_teacher_pro: { nomi: "Ustoz Ekspert PRO", sarlavha: "👑 Ustoz va Repetitor Ekspert PRO", summaSom: 69000, summaMatn: "69,000 so'm / oy", bonusOlmos: 100 }
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

const RUXSAT_ETILGAN_STATIK_PAPKALAR = [
  "Sahifalar/",
  "Dastur_Kodlari_JS/",
  "Dizayn_va_Uslublar/",
  "1_Olmoslar_Dukoni_Bulimi/",
  "2_Matematik_Duel_Bulimi/",
  "3_Grafik_va_Formulalar_Bulimi/",
  "4_Kunlik_Zanjir_va_Turnir_Bulimi/",
  "5_Ustoz_Sinfxonasi_Bulimi/",
  "6_Xatolar_Daftari_Bulimi/",
  "7_Sertifikat_Tekshirish_Bulimi/",
  "8_Obuna_va_Tolov_Bulimi/"
];

const RUXSAT_ETILGAN_KENGAYTMALAR = new Set([
  ".html", ".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".ico"
]);

function ruxsatEtilganStatikYolmi(pathname) {
  const nisbiy = String(pathname || "").replace(/^\/+/, "").replace(/\\/g, "/");
  if (!nisbiy) return false;
  const qismlar = nisbiy.split("/");
  if (qismlar.some(q => !q || q === ".." || q.startsWith("."))) {
    return false;
  }
  const ext = path.extname(nisbiy).toLowerCase();
  if (!RUXSAT_ETILGAN_KENGAYTMALAR.has(ext)) {
    return false;
  }
  if (nisbiy === "index.html") {
    return true;
  }
  return RUXSAT_ETILGAN_STATIK_PAPKALAR.some(p => nisbiy.startsWith(p));
}

function xavfsizTaqqoslash(a, b) {
  const s1 = String(a || "");
  const s2 = String(b || "");
  if (!s1 || !s2) return false;
  const b1 = Buffer.from(s1, "utf8");
  const b2 = Buffer.from(s2, "utf8");
  if (b1.length !== b2.length) return false;
  return crypto.timingSafeEqual(b1, b2);
}

function cookieOlish(req, nomi) {
  const raw = req.headers && req.headers.cookie;
  if (!raw) return "";
  for (const qism of raw.split(";")) {
    const idx = qism.indexOf("=");
    if (idx <= 0) continue;
    const k = qism.slice(0, idx).trim();
    if (k === nomi) {
      return decodeURIComponent(qism.slice(idx + 1).trim());
    }
  }
  return "";
}

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

function jsonJavob(res, status, obyekt, qoshimchaHeaders) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...(qoshimchaHeaders || {})
  });
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

function ommaviyUserTozalash(u) {
  if (!u || typeof u !== "object") return null;
  return {
    id: u.id,
    ism: u.ism,
    familiya: u.familiya,
    rol: u.rol === "Ustoz" ? "Ustoz" : "O'quvchi",
    jins: u.jins,
    avatar: u.avatar,
    avatarRasmUrl: u.avatarRasmUrl || "",
    viloyat: u.viloyat,
    tanlanganDaraja: u.tanlanganDaraja,
    faolUnvon: u.faolUnvon,
    faolRamka: u.faolRamka,
    kunlikZanjirSoni: u.kunlikZanjirSoni,
    olmoslar: u.olmoslar,
    obunaTarifi: u.obunaTarifi
  };
}

function ommaviyHolatniTozalash(baza) {
  if (!baza || typeof baza !== "object") return { status: "ok" };
  const royxat = Array.isArray(baza.foydalanuvchilarRoyxati)
    ? baza.foydalanuvchilarRoyxati
        .filter(u => u && u.rol !== "Admin")
        .map(ommaviyUserTozalash)
        .filter(Boolean)
    : [];

  let joriy = null;
  if (baza.joriyFoydalanuvchi && typeof baza.joriyFoydalanuvchi === "object" && baza.joriyFoydalanuvchi.rol !== "Admin") {
    joriy = ommaviyUserTozalash(baza.joriyFoydalanuvchi);
  }

  return {
    loyihaNomi: baza.loyihaNomi,
    versiya: baza.versiya,
    joriyFoydalanuvchi: joriy,
    tungiRejim: Boolean(baza.tungiRejim),
    til: baza.til || "uz",
    bugungiIshlanganSekundlar: baza.bugungiIshlanganSekundlar || 0,
    oxirgiVaqtSana: baza.oxirgiVaqtSana || "",
    foydalanuvchilarRoyxati: royxat,
    qoshimchaAdminSavollar: Array.isArray(baza.qoshimchaAdminSavollar) ? baza.qoshimchaAdminSavollar : [],
    berilganSertifikatlarArxivi: Array.isArray(baza.berilganSertifikatlarArxivi) ? baza.berilganSertifikatlarArxivi : [],
    ustozSinfxonalari: Array.isArray(baza.ustozSinfxonalari) ? baza.ustozSinfxonalari : [],
    tolovRekvizitlari: baza.tolovRekvizitlari || {}
  };
}

function kartaYokiTelniMaskalash(qiymat) {
  const matn = String(qiymat || "").trim();
  const raqamlar = matn.replace(/\D/g, "");
  if (raqamlar.length >= 4) {
    return "****" + raqamlar.slice(-4);
  }
  return "****";
}

function ommaviyTolovSoroviniTozalash(s) {
  if (!s || typeof s !== "object") return null;
  return {
    invoysId: s.invoysId,
    foydalanuvchiId: s.foydalanuvchiId,
    tarifId: s.tarifId,
    tarifNomi: s.tarifNomi,
    tarifSarlavha: s.tarifSarlavha,
    tolovUsuli: s.tolovUsuli,
    summa: s.summa,
    summaSom: s.summaSom,
    kartaYokiTel: kartaYokiTelniMaskalash(s.kartaYokiTel),
    holat: s.holat,
    radSababi: s.radSababi,
    yaratilganSana: s.yaratilganSana,
    tasdiqlanganSana: s.tasdiqlanganSana,
    chek: s.chek
  };
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
  const adminSessiyaXaritasi = new Map();

  function adminSessiyasiniTekshirish(req) {
    const envSecret = process.env.ADMIN_SECRET;
    const headerSecret = req.headers["x-admin-secret"];
    if (envSecret && headerSecret && xavfsizTaqqoslash(headerSecret, envSecret)) {
      return { ruxsat: true, usul: "secret" };
    }

    const token = String(req.headers["x-admin-token"] || cookieOlish(req, "algemath_admin_session") || "").trim();
    if (token && adminSessiyaXaritasi.has(token)) {
      const sessiya = adminSessiyaXaritasi.get(token);
      if (sessiya && sessiya.muddat > Date.now()) {
        return { ruxsat: true, usul: "session", token };
      }
      adminSessiyaXaritasi.delete(token);
    }

    return {
      ruxsat: false,
      sozlanmagan: !envSecret,
      status: !envSecret ? 503 : 403,
      xabar: !envSecret
        ? "Admin maxfiy kaliti (ADMIN_SECRET) serverda sozlanmagan."
        : "Admin ruxsati (sessiya yoki x-admin-secret) talab qilinadi."
    };
  }

  return http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. ADMIN AUTH VA ADMIN API NUQTALARI
    if (pathname === "/api/admin/kirish" && req.method === "POST") {
      const envSecret = process.env.ADMIN_SECRET;
      if (!envSecret) {
        return jsonJavob(res, 503, {
          muvaffaqiyat: false,
          xabar: "Admin maxfiy kaliti (ADMIN_SECRET) serverda (.env) sozlanmagan."
        });
      }
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: err.message });
        try {
          const d = JSON.parse(body || "{}");
          const kalit = d.adminKalit || req.headers["x-admin-secret"] || "";
          if (!xavfsizTaqqoslash(kalit, envSecret)) {
            return jsonJavob(res, 403, { muvaffaqiyat: false, xabar: "Maxfiy admin kaliti noto'g'ri!" });
          }
          const token = crypto.randomBytes(32).toString("hex");
          adminSessiyaXaritasi.set(token, { yaratilgan: Date.now(), muddat: Date.now() + ADMIN_SESSION_TTL_MS });
          return jsonJavob(
            res,
            200,
            {
              muvaffaqiyat: true,
              adminToken: token,
              admin: { ism: "Bosh", familiya: "Administrator" }
            },
            {
              "Set-Cookie": `algemath_admin_session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${Math.floor(ADMIN_SESSION_TTL_MS / 1000)}`
            }
          );
        } catch (parseErr) {
          return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: parseErr.message });
        }
      });
      return;
    }

    if (pathname === "/api/admin/chiqish" && req.method === "POST") {
      const token = String(req.headers["x-admin-token"] || cookieOlish(req, "algemath_admin_session") || "").trim();
      if (token) adminSessiyaXaritasi.delete(token);
      return jsonJavob(
        res,
        200,
        { muvaffaqiyat: true },
        { "Set-Cookie": "algemath_admin_session=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0" }
      );
    }

    if (pathname === "/api/admin/tekshir" && req.method === "GET") {
      const tekshir = adminSessiyasiniTekshirish(req);
      return jsonJavob(res, 200, { muvaffaqiyat: true, admin: tekshir.ruxsat });
    }

    if (pathname === "/api/admin/holat" && req.method === "GET") {
      const tekshir = adminSessiyasiniTekshirish(req);
      if (!tekshir.ruxsat) {
        return jsonJavob(res, tekshir.status, { muvaffaqiyat: false, xabar: tekshir.xabar });
      }
      return jsonJavob(res, 200, bazaniOqish());
    }

    if (pathname === "/api/admin/savol-qoshish" && req.method === "POST") {
      const tekshir = adminSessiyasiniTekshirish(req);
      if (!tekshir.ruxsat) {
        return jsonJavob(res, tekshir.status, { muvaffaqiyat: false, xabar: tekshir.xabar });
      }
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: err.message });
        try {
          const d = JSON.parse(body || "{}");
          const savol = String(d.savol || "").trim();
          const variantlar = Array.isArray(d.variantlar) ? d.variantlar.map(v => String(v || "").trim()) : [];
          if (!savol || variantlar.length < 2) {
            return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: "Savol va variantlar to'liq emas." });
          }
          const daraja = ["C", "C+", "B", "B+", "A", "A+"].includes(d.daraja) ? d.daraja : "B";
          const yangiSavol = {
            id: d.id || ("admin_q_" + Date.now()),
            daraja,
            manba: `Admin savoli (${daraja})`,
            savol,
            variantlar,
            togriIndex: Math.max(0, Math.min(3, Number(d.togriIndex) || 0))
          };
          const baza = bazaniOqish();
          if (!Array.isArray(baza.qoshimchaAdminSavollar)) baza.qoshimchaAdminSavollar = [];
          baza.qoshimchaAdminSavollar.unshift(yangiSavol);
          bazaniYozish(baza);
          return jsonJavob(res, 200, { muvaffaqiyat: true, savol: yangiSavol });
        } catch (parseErr) {
          return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: parseErr.message });
        }
      });
      return;
    }

    if (pathname === "/api/admin/olmos-berish" && req.method === "POST") {
      const tekshir = adminSessiyasiniTekshirish(req);
      if (!tekshir.ruxsat) {
        return jsonJavob(res, tekshir.status, { muvaffaqiyat: false, xabar: tekshir.xabar });
      }
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: err.message });
        try {
          const d = JSON.parse(body || "{}");
          const userId = String(d.foydalanuvchiId || "").trim();
          const miqdor = Math.max(1, Math.min(1000, Math.round(Number(d.miqdor) || 10)));
          const baza = bazaniOqish();
          const royxat = Array.isArray(baza.foydalanuvchilarRoyxati) ? baza.foydalanuvchilarRoyxati : [];
          const user = royxat.find(u => u.id === userId);
          if (!user) return jsonJavob(res, 404, { muvaffaqiyat: false, xabar: "Foydalanuvchi topilmadi." });
          user.olmoslar = (user.olmoslar || 0) + miqdor;
          if (baza.joriyFoydalanuvchi && baza.joriyFoydalanuvchi.id === userId) {
            baza.joriyFoydalanuvchi.olmoslar = user.olmoslar;
          }
          bazaniYozish(baza);
          return jsonJavob(res, 200, { muvaffaqiyat: true, olmoslar: user.olmoslar });
        } catch (parseErr) {
          return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: parseErr.message });
        }
      });
      return;
    }

    if (pathname === "/api/admin/rekvizit" && req.method === "POST") {
      const tekshir = adminSessiyasiniTekshirish(req);
      if (!tekshir.ruxsat) {
        return jsonJavob(res, tekshir.status, { muvaffaqiyat: false, xabar: tekshir.xabar });
      }
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: err.message });
        try {
          const d = JSON.parse(body || "{}");
          const baza = bazaniOqish();
          baza.tolovRekvizitlari = {
            ...(baza.tolovRekvizitlari || {}),
            kartaTuri: String(d.kartaTuri || "HUMO").trim(),
            kartaRaqami: String(d.kartaRaqami || "9860 1201 7157 4847").trim(),
            qabulQiluvchi: String(d.qabulQiluvchi || "OTABEK TOYCHIYEV").trim()
          };
          bazaniYozish(baza);
          return jsonJavob(res, 200, { muvaffaqiyat: true, tolovRekvizitlari: baza.tolovRekvizitlari });
        } catch (parseErr) {
          return jsonJavob(res, 400, { muvaffaqiyat: false, xabar: parseErr.message });
        }
      });
      return;
    }

    // 2. REST API: Ommaviy holatni olish (maxfiy admin/to'lov ma'lumotlarisiz!)
    if (pathname === "/api/holat" && req.method === "GET") {
      try {
        const baza = bazaniOqish();
        return jsonJavob(res, 200, ommaviyHolatniTozalash(baza));
      } catch (err) {
        jsonJavob(res, 500, { xato: err.message });
      }
      return;
    }

    // 3. REST API: Foydalanuvchi va baza ma'lumotlarini xavfsiz sinxronlash
    if (pathname === "/api/sinxronlash" && req.method === "POST") {
      const isAdmin = adminSessiyasiniTekshirish(req).ruxsat;
      sorovTanasiOqish(req, (err, body) => {
        if (err) return jsonJavob(res, 400, { muvaffaqiyat: false, xato: err.message });
        try {
          const parsed = JSON.parse(body || "{}");
          const mavjud = bazaniOqish();
          if (isAdmin) {
            const birlashgan = { ...mavjud, ...parsed };
            bazaniYozish(birlashgan);
            return jsonJavob(res, 200, { muvaffaqiyat: true });
          }

          // Oddiy foydalanuvchilar admin maydonlarini (tolovSorovlari, rekvizit, savollar, admin roli) o'zgartira olmaydi
          const birlashgan = { ...mavjud };
          if (typeof parsed.tungiRejim === "boolean") birlashgan.tungiRejim = parsed.tungiRejim;
          if (typeof parsed.til === "string" && ["uz", "ru", "en"].includes(parsed.til)) birlashgan.til = parsed.til;
          if (typeof parsed.bugungiIshlanganSekundlar === "number") birlashgan.bugungiIshlanganSekundlar = parsed.bugungiIshlanganSekundlar;
          if (typeof parsed.oxirgiVaqtSana === "string") birlashgan.oxirgiVaqtSana = parsed.oxirgiVaqtSana;
          if (Array.isArray(parsed.ustozSinfxonalari)) birlashgan.ustozSinfxonalari = parsed.ustozSinfxonalari;
          if (Array.isArray(parsed.berilganSertifikatlarArxivi)) birlashgan.berilganSertifikatlarArxivi = parsed.berilganSertifikatlarArxivi;

          if (parsed.joriyFoydalanuvchi && typeof parsed.joriyFoydalanuvchi === "object") {
            const joriy = { ...parsed.joriyFoydalanuvchi };
            if (joriy.rol === "Admin") joriy.rol = "O'quvchi";
            birlashgan.joriyFoydalanuvchi = joriy;

            if (!Array.isArray(birlashgan.foydalanuvchilarRoyxati)) {
              birlashgan.foydalanuvchilarRoyxati = [];
            }
            const idx = birlashgan.foydalanuvchilarRoyxati.findIndex(u => u && u.id === joriy.id && u.rol !== "Admin");
            if (idx >= 0) {
              birlashgan.foydalanuvchilarRoyxati[idx] = { ...birlashgan.foydalanuvchilarRoyxati[idx], ...joriy };
            } else if (joriy.id && joriy.id !== "user_admin") {
              birlashgan.foydalanuvchilarRoyxati.unshift(joriy);
            }
          }

          bazaniYozish(birlashgan);
          jsonJavob(res, 200, { muvaffaqiyat: true });
        } catch (parseErr) {
          jsonJavob(res, 400, { muvaffaqiyat: false, xato: parseErr.message });
        }
      });
      return;
    }

    // 4. BACKEND TO'LOV API: Yangi to'lov chekini ro'yxatdan o'tkazish (PRO hali yoqilmaydi)
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

          const invoysId = d.invoysId || ("INV-UZ-" + Math.floor(100000 + Math.random() * 900000));
          const txId = String(d.tranzaksiyaId || invoysId).trim().toUpperCase();

          const baza = bazaniOqish();
          if (!Array.isArray(baza.tolovSorovlari)) baza.tolovSorovlari = [];
          if (!Array.isArray(baza.ishlatilganTranzaksiyalar)) baza.ishlatilganTranzaksiyalar = [];

          const sorov = {
            invoysId,
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
            sorov: ommaviyTolovSoroviniTozalash(sorov),
            xabar: `⏳ To'lov so'rovi (${sorov.invoysId}) Backend da ro'yxatga olindi. Tasdiqlangach PRO avtomatik ochiladi.`
          });
        } catch (parseErr) {
          jsonJavob(res, 400, { muvaffaqiyat: false, xabar: parseErr.message });
        }
      });
      return;
    }

    // 5. BACKEND TO'LOV API: Foydalanuvchi yoki invoys to'lov holatini avtomatik tekshirish
    if (pathname === "/api/tolov/holat" && req.method === "GET") {
      const isAdmin = adminSessiyasiniTekshirish(req).ruxsat;
      const invoysId = parsedUrl.searchParams.get("invoysId");
      const userId = parsedUrl.searchParams.get("foydalanuvchiId");

      if (!isAdmin && !invoysId && !userId) {
        return jsonJavob(res, 403, {
          muvaffaqiyat: false,
          xabar: "Ruxsat yo'q: faqat shaxsiy invoysId yoki foydalanuvchiId bo'yicha tekshirish mumkin."
        });
      }

      const baza = bazaniOqish();
      const sorovlar = baza.tolovSorovlari || [];

      if (invoysId) {
        const sorov = sorovlar.find(s => s.invoysId === invoysId);
        if (!sorov) return jsonJavob(res, 404, { muvaffaqiyat: false, xabar: "Invoys topilmadi" });
        return jsonJavob(res, 200, {
          muvaffaqiyat: true,
          tasdiqlandi: sorov.holat === "tasdiqlandi",
          holat: sorov.holat,
          sorov: isAdmin ? sorov : ommaviyTolovSoroviniTozalash(sorov)
        });
      }

      const foydalanuvchiSorovlari = userId
        ? sorovlar.filter(s => s.foydalanuvchiId === userId)
        : sorovlar;
      const natijaSorovlar = isAdmin
        ? foydalanuvchiSorovlari
        : foydalanuvchiSorovlari.map(ommaviyTolovSoroviniTozalash);
      const tasdiqlangan = natijaSorovlar.find(s => s.holat === "tasdiqlandi") || null;
      return jsonJavob(res, 200, {
        muvaffaqiyat: true,
        tasdiqlandi: Boolean(tasdiqlangan),
        sorovlar: natijaSorovlar,
        oxirgiTasdiqlangan: tasdiqlangan
      });
    }

    // 6. BACKEND TO'LOV API: Admin tomonidan to'lovni tasdiqlash / rad etish (MAJBURIY ADMIN HIMOYASI)
    if (pathname === "/api/tolov/tasdiqlash" && req.method === "POST") {
      const tekshir = adminSessiyasiniTekshirish(req);
      if (!tekshir.ruxsat) {
        return jsonJavob(res, tekshir.status, { muvaffaqiyat: false, xabar: tekshir.xabar });
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
      const tekshir = adminSessiyasiniTekshirish(req);
      if (!tekshir.ruxsat) {
        return jsonJavob(res, tekshir.status, { muvaffaqiyat: false, xabar: tekshir.xabar });
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

    // 7. RASMIY CLICK MERCHANT WEBHOOK (Server .env da CLICK_SECRET_KEY sozlanganda avtomatik tasdiqlaydi)
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

    // 8. RASMIY PAYME MERCHANT WEBHOOK (Server .env da PAYME_SECRET_KEY sozlanganda avtomatik tasdiqlaydi)
    if (pathname === "/api/webhook/payme" && req.method === "POST") {
      const secret = process.env.PAYME_SECRET_KEY;
      if (!secret) {
        return jsonJavob(res, 503, { error: { code: -32504, message: "PAYME_SECRET_KEY serverda (.env) sozlanmagan" } });
      }
      const expectedAuth = "Basic " + Buffer.from(`Paycom:${secret}`).toString("base64");
      if (!xavfsizTaqqoslash(req.headers.authorization, expectedAuth)) {
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

    // 9. Statik sahifa va ommaviy fayllarni xavfsiz uzatish
    if (pathname === "/" || pathname === "") {
      pathname = "/index.html";
    }

    if (!ruxsatEtilganStatikYolmi(pathname)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Ruxsat yo'q");
      return;
    }

    const safePath = path.normalize(path.join(ROOT_DIR, pathname));
    if (!safePath.startsWith(ROOT_DIR + path.sep) && safePath !== path.join(ROOT_DIR, "index.html")) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
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
