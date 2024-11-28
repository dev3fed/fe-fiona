//Manager Stakeholder Relation & Management

const dataJobDescCompare = [
  {
    identifikasi: {
      jobName: "Manager Stakeholder Relation & Management",
      function: "Corporate Secretary Subholding Commercial & Trading",
      location: "Kantor Pusat",
      directorat: "Direktorat Utama",
      directReport: "Corporate Secretary",
      sk: "Kpts-009/PNG000000/2024-S8",
    },
    fungsi:
      "Mengarahkan, memonitor dan mengevaluasi pengelolaan relasi dengan stakeholders/shareholder (termasuk stakeholders government maupun non government), kerja sama perusahaan, Izin Niaga Umum (INU), serta pemenuhan data kebutuhan regulatory report dalam rangka membangun dan menjaga citra dan reputasi positif korporasi, meningkatkan posisi perusahaan serta memajukan kepentingan perusahaan dalam lingkup bisnis komersial dan perdagangan.",
    //responsible : tugas & tanggung jawab, output : hasil akhir yang diharapkan, lead : leading indicator
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
          "<b>Planning, Budgeting dan Pengelolaan Anggaran<b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
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

    komtek_mandatori: [
      {
        id: "1",
        komtek_mandatori_name: "HSSE General ",
        level: "2",
      },
      {
        id: "2",
        komtek_mandatori_name: "HC Integrated  ",
        level: "2",
      },
      {
        id: "3",
        komtek_mandatori_name: "Strategic & Business Management  ",
        level: "2",
      },
      {
        id: "4",
        komtek_mandatori_name: "Risk Fundamental",
        level: "2",
      },
      {
        id: "5",
        komtek_mandatori_name: "Digital & Analytic Insight",
        level: "2",
      },
    ],
    komtek_general: [
      {
        id: "1",
        komtek_general_name: "Message Management ",
        level: "3",
      },
      {
        id: "2",
        komtek_general_name: "Stakeholder Management  ",
        level: "3",
      },
      {
        id: "3",
        komtek_general_name: "Public Communication ",
        level: "3",
      },
    ],
    komtek_spesifik: [
      {
        id: "1",
        komtek_spesifik_name: "Brand Communication ",
        level: "3",
      },
      {
        id: "2",
        komtek_spesifik_name: "Media Relation Management",
        level: "3",
      },
      {
        id: "3",
        komtek_spesifik_name: "Brand Equity Management ",
        level: "2",
      },
      {
        id: "4",
        komtek_spesifik_name: "Stakeholder Mapping ",
        level: "3",
      },
      {
        id: "5",
        komtek_spesifik_name: "Investor Relation Management ",
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
      jobName: "Manager Corporate Communication",
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
          "<b>Planning, Budgeting dan Pengelolaan Anggaran<b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
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
    komtek_mandatori: [
      {
        id: "1",
        komtek_mandatori_name: "HSSE General",
        level: 2,
      },
      {
        id: "2",
        komtek_mandatori_name: "HC Integrated",
        level: 2,
      },
      {
        id: "3",
        komtek_mandatori_name: "Strategic & Business Management",
        level: 2,
      },
      {
        id: "4",
        komtek_mandatori_name: "Risk Fundamental",
        level: 2,
      },
      {
        id: "5",
        komtek_mandatori_name: "Digital & Analytic Insight",
        level: 2,
      },
    ],
    komtek_general: [
      {
        id: "1",
        komtek_general_name: "Message Management",
        level: 3,
      },
      {
        id: "2",
        komtek_general_name: "Stakeholder Management",
        level: 3,
      },
      {
        id: "3",
        komtek_general_name: "Public Communication",
        level: 3,
      },
    ],
    komtek_spesifik: [
      {
        id: "1",
        kompetensi: "Brand Communication",
        level: 3,
      },
      {
        id: "2",
        kompetensi: "Crisis Communication",
        level: 3,
      },
      {
        id: "3",
        kompetensi: "Media Relation Management",
        level: 3,
      },
      {
        id: "4",
        kompetensi: "Brand Equity Management",
        level: 2,
      },
      {
        id: "5",
        kompetensi: "Event Management",
        level: 3,
      },
      {
        id: "6",
        kompetensi: "Stakeholder Mapping",
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
      jobName: "Manager CSR & SMEPP Management",
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
          "<b>Planning, Budgeting dan Pengelolaan Anggaran<b> Mengelola, mengevaluasi, dan memastikan penyusunan dan monitoring Rencana Kerja dan Anggaran (RKA) unit kerja/fungsi dan pengelolaan anggaran.",
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
    komtek_mandatori: [
      {
        id: "1",
        komtek_mandatori_name: "HSSE General",
        level: 2,
      },
      {
        id: "2",
        komtek_mandatori_name: "HC Integrated",
        level: 2,
      },
      {
        id: "3",
        komtek_mandatori_name: "Strategic & Business Management",
        level: 2,
      },
      {
        id: "4",
        komtek_mandatori_name: "Risk Fundamental",
        level: 2,
      },
      {
        id: "5",
        komtek_mandatori_name: "Digital & Analytic Insight",
        level: 2,
      },
    ],
    komtek_general: [
      {
        id: "1",
        kompetensi: "Message Management",
        level: 3,
      },
      {
        id: "2",
        kompetensi: "Stakeholder Management",
        level: 3,
      },
      {
        id: "3",
        kompetensi: "Public Communication",
        level: 3,
      },
    ],
    komtek_spesifik: [
      {
        id: "1",
        komtek_spesifik_name: "Brand Communication",
        level: 3,
      },
      {
        id: "2",
        komtek_spesifik_name: "Community Involvement and Development Program Planning & Design",
        level: 3,
      },
      {
        id: "3",
        komtek_spesifik_name: "Event Management",
        level: 3,
      },
      {
        id: "4",
        komtek_spesifik_name: "Social Mapping",
        level: 3,
      },
      {
        id: "5",
        komtek_spesifik_name: "Community Involvement and Development Project Management",
        level: 3,
      },
      {
        id: "6",
        komtek_spesifik_name: "Stakeholder Mapping",
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
];
