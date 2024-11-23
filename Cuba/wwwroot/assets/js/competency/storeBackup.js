const appState = new Proxy(
  {
    draftList: [
      {
        id: 1,
        draftName: "testing draft",
        createdDate: "2024-11-14T08:45:44.840Z",
        createdBy: "Superadmin",
        type: "draft",
        jobTitle: {
          id: 1,
          job_name: "Corporate Secretary",
          job_level: 1,
        },
        GeneralCompeName: {
          id: 11,
          competency_name: "Media Relation Management",
          category: "specific",
        },
        DepthLevelBefore: 3,
        DepthLevelAfter: "4",
        reqId: "Req/11/14/2024/001",
        typeDetail: "Edit General Competency Depth Level",
      },
    ],
    dataEditDraft: {},
    dataDetailDraft: {},
    deleteDraftCompetency: 0,
    competencyDetailList: [
      {
        idcompetency: 1,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses aktivitas pekerjaannya sesuai dengan aturan dan standar HSSE.",
        level1: [
          "Memahami dan mampu menerapkan konsep peraturan dasar yang berkaitan dengan Kesehatan, Keselamatan, Keamanan dan Lingkungan yang sesuai dengan bidang kerjanya",
          "Memahami perannya dalam HSSE management system SUPREME",
          "Memahami kebijakan HSSE Grup di bidang ini",
          "Memahami tantangan dan risiko utama terkait HSSE pada bidang kerjanya",
          "Memahami dan mampu menerapkan konsep dan aturan dasar emergency response & crisis management",
        ],
        level2: [
          "Mampu menjalankan pengetahuan praktis tentang berbagai bidang terkait Kesehatan, Keselamatan, Keamanan dan Lingkungan",
          "Mampu mengimplementasikan perannya dalam HSSE Management System SUPREME, menjalankan semua indikator HSSE yang digunakan, peraturan utama dan implikasinya terhadap HSSE serta menemukan informasi terkait dengan peraturan HSSE sesuai dengan bidangnya",
          "Mampu melakukan identifikasi dan penilaian risiko serta tantangan yang terkait dengan aktivitas di entitasnya, memahami dan mampu menjalankan kebijakan HSSE Grup, serta mampu mengelola masalah HSSE",
          "Mampu memberikan arahan dan pengkondisian saat terjadi keadaan darurat serta memberikan pertolongan yang dibutuhkan oleh para pekerja",
        ],
        level3: [
          "Mampu menjalankan pengetahuan mendalam tentang berbagai bidang terkait Kesehatan, Keselamatan, Keamanan dan Lingkungan",
          "Mampu memberikan evaluasi dan rekomendasi penerapan HSSE Management System SUPREME secara umum sesuai dengan bidangnya serta memantau dan mengoordinasikan pekerjaan dengan fungsi HSSE terkait",
          "Mampu melakukan evaluasi hasil penilaian risiko, menentukan mitigasi, dan mampu menjalankan HSSE Risk Management yang sesuai dengan bidangnya",
        ],
        level4: [
          "Mampu mengembangkan saran perbaikan yang inovatif dalam penerapan HSSE secara general perusahaan",
          "Mampu bertindak sebagai trusted advisor terkait HSSE di bidang kerjanya",
        ],
      },
      {
        idcompetency: 2,
        definition:
          "Pengetahuan dan \r\nketerampilan terkait \r\npengelolaan sumber daya \r\nmanusia dan \r\nimplementasinya dalam \r\norganisasi untuk \r\nmemastikan peningkatan \r\nproduktivitas dan \r\nmendukung bisnis \r\nsustainability.",
        level1: [
          "Memahami konsep dasar mengenai pengelolaan sumber daya manusia dalam unit kerja",
          "Memahami atribut organisasi yang terkait dengan \r\npengelolaan SDM, seperti namun tidak terbatas pada : \r\ntupoksi, job deskripsi dan target masing-masing individu",
          "Memahami tugas dan tanggung jawab tim serta \r\nmampu melakukan cascading assignment pada pekerja \r\ndalam unit kerja/fungsi",
          "Mampu menyusun perencanaan terhadap \r\npengelolaan SDM di unit kerja/fungsi",
        ],
        level2: [
          "Mampu memfasilitasi kebutuhan pekerja/pengelolaan \r\nSDM di unit kerja/fungsi",
          "Mampu melakukan identifikasi peta kekuatan tim di unit \r\nkerja/fungsi serta menyusun target (secara proporsional) \r\ndan assignment yang relevan untuk setiap tim",
          "Mampu memberikan umpan balik pada pekerja sesuai \r\ndengan pencapaian kinerja secara berkala",
          "Mampu mengelola melakukan identifikasi kebutuhan program pengembangan pekerja di unit \r\nkerja/fungsi",
          "Mampu melakukan analisis dan memberikan solusi terhadap pengelolaan sumber daya manusia dalam unit kerja",
        ],
        level3: [
          "Mampu memfasilitasi kebutuhan & pengelolaan SDM \r\ndi lintas unit kerja/fungsi",
          "Mampu membimbing dan memberikan dukungan kepada \r\nsetiap pekerja sesuai dengan profil pekerja, untuk \r\nmeningkatkan produktivitas di unit kerja/fungsi",
          "Mampu melakukan evaluasi dan memberikan rekomendasi improvement terhadap pengelolaan sumber daya manusia lintas unit kerja",
          "Mampu menyusun rekomendasi rencana \r\npengembangan pekerja jangka panjang yang selaras dengan aspirasi pekerja dan tujuan organisasi",
          "Mampu memberikan solusi terhadap permasalahan dalam pengelolaan sumber daya manusia lintas unit kerja/fungsi secara integratif guna mendukung peningkatan produktivitas dan tercapainya tujuan bisnis di unit kerja/fungsi",
        ],
        level4: [
          "Mampu membuat desain metode baru mengenai \r\npengelolaan SDM untuk keberlangsungan bisnis pada \r\nlintas unit kerja",
          "Mampu bertindak sebagai trusted advisor terkait \r\npengelolaan SDM yang efektif untuk meningkatkan \r\nproduktivitas dan tercapainya tujuan bisnis di unit \r\nkerja/fungsi",
        ],
      },
      {
        idcompetency: 3,
        definition:
          "Pengetahuan dan \r\nketerampilan terkait \r\npengelolaan bisnis dan \r\nimplementasinya dalam \r\norganisasi untuk \r\nmemastikan peningkatan \r\nproduktivitas dan \r\nmendukung bisnis \r\nsustainability.",
        level1: [
          "Memahami prinsip-prinsip dasar mengenai proses bisnis, model bisnis, dan arah strategi perusahaan saat ini",
          "Memahami lingkungan bisnis yang dapat mempengaruhi kinerja bisnis perusahaan",
          "Memahami konsep dasar mengenai pengelolaan bisnis dalam unit kerja, termasuk parameter keberhasilan dan aspek yang perlu diukur dalam pengukuran kinerja bisnis",
          "Mampu melakukan analisis terkait proses bisnis unit kerja/fungsi dan keselarasannya dengan arah strategi perusahaan",
          "Memahami dan terlibat dalam proses penerjemahan strategi perusahaan menjadi langkah-langkah nyata",
        ],
        level2: [
          "Memahami prinsip-prinsip dalam penyusunan rencana strategis perusahaan",
          "Mampu melakukan analisis dan penerapan pemahaman model-model bisnis serta proses bisnis dan value chain perusahaan, lingkungan bisnis perusahaan",
          "Mampu menerapkan konsep umum yang dibutuhkan untuk menerjemahkan strategi perusahaan menjadi langkah-langkah nyata",
          "Mampu melakukan pengukuran dan penyusunan laporan kinerja bisnis unit sesuai dengan form yang telah disediakan",
        ],
        level3: [
          "Mampu menganalisis keterkaitan strategi divisi kerja fungsi lain di perusahaan",
          "Mampu mengidentifikasi peluang pengembangan strategi divisi kerja berdasarkan kajian lingkungan bisnis untuk meningkatkan kinerja divisi kerja",
          "Mampu mengintegrasikan seluruh strategi divisi kerja dengan peluang pengembangan strategi divisi kerja",
          "Mampu menyusun rencana strategis yang selaras dengan strategi perusahaan berdasarkan hasil analisis model bisnis, proses bisnis, value chain perusahaan, serta lingkungan bisnis internal dan eksternal perusahaan",
          "Mampu melakukan evaluasi dan memberikan rekomendasi perbaikan terkait pencapaian kinerja bisnis unit kerja",
        ],
        level4: [
          "Mampu bertindak sebagai trusted advisor terkait business integrated perusahaan",
          "Mampu mendesain sistem/pendekatan baru dalam menjalankan business integrated perusahaan",
        ],
      },
      {
        idcompetency: 4,
        definition:
          "Pengetahuan dan keterampilan terkait proses manajemen risiko dalam organisasi untuk mendukung pencapaian target perusahaan.",
        level1: [
          "Mengenali tahapan-tahapan proses manajemen risiko",
          "Memahami proses bisnis perusahaan secara umum",
          "Memahami ketentuan internal yang berkaitan dengan pengelolaan risiko sesuai dengan bidang kerjanya",
          "Mampu melakukan identifikasi dan analisis dan evaluasi risiko sesuai tugas dan tanggung jawab yang dilakukan",
          "Mampu melakukan penanganan risiko yang sudah teridentifikasi sesuai dengan bidang kerjanya",
          "Mampu melakukan recording and reporting risiko",
        ],
        level2: [
          "Mampu melakukan review dan memberikan rekomendasi terhadap risiko-risiko yang sudah diidentifikasi",
          "Mampu melakukan identifikasi dan analisis dan evaluasi risiko tambahan sesuai tugas dan tanggung jawab yang dilakukan",
          "Mampu melakukan review and monitoring risiko",
          "Mampu melakukan koordinasi dalam penanganan risiko dalam atau lintas unit kerja",
        ],
        level3: [
          "Mampu melakukan identifikasi dan analisis dan evaluasi risiko tambahan yang bersifat strategis sesuai tugas dan tanggung jawab yang dilakukan",
          "Mampu mengintegrasikan proses manajemen risiko pada lingkup fungsi sehingga menjadi Top Risk fungsi",
          "Mampu memberikan masukan/improvement atas hasil monitoring dan review Top Risk",
          "Mampu mengalokasikan sumber daya yang dibutuhkan dalam rangka penanganan risiko",
        ],
        level4: [
          "Mampu bertindak sebagai trusted advisor terkait risk fundamental perusahaan",
          "Mampu mendesain inovasi dalam rangka improvement proses manajemen risiko perusahaan",
        ],
      },
      {
        idcompetency: 5,
        definition:
          "Pengetahuan dan keterampilan dalam pemanfaatan data dan teknologi digital dalam organisasi untuk memastikan peningkatan produktivitas dan mendukung bisnis sustainability.",
        level1: [
          "Mampu menggunakan teknologi/solusi  eksisting dalam proses kerja termasuk penerapan kode etik dan sistem keamanannya",
          "Memahami sumber dan jenis data/informasi yang dibutuhkan dalam proses kerjanya",
          "Mampu melakukan data gathering, klasifikasi, pengolahan dan penyimpanan data/informasi sesuai tata kelola perusahaan dan kebutuhan unit kerja",
          "Memahami konsep dasar permasalahan yang membutuhkan implementasi teknologi dan solusi yang digunakan dalam menyelesaikan permasalahan di dalam proses bisnis unit kerja",
        ],
        level2: [
          "Mampu merekomendasikan pemanfaatan teknologi digital pada unit kerjanya sebagai solusi kegiatan operasional yang lebih efektif dan efisien",
          "Mampu melakukan integrasi dan analisis data serta penyajian informasi guna mendukung pengambilan keputusan bisnis",
          "Mampu melakukan analisis dan menyusun use case (solusi teknologi) guna simplifikasi proses bisnis atau efektivitas pekerjaan",
        ],
        level3: [
          "Mampu merekomendasikan adanya peluang untuk penerapan teknologi digital serta integrasinya pada lintas unit kerja guna efektivitas dan efisiensi",
          "Mampu memberikan rekomendasi improvement/insight yang didapatkan dari analytics bagi perusahaan",
          "Mampu menyajikan nilai tambah dan mengukur realisasi progress pencapaian use case (solusi teknologi)",
          "Mampu memberikan rekomendasi pendekatan analytics di luar unit kerja",
        ],
        level4: [
          "Mampu bertindak menjadi trusted advisor terkait Digital & Analytic Insight",
          "Mampu menyusun strategi dan mengembangkan metode terkait Digital & Analytic Insight untuk skala enterprise-wide",
        ],
      },
      {
        idcompetency: 15,
        definition:
          "Pengetahuan dan keterampilan tentang proses-proses bisnis perusahaan, perilaku industri dan pasar, serta ekosistem bisnis suatu industri guna memperoleh pemahaman komprehensif atas suatu bisnis atau suatu industri.",
        level1: [
          "Memahami prinsip-prinsip dasar mengenai pengetahuan model bisnis dan proses bisnis perusahaan, serta perilaku industri dan pasar",
          "Memahami data dan informasi terkait model-model bisnis dan proses bisnis perusahaan, serta perilaku industri dan pasar",
          "Mampu melakukan pengumpulan data dan informasi dan analisis sederhana terkait suatu bisnis atau suatu industri dengan pengawasan ketat",
        ],
        level2: [
          "Mampu melakukan analisis dan penerapan pemahaman model-model bisnis serta proses bisnis dan value chain perusahaan, serta perilaku industri dan pasar secara mandiri",
        ],
        level3: [
          "Mampu melakukan evaluasi dan membuat rekomendasi terkait hasil analisis model bisnis, value chain dan proses bisnis perusahaan, serta perilaku industri dan pasar",
          "Mampu melakukan evaluasi dan rekomendasi prosedur dan metode untuk melakukan analisis model bisnis dan value chain perusahaan, serta perilaku industri dan pasar",
        ],
        level4: [
          "Mampu bertindak sebagai trusted advisor terkait analisis model-model bisnis serta perilaku industri dan pasar",
          "Mampu mendesain sistem/pendekatan baru terkait analisis model-model bisnis, value chain dan proses bisnis perusahaan, serta perilaku industri dan pasar",
        ],
      },
      {
        idcompetency: 20,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses penyusunan dan pengendalian anggaran dari rencana kerja yang dilakukan berdasarkan asumsi-asumsi logis dari keadaan kondisi keekonomian domestik dan global untuk memenuhi tujuan perusahaan seperti pertumbuhan pendapatan (earnings growth), efisiensi biaya (cost efficiency), rencana penjualan dan produksi (sales and production plans), volume produksi, serta tingkat pengembalian modal (return on investment).",
        level1: [
          "Memahami prinsip-prinsip dasar rencana kerja operasi dan investasi dalam suatu periode yang ditentukan oleh perusahaan",
          "Memahami prinsip-prinsip dasar dalam menguraikan faktor-faktor eksternal yang berpengaruh pada proses penyusunan dan pengendalian anggaran",
          "Mampu melakukan pengumpulan data yang dibutuhkan terkait pengelolaan anggaran",
        ],
        level2: [
          "Memahami prinsip-prinsip dasar pengawasan dan pengendalian anggaran rencana kerja perusahaan",
          "Mampu melakukan identifikasi probabilitas atau tingkat ketepatan serta batas toleransi ketidaktepatan penyusunan dan pengendalian anggaran secara mandiri dalam situasi normal, dan menggunakan alat atau metode yang tepat",
        ],
        level3: [
          "Mampu melakukan analisis tujuan korporat (Corporate Goals) seperti pertumbuhan pendapatan (earnings growth), efisiensi biaya (cost efficiency), rencana penjualan dan produksi (sales & production plans), volume produksi, tingkat pengembalian modal (return on investment)",
          "Mampu memberikan rekomendasi atas perbaikan proses dan prosedur penyusunan dan pengendalian anggaran",
        ],
        level4: [
          "Mampu memberikan usulan dan melakukan inovasi terkait metode baru/formula baru/invent teknik baru dalam penyusunan dan pengendalian anggaran perusahaan",
          "Mampu bertindak sebagai trusted advisor atas penyusunan dan pengendalian anggaran perusahaan",
        ],
      },
      {
        definition:
          "Pengetahuan dan keterampilan tentang pengelolaan kegiatan sistem tata kerja mulai dari pemetaan, perencanaan, penyusunan, pengendalian hingga audit sistem tata kerja berbasis proses bisnis.",
        level1: [
          "Memahami prinsip-prinsip dasar dan tujuan STK berbasis Proses Bisnis",
          "Memahami jenis, kriteria dan persyaratan STK berbasis Proses Bisnis dalam pengelolaan STK berbasis Proses Bisnis",
          "Mampu mengumpulkan data-data untuk penyusunan STK",
        ],
        level2: [
          "Mampu menjelaskan prinsip dasar pengertian STK berbasis Proses Bisnis",
          "Mampu melakukan penyusunan STK berbasis proses bisnis",
          "Mampu melakukan monitoring dan memfasilitasi penyusunan STK berbasis Proses Bisnis",
          "Mampu melakukan analisis pengelolaan STK berbasis Proses Bisnis",
        ],
        level3: [
          "Mampu melakukan analisis dan komparasi STK berbasis Proses Bisnis antar direktorat secara komprehensif",
          "Mampu melakukan alignment STK berbasis Proses Bisnis antar direktorat secara komprehensif",
          "Mampu memastikan STK telah memenuhi prinsip ODCC dan risk-based thinking",
          "Mampu melakukan audit STK berbasis Proses Bisnis di perusahaan",
          "Mampu memberikan rekomendasi hasil analisis, komparasi, atau alignment STK berbasis Proses Bisnis kepada user",
        ],
        level4: [
          "Mampu mendesain dan membuat inovasi/perubahan pengelolaan STK berbasis Proses Bisnis secara terintegrasi di perusahaan dan anak perusahaan",
          "Mampu bertindak sebagai trusted advisor terkait STK berbasis Proses Bisnis, untuk corporate-wide level",
        ],
      },
      {
        idcompetency: 12,
        definition:
          "Pengetahuan dan keterampilan tentang kepatuhan proses bisnis perusahaan terhadap peraturan dalam rangka aktivitas bisnis tertentu sesuai bidangnya di perusahaan.",
        level1: [
          "Memahami regulasi dan hierarkinya terkait dengan aktivitas perusahaan",
          "Memahami prinsip-prinsip Good Corporate Governance",
          "Mampu melakukan identifikasi peraturan internal dan eksternal yang diperlukan dalam rangka aktivitas bisnis perusahaan",
        ],
        level2: [
          "Mampu melakukan analisis keselarasan peraturan terhadap aktivitas bisnis tertentu",
          "Mampu melakukan analisis awal terhadap keselarasan proses bisnis perusahaan dengan peraturan perusahaan",
        ],
        level3: [
          "Mampu memberikan masukan/usulan rekomendasi terkait kesesuaian proses bisnis perusahaan terhadap peraturan perusahaan yang berlaku",
        ],
        level4: [
          "Mampu membuat strategi pelaksanaan proses bisnis tertentu agar sesuai dengan peraturan",
          "Mampu menyusun dan melakukan evaluasi pedoman internal agar sesuai dengan peraturan",
          "Mampu bertindak sebagai trusted advisor terkait kepatuhan terhadap peraturan dalam rangka aktivitas bisnis tertentu",
        ],
      },
      {
        definition:
          "Pengetahuan dan keterampilan tentang mencari dan mengumpulkan informasi menyangkut fakta dan aturan yang lengkap dan relevan dengan melakukan riset atau penelitian data atas suatu permasalahan untuk melakukan analisis hukum.",
        level1: [
          "Memahami teknik dasar metode penelitian/riset hukum dalam mencari dan mengumpulkan informasi menyangkut fakta dan aturan yang relevan atas suatu permasalahan yang sederhana untuk melakukan analisis hukum",
          "Memahami teknik dasar metode penelitian/riset hukum dalam melakukan komparasi dan pemilahan informasi menyangkut fakta dan aturan yang relevan atas suatu permasalahan yang sederhana untuk melakukan analisis hukum",
          "Mampu melakukan pengumpulan data/informasi menyangkut fakta dan aturan yang relevan atas suatu permasalahan yang sederhana",
        ],
        level2: [
          "Mampu melakukan metode dan merumuskan pokok penelitian/riset, kerangka teori/konsepsional, dan merumuskan pokok penelitian/riset hukum dalam mencari dan mengumpulkan informasi menyangkut fakta dan aturan yang relevan atas suatu permasalahan yang sederhana untuk melakukan analisis hukum",
          "Mampu melakukan identifikasi dan klasifikasi data/informasi menyangkut fakta dan aturan yang relevan atas suatu permasalahan yang sederhana",
        ],
        level3: [
          "Mampu melakukan metode dan merumuskan pokok penelitian/riset hukum, dalam mencari dan mengumpulkan informasi menyangkut fakta dan aturan yang relevan atas suatu permasalahan yang kompleks untuk melakukan analisis hukum multi legal aspect",
          "Mampu melakukan identifikasi dan klasifikasi data/informasi menyangkut fakta dan aturan atas suatu permasalahan yang kompleks dan memiliki dimensi international/transnasional",
        ],
        level4: [
          "Mampu melakukan metode penelitian/riset hukum, dalam mencari dan mengumpulkan informasi menyangkut fakta dan aturan yang lengkap dan relevan atas suatu permasalahan yang tidak sederhana dan non rutin untuk melakukan analisis hukum multi legal aspect dan memiliki dimensi international/transnasional",
          "Mampu mengintegrasikan hasil analisis hukum yang menyangkut fakta dan aturan atas suatu permasalahan yang kompleks dan memiliki dimensi international/transnasional",
          "Mampu mengumpulkan informasi menyangkut fakta dan aturan untuk melakukan analisis hukum disertai dengan kesimpulan dan rekomendasi yang aplikatif didasarkan pada prinsip-prinsip dasar profesionalisme sebagai konsultan internal dan peraturan yang berlaku",
        ],
      },
      {
        idcompetency: 9,
        definition:
          "Pengetahuan dan keterampilan tentang proses kegiatan pengelolaan brand perusahaan yang bertujuan utk corporate campaign guna memengaruhi persepsi pemangku kepentingan terhadap citra dan reputasi perusahaan.",
        level1: [
          "Memahami strategi komunikasi dan konsep brand communication dengan beragam media",
          "Mampu melaksanakan prosedur brand communication",
          "Mampu memahami proses kegiatan corporate campaign",
        ],
        level2: [
          "Mampu melakukan identifikasi dan analisis kebutuhan brand communication korporat",
          "Mampu mengimplementasikan brand communication activities dan daily operation (termasuk event sponsorship, advertising, exhibition, merchandising)",
        ],
        level3: [
          "Mampu melakukan analisis dan memberikan rekomendasi terhadap produksi materi komunikasi yang paling sesuai dan bernilai tambah berdasarkan brand communication strategy yang telah ditentukan",
          "Mampu melakukan analisis dan evaluasi efektivitas communication campaign yang dilaksanakan melalui riset",
          "Mampu terlibat secara aktif dalam kegiatan mengembangkan inspiring briefs berdasarkan brand positioning statement dan brand communication strategy yang telah ditentukan",
        ],
        level4: [
          "Mampu melakukan analisis dan memberikan rekomendasi terhadap tren brand communication dan strategy di level global",
          "Mampu menciptakan terobosan baru dalam menyusun brand communication strategy untuk meningkatkan brand equity serta mengantisipasi competitor campaign",
          "Mampu bertindak sebagai trusted advisor terkait brand communication",
        ],
      },
      {
        idcompetency: 13,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses pengelolaan brand yang terkait dengan aset dan liabilitas yang berhubungan dengan sebuah brand, guna mendukung pembentukan citra dan reputasi yang baik dimata stakeholders.",
        level1: [
          "Memahami konsep dan prinsip-prinsip dasar mengenai brand equity management",
          "Memahami prinsip dan metode pengelolaan brand yang dijalankan perusahaan",
          "Mampu mengumpulkan informasi dan melakukan analisis sederhana untuk mengevaluasi brand health",
        ],
        level2: [
          "Memahami aspek-aspek yang mempengaruhi brand equity",
          "Mampu melaksanakan program peningkatan brand equity dengan menggunakan semua aset",
        ],
        level3: [
          "Mampu melakukan evaluasi brand health, memantau competitor brand performance",
          "Mampu memberikan alternatif solusi maupun memberikan masukan untuk penyusunan brand strategy",
          "Mampu menyusun brand positioning statement serta menterjemahkan brand strategy ke dalam rencana implementasi",
        ],
        level4: [
          "Mampu menciptakan cara dan strategi baru untuk meningkatkan brand equity agar menjadi pilihan utama stakeholders",
          "Mampu merumuskan kebijakan pengelolaan corporate brand",
          "Mampu bertindak sebagai trusted advisor dan strategi dan roadmap pengelolaan brand equity yang dapat berdampak pada peningkatan citra dan reputasi perusahaan",
        ],
      },
      {
        idcompetency: 10,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses pengelolaan informasi dan koordinasi suatu keadaan/kondisi dalam menghadapi situasi yang menggangu jalannya kegiatan perusahaan sehingga mengakibatkan resiko yang dapat mengancam kredibilitas perusahaan di mata publik.",
        level1: [
          "Memahami prosedur penanggulangan atas terjadinya krisis komunikasi di perusahaan",
          "Memahami isu/kejadian yang berpotensi menjadi situasi/keadaan darurat krisis komunikasi",
          "Mampu melakukan analisis sederhana informasi dan isu terkait krisis komunikasi perusahaan dan anak perusahaan",
        ],
        level2: [
          "Mampu melakukan pemetaan sumber dan potensi isu krisis komunikasi",
          "Mampu melakukan identifikasi gejala-gejala awal akan terjadinya krisis komunikasi",
          "Mampu melaksanakan penanganan krisis komunikasi",
        ],
        level3: [
          "Mampu melakukan koordinasi dengan fungsi terkait dalam menangani krisis komunikasi",
          "Mampu menyusun dan memberikan rekomendasi penanganan krisis",
          "Mampu menyusun evaluasi penanganan krisis komunikasi untuk perbaikan di masa mendatang",
          "Mampu mengelola dan mengembangkan networking untuk pencegahan dan penanganan krisis komunikasi",
        ],
        level4: [
          "Mampu mengembangkan metode penanganan isu yang berkembang sehingga isu tersebut tidak menjadi krisis dan/atau berubah menjadi isu yang positif dengan dukungan dari media",
          "Mampu mengembangkan perbaikan prosedur, sistem, budaya dan metode penanganan krisis komunikasi dengan mengevaluasi penanganan krisis yang lampau",
          "Mampu bertindak sebagai trusted advisor terkait krisis komunikasi",
        ],
      },
      {
        idcompetency: 16,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses pengelolaan event korporasi perusahaan guna meningkatkan citra dan reputasi perusahaan.",
        level1: [
          "Memahami prinsip dasar penyelenggaraan event korporat",
          "Memahami dan mengimplementasikan protokoler yang digunakan di korporasi",
          "Mampu melaksanakan event korporasi sesuai dengan prosedur",
        ],
        level2: [
          "Mampu melakukan identifikasi kebutuhan event korporasi",
          "Mampu melakukan koordinasi event korporat dengan fungsi-fungsi lain dan pihak eksternal terkait",
        ],
        level3: [
          "Mampu menyelenggarakan konsep event korporat yang membutuhkan koordinasi dengan beragam pihak dengan tepat sasaran dan sesuai kebutuhan perusahaan",
          "Mampu melakukan evaluasi dalam pelaksanaan mampu melakukan improvisasi penyelenggaraan event korporat",
          "Mampu meningkatkan efektifitas dan efisiensi sumber daya yang terkait dengan penyelenggaraan acara",
          "Mampu memanfaatkan event sebagai saluran komunikasi yang efektif dalam menyampaikan pesan kunci perusahaan pada seluruh stakeholders",
        ],
        level4: [
          "Mampu mendesain dan mengembangkan inovasi konsep event korporat sebagai saluran komunikasi perusahaan",
          "Mampu memberikan solusi terhadap kebutuhan event korporat",
          "Mampu bertindak sebagai trusted advisor terkait penyelengaraan event korporasi",
        ],
      },
      {
        idcompetency: 6,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan pengelolaan pesan mulai dari proses analisis, formulasi pesan, sampai menyajikan informasi agar para stakeholders memahami dan mendukung visi dan misi perusahaan.",
        level1: [
          "Memahami kriteria informasi yang perlu disampaikan kepada pihak internal atau eksternal",
          "Memahami berbagai saluran komunikasi yang tepat sesuai dengan pesan yang ingin disampaikan serta disesuaikan dengan karakteristik stakeholders",
          "Memahami konsep dasar pengelolaan pesan dan teknik penulisan content berita/informasi",
          "Mampu melakukan penulisan draft konten berita/informasi sederhana",
          "Mampu melakukan monitoring pesan yang disampaikan dibawah supervisi",
        ],
        level2: [
          "Mampu memilah dan menyusun informasi menjadi pesan melalui saluran komunikasi yang tersedia serta disesuaikan dengan karakteristik stakeholders",
          "Mampu menentukan saluran komunikasi yang efektif yang akan dipergunakan untuk penyampaian pesan",
          "Mampu melakukan penulisan konten berita/informasi",
          "Mampu melakukan monitoring pesan secara mandiri",
        ],
        level3: [
          "Mampu melakukan evaluasi dan menentukan pesan yang akan disampaikan melalui berbagai saluran komunikasi yang tersedia serta disesuaikan dengan karakteristik stakeholders",
          "Mampu melakukan evaluasi serta memberikan rekomendasi atas pemanfaatan saluran komunikasi yang paling efektif untuk penyampaian pesan",
          "Mampu menentukan indikator keberhasilan penyampaian pesan",
        ],
        level4: [
          "Mampu mengembangkan grand design dan metode penyampaian pesan yang tepat sesuai dengan isi pesan, waktu, khalayak sasaran serta saluran komunikasi yang paling efektif untuk penyampaian pesan tersebut",
          "Mampu mendesain dan mengembangkan saluran komunikasi baru yang efektif dan menggunakannya sebagai sarana penyampaian pesan",
          "Mampu bertindak sebagai trusted advisor terkait pengelolaan pesan",
        ],
      },
      {
        idcompetency: 8,
        definition:
          "Pengetahuan dan keterampilan dalam berkomunikasi kepada publik secara langsung terstruktur dan sistematis guna informasi yang disampaikan dengan baik.",
        level1: [
          "Memahami prinsip-prinsip dasar metode dan teknik dalam penyampaian pesan/informasi",
          "Mampu melakukan identifikasi dalam menentukan metode penyampaian pesan/informasi sederhana disertai supervisi",
        ],
        level2: [
          "Memahami metode dan teknik penyampaian pesan/informasi",
          "Mampu melakukan analisis dalam menentukan metode penyampaian pesan/informasi yang efektif",
          "Mampu melakukan kegiatan penyampaian pesan/informasi kepada audiens berdasarkan data dan hasil analisis disertai supervisi",
        ],
        level3: [
          "Mampu melakukan penyampaian pesan/informasi dengan berbagai metode",
          "Mampu melakukan penyampaian pesan/informasi kepada audiens dalam jumlah besar dan lebih bersifat kompleks",
          "Mampu menyampaikan pesan/informasi yang dapat mempengaruhi audiens",
        ],
        level4: [
          "Mampu melakukan inovasi atau pengembangan terkait teknik-teknik dalam melakukan penyampaian pesan/informasi",
          "Mampu menjadi wakil perusahaan dalam event perusahaan berskala besar (nasional/internasional) baik internal maupun eksternal terkait kegiatan public communication",
          "Mampu bertindak sebagai trusted advisor terkait penyampaian pesan/informasi",
        ],
      },
      {
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses pengelolaan hubungan dengan para investor atau calon investor termasuk proses pemilihan, kegiatan fasilitasi yang diperlukan, dan pengelolaan penyampaian pesan terhadap para investor atau calon investor baik nasional maupun internasional guna untuk mendukung pencapaian aspirasi perusahaan.",
        level1: [
          "Memahami jenis atau tipe investor dan kebutuhannya sesuai aspirasi perusahaan",
          "Memahami etika dalam komunikasi lintas budaya",
          "Memahami jenis-jenis kerjasama yang terjalin dengan perusahaan dan melakukan penjadwalan bisnis",
          "Mampu mendapatkan, mengumpulkan serta analisis sederhana terhadap data-data pendukung terkait investor dan calon investor dengan supervisi/instruksi",
        ],
        level2: [
          "Mampu mengolah dan melakukan analisis data-data pendukung dalam proses atas profil investor maupun calon investor",
          "Mampu memilah dan melakukan analisis bisnis dan melakukan koordinasi dengan fungsi-fungsi terkait yang terkait dengan aspirasi Perusahaan",
          "Mampu melakukan pembinaan hubungan dengan investor atau calon investor, termasuk responsif terhadap permintaan atau pertanyaan yang diajukan",
          "Mampu melakukan komunikasi lintas budaya terkait bisnis dengan supervisi",
        ],
        level3: [
          "Mampu melakukan evaluasi dan kesimpulan dari data-data kerjasama yang didapat",
          "Mampu melakukan evaluasi dan menyusun rekomendasi terkait pola hubungan/kerjasama dengan investor (dan calon investor) yang sesuai dengan aspirasi Perusahaan",
          "Mampu melakukan komunikasi terkait bisnis atau penawaran investasi perusahaan yang sesuai dengan etika komunikasi lintas budaya dan etika bisnis",
          "Mampu memberikan rekomendasi potensi investasi atau kerjasama bisnis untuk perusahaan",
        ],
        level4: [
          "Mampu menyusun grand strategy komunikasi investor yang mendukung pencapaian visi perusahaan di bidang investasi atau kerjasama bisnis",
          "Mampu mengembangkan inovasi baru dalam hal bernegosiasi dan komunikasi lintas budaya dengan investor sehingga aspirasi dari perusahaan dapat tercapai",
          "Mampu bertindak sebagai trusted advisor dalam komunikasi investor, dan terkait pengelolaan hubungan dengan investor",
        ],
      },
      {
        idcompetency: 11,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses pengelolaan hubungan dengan media massa guna tercapainya publikasi atau penyiaran maksimal atas informasi perusahaan, sebagai sarana komunikasi antara perusahaan dengan publik dan pengelolaan isu perusahaan yang berkembang di publik.",
        level1: [
          "Memahami prinsip dasar dalam pengelolaan hubungan dengan media massa",
          "Memahami karakteristik media",
          "Mampu mendefinisi tools yang digunakan dalam pengelolaan hubungan dengan media massa",
          "Mampu melakukan identifikasi berita dengan tone negatif, positif, dan netral yang diberitakan oleh media massa terkait perusahaan dan anak perusahaan dengan supervisi",
        ],
        level2: [
          "Mampu melakukan pengelolaan hubungan dengan media massa",
          "Mampu memilih dan melakukan analisis tools yang digunakan dalam pengelolaan hubungan dengan media massa",
          "Mampu melakukan analisis pemberitaan dan isu yang diberitakan oleh media massa berdasarkan metode yang paling tepat terkait isu perusahaan dan anak perusahaan",
          "Mampu membangun dialog intensif dengan pihak media sebagai narasumber perusahaan",
        ],
        level3: [
          "Mampu melakukan pengelolaan hubungan baik dengan media massa sehingga dapat memengaruhi pemberitaan media agar sesuai dengan kebijakan perusahaan",
          "Mampu melakukan evaluasi dan menyusun rekomendasi terkait pengelolaan hubungan dengan media massa",
          "Mampu menginterpretasi hasil analisis pemberitaan (media) dan memprediksi dampak ke depannya terhadap perusahaan",
          "Mampu menyusun rekomendasi atas hasil pemberitaan yang ada di media",
          "Mampu melakukan evaluasi dan menyusun rekomendasi terkait metode dan pelaksanaan analisis pemberitaan terhadap isu perusahaan dan anak perusahaan",
        ],
        level4: [
          "Mampu melakukan pengelolaan hubungan baik dengan media massa sehingga dapat menghasilkan agenda setting sesuai kepentingan perusahaan",
          "Mampu menciptakan issue dan mempengaruhi media massa dalam rangka menggiring opini public",
          "Mampu melakukan inovasi atau pengembangan terkait metode/teknik dalam pengelolaan media relation",
          "Mampu menentukan metode analisis pemberitaan yang paling tepat dan sesuai dengan kebutuhan perusahaan",
          "Mampu menyusun strategi dan kebijakan dalam pengelolaan media relation",
          "Mampu bertindak sebagai trusted advisor terkait pengelolaan relasi dengan media",
        ],
      },
      {
        idcompetency: 7,
        definition:
          "Pengetahuan dan keterampilan tentang pengelolaan hubungan dengan stakeholders (mulai dari analisa, mitigasi, strategi/perencanaan, evaluasi, dan rencana perbaikan) guna mendukung jalannya kegiatan operasional perusahaan baik nasional maupun internasional.",
        level1: [
          "Memahami stakeholders utama perusahaan",
          "Memahami kebutuhan stakeholders dan metode dalam melakukan pembinaan hubungan baik dengan masing-masing stakeholders",
          "Memahami prinsip dasar GCG dalam pengelolaan stakeholders",
          "Mampu melakukan analisis sederhana cara pembinaan hubungan yang baik dengan stakeholders",
        ],
        level2: [
          "Mampu melakukan identifikasi metode yang sesuai dalam pembinaan relasi dengan masing-masing stakeholders yang menjadi tanggung jawabnya",
          "Mampu melakukan proses pembinaan hubungan baik dengan masing-masing stakeholders, selaras dengan prinsip dasar GCG dan aspirasi perusahaan",
          "Mampu melakukan komunikasi dengan stakeholders untuk mendukung jalannya kegiatan operasional perusahaan",
        ],
        level3: [
          "Mampu melakukan evaluasi dan menyusun rekomendasi dalam proses pembinaan hubungan baik dengan stakeholders",
          "Mampu menentukan metode yang digunakan dalam proses pembinaan hubungan baik dengan masing-masing stakeholders agar selaras dengan prinsip dasar GCG dan aspirasi perusahaan",
          "Mampu melakukan negosiasi dengan stakeholders untuk mendukung aspirasi perusahaan",
          "Mampu mengelola dan memitigasi konflik dengan memanfaatkan hubungan antar stakeholders",
          "Mampu menjadi internal advisor terkait stakeholders management",
        ],
        level4: [
          "Mampu bertindak sebagai trusted advisor terkait program yang berkelanjutan dengan stakeholders",
          "Mampu menyelaraskan aspirasi Perusahaan dengan aspirasi masing-masing stakeholders",
          "Mampu menyusun grand design kegiatan stakeholders management",
          "Mampu menciptakan kemitraan strategis dengan stakeholders kunci yang berhubungan dengan operasi perusahaan",
          "Mampu mengembangkan perilaku stakeholder utama sebagai “supporter” Perseroan dan memberikan pemahaman GCG kepada stakeholders (merubah paradigma negatif menjadi positif)",
        ],
      },
      {
        idcompetency: 17,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses pemetaan terhadap stakeholders guna menentukan stakeholders prioritas sesuai dengan bisnis dan aspirasi perusahaan, baik nasional maupun internasional.",
        level1: [
          "Memahami prinsip-prinsip dasar dalam kegiatan pemetaan stakeholders",
          "Memahami lembaga/instansi serta pihak-pihak yang menjadi stakeholders terkait proses bisnis yang dijalankan oleh perusahaan",
          "Memahami konsep dasar dan teknik dalam melakukan profiling stakeholders",
          "Mampu melakukan kegiatan profilling dan pemetaan stakeholders secara umum",
          "Mampu melakukan penyusunan dokumen secara sistematis terkait stakeholder mapping dengan pengawasan ketat",
        ],
        level2: [
          "Mampu melakukan analisis untuk menentukan stakeholder kunci sehingga diperoleh data yang dapat menunjang untuk kegiatan proyek bisnis/aspirasi Perusahaan",
          "Mampu melakukan peengelolaan data secara berkesinambungan (updating) terkait data stakeholder",
        ],
        level3: [
          "Mampu melakukan evaluasi dan memberikan rekomendasi dari data-data hasil pemetaan stakeholder yang diperoleh sehingga dapat menjadi acuan atau action plan untuk pengelolaan stakeholder",
          "Mampu menyusun program mitigasi terhadap pengelolaan stakeholders",
        ],
        level4: [
          "Mampu mengembangkan inovasi/terobosan baru dalam hal pemetaan stakeholders",
          "Mampu mengembangkan grand strategi pemetaan stakeholders",
          "Mampu bertindak sebagai trusted advisor terkait pemetaan stakeholders",
        ],
      },
      {
        idcompetency: 14,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses penyusunan desain program community development dan pelibatan masyarakat (CID) guna mendukung pertumbuhan dan keberlanjutan (sustainability) perusahaan.",
        level1: [
          "Memahami 3 karakter utama program CID yaitu Community Based, Local Resource Based, dan Sustainable",
          "Memahami konsep 5P (People, Profit, Planet, Prosperity, Peace) dan standar sistem yang berlaku (ISO 26000) dalam merancang program CID berdasarkan identifikasi kebutuhan masyarakat, visi-misi perusahaan dan keselarasan dengan program pemerintah",
          "Memahami konsep dan teori dasar mengenai penyusunan desain program community development dan pelibatan masyarakat",
          "Memahami ukuran-ukuran keberhasilan program community development dan pelibatan masyarakat",
          "Mampu melaksanakan program CID sesuai prosedur dengan pengawasan",
        ],
        level2: [
          "Mampu menyusun program yang selaras dengan kebutuhan masyarakat, visi-misi perusahaan dan keselarasan dengan program pemerintah sesuai dengan prinsip GCG",
          "Mampu melaksanakan tahapan program mulai dari perencanaan, pelaksanaan, monitoring reporting hingga phase-out (exit), dalam rangka pencapaian target (output & outcome) program community development dan pelibatan masyarakat dalam program pengembangan masyarakat",
          "Mampu melakukan identifikasi mitra kerjasama eksternal perusahaan yang berkompeten dan memiliki reputasi yang baik dalam melaksanakan program pemberdayaan sosial dan ekonomi masyarakat",
          "Mampu melakukan evaluasi pelaksanaan program",
          "Mampu melakukan identifikasi risiko sosial terkait aktivitas/operasional/bisnis perusahaan",
        ],
        level3: [
          "Mampu melakukan evaluasi peluang-peluang manfaat dan risiko kerjasama program community development dan pelibatan masyarakat dalam bisnis guna mendapatkan efektifitas program yang signifikan",
          "Mampu melakukan evaluasi dan memilih mitra kerjasama CID yang berpengaruh secara signifikan terhadap peningkatan reputasi perusahaan",
          "Mampu melakukan analisis hasil perhitungan social return of investment (SROI)",
          "Mampu melakukan analisis ukuran keberhasilan program CID dan pelibatan masyarakat dalam bisnis",
        ],
        level4: [
          "Mampu mengembangkan desain program CID yang inovatif guna mendukung pertumbuhan dan keberlanjutan (sustainability) perusahaan",
          "Mampu melakukan evaluasi dan pemutakhiran desain program CID untuk meningkatkan kualitas pelaksanaan program agar mendapatkan nilai tambah bagi Perusahaan",
          "Mampu bertindak sebagai trusted advisor dalam desain program CID dalam pengembangan masyarakat",
        ],
      },
      {
        idcompetency: 19,
        definition:
          "Pengetahuan dan keterampilan tentang proses mengelola dan mengendalikan suatu program Community Involvement and Development (CID) yang akan atau sedang dikerjakan, dengan memperhatikan semua aspek kinerja seperti pelibatan masyarakat, waktu, biaya, dan keselamatan kerja, guna mendapatkan hasil yang optimal.",
        level1: [
          "Memahami prinsip-prinsip dasar dan tahapan pelaksanaan proyek CID",
          "Memahami dan mengetahui tujuan pelaksanaan proyek CID",
          "Mampu mengumpulkan dan analisa data dan informasi yang dibutuhkan dalam pelaksanaan proyek CID",
          "Memahami parameter-parameter dalam pelaksanaan proyek CID (kinerja: pelibatan masyarakat, waktu, biaya, mutu dan keselamatan kerja) sesuai dengan kepentingan perusahaan",
        ],
        level2: [
          "Mampu menyusun rencana pelaksanaan proyek CID dan menentukan parameter keberhasilan proyek (definisi ruang lingkup, tujuan dan manfaat, jadwal, biaya, tim, rencana komunikasi, kebijakan, rencana konstruksi, perhitungan risiko proyek, pengelolaan mutu proyek, pengelolaan K3L, hubungan sosial, dll.)",
          "Mampu melakukan monitoring dan controlling pelaksanaan proyek CID",
          "Mampu menyusun laporan akhir pelaksanaan program CID",
        ],
        level3: [
          "Mampu melakukan evaluasi dan membuat rekomendasi terkait hasil analisis kinerja proyek CID sosial untuk meningkatkan efektifitas dan efisiensi sumber daya",
          "Mampu melakukan adaptasi/adjustment terhadap perubahan yang terjadi sesuai asas GCG yang ada dalam pengelolaan program community development dan pelibatan masyarakat dalam program pengembangan masyarakat",
          "Mampu melakukan analisis pengelolaan proyek sosial termasuk pemanfaatan anggaran program community development dan pelibatan masyarakat dalam bisnis",
        ],
        level4: [
          "Mampu menyusun metode baru terkait pengelolaan proyek CID sesuai dinamika lingkungan yang terjadi",
          "Mampu memberikan diagnosis dan solusi permasalahan sosial yang kompleks",
          "Mampu bertindak sebagai trusted advisor terkait pelaksanaan proyek CID",
          "Mampu menjadi role model/champion dalam penerapan GCG dalam proyek CID",
        ],
      },
      {
        idcompetency: 18,
        definition:
          "Pengetahuan dan keterampilan dalam melakukan proses pemetaan kondisi (suatu wilayah), mencakup pemetaan stakeholders, identifikasi masalah, dan kebutuhan masyarakat, serta potensi masyarakat untuk menjadi landasan penyusunan program community development dan pelibatan masyarakat dalam program pengembangan masyarakat.",
        level1: [
          "Memahami kriteria informasi demografi dan kondisi sosial masyarakat serta faktor-faktor relevan yang perlu didapatkan untuk digunakan dalam dalam perencanaan program pengembangan masyarakat",
          "Memahami karakteristik stakeholders yang relevan terhadap community development dan pelibatan masyarakat dalam perencanaan program pengembangan masyarakat",
          "Mampu melakukan mapping terkait kondisi sosial satu wilayah atau kebutuhan masyarakat sesuai dengan prosedur/acuan kriteria",
        ],
        level2: [
          "Mampu melakukan identifikasi lokasi dan masyarakat yang menjadi sasaran program CID",
          "Mampu melakukan analisis kondisi sosial satu wilayah atau kebutuhan masyarakat untuk menentukan bentuk dan jenis program CID yang akan dilakukan",
          "Mampu mengelola ekspektasi stakeholders untuk optimalisasi program community development dan pelibatan masyarakat dalam perencanaan program pengembangan masyarakat agar sesuai dengan visi-misi perusahaan",
        ],
        level3: [
          "Mampu melakukan analisis mendalam terkait data social mapping dikaitkan dengan tren konsep pembangunan masyarakat nasional, regional, dan global",
          "Mampu menyusun skala prioritas program CID sesuai dengan berbasis data terkait kondisi sosial ekonomi masyarakat",
          "Mampu melakukan evaluasi dan memberikan rekomendasi terhadap desain social mapping termasuk kesesuaiannya dengan kebutuhan masyarakat atau wilayah tertentu",
        ],
        level4: [
          "Mampu mengembangkan model pemetaan sosial yang aplikatif di lingkungan Pertamina untuk memberikan added value dan optimalisasi terhadap stakeholder engagement",
          "Mampu melakukan transformasi data social mapping menjadi sebuah program CID yang dapat menciptakan nilai tambah bagi inti bisnis perusahaan",
          "Mampu bertindak sebagai trusted advisor dalam desain social mapping",
        ],
      },
      {
        definition:
          "Pengetahuan dan keterampilan tentang tata cara pengelolaan kegiatan administrasi, sistem korespondensi (penciptaan dokumen arsip) perusahaan.",
        level1: [
          "Memahami jenis dan format surat dinas (surat dinas khusus, surat dinas umum dan surat dinas mengatur) perusahaan baik manual maupun elektronik, alur/proses penciptaan surat dinas perusahaan, serta prosedur pembuatan surat dinas perusahaan berklasifikasi rahasia dan sangat rahasia",
          "Mampu melakukan kegiatan administratif, meliputi pencatatan, penghitungan dan lainnya dengan supervisi",
        ],
        level2: [
          "Mampu mengelola korespondensi baik manual maupun elektronik sesuai standar perusahaan",
          "Mampu mengusulkan perbaikan teknis yang diperlukan untuk menunjang pengelolaan korespondensi yang lebih baik",
        ],
        level3: [
          "Mampu melakukan evaluasi dan rekomendasi sistem dan prosedur korespondensi perusahaan baik manual dan elektronik",
          "Mampu melakukan assessment untuk memastikan implementasi korespondensi sesuai standar yang ditetapkan",
        ],
        level4: [
          "Mampu bertindak sebagai trusted advisor terkait sistem dan prosedur korespondensi perusahaan baik manual dan elektronik",
          "Mampu melakukan pengembangan metode dan teknis yang terkini dengan mengikuti perkembangan tren teknologi dan pasar terkait sistem dan prosedur korespondensi perusahaan baik manual dan elektronik",
        ],
      },
      {
        definition:
          "Pengetahuan dan keterampilan tentang tata cara pengelolaan arsip/record management dalam bentuk apapun sejak diciptakan, dikelola sampai dengan penyimpanan, pemanfaatan dan masa retensi untuk melakukan pemusnahan.",
        level1: [
          "Memahami prinsip-prinsip dasar dan metode pengelolaan arsip/record management, penggolongan arsip/record management, masa retensi retensi arsip perusahaan, dan prosedur pengamanan arsip perusahaan",
          "Mampu melakukan kegiatan administratif, meliputi pengarsipan, pemanfaatan, dan lainnya dengan pengawasan ketat",
        ],
        level2: [
          "Mampu mengelola arsip/record perusahaan berdasarkan jenis, klasifikasi dan retensinya",
          "Mampu melakukan pemusnahan arsip perusahaan sesuai masa retensi arsip perusahaan",
        ],
        level3: [
          "Mampu melakukan evaluasi dan membuat rekomendasi terhadap pengelolaan arsip/record management dan masa retensi arsip perusahaan",
          "Mampu melakukan assessment untuk memastikan implementasi pengelolaan arsip perusahaan sesuai standar yang ditetapkan",
        ],
        level4: [
          "Mampu bertindak sebagai trusted advisor terkait pengelolaan arsip/record management dan masa retensi arsip perusahaan",
          "Mampu melakukan pengembangan metode dan teknis yang terkini dengan mengikuti perkembangan tren teknologi dan pasar terkait pengelolaan arsip/record dan masa retensi arsip perusahaan",
        ],
      },
    ],
    jobList: [
      {
        id: 1,
        job_name: "Corporate Secretary",
        job_level: 1,
      },
      {
        id: 2,
        job_name: "Manager Corporate Communication",
        job_level: 2,
      },
      {
        id: 3,
        job_name: "Sr Officer I Internal Communication",
        job_level: 3,
      },
      {
        id: 4,
        job_name: "Officer I Internal Communication",
        job_level: 4,
      },
      {
        id: 5,
        job_name: "Jr Officer II Internal Communication",
        job_level: 5,
      },
      {
        id: 6,
        job_name: "Sr Officer III Media & External Comm.",
        job_level: 6,
      },
      {
        id: 7,
        job_name: "Officer II Media & External Communication",
        job_level: 7,
      },
      {
        id: 8,
        job_name: "Jr Officer II Media & External Comm.",
        job_level: 8,
      },
      {
        id: 9,
        job_name: "Manager CSR & SMEPP Management",
        job_level: 9,
      },
      {
        id: 10,
        job_name: "Sr Officer I CSR & SMEPP Management",
        job_level: 10,
      },
      {
        id: 11,
        job_name: "Jr Officer II CSR & SMEPP Management",
        job_level: 11,
      },
      {
        id: 12,
        job_name: "Jr Officer II CSR & SMEPP Management",
        job_level: 12,
      },
    ],
    competencyList: [
      {
        id: 1,
        competency_name: "HSSE General",
        category: "mandatory",
      },
      {
        id: 2,
        competency_name: "HC Integrated",
        category: "mandatory",
      },
      {
        id: 3,
        competency_name: "Strategic & Business Management",
        category: "mandatory",
      },
      {
        id: 4,
        competency_name: "Risk Fundamental",
        category: "mandatory",
      },
      {
        id: 5,
        competency_name: "Digital & Analytic Insight",
        category: "mandatory",
      },
      {
        id: 6,
        competency_name: "Message Management",
        category: "general",
      },
      {
        id: 7,
        competency_name: "Stakeholder Management",
        category: "general",
      },
      {
        id: 8,
        competency_name: "Public Communication",
        category: "general",
      },
      {
        id: 9,
        competency_name: "Brand Communication",
        category: "specific",
      },
      {
        id: 10,
        competency_name: "Crisis Communication",
        category: "specific",
      },
      {
        id: 11,
        competency_name: "Media Relation Management",
        category: "specific",
      },
      {
        id: 12,
        competency_name: "Compliance Regulatory",
        category: "specific",
      },
      {
        id: 13,
        competency_name: "Brand Equity Management",
        category: "specific",
      },
      {
        id: 14,
        competency_name: "Community Involvement and Development Program Planning & Design",
        category: "specific",
      },
      {
        id: 15,
        competency_name: "Business Knowledge",
        category: "specific",
      },
      {
        id: 16,
        competency_name: "Event Management",
        category: "specific",
      },
      {
        id: 17,
        competency_name: "Stakeholder Mapping",
        category: "specific",
      },
      {
        id: 18,
        competency_name: "Community Involvement and Development Project Management",
        category: "specific",
      },
      {
        id: 19,
        competency_name: "Stakeholder Mapping",
        category: "specific",
      },
      {
        id: 20,
        competency_name: "Budgeting",
        category: "specific",
      },
    ],
    competencyMapping: [
      // Job 1
      { jobId: 1, compeId: 1, level: 3 },
      { jobId: 1, compeId: 2, level: 3 },
      { jobId: 1, compeId: 3, level: 3 },
      { jobId: 1, compeId: 4, level: 3 },
      { jobId: 1, compeId: 5, level: 3 },
      { jobId: 1, compeId: 6, level: 3 },
      { jobId: 1, compeId: 7, level: 3 },
      { jobId: 1, compeId: 8, level: 3 },
      { jobId: 1, compeId: 9, level: 2 },
      { jobId: 1, compeId: 10, level: 3 },
      { jobId: 1, compeId: 11, level: 3 },
      { jobId: 1, compeId: 12, level: 2 },
      { jobId: 1, compeId: 13, level: 3 },
      { jobId: 1, compeId: 14, level: 3 },
      { jobId: 1, compeId: 15, level: 2 },

      // Job 2
      { jobId: 2, compeId: 1, level: 2 },
      { jobId: 2, compeId: 2, level: 2 },
      { jobId: 2, compeId: 3, level: 2 },
      { jobId: 2, compeId: 4, level: 2 },
      { jobId: 2, compeId: 5, level: 2 },
      { jobId: 2, compeId: 6, level: 3 },
      { jobId: 2, compeId: 7, level: 3 },
      { jobId: 2, compeId: 8, level: 3 },
      { jobId: 2, compeId: 9, level: 3 },
      { jobId: 2, compeId: 10, level: 3 },
      { jobId: 2, compeId: 11, level: 3 },
      { jobId: 2, compeId: 13, level: 2 },
      { jobId: 2, compeId: 16, level: 3 },
      { jobId: 2, compeId: 17, level: 3 },

      // Job 3
      { jobId: 3, compeId: 1, level: 2 },
      { jobId: 3, compeId: 4, level: 2 },
      { jobId: 3, compeId: 6, level: 3 },
      { jobId: 3, compeId: 7, level: 3 },
      { jobId: 3, compeId: 8, level: 3 },
      { jobId: 3, compeId: 9, level: 2 },
      { jobId: 3, compeId: 10, level: 3 },
      { jobId: 3, compeId: 16, level: 3 },
      { jobId: 3, compeId: 17, level: 2 },

      // Job 4
      { jobId: 4, compeId: 1, level: 1 },
      { jobId: 4, compeId: 4, level: 1 },
      { jobId: 4, compeId: 6, level: 2 },
      { jobId: 4, compeId: 7, level: 2 },
      { jobId: 4, compeId: 8, level: 3 },
      { jobId: 4, compeId: 9, level: 2 },
      { jobId: 4, compeId: 10, level: 2 },
      { jobId: 4, compeId: 16, level: 3 },
      { jobId: 4, compeId: 17, level: 2 },

      // Job 5
      { jobId: 5, compeId: 1, level: 1 },
      { jobId: 5, compeId: 4, level: 1 },
      { jobId: 5, compeId: 6, level: 2 },
      { jobId: 5, compeId: 7, level: 2 },
      { jobId: 5, compeId: 8, level: 2 },
      { jobId: 5, compeId: 9, level: 1 },
      { jobId: 5, compeId: 10, level: 1 },
      { jobId: 5, compeId: 16, level: 2 },
      { jobId: 5, compeId: 17, level: 1 },

      // Job 6
      { jobId: 6, compeId: 1, level: 2 },
      { jobId: 6, compeId: 4, level: 2 },
      { jobId: 6, compeId: 6, level: 3 },
      { jobId: 6, compeId: 7, level: 3 },
      { jobId: 6, compeId: 8, level: 3 },
      { jobId: 6, compeId: 9, level: 2 },
      { jobId: 6, compeId: 10, level: 3 },
      { jobId: 6, compeId: 11, level: 3 },
      { jobId: 6, compeId: 13, level: 2 },
      { jobId: 6, compeId: 16, level: 3 },
      { jobId: 6, compeId: 17, level: 2 },

      // Job 7
      { jobId: 7, compeId: 1, level: 1 },
      { jobId: 7, compeId: 4, level: 1 },
      { jobId: 7, compeId: 6, level: 2 },
      { jobId: 7, compeId: 7, level: 2 },
      { jobId: 7, compeId: 8, level: 2 },
      { jobId: 7, compeId: 9, level: 2 },
      { jobId: 7, compeId: 10, level: 2 },
      { jobId: 7, compeId: 11, level: 2 },
      { jobId: 7, compeId: 13, level: 2 },
      { jobId: 7, compeId: 16, level: 3 },
      { jobId: 7, compeId: 17, level: 2 },

      // Job 8
      { jobId: 8, compeId: 1, level: 1 },
      { jobId: 8, compeId: 4, level: 1 },
      { jobId: 8, compeId: 6, level: 2 },
      { jobId: 8, compeId: 7, level: 1 },
      { jobId: 8, compeId: 8, level: 2 },
      { jobId: 8, compeId: 9, level: 1 },
      { jobId: 8, compeId: 10, level: 1 },
      { jobId: 8, compeId: 11, level: 2 },
      { jobId: 8, compeId: 13, level: 1 },
      { jobId: 8, compeId: 16, level: 2 },
      { jobId: 8, compeId: 17, level: 1 },

      // Job 9
      { jobId: 9, compeId: 1, level: 2 },
      { jobId: 9, compeId: 2, level: 2 },
      { jobId: 9, compeId: 3, level: 2 },
      { jobId: 9, compeId: 4, level: 2 },
      { jobId: 9, compeId: 5, level: 2 },
      { jobId: 9, compeId: 6, level: 3 },
      { jobId: 9, compeId: 7, level: 3 },
      { jobId: 9, compeId: 8, level: 3 },
      { jobId: 9, compeId: 9, level: 3 },
      { jobId: 9, compeId: 14, level: 3 },
      { jobId: 9, compeId: 16, level: 3 },
      { jobId: 9, compeId: 17, level: 1 },
      { jobId: 9, compeId: 18, level: 3 },
      { jobId: 9, compeId: 19, level: 3 },

      // Job 10
      { jobId: 10, compeId: 1, level: 2 },
      { jobId: 10, compeId: 4, level: 2 },
      { jobId: 10, compeId: 6, level: 3 },
      { jobId: 10, compeId: 7, level: 3 },
      { jobId: 10, compeId: 8, level: 3 },
      { jobId: 10, compeId: 9, level: 2 },
      { jobId: 10, compeId: 14, level: 3 },
      { jobId: 10, compeId: 16, level: 2 },
      { jobId: 10, compeId: 18, level: 3 },
      { jobId: 10, compeId: 19, level: 3 },
      { jobId: 10, compeId: 20, level: 2 },

      // Job 11
      { jobId: 11, compeId: 1, level: 1 },
      { jobId: 11, compeId: 4, level: 1 },
      { jobId: 11, compeId: 6, level: 2 },
      { jobId: 11, compeId: 7, level: 2 },
      { jobId: 11, compeId: 8, level: 2 },
      { jobId: 11, compeId: 9, level: 2 },
      { jobId: 11, compeId: 14, level: 2 },
      { jobId: 11, compeId: 16, level: 2 },
      { jobId: 11, compeId: 18, level: 3 },
      { jobId: 11, compeId: 19, level: 2 },
      { jobId: 11, compeId: 20, level: 2 },

      // Job 12
      { jobId: 12, compeId: 1, level: 1 },
      { jobId: 12, compeId: 4, level: 1 },
      { jobId: 12, compeId: 6, level: 1 },
      { jobId: 12, compeId: 7, level: 1 },
      { jobId: 12, compeId: 8, level: 2 },
      { jobId: 12, compeId: 9, level: 1 },
      { jobId: 12, compeId: 14, level: 1 },
      { jobId: 12, compeId: 16, level: 2 },
      { jobId: 12, compeId: 18, level: 2 },
      { jobId: 12, compeId: 19, level: 2 },
      { jobId: 12, compeId: 20, level: 1 },
    ],
  },
  {
    set(target, property, value) {
      if (target[property] !== value) {
        // Set the new value
        target[property] = value;
        if (property === "dataDetailDraft") {
          detailDraft();
        }
      }
      return true;
    },
  },
);
function setState(key, value) {
  appState[key] = value;
}

function getState(key) {
  return appState[key];
}
window.setState = setState;
window.getState = getState;

async function fetchDataCompetency(params) {
  const url = `${url_api}/api/TechnicalCompetency`;
  try {
    const result = await ajaxRequest(url, "GET", params);
    return result;
  } catch (error) {
    console.error("Error fetching data from API");
    $("#resultJabatan").html("Error fetching data from API");
    throw error;
  }
}
async function fetchData() {
  try {
    const [dataCompetency] = await Promise.all([fetchDataCompetency()]);
    console.log(dataCompetency);
    document.dispatchEvent(new Event("dataLoaded"));
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

// Initial data fetch
fetchData();
