/* ==========================================================================
   FAYL NOMI: Dizayn_va_Uslublar/Rasmlar_va_Belgilar.js
   VAZIFASI: Sayt dizaynini jonli va qiziqarli qilish uchun maxsus vektorli
             rasmlar (SVG illyustratsiyalar), davlat bayroqlari (O'zbekiston,
             Rossiya, AQSh/Amerika bayrog'i), olmos va sertifikat belgilari.
   ========================================================================== */

(function (global) {
  const RasmlarVaBelgilar = {
    // 1. Davlat bayroqlari (SVG + Emoji) — Windows va barcha brauzerlarda aniq ko'rinadi
    bayroqlar: {
      uz: `<span class="flag-svg-wrapper" title="O'zbekiston bayrog'i">
        <svg viewBox="0 0 36 24" width="36" height="24" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="8" y="0" fill="#0099B5"/>
          <rect width="36" height="0.8" y="7.6" fill="#CE1126"/>
          <rect width="36" height="8" y="8.4" fill="#FFFFFF"/>
          <rect width="36" height="0.8" y="16" fill="#CE1126"/>
          <rect width="36" height="7.2" y="16.8" fill="#1EB53A"/>
          <circle cx="7" cy="4" r="2.6" fill="#FFFFFF"/>
          <circle cx="8" cy="4" r="2.2" fill="#0099B5"/>
          <g fill="#FFFFFF">
            <circle cx="12" cy="2.2" r="0.45"/><circle cx="14" cy="2.2" r="0.45"/><circle cx="16" cy="2.2" r="0.45"/>
            <circle cx="11" cy="4" r="0.45"/><circle cx="13" cy="4" r="0.45"/><circle cx="15" cy="4" r="0.45"/><circle cx="17" cy="4" r="0.45"/>
            <circle cx="10" cy="5.8" r="0.45"/><circle cx="12" cy="5.8" r="0.45"/><circle cx="14" cy="5.8" r="0.45"/><circle cx="16" cy="5.8" r="0.45"/><circle cx="18" cy="5.8" r="0.45"/>
          </g>
        </svg>
      </span>`,

      ru: `<span class="flag-svg-wrapper" title="Rossiya bayrog'i">
        <svg viewBox="0 0 36 24" width="36" height="24" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="8" y="0" fill="#FFFFFF"/>
          <rect width="36" height="8" y="8" fill="#0039A6"/>
          <rect width="36" height="8" y="16" fill="#D52B1E"/>
        </svg>
      </span>`,

      en: `<span class="flag-svg-wrapper" title="Amerika (AQSh) bayrog'i">
        <svg viewBox="0 0 36 24" width="36" height="24" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="24" fill="#B22234"/>
          <rect width="36" height="1.85" y="1.85" fill="#FFFFFF"/>
          <rect width="36" height="1.85" y="5.55" fill="#FFFFFF"/>
          <rect width="36" height="1.85" y="9.25" fill="#FFFFFF"/>
          <rect width="36" height="1.85" y="12.95" fill="#FFFFFF"/>
          <rect width="36" height="1.85" y="16.65" fill="#FFFFFF"/>
          <rect width="36" height="1.85" y="20.35" fill="#FFFFFF"/>
          <rect width="15.5" height="12.95" x="0" y="0" fill="#3C3B6E"/>
          <g fill="#FFFFFF">
            <circle cx="2.5" cy="2.2" r="0.65"/><circle cx="5.5" cy="2.2" r="0.65"/><circle cx="8.5" cy="2.2" r="0.65"/><circle cx="11.5" cy="2.2" r="0.65"/>
            <circle cx="4" cy="4.3" r="0.65"/><circle cx="7" cy="4.3" r="0.65"/><circle cx="10" cy="4.3" r="0.65"/><circle cx="13" cy="4.3" r="0.65"/>
            <circle cx="2.5" cy="6.4" r="0.65"/><circle cx="5.5" cy="6.4" r="0.65"/><circle cx="8.5" cy="6.4" r="0.65"/><circle cx="11.5" cy="6.4" r="0.65"/>
            <circle cx="4" cy="8.5" r="0.65"/><circle cx="7" cy="8.5" r="0.65"/><circle cx="10" cy="8.5" r="0.65"/><circle cx="13" cy="8.5" r="0.65"/>
            <circle cx="2.5" cy="10.6" r="0.65"/><circle cx="5.5" cy="10.6" r="0.65"/><circle cx="8.5" cy="10.6" r="0.65"/><circle cx="11.5" cy="10.6" r="0.65"/>
          </g>
        </svg>
      </span>`
    },

    // 2. Asosiy sahifa uchun rang-barang Matematika va Algebra SVG illyustratsiyasi
    heroMatematikaRasmi: function () {
      return `
      <svg viewBox="0 0 420 290" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matematika va Algebra illyustratsiyasi">
        <defs>
          <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#e0e7ff" stop-opacity="0.9"/>
          </linearGradient>
          <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#2563eb"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#f59e0b"/>
          </linearGradient>
        </defs>
        <!-- Orqa fon doiralari -->
        <circle cx="330" cy="70" r="55" fill="#fbbf24" opacity="0.25"/>
        <circle cx="80" cy="220" r="65" fill="#34d399" opacity="0.25"/>
        <!-- Asosiy doska/ekran -->
        <rect x="45" y="25" width="330" height="220" rx="24" fill="url(#cardGrad1)" stroke="#ffffff" stroke-width="3"/>
        <!-- Koordinata tekisligi va parabola grafigi -->
        <line x1="75" y1="185" x2="255" y2="185" stroke="#94a3b8" stroke-width="2"/>
        <line x1="165" y1="55" x2="165" y2="215" stroke="#94a3b8" stroke-width="2"/>
        <path d="M 95 75 Q 165 235 235 75" fill="none" stroke="#4318ff" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="165" cy="155" r="6" fill="#ef4444"/>
        <!-- Formula kartochkasi -->
        <rect x="230" y="50" width="125" height="58" rx="14" fill="#4318ff"/>
        <text x="292" y="75" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="13">f(x) = ax² + bx + c</text>
        <text x="292" y="95" text-anchor="middle" fill="#a5b4fc" font-family="sans-serif" font-weight="700" font-size="11">D = b² - 4ac ≥ 0</text>
        <!-- A+ Milliy Sertifikat nishoni -->
        <rect x="240" y="125" width="115" height="90" rx="16" fill="url(#goldGrad)"/>
        <text x="297" y="165" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-weight="900" font-size="28">A+</text>
        <text x="297" y="188" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-weight="800" font-size="11">SERTIFIKAT</text>
        <text x="297" y="203" text-anchor="middle" fill="#92400e" font-family="sans-serif" font-weight="700" font-size="9">45 TA TEST</text>
        <!-- Suzib yuruvchi Olmos -->
        <polygon points="85,45 105,65 85,95 65,65" fill="url(#gemGrad)" stroke="#ffffff" stroke-width="2"/>
        <text x="85" y="115" text-anchor="middle" fill="#1e293b" font-family="sans-serif" font-weight="800" font-size="11">+5 💎 Kunlik</text>
        <!-- Pi va Ildiz belgilari -->
        <circle cx="95" cy="185" r="24" fill="#10b981"/>
        <text x="95" y="193" text-anchor="middle" fill="#ffffff" font-family="serif" font-weight="900" font-size="22">π</text>
      </svg>`;
    },

    // 3. Olmos SVG belgisi
    olmosBelgisi: function (size = 20) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
        <path d="M6 3H18L22 9L12 21L2 9L6 3Z" fill="url(#diamondIconGrad)" stroke="#0284c7" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M2 9H22M12 21L8 9L6 3M12 21L16 9L18 3" stroke="#e0f2fe" stroke-width="1.2"/>
        <defs>
          <linearGradient id="diamondIconGrad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
            <stop stop-color="#38bdf8"/>
            <stop offset="1" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
      </svg>`;
    },

    // 4. Tayyor chiroyli profil avatarlari (Foydalanuvchi rasm yuklashi yoki bulardan tanlashi mumkin)
    standartAvatarlar: [
      { id: "avatar_math_boy", label: "Al-Xorazmiy vorisi (Erkak)", gender: "Erkak", svg: "👨‍🎓" },
      { id: "avatar_math_girl", label: "Matematik malika (Ayol)", gender: "Ayol", svg: "👩‍🎓" },
      { id: "avatar_teacher_m", label: "Professor Ustoz (Erkak)", gender: "Erkak", svg: "👨‍🏫" },
      { id: "avatar_teacher_f", label: "Akademik Ustoz (Ayol)", gender: "Ayol", svg: "👩‍🏫" },
      { id: "avatar_genius", label: "Olimpiada chempioni", gender: "Erkak", svg: "🚀" },
      { id: "avatar_star", label: "Algebra yulduzi", gender: "Ayol", svg: "🌟" }
    ]
  };

  global.RasmlarVaBelgilar = RasmlarVaBelgilar;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = RasmlarVaBelgilar;
  }
})(typeof window !== "undefined" ? window : globalThis);
