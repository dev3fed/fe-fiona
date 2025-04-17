const url = {
  baseUrl: "http://localhost:5095",
  "api-organization": "api/organization-structure",
};
const tabArray = ["inputAttribute", "inputSubordinate", "inputSgSsg", "preview"];
const tabArrayIndex = ["chart", "draft", "2", "3"];
let statusAction = "add";
let dataAvailable = true;
const token = localStorage.getItem("token");
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const urlParams = new URLSearchParams(window.location.search);
let helperId = "";
const uuid = {
  uniqueCode: "",
  uniquePosCode: "",
};

const selectedData = {
  selectedJobDesc: null,
  selectedJobReference: null,
};

const dataJobDesc = [
  {
    identifikasi: {
      id: 1,
      jobName: "Manager Internal Communication",
      function: "Corporate Secretary",
      location: "Kantor Pusat",
      directorat: "Direktorat Utama",
      directReport: "Corporate Secretary",
      sk: "Kpts-009/PNG000000/2024-S8",
      tanggal: "01 April 2024",
    },
    fungsi: {},
    tugasHa: [],
    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Planning, Budgeting dan Pengelolaan Anggaran</b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
        tugas: [
          "Draft Rencana Kerja dan Anggaran (RKA);",
          "Draft Key Performance Indicator (rencana kinerja) unit kerja/fungsi;",
          "Laporan pertanggungjawaban penggunaan anggaran unit kerja/fungsi.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan HSSE</b> Melaksanakan dan memonitor program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Mengupayakan implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Mengupayakan implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Mengupayakan implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Mengupayakan parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan",
        ],
      },
      {
        id: 3,
        header:
          "<b>Pembinaan Pekerja</b> <ul><li>Mengelola, mengevaluasi, dan memastikan kegiatan perencanaan dan penilaian kinerja pekerja, serta pembimbingan pekerja di unit kerja/fungsi, termasuk pada perilaku indisipliner pekerja.</li><li>Mengelola, mengevaluasi, dan memastikan kebutuhan pelatihan dan pengembangan pekerja di unit kerja/fungsi.</li></ul>",
        tugas: [
          "Usulan terkait dengan:",
          "Rencana kebutuhan pekerja di unit/fungsi;",
          "Target dan ukuran kinerja pekerja;",
          "Laporan monitoring coaching-counseling;",
          "Rencana pengembangan individu (pelatihan dan penugasan);",
          "Hasil penilaian kinerja pekerja.",
        ],
      },
      {
        id: 4,
        header:
          "<b>Sistem Tata Kerja</b> Mengelola, mengevaluasi, dan memastikan penyusunan, sosialisasi dan memonitor pelaksanaan kebijakan, Sistem dan Tata Kerja (STK), di unit kerja/fungsi serta melakukan dan memonitor kegiatan transfer knowledge di unit kerja/fungsi.",
        tugas: [
          "Dokumen Sistem dan Tata Kerja (STK);",
          "Implementasi dan evaluasi STK/TKO;",
          "Laporan kegiatan sharing dan transfer knowledge;",
          "Data aset pengetahuan yang termuktahir.",
        ],
      },
      {
        id: 5,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Mengelola, mengevaluasi, dan memastikan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program budaya risiko, serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Dokumen terkait kepatuhan terhadap standar GCG;",
          "Mengupayakan implementasi program budaya risiko pada segala aspek kegiatan fungsi.",
        ],
      },
      {
        id: 6,
        header:
          "<b>Tindak Lanjut Hasil Audit</b> Mengelola, mengevaluasi, dan memastikan pelaksanaan audit serta monitoring dan tindak lanjut hasil audit di unit kerja/fungsi.",
        tugas: ["Laporan implementasi tidak lanjut hasil audit;", "Kelengkapan data dan dokumen untuk proses audit."],
      },
      {
        id: 7,
        header:
          "<b>Procurement </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengadaan sesuai dengan kewenangan tertentu untuk kebutuhan unit kerja/fungsi.",
        tugas: [
          "Usulan rencana pengadaan;",
          "Dokumen terkait pengadaan barang/jasa;",
          "Tersedianya barang/jasa;",
          "Hasil perhitungan TKDN;",
          "Hasil penilaian kinerja penyedia barang/jasa;",
          "Terlaksananya penerimaan barang/jasa.",
        ],
      },
      {
        id: 8,
        header:
          "<b>Project </b> Mengelola, mengevaluasi, dan memastikan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: [
          "Tersedianya sumber daya yang diperlukan untuk pelaksanaan project;",
          "Terlaksananya eksekusi project;",
          "Tersedianya hasil monitoring dan evaluasi pelaksanaan project.",
        ],
      },
      {
        id: 9,
        header:
          "<b>Pengelolaan Data Insight </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengelolaan, pengolahan, dan penyajian data.",
        tugas: ["Terlaksananya pengelolaan data;", "Tersedianya hasil pengolahan dan penyajian data. "],
      },
    ],
    wewenang: [
      {
        id: 1,
        wewenang: "Menyetujui dan mengelola anggaran sesuai otorisasi yang dimiliki.",
      },
      {
        id: 2,
        wewenang:
          "Melakukan negosiasi dan persetujuan pemenang proses pengadaan barang/jasa sesuai dengan ketentuan yang berlaku.",
      },
      {
        id: 3,
        wewenang: "Menetapkan ketentuan operasional sesuai STK yang berlaku.",
      },
    ],
    koordinasi: [],
    relation: [],
    education: [
      "Sarjana dari berbagai jurusan, diutamakan dari Business Administration/Business Management/Ilmu Komunikasi/Public Relation.",
      "S1 dengan pengalaman kerja 9-12 tahun, atau S2 dengan pengalaman kerja 6–9 tahun.",
      "Pengalaman Kerja di bidang Corporate Communicaton & Relation Management, diutamakan di bidang Corporate Communication.",
      "3-6 tahun menjabat posisi setingkat Sr. Analyst atau Assistant Manager.",
    ],
    persyaratanKhusus: [],
    komtekMandatori: [],
    komtekGeneral: [],
    komtekSpesifik: [],
    komper: [],
  },
  {
    identifikasi: {
      id: 2,
      jobName: "SBM Sumsel VI Gas",
      function: "Regional Sumbagsel/Retail Sales Sumbagsel",
      location: "Banyuasin",
      directorat: "Pemasaran Regional ",
      directReport: "SAM Retail Sumsel",
      sk: "Kpts-009/PNG000000/2024-S8",
      tanggal: "01 April 2024",
    },
    fungsi: "",
    tugasHa: [],
    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Laporan implementasi kepatuhan terhadap standar GCG;",
          "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
        ],
      },
      {
        id: 3,
        header:
          "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: ["Terlaksananya eksekusi project."],
      },
    ],
    wewenang: [],
    koordinasi: [],
    relation: [],
    education: [],
    persyaratanKhusus: [],
    komtekMandatori: [],
    komtekGeneral: [],
    komtekSpesifik: [],
    komper: [],
  },
  // {
  //   identifikasi: {
  //     id: 2,
  //     jobName: "SAM Retail Sumsel",
  //     function: "Regional Sumbagsel/Retail Sales Sumbagsel",
  //     location: "Palembang",
  //     directorat: "Pemasaran Regional ",
  //     directReport: "Region Manager Retail Sales Sumbagsel",
  //     sk: "Kpts-009/PNG000000/2024-S8",
  //     tanggal: "01 April 2024",
  //   },
  //   fungsi:
  //     "Mengarahkan dan mengevaluasi penyusunan sales planning, pelaksanaan sales  produk dan kegiatan penyaluran, pengelolaan channel terkait penjualan, kegiatan promosi, pengelolaan keluhan pelanggan dan kegiatan relasi dengan pelanggan terkait penjualan, pengelolaan roll out  digitalisasi pada kegiatan channel retail, serta kegiatan relasi dengan stakeholder terkait penjualan produk fuel dan gas yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //   tugasHa: [
  //     {
  //       id: 1,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi penyusunan sales planning produk fuel dan gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Tersedianya sales forecast (pragnosa revenue);",
  //         "Tersedianya sales goals (target, strategi dan rencana penjualan).",
  //       ],
  //       lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
  //     },
  //     {
  //       id: 2,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi pelaksanaan sales  dan penyaluran produk fuel dan gas melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Terlaksananya pemantauan stock fuel yang ada pada channel;",
  //         "Terlaksananya kegiatan penyaluran channel kepada konsumen;",
  //         "Terlaksananya identifikasi kondisi pasar di sekitar channel.",
  //       ],
  //       lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
  //     },
  //     {
  //       id: 3,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi channel terkait penjualan fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Terlaksananya monitoring dan evaluasi penjualan channel;",
  //         "Terlaksananya pemberian reward dan konsekuensi terkait kinerja channel;",
  //         "Terlaksananya evaluasi termasuk tindak lanjut evaluasi serta rekomendasi terhadap kegiatan penyaluran.",
  //       ],
  //       lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
  //     },
  //     {
  //       id: 4,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Terlaksananya identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
  //         "Terlaksananya analisis kelayakan pengembangan jaringan dan layanan channel;",
  //         "Terlaksananya proses peluang channel baru.",
  //       ],
  //       lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
  //     },
  //     {
  //       id: 5,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan promosi terkait penjualan produk fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Tersedianya usulan objective promosi produk/layanan dari seluruh wilayah;",
  //         "Tersedianya usulan tema promosi;",
  //         "Terlaksananya kerja sama dengan pihak terkait dalam eksekusi program promosi;",
  //         "Terlaksananya evaluasi program promosi;",
  //         "Terlaksananya tindak lanjut program promosi.",
  //       ],
  //       lead: ["Tingkat efektivitas kegiatan promosi"],
  //     },
  //     {
  //       id: 6,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan pengelolaan keluhan pelanggan dan kegiatan relasi dengan pelanggan terkait penjualan produk gas dan fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Terlaksananya tindak lanjut penanganan saran dan keluhan pelanggan;",
  //         "Terlaksananya tindak lanjut permintaan pelanggan;",
  //         "Tersedianya program pembinaan relasi dengan pelanggan;",
  //         "Terlaksananya kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
  //       ],
  //       lead: [
  //         "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
  //         "Customer satisfaction index;",
  //         "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Tersedianya rencana digitalisasi channel;",
  //         "Terlaksananya implementasi digitalisasi channel;",
  //         "Tersedianya hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
  //         "Tersedianya data transaksi pada kegiatan channel.",
  //       ],
  //       lead: [
  //         "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
  //         "Tingkat ketersediaan data transaksi pada kegiatan channel.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan relasi dengan stakeholder terkait penjualan produk fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel",
  //       output: ["Terlaksananya relasi dengan pihak stakeholder."],
  //       lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
  //     },
  //   ],
  //   tugasUmum: [
  //     {
  //       id: 1,
  //       header:
  //         "<b>Planning, Budgeting dan Pengelolaan Anggaran</b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
  //       tugas: [
  //         "Draft Rencana Kerja dan Anggaran (RKA);",
  //         "Draft Key Performance Indicator (rencana kinerja) unit kerja/fungsi;",
  //         "Laporan pertanggungjawaban penggunaan anggaran unit kerja/fungsi.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       header:
  //         "<b>Pengelolaan HSSE</b> Melaksanakan dan memonitor program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
  //       tugas: [
  //         "Mengupayakan implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
  //         "Mengupayakan implementasi kebijakan perusahaan terkait aspek HSSE;",
  //         "Mengupayakan implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
  //         "Mengupayakan parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan",
  //       ],
  //     },
  //     {
  //       id: 3,
  //       header:
  //         "<b>Pembinaan Pekerja</b> <ul><li>Mengelola, mengevaluasi, dan memastikan kegiatan perencanaan dan penilaian kinerja pekerja, serta pembimbingan pekerja di unit kerja/fungsi, termasuk pada perilaku indisipliner pekerja.</li><li>Mengelola, mengevaluasi, dan memastikan kebutuhan pelatihan dan pengembangan pekerja di unit kerja/fungsi.</li></ul>",
  //       tugas: [
  //         "Usulan terkait dengan:",
  //         "Rencana kebutuhan pekerja di unit/fungsi;",
  //         "Target dan ukuran kinerja pekerja;",
  //         "Laporan monitoring coaching-counseling;",
  //         "Rencana pengembangan individu (pelatihan dan penugasan);",
  //         "Hasil penilaian kinerja pekerja.",
  //       ],
  //     },
  //     {
  //       id: 4,
  //       header:
  //         "<b>Sistem Tata Kerja</b> Mengelola, mengevaluasi, dan memastikan penyusunan, sosialisasi dan memonitor pelaksanaan kebijakan, Sistem dan Tata Kerja (STK), di unit kerja/fungsi serta melakukan dan memonitor kegiatan transfer knowledge di unit kerja/fungsi.",
  //       tugas: [
  //         "Dokumen Sistem dan Tata Kerja (STK);",
  //         "Implementasi dan evaluasi STK/TKO;",
  //         "Laporan kegiatan sharing dan transfer knowledge;",
  //         "Data aset pengetahuan yang termuktahir.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       header:
  //         "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Mengelola, mengevaluasi, dan memastikan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program budaya risiko, serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
  //       tugas: [
  //         "Hasil identifikasi risiko;",
  //         "Rencana dan realisasi mitigasi risiko;",
  //         "Dokumen terkait kepatuhan terhadap standar GCG;",
  //         "Mengupayakan implementasi program budaya risiko pada segala aspek kegiatan fungsi.",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       header:
  //         "<b>Tindak Lanjut Hasil Audit</b> Mengelola, mengevaluasi, dan memastikan pelaksanaan audit serta monitoring dan tindak lanjut hasil audit di unit kerja/fungsi.",
  //       tugas: ["Laporan implementasi tidak lanjut hasil audit;", "Kelengkapan data dan dokumen untuk proses audit."],
  //     },
  //     {
  //       id: 7,
  //       header:
  //         "<b>Procurement </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengadaan sesuai dengan kewenangan tertentu untuk kebutuhan unit kerja/fungsi.",
  //       tugas: [
  //         "Usulan rencana pengadaan;",
  //         "Dokumen terkait pengadaan barang/jasa;",
  //         "Tersedianya barang/jasa;",
  //         "Hasil perhitungan TKDN;",
  //         "Hasil penilaian kinerja penyedia barang/jasa;",
  //         "Terlaksananya penerimaan barang/jasa.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       header:
  //         "<b>Project </b> Mengelola, mengevaluasi, dan memastikan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
  //       tugas: [
  //         "Tersedianya sumber daya yang diperlukan untuk pelaksanaan project;",
  //         "Terlaksananya eksekusi project;",
  //         "Tersedianya hasil monitoring dan evaluasi pelaksanaan project.",
  //       ],
  //     },
  //     {
  //       id: 9,
  //       header:
  //         "<b>Pengelolaan Data Insight </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengelolaan, pengolahan, dan penyajian data.",
  //       tugas: ["Terlaksananya pengelolaan data;", "Tersedianya hasil pengolahan dan penyajian data. "],
  //     },
  //   ],
  //   wewenang: [
  //     {
  //       id: 1,
  //       wewenang: "Menyetujui dan mengelola anggaran sesuai otorisasi yang dimiliki.",
  //     },
  //     {
  //       id: 2,
  //       wewenang:
  //         "Melakukan negosiasi dan persetujuan pemenang proses pengadaan barang/jasa sesuai dengan ketentuan yang berlaku.",
  //     },
  //     {
  //       id: 3,
  //       wewenang: "Menetapkan ketentuan operasional sesuai STK yang berlaku.",
  //     },
  //   ],
  //   koordinasi: [
  //     {
  //       id: 1,
  //       internal: "Area Manager Communication Relation & CSR ",
  //       aktivitas: [
  //         "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
  //         "Koordinasi terkait pengelolaan relasi dengan pihak media.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       internal: "Region Manager Reliability & Project Development ",
  //       aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas fuel dan gas."],
  //     },
  //     {
  //       id: 3,
  //       internal: "Region Manager Supply and Distribution",
  //       aktivitas: ["Koordinasi terkait keandalan pasokan fuel dan gas ke lembaga penyalur."],
  //     },
  //     {
  //       id: 4,
  //       internal: "Marketing",
  //       aktivitas: [
  //         "Koordinasi terkait riset pasar;",
  //         "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
  //         "Koordinasi terkait kegiatan promosi fuel dan gas;",
  //         "Koordinasi terkait penetapan harga retail dan commercial fuel  serta gas.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       internal: "Retail Fuel Sales",
  //       aktivitas: [
  //         "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis fuel;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       internal: "Retail Gas Sales ",
  //       aktivitas: [
  //         "Koordinasi terkait penyusunan kebijakan penyaluran dan pengembangan bisnis gas;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       internal: "Internal audit ",
  //       aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
  //     },
  //   ],
  //   relation: [
  //     {
  //       id: 1,
  //       eksternal: "DPR/DPRD",
  //       aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan fuel dan gas."],
  //     },
  //     {
  //       id: 2,
  //       eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan gas."],
  //     },
  //     {
  //       id: 3,
  //       eksternal: "Ditjen Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi LPG PSO."],
  //     },
  //     {
  //       id: 4,
  //       eksternal: "BPH Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi BBM PSO dan commercial fuel."],
  //     },
  //     {
  //       id: 5,
  //       eksternal: "Hiswana Migas",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan gas serta pengelolaan lembaga penyalur."],
  //     },
  //     {
  //       id: 6,
  //       eksternal: "BPK/Kementrian Keuangan",
  //       aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran fuel dan gas PSO."],
  //     },
  //     {
  //       id: 7,
  //       eksternal: "Tokoh Masyarakat",
  //       aktivitas: ["Koordinasi terkait penggalangan/community development."],
  //     },
  //     {
  //       id: 8,
  //       eksternal: "Konsultan",
  //       aktivitas: ["Konsultasi terkait penelitian."],
  //     },
  //     {
  //       id: 9,
  //       eksternal: "Wartawan",
  //       aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang fuel dan gas."],
  //     },
  //     {
  //       id: 10,
  //       eksternal: "Pihak eksternal lainnya",
  //       aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
  //     },
  //   ],
  //   education: [
  //     "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
  //     "S1 dengan pengalaman kerja 9 - 12 tahun, atau S2 dengan pengalaman kerja 6 - 9 Tahun.",
  //     "Pengalaman Kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
  //     "6 - 9 tahun menjabat posisi setingkat Analyst atau Sr. Supervisor.",
  //   ],
  //   persyaratanKhusus: [" "],
  //   komtekMandatori: [
  //     {
  //       id: "1",
  //       komtekMandatoriName: "HSSE General ",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekMandatoriName: "Strategic & Business Management  ",
  //       level: "1",
  //     },
  //     {
  //       id: "3",
  //       komtekMandatoriName: "Risk Fundamental",
  //       level: "1",
  //     },
  //     {
  //       id: "4",
  //       komtekMandatoriName: "Digital & Analytic Insight",
  //       level: "1",
  //     },
  //   ],
  //   komtekGeneral: [
  //     {
  //       id: "1",
  //       komtekGeneralName: "Marketing Strategy and Planning",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekGeneralName: "Customer Relation Management",
  //       level: "3",
  //     },
  //     {
  //       id: "3",
  //       komtekGeneralName: "Sales Strategy and Planning",
  //       level: "2",
  //     },
  //   ],
  //   komtekSpesifik: [
  //     {
  //       id: "1",
  //       komtekSpesifikName: "Stakeholder Management",
  //       level: "3",
  //     },
  //     {
  //       id: "2",
  //       komtekSpesifikName: "Sales and Account Management",
  //       level: "3",
  //     },
  //     {
  //       id: "3",
  //       komtekSpesifikName: "Promotion and Campaign Management",
  //       level: "3",
  //     },
  //     {
  //       id: "4",
  //       komtekSpesifikName: "Sales Administration",
  //       level: "3",
  //     },
  //     {
  //       id: "5",
  //       komtekSpesifikName: "Handling Customer Complaint",
  //       level: "3",
  //     },
  //     {
  //       id: "6",
  //       komtekSpesifikName: "Channel Management",
  //       level: "3",
  //     },
  //     {
  //       id: "7",
  //       komtekSpesifikName: "Product/Service Development",
  //       level: "3",
  //     },
  //     {
  //       id: "8",
  //       komtekSpesifikName: "Domestic Supply Management",
  //       level: "3",
  //     },
  //   ],
  //   komper: [
  //     {
  //       id: "1",
  //       komperName: "Building Partnerships",
  //     },
  //     {
  //       id: "2",
  //       komperName: "Decision Making",
  //     },
  //     {
  //       id: "3",
  //       komperName: "Planning & Organizing",
  //     },
  //     {
  //       id: "4",
  //       komperName: "Business Awareness",
  //     },
  //     {
  //       id: "5",
  //       komperName: "Customer Orientation",
  //     },
  //     {
  //       id: "6",
  //       komperName: "Continuous Improvement",
  //     },
  //     {
  //       id: "7",
  //       komperName: "Technology Savvy",
  //     },
  //     {
  //       id: "8",
  //       komperName: "Adaptability",
  //     },
  //     {
  //       id: "9",
  //       komperName: "Coaching",
  //     },
  //     {
  //       id: "10",
  //       komperName: "Valuing Differences",
  //     },
  //     {
  //       id: "11",
  //       komperName: "Gaining Commitment",
  //     },
  //     {
  //       id: "12",
  //       komperName: "Work Standards",
  //     },
  //     {
  //       id: "13",
  //       komperName: "Learning Agility",
  //     },
  //   ],
  // },
];

const dataJobDescCompare = [
  {
    identifikasi: {
      id: 3,
      jobName: "Manager Stakeholder Relation & Management",
      percentage: 60,
      function: "Corporate Secretary Subholding Commercial & Trading",
      location: "Kantor Pusat",
      directorat: "Direktorat Utama",
      directReport: "Corporate Secretary",
      sk: "Kpts-009/PNG000000/2024-S8",
    },
    fungsi:
      "Mengarahkan, memonitor dan mengevaluasi pengelolaan relasi dengan stakeholders/shareholder (termasuk stakeholders government maupun non government), kerja sama perusahaan, Izin Niaga Umum (INU), serta pemenuhan data kebutuhan regulatory report dalam rangka membangun dan menjaga citra dan reputasi positif korporasi, meningkatkan posisi perusahaan serta memajukan kepentingan perusahaan dalam lingkup bisnis komersial dan perdagangan.",
    tugasHa: [
      {
        id: 1,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi proses pengelolaan relasi dengan stakeholders government. ",
        output: [
          "Tersedianya strategi dan program hubungan/relasi dengan stakeholders government;",
          "Terlaksananya identifikasi dan respon kebutuhan informasi stakeholders government",
          "Terlaksananya tindak lanjut program relationship building dengan stakeholders government.",
        ],
        lead: [
          "Tingkat akurasi dan kelengkapan strategi hubungan/relasi dengan stakeholders government;",
          "Tingkat efektivitas program hubungan/relasi dengan stakeholders government;",
          "Tingkat akurasi dan kelengkapan identifikasi kebutuhan informasi stakeholders government;",
          "Tingkat akurasi dan ketepatan waktu respon kebutuhan informasi stakeholders government;",
          "Tingkat akurasi dan ketepatan waktu tindak lanjut program relationship building dengan stakeholders government.",
        ],
      },
      {
        id: 2,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi proses pengelolaan relasi dengan pihak stakeholders non government. ",
        output: [
          "Tersedianya hasil stakeholders/shareholder analysis & mapping;",
          "Terlaksananya kegiatan pembinaan relasi stakeholders/shareholder;",
          "Terlaksananya identifikasi dan respon kebutuhan informasi stakeholders/shareholder;",
          "Terlaksananya tindak lanjut program relationship building dengan stakeholders/ shareholder.",
        ],
        lead: [
          "Tingkat akurasi dan kelengkapan stakeholders/shareholder analysis & mapping;",
          "Tingkat efektivitas pembinaan relasi stakeholders/shareholder;",
          "Tingkat akurasi dan kelengkapan identifikasi kebutuhan informasi stakeholders/shareholder;",
          "Tingkat akurasi dan ketepatan waktu respon kebutuhan informasi stakeholders/ shareholder;",
          "Tingkat akurasi dan ketepatan waktu tindak lanjut program relationship building dengan stakeholders/shareholder.",
        ],
      },
      {
        id: 3,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi pengelolaan kerjasama perusahaan (partnership) secara nasional dan internasional baik dengan mitra kerja (B to B) maupun dengan pemerintah (B to G).",
        output: [
          "Terlaksananya persiapan program kerja sama;",
          "Terlaksananya program kerja sama;",
          "Terlaksananya tindak lanjut program kerja sama.",
        ],
        lead: [
          "Tingkat efektivitas program kerja sama;",
          "Tingkat kesesuaian mitra kerja sama;",
          "Tingkat akurasi dan ketepatan waktu tindak lanjut program kerja sama.",
        ],
      },
      {
        id: 4,
        responsible: "Mengarahkan, memonitor dan mengevaluasi pengelolaan perizinan terkait Izin Niaga Umum (INU).",
        output: ["Terlaksananya pengelolaan kegiatan perizinan terkait Izin Niaga Umum (INU)."],
        lead: ["Tingkat kesesuaian dan efektivitas pengelolaan kegiatan perizinan terkait Izin Niaga Umum (INU)."],
      },
      {
        id: 5,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi kegiatan pengelolaan laporan perusahaan terkait pemenuhan data kebutuhan regulatory report.",
        output: ["Terlaksananya pemenuhan data kebutuhan regulatory report."],
        lead: ["Tingkat akurasi dan kesesuaian pemenuhan data kebutuhan regulatory report."],
      },
    ],
    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Planning, Budgeting dan Pengelolaan Anggaran</b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
        tugas: [
          "Draft Rencana Kerja dan Anggaran (RKA);",
          "Draft Key Performance Indicator (rencana kinerja) unit kerja/fungsi;",
          "Laporan pertanggungjawaban penggunaan anggaran unit kerja/fungsi.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan HSSE</b> Melaksanakan dan memonitor program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Mengupayakan implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Mengupayakan implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Mengupayakan implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Mengupayakan parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan",
        ],
      },
      {
        id: 3,
        header:
          "<b>Pembinaan Pekerja</b> <ul><li>Mengelola, mengevaluasi, dan memastikan kegiatan perencanaan dan penilaian kinerja pekerja, serta pembimbingan pekerja di unit kerja/fungsi, termasuk pada perilaku indisipliner pekerja.</li><li>Mengelola, mengevaluasi, dan memastikan kebutuhan pelatihan dan pengembangan pekerja di unit kerja/fungsi.</li></ul>",
        tugas: [
          "Usulan terkait dengan:",
          "Rencana kebutuhan pekerja di unit/fungsi;",
          "Target dan ukuran kinerja pekerja;",
          "Laporan monitoring coaching-counseling;",
          "Rencana pengembangan individu (pelatihan dan penugasan);",
          "Hasil penilaian kinerja pekerja.",
        ],
      },
      {
        id: 4,
        header:
          "<b>Sistem Tata Kerja</b> Mengelola, mengevaluasi, dan memastikan penyusunan, sosialisasi dan memonitor pelaksanaan kebijakan, Sistem dan Tata Kerja (STK), di unit kerja/fungsi serta melakukan dan memonitor kegiatan transfer knowledge di unit kerja/fungsi.",
        tugas: [
          "Dokumen Sistem dan Tata Kerja (STK);",
          "Implementasi dan evaluasi STK/TKO;",
          "Laporan kegiatan sharing dan transfer knowledge;",
          "Data aset pengetahuan yang termuktahir.",
        ],
      },
      {
        id: 5,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Mengelola, mengevaluasi, dan memastikan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program budaya risiko, serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Dokumen terkait kepatuhan terhadap standar GCG;",
          "Mengupayakan implementasi program budaya risiko pada segala aspek kegiatan fungsi.",
        ],
      },
      {
        id: 6,
        header:
          "<b>Tindak Lanjut Hasil Audit</b> Mengelola, mengevaluasi, dan memastikan pelaksanaan audit serta monitoring dan tindak lanjut hasil audit di unit kerja/fungsi.",
        tugas: ["Laporan implementasi tidak lanjut hasil audit;", "Kelengkapan data dan dokumen untuk proses audit."],
      },
      {
        id: 7,
        header:
          "<b>Procurement </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengadaan sesuai dengan kewenangan tertentu untuk kebutuhan unit kerja/fungsi.",
        tugas: [
          "Usulan rencana pengadaan;",
          "Dokumen terkait pengadaan barang/jasa;",
          "Tersedianya barang/jasa;",
          "Hasil perhitungan TKDN;",
          "Hasil penilaian kinerja penyedia barang/jasa;",
          "Terlaksananya penerimaan barang/jasa.",
        ],
      },
      {
        id: 8,
        header:
          "<b>Project </b> Mengelola, mengevaluasi, dan memastikan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: [
          "Tersedianya sumber daya yang diperlukan untuk pelaksanaan project;",
          "Terlaksananya eksekusi project;",
          "Tersedianya hasil monitoring dan evaluasi pelaksanaan project.",
        ],
      },
      {
        id: 9,
        header:
          "<b>Pengelolaan Data Insight </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengelolaan, pengolahan, dan penyajian data.",
        tugas: ["Terlaksananya pengelolaan data;", "Tersedianya hasil pengolahan dan penyajian data. "],
      },
    ],
    wewenang: [
      {
        id: 1,
        wewenang: "Menyetujui dan mengelola anggaran sesuai otorisasi yang dimiliki.",
      },
      {
        id: 2,
        wewenang:
          "Melakukan negosiasi dan persetujuan pemenang proses pengadaan barang/jasa sesuai dengan ketentuan yang berlaku.",
      },
      {
        id: 3,
        wewenang: "Menetapkan ketentuan operasional sesuai STK yang berlaku.",
      },
    ],
    koordinasi: [
      {
        id: 1,
        internal: "BOD dan BOC",
        aktivitas: [
          "Koordinasi terkait dengan kegiatan-kegiatan strategis perusahaan yang terkait dengan Corporate Secretary dan Stakeholder.",
        ],
      },
      {
        id: 2,
        internal: "Finance",
        aktivitas: [
          "Koordinasi terkait pelaporan kinerja keuangan dan program kerja perusahaan;",
          "Koordinasi terkait operasional Stakeholder Relations;",
          "Koordinasi rencana investasi dan rencana jangka panjang perusahaan.",
        ],
      },
      {
        id: 3,
        internal: "Direktorat/Fungsi lain",
        aktivitas: ["Koordinasi terkait pelaporan kinerja operasional dan program kerja perusahaan."],
      },
      {
        id: 4,
        internal: "Fungsi di Direktorat SDM",
        aktivitas: ["Koordinasi terkait pelaporan operasional dan program kerja perusahaan."],
      },
      {
        id: 5,
        internal: "Legal",
        aktivitas: [
          "Koordinasi terkait operasional Stakeholder Relations dan rencana jangka panjang perusahaan;",
          "Koordinasi terkait anggaran dasar perusahaan;",
          "Koordinasi terkait produk-produk hukum terkait.",
        ],
      },
      {
        id: 6,
        internal: "Internal Audit",
        aktivitas: ["Koordinasi terkait temuan-temuan yang mempunyai implikasi terhadap opini perusahaan."],
      },
    ],
    relation: [
      {
        id: 1,
        eksternal: "Anak Perusahaan dan Subholding lainnya",
        aktivitas: ["Koordinasi terkait penyediaan data dan informasi yang bersifat material."],
      },
      {
        id: 2,
        eksternal: "Konsultan Komunikasi",
        aktivitas: [
          "Koordinasi terkait kerja sama terkait advisori dalam strategi, kebijakan dan implementasi kegiatan komunikasi.",
        ],
      },
      {
        id: 3,
        eksternal: "Seluruh Stakeholder (Pemerintah, legislatif, judiciary, NGO, TNI, Polri)",
        aktivitas: [
          "Koordinasi terkait sosialisasi kegiatan perusahaan/program perusahaan, pembentukan opini, pendekatan, mediasi dan permintaan kerja sama.",
        ],
      },
      {
        id: 4,
        eksternal: "Media Cetak & Elektronik",
        aktivitas: [
          "Koordinasi terkait kerja sama terkait pemberitaan dan komunikasi untuk membangun citra dan reputasi perusahaan.",
        ],
      },
      {
        id: 5,
        eksternal: "Pihak eksternal lainnya",
        aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
      },
    ],
    //persyaratan jabatan
    education: [
      "Sarjana dari berbagai jurusan, diutamakan dari Ilmu Komunikasi/Public Relation/Bisnis Media.",
      "S1 dengan pengalaman kerja 9 - 12 tahun, atau S2 dengan pengalaman kerja 6 – 9 tahun.",
      "Pengalaman Kerja di bidang Corporate Communicaton & Relation Management diutamakan di bidang Corporate Relation.",
      "6 - 9 tahun menjabat posisi setingkat Sr. Analyst atau Assistant Manager.",
    ],
    persyaratanKhusus: [" "],
    komtekMandatori: [
      {
        id: "1",
        komtekMandatoriName: "HSSE General ",
        level: "2",
      },
      {
        id: "2",
        komtekMandatoriName: "HC Integrated  ",
        level: "2",
      },
      {
        id: "3",
        komtekMandatoriName: "Strategic & Business Management  ",
        level: "2",
      },
      {
        id: "4",
        komtekMandatoriName: "Risk Fundamental",
        level: "2",
      },
      {
        id: "5",
        komtekMandatoriName: "Digital & Analytic Insight",
        level: "2",
      },
    ],
    komtekGeneral: [
      {
        id: "1",
        komtekGeneralName: "Message Management ",
        level: "3",
      },
      {
        id: "2",
        komtekGeneralName: "Stakeholder Management  ",
        level: "3",
      },
      {
        id: "3",
        komtekGeneralName: "Public Communication ",
        level: "3",
      },
    ],
    komtekSpesifik: [
      {
        id: "1",
        komtekSpesifikName: "Brand Communication ",
        level: "3",
      },
      {
        id: "2",
        komtekSpesifikName: "Media Relation Management",
        level: "3",
      },
      {
        id: "3",
        komtekSpesifikName: "Brand Equity Management ",
        level: "2",
      },
      {
        id: "4",
        komtekSpesifikName: "Stakeholder Mapping ",
        level: "3",
      },
      {
        id: "5",
        komtekSpesifikName: "Investor Relation Management ",
        level: "2",
      },
    ],
    komper: [
      {
        id: "1",
        komper_name: "Building Networks",
      },
      {
        id: "2",
        komper_name: "Strategic Planning",
      },
      {
        id: "3",
        komper_name: "Operational Decision Making",
      },
      {
        id: "4",
        komper_name: "Business Insights",
      },
      {
        id: "5",
        komper_name: "Customer Orientation",
      },
      {
        id: "6",
        komper_name: "Leading Innovation",
      },
      {
        id: "7",
        komper_name: "Technology Savvy",
      },
      {
        id: "8",
        komper_name: "Facilitating Change",
      },
      {
        id: "9",
        komper_name: "Building Talent",
      },
      {
        id: "10",
        komper_name: "Creating an Inclusive Environment",
      },
      {
        id: "11",
        komper_name: "Influencing",
      },
      {
        id: "12",
        komper_name: "Inspiring Others",
      },
      {
        id: "13",
        komper_name: "Driving for Results",
      },
      {
        id: "14",
        komper_name: "Learning Agility",
      },
    ],
  },
  {
    identifikasi: {
      id: 4,
      jobName: "Manager Corporate Communication",
      percentage: 100,
      function: "Corporate Secretary Subholding Commercial & Trading",
      location: "Kantor Pusat",
      directorat: "Direktorat Utama",
      directReport: "Corporate Secretary",
      sk: "Kpts-009/PNG000000/2024-S8 Tanggal: 01 April 2024",
    },
    fungsi:
      "Mengarahkan, memonitor dan mengevaluasi proses pengelolaan image perusahaan, komunikasi internal dan eksternal dan kegiatan corporate event dalam rangka membangun dan menjaga citra dan reputasi positif korporasi, meningkatkan posisi perusahaan serta memajukan kepentingan perusahaan dalam lingkup bisnis Komersial dan Pemasaran pada lingkup Pertamina Patra Niaga.",
    tugasHa: [
      {
        id: 1,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi kegiatan komunikasi internal dan eksternal perusahaan pada lingkup Pertamina Patra Niaga.",
        output: [
          "Terlaksananya pengelolaan komunikasi internal dan eksternal",
          "Tersedianya strategi komunikasi eksternal dan internal",
          "Terlaksananya pengelolaan komunikasi via media (social media, website, televisi, dll)",
        ],
        lead: [
          "Tingkat kelengkapan strategi komunikasi internal dan eksternal",
          "Tingkat efektivitas dan kesesuaian komunikasi internal dan eksternal",
          "Tingkat efektivitas dan kesesuaian pengelolaan komunikasi via media (social media, website, televisi, dll)",
        ],
      },
      {
        id: 2,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi kegiatan corporate event pada lingkup Pertamina Patra Niaga.",
        output: [
          "Tersedianya program corporate event",
          "Terlaksananya kegiatan corporate event",
          "Tersedianya timeline penyelenggaraan corporate event yang terprogram (internal engagement direksi dengan pekerja dan internalisasi kebijakan)",
        ],
        lead: [
          "Tingkat efektivitas program corporate event",
          "Tingkat akurasi, kesesuaian dan ketepatan waktu kegiatan corporate event",
          "Tingkat akurasi, kelengkapan dan ketepatan waktu timeline penyelenggaraan event korporat",
        ],
      },
      {
        id: 3,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi proses pengelolaan image perusahaan pada lingkup Pertamina Patra Niaga.",
        output: [
          "Tersedianya rencana dan program pengembangan image perusahaan",
          "Terlaksananya program pengembangan image perusahaan",
        ],
        lead: [
          "Tingkat akurasi dan kelengkapan rencana pengembangan image perusahaan",
          "Tingkat efektivitas program pengembangan image perusahaan",
          "Tingkat kesesuaian pelaksanaan program pengembangan image perusahaan dengan rencana",
        ],
      },
    ],
    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Planning, Budgeting dan Pengelolaan Anggaran</b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
        tugas: [
          "Draft Rencana Kerja dan Anggaran (RKA);",
          "Draft Key Performance Indicator (rencana kinerja) unit kerja/fungsi;",
          "Laporan pertanggungjawaban penggunaan anggaran unit kerja/fungsi.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan HSSE</b> Melaksanakan dan memonitor program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Mengupayakan implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Mengupayakan implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Mengupayakan implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Mengupayakan parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan",
        ],
      },
      {
        id: 3,
        header:
          "<b>Pembinaan Pekerja</b> <ul><li>Mengelola, mengevaluasi, dan memastikan kegiatan perencanaan dan penilaian kinerja pekerja, serta pembimbingan pekerja di unit kerja/fungsi, termasuk pada perilaku indisipliner pekerja.</li><li>Mengelola, mengevaluasi, dan memastikan kebutuhan pelatihan dan pengembangan pekerja di unit kerja/fungsi.</li></ul>",
        tugas: [
          "Usulan terkait dengan:",
          "Rencana kebutuhan pekerja di unit/fungsi;",
          "Target dan ukuran kinerja pekerja;",
          "Laporan monitoring coaching-counseling;",
          "Rencana pengembangan individu (pelatihan dan penugasan);",
          "Hasil penilaian kinerja pekerja.",
        ],
      },
      {
        id: 4,
        header:
          "<b>Sistem Tata Kerja</b> Mengelola, mengevaluasi, dan memastikan penyusunan, sosialisasi dan memonitor pelaksanaan kebijakan, Sistem dan Tata Kerja (STK), di unit kerja/fungsi serta melakukan dan memonitor kegiatan transfer knowledge di unit kerja/fungsi.",
        tugas: [
          "Dokumen Sistem dan Tata Kerja (STK);",
          "Implementasi dan evaluasi STK/TKO;",
          "Laporan kegiatan sharing dan transfer knowledge;",
          "Data aset pengetahuan yang termuktahir.",
        ],
      },
      {
        id: 5,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Mengelola, mengevaluasi, dan memastikan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program budaya risiko, serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Dokumen terkait kepatuhan terhadap standar GCG;",
          "Mengupayakan implementasi program budaya risiko pada segala aspek kegiatan fungsi.",
        ],
      },
      {
        id: 6,
        header:
          "<b>Tindak Lanjut Hasil Audit</b> Mengelola, mengevaluasi, dan memastikan pelaksanaan audit serta monitoring dan tindak lanjut hasil audit di unit kerja/fungsi.",
        tugas: ["Laporan implementasi tidak lanjut hasil audit;", "Kelengkapan data dan dokumen untuk proses audit."],
      },
      {
        id: 7,
        header:
          "<b>Procurement </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengadaan sesuai dengan kewenangan tertentu untuk kebutuhan unit kerja/fungsi.",
        tugas: [
          "Usulan rencana pengadaan;",
          "Dokumen terkait pengadaan barang/jasa;",
          "Tersedianya barang/jasa;",
          "Hasil perhitungan TKDN;",
          "Hasil penilaian kinerja penyedia barang/jasa;",
          "Terlaksananya penerimaan barang/jasa.",
        ],
      },
      {
        id: 8,
        header:
          "<b>Project </b> Mengelola, mengevaluasi, dan memastikan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: [
          "Tersedianya sumber daya yang diperlukan untuk pelaksanaan project;",
          "Terlaksananya eksekusi project;",
          "Tersedianya hasil monitoring dan evaluasi pelaksanaan project.",
        ],
      },
      {
        id: 9,
        header:
          "<b>Pengelolaan Data Insight </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengelolaan, pengolahan, dan penyajian data.",
        tugas: ["Terlaksananya pengelolaan data;", "Tersedianya hasil pengolahan dan penyajian data. "],
      },
    ],
    wewenang: [
      {
        id: 1,
        wewenang: "Menyetujui dan mengelola anggaran sesuai otorisasi yang dimiliki.",
      },
      {
        id: 2,
        wewenang:
          "Melakukan negosiasi dan persetujuan pemenang proses pengadaan barang/jasa sesuai dengan ketentuan yang berlaku.",
      },
      {
        id: 3,
        wewenang: "Menetapkan ketentuan operasional sesuai STK yang berlaku.",
      },
    ],
    koordinasi: [
      {
        id: 1,
        internal: "Seluruh Fungsi",
        aktivitas: [
          "Koordinasi terkait penyelenggaraan event",
          "Koordinasi terkait pelaporan kinerja operasional dan program kerja perusahaan",
        ],
      },
      {
        id: 2,
        internal: "BOD dan BOC",
        aktivitas: [
          "Koordinasi terkait dengan kegiatan-kegiatan strategis perusahaan yang terkait dengan Corporate Secretary",
        ],
      },
      {
        id: 3,
        internal: "Finance",
        aktivitas: [
          "Koordinasi terkait pelaporan kinerja keuangan dan program kerja Perusahaan",
          "Koordinasi rencana investasi dan rencana jangka panjang perusahaan",
        ],
      },
      {
        id: 4,
        internal: "Fungsi di Direktorat SDM",
        aktivitas: [
          "Koordinasi terkait pelaporan operasional dan program kerja perusahaan",
          "Koordinasi terkait hubungan industrial",
          "Koordinasi terkait pengelolaan SDM dan fasilitas Direksi",
        ],
      },
      {
        id: 5,
        internal: "Legal",
        aktivitas: ["Koordinasi terkait anggaran dasar perusahaan", "Koordinasi terkait produk-produk hukum terkait"],
      },
    ],
    relation: [
      {
        id: 1,
        eksternal: "PT Pertamina (Persero)",
        aktivitas: [
          "Koordinasi terkait pengumpulan data dan informasi terkait kegiatan di Subholding Commercial & Trading",
        ],
      },
      {
        id: 2,
        eksternal: "Anak Perusahaan dan Subholding lainnya",
        aktivitas: ["Koordinasi terkait penyediaan data dan informasi yang bersifat material"],
      },
      {
        id: 3,
        eksternal: "Konsultan Komunikasi",
        aktivitas: [
          "Koordinasi terkait kerja sama terkait advisori dalam strategi, kebijakan dan implementasi kegiatan komunikasi",
        ],
      },
      {
        id: 5,
        eksternal: "Pihak eksternal lainnya",
        aktivitas: ["Koordinasi sesuai kebutuhan perusahaan"],
      },
    ],
    education: [
      "Sarjana dari berbagai jurusan, diutamakan dari Business Administration/Business Management/Ilmu Komunikasi/Public Relation.",
      "S1 dengan pengalaman kerja 9-12 tahun, atau S2 dengan pengalaman kerja 6–9 tahun.",
      "Pengalaman Kerja di bidang Corporate Communication & Relation Management, diutamakan di bidang Corporate Communication.",
      "3-6 tahun menjabat posisi setingkat Sr. Analyst atau Assistant Manager.",
    ],
    persyaratanKhusus: [" "],
    komtekMandatori: [
      {
        id: "1",
        komtekMandatoriName: "HSSE General",
        level: 2,
      },
      {
        id: "2",
        komtekMandatoriName: "HC Integrated",
        level: 2,
      },
      {
        id: "3",
        komtekMandatoriName: "Strategic & Business Management",
        level: 2,
      },
      {
        id: "4",
        komtekMandatoriName: "Risk Fundamental",
        level: 2,
      },
      {
        id: "5",
        komtekMandatoriName: "Digital & Analytic Insight",
        level: 2,
      },
    ],
    komtekGeneral: [
      {
        id: "1",
        komtekGeneralName: "Message Management",
        level: 3,
      },
      {
        id: "2",
        komtekGeneralName: "Stakeholder Management",
        level: 3,
      },
      {
        id: "3",
        komtekGeneralName: "Public Communication",
        level: 3,
      },
    ],
    komtekSpesifik: [
      {
        id: "1",
        komtekSpesifikName: "Brand Communication",
        level: 3,
      },
      {
        id: "2",
        komtekSpesifikName: "Crisis Communication",
        level: 3,
      },
      {
        id: "3",
        komtekSpesifikName: "Media Relation Management",
        level: 3,
      },
      {
        id: "4",
        komtekSpesifikName: "Brand Equity Management",
        level: 2,
      },
      {
        id: "5",
        komtekSpesifikName: "Event Management",
        level: 3,
      },
      {
        id: "6",
        komtekSpesifikName: "Stakeholder Mapping",
        level: 3,
      },
    ],
    komper: [
      {
        id: "1",
        komper_name: "Building Networks",
      },
      {
        id: "2",
        komper_name: "Strategic Planning",
      },
      {
        id: "3",
        komper_name: "Operational Decision Making",
      },
      {
        id: "4",
        komper_name: "Business Insights",
      },
      {
        id: "5",
        komper_name: "Customer Orientation",
      },
      {
        id: "6",
        komper_name: "Leading Innovation",
      },
      {
        id: "7",
        komper_name: "Technology Savvy",
      },
      {
        id: "8",
        komper_name: "Facilitating Change",
      },
      {
        id: "9",
        komper_name: "Building Talent",
      },
      {
        id: "10",
        komper_name: "Creating an Inclusive Environment",
      },
      {
        id: "11",
        komper_name: "Influencing",
      },
      {
        id: "12",
        komper_name: "Inspiring Others",
      },
      {
        id: "13",
        komper_name: "Driving for Results",
      },
      {
        id: "14",
        komper_name: "Learning Agility",
      },
    ],
  },
  {
    identifikasi: {
      id: 5,
      jobName: "Manager CSR & SMEPP Management",
      percentage: 30,
      function: "Corporate Secretary Subholding Commercial & Trading",
      location: "Kantor Pusat",
      directorat: "Direktorat Utama",
      directReport: "Corporate Secretary",
      sk: "Kpts-009/PNG000000/2024-S8 Tanggal: 01 April 2024",
    },
    fungsi:
      "Mengarahkan, memonitor dan mengevaluasi proses pengelolaan program CSR & SMEPP dalam rangka mencapai tujuan dan sasaran yang telah ditetapkan sehingga seluruh kegiatan dapat berjalan dengan lancar, tepat sasaran, dan juga memberikan keuntungan bagi perusahaan di seluruh wilayah/kerja perusahaan.",
    //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
    tugasHa: [
      {
        id: 1,
        responsible: "Mengarahkan, memonitor dan mengevaluasi penyusunan rencana dan strategi CSR & SMEPP.",
        output: [
          "Tersedianya strategi CSR & SMEPP perusahaan",
          "Terlaksananya social mapping",
          "Tersedianya hasil identifikasi kebutuhan program CSR & SMEPP",
        ],
        lead: [
          "Tingkat akurasi dan kelengkapan strategi CSR & SMEPP perusahaan",
          "Tingkat akurasi dan kelengkapan social mapping",
        ],
      },
      {
        id: 2,
        responsible: "Mengarahkan, memonitor dan mengevaluasi proses implementasi program CSR & SMEPP.",
        output: [
          "Tersedianya usulan mitra program CSR dan/atau SMEPP",
          "Tersedianya laporan implementasi program CSR & SMEPP",
        ],
        lead: [
          "Tingkat kesesuaian usulan mitra program CSR dan/atau SMEPP dengan kriteria",
          "Tingkat akurasi, kelengkapan dan ketepatan waktu laporan program CSR & SMEPP",
        ],
      },
      {
        id: 3,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi proses koordinasi dan pengawasan pelaksanaan CSR & SMEPP.",
        output: ["Terlaksananya pengawasan aktivitas CSR & SMEPP", "Tersedianya laporan pelaksanaan CSR & SMEPP"],
        lead: [
          "Tingkat akurasi dan kesesuaian pengawasan aktivitas CSR & SMEPP",
          "Tingkat akurasi, kelengkapan dan ketepatan waktu laporan pengawasan CSR & SMEPP",
        ],
      },
    ],

    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Planning, Budgeting dan Pengelolaan Anggaran</b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
        tugas: [
          "Draft Rencana Kerja dan Anggaran (RKA);",
          "Draft Key Performance Indicator (rencana kinerja) unit kerja/fungsi;",
          "Laporan pertanggungjawaban penggunaan anggaran unit kerja/fungsi.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan HSSE</b> Melaksanakan dan memonitor program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Mengupayakan implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Mengupayakan implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Mengupayakan implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Mengupayakan parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan",
        ],
      },
      {
        id: 3,
        header:
          "<b>Pembinaan Pekerja</b> <ul><li>Mengelola, mengevaluasi, dan memastikan kegiatan perencanaan dan penilaian kinerja pekerja, serta pembimbingan pekerja di unit kerja/fungsi, termasuk pada perilaku indisipliner pekerja.</li><li>Mengelola, mengevaluasi, dan memastikan kebutuhan pelatihan dan pengembangan pekerja di unit kerja/fungsi.</li></ul>",
        tugas: [
          "Usulan terkait dengan:",
          "Rencana kebutuhan pekerja di unit/fungsi;",
          "Target dan ukuran kinerja pekerja;",
          "Laporan monitoring coaching-counseling;",
          "Rencana pengembangan individu (pelatihan dan penugasan);",
          "Hasil penilaian kinerja pekerja.",
        ],
      },
      {
        id: 4,
        header:
          "<b>Sistem Tata Kerja</b> Mengelola, mengevaluasi, dan memastikan penyusunan, sosialisasi dan memonitor pelaksanaan kebijakan, Sistem dan Tata Kerja (STK), di unit kerja/fungsi serta melakukan dan memonitor kegiatan transfer knowledge di unit kerja/fungsi.",
        tugas: [
          "Dokumen Sistem dan Tata Kerja (STK);",
          "Implementasi dan evaluasi STK/TKO;",
          "Laporan kegiatan sharing dan transfer knowledge;",
          "Data aset pengetahuan yang termuktahir.",
        ],
      },
      {
        id: 5,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Mengelola, mengevaluasi, dan memastikan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program budaya risiko, serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Dokumen terkait kepatuhan terhadap standar GCG;",
          "Mengupayakan implementasi program budaya risiko pada segala aspek kegiatan fungsi.",
        ],
      },
      {
        id: 6,
        header:
          "<b>Tindak Lanjut Hasil Audit</b> Mengelola, mengevaluasi, dan memastikan pelaksanaan audit serta monitoring dan tindak lanjut hasil audit di unit kerja/fungsi.",
        tugas: ["Laporan implementasi tidak lanjut hasil audit;", "Kelengkapan data dan dokumen untuk proses audit."],
      },
      {
        id: 7,
        header:
          "<b>Procurement </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengadaan sesuai dengan kewenangan tertentu untuk kebutuhan unit kerja/fungsi.",
        tugas: [
          "Usulan rencana pengadaan;",
          "Dokumen terkait pengadaan barang/jasa;",
          "Tersedianya barang/jasa;",
          "Hasil perhitungan TKDN;",
          "Hasil penilaian kinerja penyedia barang/jasa;",
          "Terlaksananya penerimaan barang/jasa.",
        ],
      },
      {
        id: 8,
        header:
          "<b>Project </b> Mengelola, mengevaluasi, dan memastikan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: [
          "Tersedianya sumber daya yang diperlukan untuk pelaksanaan project;",
          "Terlaksananya eksekusi project;",
          "Tersedianya hasil monitoring dan evaluasi pelaksanaan project.",
        ],
      },
      {
        id: 9,
        header:
          "<b>Pengelolaan Data Insight </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengelolaan, pengolahan, dan penyajian data.",
        tugas: ["Terlaksananya pengelolaan data;", "Tersedianya hasil pengolahan dan penyajian data. "],
      },
    ],
    wewenang: [
      {
        id: 1,
        wewenang: "Menyetujui dan mengelola anggaran sesuai otorisasi yang dimiliki.",
      },
      {
        id: 2,
        wewenang:
          "Melakukan negosiasi dan persetujuan pemenang proses pengadaan barang/jasa sesuai dengan ketentuan yang berlaku.",
      },
      {
        id: 3,
        wewenang: "Menetapkan ketentuan operasional sesuai STK yang berlaku.",
      },
    ],

    koordinasi: [
      {
        id: 1,
        internal: "Seluruh Fungsi di Direktorat Keuangan",
        aktivitas: [
          "Koordinasi terkait Penyusunan RKA Tahunan dan penyiapan Laporan Realisasi Triwulan dan Tahunan;",
          "Koordinasi terkait pengeluaran dana untuk kegiatan CSR & SMEPP",
        ],
      },
      {
        id: 2,
        internal: "Executive General Manager",
        aktivitas: [
          "Koordinasi terkait pelaksanaan CSR & SMEPP di Unit Operasi;",
          "Koordinasi terkait pelaksanaan program dan publikasi.",
        ],
      },
      {
        id: 3,
        internal: "Seluruh Fungsi/Direktorat lain",
        aktivitas: [
          "Koordinasi terkait sinergi pelaksanaan program kerja CSR & SMEPP",
          "Koordinasi terkait publikasi Program CSR & SMEPP.",
        ],
      },
    ],
    relation: [
      {
        id: 1,
        eksternal: "PT Pertamina (Persero)",
        aktivitas: [
          "Koordinasi terkait Penyusunan RKA Tahunan dan penyiapan Laporan Realisasi Triwulan dan Tahunan;",
          "Koordinasi terkait pengeluaran dana untuk kegiatan CSR & SMEPP;",
          "Koordinasi terkait mitra program CSR dan/atau SMEPP.",
        ],
      },
      {
        id: 2,
        eksternal: "Pemerintah Daerah Setempat/Instansi Terkait",
        aktivitas: ["Koordinasi terkait perijinan dan koordinasi pelaksanaan program."],
      },
      {
        id: 3,
        eksternal: "LSM, Lembaga Profesional dan Perguruan Tinggi/Riset/Konsultan",
        aktivitas: [
          "Kerjasama terkait evaluasi, monitoring, pelatihan pendampingan, dan bentuk pembinaan usaha kecil lainnya.",
        ],
      },
      {
        id: 4,
        eksternal: "Lembaga Hukum",
        aktivitas: ["Kerjasama terkait pendampingan bantuan hukum dan advokasi."],
      },
      {
        id: 5,
        eksternal: "BRI",
        aktivitas: ["Koordinasi terkait mitra program CSR dan/atau SMEPP."],
      },
      {
        id: 6,
        eksternal: "Pihak eksternal lainnya",
        aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
      },
    ],
    education: [
      "Sarjana dari berbagai jurusan, diutamakan dari Akuntansi/Manajemen Keuangan/Ilmu Komunikasi/Sosial Politik/Ekonomi/Hukum/Teknik Industri/Planologi/Statistik.",
      "S1 dengan pengalaman kerja 9 - 12 tahun, atau S2 dengan pengalaman kerja 6 - 9 Tahun.",
      "Pengalaman Kerja di bidang Corporate Communication & Relation Management diutamakan di bidang Corporate Social Responsibility.",
      "3 - 6 tahun menjabat posisi setingkat Sr. Analyst atau Assistant Manager.",
    ],
    persyaratanKhusus: [" "],
    komtekMandatori: [
      {
        id: "1",
        komtekMandatoriName: "HSSE General",
        level: 2,
      },
      {
        id: "2",
        komtekMandatoriName: "HC Integrated",
        level: 2,
      },
      {
        id: "3",
        komtekMandatoriName: "Strategic & Business Management",
        level: 2,
      },
      {
        id: "4",
        komtekMandatoriName: "Risk Fundamental",
        level: 2,
      },
      {
        id: "5",
        komtekMandatoriName: "Digital & Analytic Insight",
        level: 2,
      },
    ],
    komtekGeneral: [
      {
        id: "1",
        komtekGeneralName: "Message Management",
        level: 3,
      },
      {
        id: "2",
        komtekGeneralName: "Stakeholder Management",
        level: 3,
      },
      {
        id: "3",
        komtekGeneralName: "Public Communication",
        level: 3,
      },
    ],
    komtekSpesifik: [
      {
        id: "1",
        komtekSpesifikName: "Brand Communication",
        level: 3,
      },
      {
        id: "2",
        komtekSpesifikName: "Community Involvement and Development Program Planning & Design",
        level: 3,
      },
      {
        id: "3",
        komtekSpesifikName: "Event Management",
        level: 3,
      },
      {
        id: "4",
        komtekSpesifikName: "Social Mapping",
        level: 3,
      },
      {
        id: "5",
        komtekSpesifikName: "Community Involvement and Development Project Management",
        level: 3,
      },
      {
        id: "6",
        komtekSpesifikName: "Stakeholder Mapping",
        level: 1,
      },
    ],
    komper: [
      {
        id: "1",
        komper_name: "Building Networks",
      },
      {
        id: "2",
        komper_name: "Strategic Planning",
      },
      {
        id: "3",
        komper_name: "Operational Decision Making",
      },
      {
        id: "4",
        komper_name: "Business Insights",
      },
      {
        id: "5",
        komper_name: "Customer Orientation",
      },
      {
        id: "6",
        komper_name: "Leading Innovation",
      },
      {
        id: "7",
        komper_name: "Technology Savvy",
      },
      {
        id: "8",
        komper_name: "Facilitating Change",
      },
      {
        id: "9",
        komper_name: "Building Talent",
      },
      {
        id: "10",
        komper_name: "Creating an Inclusive Environment",
      },
      {
        id: "11",
        komper_name: "Influencing",
      },
      {
        id: "12",
        komper_name: "Inspiring Others",
      },
      {
        id: "13",
        komper_name: "Driving for Results",
      },
      {
        id: "14",
        komper_name: "Learning Agility",
      },
    ],
  },
  {
    identifikasi: {
      id: 6,
      jobName: "SBM Sumsel V Gas",
      percentage: 100,
      function: "Regional Sumbagsel/Retail Sales Sumbagsel",
      location: "Lahat",
      directorat: "Pemasaran Regional ",
      directReport: "SAM Retail Sumsel",
      sk: "Kpts-009/PNG000000/2024-S8",
      tanggal: "01 April 2024",
    },
    fungsi:
      "Melakukan perencanaan kegiatan penjualan, monitoring pelaksanaan kegiatan penyaluran dan penjualan produk, pelaksanaan kegiatan pemasaran produk, pembuatan laporan aktivitas penjualan, melakukan kegiatan pengelolaan penjualan dan memonitor kinerja channel, penyusunan rencana pengembangan channel (penjualan dan jaringan), dan kunjungan ke channel dan pelanggan serta melakukan pengelolaan relasi dengan pihak stakeholder sebagai upaya tercapainya kegiatan pemasaran produk gas yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Retail Sales Sumbagsel khususnya di Area Lahat.",
    //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
    tugasHa: [
      {
        id: 1,
        responsible:
          "Melakukan penyusunan sales planning produk gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Lahat.",
        output: ["Sales forecast (pragnosa revenue);", "Sales goals (target, strategi dan rencana penjualan)."],
        lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
      },
      {
        id: 2,
        responsible:
          "Melakukan pelaksanaan sales dan penyaluran  produk gas melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Lahat.",
        output: [
          "Pelaksanaan pemantauan stock gas yang ada pada channel;",
          "Pelaksanaan kegiatan penyaluran channel kepada konsumen;",
          "Pelaksanaan identifikasi kondisi pasar di sekitar channel.",
        ],
        lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
      },
      {
        id: 3,
        responsible:
          "Melakukan evaluasi terhadap channel terkait penjualan gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Lahat.",
        output: [
          "Pelaksanaan monitoring dan evaluasi penjualan channel;",
          "Pelaksanaan pemberian reward dan konsekuensi terkait kinerja channel;",
          "Pelaksanaan dan tindak lanjut evaluasi dan rekomendasi terhadap kegiatan penyaluran.",
        ],
        lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
      },
      {
        id: 4,
        responsible:
          "Melakukan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Lahat.",
        output: [
          "Pelaksanaan identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
          "Pelaksanaan analisis kelayakan pengembangan jaringan dan layanan channel;",
          "Pelaksanaan proses peluang channel baru.",
        ],
        lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
      },
      {
        id: 5,
        responsible:
          "Melakukan kegiatan promosi terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Lahat.",
        output: [
          "Usulan objective promosi produk/layanan dari seluruh wilayah;",
          "Usulan tema promosi;",
          "Pelaksanaan kerja sama dengan pihak terkait dalam eksekusi program promosi;",
          "Pelaksanaan evaluasi program promosi;",
          "Pelaksanaan tindak lanjut program promosi.",
        ],
        lead: ["Tingkat efektivitas kegiatan promosi."],
      },
      {
        id: 6,
        responsible:
          "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Lahat.",
        output: [
          "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
          "Pelaksanaan tindak lanjut permintaan pelanggan;",
          "Program pembinaan relasi dengan pelanggan;",
          "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
        ],
        lead: [
          "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
          "Customer satisfaction index;",
          "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
        ],
      },
      {
        id: 7,
        responsible:
          "Melakukan pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Lahat.",
        output: [
          "Rencana digitalisasi channel;",
          "Pelaksanaan implementasi digitalisasi channel;",
          "Hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
          "Data transaksi pada kegiatan channel.",
        ],
        lead: [
          "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
          "Tingkat ketersediaan data transaksi pada kegiatan channel.",
        ],
      },
      {
        id: 8,
        responsible:
          "Melakukan kegiatan relasi dengan stakeholder terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Lahat.",
        output: ["Pelaksanaan relasi dengan pihak stakeholder."],
        lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
      },
    ],
    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Laporan implementasi kepatuhan terhadap standar GCG;",
          "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
        ],
      },
      {
        id: 3,
        header:
          "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: ["Terlaksananya eksekusi project."],
      },
    ],
    wewenang: ["N/A"],
    koordinasi: [
      {
        id: 1,
        internal: "Area Manager Communication Relation & CSR ",
        aktivitas: [
          "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
          "Koordinasi terkait pengelolaan relasi dengan pihak media.",
        ],
      },
      {
        id: 2,
        internal: "Region Manager Reliability & Project Development ",
        aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas gas."],
      },
      {
        id: 3,
        internal: "Region Manager Supply and Distribution",
        aktivitas: ["Koordinasi terkait keandalan pasokan gas ke lembaga penyalur."],
      },
      {
        id: 4,
        internal: "Marketing",
        aktivitas: [
          "Koordinasi terkait riset pasar;",
          "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
          "Koordinasi terkait kegiatan promosi gas;",
          "Koordinasi terkait penetapan harga retail dan commercial gas.",
        ],
      },
      {
        id: 5,
        internal: "Retail Gas Sales ",
        aktivitas: [
          "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis gas;",
          "Koordinasi terkait pengembangan jaringan (outlet retail).",
        ],
      },
      {
        id: 6,
        internal: "Internal audit ",
        aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
      },
    ],
    relation: [
      {
        id: 1,
        eksternal: "DPR/DPRD",
        aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan gas."],
      },
      {
        id: 2,
        eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
        aktivitas: ["Koordinasi terkait perizinan dan pengawasan penyaluran gas."],
      },
      {
        id: 3,
        eksternal: "BPH Migas",
        aktivitas: ["Koordinasi terkait verifikasi gas PSO."],
      },
      {
        id: 4,
        eksternal: "Hiswana Migas",
        aktivitas: ["Koordinasi terkait penyaluran gas dan pengelolaan lembaga penyalur."],
      },
      {
        id: 5,
        eksternal: "BPK/Kementrian Keuangan",
        aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran gas PSO."],
      },
      {
        id: 6,
        eksternal: "Tokoh Masyarakat",
        aktivitas: ["Koordinasi terkait penggalangan/community development."],
      },
      {
        id: 7,
        eksternal: "Konsultan",
        aktivitas: ["Konsultasi terkait penelitian."],
      },
      {
        id: 8,
        eksternal: "Wartawan",
        aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang gas."],
      },
      {
        id: 9,
        eksternal: "Pihak eksternal lainnya",
        aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
      },
    ],
    //persyaratan jabatan
    education: [
      "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
      "S1 dengan pengalaman kerja 6 - 9 tahun.",
      "Pengalaman kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
      "3 - 6 tahun menjabat posisi setingkat Jr. Analyst atau Supervisor.",
    ],

    persyaratanKhusus: [" "],

    komtekMandatori: [
      {
        id: "1",
        komtekMandatoriName: "HSSE General ",
        level: "1",
      },
      {
        id: "2",
        komtekMandatoriName: "Risk Fundamental",
        level: "1",
      },
      {
        id: "3",
        komtekMandatoriName: "Digital & Analytic Insight",
        level: "1",
      },
    ],
    komtekGeneral: [
      {
        id: "1",
        komtekGeneralName: "Marketing Strategy and Planning",
        level: "1",
      },
      {
        id: "2",
        komtekGeneralName: "Customer Relation Management",
        level: "2",
      },
      {
        id: "3",
        komtekGeneralName: "Sales Strategy and Planning",
        level: "2",
      },
    ],
    komtekSpesifik: [
      {
        id: "1",
        komtekSpesifikName: "Stakeholder Management",
        level: "2",
      },
      {
        id: "2",
        komtekSpesifikName: "Sales and Account Management",
        level: "2",
      },
      {
        id: "3",
        komtekSpesifikName: "Promotion and Campaign Management",
        level: "2",
      },
      {
        id: "4",
        komtekSpesifikName: "Sales Administration",
        level: "2",
      },
      {
        id: "5",
        komtekSpesifikName: "Handling Customer Complaint",
        level: "2",
      },
      {
        id: "6",
        komtekSpesifikName: "Channel Management",
        level: "2",
      },
      {
        id: "7",
        komtekSpesifikName: "Product/Service Development",
        level: "2",
      },
      {
        id: "8",
        komtekSpesifikName: "Domestic Supply Management",
        level: "2",
      },
    ],
    komper: [
      {
        id: "1",
        komperName: "Fostering Collaboration",
      },
      {
        id: "2",
        komperName: "Analysis",
      },
      {
        id: "3",
        komperName: "Managing Work",
      },
      {
        id: "4",
        komperName: "Continuous Improvement",
      },
      {
        id: "5",
        komperName: "Technology Awareness",
      },
      {
        id: "6",
        komperName: "Adaptability",
      },
      {
        id: "7",
        komperName: "Quality Orientation",
      },
    ],
  },
  // {
  //   identifikasi: {
  //     id: 7,
  //     jobName: "SAM Retail Sumsel",
  //     function: "Regional Sumbagsel/Retail Sales Sumbagsel",
  //     location: "Palembang",
  //     directorat: "Pemasaran Regional ",
  //     directReport: "Region Manager Retail Sales Sumbagsel",
  //     sk: "Kpts-009/PNG000000/2024-S8",
  //     tanggal: "01 April 2024",
  //   },
  //   fungsi:
  //     "Mengarahkan dan mengevaluasi penyusunan sales planning, pelaksanaan sales  produk dan kegiatan penyaluran, pengelolaan channel terkait penjualan, kegiatan promosi, pengelolaan keluhan pelanggan dan kegiatan relasi dengan pelanggan terkait penjualan, pengelolaan roll out  digitalisasi pada kegiatan channel retail, serta kegiatan relasi dengan stakeholder terkait penjualan produk fuel dan gas yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //   tugasHa: [
  //     {
  //       id: 1,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi penyusunan sales planning produk fuel dan gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Tersedianya sales forecast (pragnosa revenue);",
  //         "Tersedianya sales goals (target, strategi dan rencana penjualan).",
  //       ],
  //       lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
  //     },
  //     {
  //       id: 2,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi pelaksanaan sales  dan penyaluran produk fuel dan gas melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Terlaksananya pemantauan stock fuel yang ada pada channel;",
  //         "Terlaksananya kegiatan penyaluran channel kepada konsumen;",
  //         "Terlaksananya identifikasi kondisi pasar di sekitar channel.",
  //       ],
  //       lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
  //     },
  //     {
  //       id: 3,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi channel terkait penjualan fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Terlaksananya monitoring dan evaluasi penjualan channel;",
  //         "Terlaksananya pemberian reward dan konsekuensi terkait kinerja channel;",
  //         "Terlaksananya evaluasi termasuk tindak lanjut evaluasi serta rekomendasi terhadap kegiatan penyaluran.",
  //       ],
  //       lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
  //     },
  //     {
  //       id: 4,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Terlaksananya identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
  //         "Terlaksananya analisis kelayakan pengembangan jaringan dan layanan channel;",
  //         "Terlaksananya proses peluang channel baru.",
  //       ],
  //       lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
  //     },
  //     {
  //       id: 5,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan promosi terkait penjualan produk fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Tersedianya usulan objective promosi produk/layanan dari seluruh wilayah;",
  //         "Tersedianya usulan tema promosi;",
  //         "Terlaksananya kerja sama dengan pihak terkait dalam eksekusi program promosi;",
  //         "Terlaksananya evaluasi program promosi;",
  //         "Terlaksananya tindak lanjut program promosi.",
  //       ],
  //       lead: ["Tingkat efektivitas kegiatan promosi"],
  //     },
  //     {
  //       id: 6,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan pengelolaan keluhan pelanggan dan kegiatan relasi dengan pelanggan terkait penjualan produk gas dan fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Terlaksananya tindak lanjut penanganan saran dan keluhan pelanggan;",
  //         "Terlaksananya tindak lanjut permintaan pelanggan;",
  //         "Tersedianya program pembinaan relasi dengan pelanggan;",
  //         "Terlaksananya kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
  //       ],
  //       lead: [
  //         "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
  //         "Customer satisfaction index;",
  //         "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel.",
  //       output: [
  //         "Tersedianya rencana digitalisasi channel;",
  //         "Terlaksananya implementasi digitalisasi channel;",
  //         "Tersedianya hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
  //         "Tersedianya data transaksi pada kegiatan channel.",
  //       ],
  //       lead: [
  //         "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
  //         "Tingkat ketersediaan data transaksi pada kegiatan channel.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan relasi dengan stakeholder terkait penjualan produk fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Sumsel",
  //       output: ["Terlaksananya relasi dengan pihak stakeholder."],
  //       lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
  //     },
  //   ],
  //   tugasUmum: [
  //     {
  //       id: 1,
  //       header:
  //         "<b>Planning, Budgeting dan Pengelolaan Anggaran</b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
  //       tugas: [
  //         "Draft Rencana Kerja dan Anggaran (RKA);",
  //         "Draft Key Performance Indicator (rencana kinerja) unit kerja/fungsi;",
  //         "Laporan pertanggungjawaban penggunaan anggaran unit kerja/fungsi.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       header:
  //         "<b>Pengelolaan HSSE</b> Melaksanakan dan memonitor program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
  //       tugas: [
  //         "Mengupayakan implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
  //         "Mengupayakan implementasi kebijakan perusahaan terkait aspek HSSE;",
  //         "Mengupayakan implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
  //         "Mengupayakan parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan",
  //       ],
  //     },
  //     {
  //       id: 3,
  //       header:
  //         "<b>Pembinaan Pekerja</b> <ul><li>Mengelola, mengevaluasi, dan memastikan kegiatan perencanaan dan penilaian kinerja pekerja, serta pembimbingan pekerja di unit kerja/fungsi, termasuk pada perilaku indisipliner pekerja.</li><li>Mengelola, mengevaluasi, dan memastikan kebutuhan pelatihan dan pengembangan pekerja di unit kerja/fungsi.</li></ul>",
  //       tugas: [
  //         "Usulan terkait dengan:",
  //         "Rencana kebutuhan pekerja di unit/fungsi;",
  //         "Target dan ukuran kinerja pekerja;",
  //         "Laporan monitoring coaching-counseling;",
  //         "Rencana pengembangan individu (pelatihan dan penugasan);",
  //         "Hasil penilaian kinerja pekerja.",
  //       ],
  //     },
  //     {
  //       id: 4,
  //       header:
  //         "<b>Sistem Tata Kerja</b> Mengelola, mengevaluasi, dan memastikan penyusunan, sosialisasi dan memonitor pelaksanaan kebijakan, Sistem dan Tata Kerja (STK), di unit kerja/fungsi serta melakukan dan memonitor kegiatan transfer knowledge di unit kerja/fungsi.",
  //       tugas: [
  //         "Dokumen Sistem dan Tata Kerja (STK);",
  //         "Implementasi dan evaluasi STK/TKO;",
  //         "Laporan kegiatan sharing dan transfer knowledge;",
  //         "Data aset pengetahuan yang termuktahir.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       header:
  //         "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Mengelola, mengevaluasi, dan memastikan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program budaya risiko, serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
  //       tugas: [
  //         "Hasil identifikasi risiko;",
  //         "Rencana dan realisasi mitigasi risiko;",
  //         "Dokumen terkait kepatuhan terhadap standar GCG;",
  //         "Mengupayakan implementasi program budaya risiko pada segala aspek kegiatan fungsi.",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       header:
  //         "<b>Tindak Lanjut Hasil Audit</b> Mengelola, mengevaluasi, dan memastikan pelaksanaan audit serta monitoring dan tindak lanjut hasil audit di unit kerja/fungsi.",
  //       tugas: ["Laporan implementasi tidak lanjut hasil audit;", "Kelengkapan data dan dokumen untuk proses audit."],
  //     },
  //     {
  //       id: 7,
  //       header:
  //         "<b>Procurement </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengadaan sesuai dengan kewenangan tertentu untuk kebutuhan unit kerja/fungsi.",
  //       tugas: [
  //         "Usulan rencana pengadaan;",
  //         "Dokumen terkait pengadaan barang/jasa;",
  //         "Tersedianya barang/jasa;",
  //         "Hasil perhitungan TKDN;",
  //         "Hasil penilaian kinerja penyedia barang/jasa;",
  //         "Terlaksananya penerimaan barang/jasa.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       header:
  //         "<b>Project </b> Mengelola, mengevaluasi, dan memastikan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
  //       tugas: [
  //         "Tersedianya sumber daya yang diperlukan untuk pelaksanaan project;",
  //         "Terlaksananya eksekusi project;",
  //         "Tersedianya hasil monitoring dan evaluasi pelaksanaan project.",
  //       ],
  //     },
  //     {
  //       id: 9,
  //       header:
  //         "<b>Pengelolaan Data Insight </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengelolaan, pengolahan, dan penyajian data.",
  //       tugas: ["Terlaksananya pengelolaan data;", "Tersedianya hasil pengolahan dan penyajian data. "],
  //     },
  //   ],
  //   wewenang: [
  //     {
  //       id: 1,
  //       wewenang: "Menyetujui dan mengelola anggaran sesuai otorisasi yang dimiliki.",
  //     },
  //     {
  //       id: 2,
  //       wewenang:
  //         "Melakukan negosiasi dan persetujuan pemenang proses pengadaan barang/jasa sesuai dengan ketentuan yang berlaku.",
  //     },
  //     {
  //       id: 3,
  //       wewenang: "Menetapkan ketentuan operasional sesuai STK yang berlaku.",
  //     },
  //   ],
  //   koordinasi: [
  //     {
  //       id: 1,
  //       internal: "Area Manager Communication Relation & CSR ",
  //       aktivitas: [
  //         "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
  //         "Koordinasi terkait pengelolaan relasi dengan pihak media.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       internal: "Region Manager Reliability & Project Development ",
  //       aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas fuel dan gas."],
  //     },
  //     {
  //       id: 3,
  //       internal: "Region Manager Supply and Distribution",
  //       aktivitas: ["Koordinasi terkait keandalan pasokan fuel dan gas ke lembaga penyalur."],
  //     },
  //     {
  //       id: 4,
  //       internal: "Marketing",
  //       aktivitas: [
  //         "Koordinasi terkait riset pasar;",
  //         "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
  //         "Koordinasi terkait kegiatan promosi fuel dan gas;",
  //         "Koordinasi terkait penetapan harga retail dan commercial fuel  serta gas.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       internal: "Retail Fuel Sales",
  //       aktivitas: [
  //         "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis fuel;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       internal: "Retail Gas Sales ",
  //       aktivitas: [
  //         "Koordinasi terkait penyusunan kebijakan penyaluran dan pengembangan bisnis gas;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       internal: "Internal audit ",
  //       aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
  //     },
  //   ],
  //   relation: [
  //     {
  //       id: 1,
  //       eksternal: "DPR/DPRD",
  //       aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan fuel dan gas."],
  //     },
  //     {
  //       id: 2,
  //       eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan gas."],
  //     },
  //     {
  //       id: 3,
  //       eksternal: "Ditjen Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi LPG PSO."],
  //     },
  //     {
  //       id: 4,
  //       eksternal: "BPH Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi BBM PSO dan commercial fuel."],
  //     },
  //     {
  //       id: 5,
  //       eksternal: "Hiswana Migas",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan gas serta pengelolaan lembaga penyalur."],
  //     },
  //     {
  //       id: 6,
  //       eksternal: "BPK/Kementrian Keuangan",
  //       aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran fuel dan gas PSO."],
  //     },
  //     {
  //       id: 7,
  //       eksternal: "Tokoh Masyarakat",
  //       aktivitas: ["Koordinasi terkait penggalangan/community development."],
  //     },
  //     {
  //       id: 8,
  //       eksternal: "Konsultan",
  //       aktivitas: ["Konsultasi terkait penelitian."],
  //     },
  //     {
  //       id: 9,
  //       eksternal: "Wartawan",
  //       aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang fuel dan gas."],
  //     },
  //     {
  //       id: 10,
  //       eksternal: "Pihak eksternal lainnya",
  //       aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
  //     },
  //   ],
  //   education: [
  //     "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
  //     "S1 dengan pengalaman kerja 9 - 12 tahun, atau S2 dengan pengalaman kerja 6 - 9 Tahun.",
  //     "Pengalaman Kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
  //     "6 - 9 tahun menjabat posisi setingkat Analyst atau Sr. Supervisor.",
  //   ],
  //   persyaratanKhusus: [" "],
  //   komtekMandatori: [
  //     {
  //       id: "1",
  //       komtekMandatoriName: "HSSE General ",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekMandatoriName: "Strategic & Business Management  ",
  //       level: "1",
  //     },
  //     {
  //       id: "3",
  //       komtekMandatoriName: "Risk Fundamental",
  //       level: "1",
  //     },
  //     {
  //       id: "4",
  //       komtekMandatoriName: "Digital & Analytic Insight",
  //       level: "1",
  //     },
  //   ],
  //   komtekGeneral: [
  //     {
  //       id: "1",
  //       komtekGeneralName: "Marketing Strategy and Planning",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekGeneralName: "Customer Relation Management",
  //       level: "3",
  //     },
  //     {
  //       id: "3",
  //       komtekGeneralName: "Sales Strategy and Planning",
  //       level: "2",
  //     },
  //   ],
  //   komtekSpesifik: [
  //     {
  //       id: "1",
  //       komtekSpesifikName: "Stakeholder Management",
  //       level: "3",
  //     },
  //     {
  //       id: "2",
  //       komtekSpesifikName: "Sales and Account Management",
  //       level: "3",
  //     },
  //     {
  //       id: "3",
  //       komtekSpesifikName: "Promotion and Campaign Management",
  //       level: "3",
  //     },
  //     {
  //       id: "4",
  //       komtekSpesifikName: "Sales Administration",
  //       level: "3",
  //     },
  //     {
  //       id: "5",
  //       komtekSpesifikName: "Handling Customer Complaint",
  //       level: "3",
  //     },
  //     {
  //       id: "6",
  //       komtekSpesifikName: "Channel Management",
  //       level: "3",
  //     },
  //     {
  //       id: "7",
  //       komtekSpesifikName: "Product/Service Development",
  //       level: "3",
  //     },
  //     {
  //       id: "8",
  //       komtekSpesifikName: "Domestic Supply Management",
  //       level: "3",
  //     },
  //   ],
  //   komper: [
  //     {
  //       id: "1",
  //       komperName: "Building Partnerships",
  //     },
  //     {
  //       id: "2",
  //       komperName: "Decision Making",
  //     },
  //     {
  //       id: "3",
  //       komperName: "Planning & Organizing",
  //     },
  //     {
  //       id: "4",
  //       komperName: "Business Awareness",
  //     },
  //     {
  //       id: "5",
  //       komperName: "Customer Orientation",
  //     },
  //     {
  //       id: "6",
  //       komperName: "Continuous Improvement",
  //     },
  //     {
  //       id: "7",
  //       komperName: "Technology Savvy",
  //     },
  //     {
  //       id: "8",
  //       komperName: "Adaptability",
  //     },
  //     {
  //       id: "9",
  //       komperName: "Coaching",
  //     },
  //     {
  //       id: "10",
  //       komperName: "Valuing Differences",
  //     },
  //     {
  //       id: "11",
  //       komperName: "Gaining Commitment",
  //     },
  //     {
  //       id: "12",
  //       komperName: "Work Standards",
  //     },
  //     {
  //       id: "13",
  //       komperName: "Learning Agility",
  //     },
  //   ],
  // },
  {
    identifikasi: {
      id: 9,
      jobName: "Manager Corporate Governance & Board Support",
      percentage: 30,
      function: "Corporate Secretary Subholding Commercial & Trading",
      location: "Kantor Pusat",
      directorat: "Direktorat Utama",
      directReport: "Corporate Secretary",
      sk: "Kpts-009/PNG000000/2024-S8",
      tanggal: "01 April 2024",
    },
    fungsi:
      "Mengarahkan, memonitor dan mengevaluasi pengelolaan aktivitas korporat dan dokumen legal perusahaan  untuk mendukung kelancaran bisnis perusahaan, pengelolaan annual report serta pengelolaan support aktivitas Direksi, Rapat Direksi, Rapat Dewan Komisaris bersama Direksi serta memutuskan, mengendalikan pengumpulan, pengolahan dan evaluasi data-data informasi perusahaan secara terintegrasi untuk keperluan Direksi pada lingkup Pertamina Patra Niaga.",
    tugasHa: [
      {
        id: 1,
        responsible: "Mengarahkan, mengelola dan mengevaluasi kegiatan pengelolaan RUPS (PPN & Anak Perusahaan).",
        output: [
          "Terlaksananya kegiatan RUPS (PPN & Anak Perusahaan);",
          "Tersedianya materi untuk kepentingan RUPS;",
          "Tersedianya hasil monitoring dan evaluasi kegiatan RUPS dan tindak lanjut.",
        ],
        lead: [
          "Tingkat kesesuaian dan ketepatan waktu kegiatan RUPS;",
          "Tingkat akurasi, kelengkapan dan kemutakhiran materi RUPS;",
          "Tingkat akurasi dan ketepatan waktu evaluasi dan tindak lanjut kegiatan RUPS.",
        ],
      },
      {
        id: 2,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi pengelolaan dokumen legal Perusahaan seperti Akte perusahaan, dokumen legalitas, RUPS pada lingkup Pertamina Patra Niaga.",
        output: [
          "Terlaksananya kegiatan pengurusan dokumen legal yang dibutuhkan;",
          "Tersedianya hasil evaluasi dan rekomendasi terkait efektivitas pengurusan dokumen legal.",
        ],
        lead: [
          "Tingkat kelengkapan dan kesesuaian pengurusan dokumen legal yang dibutuhkan;",
          "Tingkat akurasi dan ketepatan waktu evaluasi efektivitas pengurusan dokumen legal.",
        ],
      },
      {
        id: 3,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi pengelolaan rapat BoD dan BoC pada lingkup Pertamina Patra Niaga.",
        output: [
          "Terlaksananya persiapan rapat direksi, direksi – komisaris;",
          "Tersedianya dokumentasi Risalah Rapat Direksi dan Persetujuan Direksi.",
        ],
        lead: [
          "Tingkat akurasi, kelengkapan dan ketepatan waktu dokumentasi Risalah Rapat Direksi serta Persetujuan Direksi.",
        ],
      },
      {
        id: 4,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi kegiatan support aktivitas BOD dan BOC pada lingkup Pertamina Patra Niaga.",
        output: [
          "Terlaksananya kegiatan protokoler BoD – BoC;",
          "Tersedianya rencana support aktivitas BoD – BoC;",
          "Tersedianya hasil evaluasi dan rekomendasi aktivitas Direksi.",
        ],
        lead: [
          "Tingkat kesesuaian kegiatan protokoler BoD – BoC;",
          "Tingkat akurasi dan kelengkapan rencana support aktivitas BoD – BoC.",
        ],
      },
      {
        id: 5,
        responsible:
          "Mengarahkan, memonitor dan mengevaluasi pengelolaan annual report pada lingkup Pertamina Patra Niaga.",
        output: ["Tersedianya tema dan desain annual report;", "Tersedianya annual report Pertamina Patra Niaga."],
        lead: ["Tingkat akurasi, kelengkapan dan ketepatan waktu annual report Pertamina Patra Niaga."],
      },
    ],
    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Planning, Budgeting dan Pengelolaan Anggaran</b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
        tugas: [
          "Draft Rencana Kerja dan Anggaran (RKA);",
          "Draft Key Performance Indicator (rencana kinerja) unit kerja/fungsi;",
          "Laporan pertanggungjawaban penggunaan anggaran unit kerja/fungsi.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan HSSE</b> Melaksanakan dan memonitor program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Mengupayakan implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Mengupayakan implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Mengupayakan implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Mengupayakan parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan",
        ],
      },
      {
        id: 3,
        header:
          "<b>Pembinaan Pekerja</b> <ul><li>Mengelola, mengevaluasi, dan memastikan kegiatan perencanaan dan penilaian kinerja pekerja, serta pembimbingan pekerja di unit kerja/fungsi, termasuk pada perilaku indisipliner pekerja.</li><li>Mengelola, mengevaluasi, dan memastikan kebutuhan pelatihan dan pengembangan pekerja di unit kerja/fungsi.</li></ul>",
        tugas: [
          "Usulan terkait dengan:",
          "Rencana kebutuhan pekerja di unit/fungsi;",
          "Target dan ukuran kinerja pekerja;",
          "Laporan monitoring coaching-counseling;",
          "Rencana pengembangan individu (pelatihan dan penugasan);",
          "Hasil penilaian kinerja pekerja.",
        ],
      },
      {
        id: 4,
        header:
          "<b>Sistem Tata Kerja</b> Mengelola, mengevaluasi, dan memastikan penyusunan, sosialisasi dan memonitor pelaksanaan kebijakan, Sistem dan Tata Kerja (STK), di unit kerja/fungsi serta melakukan dan memonitor kegiatan transfer knowledge di unit kerja/fungsi.",
        tugas: [
          "Dokumen Sistem dan Tata Kerja (STK);",
          "Implementasi dan evaluasi STK/TKO;",
          "Laporan kegiatan sharing dan transfer knowledge;",
          "Data aset pengetahuan yang termuktahir.",
        ],
      },
      {
        id: 5,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Mengelola, mengevaluasi, dan memastikan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program budaya risiko, serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Dokumen terkait kepatuhan terhadap standar GCG;",
          "Mengupayakan implementasi program budaya risiko pada segala aspek kegiatan fungsi.",
        ],
      },
      {
        id: 6,
        header:
          "<b>Tindak Lanjut Hasil Audit</b> Mengelola, mengevaluasi, dan memastikan pelaksanaan audit serta monitoring dan tindak lanjut hasil audit di unit kerja/fungsi.",
        tugas: ["Laporan implementasi tidak lanjut hasil audit;", "Kelengkapan data dan dokumen untuk proses audit."],
      },
      {
        id: 7,
        header:
          "<b>Procurement </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengadaan sesuai dengan kewenangan tertentu untuk kebutuhan unit kerja/fungsi.",
        tugas: [
          "Usulan rencana pengadaan;",
          "Dokumen terkait pengadaan barang/jasa;",
          "Tersedianya barang/jasa;",
          "Hasil perhitungan TKDN;",
          "Hasil penilaian kinerja penyedia barang/jasa;",
          "Terlaksananya penerimaan barang/jasa.",
        ],
      },
      {
        id: 8,
        header:
          "<b>Project </b> Mengelola, mengevaluasi, dan memastikan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: [
          "Tersedianya sumber daya yang diperlukan untuk pelaksanaan project;",
          "Terlaksananya eksekusi project;",
          "Tersedianya hasil monitoring dan evaluasi pelaksanaan project.",
        ],
      },
      {
        id: 9,
        header:
          "<b>Pengelolaan Data Insight </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengelolaan, pengolahan, dan penyajian data.",
        tugas: ["Terlaksananya pengelolaan data;", "Tersedianya hasil pengolahan dan penyajian data. "],
      },
    ],
    wewenang: [
      {
        id: 1,
        wewenang: "Menyetujui dan mengelola anggaran sesuai otorisasi yang dimiliki.",
      },
      {
        id: 2,
        wewenang:
          "Melakukan negosiasi dan persetujuan pemenang proses pengadaan barang/jasa sesuai dengan ketentuan yang berlaku.",
      },
      {
        id: 3,
        wewenang: "Menetapkan ketentuan operasional sesuai STK yang berlaku.",
      },
    ],
    koordinasi: [
      {
        id: 1,
        internal: "BOD dan BOC",
        aktivitas: [
          "Koordinasi terkait dengan kegiatan-kegiatan strategis perusahaan yang terkait dengan Corporate Secretary.",
        ],
      },
      {
        id: 2,
        internal: "Finance",
        aktivitas: [
          "Koordinasi terkait pelaporan kinerja keuangan dan program kerja Perusahaan;",
          "Koordinasi rencana investasi dan rencana jangka panjang perusahaan.",
        ],
      },
      {
        id: 3,
        internal: "Direktorat/Fungsi lain",
        aktivitas: ["Koordinasi terkait pelaporan kinerja operasional dan program kerja perusahaan."],
      },
      {
        id: 4,
        internal: "Fungsi di Direktorat SDM",
        aktivitas: [
          "Koordinasi terkait pelaporan operasional dan program kerja perusahaan;",
          "Koordinasi terkait hubungan industrial;",
          "Koordinasi terkait pengelolaan SDM dan fasilitas Direksi.",
        ],
      },
      {
        id: 5,
        internal: "Legal",
        aktivitas: [
          "Koordinasi terkait operasional Board Support serta rencana jangka panjang perusahaan;",
          "Koordinasi terkait anggaran dasar perusahaan;",
          "Koordinasi terkait produk-produk hukum terkait.",
        ],
      },
      {
        id: 6,
        internal: "Seluruh Fungsi",
        aktivitas: ["Koordinasi terkait pengumpulan data dan informasi materi Rapat Direksi, Kunjungan Kerja."],
      },
      {
        id: 7,
        internal: "Sekretaris  Direksi",
        aktivitas: [
          "Koordinasi terkait aktivitas Direksi, protokoler dan rapat-rapat Direksi serta Rapat Dewan Komisaris bersama Direksi;",
          "Koordinasi terkait jadwal Direksi.",
        ],
      },
    ],
    relation: [
      {
        id: 1,
        eksternal: "PT Pertamina (Persero)",
        aktivitas: [
          "Koordinasi terkait pengumpulan data dan informasi terkait kegiatan di Subholding Commercial & Trading.",
        ],
      },
      {
        id: 2,
        eksternal: "Anak Perusahaan dan Subholding lainnya",
        aktivitas: ["Koordinasi terkait penyediaan data dan informasi yang bersifat material."],
      },
      {
        id: 3,
        eksternal: "Konsultan Komunikasi",
        aktivitas: [
          "Koordinasi terkait kerja sama terkait advisori dalam strategi, kebijakan dan implementasi kegiatan komunikasi.",
        ],
      },
      {
        id: 4,
        eksternal: "Kementerian, Lembaga, dan Instansi",
        aktivitas: [
          "Koordinasi terkait kegiatan Kementerian dan Protokol Kementerian diantaranya BUMN, ESDM. Perekonomian, dsb).",
        ],
      },
      {
        id: 5,
        eksternal: "Sekretariat Dewan Komisaris ",
        aktivitas: ["Koordinasi terkait aktivitas Dewan Komisaris yang melibatkan Direksi."],
      },
      {
        id: 6,
        eksternal: "Pihak eksternal lainnya",
        aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
      },
    ],
    //persyaratan jabatan
    education: [
      "Sarjana dari berbagai jurusan, diutamakan dari Business Administration/Business Management/Ilmu Komunikasi/Public Relation.",
      "S1 dengan pengalaman kerja 9-12 tahun, atau S2 dengan pengalaman kerja 6–9 tahun.",
      "Pengalaman Kerja di bidang Corporate Communicaton & Relation Management, diutamakan di bidang Corporate Communication.",
      "3-6 tahun menjabat posisi setingkat Sr. Analyst atau Assistant Manager.",
    ],

    persyaratanKhusus: [" "],

    komtekMandatori: [
      {
        id: "1",
        komtekMandatoriName: "HSSE General ",
        level: "2",
      },
      {
        id: "2",
        komtekMandatoriName: "HC Integrated  ",
        level: "2",
      },
      {
        id: "3",
        komtekMandatoriName: "Strategic & Business Management  ",
        level: "2",
      },
      {
        id: "4",
        komtekMandatoriName: "Risk Fundamental",
        level: "2",
      },
      {
        id: "5",
        komtekMandatoriName: "Digital & Analytic Insight",
        level: "2",
      },
    ],
    komtekGeneral: [
      {
        id: "1",
        komtekGeneralName: "Message Management ",
        level: "3",
      },
      {
        id: "2",
        komtekGeneralName: "Stakeholder Management  ",
        level: "3",
      },
      {
        id: "3",
        komtekGeneralName: "Public Communication ",
        level: "3",
      },
    ],
    komtekSpesifik: [
      {
        id: "1",
        komtekSpesifikName: "Brand Communication ",
        level: "2",
      },
      {
        id: "2",
        komtekSpesifikName: "Media Relation Management",
        level: "2",
      },
      {
        id: "3",
        komtekSpesifikName: "System & Procedure Management",
        level: "3",
      },
      {
        id: "4",
        komtekSpesifikName: "Event Management",
        level: "3",
      },
      {
        id: "5",
        komtekSpesifikName: "Stakeholder Mapping",
        level: "3",
      },
      {
        id: "6",
        komtekSpesifikName: "Administration Management",
        level: "3",
      },
    ],
    komper: [
      {
        id: "1",
        komperName: "Building Networks",
      },
      {
        id: "2",
        komperName: "Strategic Planning",
      },
      {
        id: "3",
        komperName: "Operational Decision Making",
      },
      {
        id: "4",
        komperName: "Business Insights",
      },
      {
        id: "5",
        komperName: "Customer Orientation",
      },
      {
        id: "6",
        komperName: "Leading Innovation",
      },
      {
        id: "7",
        komperName: "Technology Savvy",
      },
      {
        id: "8",
        komperName: "Facilitating Change",
      },
      {
        id: "9",
        komperName: "Building Talent",
      },
      {
        id: "10",
        komperName: "Creating an Inclusive Environment",
      },
      {
        id: "11",
        komperName: "Influencing",
      },
      {
        id: "12",
        komperName: "Inspiring Others",
      },
      {
        id: "13",
        komperName: "Driving for Results",
      },
      {
        id: "14",
        komperName: "Learning Agility",
      },
    ],
  },
  // {
  //   identifikasi: {
  //     id: 10,
  //     jobName: "SAM Retail Jambi",
  //     function: "Regional Sumbagsel/Retail Sales Sumbagsel",
  //     location: "Jambi",
  //     directorat: "Pemasaran Regional ",
  //     directReport: "Region Manager Retail Sales Sumbagsel",
  //     sk: "Kpts-009/PNG000000/2024-S8",
  //     tanggal: "01 April 2024",
  //   },
  //   fungsi:
  //     "Mengarahkan dan mengevaluasi penyusunan sales planning, pelaksanaan sales  produk dan kegiatan penyaluran, pengelolaan channel terkait penjualan, kegiatan promosi, pengelolaan keluhan pelanggan dan kegiatan relasi dengan pelanggan terkait penjualan, pengelolaan roll out  digitalisasi pada kegiatan channel retail, serta kegiatan relasi dengan stakeholder terkait penjualan produk fuel dan gas yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi.",
  //   tugasHa: [
  //     {
  //       id: 1,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi penyusunan sales planning produk fuel dan gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi.",
  //       output: [
  //         "Tersedianya sales forecast (pragnosa revenue);",
  //         "Tersedianya sales goals (target, strategi dan rencana penjualan).",
  //       ],
  //       lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
  //     },
  //     {
  //       id: 2,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi pelaksanaan sales  dan penyaluran produk fuel dan gas melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi.",
  //       output: [
  //         "Terlaksananya pemantauan stock fuel yang ada pada channel;",
  //         "Terlaksananya kegiatan penyaluran channel kepada konsumen;",
  //         "Terlaksananya identifikasi kondisi pasar di sekitar channel.",
  //       ],
  //       lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
  //     },
  //     {
  //       id: 3,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi channel terkait penjualan fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi.",
  //       output: [
  //         "Terlaksananya monitoring dan evaluasi penjualan channel;",
  //         "Terlaksananya pemberian reward dan konsekuensi terkait kinerja channel;",
  //         "Terlaksananya evaluasi termasuk tindak lanjut evaluasi serta rekomendasi terhadap kegiatan penyaluran.",
  //       ],
  //       lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
  //     },
  //     {
  //       id: 4,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi.",
  //       output: [
  //         "Terlaksananya identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
  //         "Terlaksananya analisis kelayakan pengembangan jaringan dan layanan channel;",
  //         "Terlaksananya proses peluang channel baru.",
  //       ],
  //       lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
  //     },
  //     {
  //       id: 5,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan promosi terkait penjualan produk fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi.",
  //       output: [
  //         "Tersedianya usulan objective promosi produk/layanan dari seluruh wilayah;",
  //         "Tersedianya usulan tema promosi;",
  //         "Terlaksananya kerja sama dengan pihak terkait dalam eksekusi program promosi;",
  //         "Terlaksananya evaluasi program promosi;",
  //         "Terlaksananya tindak lanjut program promosi.",
  //       ],
  //       lead: ["Tingkat efektivitas kegiatan promosi"],
  //     },
  //     {
  //       id: 6,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan pengelolaan keluhan pelanggan dan kegiatan relasi dengan pelanggan terkait penjualan produk gas dan fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi.",
  //       output: [
  //         "Terlaksananya tindak lanjut penanganan saran dan keluhan pelanggan;",
  //         "Terlaksananya tindak lanjut permintaan pelanggan;",
  //         "Tersedianya program pembinaan relasi dengan pelanggan;",
  //         "Terlaksananya kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
  //       ],
  //       lead: [
  //         "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
  //         "Customer satisfaction index;",
  //         "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi.",
  //       output: [
  //         "Tersedianya rencana digitalisasi channel;",
  //         "Terlaksananya implementasi digitalisasi channel;",
  //         "Tersedianya hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
  //         "Tersedianya data transaksi pada kegiatan channel.",
  //       ],
  //       lead: [
  //         "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
  //         "Tingkat ketersediaan data transaksi pada kegiatan channel.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       responsible:
  //         "Mengarahkan dan mengevaluasi kegiatan relasi dengan stakeholder terkait penjualan produk fuel dan gas di Fungsi Retail Sales Sumbagsel khususnya di Area Retail Jambi",
  //       output: ["Terlaksananya relasi dengan pihak stakeholder."],
  //       lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
  //     },
  //   ],
  //   tugasUmum: [
  //     {
  //       id: 1,
  //       header:
  //         "<b>Planning, Budgeting dan Pengelolaan Anggaran</b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
  //       tugas: [
  //         "Draft Rencana Kerja dan Anggaran (RKA);",
  //         "Draft Key Performance Indicator (rencana kinerja) unit kerja/fungsi;",
  //         "Laporan pertanggungjawaban penggunaan anggaran unit kerja/fungsi.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       header:
  //         "<b>Pengelolaan HSSE</b> Melaksanakan dan memonitor program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
  //       tugas: [
  //         "Mengupayakan implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
  //         "Mengupayakan implementasi kebijakan perusahaan terkait aspek HSSE;",
  //         "Mengupayakan implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
  //         "Mengupayakan parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan",
  //       ],
  //     },
  //     {
  //       id: 3,
  //       header:
  //         "<b>Pembinaan Pekerja</b> <ul><li>Mengelola, mengevaluasi, dan memastikan kegiatan perencanaan dan penilaian kinerja pekerja, serta pembimbingan pekerja di unit kerja/fungsi, termasuk pada perilaku indisipliner pekerja.</li><li>Mengelola, mengevaluasi, dan memastikan kebutuhan pelatihan dan pengembangan pekerja di unit kerja/fungsi.</li></ul>",
  //       tugas: [
  //         "Usulan terkait dengan:",
  //         "Rencana kebutuhan pekerja di unit/fungsi;",
  //         "Target dan ukuran kinerja pekerja;",
  //         "Laporan monitoring coaching-counseling;",
  //         "Rencana pengembangan individu (pelatihan dan penugasan);",
  //         "Hasil penilaian kinerja pekerja.",
  //       ],
  //     },
  //     {
  //       id: 4,
  //       header:
  //         "<b>Sistem Tata Kerja</b> Mengelola, mengevaluasi, dan memastikan penyusunan, sosialisasi dan memonitor pelaksanaan kebijakan, Sistem dan Tata Kerja (STK), di unit kerja/fungsi serta melakukan dan memonitor kegiatan transfer knowledge di unit kerja/fungsi.",
  //       tugas: [
  //         "Dokumen Sistem dan Tata Kerja (STK);",
  //         "Implementasi dan evaluasi STK/TKO;",
  //         "Laporan kegiatan sharing dan transfer knowledge;",
  //         "Data aset pengetahuan yang termuktahir.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       header:
  //         "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Mengelola, mengevaluasi, dan memastikan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program budaya risiko, serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
  //       tugas: [
  //         "Hasil identifikasi risiko;",
  //         "Rencana dan realisasi mitigasi risiko;",
  //         "Dokumen terkait kepatuhan terhadap standar GCG;",
  //         "Mengupayakan implementasi program budaya risiko pada segala aspek kegiatan fungsi.",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       header:
  //         "<b>Tindak Lanjut Hasil Audit</b> Mengelola, mengevaluasi, dan memastikan pelaksanaan audit serta monitoring dan tindak lanjut hasil audit di unit kerja/fungsi.",
  //       tugas: ["Laporan implementasi tidak lanjut hasil audit;", "Kelengkapan data dan dokumen untuk proses audit."],
  //     },
  //     {
  //       id: 7,
  //       header:
  //         "<b>Procurement </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengadaan sesuai dengan kewenangan tertentu untuk kebutuhan unit kerja/fungsi.",
  //       tugas: [
  //         "Usulan rencana pengadaan;",
  //         "Dokumen terkait pengadaan barang/jasa;",
  //         "Tersedianya barang/jasa;",
  //         "Hasil perhitungan TKDN;",
  //         "Hasil penilaian kinerja penyedia barang/jasa;",
  //         "Terlaksananya penerimaan barang/jasa.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       header:
  //         "<b>Project </b> Mengelola, mengevaluasi, dan memastikan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
  //       tugas: [
  //         "Tersedianya sumber daya yang diperlukan untuk pelaksanaan project;",
  //         "Terlaksananya eksekusi project;",
  //         "Tersedianya hasil monitoring dan evaluasi pelaksanaan project.",
  //       ],
  //     },
  //     {
  //       id: 9,
  //       header:
  //         "<b>Pengelolaan Data Insight </b> Mengelola, mengevaluasi, dan memastikan kegiatan pengelolaan, pengolahan, dan penyajian data.",
  //       tugas: ["Terlaksananya pengelolaan data;", "Tersedianya hasil pengolahan dan penyajian data. "],
  //     },
  //   ],
  //   wewenang: [
  //     {
  //       id: 1,
  //       wewenang: "Menyetujui dan mengelola anggaran sesuai otorisasi yang dimiliki.",
  //     },
  //     {
  //       id: 2,
  //       wewenang:
  //         "Melakukan negosiasi dan persetujuan pemenang proses pengadaan barang/jasa sesuai dengan ketentuan yang berlaku.",
  //     },
  //     {
  //       id: 3,
  //       wewenang: "Menetapkan ketentuan operasional sesuai STK yang berlaku.",
  //     },
  //   ],
  //   koordinasi: [
  //     {
  //       id: 1,
  //       internal: "Area Manager Communication Relation & CSR ",
  //       aktivitas: [
  //         "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
  //         "Koordinasi terkait pengelolaan relasi dengan pihak media.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       internal: "Region Manager Reliability & Project Development ",
  //       aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas fuel dan gas."],
  //     },
  //     {
  //       id: 3,
  //       internal: "Region Manager Supply and Distribution",
  //       aktivitas: ["Koordinasi terkait keandalan pasokan fuel dan gas ke lembaga penyalur."],
  //     },
  //     {
  //       id: 4,
  //       internal: "Marketing",
  //       aktivitas: [
  //         "Koordinasi terkait riset pasar;",
  //         "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
  //         "Koordinasi terkait kegiatan promosi fuel dan gas;",
  //         "Koordinasi terkait penetapan harga retail dan commercial fuel  serta gas.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       internal: "Retail Fuel Sales",
  //       aktivitas: [
  //         "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis fuel;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       internal: "Retail Gas Sales ",
  //       aktivitas: [
  //         "Koordinasi terkait penyusunan kebijakan penyaluran dan pengembangan bisnis gas;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       internal: "Internal audit ",
  //       aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
  //     },
  //   ],
  //   relation: [
  //     {
  //       id: 1,
  //       eksternal: "DPR/DPRD",
  //       aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan fuel dan gas."],
  //     },
  //     {
  //       id: 2,
  //       eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan gas."],
  //     },
  //     {
  //       id: 3,
  //       eksternal: "Ditjen Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi LPG PSO."],
  //     },
  //     {
  //       id: 4,
  //       eksternal: "BPH Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi BBM PSO dan commercial fuel."],
  //     },
  //     {
  //       id: 5,
  //       eksternal: "Hiswana Migas",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan gas serta pengelolaan lembaga penyalur."],
  //     },
  //     {
  //       id: 6,
  //       eksternal: "BPK/Kementrian Keuangan",
  //       aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran fuel dan gas PSO."],
  //     },
  //     {
  //       id: 7,
  //       eksternal: "Tokoh Masyarakat",
  //       aktivitas: ["Koordinasi terkait penggalangan/community development."],
  //     },
  //     {
  //       id: 8,
  //       eksternal: "Konsultan",
  //       aktivitas: ["Konsultasi terkait penelitian."],
  //     },
  //     {
  //       id: 9,
  //       eksternal: "Wartawan",
  //       aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang fuel dan gas."],
  //     },
  //     {
  //       id: 10,
  //       eksternal: "Pihak eksternal lainnya",
  //       aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
  //     },
  //   ],
  //   //persyaratan jabatan
  //   education: [
  //     "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
  //     "S1 dengan pengalaman kerja 9 - 12 tahun, atau S2 dengan pengalaman kerja 6 - 9 Tahun.",
  //     "Pengalaman Kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
  //     "Min. 3 tahun menjabat posisi setingkat Analyst atau Sr. Supervisor.",
  //   ],

  //   persyaratanKhusus: [" "],

  //   komtekMandatori: [
  //     {
  //       id: "1",
  //       komtekMandatoriName: "HSSE General ",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekMandatoriName: "Strategic & Business Management  ",
  //       level: "1",
  //     },
  //     {
  //       id: "3",
  //       komtekMandatoriName: "Risk Fundamental",
  //       level: "1",
  //     },
  //     {
  //       id: "4",
  //       komtekMandatoriName: "Digital & Analytic Insight",
  //       level: "1",
  //     },
  //   ],
  //   komtekGeneral: [
  //     {
  //       id: "1",
  //       komtekGeneralName: "Marketing Strategy and Planning",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekGeneralName: "Customer Relation Management",
  //       level: "3",
  //     },
  //     {
  //       id: "3",
  //       komtekGeneralName: "Sales Strategy and Planning",
  //       level: "2",
  //     },
  //   ],
  //   komtekSpesifik: [
  //     {
  //       id: "1",
  //       komtekSpesifikName: "Stakeholder Management",
  //       level: "3",
  //     },
  //     {
  //       id: "2",
  //       komtekSpesifikName: "Sales and Account Management",
  //       level: "3",
  //     },
  //     {
  //       id: "3",
  //       komtekSpesifikName: "Promotion and Campaign Management",
  //       level: "3",
  //     },
  //     {
  //       id: "4",
  //       komtekSpesifikName: "Sales Administration",
  //       level: "2",
  //     },
  //     {
  //       id: "5",
  //       komtekSpesifikName: "Handling Customer Complaint",
  //       level: "2",
  //     },
  //     {
  //       id: "6",
  //       komtekSpesifikName: "Channel Management",
  //       level: "3",
  //     },
  //     {
  //       id: "7",
  //       komtekSpesifikName: "Product/Service Development",
  //       level: "3",
  //     },
  //     {
  //       id: "8",
  //       komtekSpesifikName: "Domestic Supply Management",
  //       level: "3",
  //     },
  //   ],
  //   komper: [
  //     {
  //       id: "1",
  //       komperName: "Building Partnerships",
  //     },
  //     {
  //       id: "2",
  //       komperName: "Decision Making",
  //     },
  //     {
  //       id: "3",
  //       komperName: "Planning & Organizing",
  //     },
  //     {
  //       id: "4",
  //       komperName: "Business Awareness",
  //     },
  //     {
  //       id: "5",
  //       komperName: "Customer Orientation",
  //     },
  //     {
  //       id: "6",
  //       komperName: "Continuous Improvement",
  //     },
  //     {
  //       id: "7",
  //       komperName: "Technology Savvy",
  //     },
  //     {
  //       id: "8",
  //       komperName: "Adaptability",
  //     },
  //     {
  //       id: "9",
  //       komperName: "Coaching",
  //     },
  //     {
  //       id: "10",
  //       komperName: "Valuing Differences",
  //     },
  //     {
  //       id: "11",
  //       komperName: "Gaining Commitment",
  //     },
  //     {
  //       id: "12",
  //       komperName: "Work Standards",
  //     },
  //     {
  //       id: "13",
  //       komperName: "Learning Agility",
  //     },
  //   ],
  // },
  // {
  //   identifikasi: {
  //     id: 11,
  //     jobName: "SBM Jambi I Fuel",
  //     function: "Regional Sumbagsel/Retail Sales Sumbagsel",
  //     location: "Jambi",
  //     directorat: "Pemasaran Regional ",
  //     directReport: "SAM Retail Jambi",
  //     sk: "Kpts-009/PNG000000/2024-S8",
  //     tanggal: "01 April 2024",
  //   },
  //   fungsi:
  //     "Melakukan perencanaan kegiatan penjualan, monitoring pelaksanaan kegiatan penyaluran dan penjualan produk, pelaksanaan kegiatan pemasaran produk, pembuatan laporan aktivitas penjualan, melakukan kegiatan pengelolaan penjualan dan memonitor kinerja channel, penyusunan rencana pengembangan channel (penjualan dan jaringan), dan kunjungan ke channel dan pelanggan serta melakukan pengelolaan relasi dengan pihak stakeholder sebagai upaya tercapainya kegiatan pemasaran produk fuel yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Retail Sales Sumbagsel khususnya di Area Jambi.",
  //   tugasHa: [
  //     {
  //       id: 1,
  //       responsible:
  //         "Melakukan penyusunan sales planning produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
  //       output: ["Sales forecast (pragnosa revenue);", "Sales goals (target, strategi dan rencana penjualan)."],
  //       lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
  //     },
  //     {
  //       id: 2,
  //       responsible:
  //         "Melakukan pelaksanaan sales dan penyaluran  produk fuel melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
  //       output: [
  //         "Pelaksanaan pemantauan stock fuel yang ada pada channel;",
  //         "Pelaksanaan kegiatan penyaluran channel kepada konsumen;",
  //         "Pelaksanaan identifikasi kondisi pasar di sekitar channel.",
  //       ],
  //       lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
  //     },
  //     {
  //       id: 3,
  //       responsible:
  //         "Melakukan evaluasi terhadap channel terkait penjualan fuel  di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
  //       output: [
  //         "Pelaksanaan monitoring dan evaluasi penjualan channel;",
  //         "Pelaksanaan pemberian reward dan konsekuensi terkait kinerja channel;",
  //         "Pelaksanaan dan tindak lanjut evaluasi dan rekomendasi terhadap kegiatan penyaluran.",
  //       ],
  //       lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
  //     },
  //     {
  //       id: 4,
  //       responsible:
  //         "Melakukan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
  //       output: [
  //         "Pelaksanaan identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
  //         "Pelaksanaan analisis kelayakan pengembangan jaringan dan layanan channel;",
  //         "Pelaksanaan proses peluang channel baru.",
  //       ],
  //       lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
  //     },
  //     {
  //       id: 5,
  //       responsible:
  //         "Melakukan kegiatan promosi terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
  //       output: [
  //         "Usulan objective promosi produk/layanan dari seluruh wilayah;",
  //         "Usulan tema promosi;",
  //         "Pelaksanaan kerja sama dengan pihak terkait dalam eksekusi program promosi;",
  //         "Pelaksanaan evaluasi program promosi;",
  //         "Pelaksanaan tindak lanjut program promosi.",
  //       ],
  //       lead: ["Tingkat efektivitas kegiatan promosi."],
  //     },
  //     {
  //       id: 6,
  //       responsible:
  //         "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
  //       output: [
  //         "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
  //         "Pelaksanaan tindak lanjut permintaan pelanggan;",
  //         "Program pembinaan relasi dengan pelanggan;",
  //         "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
  //       ],
  //       lead: [
  //         "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
  //         "Customer satisfaction index;",
  //         "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       responsible:
  //         "Melakukan pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
  //       output: [
  //         "Rencana digitalisasi channel;",
  //         "Pelaksanaan implementasi digitalisasi channel;",
  //         "Hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
  //         "Data transaksi pada kegiatan channel.",
  //       ],
  //       lead: [
  //         "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
  //         "Tingkat ketersediaan data transaksi pada kegiatan channel.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       responsible:
  //         "Melakukan kegiatan relasi dengan stakeholder terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
  //       output: ["Pelaksanaan relasi dengan pihak stakeholder."],
  //       lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
  //     },
  //   ],
  //   tugasUmum: [
  //     {
  //       id: 1,
  //       header:
  //         "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
  //       tugas: [
  //         "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
  //         "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
  //         "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
  //         "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       header:
  //         "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
  //       tugas: [
  //         "Hasil identifikasi risiko;",
  //         "Rencana dan realisasi mitigasi risiko;",
  //         "Laporan implementasi kepatuhan terhadap standar GCG;",
  //         "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
  //       ],
  //     },
  //     {
  //       id: 3,
  //       header:
  //         "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
  //       tugas: ["Terlaksananya eksekusi project."],
  //     },
  //   ],
  //   wewenang: ["N/A"],
  //   koordinasi: [
  //     {
  //       id: 1,
  //       internal: "Area Manager Communication Relation & CSR ",
  //       aktivitas: [
  //         "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
  //         "Koordinasi terkait pengelolaan relasi dengan pihak media.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       internal: "Region Manager Reliability & Project Development ",
  //       aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas fuel."],
  //     },
  //     {
  //       id: 3,
  //       internal: "Region Manager Supply and Distribution",
  //       aktivitas: ["Koordinasi terkait keandalan pasokan fuel dan gas ke lembaga penyalur."],
  //     },
  //     {
  //       id: 4,
  //       internal: "Marketing",
  //       aktivitas: [
  //         "Koordinasi terkait riset pasar;",
  //         "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
  //         "Koordinasi terkait kegiatan promosi fuel;",
  //         "Koordinasi terkait penetapan harga retail dan commercial fuel.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       internal: "Retail Gas Sales ",
  //       aktivitas: [
  //         "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis fuel;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       internal: "Internal audit ",
  //       aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
  //     },
  //   ],
  //   relation: [
  //     {
  //       id: 1,
  //       eksternal: "DPR/DPRD",
  //       aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan fuel."],
  //     },
  //     {
  //       id: 2,
  //       eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
  //       aktivitas: ["Koordinasi terkait perizinan dan pengawasan penyaluran fuel."],
  //     },
  //     {
  //       id: 3,
  //       eksternal: "BPH Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi fuel PSO."],
  //     },
  //     {
  //       id: 4,
  //       eksternal: "Hiswana Migas",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan pengelolaan lembaga penyalur."],
  //     },
  //     {
  //       id: 5,
  //       eksternal: "BPK/Kementrian Keuangan",
  //       aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran fuel PSO."],
  //     },
  //     {
  //       id: 6,
  //       eksternal: "Tokoh Masyarakat",
  //       aktivitas: ["Koordinasi terkait penggalangan/community development."],
  //     },
  //     {
  //       id: 7,
  //       eksternal: "Konsultan",
  //       aktivitas: ["Konsultasi terkait penelitian."],
  //     },
  //     {
  //       id: 8,
  //       eksternal: "Wartawan",
  //       aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang fuel."],
  //     },
  //     {
  //       id: 9,
  //       eksternal: "Pihak eksternal lainnya",
  //       aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
  //     },
  //   ],
  //   education: [
  //     "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
  //     "S1 dengan pengalaman kerja 6 - 9 tahun.",
  //     "Pengalaman kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
  //     "Min. 3 tahun menjabat posisi setingkat Jr. Analyst atau Supervisor.",
  //   ],

  //   persyaratanKhusus: [" "],

  //   komtekMandatori: [
  //     {
  //       id: "1",
  //       komtekMandatoriName: "HSSE General ",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekMandatoriName: "Risk Fundamental",
  //       level: "1",
  //     },
  //     {
  //       id: "3",
  //       komtekMandatoriName: "Digital & Analytic Insight",
  //       level: "1",
  //     },
  //   ],
  //   komtekGeneral: [
  //     {
  //       id: "1",
  //       komtekGeneralName: "Marketing Strategy and Planning",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekGeneralName: "Customer Relation Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekGeneralName: "Sales Strategy and Planning",
  //       level: "2",
  //     },
  //   ],
  //   komtekSpesifik: [
  //     {
  //       id: "1",
  //       komtekSpesifikName: "Stakeholder Management",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekSpesifikName: "Sales and Account Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekSpesifikName: "Promotion and Campaign Management",
  //       level: "2",
  //     },
  //     {
  //       id: "4",
  //       komtekSpesifikName: "Sales Administration",
  //       level: "2",
  //     },
  //     {
  //       id: "5",
  //       komtekSpesifikName: "Handling Customer Complaint",
  //       level: "2",
  //     },
  //     {
  //       id: "6",
  //       komtekSpesifikName: "Channel Management",
  //       level: "2",
  //     },
  //     {
  //       id: "7",
  //       komtekSpesifikName: "Product/Service Development",
  //       level: "2",
  //     },
  //     {
  //       id: "8",
  //       komtekSpesifikName: "Domestic Supply Management",
  //       level: "2",
  //     },
  //   ],
  //   komper: [
  //     {
  //       id: "1",
  //       komperName: "Fostering Collaboration",
  //     },
  //     {
  //       id: "2",
  //       komperName: "Analysis",
  //     },
  //     {
  //       id: "3",
  //       komperName: "Managing Work",
  //     },
  //     {
  //       id: "4",
  //       komperName: "Continuous Improvement",
  //     },
  //     {
  //       id: "5",
  //       komperName: "Technology Awareness",
  //     },
  //     {
  //       id: "6",
  //       komperName: "Adaptability",
  //     },
  //     {
  //       id: "7",
  //       komperName: "Quality Orientation",
  //     },
  //     {
  //       id: "8",
  //       komperName: "Learning Agility",
  //     },
  //   ],
  // },
  // {
  //   identifikasi: {
  //     id: 12,
  //     jobName: "SBM Jambi II Fuel",
  //     function: "Regional Sumbagsel/Retail Sales Sumbagsel",
  //     location: "Sungai Penuh",
  //     directorat: "Pemasaran Regional ",
  //     directReport: "SAM Retail Jambi",
  //     sk: "Kpts-009/PNG000000/2024-S8",
  //     tanggal: "01 April 2024",
  //   },
  //   fungsi:
  //     "Melakukan perencanaan kegiatan penjualan, monitoring pelaksanaan kegiatan penyaluran dan penjualan produk, pelaksanaan kegiatan pemasaran produk, pembuatan laporan aktivitas penjualan, melakukan kegiatan pengelolaan penjualan dan memonitor kinerja channel, penyusunan rencana pengembangan channel (penjualan dan jaringan), dan kunjungan ke channel dan pelanggan serta melakukan pengelolaan relasi dengan pihak stakeholder sebagai upaya tercapainya kegiatan pemasaran produk fuel yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //   //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
  //   tugasHa: [
  //     {
  //       id: 1,
  //       responsible:
  //         "Melakukan penyusunan sales planning produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //       output: ["Sales forecast (pragnosa revenue);", "Sales goals (target, strategi dan rencana penjualan)."],
  //       lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
  //     },
  //     {
  //       id: 2,
  //       responsible:
  //         "Melakukan pelaksanaan sales dan penyaluran  produk fuel melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //       output: [
  //         "Pelaksanaan pemantauan stock fuel yang ada pada channel;",
  //         "Pelaksanaan kegiatan penyaluran channel kepada konsumen;",
  //         "Pelaksanaan identifikasi kondisi pasar di sekitar channel.",
  //       ],
  //       lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
  //     },
  //     {
  //       id: 3,
  //       responsible:
  //         "Melakukan evaluasi terhadap channel terkait penjualan fuel  di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //       output: [
  //         "Pelaksanaan monitoring dan evaluasi penjualan channel;",
  //         "Pelaksanaan pemberian reward dan konsekuensi terkait kinerja channel;",
  //         "Pelaksanaan dan tindak lanjut evaluasi dan rekomendasi terhadap kegiatan penyaluran.",
  //       ],
  //       lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
  //     },
  //     {
  //       id: 4,
  //       responsible:
  //         "Melakukan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //       output: [
  //         "Pelaksanaan identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
  //         "Pelaksanaan analisis kelayakan pengembangan jaringan dan layanan channel;",
  //         "Pelaksanaan proses peluang channel baru.",
  //       ],
  //       lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
  //     },
  //     {
  //       id: 5,
  //       responsible:
  //         "Melakukan kegiatan promosi terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //       output: [
  //         "Usulan objective promosi produk/layanan dari seluruh wilayah;",
  //         "Usulan tema promosi;",
  //         "Pelaksanaan kerja sama dengan pihak terkait dalam eksekusi program promosi;",
  //         "Pelaksanaan evaluasi program promosi;",
  //         "Pelaksanaan tindak lanjut program promosi.",
  //       ],
  //       lead: ["Tingkat efektivitas kegiatan promosi."],
  //     },
  //     {
  //       id: 6,
  //       responsible:
  //         "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //       output: [
  //         "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
  //         "Pelaksanaan tindak lanjut permintaan pelanggan;",
  //         "Program pembinaan relasi dengan pelanggan;",
  //         "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
  //       ],
  //       lead: [
  //         "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
  //         "Customer satisfaction index;",
  //         "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       responsible:
  //         "Melakukan pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //       output: [
  //         "Rencana digitalisasi channel;",
  //         "Pelaksanaan implementasi digitalisasi channel;",
  //         "Hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
  //         "Data transaksi pada kegiatan channel.",
  //       ],
  //       lead: [
  //         "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
  //         "Tingkat ketersediaan data transaksi pada kegiatan channel.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       responsible:
  //         "Melakukan kegiatan relasi dengan stakeholder terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
  //       output: ["Pelaksanaan relasi dengan pihak stakeholder."],
  //       lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
  //     },
  //   ],
  //   tugasUmum: [
  //     {
  //       id: 1,
  //       header:
  //         "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
  //       tugas: [
  //         "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
  //         "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
  //         "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
  //         "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       header:
  //         "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
  //       tugas: [
  //         "Hasil identifikasi risiko;",
  //         "Rencana dan realisasi mitigasi risiko;",
  //         "Laporan implementasi kepatuhan terhadap standar GCG;",
  //         "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
  //       ],
  //     },
  //     {
  //       id: 3,
  //       header:
  //         "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
  //       tugas: ["Terlaksananya eksekusi project."],
  //     },
  //   ],
  //   wewenang: ["N/A"],
  //   koordinasi: [
  //     {
  //       id: 1,
  //       internal: "Area Manager Communication Relation & CSR ",
  //       aktivitas: [
  //         "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
  //         "Koordinasi terkait pengelolaan relasi dengan pihak media.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       internal: "Region Manager Reliability & Project Development ",
  //       aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas fuel."],
  //     },
  //     {
  //       id: 3,
  //       internal: "Region Manager Supply and Distribution",
  //       aktivitas: ["Koordinasi terkait keandalan pasokan fuel dan gas ke lembaga penyalur."],
  //     },
  //     {
  //       id: 4,
  //       internal: "Marketing",
  //       aktivitas: [
  //         "Koordinasi terkait riset pasar;",
  //         "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
  //         "Koordinasi terkait kegiatan promosi fuel;",
  //         "Koordinasi terkait penetapan harga retail dan commercial fuel.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       internal: "Retail Gas Sales ",
  //       aktivitas: [
  //         "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis fuel;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       internal: "Internal audit ",
  //       aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
  //     },
  //   ],
  //   relation: [
  //     {
  //       id: 1,
  //       eksternal: "DPR/DPRD",
  //       aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan fuel."],
  //     },
  //     {
  //       id: 2,
  //       eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
  //       aktivitas: ["Koordinasi terkait perizinan dan pengawasan penyaluran fuel."],
  //     },
  //     {
  //       id: 3,
  //       eksternal: "BPH Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi fuel PSO."],
  //     },
  //     {
  //       id: 4,
  //       eksternal: "Hiswana Migas",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan pengelolaan lembaga penyalur."],
  //     },
  //     {
  //       id: 5,
  //       eksternal: "BPK/Kementrian Keuangan",
  //       aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran fuel PSO."],
  //     },
  //     {
  //       id: 6,
  //       eksternal: "Tokoh Masyarakat",
  //       aktivitas: ["Koordinasi terkait penggalangan/community development."],
  //     },
  //     {
  //       id: 7,
  //       eksternal: "Konsultan",
  //       aktivitas: ["Konsultasi terkait penelitian."],
  //     },
  //     {
  //       id: 8,
  //       eksternal: "Wartawan",
  //       aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang fuel."],
  //     },
  //     {
  //       id: 9,
  //       eksternal: "Pihak eksternal lainnya",
  //       aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
  //     },
  //   ],
  //   //persyaratan jabatan
  //   education: [
  //     "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
  //     "S1 dengan pengalaman kerja 3 - 6 tahun.",
  //     "Pengalaman kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
  //     "3 - 6 tahun menjabat posisi setingkat Jr. Analyst atau Supervisor.",
  //   ],

  //   persyaratanKhusus: [" "],

  //   komtekMandatori: [
  //     {
  //       id: "1",
  //       komtekMandatoriName: "HSSE General ",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekMandatoriName: "Risk Fundamental",
  //       level: "1",
  //     },
  //     {
  //       id: "3",
  //       komtekMandatoriName: "Digital & Analytic Insight",
  //       level: "1",
  //     },
  //   ],
  //   komtekGeneral: [
  //     {
  //       id: "1",
  //       komtekGeneralName: "Marketing Strategy and Planning",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekGeneralName: "Customer Relation Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekGeneralName: "Sales Strategy and Planning",
  //       level: "2",
  //     },
  //   ],
  //   komtekSpesifik: [
  //     {
  //       id: "1",
  //       komtekSpesifikName: "Stakeholder Management",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekSpesifikName: "Sales and Account Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekSpesifikName: "Promotion and Campaign Management",
  //       level: "2",
  //     },
  //     {
  //       id: "4",
  //       komtekSpesifikName: "Sales Administration",
  //       level: "2",
  //     },
  //     {
  //       id: "5",
  //       komtekSpesifikName: "Handling Customer Complaint",
  //       level: "2",
  //     },
  //     {
  //       id: "6",
  //       komtekSpesifikName: "Channel Management",
  //       level: "2",
  //     },
  //     {
  //       id: "7",
  //       komtekSpesifikName: "Product/Service Development",
  //       level: "2",
  //     },
  //     {
  //       id: "8",
  //       komtekSpesifikName: "Domestic Supply Management",
  //       level: "2",
  //     },
  //   ],
  //   komper: [
  //     {
  //       id: "1",
  //       komperName: "Fostering Collaboration",
  //     },
  //     {
  //       id: "2",
  //       komperName: "Analysis",
  //     },
  //     {
  //       id: "3",
  //       komperName: "Managing Work",
  //     },
  //     {
  //       id: "4",
  //       komperName: "Continuous Improvement",
  //     },
  //     {
  //       id: "5",
  //       komperName: "Technology Awareness",
  //     },
  //     {
  //       id: "6",
  //       komperName: "Adaptability",
  //     },
  //     {
  //       id: "7",
  //       komperName: "Quality Orientation",
  //     },
  //     {
  //       id: "8",
  //       komperName: "Learning Agility",
  //     },
  //   ],
  // },
  {
    identifikasi: {
      id: 13,
      jobName: "SBM Jambi III Gas",
      percentage: 100,
      function: "Regional Sumbagsel/Retail Sales Sumbagsel",
      location: "Jambi",
      directorat: "Pemasaran Regional ",
      directReport: "SAM Retail Jambi",
      sk: "Kpts-009/PNG000000/2024-S8",
      tanggal: "01 April 2024",
    },
    fungsi:
      "Melakukan perencanaan kegiatan penjualan, monitoring pelaksanaan kegiatan penyaluran dan penjualan produk, pelaksanaan kegiatan pemasaran produk, pembuatan laporan aktivitas penjualan, melakukan kegiatan pengelolaan penjualan dan memonitor kinerja channel, penyusunan rencana pengembangan channel (penjualan dan jaringan), dan kunjungan ke channel dan pelanggan serta melakukan pengelolaan relasi dengan pihak stakeholder sebagai upaya tercapainya kegiatan pemasaran produk gas yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Retail Sales Sumbagsel khususnya di Area Jambi.",
    //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
    tugasHa: [
      {
        id: 1,
        responsible:
          "Melakukan penyusunan sales planning produk gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
        output: ["Sales forecast (pragnosa revenue);", "Sales goals (target, strategi dan rencana penjualan)."],
        lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
      },
      {
        id: 2,
        responsible:
          "Melakukan pelaksanaan sales dan penyaluran  produk gas melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
        output: [
          "Pelaksanaan pemantauan stock gas yang ada pada channel;",
          "Pelaksanaan kegiatan penyaluran channel kepada konsumen;",
          "Pelaksanaan identifikasi kondisi pasar di sekitar channel.",
        ],
        lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
      },
      {
        id: 3,
        responsible:
          "Melakukan evaluasi terhadap channel terkait penjualan gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
        output: [
          "Pelaksanaan monitoring dan evaluasi penjualan channel;",
          "Pelaksanaan pemberian reward dan konsekuensi terkait kinerja channel;",
          "Pelaksanaan dan tindak lanjut evaluasi dan rekomendasi terhadap kegiatan penyaluran.",
        ],
        lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
      },
      {
        id: 4,
        responsible:
          "Melakukan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
        output: [
          "Pelaksanaan identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
          "Pelaksanaan analisis kelayakan pengembangan jaringan dan layanan channel;",
          "Pelaksanaan proses peluang channel baru.",
        ],
        lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
      },
      {
        id: 5,
        responsible:
          "Melakukan kegiatan promosi terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
        output: [
          "Usulan objective promosi produk/layanan dari seluruh wilayah;",
          "Usulan tema promosi;",
          "Pelaksanaan kerja sama dengan pihak terkait dalam eksekusi program promosi;",
          "Pelaksanaan evaluasi program promosi;",
          "Pelaksanaan tindak lanjut program promosi.",
        ],
        lead: ["Tingkat efektivitas kegiatan promosi."],
      },
      {
        id: 6,
        responsible:
          "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
        output: [
          "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
          "Pelaksanaan tindak lanjut permintaan pelanggan;",
          "Program pembinaan relasi dengan pelanggan;",
          "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
        ],
        lead: [
          "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
          "Customer satisfaction index;",
          "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
        ],
      },
      {
        id: 7,
        responsible:
          "Melakukan pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
        output: [
          "Rencana digitalisasi channel;",
          "Pelaksanaan implementasi digitalisasi channel;",
          "Hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
          "Data transaksi pada kegiatan channel.",
        ],
        lead: [
          "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
          "Tingkat ketersediaan data transaksi pada kegiatan channel.",
        ],
      },
      {
        id: 8,
        responsible:
          "Melakukan kegiatan relasi dengan stakeholder terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Jambi.",
        output: ["Pelaksanaan relasi dengan pihak stakeholder."],
        lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
      },
    ],
    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Laporan implementasi kepatuhan terhadap standar GCG;",
          "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
        ],
      },
      {
        id: 3,
        header:
          "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: ["Terlaksananya eksekusi project."],
      },
    ],
    wewenang: ["N/A"],
    koordinasi: [
      {
        id: 1,
        internal: "Area Manager Communication Relation & CSR ",
        aktivitas: [
          "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
          "Koordinasi terkait pengelolaan relasi dengan pihak media.",
        ],
      },
      {
        id: 2,
        internal: "Region Manager Reliability & Project Development ",
        aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas gas."],
      },
      {
        id: 3,
        internal: "Region Manager Supply and Distribution",
        aktivitas: ["Koordinasi terkait keandalan pasokan gas ke lembaga penyalur."],
      },
      {
        id: 4,
        internal: "Marketing",
        aktivitas: [
          "Koordinasi terkait riset pasar;",
          "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
          "Koordinasi terkait kegiatan promosi gas;",
          "Koordinasi terkait penetapan harga retail dan commercial gas.",
        ],
      },
      {
        id: 5,
        internal: "Retail Gas Sales ",
        aktivitas: [
          "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis gas;",
          "Koordinasi terkait pengembangan jaringan (outlet retail).",
        ],
      },
      {
        id: 6,
        internal: "Internal audit ",
        aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
      },
    ],
    relation: [
      {
        id: 1,
        eksternal: "DPR/DPRD",
        aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan gas."],
      },
      {
        id: 2,
        eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
        aktivitas: ["Koordinasi terkait perizinan dan pengawasan penyaluran gas."],
      },
      {
        id: 3,
        eksternal: "BPH Migas",
        aktivitas: ["Koordinasi terkait verifikasi gas PSO."],
      },
      {
        id: 4,
        eksternal: "Hiswana Migas",
        aktivitas: ["Koordinasi terkait penyaluran gas dan pengelolaan lembaga penyalur."],
      },
      {
        id: 5,
        eksternal: "BPK/Kementrian Keuangan",
        aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran gas PSO."],
      },
      {
        id: 6,
        eksternal: "Tokoh Masyarakat",
        aktivitas: ["Koordinasi terkait penggalangan/community development."],
      },
      {
        id: 7,
        eksternal: "Konsultan",
        aktivitas: ["Konsultasi terkait penelitian."],
      },
      {
        id: 8,
        eksternal: "Wartawan",
        aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang gas."],
      },
      {
        id: 9,
        eksternal: "Pihak eksternal lainnya",
        aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
      },
    ],
    //persyaratan jabatan
    education: [
      "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
      "S1 dengan pengalaman kerja 6 - 9 tahun.",
      "Pengalaman kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
      "3 - 6 tahun menjabat posisi setingkat Jr. Analyst atau Supervisor.",
    ],

    persyaratanKhusus: [" "],

    komtekMandatori: [
      {
        id: "1",
        komtekMandatoriName: "HSSE General ",
        level: "1",
      },
      {
        id: "2",
        komtekMandatoriName: "Risk Fundamental",
        level: "1",
      },
      {
        id: "3",
        komtekMandatoriName: "Digital & Analytic Insight",
        level: "1",
      },
    ],
    komtekGeneral: [
      {
        id: "1",
        komtekGeneralName: "Marketing Strategy and Planning",
        level: "1",
      },
      {
        id: "2",
        komtekGeneralName: "Customer Relation Management",
        level: "2",
      },
      {
        id: "3",
        komtekGeneralName: "Sales Strategy and Planning",
        level: "2",
      },
    ],
    komtekSpesifik: [
      {
        id: "1",
        komtekSpesifikName: "Stakeholder Management",
        level: "2",
      },
      {
        id: "2",
        komtekSpesifikName: "Sales and Account Management",
        level: "2",
      },
      {
        id: "3",
        komtekSpesifikName: "Promotion and Campaign Management",
        level: "2",
      },
      {
        id: "4",
        komtekSpesifikName: "Sales Administration",
        level: "2",
      },
      {
        id: "5",
        komtekSpesifikName: "Handling Customer Complaint",
        level: "2",
      },
      {
        id: "6",
        komtekSpesifikName: "Channel Management",
        level: "2",
      },
      {
        id: "7",
        komtekSpesifikName: "Product/Service Development",
        level: "2",
      },
      {
        id: "8",
        komtekSpesifikName: "Domestic Supply Management",
        level: "2",
      },
    ],
    komper: [
      {
        id: "1",
        komperName: "Fostering Collaboration",
      },
      {
        id: "2",
        komperName: "Analysis",
      },
      {
        id: "3",
        komperName: "Managing Work",
      },
      {
        id: "4",
        komperName: "Continuous Improvement",
      },
      {
        id: "5",
        komperName: "Technology Awareness",
      },
      {
        id: "6",
        komperName: "Adaptability",
      },
      {
        id: "7",
        komperName: "Quality Orientation",
      },
      {
        id: "8",
        komperName: "Learning Agility",
      },
    ],
  },
  {
    identifikasi: {
      id: 14,
      jobName: "SBM Jambi IV Gas",
      percentage: 100,
      function: "Regional Sumbagsel/Retail Sales Sumbagsel",
      location: "Sungai Penuh",
      directorat: "Pemasaran Regional ",
      directReport: "SAM Retail Jambi",
      sk: "Kpts-009/PNG000000/2024-S8",
      tanggal: "01 April 2024",
    },
    fungsi:
      "Melakukan perencanaan kegiatan penjualan, monitoring pelaksanaan kegiatan penyaluran dan penjualan produk, pelaksanaan kegiatan pemasaran produk, pembuatan laporan aktivitas penjualan, melakukan kegiatan pengelolaan penjualan dan memonitor kinerja channel, penyusunan rencana pengembangan channel (penjualan dan jaringan), dan kunjungan ke channel dan pelanggan serta melakukan pengelolaan relasi dengan pihak stakeholder sebagai upaya tercapainya kegiatan pemasaran produk gas yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
    //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
    tugasHa: [
      {
        id: 1,
        responsible:
          "Melakukan penyusunan sales planning produk gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
        output: ["Sales forecast (pragnosa revenue);", "Sales goals (target, strategi dan rencana penjualan)."],
        lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
      },
      {
        id: 2,
        responsible:
          "Melakukan pelaksanaan sales dan penyaluran  produk gas melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
        output: [
          "Pelaksanaan pemantauan stock gas yang ada pada channel;",
          "Pelaksanaan kegiatan penyaluran channel kepada konsumen;",
          "Pelaksanaan identifikasi kondisi pasar di sekitar channel.",
        ],
        lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
      },
      {
        id: 3,
        responsible:
          "Melakukan evaluasi terhadap channel terkait penjualan gas  di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
        output: [
          "Pelaksanaan monitoring dan evaluasi penjualan channel;",
          "Pelaksanaan pemberian reward dan konsekuensi terkait kinerja channel;",
          "Pelaksanaan dan tindak lanjut evaluasi dan rekomendasi terhadap kegiatan penyaluran.",
        ],
        lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
      },
      {
        id: 4,
        responsible:
          "Melakukan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
        output: [
          "Pelaksanaan identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
          "Pelaksanaan analisis kelayakan pengembangan jaringan dan layanan channel;",
          "Pelaksanaan proses peluang channel baru.",
        ],
        lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
      },
      {
        id: 5,
        responsible:
          "Melakukan kegiatan promosi terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
        output: [
          "Usulan objective promosi produk/layanan dari seluruh wilayah;",
          "Usulan tema promosi;",
          "Pelaksanaan kerja sama dengan pihak terkait dalam eksekusi program promosi;",
          "Pelaksanaan evaluasi program promosi;",
          "Pelaksanaan tindak lanjut program promosi.",
        ],
        lead: ["Tingkat efektivitas kegiatan promosi."],
      },
      {
        id: 6,
        responsible:
          "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
        output: [
          "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
          "Pelaksanaan tindak lanjut permintaan pelanggan;",
          "Program pembinaan relasi dengan pelanggan;",
          "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
        ],
        lead: [
          "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
          "Customer satisfaction index;",
          "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
        ],
      },
      {
        id: 7,
        responsible:
          "Melakukan pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
        output: [
          "Rencana digitalisasi channel;",
          "Pelaksanaan implementasi digitalisasi channel;",
          "Hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
          "Data transaksi pada kegiatan channel.",
        ],
        lead: [
          "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
          "Tingkat ketersediaan data transaksi pada kegiatan channel.",
        ],
      },
      {
        id: 8,
        responsible:
          "Melakukan kegiatan relasi dengan stakeholder terkait penjualan produk gas di Fungsi Retail Sales Sumbagsel khususnya di Area Sungai Penuh.",
        output: ["Pelaksanaan relasi dengan pihak stakeholder."],
        lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
      },
    ],
    tugasUmum: [
      {
        id: 1,
        header:
          "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
        tugas: [
          "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
          "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
          "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
          "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
        ],
      },
      {
        id: 2,
        header:
          "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
        tugas: [
          "Hasil identifikasi risiko;",
          "Rencana dan realisasi mitigasi risiko;",
          "Laporan implementasi kepatuhan terhadap standar GCG;",
          "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
        ],
      },
      {
        id: 3,
        header:
          "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
        tugas: ["Terlaksananya eksekusi project."],
      },
    ],
    wewenang: ["N/A"],
    koordinasi: [
      {
        id: 1,
        internal: "Area Manager Communication Relation & CSR ",
        aktivitas: [
          "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
          "Koordinasi terkait pengelolaan relasi dengan pihak media.",
        ],
      },
      {
        id: 2,
        internal: "Region Manager Reliability & Project Development ",
        aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas gas."],
      },
      {
        id: 3,
        internal: "Region Manager Supply and Distribution",
        aktivitas: ["Koordinasi terkait keandalan pasokan gas ke lembaga penyalur."],
      },
      {
        id: 4,
        internal: "Marketing",
        aktivitas: [
          "Koordinasi terkait riset pasar;",
          "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
          "Koordinasi terkait kegiatan promosi gas;",
          "Koordinasi terkait penetapan harga retail dan commercial gas.",
        ],
      },
      {
        id: 5,
        internal: "Retail Gas Sales ",
        aktivitas: [
          "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis gas;",
          "Koordinasi terkait pengembangan jaringan (outlet retail).",
        ],
      },
      {
        id: 6,
        internal: "Internal audit ",
        aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
      },
    ],
    relation: [
      {
        id: 1,
        eksternal: "DPR/DPRD",
        aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan gas."],
      },
      {
        id: 2,
        eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
        aktivitas: ["Koordinasi terkait perizinan dan pengawasan penyaluran gas."],
      },
      {
        id: 3,
        eksternal: "BPH Migas",
        aktivitas: ["Koordinasi terkait verifikasi gas PSO."],
      },
      {
        id: 4,
        eksternal: "Hiswana Migas",
        aktivitas: ["Koordinasi terkait penyaluran gas dan pengelolaan lembaga penyalur."],
      },
      {
        id: 5,
        eksternal: "BPK/Kementrian Keuangan",
        aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran gas PSO."],
      },
      {
        id: 6,
        eksternal: "Tokoh Masyarakat",
        aktivitas: ["Koordinasi terkait penggalangan/community development."],
      },
      {
        id: 7,
        eksternal: "Konsultan",
        aktivitas: ["Konsultasi terkait penelitian."],
      },
      {
        id: 8,
        eksternal: "Wartawan",
        aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang gas."],
      },
      {
        id: 9,
        eksternal: "Pihak eksternal lainnya",
        aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
      },
    ],
    //persyaratan jabatan
    education: [
      "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
      "S1 dengan pengalaman kerja 3 - 6 tahun.",
      "Pengalaman kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
      "3 - 6 tahun menjabat posisi setingkat Jr. Assistant atau Jr Supervisor.",
    ],

    persyaratanKhusus: [" "],

    komtekMandatori: [
      {
        id: "1",
        komtekMandatoriName: "HSSE General ",
        level: "1",
      },
      {
        id: "2",
        komtekMandatoriName: "Risk Fundamental",
        level: "1",
      },
      {
        id: "3",
        komtekMandatoriName: "Digital & Analytic Insight",
        level: "1",
      },
    ],
    komtekGeneral: [
      {
        id: "1",
        komtekGeneralName: "Marketing Strategy and Planning",
        level: "1",
      },
      {
        id: "2",
        komtekGeneralName: "Customer Relation Management",
        level: "2",
      },
      {
        id: "3",
        komtekGeneralName: "Sales Strategy and Planning",
        level: "2",
      },
    ],
    komtekSpesifik: [
      {
        id: "1",
        komtekSpesifikName: "Stakeholder Management",
        level: "2",
      },
      {
        id: "2",
        komtekSpesifikName: "Sales and Account Management",
        level: "2",
      },
      {
        id: "3",
        komtekSpesifikName: "Promotion and Campaign Management",
        level: "2",
      },
      {
        id: "4",
        komtekSpesifikName: "Sales Administration",
        level: "2",
      },
      {
        id: "5",
        komtekSpesifikName: "Handling Customer Complaint",
        level: "2",
      },
      {
        id: "6",
        komtekSpesifikName: "Channel Management",
        level: "2",
      },
      {
        id: "7",
        komtekSpesifikName: "Product/Service Development",
        level: "2",
      },
      {
        id: "8",
        komtekSpesifikName: "Domestic Supply Management",
        level: "2",
      },
    ],
    komper: [
      {
        id: "1",
        komperName: "Fostering Collaboration",
      },
      {
        id: "2",
        komperName: "Analysis",
      },
      {
        id: "3",
        komperName: "Managing Work",
      },
      {
        id: "4",
        komperName: "Continuous Improvement",
      },
      {
        id: "5",
        komperName: "Technology Awareness",
      },
      {
        id: "6",
        komperName: "Adaptability",
      },
      {
        id: "7",
        komperName: "Quality Orientation",
      },
      {
        id: "8",
        komperName: "Learning Agility",
      },
    ],
  },
  // {
  //   identifikasi: {
  //     id: 15,
  //     jobName: "SBM Sumsel II Fuel",
  //     function: "Regional Sumbagsel/Retail Sales Sumbagsel",
  //     location: "Lubuk Linggau",
  //     directorat: "Pemasaran Regional ",
  //     directReport: "SAM Retail Sumsel",
  //     sk: "Kpts-009/PNG000000/2024-S8",
  //     tanggal: "01 April 2024",
  //   },
  //   fungsi:
  //     "Melakukan perencanaan kegiatan penjualan, monitoring pelaksanaan kegiatan penyaluran dan penjualan produk, pelaksanaan kegiatan pemasaran produk, pembuatan laporan aktivitas penjualan, melakukan kegiatan pengelolaan penjualan dan memonitor kinerja channel, penyusunan rencana pengembangan channel (penjualan dan jaringan), dan kunjungan ke channel dan pelanggan serta melakukan pengelolaan relasi dengan pihak stakeholder sebagai upaya tercapainya kegiatan pemasaran produk fuel yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Retail Sales Sumbagsel khususnya di Area Palembang.",
  //   //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
  //   tugasHa: [
  //     {
  //       id: 1,
  //       responsible:
  //         "Melakukan penyusunan sales planning produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: ["Sales forecast (pragnosa revenue);", "Sales goals (target, strategi dan rencana penjualan)."],
  //       lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
  //     },
  //     {
  //       id: 2,
  //       responsible:
  //         "Melakukan pelaksanaan sales dan penyaluran  produk fuel melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan pemantauan stock fuel yang ada pada channel;",
  //         "Pelaksanaan kegiatan penyaluran channel kepada konsumen;",
  //         "Pelaksanaan identifikasi kondisi pasar di sekitar channel.",
  //       ],
  //       lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
  //     },
  //     {
  //       id: 3,
  //       responsible:
  //         "Melakukan evaluasi terhadap channel terkait penjualan fuel  di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan monitoring dan evaluasi penjualan channel;",
  //         "Pelaksanaan pemberian reward dan konsekuensi terkait kinerja channel;",
  //         "Pelaksanaan dan tindak lanjut evaluasi dan rekomendasi terhadap kegiatan penyaluran.",
  //       ],
  //       lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
  //     },
  //     {
  //       id: 4,
  //       responsible:
  //         "Melakukan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
  //         "Pelaksanaan analisis kelayakan pengembangan jaringan dan layanan channel;",
  //         "Pelaksanaan proses peluang channel baru.",
  //       ],
  //       lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
  //     },
  //     {
  //       id: 5,
  //       responsible:
  //         "Melakukan kegiatan promosi terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Usulan objective promosi produk/layanan dari seluruh wilayah;",
  //         "Usulan tema promosi;",
  //         "Pelaksanaan kerja sama dengan pihak terkait dalam eksekusi program promosi;",
  //         "Pelaksanaan evaluasi program promosi;",
  //         "Pelaksanaan tindak lanjut program promosi.",
  //       ],
  //       lead: ["Tingkat efektivitas kegiatan promosi."],
  //     },
  //     {
  //       id: 6,
  //       responsible:
  //         "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
  //         "Pelaksanaan tindak lanjut permintaan pelanggan;",
  //         "Program pembinaan relasi dengan pelanggan;",
  //         "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
  //       ],
  //       lead: [
  //         "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
  //         "Customer satisfaction index;",
  //         "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       responsible:
  //         "Melakukan pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Rencana digitalisasi channel;",
  //         "Pelaksanaan implementasi digitalisasi channel;",
  //         "Hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
  //         "Data transaksi pada kegiatan channel.",
  //       ],
  //       lead: [
  //         "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
  //         "Tingkat ketersediaan data transaksi pada kegiatan channel.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       responsible:
  //         "Melakukan kegiatan relasi dengan stakeholder terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: ["Pelaksanaan relasi dengan pihak stakeholder."],
  //       lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
  //     },
  //   ],
  //   tugasUmum: [
  //     {
  //       id: 1,
  //       header:
  //         "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
  //       tugas: [
  //         "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
  //         "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
  //         "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
  //         "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       header:
  //         "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
  //       tugas: [
  //         "Hasil identifikasi risiko;",
  //         "Rencana dan realisasi mitigasi risiko;",
  //         "Laporan implementasi kepatuhan terhadap standar GCG;",
  //         "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
  //       ],
  //     },
  //     {
  //       id: 3,
  //       header:
  //         "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
  //       tugas: ["Terlaksananya eksekusi project."],
  //     },
  //   ],
  //   wewenang: ["N/A"],
  //   koordinasi: [
  //     {
  //       id: 1,
  //       internal: "Area Manager Communication Relation & CSR ",
  //       aktivitas: [
  //         "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
  //         "Koordinasi terkait pengelolaan relasi dengan pihak media.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       internal: "Region Manager Reliability & Project Development ",
  //       aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas fuel."],
  //     },
  //     {
  //       id: 3,
  //       internal: "Region Manager Supply and Distribution",
  //       aktivitas: ["Koordinasi terkait keandalan pasokan fuel dan gas ke lembaga penyalur."],
  //     },
  //     {
  //       id: 4,
  //       internal: "Marketing",
  //       aktivitas: [
  //         "Koordinasi terkait riset pasar;",
  //         "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
  //         "Koordinasi terkait kegiatan promosi fuel;",
  //         "Koordinasi terkait penetapan harga retail dan commercial fuel.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       internal: "Retail Gas Sales ",
  //       aktivitas: [
  //         "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis fuel;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       internal: "Internal audit ",
  //       aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
  //     },
  //   ],
  //   relation: [
  //     {
  //       id: 1,
  //       eksternal: "DPR/DPRD",
  //       aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan fuel."],
  //     },
  //     {
  //       id: 2,
  //       eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
  //       aktivitas: ["Koordinasi terkait perizinan dan pengawasan penyaluran fuel."],
  //     },
  //     {
  //       id: 3,
  //       eksternal: "BPH Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi fuel PSO."],
  //     },
  //     {
  //       id: 4,
  //       eksternal: "Hiswana Migas",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan pengelolaan lembaga penyalur."],
  //     },
  //     {
  //       id: 5,
  //       eksternal: "BPK/Kementrian Keuangan",
  //       aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran fuel PSO."],
  //     },
  //     {
  //       id: 6,
  //       eksternal: "Tokoh Masyarakat",
  //       aktivitas: ["Koordinasi terkait penggalangan/community development."],
  //     },
  //     {
  //       id: 7,
  //       eksternal: "Konsultan",
  //       aktivitas: ["Konsultasi terkait penelitian."],
  //     },
  //     {
  //       id: 8,
  //       eksternal: "Wartawan",
  //       aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang fuel."],
  //     },
  //     {
  //       id: 9,
  //       eksternal: "Pihak eksternal lainnya",
  //       aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
  //     },
  //   ],
  //   //persyaratan jabatan
  //   education: [
  //     "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
  //     "S1 dengan pengalaman kerja 6 - 9 tahun.",
  //     "Pengalaman kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
  //     "3 - 6 tahun menjabat posisi setingkat Jr. Analyst atau Supervisor.",
  //   ],

  //   persyaratanKhusus: [" "],

  //   komtekMandatori: [
  //     {
  //       id: "1",
  //       komtekMandatoriName: "HSSE General ",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekMandatoriName: "Risk Fundamental",
  //       level: "1",
  //     },
  //     {
  //       id: "3",
  //       komtekMandatoriName: "Digital & Analytic Insight",
  //       level: "1",
  //     },
  //   ],
  //   komtekGeneral: [
  //     {
  //       id: "1",
  //       komtekGeneralName: "Marketing Strategy and Planning",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekGeneralName: "Customer Relation Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekGeneralName: "Sales Strategy and Planning",
  //       level: "2",
  //     },
  //   ],
  //   komtekSpesifik: [
  //     {
  //       id: "1",
  //       komtekSpesifikName: "Stakeholder Management",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekSpesifikName: "Sales and Account Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekSpesifikName: "Promotion and Campaign Management",
  //       level: "2",
  //     },
  //     {
  //       id: "4",
  //       komtekSpesifikName: "Sales Administration",
  //       level: "2",
  //     },
  //     {
  //       id: "5",
  //       komtekSpesifikName: "Handling Customer Complaint",
  //       level: "2",
  //     },
  //     {
  //       id: "6",
  //       komtekSpesifikName: "Channel Management",
  //       level: "2",
  //     },
  //     {
  //       id: "7",
  //       komtekSpesifikName: "Product/Service Development",
  //       level: "2",
  //     },
  //     {
  //       id: "8",
  //       komtekSpesifikName: "Domestic Supply Management",
  //       level: "2",
  //     },
  //   ],
  //   komper: [
  //     {
  //       id: "1",
  //       komperName: "Fostering Collaboration",
  //     },
  //     {
  //       id: "2",
  //       komperName: "Analysis",
  //     },
  //     {
  //       id: "3",
  //       komperName: "Managing Work",
  //     },
  //     {
  //       id: "4",
  //       komperName: "Continuous Improvement",
  //     },
  //     {
  //       id: "5",
  //       komperName: "Technology Awareness",
  //     },
  //     {
  //       id: "6",
  //       komperName: "Adaptability",
  //     },
  //     {
  //       id: "7",
  //       komperName: "Quality Orientation",
  //     },
  //   ],
  // },
  // {
  //   identifikasi: {
  //     id: 16,
  //     jobName: "SBM Sumsel I Fuel",
  //     function: "Regional Sumbagsel/Retail Sales Sumbagsel",
  //     location: "Palembang",
  //     directorat: "Pemasaran Regional ",
  //     directReport: "SAM Retail Sumsel",
  //     sk: "Kpts-009/PNG000000/2024-S8",
  //     tanggal: "01 April 2024",
  //   },
  //   fungsi:
  //     "Melakukan perencanaan kegiatan penjualan, monitoring pelaksanaan kegiatan penyaluran dan penjualan produk, pelaksanaan kegiatan pemasaran produk, pembuatan laporan aktivitas penjualan, melakukan kegiatan pengelolaan penjualan dan memonitor kinerja channel, penyusunan rencana pengembangan channel (penjualan dan jaringan), dan kunjungan ke channel dan pelanggan serta melakukan pengelolaan relasi dengan pihak stakeholder sebagai upaya tercapainya kegiatan pemasaran produk fuel yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Retail Sales Sumbagsel khususnya di Area Palembang.",
  //   //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
  //   tugasHa: [
  //     {
  //       id: 1,
  //       responsible:
  //         "Melakukan penyusunan sales planning produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: ["Sales forecast (pragnosa revenue);", "Sales goals (target, strategi dan rencana penjualan)."],
  //       lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
  //     },
  //     {
  //       id: 2,
  //       responsible:
  //         "Melakukan pelaksanaan sales dan penyaluran  produk fuel melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan pemantauan stock fuel yang ada pada channel;",
  //         "Pelaksanaan kegiatan penyaluran channel kepada konsumen;",
  //         "Pelaksanaan identifikasi kondisi pasar di sekitar channel.",
  //       ],
  //       lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
  //     },
  //     {
  //       id: 3,
  //       responsible:
  //         "Melakukan evaluasi terhadap channel terkait penjualan fuel  di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan monitoring dan evaluasi penjualan channel;",
  //         "Pelaksanaan pemberian reward dan konsekuensi terkait kinerja channel;",
  //         "Pelaksanaan dan tindak lanjut evaluasi dan rekomendasi terhadap kegiatan penyaluran.",
  //       ],
  //       lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
  //     },
  //     {
  //       id: 4,
  //       responsible:
  //         "Melakukan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
  //         "Pelaksanaan analisis kelayakan pengembangan jaringan dan layanan channel;",
  //         "Pelaksanaan proses peluang channel baru.",
  //       ],
  //       lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
  //     },
  //     {
  //       id: 5,
  //       responsible:
  //         "Melakukan kegiatan promosi terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Usulan objective promosi produk/layanan dari seluruh wilayah;",
  //         "Usulan tema promosi;",
  //         "Pelaksanaan kerja sama dengan pihak terkait dalam eksekusi program promosi;",
  //         "Pelaksanaan evaluasi program promosi;",
  //         "Pelaksanaan tindak lanjut program promosi.",
  //       ],
  //       lead: ["Tingkat efektivitas kegiatan promosi."],
  //     },
  //     {
  //       id: 6,
  //       responsible:
  //         "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
  //         "Pelaksanaan tindak lanjut permintaan pelanggan;",
  //         "Program pembinaan relasi dengan pelanggan;",
  //         "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
  //       ],
  //       lead: [
  //         "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
  //         "Customer satisfaction index;",
  //         "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       responsible:
  //         "Melakukan pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Rencana digitalisasi channel;",
  //         "Pelaksanaan implementasi digitalisasi channel;",
  //         "Hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
  //         "Data transaksi pada kegiatan channel.",
  //       ],
  //       lead: [
  //         "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
  //         "Tingkat ketersediaan data transaksi pada kegiatan channel.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       responsible:
  //         "Melakukan kegiatan relasi dengan stakeholder terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: ["Pelaksanaan relasi dengan pihak stakeholder."],
  //       lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
  //     },
  //   ],
  //   tugasUmum: [
  //     {
  //       id: 1,
  //       header:
  //         "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
  //       tugas: [
  //         "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
  //         "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
  //         "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
  //         "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       header:
  //         "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
  //       tugas: [
  //         "Hasil identifikasi risiko;",
  //         "Rencana dan realisasi mitigasi risiko;",
  //         "Laporan implementasi kepatuhan terhadap standar GCG;",
  //         "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
  //       ],
  //     },
  //     {
  //       id: 3,
  //       header:
  //         "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
  //       tugas: ["Terlaksananya eksekusi project."],
  //     },
  //   ],
  //   wewenang: ["N/A"],
  //   koordinasi: [
  //     {
  //       id: 1,
  //       internal: "Area Manager Communication Relation & CSR ",
  //       aktivitas: [
  //         "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
  //         "Koordinasi terkait pengelolaan relasi dengan pihak media.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       internal: "Region Manager Reliability & Project Development ",
  //       aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas fuel."],
  //     },
  //     {
  //       id: 3,
  //       internal: "Region Manager Supply and Distribution",
  //       aktivitas: ["Koordinasi terkait keandalan pasokan fuel dan gas ke lembaga penyalur."],
  //     },
  //     {
  //       id: 4,
  //       internal: "Marketing",
  //       aktivitas: [
  //         "Koordinasi terkait riset pasar;",
  //         "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
  //         "Koordinasi terkait kegiatan promosi fuel;",
  //         "Koordinasi terkait penetapan harga retail dan commercial fuel.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       internal: "Retail Gas Sales ",
  //       aktivitas: [
  //         "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis fuel;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       internal: "Internal audit ",
  //       aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
  //     },
  //   ],
  //   relation: [
  //     {
  //       id: 1,
  //       eksternal: "DPR/DPRD",
  //       aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan fuel."],
  //     },
  //     {
  //       id: 2,
  //       eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
  //       aktivitas: ["Koordinasi terkait perizinan dan pengawasan penyaluran fuel."],
  //     },
  //     {
  //       id: 3,
  //       eksternal: "BPH Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi fuel PSO."],
  //     },
  //     {
  //       id: 4,
  //       eksternal: "Hiswana Migas",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan pengelolaan lembaga penyalur."],
  //     },
  //     {
  //       id: 5,
  //       eksternal: "BPK/Kementrian Keuangan",
  //       aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran fuel PSO."],
  //     },
  //     {
  //       id: 6,
  //       eksternal: "Tokoh Masyarakat",
  //       aktivitas: ["Koordinasi terkait penggalangan/community development."],
  //     },
  //     {
  //       id: 7,
  //       eksternal: "Konsultan",
  //       aktivitas: ["Konsultasi terkait penelitian."],
  //     },
  //     {
  //       id: 8,
  //       eksternal: "Wartawan",
  //       aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang fuel."],
  //     },
  //     {
  //       id: 9,
  //       eksternal: "Pihak eksternal lainnya",
  //       aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
  //     },
  //   ],
  //   //persyaratan jabatan
  //   education: [
  //     "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
  //     "S1 dengan pengalaman kerja 6 - 9 tahun.",
  //     "Pengalaman kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
  //     "3 - 6 tahun menjabat posisi setingkat Jr. Analyst atau Supervisor.",
  //   ],

  //   persyaratanKhusus: [" "],

  //   komtekMandatori: [
  //     {
  //       id: "1",
  //       komtekMandatoriName: "HSSE General ",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekMandatoriName: "Risk Fundamental",
  //       level: "1",
  //     },
  //     {
  //       id: "3",
  //       komtekMandatoriName: "Digital & Analytic Insight",
  //       level: "1",
  //     },
  //   ],
  //   komtekGeneral: [
  //     {
  //       id: "1",
  //       komtekGeneralName: "Marketing Strategy and Planning",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekGeneralName: "Customer Relation Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekGeneralName: "Sales Strategy and Planning",
  //       level: "2",
  //     },
  //   ],
  //   komtekSpesifik: [
  //     {
  //       id: "1",
  //       komtekSpesifikName: "Stakeholder Management",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekSpesifikName: "Sales and Account Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekSpesifikName: "Promotion and Campaign Management",
  //       level: "2",
  //     },
  //     {
  //       id: "4",
  //       komtekSpesifikName: "Sales Administration",
  //       level: "2",
  //     },
  //     {
  //       id: "5",
  //       komtekSpesifikName: "Handling Customer Complaint",
  //       level: "2",
  //     },
  //     {
  //       id: "6",
  //       komtekSpesifikName: "Channel Management",
  //       level: "2",
  //     },
  //     {
  //       id: "7",
  //       komtekSpesifikName: "Product/Service Development",
  //       level: "2",
  //     },
  //     {
  //       id: "8",
  //       komtekSpesifikName: "Domestic Supply Management",
  //       level: "2",
  //     },
  //   ],
  //   komper: [
  //     {
  //       id: "1",
  //       komperName: "Fostering Collaboration",
  //     },
  //     {
  //       id: "2",
  //       komperName: "Analysis",
  //     },
  //     {
  //       id: "3",
  //       komperName: "Managing Work",
  //     },
  //     {
  //       id: "4",
  //       komperName: "Continuous Improvement",
  //     },
  //     {
  //       id: "5",
  //       komperName: "Technology Awareness",
  //     },
  //     {
  //       id: "6",
  //       komperName: "Adaptability",
  //     },
  //     {
  //       id: "7",
  //       komperName: "Quality Orientation",
  //     },
  //   ],
  // },
  // {
  //   identifikasi: {
  //     id: 17,
  //     jobName: "SBM Sumsel III Fuel",
  //     function: "Regional Sumbagsel/Retail Sales Sumbagsel",
  //     location: "Prabumulih",
  //     directorat: "Pemasaran Regional ",
  //     directReport: "SAM Retail Sumsel",
  //     sk: "Kpts-009/PNG000000/2024-S8",
  //     tanggal: "01 April 2024",
  //   },
  //   fungsi:
  //     "Melakukan perencanaan kegiatan penjualan, monitoring pelaksanaan kegiatan penyaluran dan penjualan produk, pelaksanaan kegiatan pemasaran produk, pembuatan laporan aktivitas penjualan, melakukan kegiatan pengelolaan penjualan dan memonitor kinerja channel, penyusunan rencana pengembangan channel (penjualan dan jaringan), dan kunjungan ke channel dan pelanggan serta melakukan pengelolaan relasi dengan pihak stakeholder sebagai upaya tercapainya kegiatan pemasaran produk fuel yang efektif dan dapat berjalan dengan lancar untuk mencapai target penjualan perusahaan di Retail Sales Sumbagsel khususnya di Area Palembang.",
  //   //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
  //   tugasHa: [
  //     {
  //       id: 1,
  //       responsible:
  //         "Melakukan penyusunan sales planning produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: ["Sales forecast (pragnosa revenue);", "Sales goals (target, strategi dan rencana penjualan)."],
  //       lead: ["Tersedianya sales forecast;", "Tersedianya sales goals untuk masing-masing channel."],
  //     },
  //     {
  //       id: 2,
  //       responsible:
  //         "Melakukan pelaksanaan sales dan penyaluran  produk fuel melalui channel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan pemantauan stock fuel yang ada pada channel;",
  //         "Pelaksanaan kegiatan penyaluran channel kepada konsumen;",
  //         "Pelaksanaan identifikasi kondisi pasar di sekitar channel.",
  //       ],
  //       lead: ["Tercapainya target penjualan yang ditentukan oleh perusahaan."],
  //     },
  //     {
  //       id: 3,
  //       responsible:
  //         "Melakukan evaluasi terhadap channel terkait penjualan fuel  di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan monitoring dan evaluasi penjualan channel;",
  //         "Pelaksanaan pemberian reward dan konsekuensi terkait kinerja channel;",
  //         "Pelaksanaan dan tindak lanjut evaluasi dan rekomendasi terhadap kegiatan penyaluran.",
  //       ],
  //       lead: ["Tingkat standar pelayanan oleh channel sesuai yang ditetapkan oleh perusahaan."],
  //     },
  //     {
  //       id: 4,
  //       responsible:
  //         "Melakukan identifikasi kebutuhan pengembangan jaringan dan layanan channel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan identifikasi kebutuhan pengembangan jaringan dan layanan channel di wilayah;",
  //         "Pelaksanaan analisis kelayakan pengembangan jaringan dan layanan channel;",
  //         "Pelaksanaan proses peluang channel baru.",
  //       ],
  //       lead: ["Tingkat akurasi dan kesesuaian identifikasi kebutuhan pengembangan jaringan dan layanan channel."],
  //     },
  //     {
  //       id: 5,
  //       responsible:
  //         "Melakukan kegiatan promosi terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Usulan objective promosi produk/layanan dari seluruh wilayah;",
  //         "Usulan tema promosi;",
  //         "Pelaksanaan kerja sama dengan pihak terkait dalam eksekusi program promosi;",
  //         "Pelaksanaan evaluasi program promosi;",
  //         "Pelaksanaan tindak lanjut program promosi.",
  //       ],
  //       lead: ["Tingkat efektivitas kegiatan promosi."],
  //     },
  //     {
  //       id: 6,
  //       responsible:
  //         "Melakukan kegiatan pengelolaan relasi dengan pelanggan terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Pelaksanaan tindak lanjut penanganan saran dan keluhan pelanggan;",
  //         "Pelaksanaan tindak lanjut permintaan pelanggan;",
  //         "Program pembinaan relasi dengan pelanggan;",
  //         "Pelaksanaan kegiatan dan evaluasi pembinaan relasi dengan pelanggan.",
  //       ],
  //       lead: [
  //         "Tingkat kesesuaian dan ketepatan waktu tindak lanjut penyelesaian saran/pertanyaan/keluhan/permintaan pelanggan;",
  //         "Customer satisfaction index;",
  //         "Tingkat efektivitas pengelolaan kegiatan pembinaan relasi.",
  //       ],
  //     },
  //     {
  //       id: 7,
  //       responsible:
  //         "Melakukan pengelolaan roll out  digitalisasi pada kegiatan channel retail di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: [
  //         "Rencana digitalisasi channel;",
  //         "Pelaksanaan implementasi digitalisasi channel;",
  //         "Hasil evaluasi dan rekomendasi kegiatan implementasi digitalisasi channel;",
  //         "Data transaksi pada kegiatan channel.",
  //       ],
  //       lead: [
  //         "Tingkat pencapaian roll out digitalisasi pada kegiatan channel;",
  //         "Tingkat ketersediaan data transaksi pada kegiatan channel.",
  //       ],
  //     },
  //     {
  //       id: 8,
  //       responsible:
  //         "Melakukan kegiatan relasi dengan stakeholder terkait penjualan produk fuel di Fungsi Retail Sales Sumbagsel khususnya di Area Palembang.",
  //       output: ["Pelaksanaan relasi dengan pihak stakeholder."],
  //       lead: ["Tingkat efektivitas kegiatan pembinaan relasi dengan stakeholder."],
  //     },
  //   ],
  //   tugasUmum: [
  //     {
  //       id: 1,
  //       header:
  //         "<b>Implementasi HSSE</b> Melakukan implementasi program-program budaya HSSE dan pengelolaan risiko HSSE berbasis sistem manajemen HSSE yang diimplementasikan oleh perusahaan.",
  //       tugas: [
  //         "Hasil implementasi program budaya HSSE pada segala aspek kegiatan fungsi untuk mencapai level budaya generatif;",
  //         "Hasil implementasi kebijakan perusahaan terkait aspek HSSE;",
  //         "Hasil implementasi program pengelolaan risiko aspek HSSE yang terkait dengan kegiatan operasional fungsi;",
  //         "Hasil integrasi parameter leading & lagging indicator aspek HSSE sebagai bagian yang tidak terpisahkan dari kinerja bisnis perusahaan.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       header:
  //         "<b>Pengelolaan Risiko & Kepatuhan GCG</b> Melakukan pengelolaan risiko yang meliputi identifikasi, mitigasi, monitoring risiko, dan program risiko serta pengelolaan kepatuhan terhadap standar GCG di unit kerja/fungsi.",
  //       tugas: [
  //         "Hasil identifikasi risiko;",
  //         "Rencana dan realisasi mitigasi risiko;",
  //         "Laporan implementasi kepatuhan terhadap standar GCG;",
  //         "Hasil implementasi program budaya risiko pada segala aspek kegiatan operasional fungsi.",
  //       ],
  //     },
  //     {
  //       id: 3,
  //       header:
  //         "<b>Project</b> Melakukan pelaksanaan project dilakukan sesuai penugasan dan kewenangan yang diberikan untuk kebutuhan perusahaan.",
  //       tugas: ["Terlaksananya eksekusi project."],
  //     },
  //   ],
  //   wewenang: ["N/A"],
  //   koordinasi: [
  //     {
  //       id: 1,
  //       internal: "Area Manager Communication Relation & CSR ",
  //       aktivitas: [
  //         "Koordinasi terkait pengelolaan relasi dengan pihak regulator;",
  //         "Koordinasi terkait pengelolaan relasi dengan pihak media.",
  //       ],
  //     },
  //     {
  //       id: 2,
  //       internal: "Region Manager Reliability & Project Development ",
  //       aktivitas: ["Koordinasi terkait peningkatan keandalan sarana dan fasilitas fuel."],
  //     },
  //     {
  //       id: 3,
  //       internal: "Region Manager Supply and Distribution",
  //       aktivitas: ["Koordinasi terkait keandalan pasokan fuel dan gas ke lembaga penyalur."],
  //     },
  //     {
  //       id: 4,
  //       internal: "Marketing",
  //       aktivitas: [
  //         "Koordinasi terkait riset pasar;",
  //         "Koordinasi terkait analisa kompetitor serta data dan informasi dalam identifikasi segmen pasar;",
  //         "Koordinasi terkait kegiatan promosi fuel;",
  //         "Koordinasi terkait penetapan harga retail dan commercial fuel.",
  //       ],
  //     },
  //     {
  //       id: 5,
  //       internal: "Retail Gas Sales ",
  //       aktivitas: [
  //         "Koordinasi terkait implementasi kebijakan penyaluran dan pengembangan bisnis fuel;",
  //         "Koordinasi terkait pengembangan jaringan (outlet retail).",
  //       ],
  //     },
  //     {
  //       id: 6,
  //       internal: "Internal audit ",
  //       aktivitas: ["Koordinasi terkait audit internal dan eksternal."],
  //     },
  //   ],
  //   relation: [
  //     {
  //       id: 1,
  //       eksternal: "DPR/DPRD",
  //       aktivitas: ["Koordinasi/hearing terkait situasi terkini pengelolaan fuel."],
  //     },
  //     {
  //       id: 2,
  //       eksternal: "Pemprov/Pemda/TNI/Polri/ Kejaksaan/Administrasi Pelabuhan",
  //       aktivitas: ["Koordinasi terkait perizinan dan pengawasan penyaluran fuel."],
  //     },
  //     {
  //       id: 3,
  //       eksternal: "BPH Migas",
  //       aktivitas: ["Koordinasi terkait verifikasi fuel PSO."],
  //     },
  //     {
  //       id: 4,
  //       eksternal: "Hiswana Migas",
  //       aktivitas: ["Koordinasi terkait penyaluran fuel dan pengelolaan lembaga penyalur."],
  //     },
  //     {
  //       id: 5,
  //       eksternal: "BPK/Kementrian Keuangan",
  //       aktivitas: ["Koordinasi terkait pemeriksaan laporan penyaluran fuel PSO."],
  //     },
  //     {
  //       id: 6,
  //       eksternal: "Tokoh Masyarakat",
  //       aktivitas: ["Koordinasi terkait penggalangan/community development."],
  //     },
  //     {
  //       id: 7,
  //       eksternal: "Konsultan",
  //       aktivitas: ["Konsultasi terkait penelitian."],
  //     },
  //     {
  //       id: 8,
  //       eksternal: "Wartawan",
  //       aktivitas: ["Koordinasi terkait pengelolaan informasi publik tentang fuel."],
  //     },
  //     {
  //       id: 9,
  //       eksternal: "Pihak eksternal lainnya",
  //       aktivitas: ["Koordinasi sesuai kebutuhan perusahaan."],
  //     },
  //   ],
  //   //persyaratan jabatan
  //   education: [
  //     "Sarjana dari berbagai jurusan, diutamakan dari Manajemen/Manajemen Pemasaran.",
  //     "S1 dengan pengalaman kerja 6 - 9 tahun.",
  //     "Pengalaman kerja di bidang Marketing, Sales & Commercial diutamakan di bidang Sales.",
  //     "3 - 6 tahun menjabat posisi setingkat Jr. Analyst atau Supervisor.",
  //   ],

  //   persyaratanKhusus: [" "],

  //   komtekMandatori: [
  //     {
  //       id: "1",
  //       komtekMandatoriName: "HSSE General ",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekMandatoriName: "Risk Fundamental",
  //       level: "1",
  //     },
  //     {
  //       id: "3",
  //       komtekMandatoriName: "Digital & Analytic Insight",
  //       level: "1",
  //     },
  //   ],
  //   komtekGeneral: [
  //     {
  //       id: "1",
  //       komtekGeneralName: "Marketing Strategy and Planning",
  //       level: "1",
  //     },
  //     {
  //       id: "2",
  //       komtekGeneralName: "Customer Relation Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekGeneralName: "Sales Strategy and Planning",
  //       level: "2",
  //     },
  //   ],
  //   komtekSpesifik: [
  //     {
  //       id: "1",
  //       komtekSpesifikName: "Stakeholder Management",
  //       level: "2",
  //     },
  //     {
  //       id: "2",
  //       komtekSpesifikName: "Sales and Account Management",
  //       level: "2",
  //     },
  //     {
  //       id: "3",
  //       komtekSpesifikName: "Promotion and Campaign Management",
  //       level: "2",
  //     },
  //     {
  //       id: "4",
  //       komtekSpesifikName: "Sales Administration",
  //       level: "2",
  //     },
  //     {
  //       id: "5",
  //       komtekSpesifikName: "Handling Customer Complaint",
  //       level: "2",
  //     },
  //     {
  //       id: "6",
  //       komtekSpesifikName: "Channel Management",
  //       level: "2",
  //     },
  //     {
  //       id: "7",
  //       komtekSpesifikName: "Product/Service Development",
  //       level: "2",
  //     },
  //     {
  //       id: "8",
  //       komtekSpesifikName: "Domestic Supply Management",
  //       level: "2",
  //     },
  //   ],
  //   komper: [
  //     {
  //       id: "1",
  //       komperName: "Fostering Collaboration",
  //     },
  //     {
  //       id: "2",
  //       komperName: "Analysis",
  //     },
  //     {
  //       id: "3",
  //       komperName: "Managing Work",
  //     },
  //     {
  //       id: "4",
  //       komperName: "Continuous Improvement",
  //     },
  //     {
  //       id: "5",
  //       komperName: "Technology Awareness",
  //     },
  //     {
  //       id: "6",
  //       komperName: "Adaptability",
  //     },
  //     {
  //       id: "7",
  //       komperName: "Quality Orientation",
  //     },
  //   ],
  // },
];

const dataListJobDescription = [
  {
    id: 1,
    jobName: "Manager Internal Communication",
    jobStatus: "not available",
    division: "Corporate Secretary",
    function: "Corporate Secretary",
  },
  {
    id: 2,
    jobName: "SBM Sumsel VI Gas",
    jobStatus: "not available",
    division: "Regional Sumbagsel",
    function: "Retail Sales Sumbagsel",
  },
  {
    id: 3,
    jobName: "Manager Stakeholder Relation & Management",
    jobStatus: "available",
    division: "Corporate Secretary Subholding Commercial & Trading",
    function: "Corporate Secretary",
  },
  {
    id: 4,
    jobName: "Manager Corporate Communication",
    jobStatus: "available",
    division: "Corporate Secretary Subholding Commercial & Trading",
    function: "Corporate Secretary",
  },
  {
    id: 5,
    jobName: "Manager CSR & SMEPP Management",
    jobStatus: "waiting approval",
    division: "Corporate Secretary Subholding Commercial & Trading",
    function: "Corporate Secretary",
  },
  {
    id: 6,
    jobName: "SBM Sumsel V Gas",
    jobStatus: "waiting approval",
    division: "Regional Sumbagsel",
    function: "Retail Sales Sumbagsel",
  },
  {
    id: 9,
    jobName: "Manager Corporate Governance & Board Support",
    jobStatus: "available",
    division: "Corporate Secretary Subholding Commercial & Trading",
    function: "Corporate Secretary",
  },
  {
    id: 13,
    jobName: "SBM Jambi III Gas",
    jobStatus: "available",
    division: "Regional Sumbagsel",
    function: "Retail Sales Sumbagsel",
  },
  {
    id: 14,
    jobName: "SBM Jambi IV Gas",
    jobStatus: "available",
    division: "Regional Sumbagsel",
    function: "Retail Sales Sumbagsel",
  },
];

const actionBack = {
  button: "Back",
  className: "btn-outline-primary",
  callback: function () {
    hideModal(`modalConfirm`);
  },
};

const statusApproval = {
  1: "Submmited",
  2: "Approved",
  3: "Rejected",
  4: "Finalized",
};
const statusApprovalClass = {
  1: "label-info-custom",
  2: "label-success-custom",
  3: "label-info-custom",
  4: "label-primary-custom",
};
