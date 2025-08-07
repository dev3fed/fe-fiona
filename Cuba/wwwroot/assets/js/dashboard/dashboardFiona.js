// ==========================================
// ==========================================
// DASHBOARD EXP
// ==========================================
// ==========================================
// ==========================================

// tab so

// const chartPositionDirectore  tbd sama nisa

const arrayDirectorate = [
  "Direktorat Utama",
  "Direktorat Keuangan",
  "Direktorat Manajemen Risiko",
  "Direktorat Pemasaran Pusat & Niaga",
  "Direktorat Pemasaran Regional",
  "Direktorat Perencanaan & Pengembangan Bisnis",
  "Direktorat Rekayasa & Infrastruktur Darat",
  "Direktorat SDM & Penunjang Bisnis",
];

const Regional = [
  "Regional Jatimbalinus",
  "Regional Jawa Bagian Barat",
  "Regional Jawa Bagian Tengah",
  "Regional Kalimantan",
  "Regional Papua-Maluku",
  "Regional Sulawesi",
  "Regional Sumbagsel",
  "Regional Sumbagut",
];

//data untuk funnel job grade
//all (kantor pusat & regional)
const dataJobGradeAll = [
  { prl: "28", formasi: 1 },
  { prl: "26", formasi: 4 },
  { prl: "25", formasi: 3 },
  { prl: "24", formasi: 8 },
  { prl: "23", formasi: 16 },
  { prl: "19-23", formasi: 4 },
  { prl: "22", formasi: 13 },
  { prl: "21", formasi: 40 },
  { prl: "20", formasi: 71 },
  { prl: "16-20", formasi: 2 },
  { prl: "19", formasi: 70 },
  { prl: "18", formasi: 103 },
  { prl: "18", formasi: 1 },
  { prl: "17-18", formasi: 1 },
  { prl: "16-18", formasi: 109 },
  { prl: "15-18", formasi: 3 },
  { prl: "14-18", formasi: 4 },
  { prl: "12-18", formasi: 72 },
  { prl: "10-18", formasi: 2 },
  { prl: "17", formasi: 167 },
  { prl: "16-17", formasi: 106 },
  { prl: "14-17", formasi: 1 },
  { prl: "12-17", formasi: 24 },
  { prl: "16", formasi: 1 },
  { prl: "16", formasi: 156 },
  { prl: "14-16", formasi: 36 },
  { prl: "12-16", formasi: 30 },
  { prl: "15", formasi: 194 },
  { prl: "14-15", formasi: 257 },
  { prl: "13-15", formasi: 16 },
  { prl: "12-15", formasi: 454 },
  { prl: "11-15", formasi: 39 },
  { prl: "10-15", formasi: 18 },
  { prl: "14", formasi: 262 },
  { prl: "13-14", formasi: 42 },
  { prl: "12-14", formasi: 147 },
  { prl: "10-14", formasi: 43 },
  { prl: "13", formasi: 246 },
  { prl: "12-13", formasi: 363 },
  { prl: "11-13", formasi: 1 },
  { prl: "10-13", formasi: 181 },
  { prl: "9-13", formasi: 16 },
  { prl: "12", formasi: 355 },
  { prl: "11-12", formasi: 87 },
  { prl: "10-12", formasi: 247 },
  { prl: "8-12", formasi: 22 },
  { prl: "11", formasi: 13 },
  { prl: "10-11", formasi: 308 },
  { prl: "8-11", formasi: 268 },
  { prl: "10", formasi: 51 },
  { prl: "9-10", formasi: 2 },
  { prl: "8-10", formasi: 329 },
  { prl: "8-9", formasi: 11 },
];

//data job grade untuk kantor pusat
const dataJobGradeKantorPusat = {
  Keuangan: [
    { prl: "25", formasi: 1 },
    { prl: "23", formasi: 2 },
    { prl: "21", formasi: 3 },
    { prl: "20", formasi: 6 },
    { prl: "19", formasi: 3 },
    { prl: "16-18", formasi: 14 },
    { prl: "16-17", formasi: 10 },
    { prl: "14-15", formasi: 1 },
    { prl: "12-15", formasi: 57 },
    { prl: "12-13", formasi: 6 },
    { prl: "10-13", formasi: 1 },
  ],
  "Manajemen Risiko": [
    { prl: "25", formasi: 1 },
    { prl: "23", formasi: 1 },
    { prl: "22", formasi: 2 },
    { prl: "21", formasi: 1 },
    { prl: "20", formasi: 3 },
    { prl: "19", formasi: 2 },
    { prl: "16-18", formasi: 7 },
    { prl: "16-17", formasi: 1 },
    { prl: "12-15", formasi: 13 },
    { prl: "11", formasi: 1 },
  ],
  "Pemasaran Pusat & Niaga": [
    { prl: "26", formasi: 1 },
    { prl: "24", formasi: 3 },
    { prl: "23", formasi: 1 },
    { prl: "22", formasi: 1 },
    { prl: "21", formasi: 8 },
    { prl: "20", formasi: 8 },
    { prl: "19", formasi: 8 },
    { prl: "18", formasi: 2 },
    { prl: "16-18", formasi: 26 },
    { prl: "15-18", formasi: 3 },
    { prl: "12-18", formasi: 38 },
    { prl: "17", formasi: 2 },
    { prl: "16-17", formasi: 17 },
    { prl: "14-17", formasi: 1 },
    { prl: "12-17", formasi: 2 },
    { prl: "16", formasi: 2 },
    { prl: "12-16", formasi: 5 },
    { prl: "14-15", formasi: 5 },
    { prl: "12-15", formasi: 59 },
    { prl: "10-15", formasi: 13 },
    { prl: "12-14", formasi: 1 },
    { prl: "12-13", formasi: 4 },
    { prl: "10-13", formasi: 1 },
  ],
  "Pemasaran Regional": [
    { prl: "26", formasi: 1 },
    { prl: "24", formasi: 2 },
    { prl: "23", formasi: 1 },
    { prl: "22", formasi: 1 },
    { prl: "21", formasi: 3 },
    { prl: "20", formasi: 6 },
    { prl: "19", formasi: 6 },
    { prl: "16-18", formasi: 12 },
    { prl: "12-18", formasi: 1 },
    { prl: "16-17", formasi: 31 },
    { prl: "16", formasi: 3 },
    { prl: "14-15", formasi: 20 },
    { prl: "12-15", formasi: 34 },
    { prl: "12-14", formasi: 2 },
    { prl: "12-13", formasi: 18 },
    { prl: "10-13", formasi: 1 },
  ],
  "Perencanaan & Pengembangan Bisnis": [
    { prl: "26", formasi: 1 },
    { prl: "24", formasi: 1 },
    { prl: "23", formasi: 2 },
    { prl: "21", formasi: 2 },
    { prl: "20", formasi: 5 },
    { prl: "19", formasi: 4 },
    { prl: "16-18", formasi: 4 },
    { prl: "12-18", formasi: 26 },
    { prl: "17", formasi: 3 },
    { prl: "16-17", formasi: 4 },
    { prl: "12-17", formasi: 12 },
    { prl: "16", formasi: 1 },
    { prl: "14-15", formasi: 2 },
    { prl: "12-15", formasi: 7 },
    { prl: "12-14", formasi: 2 },
    { prl: "12-13", formasi: 4 },
    { prl: "10-13", formasi: 1 },
  ],
  "Rekayasa & Infrastruktur Darat": [
    { prl: "26", formasi: 1 },
    { prl: "24", formasi: 1 },
    { prl: "23", formasi: 1 },
    { prl: "21", formasi: 4 },
    { prl: "20", formasi: 9 },
    { prl: "19", formasi: 5 },
    { prl: "18", formasi: 22 },
    { prl: "16-18", formasi: 5 },
    { prl: "17", formasi: 31 },
    { prl: "16-17", formasi: 4 },
    { prl: "12-17", formasi: 5 },
    { prl: "16", formasi: 12 },
    { prl: "14-16", formasi: 28 },
    { prl: "14-15", formasi: 61 },
    { prl: "12-15", formasi: 43 },
    { prl: "14", formasi: 2 },
    { prl: "12-14", formasi: 13 },
    { prl: "12-13", formasi: 29 },
    { prl: "10-13", formasi: 1 },
    { prl: "12", formasi: 35 },
  ],
  "SDM & Penunjang Bisnis": [
    { prl: "25", formasi: 1 },
    { prl: "23", formasi: 2 },
    { prl: "22", formasi: 1 },
    { prl: "21", formasi: 2 },
    { prl: "20", formasi: 8 },
    { prl: "16-20", formasi: 2 },
    { prl: "19", formasi: 5 },
    { prl: "17-18", formasi: 1 },
    { prl: "16-18", formasi: 19 },
    { prl: "12-18", formasi: 2 },
    { prl: "10-18", formasi: 2 },
    { prl: "17", formasi: 3 },
    { prl: "16-17", formasi: 16 },
    { prl: "12-17", formasi: 2 },
    { prl: "16", formasi: 2 },
    { prl: "12-16", formasi: 1 },
    { prl: "14-15", formasi: 3 },
    { prl: "12-15", formasi: 97 },
    { prl: "10-15", formasi: 5 },
    { prl: "12-13", formasi: 6 },
    { prl: "10-13", formasi: 1 },
  ],
  Utama: [
    { prl: "28", formasi: 1 },
    { prl: "23", formasi: 4 },
    { prl: "19-23", formasi: 4 },
    { prl: "21", formasi: 4 },
    { prl: "20", formasi: 8 },
    { prl: "19", formasi: 6 },
    { prl: "18", formasi: 1 },
    { prl: "16-18", formasi: 22 },
    { prl: "14-18", formasi: 4 },
    { prl: "12-18", formasi: 5 },
    { prl: "16-17", formasi: 12 },
    { prl: "12-17", formasi: 3 },
    { prl: "14-15", formasi: 17 },
    { prl: "12-15", formasi: 23 },
    { prl: "12-14", formasi: 1 },
    { prl: "12-13", formasi: 15 },
  ],
};

//data job grade untuk regional
const dataJobGradeRegional = {
  "Regional Jatimbalinus": [
    {
      prl: "23",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 3,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 6,
    },
    {
      prl: "18",
      formasi: 16,
    },
    {
      prl: "17",
      formasi: 18,
    },
    {
      prl: "16-17",
      formasi: 2,
    },
    {
      prl: "16",
      formasi: 16,
    },
    {
      prl: "16",
      formasi: 1,
    },
    {
      prl: "14-16",
      formasi: 1,
    },
    {
      prl: "12-16",
      formasi: 8,
    },
    {
      prl: "15",
      formasi: 36,
    },
    {
      prl: "14-15",
      formasi: 33,
    },
    {
      prl: "13-15",
      formasi: 4,
    },
    {
      prl: "12-15",
      formasi: 16,
    },
    {
      prl: "11-15",
      formasi: 17,
    },
    {
      prl: "14",
      formasi: 41,
    },
    {
      prl: "13-14",
      formasi: 1,
    },
    {
      prl: "12-14",
      formasi: 28,
    },
    {
      prl: "10-14",
      formasi: 10,
    },
    {
      prl: "13",
      formasi: 44,
    },
    {
      prl: "12-13",
      formasi: 58,
    },
    {
      prl: "10-13",
      formasi: 28,
    },
    {
      prl: "9-13",
      formasi: 4,
    },
    {
      prl: "12",
      formasi: 47,
    },
    {
      prl: "11-12",
      formasi: 18,
    },
    {
      prl: "10-12",
      formasi: 36,
    },
    {
      prl: "8-12",
      formasi: 4,
    },
    {
      prl: "11",
      formasi: 5,
    },
    {
      prl: "10-11",
      formasi: 58,
    },
    {
      prl: "8-11",
      formasi: 53,
    },
    {
      prl: "10",
      formasi: 11,
    },
    {
      prl: "9-10",
      formasi: 1,
    },
    {
      prl: "8-10",
      formasi: 58,
    },
  ],
  "Regional Jawa Bagian Barat": [
    {
      prl: "24",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 2,
    },
    {
      prl: "20",
      formasi: 3,
    },
    {
      prl: "19",
      formasi: 6,
    },
    {
      prl: "18",
      formasi: 16,
    },
    {
      prl: "18",
      formasi: 1,
    },
    {
      prl: "17",
      formasi: 20,
    },
    {
      prl: "16-17",
      formasi: 2,
    },
    {
      prl: "16",
      formasi: 18,
    },
    {
      prl: "14-16",
      formasi: 1,
    },
    {
      prl: "12-16",
      formasi: 16,
    },
    {
      prl: "15",
      formasi: 40,
    },
    {
      prl: "14-15",
      formasi: 35,
    },
    {
      prl: "13-15",
      formasi: 4,
    },
    {
      prl: "12-15",
      formasi: 17,
    },
    {
      prl: "14",
      formasi: 40,
    },
    {
      prl: "13-14",
      formasi: 1,
    },
    {
      prl: "12-14",
      formasi: 26,
    },
    {
      prl: "10-14",
      formasi: 6,
    },
    {
      prl: "13",
      formasi: 40,
    },
    {
      prl: "12-13",
      formasi: 67,
    },
    {
      prl: "10-13",
      formasi: 29,
    },
    {
      prl: "12",
      formasi: 26,
    },
    {
      prl: "11-12",
      formasi: 20,
    },
    {
      prl: "10-12",
      formasi: 40,
    },
    {
      prl: "8-12",
      formasi: 1,
    },
    {
      prl: "11",
      formasi: 5,
    },
    {
      prl: "10-11",
      formasi: 53,
    },
    {
      prl: "8-11",
      formasi: 28,
    },
    {
      prl: "10",
      formasi: 14,
    },
    {
      prl: "8-10",
      formasi: 33,
    },
  ],
  "Regional Jawa Bagian Tengah": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 2,
    },
    {
      prl: "18",
      formasi: 7,
    },
    {
      prl: "17",
      formasi: 14,
    },
    {
      prl: "16-17",
      formasi: 1,
    },
    {
      prl: "16",
      formasi: 16,
    },
    {
      prl: "14-16",
      formasi: 1,
    },
    {
      prl: "15",
      formasi: 16,
    },
    {
      prl: "14-15",
      formasi: 14,
    },
    {
      prl: "12-15",
      formasi: 11,
    },
    {
      prl: "14",
      formasi: 28,
    },
    {
      prl: "13-14",
      formasi: 7,
    },
    {
      prl: "12-14",
      formasi: 9,
    },
    {
      prl: "10-14",
      formasi: 6,
    },
    {
      prl: "13",
      formasi: 35,
    },
    {
      prl: "12-13",
      formasi: 26,
    },
    {
      prl: "11-13",
      formasi: 1,
    },
    {
      prl: "10-13",
      formasi: 15,
    },
    {
      prl: "12",
      formasi: 36,
    },
    {
      prl: "11-12",
      formasi: 11,
    },
    {
      prl: "10-12",
      formasi: 37,
    },
    {
      prl: "8-12",
      formasi: 1,
    },
    {
      prl: "10-11",
      formasi: 31,
    },
    {
      prl: "8-11",
      formasi: 36,
    },
    {
      prl: "8-10",
      formasi: 26,
    },
    {
      prl: "8-9",
      formasi: 2,
    },
  ],
  "Regional Kalimantan": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 2,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 4,
    },
    {
      prl: "18",
      formasi: 6,
    },
    {
      prl: "17",
      formasi: 15,
    },
    {
      prl: "16-17",
      formasi: 1,
    },
    {
      prl: "16",
      formasi: 18,
    },
    {
      prl: "14-16",
      formasi: 1,
    },
    {
      prl: "15",
      formasi: 19,
    },
    {
      prl: "14-15",
      formasi: 13,
    },
    {
      prl: "13-15",
      formasi: 1,
    },
    {
      prl: "12-15",
      formasi: 11,
    },
    {
      prl: "14",
      formasi: 30,
    },
    {
      prl: "13-14",
      formasi: 6,
    },
    {
      prl: "12-14",
      formasi: 12,
    },
    {
      prl: "10-14",
      formasi: 9,
    },
    {
      prl: "13",
      formasi: 28,
    },
    {
      prl: "12-13",
      formasi: 20,
    },
    {
      prl: "10-13",
      formasi: 20,
    },
    {
      prl: "9-13",
      formasi: 4,
    },
    {
      prl: "12",
      formasi: 42,
    },
    {
      prl: "11-12",
      formasi: 9,
    },
    {
      prl: "10-12",
      formasi: 27,
    },
    {
      prl: "8-12",
      formasi: 1,
    },
    {
      prl: "10-11",
      formasi: 26,
    },
    {
      prl: "8-11",
      formasi: 36,
    },
    {
      prl: "10",
      formasi: 2,
    },
    {
      prl: "8-10",
      formasi: 37,
    },
    {
      prl: "8-9",
      formasi: 1,
    },
  ],
  "Regional Papua-Maluku": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 1,
    },
    {
      prl: "19",
      formasi: 3,
    },
    {
      prl: "18",
      formasi: 4,
    },
    {
      prl: "17",
      formasi: 10,
    },
    {
      prl: "16-17",
      formasi: 1,
    },
    {
      prl: "16",
      formasi: 20,
    },
    {
      prl: "14-16",
      formasi: 1,
    },
    {
      prl: "15",
      formasi: 14,
    },
    {
      prl: "14-15",
      formasi: 5,
    },
    {
      prl: "13-15",
      formasi: 1,
    },
    {
      prl: "12-15",
      formasi: 9,
    },
    {
      prl: "14",
      formasi: 37,
    },
    {
      prl: "13-14",
      formasi: 12,
    },
    {
      prl: "12-14",
      formasi: 6,
    },
    {
      prl: "10-14",
      formasi: 8,
    },
    {
      prl: "13",
      formasi: 20,
    },
    {
      prl: "12-13",
      formasi: 17,
    },
    {
      prl: "10-13",
      formasi: 15,
    },
    {
      prl: "12",
      formasi: 48,
    },
    {
      prl: "11-12",
      formasi: 4,
    },
    {
      prl: "10-12",
      formasi: 21,
    },
    {
      prl: "8-12",
      formasi: 7,
    },
    {
      prl: "10-11",
      formasi: 38,
    },
    {
      prl: "8-11",
      formasi: 21,
    },
    {
      prl: "10",
      formasi: 10,
    },
    {
      prl: "8-10",
      formasi: 52,
    },
    {
      prl: "8-9",
      formasi: 1,
    },
  ],
  "Regional Sulawesi": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 3,
    },
    {
      prl: "19",
      formasi: 2,
    },
    {
      prl: "18",
      formasi: 6,
    },
    {
      prl: "17",
      formasi: 14,
    },
    {
      prl: "16-17",
      formasi: 1,
    },
    {
      prl: "16",
      formasi: 17,
    },
    {
      prl: "14-16",
      formasi: 1,
    },
    {
      prl: "15",
      formasi: 22,
    },
    {
      prl: "14-15",
      formasi: 10,
    },
    {
      prl: "13-15",
      formasi: 2,
    },
    {
      prl: "12-15",
      formasi: 10,
    },
    {
      prl: "11-15",
      formasi: 8,
    },
    {
      prl: "14",
      formasi: 25,
    },
    {
      prl: "13-14",
      formasi: 7,
    },
    {
      prl: "12-14",
      formasi: 16,
    },
    {
      prl: "13",
      formasi: 27,
    },
    {
      prl: "12-13",
      formasi: 25,
    },
    {
      prl: "10-13",
      formasi: 14,
    },
    {
      prl: "9-13",
      formasi: 4,
    },
    {
      prl: "12",
      formasi: 43,
    },
    {
      prl: "11-12",
      formasi: 9,
    },
    {
      prl: "10-12",
      formasi: 20,
    },
    {
      prl: "8-12",
      formasi: 3,
    },
    {
      prl: "10-11",
      formasi: 37,
    },
    {
      prl: "8-11",
      formasi: 30,
    },
    {
      prl: "10",
      formasi: 4,
    },
    {
      prl: "8-10",
      formasi: 43,
    },
    {
      prl: "8-9",
      formasi: 1,
    },
  ],
  "Regional Sumbagsel": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 2,
    },
    {
      prl: "18",
      formasi: 4,
    },
    {
      prl: "17",
      formasi: 16,
    },
    {
      prl: "16-17",
      formasi: 1,
    },
    {
      prl: "16",
      formasi: 15,
    },
    {
      prl: "14-16",
      formasi: 1,
    },
    {
      prl: "15",
      formasi: 18,
    },
    {
      prl: "14-15",
      formasi: 11,
    },
    {
      prl: "12-15",
      formasi: 10,
    },
    {
      prl: "14",
      formasi: 26,
    },
    {
      prl: "13-14",
      formasi: 7,
    },
    {
      prl: "12-14",
      formasi: 12,
    },
    {
      prl: "10-14",
      formasi: 4,
    },
    {
      prl: "13",
      formasi: 18,
    },
    {
      prl: "12-13",
      formasi: 21,
    },
    {
      prl: "10-13",
      formasi: 19,
    },
    {
      prl: "12",
      formasi: 32,
    },
    {
      prl: "11-12",
      formasi: 9,
    },
    {
      prl: "10-12",
      formasi: 36,
    },
    {
      prl: "10-11",
      formasi: 26,
    },
    {
      prl: "8-11",
      formasi: 21,
    },
    {
      prl: "10",
      formasi: 8,
    },
    {
      prl: "8-10",
      formasi: 25,
    },
    {
      prl: "8-9",
      formasi: 4,
    },
  ],
  "Regional Sumbagut": [
    {
      prl: "23",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 2,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 5,
    },
    {
      prl: "18",
      formasi: 15,
    },
    {
      prl: "17",
      formasi: 19,
    },
    {
      prl: "16-17",
      formasi: 2,
    },
    {
      prl: "16",
      formasi: 13,
    },
    {
      prl: "14-16",
      formasi: 1,
    },
    {
      prl: "15",
      formasi: 29,
    },
    {
      prl: "14-15",
      formasi: 27,
    },
    {
      prl: "13-15",
      formasi: 4,
    },
    {
      prl: "12-15",
      formasi: 17,
    },
    {
      prl: "11-15",
      formasi: 14,
    },
    {
      prl: "14",
      formasi: 33,
    },
    {
      prl: "13-14",
      formasi: 1,
    },
    {
      prl: "12-14",
      formasi: 19,
    },
    {
      prl: "13",
      formasi: 34,
    },
    {
      prl: "12-13",
      formasi: 47,
    },
    {
      prl: "10-13",
      formasi: 35,
    },
    {
      prl: "9-13",
      formasi: 4,
    },
    {
      prl: "12",
      formasi: 46,
    },
    {
      prl: "11-12",
      formasi: 7,
    },
    {
      prl: "10-12",
      formasi: 30,
    },
    {
      prl: "8-12",
      formasi: 5,
    },
    {
      prl: "11",
      formasi: 2,
    },
    {
      prl: "10-11",
      formasi: 39,
    },
    {
      prl: "8-11",
      formasi: 43,
    },
    {
      prl: "10",
      formasi: 2,
    },
    {
      prl: "9-10",
      formasi: 1,
    },
    {
      prl: "8-10",
      formasi: 55,
    },
    {
      prl: "8-9",
      formasi: 2,
    },
  ],
};

//data person grade gabungan kantor pusat dan regional
const dataPersonGradeAll = [
  { prl: "28", formasi: 1 },
  { prl: "26", formasi: 4 },
  { prl: "25", formasi: 3 },
  { prl: "24", formasi: 8 },
  { prl: "23", formasi: 16 },
  { prl: "22", formasi: 14 },
  { prl: "21", formasi: 41 },
  { prl: "20", formasi: 74 },
  { prl: "19", formasi: 71 },
  { prl: "18", formasi: 174 },
  { prl: "17", formasi: 276 },
  { prl: "16", formasi: 302 },
  { prl: "15", formasi: 649 },
  { prl: "14", formasi: 721 },
  { prl: "13", formasi: 767 },
  { prl: "12", formasi: 850 },
  { prl: "11", formasi: 521 },
  { prl: "10", formasi: 402 },
  { prl: "9", formasi: 33 },
  { prl: "8", formasi: 93 },
];

//data person grade untuk kantor pusat
const dataPersonGradeKantorPusat = {
  Keuangan: [
    {
      prl: "25",
      formasi: 1,
    },
    {
      prl: "23",
      formasi: 2,
    },
    {
      prl: "21",
      formasi: 3,
    },
    {
      prl: "20",
      formasi: 6,
    },
    {
      prl: "19",
      formasi: 3,
    },
    {
      prl: "18",
      formasi: 3,
    },
    {
      prl: "17",
      formasi: 13,
    },
    {
      prl: "16",
      formasi: 8,
    },
    {
      prl: "15",
      formasi: 32,
    },
    {
      prl: "14",
      formasi: 23,
    },
    {
      prl: "13",
      formasi: 9,
    },
    {
      prl: "12",
      formasi: 1,
    },
  ],
  "Manajemen Risiko": [
    {
      prl: "25",
      formasi: 1,
    },
    {
      prl: "23",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 2,
    },
    {
      prl: "21",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 3,
    },
    {
      prl: "19",
      formasi: 2,
    },
    {
      prl: "18",
      formasi: 4,
    },
    {
      prl: "17",
      formasi: 4,
    },
    {
      prl: "15",
      formasi: 10,
    },
    {
      prl: "14",
      formasi: 1,
    },
    {
      prl: "13",
      formasi: 1,
    },
    {
      prl: "12",
      formasi: 1,
    },
    {
      prl: "11",
      formasi: 1,
    },
  ],
  "Pemasaran Pusat & Niaga": [
    {
      prl: "26",
      formasi: 1,
    },
    {
      prl: "24",
      formasi: 3,
    },
    {
      prl: "23",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 8,
    },
    {
      prl: "20",
      formasi: 8,
    },
    {
      prl: "19",
      formasi: 8,
    },
    {
      prl: "18",
      formasi: 23,
    },
    {
      prl: "17",
      formasi: 26,
    },
    {
      prl: "16",
      formasi: 38,
    },
    {
      prl: "15",
      formasi: 26,
    },
    {
      prl: "14",
      formasi: 36,
    },
    {
      prl: "13",
      formasi: 12,
    },
    {
      prl: "12",
      formasi: 18,
    },
    {
      prl: "11",
      formasi: 1,
    },
    {
      prl: "10",
      formasi: 1,
    },
  ],
  "Pemasaran Regional": [
    {
      prl: "26",
      formasi: 1,
    },
    {
      prl: "24",
      formasi: 2,
    },
    {
      prl: "23",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 3,
    },
    {
      prl: "20",
      formasi: 6,
    },
    {
      prl: "19",
      formasi: 6,
    },
    {
      prl: "18",
      formasi: 9,
    },
    {
      prl: "17",
      formasi: 12,
    },
    {
      prl: "16",
      formasi: 25,
    },
    {
      prl: "15",
      formasi: 27,
    },
    {
      prl: "14",
      formasi: 20,
    },
    {
      prl: "13",
      formasi: 15,
    },
    {
      prl: "12",
      formasi: 14,
    },
  ],
  "Perencanaan & Pengembangan Bisnis": [
    {
      prl: "26",
      formasi: 1,
    },
    {
      prl: "24",
      formasi: 1,
    },
    {
      prl: "23",
      formasi: 2,
    },
    {
      prl: "21",
      formasi: 2,
    },
    {
      prl: "20",
      formasi: 5,
    },
    {
      prl: "19",
      formasi: 4,
    },
    {
      prl: "18",
      formasi: 8,
    },
    {
      prl: "17",
      formasi: 15,
    },
    {
      prl: "16",
      formasi: 4,
    },
    {
      prl: "15",
      formasi: 13,
    },
    {
      prl: "14",
      formasi: 9,
    },
    {
      prl: "13",
      formasi: 6,
    },
    {
      prl: "12",
      formasi: 11,
    },
  ],
  "Rekayasa & Infrastruktur Darat": [
    {
      prl: "26",
      formasi: 1,
    },
    {
      prl: "24",
      formasi: 1,
    },
    {
      prl: "23",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 4,
    },
    {
      prl: "20",
      formasi: 9,
    },
    {
      prl: "19",
      formasi: 5,
    },
    {
      prl: "18",
      formasi: 24,
    },
    {
      prl: "17",
      formasi: 36,
    },
    {
      prl: "16",
      formasi: 45,
    },
    {
      prl: "15",
      formasi: 50,
    },
    {
      prl: "14",
      formasi: 65,
    },
    {
      prl: "13",
      formasi: 33,
    },
    {
      prl: "12",
      formasi: 38,
    },
  ],
  "SDM & Penunjang Bisnis": [
    {
      prl: "25",
      formasi: 1,
    },
    {
      prl: "23",
      formasi: 2,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 2,
    },
    {
      prl: "20",
      formasi: 10,
    },
    {
      prl: "19",
      formasi: 5,
    },
    {
      prl: "18",
      formasi: 10,
    },
    {
      prl: "17",
      formasi: 19,
    },
    {
      prl: "16",
      formasi: 12,
    },
    {
      prl: "15",
      formasi: 74,
    },
    {
      prl: "14",
      formasi: 23,
    },
    {
      prl: "13",
      formasi: 19,
    },
    {
      prl: "12",
      formasi: 2,
    },
    {
      prl: "11",
      formasi: 1,
    },
  ],
  Utama: [
    {
      prl: "28",
      formasi: 1,
    },
    {
      prl: "23",
      formasi: 4,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 5,
    },
    {
      prl: "20",
      formasi: 9,
    },
    {
      prl: "19",
      formasi: 7,
    },
    {
      prl: "18",
      formasi: 14,
    },
    {
      prl: "17",
      formasi: 13,
    },
    {
      prl: "16",
      formasi: 18,
    },
    {
      prl: "15",
      formasi: 22,
    },
    {
      prl: "14",
      formasi: 19,
    },
    {
      prl: "13",
      formasi: 15,
    },
    {
      prl: "12",
      formasi: 2,
    },
  ],
};

//data person grade untuk regional
const dataPersonGradeRegional = {
  "Regional Jatimbalinus": [
    {
      prl: "23",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 3,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 6,
    },
    {
      prl: "18",
      formasi: 16,
    },
    {
      prl: "17",
      formasi: 20,
    },
    {
      prl: "16",
      formasi: 23,
    },
    {
      prl: "15",
      formasi: 83,
    },
    {
      prl: "14",
      formasi: 91,
    },
    {
      prl: "13",
      formasi: 124,
    },
    {
      prl: "12",
      formasi: 122,
    },
    {
      prl: "11",
      formasi: 110,
    },
    {
      prl: "10",
      formasi: 68,
    },
    {
      prl: "9",
      formasi: 6,
    },
    {
      prl: "8",
      formasi: 10,
    },
  ],
  "Regional Jawa Bagian Barat": [
    {
      prl: "24",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 2,
    },
    {
      prl: "20",
      formasi: 3,
    },
    {
      prl: "19",
      formasi: 6,
    },
    {
      prl: "18",
      formasi: 17,
    },
    {
      prl: "17",
      formasi: 21,
    },
    {
      prl: "16",
      formasi: 26,
    },
    {
      prl: "15",
      formasi: 85,
    },
    {
      prl: "14",
      formasi: 84,
    },
    {
      prl: "13",
      formasi: 125,
    },
    {
      prl: "12",
      formasi: 95,
    },
    {
      prl: "11",
      formasi: 79,
    },
    {
      prl: "10",
      formasi: 56,
    },
    {
      prl: "9",
      formasi: 1,
    },
    {
      prl: "8",
      formasi: 10,
    },
  ],
  "Regional Jawa Bagian Tengah": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 2,
    },
    {
      prl: "18",
      formasi: 7,
    },
    {
      prl: "17",
      formasi: 15,
    },
    {
      prl: "16",
      formasi: 16,
    },
    {
      prl: "15",
      formasi: 32,
    },
    {
      prl: "14",
      formasi: 52,
    },
    {
      prl: "13",
      formasi: 69,
    },
    {
      prl: "12",
      formasi: 95,
    },
    {
      prl: "11",
      formasi: 52,
    },
    {
      prl: "10",
      formasi: 41,
    },
    {
      prl: "9",
      formasi: 2,
    },
    {
      prl: "8",
      formasi: 6,
    },
  ],
  "Regional Kalimantan": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 2,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 4,
    },
    {
      prl: "18",
      formasi: 6,
    },
    {
      prl: "17",
      formasi: 16,
    },
    {
      prl: "16",
      formasi: 18,
    },
    {
      prl: "15",
      formasi: 32,
    },
    {
      prl: "14",
      formasi: 65,
    },
    {
      prl: "13",
      formasi: 66,
    },
    {
      prl: "12",
      formasi: 86,
    },
    {
      prl: "11",
      formasi: 55,
    },
    {
      prl: "10",
      formasi: 37,
    },
    {
      prl: "9",
      formasi: 5,
    },
    {
      prl: "8",
      formasi: 9,
    },
  ],
  "Regional Papua-Maluku": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 1,
    },
    {
      prl: "19",
      formasi: 3,
    },
    {
      prl: "18",
      formasi: 4,
    },
    {
      prl: "17",
      formasi: 11,
    },
    {
      prl: "16",
      formasi: 21,
    },
    {
      prl: "15",
      formasi: 19,
    },
    {
      prl: "14",
      formasi: 60,
    },
    {
      prl: "13",
      formasi: 45,
    },
    {
      prl: "12",
      formasi: 90,
    },
    {
      prl: "11",
      formasi: 46,
    },
    {
      prl: "10",
      formasi: 64,
    },
    {
      prl: "9",
      formasi: 7,
    },
    {
      prl: "8",
      formasi: 15,
    },
  ],
  "Regional Sulawesi": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 3,
    },
    {
      prl: "19",
      formasi: 2,
    },
    {
      prl: "18",
      formasi: 6,
    },
    {
      prl: "17",
      formasi: 15,
    },
    {
      prl: "16",
      formasi: 17,
    },
    {
      prl: "15",
      formasi: 42,
    },
    {
      prl: "14",
      formasi: 44,
    },
    {
      prl: "13",
      formasi: 71,
    },
    {
      prl: "12",
      formasi: 81,
    },
    {
      prl: "11",
      formasi: 58,
    },
    {
      prl: "10",
      formasi: 48,
    },
    {
      prl: "9",
      formasi: 5,
    },
    {
      prl: "8",
      formasi: 12,
    },
  ],
  "Regional Sumbagsel": [
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 1,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 2,
    },
    {
      prl: "18",
      formasi: 4,
    },
    {
      prl: "17",
      formasi: 17,
    },
    {
      prl: "16",
      formasi: 15,
    },
    {
      prl: "15",
      formasi: 29,
    },
    {
      prl: "14",
      formasi: 54,
    },
    {
      prl: "13",
      formasi: 52,
    },
    {
      prl: "12",
      formasi: 83,
    },
    {
      prl: "11",
      formasi: 41,
    },
    {
      prl: "10",
      formasi: 34,
    },
    {
      prl: "9",
      formasi: 3,
    },
    {
      prl: "8",
      formasi: 12,
    },
  ],
  "Regional Sumbagut": [
    {
      prl: "23",
      formasi: 1,
    },
    {
      prl: "22",
      formasi: 1,
    },
    {
      prl: "21",
      formasi: 2,
    },
    {
      prl: "20",
      formasi: 2,
    },
    {
      prl: "19",
      formasi: 5,
    },
    {
      prl: "18",
      formasi: 15,
    },
    {
      prl: "17",
      formasi: 21,
    },
    {
      prl: "16",
      formasi: 13,
    },
    {
      prl: "15",
      formasi: 71,
    },
    {
      prl: "14",
      formasi: 67,
    },
    {
      prl: "13",
      formasi: 99,
    },
    {
      prl: "12",
      formasi: 107,
    },
    {
      prl: "11",
      formasi: 77,
    },
    {
      prl: "10",
      formasi: 53,
    },
    {
      prl: "9",
      formasi: 4,
    },
    {
      prl: "8",
      formasi: 19,
    },
  ],
};

//chart funnel
const chartJG = {
  data: {
    labels: [
      "Step 1",
      "Step 2",
      "Step 3",
      "Step 4",
      "Step 5",
      "Step 6",
      "Step 7",
      "Step 8",
      "Step 9",
      "Step 10",
      "Step 11",
      "Step 12",
      "Step 13",
      "Step 14",
      "Step 15",
    ],
    datasets: [
      {
        data: [6, 19, 3, 6, 19, 3, 6, 19, 3, 6, 19, 3, 6, 19, 3],
        backgroundColor: "#549DC5",
        shrinkAnchor: "none",
        barPercentage: 0.8, // Adjust bar width to create space
        categoryPercentage: 0.8, // Adjust category width to create space
        datalabels: {
          formatter: (v) => v.toLocaleString(),
          font: {
            size: 14,
          },
        },
      },
    ],
  },
};
// chart pg mirip dengan jg

// ==========================================
// tab rasci
// ==========================================

// section RASCI Notations by Business Process Level
const dataRasciNotBPL = {
  RasciNotation: {
    accountable: {
      L1: 13,
      L2: 144,
      L3: 1747,
      L4: 7088,
      L5: 32711,
      L6: 66,
    },
    responsible: {
      L1: 63,
      L2: 683,
      L3: 3327,
      L4: 20126,
      L5: 174484,
      L6: 48723,
    },
    support: {
      L1: 0,
      L2: 0,
      L3: 39,
      L4: 572,
      L5: 20,
      L6: 0,
    },
    consulted: {
      L1: 0,
      L2: 0,
      L3: 1,
      L4: 170,
      L5: 4,
      L6: 0,
    },
    informed: {
      L1: 0,
      L2: 0,
      L3: 13,
      L4: 234,
      L5: 10,
      L6: 37,
    },
  },
};

// section RASCI Notations by Position Level
const dataRasciNotPL = {
  RasciNotation: {
    accountable: {
      Director: 80,
      "VP/EGM/GHO": 144,
      "Manager/Region Manager/Area manager/Sales Area Manager/Setara": 1300,
      "Asst. Manager/Sr. Analyst/Setara": 970,
      "Sr. Supervisor/Analyst/Setara": 2800,
      "Supervisor/Jr. Analyst/Setara": 1800,
      "Jr. Supervisor/Jr. Assistant/Setara": 5500,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 1800,
    },
    responsible: {
      Director: 40,
      "VP/EGM/GHO": 683,
      "Manager/Region Manager/Area manager/Sales Area Manager/Setara": 800,
      "Asst. Manager/Sr. Analyst/Setara": 2000,
      " Sr. Supervisor/Analyst/Setara": 4000,
      "Supervisor/Jr. Analyst/Setara": 2000,
      "Jr. Supervisor/Jr. Assistant/Setara": 7000,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 800,
    },
    support: {
      Director: 0,
      "VP/EGM/GHO": 20,
      "Manager/Region Manager/Area manager/Sales Area Manager/Setara": 50,
      "Asst. Manager/Sr. Analyst/Setara": 15,
      " Sr. Supervisor/Analyst/Setara": 15,
      "Supervisor/Jr. Analyst/Setara": 8,
      "Jr. Supervisor/Jr. Assistant/Setara": 56,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 65,
    },
    consulted: {
      Director: 0,
      "VP/EGM/GHO": 10,
      "Manager/Region Manager/Area manager/Sales Area Manager/Setara": 40,
      "Asst. Manager/Sr. Analyst/Setara": 8,
      " Sr. Supervisor/Analyst/Setara": 8,
      "Supervisor/Jr. Analyst/Setara": 5,
      "Jr. Supervisor/Jr. Assistant/Setara": 23,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 40,
    },
    informed: {
      Director: 0,
      "VP/EGM/GHO": 5,
      "Manager/Region Manager/Area manager/Sales Area Manager/Setara": 10,
      "Asst. Manager/Sr. Analyst/Setara": 5,
      " Sr. Supervisor/Analyst/Setara": 5,
      "Supervisor/Jr. Analyst/Setara": 3,
      "Jr. Supervisor/Jr. Assistant/Setara": 51,
      "Jr. Operator/Jr. Technician/Administrator/Setara": 5,
    },
  },
};

// section RASCI Notations vs Total Formation
const dataRasciNotVFor = {
  totalFormation: {
    direktoratUtama: 157,
    direktoratPerencanaandanPengembanganBisnis: 81,
    direktoratPemasaranPusatdanNiaga: 216,
    direktoratPemasaranRegional: 1219,
    direktoratRekayasadanInfrastrukturDarat: 3030,
    direktoratKeuangan: 104,
    direktoratSDMdanPenunjangBisnis: 181,
    direktoratManajemenRisiko: 32,
  },
  totalRasciNotation: {
    accountable: {
      direktoratUtama: 747,
      direktoratPerencanaandanPengembanganBisnis: 776,
      direktoratPemasaranPusatdanNiaga: 1327,
      direktoratPemasaranRegional: 10608,
      direktoratRekayasadanInfrastrukturDarat: 27039,
      direktoratKeuangan: 191,
      direktoratSDMdanPenunjangBisnis: 805,
      direktoratManajemenRisiko: 276,
    },
    responsible: {
      direktoratUtama: 4415,
      direktoratPerencanaandanPengembanganBisnis: 4595,
      direktoratPemasaranPusatdanNiaga: 7863,
      direktoratPemasaranRegional: 62834,
      direktoratRekayasadanInfrastrukturDarat: 160155,
      direktoratKeuangan: 1134,
      direktoratSDMdanPenunjangBisnis: 4770,
      direktoratManajemenRisiko: 1636,
    },
    support: {
      direktoratUtama: 13,
      direktoratPerencanaandanPengembanganBisnis: 12,
      direktoratPemasaranPusatdanNiaga: 21,
      direktoratPemasaranRegional: 170,
      direktoratRekayasadanInfrastrukturDarat: 433,
      direktoratKeuangan: 3,
      direktoratSDMdanPenunjangBisnis: 13,
      direktoratManajemenRisiko: 4,
    },
    consulted: {
      direktoratUtama: 4,
      direktoratPerencanaandanPengembanganBisnis: 3,
      direktoratPemasaranPusatdanNiaga: 6,
      direktoratPemasaranRegional: 44,
      direktoratRekayasadanInfrastrukturDarat: 113,
      direktoratKeuangan: 1,
      direktoratSDMdanPenunjangBisnis: 4,
      direktoratManajemenRisiko: 2,
    },
    informed: {
      direktoratUtama: 5,
      direktoratPerencanaandanPengembanganBisnis: 5,
      direktoratPemasaranPusatdanNiaga: 8,
      direktoratPemasaranRegional: 65,
      direktoratRekayasadanInfrastrukturDarat: 166,
      direktoratKeuangan: 1,
      direktoratSDMdanPenunjangBisnis: 5,
      direktoratManajemenRisiko: 2,
    },
  },
};

// ==========================================
// tab competency
// ==========================================

// section Top 10 Technical Competency Specific
const chartCompetency = {
  labels: [
    "Domestic Supply Management",
    "Sales and Account Management",
    "Promotion and Campaign Management",
    "Channel Management",
    "Handling Customer Complaint",
    "Pipeline Transport Operations & Maintenance",
    "Distribution Management",
    "Stakeholder Management",
    "Supply Planning & Scheduling",
    "Product/Service Development",
  ],
  datasets: [
    {
      label: "VP/EGM/GHO",
      data: [19, 0, 0, 10, 17, 0, 21, 21, 17, 16],
      backgroundColor: "#9999FC",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
    },
    {
      label: "Manager/ Region Manager/ Ar...",
      data: [30, 16, 0, 38, 10, 41, 14, 14, 12, 12],
      backgroundColor: "#7EC67E",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
    },
    {
      label: "Asst. Manager/Sr. Analyst/Set...",
      data: [49, 66, 22, 24, 55, 16, 21, 21, 20, 20],
      backgroundColor: "#7BE5D1",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
    },
    {
      label: "Sr. Supervisor/Analyst/Setara",
      data: [24, 11, 15, 26, 20, 15, 25, 20, 26, 21],
      backgroundColor: "#FDC47E",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
    },
    {
      label: "Supervisor/Jr. Analyst/Setara",
      data: [23, 35, 87, 52, 13, 32, 58, 58, 22, 22],
      backgroundColor: "#76BFFF",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
    },
    {
      label: "Jr. Supervisor/Jr. Assistant/Set...",
      data: [35, 16, 34, 0, 21, 34, 0, 0, 10, 10],
      backgroundColor: "#FFA5C3",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
    },
    {
      label: "Jr. Operator/Jr. Technician/Adm...",
      data: [0, 26, 0, 0, 11, 10, 0, 0, 10, 10],
      backgroundColor: "#B7B7B7",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
    },
  ],
};
