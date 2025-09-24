const url = {
  baseUrl: url_api,
  "organization-structure": "api/organization-structure",
  "job-description": "api/job-description",
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

const draftExistingJobDesc = {
  draftId: null,
  draftOrganizationId: null,
  draftRasciId: null,
  draftName: null,
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

const customTableHeaderNoArray = ["responsible"];
const customTableHeaderCleaned = ["wewenang"];
const customTableHeaderHeader = ["header"];

// const untuk tableCustomJobDescription
const tabCusJD = {
  tugasHa: ["no", "index", "responsible", "output", "lead"],
  tugasUmum: ["no", "header", "tugas"],
  wewenang: ["no", "wewenang"],
  koordinasi: ["no", "internal", "aktivitas"],
  relation: ["no", "eksternal", "aktivitas"],
  pj: ["pj"],
  stk: ["stkNumber", "stkTitle"],
};


// Chart Loading HTML Template
const CHART_LOADING_HTML = `
  <div id="chart-loading-overlay" style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(248, 249, 250, 0.95);
    z-index: 2;
    border-radius: 4px;
  ">
    <div style="
      border: 4px solid #e9ecef;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: chart-spin 1.2s linear infinite;
    "></div>
    <p style="
      margin-top: 20px;
      color: #495057;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 8px;
    "
    id="header-loading-chart"
    >Loading organization chart...</p>
    <p style="
      margin: 0;
      color: #6c757d;
      font-size: 14px;
      text-align: center;
    ">Please wait while we prepare your data</p>
  </div>
  <style>
    @keyframes chart-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
`;

const DATA_NOT_FOUND_HTML = `
  <div id="data-not-found-overlay" style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(248, 249, 250, 0.95);
    z-index: 2;
    border-radius: 4px;
  ">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
    <p style="
      margin: 0;
      color: #6c757d;
      font-size: 14px;
      text-align: center;
    ">Data not found</p>
  </div>
`;

const REMOVE_PLUGINS = [
  "Heading",
  "Link",
  "CKFinderUploadAdapter",
  "CKFinder",
  "EasyImage",
  "Image",
  "ImageCaption",
  "ImageStyle",
  "ImageToolbar",
  "ImageUpload",
  "MediaEmbed",
];

// CKEditor configuration to remove "Powered by CKEditor" branding
const CKEDITOR_UI_CONFIG = {
  poweredBy: {
    position: "inside",
    side: "left",
    label: null,
  },
};

const defaultNodeId = "10132406";
const jobId = urlParams.get("jobId");
const prlOrg = urlParams.get("prlOrg");
const positionCode = urlParams.get("positionCode");

const DATA_NOT_FOUND = `Data not found`;

const TOOLBAR_FULL = ["bold", "italic", "|", "bulletedList", "numberedList", "|", "undo", "redo"];
const TOOLBAR_SHORT = ["undo", "redo"];


const mappingAddUpdate = {
  tugasHa: {
    ls: "tugasHa",
    ids: ["responsible", "output", "lead"],
    toolbar: true,
    toolbarType: TOOLBAR_FULL,
    listIds: ["responsible", "output", "lead"],
    defaultData: {
      jobId: "",
      prlOrg: "",
      uraian: null,
      responsible: [],
      output: [],
      lead: [],
      tanggungJawabProses: [],
      jobReferences: [],
    },
  },
  stk: {
    ls: "stk",
    ids: ["stkNumber", "stkTitle"],
    toolbar: true,
    toolbarType: TOOLBAR_SHORT,
    defaultData: {
      jobId: null,
      prlOrg: null,
      positionId: "",
      penanggungJawab: "",
      stkNumber: "",
      stkTitle: "",
      jdJobReferences: [],
    },
  },
  relation: {
    ls: "relasiEksternal",
    ids: ["eksternal", "aktivitas"],
    toolbar: true,
    toolbarType: TOOLBAR_SHORT,
    defaultData: {
      jobId: "",
      prlOrg: "",
      eksternal: "",
      aktivitas: ";",
      jdJobReferences: [],
    },
  },
  koordinasi: {
    ls: "koordinasiInternal",
    ids: ["internal", "aktivitas"],
    toolbar: true,
    toolbarType: TOOLBAR_SHORT,
    defaultData: {
      jobId: "",
      prlOrg: "",
      internal: "",
      aktivitas: "",
      jdJobReferences: [],
    },
  },
};
