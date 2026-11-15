/* ==========================================================================
   FAYL NOMI: Server_Asosiy.js
   VAZIFASI: Loyihaning asosiy Node.js Backend Serveri.
             - Barcha alohida sahifalar (Sahifalar/*.html), JavaScript va CSS
               fayllarni brauzerga uzatadi;
             - /api/holat va /api/sinxronlash REST API nuqtalari orqali
               foydalanuvchi olmoslari, sertifikatlari va sozlamalarini
               Malumotlar_Bazasi/Baza_Malumotlari.json faylida saqlaydi.
   ISHGA TUSHIRISH: node Server_Asosiy.js
   ========================================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_FILE = path.join(ROOT_DIR, "Malumotlar_Bazasi", "Baza_Malumotlari.json");

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
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ xato: err.message }));
      }
      return;
    }

    // 2. REST API: Foydalanuvchi va baza ma'lumotlarini sinxronlash
    if (pathname === "/api/sinxronlash" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => {
        body += chunk;
        if (body.length > 5 * 1024 * 1024) req.destroy();
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(body || "{}");
          fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
          let mavjud = {};
          if (fs.existsSync(DB_FILE)) {
            try {
              mavjud = JSON.parse(fs.readFileSync(DB_FILE, "utf8") || "{}");
            } catch (e) {
              mavjud = {};
            }
          }
          const birlashgan = { ...mavjud, ...parsed };
          fs.writeFileSync(DB_FILE, JSON.stringify(birlashgan, null, 2), "utf8");
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ muvaffaqiyat: true }));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ muvaffaqiyat: false, xato: err.message }));
        }
      });
      return;
    }

    // 3. Statik sahifa va fayllarni uzatish
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
