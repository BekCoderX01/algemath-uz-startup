# ==========================================================================
# FAYL NOMI: Server_Asosiy.py
# VAZIFASI: Loyihaning muqobil Python Backend Serveri.
#           Dasturchi hohlasa Node.js (node Server_Asosiy.js), hohlasa
#           Python (python Server_Asosiy.py) orqali serverni ko'tarishi mumkin.
# ==========================================================================

import http.server
import socketserver
import json
import os

PORT = int(os.environ.get("PORT", 3000))
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(ROOT_DIR, "Malumotlar_Bazasi", "Baza_Malumotlari.json")


class AlgeMathServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def do_GET(self):
        if self.path == "/api/holat":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            if os.path.exists(DB_FILE):
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    self.wfile.write(f.read().encode("utf-8"))
            else:
                self.wfile.write(json.dumps({"status": "ok"}).encode("utf-8"))
            return
        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/sinxronlash":
            uzunlik = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(uzunlik).decode("utf-8")
            try:
                data = json.loads(body or "{}")
                os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
                mavjud = {}
                if os.path.exists(DB_FILE):
                    try:
                        with open(DB_FILE, "r", encoding="utf-8") as rf:
                            mavjud = json.load(rf) or {}
                    except Exception:
                        mavjud = {}
                mavjud.update(data)
                with open(DB_FILE, "w", encoding="utf-8") as f:
                    json.dump(mavjud, f, ensure_ascii=False, indent=2)
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"muvaffaqiyat": True}).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"muvaffaqiyat": False, "xato": str(e)}).encode("utf-8"))
            return
        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), AlgeMathServerHandler) as httpd:
        print("=============================================================")
        print(f"🚀 AlgeMath UZ Python Serveri ishga tushdi: http://localhost:{PORT}")
        print("=============================================================")
        httpd.serve_forever()
