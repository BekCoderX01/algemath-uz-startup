/* ==========================================================================
   FAYL NOMI: Dastur_Kodlari_JS/Matematika_Savollar_Bazasi.js
   VAZIFASI:
     1) Milliy Sertifikat imtihoni uchun 45 ta savol:
        - 15 ta Oson (lekin mantiqiy va o'ylantiradigan)
        - 15 ta O'rtacha (algebra, tenglamalar, funksiyalar, progressiyalar)
        - 15 ta Qiyin (parametrli tenglamalar, hosila, integral, logarifm, olimpiada)
     2) Matematikani 0 dan o'rganish bo'limi uchun C, C+, B, B+, A, A+ darajalar
        bo'yicha darsliklar va har bir daraja uchun 10 talik testlar (har bir
        test tagida aniq javobni aytmaydigan "Yordam / Memory tushuntirish" bilan).
     3) O'quvchi va Ustozlar uchun bilim darajasiga mos testlar bazasi.
   ========================================================================== */

(function (global) {
  // ========================================================================
  // 1. MILLIY SERTIFIKAT UCHUN 45 TALIK TEST BAZASI (15 Oson + 15 O'rtacha + 15 Qiyin)
  // ========================================================================
  const SERTIFIKAT_45_TEST = [
    // --- 1..15: OSON (LEKIN O'YLANTIRADIGAN MATEMATIK MISOLLAR) ---
    {
      id: "cert_1", tartib: 1, qiyinchilik: "oson", ball: 1.5, mavzu: "Sonlar nazariyasi",
      savol: "1) Agar a va b natural sonlar uchun a² - b² = 17 bo'lsa, a·b ko'paytmani toping.",
      variantlar: ["72", "68", "81", "64"],
      togriIndex: 0
    },
    {
      id: "cert_2", tartib: 2, qiyinchilik: "oson", ball: 1.5, mavzu: "Algebraik ifodalar",
      savol: "2) Agar x + (1/x) = 4 bo'lsa, x² + (1/x²) ifodaning qiymatini toping.",
      variantlar: ["16", "14", "12", "18"],
      togriIndex: 1
    },
    {
      id: "cert_3", tartib: 3, qiyinchilik: "oson", ball: 1.5, mavzu: "Foiz va proporsiya",
      savol: "3) Tovar narxi avval 20% ga oshirildi, so'ngra yangi narx 20% ga arzonlashtirildi. Boshlang'ich narxga nisbatan qanday o'zgardi?",
      variantlar: ["O'zgarmadi", "4% ga arzonlashdi", "4% ga qimmatlashdi", "2% ga arzonlashdi"],
      togriIndex: 1
    },
    {
      id: "cert_4", tartib: 4, qiyinchilik: "oson", ball: 1.5, mavzu: "Darajalar oxirgi raqami",
      savol: "4) 7²⁰²⁵ + 3²⁰²⁴ yig'indining oxirgi raqamini aniqlang.",
      variantlar: ["8", "0", "4", "6"],
      togriIndex: 0 // 7^2025 oxiri 7 (2025=4*506+1), 3^2024 oxiri 1 (2024=4*506). 7+1=8
    },
    {
      id: "cert_5", tartib: 5, qiyinchilik: "oson", ball: 1.5, mavzu: "Chiziqli tenglamalar",
      savol: "5) |2x - 6| + |y + 4| = 0 tenglik bajarilsa, x·y ko'paytmani hisoblang.",
      variantlar: ["-12", "12", "-24", "7"],
      togriIndex: 0 // x=3, y=-4 => x*y = -12
    },
    {
      id: "cert_6", tartib: 6, qiyinchilik: "oson", ball: 1.5, mavzu: "Ketma-ketlik va yig'indi",
      savol: "6) 1/(1·2) + 1/(2·3) + 1/(3·4) + ... + 1/(99·100) yig'indini hisoblang.",
      variantlar: ["99/100", "1/100", "98/99", "1"],
      togriIndex: 0
    },
    {
      id: "cert_7", tartib: 7, qiyinchilik: "oson", ball: 1.5, mavzu: "Ildizlar",
      savol: "7) √(14 + 6√5) - √5 ifodaning qiymatini soddalashtiring.",
      variantlar: ["3", "2", "√5", "4"],
      togriIndex: 0 // 14+6√5 = (3+√5)^2 => 3+√5 - √5 = 3
    },
    {
      id: "cert_8", tartib: 8, qiyinchilik: "oson", ball: 1.5, mavzu: "Bo'linish belgilari",
      savol: "8) 54x2y besh xonali soni 36 ga qoldiqsiz bo'linadi. Agar y > 4 bo'lsa, x ning qiymatini toping.",
      variantlar: ["8", "5", "6", "7"],
      togriIndex: 0 // 36 = 4*9. 2y 4 ga bo'linishi va y>4 bo'lishi uchun y=8 (28:4=7). 5+4+x+2+8 = 19+x -> 27 uchun x=8
    },
    {
      id: "cert_9", tartib: 9, qiyinchilik: "oson", ball: 1.5, mavzu: "Kvadrat tenglama va Viyet",
      savol: "9) x² - 7x + 10 = 0 tenglama ildizlari x₁ va x₂ bo'lsa, x₁² + x₂² ni hisoblang.",
      variantlar: ["29", "49", "25", "19"],
      togriIndex: 0 // (x1+x2)^2 - 2x1x2 = 49 - 20 = 29
    },
    {
      id: "cert_10", tartib: 10, qiyinchilik: "oson", ball: 1.5, mavzu: "O'rta arifmetik va geometrik",
      savol: "10) Ikkita musbat sonning o'rta arifmetigi 13 ga, o'rta geometrigi esa 12 ga teng. Shu sonlarning kattasini toping.",
      variantlar: ["18", "16", "20", "15"],
      togriIndex: 0 // a+b=26, ab=144 => 18 va 8
    },
    {
      id: "cert_11", tartib: 11, qiyinchilik: "oson", ball: 1.5, mavzu: "Darajali tenglama",
      savol: "11) 2^(x+1) + 2^x + 2^(x-1) = 28 tenglamaning ildizini toping.",
      variantlar: ["3", "2", "4", "5"],
      togriIndex: 0 // 2^(x-1)*(4+2+1) = 28 => 2^(x-1)*7=28 => 2^(x-1)=4 => x=3
    },
    {
      id: "cert_12", tartib: 12, qiyinchilik: "oson", ball: 1.5, mavzu: "Mantiqiy harakat masalasi",
      savol: "12) Poyezd 300 metrli ko'prikdan 30 sekundda, ustun yonidan esa 10 sekundda o'tib ketdi. Poyezd uzunligini (metrda) toping.",
      variantlar: ["150", "100", "200", "120"],
      togriIndex: 0 // L/10 = (L+300)/30 => 3L = L+300 => L=150
    },
    {
      id: "cert_13", tartib: 13, qiyinchilik: "oson", ball: 1.5, mavzu: "Funksiya qiymati",
      savol: "13) Agar f(2x - 1) = 6x + 5 bo'lsa, f(3) ning qiymatini toping.",
      variantlar: ["17", "15", "23", "11"],
      togriIndex: 0 // 2x-1=3 => x=2 => 6(2)+5 = 17
    },
    {
      id: "cert_14", tartib: 14, qiyinchilik: "oson", ball: 1.5, mavzu: "Ko'phadlar",
      savol: "14) P(x) = (x² - 3x + 1)¹⁰ ko'phad qavslar ochib chiqilganda barcha koeffitsiyentlar yig'indisini toping.",
      variantlar: ["1", "-1", "0", "1024"],
      togriIndex: 0 // P(1) = (1 - 3 + 1)^10 = (-1)^10 = 1
    },
    {
      id: "cert_15", tartib: 15, qiyinchilik: "oson", ball: 1.5, mavzu: "EKUB va EKUK",
      savol: "15) EKUB(a, b) = 6 va EKUK(a, b) = 72. Agar a = 18 bo'lsa, b ni toping.",
      variantlar: ["24", "12", "36", "30"],
      togriIndex: 0 // a*b = 6*72 = 432 => b = 432/18 = 24
    },

    // --- 16..30: O'RTACHA DARAJADAGI MATEMATIK VA ALGEBRAIK SAVOLLAR ---
    {
      id: "cert_16", tartib: 16, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Arifmetik progressiya",
      savol: "16) Arifmetik progressiyada a₃ + a₇ + a₁₁ = 45 bo'lsa, dastlabki 13 ta hadining yig'indisi S₁₃ ni toping.",
      variantlar: ["195", "180", "210", "165"],
      togriIndex: 0 // 3*a7 = 45 => a7 = 15. S13 = 13*a7 = 13*15 = 195
    },
    {
      id: "cert_17", tartib: 17, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Geometrik progressiya",
      savol: "17) Cheksiz kamayuvchi geometrik progressiya yig'indisi 16 ga, dastlabki ikki hadi yig'indisi 12 ga teng (q > 0). Birinchi had b₁ ni toping.",
      variantlar: ["8", "10", "6", "12"],
      togriIndex: 0 // b1/(1-q)=16, b1(1+q)=12 => (1-q^2)=12/16=3/4 => q^2=1/4 => q=1/2 => b1=8
    },
    {
      id: "cert_18", tartib: 18, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Logarifmik tenglama",
      savol: "18) log₂(x) + log₄(x) + log₁₆(x) = 7 tenglamaning ildizini toping.",
      variantlar: ["16", "8", "32", "4"],
      togriIndex: 0 // (1 + 1/2 + 1/4) log2(x) = 7 => (7/4) log2(x) = 7 => log2(x) = 4 => x = 16
    },
    {
      id: "cert_19", tartib: 19, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Kublar yig'indisi va Viyet",
      savol: "19) x² - 4x + 1 = 0 tenglamaning ildizlari x₁ va x₂ bo'lsa, x₁³ + x₂³ ning qiymatini toping.",
      variantlar: ["52", "64", "48", "56"],
      togriIndex: 0 // (x1+x2)^3 - 3x1x2(x1+x2) = 64 - 3(1)(4) = 52
    },
    {
      id: "cert_20", tartib: 20, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Trigonometriya",
      savol: "20) Agar sin(α) + cos(α) = 1.2 bo'lsa, sin(2α) ning qiymatini toping.",
      variantlar: ["0.44", "0.22", "0.64", "0.36"],
      togriIndex: 0 // (sin+cos)^2 = 1 + sin(2a) = 1.44 => sin(2a) = 0.44
    },
    {
      id: "cert_21", tartib: 21, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Irratsional tenglama",
      savol: "21) √(2x + 7) = x - 4 tenglamaning haqiqiy ildizini toping.",
      variantlar: ["9", "1 va 9", "1", "7"],
      togriIndex: 0 // 2x+7 = x^2-8x+16 => x^2-10x+9=0 => x=9 yoki x=1 (x>=4 shart bo'yicha faqat 9)
    },
    {
      id: "cert_22", tartib: 22, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Tengsizliklar tizimi",
      savol: "22) (x - 2)(x + 5) ≤ 0 tengsizlikni qanoatlantiruvchi butun sonlar nechta?",
      variantlar: ["8 ta", "7 ta", "6 ta", "9 ta"],
      togriIndex: 0 // [-5, 2] oralig'ida: 2 - (-5) + 1 = 8 ta
    },
    {
      id: "cert_23", tartib: 23, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Teskari funksiya",
      savol: "23) f(x) = (3x + 2) / (x - 1) funksiyaga teskari f⁻¹(5) qiymatini toping.",
      variantlar: ["3.5", "2.5", "4", "3"],
      togriIndex: 0 // (3x+2)/(x-1) = 5 => 3x+2 = 5x-5 => 2x=7 => x=3.5
    },
    {
      id: "cert_24", tartib: 24, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Kombinatorika",
      savol: "24) 7 nafar shaxmatchi turnirda bir-biri bilan bir martadan o'ynasa, jami nechta partiya o'ynaladi?",
      variantlar: ["21", "42", "14", "35"],
      togriIndex: 0 // 7*6/2 = 21
    },
    {
      id: "cert_25", tartib: 25, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Ko'phad qoldig'i (Bezu teoremasi)",
      savol: "25) P(x) = x⁴ - 2x³ + ax + 5 ko'phadni (x - 2) ga bo'lganda qoldiq 11 ga teng bo'lsa, a ni toping.",
      variantlar: ["3", "2", "4", "-3"],
      togriIndex: 0 // P(2) = 16 - 16 + 2a + 5 = 11 => 2a = 6 => a = 3
    },
    {
      id: "cert_26", tartib: 26, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Modulli tenglama",
      savol: "26) |x² - 5x| = 6 tenglamaning barcha haqiqiy ildizlari yig'indisini toping.",
      variantlar: ["10", "5", "0", "12"],
      togriIndex: 0 // x^2-5x-6=0 (D>0, yig'indi 5) va x^2-5x+6=0 (D>0, yig'indi 5). Jami 5+5=10
    },
    {
      id: "cert_27", tartib: 27, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Aralashma va konsentratsiya",
      savol: "27) 30% li 200 g tuz eritmasiga necha gramm toza suv qo'shilsa, 20% li eritma hosil bo'ladi?",
      variantlar: ["100 g", "80 g", "120 g", "50 g"],
      togriIndex: 0 // 60 / (200+x) = 0.2 => 200+x = 300 => x = 100
    },
    {
      id: "cert_28", tartib: 28, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Hosila va urinma",
      savol: "28) f(x) = x³ - 4x² + 5x - 1 funksiyaning x₀ = 2 nuqtasidagi hosilasi f'(2) ni hisoblang.",
      variantlar: ["1", "3", "-1", "5"],
      togriIndex: 0 // f'(x) = 3x^2 - 8x + 5 => f'(2) = 12 - 16 + 5 = 1
    },
    {
      id: "cert_29", tartib: 29, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Logarifm xossalari",
      savol: "29) Agar log₃(2) = a bo'lsa, log₃(72) ni a orqali ifodalang.",
      variantlar: ["3a + 2", "2a + 3", "6a", "a³ + 2"],
      togriIndex: 0 // 72 = 8 * 9 = 2^3 * 3^2 => 3*log3(2) + 2 = 3a + 2
    },
    {
      id: "cert_30", tartib: 30, qiyinchilik: "ortacha", ball: 2.2, mavzu: "Kvadrat funksiya ekstremumi",
      savol: "30) y = 2x² - 12x + 25 funksiyaning eng kichik qiymatini toping.",
      variantlar: ["7", "3", "25", "-7"],
      togriIndex: 0 // x0 = 12/4 = 3 => y(3) = 18 - 36 + 25 = 7
    },

    // --- 31..45: QIYIN (MILLIY SERTIFIKAT A / A+ VA OLIMPIADA DARAJASI) ---
    {
      id: "cert_31", tartib: 31, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Parametrli kvadrat tenglama",
      savol: "31) m ning qanday musbat qiymatida x² - 2(m + 1)x + m² + 5 = 0 tenglama bitta (ikkita teng) ildizga ega bo'ladi?",
      variantlar: ["2", "1", "3", "4"],
      togriIndex: 0 // D/4 = (m+1)^2 - (m^2+5) = 2m - 4 = 0 => m = 2
    },
    {
      id: "cert_32", tartib: 32, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Aniq integral",
      savol: "32) ∫₀² (3x² + 2x + 1) dx aniq integralning qiymatini hisoblang.",
      variantlar: ["14", "12", "16", "10"],
      togriIndex: 0 // [x^3 + x^2 + x]_0^2 = 8 + 4 + 2 = 14
    },
    {
      id: "cert_33", tartib: 33, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Ko'rsatkichli tenglama (qiyin)",
      savol: "33) 9^x - 10·3^x + 9 = 0 tenglamaning ildizlari yig'indisini toping.",
      variantlar: ["2", "10", "3", "1"],
      togriIndex: 0 // 3^x = 1 (x=0) va 3^x = 9 (x=2) => 0 + 2 = 2
    },
    {
      id: "cert_34", tartib: 34, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Trigonometrik ekstremum",
      savol: "34) f(x) = 5·sin(x) + 12·cos(x) + 3 funksiyaning eng katta qiymatini toping.",
      variantlar: ["16", "13", "17", "20"],
      togriIndex: 0 // sqrt(5^2+12^2) + 3 = 13 + 3 = 16
    },
    {
      id: "cert_35", tartib: 35, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Funksional tenglama",
      savol: "35) Barcha x lar uchun 2·f(x) + f(1 - x) = 3x² bajarilsa, f(2) ni toping.",
      variantlar: ["7", "5", "4", "9"],
      togriIndex: 0 // x=2: 2f(2)+f(-1)=12; x=-1: 2f(-1)+f(2)=3 => 3f(2)=21 => f(2)=7
    },
    {
      id: "cert_36", tartib: 36, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Hosilaning fizik ma'nosi",
      savol: "36) Moddiy nuqta S(t) = t³ - 6t² + 15t + 4 qonun bo'yicha harakatlanmoqda. Uning minimal tezligini toping.",
      variantlar: ["3", "0", "6", "15"],
      togriIndex: 0 // v(t) = 3t^2 - 12t + 15 = 3(t-2)^2 + 3 => min tezlik = 3
    },
    {
      id: "cert_37", tartib: 37, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Logarifmik tengsizlik",
      savol: "37) log₀.₅(x² - 4x + 3) ≥ -3 tengsizlikning butun yechimlari yig'indisini toping.",
      variantlar: ["8", "4", "6", "10"],
      togriIndex: 0 // x^2-4x+3 > 0 (x<1 yoki x>3) va x^2-4x+3 <= 8 => x^2-4x-5 <= 0 ([-1, 5]). Butun: -1, 0 va 4, 5 => yig'indi = -1+0+4+5 = 8
    },
    {
      id: "cert_38", tartib: 38, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Koshi tengsizligi (AM-GM)",
      savol: "38) x > 2 uchun f(x) = x + 9/(x - 2) ifodaning eng kichik qiymatini toping.",
      variantlar: ["8", "6", "7", "9"],
      togriIndex: 0 // (x-2) + 9/(x-2) + 2 >= 2*3 + 2 = 8
    },
    {
      id: "cert_39", tartib: 39, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Nyuton binomi",
      savol: "39) (x² + 2/x)⁶ yoyilmasida x ga bog'liq bo'lmagan ozod hadni toping.",
      variantlar: ["240", "160", "60", "192"],
      togriIndex: 0 // C(6,k)*(x^2)^(6-k)*(2/x)^k => 12-3k=0 => k=4. C(6,4)*2^4 = 15 * 16 = 240
    },
    {
      id: "cert_40", tartib: 40, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Tenglamalar sistemasi",
      savol: "40) Agar xy > 5 bo'lib, x + y + xy = 11 va x²y + xy² = 30 tenglamalar sistemasi bajarilsa, x² + y² ni toping.",
      variantlar: ["13", "15", "25", "17"],
      togriIndex: 0 // s=x+y, p=xy. s+p=11, s*p=30 va p>5 => s=5, p=6 => x^2+y^2 = s^2-2p = 25-12 = 13
    },
    {
      id: "cert_41", tartib: 41, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Egri chiziqli trapetsiya yuzi",
      savol: "41) y = 4 - x² parabola va Ox o'qi bilan chegaralangan shaklning yuzini toping.",
      variantlar: ["32/3", "16/3", "8", "12"],
      togriIndex: 0 // int_{-2}^2 (4-x^2) dx = 2*(8 - 8/3) = 32/3
    },
    {
      id: "cert_42", tartib: 42, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Sonlar nazariyasi (faktorial)",
      savol: "42) 45! (45 faktorial) soni oxirida nechta nol bilan tugaydi?",
      variantlar: ["10 ta", "9 ta", "11 ta", "8 ta"],
      togriIndex: 0 // [45/5] + [45/25] = 9 + 1 = 10
    },
    {
      id: "cert_43", tartib: 43, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Murakkab darajali tenglama",
      savol: "43) x^(log₂(x)) = 16·x³ tenglama ildizlari ko'paytmasini toping.",
      variantlar: ["8", "16", "4", "32"],
      togriIndex: 0 // t = log2(x) => t^2 = 4 + 3t => t^2 - 3t - 4 = 0 => t1+t2 = 3 => x1*x2 = 2^3 = 8
    },
    {
      id: "cert_44", tartib: 44, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Analitik geometriya va aylana",
      savol: "44) x² + y² - 6x + 8y = 0 aylana markazidan koordinata boshigacha bo'lgan masofani toping.",
      variantlar: ["5", "7", "10", "25"],
      togriIndex: 0 // Markaz (3, -4), masofa sqrt(9+16) = 5
    },
    {
      id: "cert_45", tartib: 45, qiyinchilik: "qiyin", ball: 2.9667, mavzu: "Olimpiada algebrasi",
      savol: "45) Agar a + b + c = 0 va a² + b² + c² = 14 bo'lsa, a⁴ + b⁴ + c⁴ ning qiymatini toping.",
      variantlar: ["98", "196", "84", "112"],
      togriIndex: 0 // a+b+c=0 bo'lganda a^4+b^4+c^4 = (a^2+b^2+c^2)^2 / 2 = 196 / 2 = 98
    }
  ];

  // ========================================================================
  // 2. MATEMATIKANI 0 DAN O'RGANISH BO'LIMI (C, C+, B, B+, A, A+ DARAJALAR)
  //    Har bir darajada:
  //      - Nazariy darslar (tushuntirish, formulalar, namunalar)
  //      - 10 talik daraja testi
  //      - Har bir test tagida "yordam_eslatma" (tushuntirish / memory) —
  //        ANIQ JAVOBNI AYTMAYDI va yaqin spoyler ham bermaydi!
  // ========================================================================
  const NOLDAN_URGANISH_DARAJALARI = [
    {
      daraja: "C",
      tartib: 1,
      sarlavha: "C daraja: Arifmetika va Boshlang'ich Algebra poydevori (0 dan boshlash)",
      tavsif: "Sonlar ustida amallar, kasrlar, foizlar, darajalar va birinchi darajali chiziqli tenglamalar.",
      olmosMukofoti: 20,
      darslar: [
        {
          id: "dars_c_1",
          nomi: "1-dars: Butun va ratsional sonlar, EKUB va EKUK qonuniyatlari",
          nazariya: "Har qanday murakkab algebra sonlarni to'g'ri hisoblashdan boshlanadi. Ikkita a va b natural son uchun doimo EKUB(a, b) · EKUK(a, b) = a · b tenglik o'rinli bo'ladi.",
          formula: "EKUB(a, b) × EKUK(a, b) = a × b  |  a/b + c/d = (ad + bc) / bd",
          namuna: "Masalan, 12 va 18 sonlari uchun EKUB = 6, EKUK = 36. Tekshiramiz: 6 × 36 = 216 va 12 × 18 = 216."
        },
        {
          id: "dars_c_2",
          nomi: "2-dars: Foizlar, nisbat va proporsiya",
          nazariya: "Sonning p foizini topish uchun uni p/100 ga ko'paytiramiz. Proporsiyaning asosiy xossasi: chetki hadlar ko'paytmasi o'rta hadlar ko'paytmasiga teng.",
          formula: "a / b = c / d  ⇔  a · d = b · c  |  Yangi qiymat = A · (1 ± p/100)",
          namuna: "Agar x / 5 = 12 / 15 bo'lsa, 15x = 60, bundan x = 4."
        },
        {
          id: "dars_c_3",
          nomi: "3-dars: Chiziqli tenglamalar va modul tushunchasi",
          nazariya: "ax + b = 0 ko'rinishidagi tenglama chiziqli tenglama deyiladi. Sonning moduli |x| koordinata boshidan shu nuqtagacha masofani bildiradi va doimo nomanfiy bo'ladi.",
          formula: "ax + b = c  ⇒  x = (c - b) / a  |  |x| ≥ 0",
          namuna: "3x - 7 = 14 tenglamada -7 ni o'ng tarafga +7 qilib o'tkazamiz: 3x = 21 ⇒ x = 7."
        }
      ],
      onTalikTest: [
        {
          id: "learn_c_1",
          savol: "1) (-15) + 28 - (-12) ifodaning qiymatini hisoblang.",
          variantlar: ["25", "1", "31", "15"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Manfiy sonni ayirish — shu sonning musbat qarama-qarshisini qo'shish bilan bir xil: a - (-b) = a + b."
        },
        {
          id: "learn_c_2",
          savol: "2) 24 va 36 sonlarining EKUK va EKUB lari yig'indisini toping.",
          variantlar: ["84", "72", "60", "96"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Sonlarni tub ko'paytuvchilarga ajrating. EKUB uchun umumiy ko'paytuvchilarning eng kichik darajasi, EKUK uchun barcha ko'paytuvchilarning eng katta darajasi olinadi."
        },
        {
          id: "learn_c_3",
          savol: "3) 3/4 + 5/6 - 7/12 kasrli ifodani hisoblang.",
          variantlar: ["1", "11/12", "5/6", "7/6"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Har xil maxrajli kasrlarni qo'shish va ayirishda avval maxrajlarning eng kichik umumiy karralisi (umumiy maxraj) topiladi."
        },
        {
          id: "learn_c_4",
          savol: "4) 250 sonining 36% i nechaga teng?",
          variantlar: ["90", "80", "75", "95"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): A sonining p% i B sonining a% iga tenglik xossasi: Aning p foizi p sonining A foiziga teng (A·p/100 = p·A/100)."
        },
        {
          id: "learn_c_5",
          savol: "5) 5(2x - 3) - 3(x + 2) = 7 chiziqli tenglamani yeching.",
          variantlar: ["4", "3", "5", "2"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Qavs oldida minus ishorasi bo'lsa, qavs ichidagi har bir hadning ishorasi qarama-qarshisiga o'zgaradi. So'ng o'xshash hadlar ixchamlanadi."
        },
        {
          id: "learn_c_6",
          savol: "6) Proporsiyadan x ni toping: (x + 2) / 6 = 15 / 9",
          variantlar: ["8", "10", "6", "12"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Proporsiyaning asosiy xossasiga ko'ra a/b = c/d bo'lsa, a·d = b·c bo'ladi. Avval o'ng tarafdagi kasrni qisqartirib olish hisobni osonlashtiradi."
        },
        {
          id: "learn_c_7",
          savol: "7) 2⁵ · 2³ : 2⁴ darajali ifodaning qiymatini toping.",
          variantlar: ["16", "8", "32", "64"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Bir xil asosli darajalarni ko'paytirishda ko'rsatkichlar qo'shiladi, bo'lishda esa ayiriladi: a^m · a^n : a^k = a^(m+n-k)."
        },
        {
          id: "learn_c_8",
          savol: "8) Uchta ketma-ket toq natural sonning yig'indisi 57 ga teng. Eng kichik sonni toping.",
          variantlar: ["17", "19", "15", "21"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Ketma-ket kelgan toq (yoki juft) sonlar bir-biridan 2 ga farq qiladi: n, n+2, n+4."
        },
        {
          id: "learn_c_9",
          savol: "9) |-8| · |3| - |-10| ifodani hisoblang.",
          variantlar: ["14", "34", "-14", "24"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Modul ichidan har qanday son musbat bo'lib chiqadi, lekin modul tashqarisidagi ayirish amali o'z kuchida qoladi."
        },
        {
          id: "learn_c_10",
          savol: "10) Kitobning 3/8 qismi o'qilgandan so'ng yana 75 bet qoldi. Kitob jami necha bet?",
          variantlar: ["120", "150", "160", "100"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Butun miqdor 1 ga teng deb olinadi. O'qilgan qism 1 dan ayrilsa, qolgan qism ulushi kelib chiqadi."
        }
      ]
    },
    {
      daraja: "C+",
      tartib: 2,
      sarlavha: "C+ daraja: Qisqa ko'paytirish formulalari, Ildizlar va Tenglamalar sistemasi",
      tavsif: "Ko'phadlarni ko'paytuvchilarga ajratish, kvadrat ildiz xossalari va ikki noma'lumli chiziqli tenglamalar sistemasi.",
      olmosMukofoti: 25,
      darslar: [
        {
          id: "dars_cplus_1",
          nomi: "1-dars: Qisqa ko'paytirish formulalari (QKF) sirlari",
          nazariya: "Qisqa ko'paytirish formulalari murakkab algebraik kasrlarni soddalashtirish va tenglamalarni tez yechishning oltin kalitidir.",
          formula: "(a ± b)² = a² ± 2ab + b²  |  a² - b² = (a - b)(a + b)  |  a³ ± b³ = (a ± b)(a² ∓ ab + b²)",
          namuna: "99² - 1² = (99 - 1)(99 + 1) = 98 × 100 = 9800."
        },
        {
          id: "dars_cplus_2",
          nomi: "2-dars: Arifmetik kvadrat ildiz va irratsionallikdan qutqarish",
          nazariya: "Manfiy bo'lmagan sonning kvadrat ildizi doimo nomanfiy bo'ladi. √(a²) = |a| ayniyatni unutmaslik juda muhim!",
          formula: "√(a·b) = √a · √b (a≥0, b≥0)  |  1 / (√a - √b) = (√a + √b) / (a - b)",
          namuna: "√75 - √27 = 5√3 - 3√3 = 2√3."
        }
      ],
      onTalikTest: [
        {
          id: "learn_cp_1",
          savol: "1) Hisoblang: (57² - 43²) / 28",
          variantlar: ["50", "100", "25", "70"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Kvadratlar ayirmasi formulasidan foydalaning: a² - b² = (a - b)(a + b). Sonlarni kvadratga oshirib o'tirmang."
        },
        {
          id: "learn_cp_2",
          savol: "2) Agar a - b = 5 va a·b = 6 bo'lsa, a² + b² ni toping.",
          variantlar: ["37", "13", "25", "49"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): (a - b)² yig'indini ochsangiz a² - 2ab + b² hosil bo'ladi. Shu yerdan a² + b² ni ajratib olish mumkin."
        },
        {
          id: "learn_cp_3",
          savol: "3) √48 + √27 - √12 ifodani soddalashtiring.",
          variantlar: ["5√3", "4√3", "6√3", "3√3"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Ildiz ostidagi sonlarni to'la kvadrat ko'paytuvchi ko'rinishida yozing (masalan, k² · 3) va k ni ildiz tashqarisiga chiqaring."
        },
        {
          id: "learn_cp_4",
          savol: "4) x + y = 9 va x - y = 3 tenglamalar sistemasidan x · y ko'paytmani toping.",
          variantlar: ["18", "27", "12", "24"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Ikki tenglamani hadlab qo'shish orqali bitta noma'lum yo'qotiladi, so'ngra ikkinchi noma'lum topiladi."
        },
        {
          id: "learn_cp_5",
          savol: "5) (x³ - 27) / (x² + 3x + 9) kasrni qisqartiring va x = 10 bo'lgandagi qiymatini toping.",
          variantlar: ["7", "13", "10", "3"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Kublar ayirmasi formulasini eslang: a³ - b³ = (a - b)(a² + ab + b²). Maxraj bilan qisqaruvchi qismga e'tibor bering."
        },
        {
          id: "learn_cp_6",
          savol: "6) 6 / (√5 - √2) kasrni maxrajdagi irratsionallikdan qutqaring.",
          variantlar: ["2(√5 + √2)", "3(√5 + √2)", "√5 + √2", "6(√5 - √2)"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Kasrning surat va maxrajini maxrajning qo'shmasiga, ya'ni (√a + √b) ifodaga ko'paytiring."
        },
        {
          id: "learn_cp_7",
          savol: "7) Agar 2x + 3y = 14 va 3x + 2y = 11 bo'lsa, x + y yig'indini toping.",
          variantlar: ["5", "6", "4", "7"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Har doim x va y ni alohida topish shart emas — ikkala tenglamani qo'shib yuborsangiz, koeffitsiyentlar bir xil bo'lib qolishiga e'tibor bering!"
        },
        {
          id: "learn_cp_8",
          savol: "8) x² - 6x + 13 ifodaning eng kichik qiymatini toping.",
          variantlar: ["4", "13", "7", "0"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Ifodadan to'la kvadrat ajrating: (x - a)² + c. Kvadrat ifodaning eng kichik qiymati 0 ga teng bo'ladi."
        },
        {
          id: "learn_cp_9",
          savol: "9) (√7 + √3)² - √84 ifodaning qiymatini hisoblang.",
          variantlar: ["10", "4", "14", "7"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Yig'indining kvadrati formulasini ochganda 2√(a·b) had hosil bo'ladi va u √(4ab) ga tengdir."
        },
        {
          id: "learn_cp_10",
          savol: "10) 4x² - 12x + 9 = 0 tenglamaning ildizini toping.",
          variantlar: ["1.5", "3", "2", "0.5"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Chap tarafdagi uchhad ikki had ayirmasining to'la kvadrati (ax - b)² ko'rinishiga kelishini tekshiring."
        }
      ]
    },
    {
      daraja: "B",
      tartib: 3,
      sarlavha: "B daraja: Kvadrat tenglamalar, Viyet teoremasi va Tengsizliklar (Intervallar usuli)",
      tavsif: "Diskriminant, Viyet teoremasining ilg'or tatbiqlari, kvadrat tengsizliklar va ratsional tengsizliklar.",
      olmosMukofoti: 35,
      darslar: [
        {
          id: "dars_b_1",
          nomi: "1-dars: Kvadrat tenglama va Viyet teoremasi san'ati",
          nazariya: "ax² + bx + c = 0 tenglama ildizlarini diskriminantsiz ham tahlil qilish mumkin. Viyet teoremasi ildizlarning simmetrik ifodalarini (x₁² + x₂², 1/x₁ + 1/x₂) topishda beqiyosdir.",
          formula: "x₁ + x₂ = -b/a  |  x₁ · x₂ = c/a  |  x₁² + x₂² = (x₁ + x₂)² - 2x₁x₂",
          namuna: "x² - 8x + 15 = 0 uchun yig'indi 8, ko'paytma 15 ⇒ ildizlar 3 va 5."
        },
        {
          id: "dars_b_2",
          nomi: "2-dars: Intervallar usuli va ratsional tengsizliklar",
          nazariya: "Kasr-ratsional tengsizliklarni yechishda nolga tenglashtiruvchi nuqtalar son o'qiga qo'yilib, oraliqlarda ishoralar aniqlanadi. Maxraj hech qachon nolga teng bo'lmasligi shart!",
          formula: "(x - a)(x - b) ≤ 0 (a < b)  ⇒  x ∈ [a; b]",
          namuna: "(x - 1)/(x - 4) ≤ 0 ⇒ x ∈ [1; 4)."
        }
      ],
      onTalikTest: [
        {
          id: "learn_b_1",
          savol: "1) x² - 9x + 14 = 0 tenglama ildizlari x₁ va x₂ bo'lsa, 1/x₁ + 1/x₂ ni toping.",
          variantlar: ["9/14", "14/9", "5/14", "7/9"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Kasrlarni umumiy maxrajga keltirsangiz suratda (x₁ + x₂), maxrajda esa (x₁ · x₂) hosil bo'ladi. So'ng Viyet teoremasini qo'llang."
        },
        {
          id: "learn_b_2",
          savol: "2) Ildizlari 4 va -7 bo'lgan keltirilgan kvadrat tenglamani toping.",
          variantlar: ["x² + 3x - 28 = 0", "x² - 3x - 28 = 0", "x² + 3x + 28 = 0", "x² - 11x - 28 = 0"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Keltirilgan kvadrat tenglama x² - (x₁ + x₂)x + (x₁ · x₂) = 0 ko'rinishida tuziladi."
        },
        {
          id: "learn_b_3",
          savol: "3) x² - 5x - 14 ≤ 0 tengsizlikning eng katta butun yechimini toping.",
          variantlar: ["7", "2", "6", "5"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Avval kvadrat uchhadning ildizlarini toping. a > 0 bo'lganda ≤ 0 tengsizlik yechimi ikki ildiz orasidagi [x₁; x₂] kesma bo'ladi."
        },
        {
          id: "learn_b_4",
          savol: "4) x⁴ - 13x² + 36 = 0 bikvadrat tenglamaning musbat ildizlari yig'indisini toping.",
          variantlar: ["5", "13", "6", "9"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): t = x² (t ≥ 0) belgilash kiritib kvadrat tenglamaga keltiring, t larni topgach ulardan kvadrat ildiz chiqaring."
        },
        {
          id: "learn_b_5",
          savol: "5) (x - 4) / (x + 2) ≤ 0 tengsizlikni qanoatlantiruvchi butun sonlar nechta?",
          variantlar: ["6 ta", "7 ta", "5 ta", "8 ta"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Surat nolga teng bo'lishi mumkin, lekin maxrajni nolga aylantiruvchi nuqta yechimga kirmaydi (ochiq nuqta bo'ladi)!"
        },
        {
          id: "learn_b_6",
          savol: "6) 2x² - kx + 8 = 0 tenglamaning bitta ildizi 2 ga teng bo'lsa, ikkinchi ildizini toping.",
          variantlar: ["2", "4", "1", "8"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Viyet teoremasiga ko'ra ildizlar ko'paytmasi x₁ · x₂ = c / a ga teng. Shu orqali k ni topmasdan ham ikkinchi ildizni aniqlash mumkin."
        },
        {
          id: "learn_b_7",
          savol: "7) √(3x + 1) = 4 irratsional tenglamani yeching.",
          variantlar: ["5", "3", "6", "15"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): √f(x) = a (a ≥ 0) tenglamani yechish uchun ikkala tomonni kvadratga ko'taring: f(x) = a²."
        },
        {
          id: "learn_b_8",
          savol: "8) y = -x² + 6x - 5 parabolaning uchi (cho'qqisi) ordinatasini toping.",
          variantlar: ["4", "3", "-5", "9"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Parabola uchining abssissasi x₀ = -b / (2a) formula bilan topiladi, ordinatasi esa shu x₀ ni funksiyaga qo'yish orqali hisoblanadi."
        },
        {
          id: "learn_b_9",
          savol: "9) |2x - 5| ≤ 3 tengsizlikning barcha butun yechimlari yig'indisini toping.",
          variantlar: ["10", "9", "12", "6"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): |f(x)| ≤ a (a > 0) modulli tengsizlik -a ≤ f(x) ≤ a qo'sh tengsizlikka teng kuchlidir."
        },
        {
          id: "learn_b_10",
          savol: "10) Motorli qayiq oqim bo'ylab 24 km va oqimga qarshi 24 km yo'lni jami 5 soatda bosib o'tdi. Oqim tezligi 2 km/soat bo'lsa, qayiqning turg'un suvdagi tezligini toping.",
          variantlar: ["10 km/soat", "8 km/soat", "12 km/soat", "9 km/soat"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Oqim bo'ylab tezlik (v + v_oqim), oqimga qarshi tezlik esa (v - v_oqim) bo'ladi. Vaqt = Yo'l / Tezlik."
        }
      ]
    },
    {
      daraja: "B+",
      tartib: 4,
      sarlavha: "B+ daraja: Progressiyalar, Funksiyalar va Trigonometriya asoslari",
      tavsif: "Arifmetik va geometrik progressiyalar, funksiyaning aniqlanish sohasi, juft-toqligi va trigonometrik ayniyatlar.",
      olmosMukofoti: 45,
      darslar: [
        {
          id: "dars_bp_1",
          nomi: "1-dars: Arifmetik va Geometrik progressiya qonuniyatlari",
          nazariya: "Arifmetik progressiyada har bir had o'zidan oldingi va keyingi hadlarning o'rta arifmetigiga, geometrik progressiyada esa o'rta geometrigiga teng.",
          formula: "a_n = a₁ + (n-1)d  |  S_n = (a₁ + a_n)·n/2  |  b_n = b₁·q^(n-1)  |  S = b₁/(1-q)",
          namuna: "Agar a₅ = 12 bo'lsa, dastlabki 9 ta had yig'indisi S₉ = 9 · a₅ = 108."
        },
        {
          id: "dars_bp_2",
          nomi: "2-dars: Asosiy trigonometrik ayniyatlar va keltirish formulalari",
          nazariya: "Birlik aylanada sin²α + cos²α = 1 asosiy ayniyat barcha trigonometrik almashtirishlarning negizidir.",
          formula: "sin²α + cos²α = 1  |  sin(2α) = 2sinα·cosα  |  cos(2α) = cos²α - sin²α",
          namuna: "sin(30°) = 0.5, cos(60°) = 0.5, tg(45°) = 1."
        }
      ],
      onTalikTest: [
        {
          id: "learn_bp_1",
          savol: "1) Arifmetik progressiyada a₁ = 4 va d = 3 bo'lsa, a₁₂ hadini toping.",
          variantlar: ["37", "34", "40", "31"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Arifmetik progressiyaning n-hadi formulasi: a_n = a₁ + (n - 1)·d."
        },
        {
          id: "learn_bp_2",
          savol: "2) Arifmetik progressiyada a₄ + a₈ = 26 bo'lsa, dastlabki 11 ta had yig'indisi S₁₁ ni toping.",
          variantlar: ["143", "130", "156", "121"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Indekslar yig'indisi teng bo'lsa, mos hadlar yig'indisi ham teng: a₁ + a₁₁ = a₄ + a₈."
        },
        {
          id: "learn_bp_3",
          savol: "3) Geometrik progressiyada b₂ = 6 va b₅ = 48 bo'lsa, maxraj q ni toping.",
          variantlar: ["2", "3", "4", "1.5"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Geometrik progressiyada b_m / b_k = q^(m - k) munosabat o'rinli bo'ladi."
        },
        {
          id: "learn_bp_4",
          savol: "4) 12 + 6 + 3 + 1.5 + ... cheksiz kamayuvchi geometrik progressiya yig'indisini toping.",
          variantlar: ["24", "18", "36", "20"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): |q| < 1 bo'lganda cheksiz yig'indi S = b₁ / (1 - q) formula orqali hisoblanadi."
        },
        {
          id: "learn_bp_5",
          savol: "5) Agar cos(α) = 0.8 va α birinchi chorak burchagi bo'lsa, sin(2α) ni toping.",
          variantlar: ["0.96", "0.48", "0.6", "0.84"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Avval asosiy ayniyatdan sin(α) ni toping, so'ngra ikkilangan burchak sinusi sin(2α) = 2·sin(α)·cos(α) formulasini qo'llang."
        },
        {
          id: "learn_bp_6",
          savol: "6) f(x) = √(10 - 2x) funksiyaning aniqlanish sohasidagi eng katta x ni toping.",
          variantlar: ["5", "10", "2", "0"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Juft darajali ildiz ostidagi ifoda doimo nomanfiy (≥ 0) bo'lishi shart."
        },
        {
          id: "learn_bp_7",
          savol: "7) Hisoblang: 4·sin²(15°)·cos²(15°)",
          variantlar: ["0.25", "0.5", "0.75", "1"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Ifodani (2·sin(α)·cos(α))² ko'rinishida yozib, ikkilangan burchak formulasiga keltiring."
        },
        {
          id: "learn_bp_8",
          savol: "8) Agar tg(α) = 3 bo'lsa, (2·sin(α) + cos(α)) / (sin(α) - cos(α)) ni hisoblang.",
          variantlar: ["3.5", "2.5", "4", "3"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Bir jinsli kasrning surat va maxrajini cos(α) ga hadlab bo'lib yuborsangiz, barcha hadlar tg(α) orqali ifodalanadi."
        },
        {
          id: "learn_bp_9",
          savol: "9) f(x) = 3·sin(4x) - 2 funksiyaning qiymatlar to'plamidagi eng katta va eng kichik qiymatlar yig'indisini toping.",
          variantlar: ["-4", "0", "2", "-2"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): sin(kx) funksiyaning qiymatlari [-1; 1] oraliqda o'zgaradi. Eng katta qiymat +1 da, eng kichigi -1 da erishiladi."
        },
        {
          id: "learn_bp_10",
          savol: "10) 2·cos(x) - √3 = 0 tenglamaning [0°; 90°] oraliqdagi ildizini toping.",
          variantlar: ["30°", "60°", "45°", "15°"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Tenglamadan cos(x) ni topib, o'tkir burchaklar uchun standart trigonometrik jadval qiymatini eslang."
        }
      ]
    },
    {
      daraja: "A",
      tartib: 5,
      sarlavha: "A daraja: Ko'rsatkichli va Logarifmik tenglamalar hamda Hosila",
      tavsif: "Logarifm xossalari, asosni almashtirish formulasi, ko'rsatkichli tengsizliklar va funksiyaning hosilasi.",
      olmosMukofoti: 60,
      darslar: [
        {
          id: "dars_a_1",
          nomi: "1-dars: Logarifm xossalari va tenglamalarni yechish texnikasi",
          nazariya: "a^b = N bo'lganda b = log_a(N) deyiladi (a > 0, a ≠ 1, N > 0). Ko'paytmaning logarifmi logarifmlar yig'indisiga, bo'linmaniki esa ayirmasiga teng.",
          formula: "log_a(x·y) = log_a(x) + log_a(y)  |  log_(a^k)(x^m) = (m/k)·log_a(x)",
          namuna: "log₂(8) + log₂(4) = 3 + 2 = 5."
        },
        {
          id: "dars_a_2",
          nomi: "2-dars: Hosila, urinma burchak koeffitsiyenti va ekstremumlar",
          nazariya: "Funksiyaning x₀ nuqtadagi hosilasi shu nuqtada o'tkazilgan urinmaning burchak koeffitsiyentiga (k = tgα = f'(x₀)) teng. Ekstremum nuqtalarida hosila nolga teng bo'ladi.",
          formula: "(x^n)' = n·x^(n-1)  |  (u·v)' = u'v + uv'  |  Urinma: y = f(x₀) + f'(x₀)(x - x₀)",
          namuna: "f(x) = x³ - 3x uchun f'(x) = 3x² - 3 = 0 ⇒ x = ±1 ekstremum nuqtalar."
        }
      ],
      onTalikTest: [
        {
          id: "learn_a_1",
          savol: "1) Hisoblang: log₃(54) - log₃(2)",
          variantlar: ["3", "2", "4", "9"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Bir xil asosli logarifmlar ayirmasi bo'linmaning logarifmiga teng: log_a(x) - log_a(y) = log_a(x/y)."
        },
        {
          id: "learn_a_2",
          savol: "2) 5^(2x - 1) = 125 ko'rsatkichli tenglamani yeching.",
          variantlar: ["2", "1.5", "3", "2.5"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Tenglikning ikkala tomonini bir xil asosli darajaga keltiring, so'ngra ko'rsatkichlarni tenglashtiring."
        },
        {
          id: "learn_a_3",
          savol: "3) Hisoblang: 7^(2 + log₇(3))",
          variantlar: ["147", "49", "21", "63"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): a^(m + n) = a^m · a^n xossasi hamda asosiy logarifmik ayniyat a^(log_a(b)) = b dan foydalaning."
        },
        {
          id: "learn_a_4",
          savol: "4) log₂(x - 3) + log₂(x + 3) = 4 tenglamaning haqiqiy ildizini toping.",
          variantlar: ["5", "4", "±5", "7"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Logarifmlar yig'indisini ko'paytma logarifmiga o'tkazing va logarifm ostidagi ifodalar musbat bo'lishi (aniqlanish sohasi) shartini tekshiring!"
        },
        {
          id: "learn_a_5",
          savol: "5) f(x) = 2x³ - 5x² + 4x - 7 funksiyaning x₀ = 1 nuqtadagi hosilasi f'(1) ni toping.",
          variantlar: ["0", "1", "-1", "2"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Darajali funksiya hosilasi qoidasi: (c·x^n)' = c·n·x^(n-1), o'zgarmas sonning hosilasi esa 0 ga teng."
        },
        {
          id: "learn_a_6",
          savol: "6) y = x² - 6x + 11 egri chiziqqa x₀ = 4 nuqtada o'tkazilgan urinmaning burchak koeffitsiyenti k ni toping.",
          variantlar: ["2", "3", "4", "-2"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Urinmaning burchak koeffitsiyenti funksiyaning berilgan nuqtadagi birinchi tartibli hosilasiga teng: k = f'(x₀)."
        },
        {
          id: "learn_a_7",
          savol: "7) Hisoblang: log₂(3) · log₃(4) · log₄(8)",
          variantlar: ["3", "2", "4", "1.5"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Logarifmda yangi asosga o'tish natijasida log_a(b) · log_b(c) = log_a(c) zanjirli qisqarish qoidasi ishlaydi."
        },
        {
          id: "learn_a_8",
          savol: "8) f(x) = x³ - 12x + 5 funksiyaning musbat ekstremum nuqtasini toping.",
          variantlar: ["2", "4", "3", "1"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Ekstremum nuqtalarini topish uchun f'(x) = 0 tenglamani tuzing va yeching."
        },
        {
          id: "learn_a_9",
          savol: "9) (1/3)^(x - 2) ≥ 9 ko'rsatkichli tengsizlikni yeching.",
          variantlar: ["x ≤ 0", "x ≥ 0", "x ≤ 4", "x ≥ 4"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Ko'rsatkichli tengsizlik asosi 0 < a < 1 oraliqda bo'lsa, asos tashlanganda tengsizlik ishorasi qarama-qarshisiga o'zgaradi!"
        },
        {
          id: "learn_a_10",
          savol: "10) Moddiy nuqta S(t) = 2t³ - 3t² + 4t qonun bo'yicha harakatlanmoqda. t = 2 sekunddagi tezlanishni (a) toping.",
          variantlar: ["18", "12", "20", "16"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Yo'ldan olingan birinchi hosila tezlikni v(t) = S'(t), ikkinchi tartibli hosila esa tezlanishni a(t) = v'(t) = S''(t) beradi."
        }
      ]
    },
    {
      daraja: "A+",
      tartib: 6,
      sarlavha: "A+ daraja: Integral, Parametrli masalalar, Kombinatorika va Olimpiada Algebrasi",
      tavsif: "Boshlang'ich funksiya va aniq integral, Nyuton-Leybnits formulasi, Koshi tengsizligi, parametrli tenglamalar va A+ Milliy Sertifikat cho'qqisi!",
      olmosMukofoti: 100,
      darslar: [
        {
          id: "dars_ap_1",
          nomi: "1-dars: Boshlang'ich funksiya, Aniq integral va yuzalarni hisoblash",
          nazariya: "Integrallash — hosila olishga teskari amaldir. Nyuton-Leybnits formulasiga ko'ra ∫_a^b f(x)dx = F(b) - F(a), bu yerda F'(x) = f(x).",
          formula: "∫ x^n dx = x^(n+1)/(n+1) + C  |  S = ∫_a^b (f_yuqori(x) - f_quyi(x)) dx",
          namuna: "∫₀³ 3x² dx = [x³]₀³ = 27 - 0 = 27."
        },
        {
          id: "dars_ap_2",
          nomi: "2-dars: Parametrli tenglamalar, Koshi tengsizligi va Nyuton binomi",
          nazariya: "Musbat sonlar uchun o'rta arifmetik doimo o'rta geometrikdan katta yoki teng: (a+b)/2 ≥ √(ab). Bu tengsizlik funksiyalarning ekstremal qiymatlarini hosilasiz topishga yordam beradi.",
          formula: "a + b ≥ 2√(ab) (a,b > 0)  |  (a + b)^n = Σ C(n,k)·a^(n-k)·b^k",
          namuna: "x > 0 uchun x + 16/x ≥ 2√(x · 16/x) = 8."
        }
      ],
      onTalikTest: [
        {
          id: "learn_ap_1",
          savol: "1) ∫₁³ (2x + 3) dx aniq integralni hisoblang.",
          variantlar: ["14", "12", "16", "10"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Avval boshlang'ich funksiyani toping, so'ngra yuqori chegarani qo'ygan qiymatdan quyi chegarani qo'ygan qiymatni ayiring."
        },
        {
          id: "learn_ap_2",
          savol: "2) x > 0 bo'lganda f(x) = x + 25/x funksiyaning eng kichik qiymatini toping.",
          variantlar: ["10", "5", "25", "12.5"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Musbat a va b sonlar uchun Koshi tengsizligini qo'llang: a + b ≥ 2√(a·b)."
        },
        {
          id: "learn_ap_3",
          savol: "3) (2x - 1)⁵ binom yoyilmasidagi barcha binomial koeffitsiyentlar yig'indisini emas, balki x ning oldidagi koeffitsiyentlar yig'indisini toping.",
          variantlar: ["1", "32", "-1", "243"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Ko'phadning barcha koeffitsiyentlari yig'indisini topish uchun o'zgaruvchi o'rniga 1 qiymat qo'yiladi."
        },
        {
          id: "learn_ap_4",
          savol: "4) a parametrning qanday qiymatida x² - 6x + a = 0 tenglama ildizlarining kvadratlari yig'indisi 20 ga teng bo'ladi?",
          variantlar: ["8", "6", "10", "4"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): x₁² + x₂² = (x₁ + x₂)² - 2x₁x₂ ayniyatga Viyet teoremasi orqali yig'indi va ko'paytmani qo'ying."
        },
        {
          id: "learn_ap_5",
          savol: "5) 5 ta turli kitobni javonga necha xil usulda ketma-ket taxlash mumkin?",
          variantlar: ["120", "60", "24", "100"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): n ta turli elementning o'rin almashtirishlar soni P_n = n! (n faktorial) ga teng."
        },
        {
          id: "learn_ap_6",
          savol: "6) f(x) = 4x³ - 6x funksiyaning grafigi A(1; 5) nuqtadan o'tuvchi boshlang'ich funksiyasi F(2) ni toping.",
          variantlar: ["11", "8", "9", "13"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Boshlang'ich funksiya F(x) = ∫f(x)dx + C ko'rinishida topiladi, berilgan nuqta koordinatalari orqali C o'zgarmas aniqlanadi."
        },
        {
          id: "learn_ap_7",
          savol: "7) Ikkita o'yin kubigi (shashka toshi) birgalikda tashlanganda tushgan ochkolar yig'indisi 9 bo'lish ehtimolligini toping.",
          variantlar: ["1/9", "1/6", "1/12", "5/36"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): Jami teng imkoniyatli holatlar soni 6 × 6 = 36 ta. Qulay holatlar juftliklarini sanab, 36 ga bo'ling."
        },
        {
          id: "learn_ap_8",
          savol: "8) Agar x + 1/x = 3 bo'lsa, x³ + 1/x³ ning qiymatini toping.",
          variantlar: ["18", "27", "24", "21"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): (x + 1/x)³ kubga oshirish formulasini yozib, undan x³ + 1/x³ qismini ajratib oling."
        },
        {
          id: "learn_ap_9",
          savol: "9) log₂(x) + log_x(2) = 2.5 tenglamaning katta ildizini toping.",
          variantlar: ["4", "2", "8", "16"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): log_x(a) = 1 / log_a(x) xossadan foydalanib, t = log_a(x) almashtirish kiriting."
        },
        {
          id: "learn_ap_10",
          savol: "10) 1! + 2! + 3! + 4! + ... + 100! yig'indini 12 ga bo'lgandagi qoldiqni toping.",
          variantlar: ["9", "3", "0", "6"],
          togriIndex: 0,
          yordam_eslatma: "Xotira qoidasi (Memory): k ≥ 4 bo'lganda barcha k! faktoriallar tarkibida 3 va 4 ko'paytuvchilar borligi sababli 12 ga qoldiqsiz bo'linadi!"
        }
      ]
    }
  ];

  // Variantlar joylashuvini A, B, C, D (0, 1, 2, 3) bo'yicha bir tekis taqsimlash:
  // (Har doim A javob bo'lib qolmasligi uchun to'g'ri javob indeksini deterministik aylantiramiz)
  function variantlarniBalanslash(savollarRoyxati, siljish) {
    savollarRoyxati.forEach((q, idx) => {
      if (!Array.isArray(q.variantlar) || q.variantlar.length !== 4) return;
      const joriyTogri = q.togriIndex || 0;
      const maqsadIndex = (idx + siljish) % 4;
      if (joriyTogri !== maqsadIndex) {
        const yangiVariantlar = q.variantlar.slice();
        const vaqtincha = yangiVariantlar[maqsadIndex];
        yangiVariantlar[maqsadIndex] = yangiVariantlar[joriyTogri];
        yangiVariantlar[joriyTogri] = vaqtincha;
        q.variantlar = yangiVariantlar;
        q.togriIndex = maqsadIndex;
      }
    });
  }

  variantlarniBalanslash(SERTIFIKAT_45_TEST, 1);
  NOLDAN_URGANISH_DARAJALARI.forEach((darajaObj, dIdx) => {
    variantlarniBalanslash(darajaObj.onTalikTest, dIdx + 1);
  });

  // ========================================================================
  // 3. O'QUVCHI VA USTOZLAR UCHUN DARAJALI TESTLAR FILTRI FUNKSIYASI
  // ========================================================================
  const MatematikaSavollarBazasi = {
    sertifikat45Test: SERTIFIKAT_45_TEST,
    noldanUrganishDarajalari: NOLDAN_URGANISH_DARAJALARI,

    // Milliy Sertifikat baholash shkalasi (O'zbekiston Milliy Sertifikat tizimi asosida)
    sertifikatDarajasiniHisoblash: function (togriSoni, jamiBall) {
      // 45 ta savoldan to'plangan foiz va murakkablik balliga ko'ra:
      const foiz = Math.round((togriSoni / 45) * 1000) / 10;
      let daraja = "Sertifikat berilmadi";
      let otgan = false;
      let olmosMukofoti = 5;
      let tavsif = "Sertifikat olish uchun kamida 46% (21 ta to'g'ri javob) to'plash talab etiladi. 0 dan o'rganish bo'limida bilimingizni mustahkamlang!";

      if (foiz >= 86 || togriSoni >= 39) {
        daraja = "A+";
        otgan = true;
        olmosMukofoti = 100;
        tavsif = "Eng yuqori imtiyozli daraja! OTM kirish imtihonlarida maksimal ball va ustozlar uchun 50% ustama darajasi!";
      } else if (foiz >= 78 || togriSoni >= 35) {
        daraja = "A";
        otgan = true;
        olmosMukofoti = 70;
        tavsif = "A'lo daraja! Yuqori akademik ko'rsatkich va imtiyozli sertifikat.";
      } else if (foiz >= 70 || togriSoni >= 31) {
        daraja = "B+";
        otgan = true;
        olmosMukofoti = 50;
        tavsif = "Juda yaxshi natija! Proporsional yuqori ball beruvchi Milliy Sertifikat darajasi.";
      } else if (foiz >= 60 || togriSoni >= 27) {
        daraja = "B";
        otgan = true;
        olmosMukofoti = 35;
        tavsif = "Yaxshi natija! Barqaror matematik bilim darajasi.";
      } else if (foiz >= 55 || togriSoni >= 25) {
        daraja = "C+";
        otgan = true;
        olmosMukofoti = 25;
        tavsif = "O'rta-yuqori baza darajasi. Keyingi maqsad — B va A darajalar!";
      } else if (foiz >= 46 || togriSoni >= 21) {
        daraja = "C";
        otgan = true;
        olmosMukofoti = 15;
        tavsif = "Boshlang'ich tasdiqlangan Milliy Sertifikat darajasi.";
      }

      return {
        daraja,
        otgan,
        foiz,
        togriSoni,
        jamiSavol: 45,
        jamiBall: Math.round((jamiBall || (togriSoni / 45) * 100) * 10) / 10,
        olmosMukofoti,
        tavsif
      };
    },

    // O'quvchi yoki Ustoz tanlagan darajaga qarab test savollarini qaytarish
    darajaTestlariniOlish: function (rol, darajaKodi) {
      // rol: "O'quvchi" yoki "Ustoz"
      // darajaKodi: "C", "C+", "B", "B+", "A", "A+"
      const topilganDaraja = NOLDAN_URGANISH_DARAJALARI.find(d => d.daraja === darajaKodi) || NOLDAN_URGANISH_DARAJALARI[0];
      let savollar = topilganDaraja.onTalikTest.map(s => ({
        ...s,
        manba: `${darajaKodi} daraja`
      }));

      // Agar "Ustoz" bo'lsa yoki yuqori daraja tanlansa, Sertifikatning mos qiyinchilikdagi savollaridan ham boyitamiz
      if (rol === "Ustoz") {
        const qiyinchilikXaritasi = {
          "C": "oson",
          "C+": "oson",
          "B": "ortacha",
          "B+": "ortacha",
          "A": "qiyin",
          "A+": "qiyin"
        };
        const mosTur = qiyinchilikXaritasi[darajaKodi] || "qiyin";
        const sertSavollari = SERTIFIKAT_45_TEST.filter(q => q.qiyinchilik === mosTur).slice(0, 5);
        savollar = [
          ...sertSavollari.map(q => ({
            id: q.id,
            savol: `[Ustoz metodikasi • ${q.mavzu}] ${q.savol}`,
            variantlar: q.variantlar,
            togriIndex: q.togriIndex,
            manba: `Ustoz ${darajaKodi}`
          })),
          ...savollar.slice(0, 5)
        ];
      }

      return savollar;
    }
  };

  global.MatematikaSavollarBazasi = MatematikaSavollarBazasi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = MatematikaSavollarBazasi;
  }
})(typeof window !== "undefined" ? window : globalThis);
