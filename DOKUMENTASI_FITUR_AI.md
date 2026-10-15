# Dokumentasi Lengkap Fitur Artificial Intelligence (AI) - PERTAMINA CnT

Dokumen ini berisi penjelasan komprehensif mengenai seluruh penambahan dan pengubahan fitur berbasis Artificial Intelligence (AI) yang telah diimplementasikan pada sistem PERTAMINA CnT (Process Business & RASCI Matrix Management System).

---

## 📌 Daftar Fitur AI yang Diimplementasikan

1. [Pencarian & Filtering AI Proses Bisnis (Ask Fiona / AI Chatbot Assistant)](#1-pencarian--filtering-ai-proses-bisnis-ask-fiona) `[LLM AI + Internal Fallback]`
2. [Audit Kualitas Matriks RASCI (Audit Quality RASCI AI)](#2-audit-kualitas-matriks-rasci-audit-quality-rasci-ai) `[LLM AI + Internal Fallback]`
3. [Smart Compare / Analisis Perbandingan Jabatan (Position Compare AI)](#3-smart-compare--analisis-perbandingan-jabatan-position-compare-ai) `[LLM AI + Internal Fallback]`
4. [Generate Job Description AI (Pembuatan Deskripsi Jabatan Otomatis)](#4-generate-job-description-ai-pembuatan-deskripsi-jabatan-otomatis) `[LLM AI + Internal Fallback]`
5. [Standarisasi Aset Visual & UI Design (SVG Assets Integration)](#5-standarisasi-aset-visual--ui-design-svg-assets-integration)

---

## 1. Pencarian & Filtering AI Proses Bisnis (Ask Fiona)

### Deskripsi Fitur
**Ask Fiona** adalah asisten cerdas berbasis RAG (Retrieval-Augmented Generation) & Natural Language Processing (NLP) yang memungkinkan pengguna untuk melakukan penelusuran, pencarian, dan penyaringan Proses Bisnis menggunakan pertanyaan atau perintah dalam bahasa alami (Indonesian/English).

### Kemampuan Utama
- Memahami maksud dan konteks kueri pengguna secara fleksibel (contoh: *"Tampilkan proses bisnis yang berhubungan dengan manajemen risiko HSE"*).
- Memfilter kandidat hirarki proses bisnis (Level 1 s/d Level 6) secara otomatis dan presisi.
- Memberikan penjelasan (*reasoning*) mengapa suatu proses bisnis relevan dengan kueri pengguna.

### Arsitektur Backend (`be-cnt`)
- **Service**: `be_cnt.Services.AiService`
- **Method**: `FilterBusinessProcessesAsync(string userPrompt, List<BusinessProcessAiCandidateDto> candidates, CancellationToken cancellationToken)`
- **DTOs**:
  - `BusinessProcessAiCandidateDto`: Mengirim informasi `IndexNumber`, `Level`, `Description`, `Definisi`, `Input`, `Output`, dan `MappedPositions`.
  - `AiFilterResult`: Mengembalikan list `IndexNumber` hasil filter beserta `Reason`.

---

## 2. Audit Kualitas Matriks RASCI (Audit Quality RASCI AI)

### Deskripsi Fitur
**Audit Quality RASCI AI** adalah engine analitik otomatis yang memeriksa kesehatan dan kepatuhan tata kelola penotasian RASCI pada suatu Draft Matriks RASCI. Engine ini mendeteksi anomali struktur tata kelola dan memberikan saran perbaikan berdasarkan standar *Good Corporate Governance* (GCG).

### Deteksi Anomali yang Diidentifikasi
| Kode Anomali | Nama Anomali | Deskripsi & Dampak | Level Severity |
| :--- | :--- | :--- | :--- |
| `NO_A` | Tanpa Accountable | Proses bisnis tidak memiliki penanggung jawab keputusan utama (Single Point of Governance Failure). | **HIGH** |
| `MULTIPLE_A` | Accountable Ganda | Terdapat lebih dari 1 posisi yang memegang notasi 'A' (Ambigu ownership/kepemilikan keputusan). | **HIGH** |
| `NO_R` | Tanpa Responsible | Tidak ada posisi yang bertindak sebagai pelaksana tugas notasi 'R'. | **MEDIUM** |
| `OVERLOADED_POSITION` | Beban Kerja Jabatan Berlebih | Suatu Jabatan memegang jumlah notasi 'A' dan 'R' di luar batas wajar (risiko burnout/bottleneck). | **MEDIUM** |
| `UNMAPPED_PROSBIS` | Proses Bisnis Belum Dipetakan | Proses bisnis aktif belum memiliki penotasian RASCI sama sekali. | **LOW** |

### Komponen UI Frontend (`fe-cnt`)
- **Modal View**: `Cuba/Views/Shared/ModalAuditQuality.cshtml`
- **Tampilan**:
  - **Quality Score Gauge**: Indikator persentase skor kualitas matriks.
  - **Executive Summary Card**: Ringkasan analisis kualitas dalam bahasa alami.
  - **Issue Counters**: Badge per kategori indikator (Danger/High vs Warning/Medium).
  - **Tabbed Detailed Anomaly**: List anomali beserta deskripsi, nomor indeks proses bisnis, dan rekomendasi perbaikan berbasis AI.
  - **Filtering**: Dropdown filter kategori anomali (`All`, `No A`, `Multiple A`, `No R`, `Overloaded Position`, `Unmapped`).

### Arsitektur Backend (`be-cnt`)
- **Service**: `be_cnt.Services.AiService`
- **Method**: `AuditRasciQualityAsync(string draftRasciId, List<RasciNotationAuditRawDto> auditData, CancellationToken cancellationToken)`
- **DTO**: `RasciAuditQualityResultDto` & `RasciAnomalyItemDto`.

---

## 3. Smart Compare / Analisis Perbandingan Jabatan (Position Compare AI)

### Deskripsi Fitur
**Smart Compare AI** memberikan kemampuan untuk membandingkan 2 atau lebih Jabatan dalam Matriks RASCI secara instan. AI menganalisis pembagian tugas, tumpang tindih (*overlap*), serta keseimbangan beban kerja antar jabatan.

### Metrik & Hasil Analisis
1. **Matrix Notation Metrics**: Perbandingan jumlah Notasi `Accountable (A)`, `Responsible (R)`, `Support (S)`, `Consulted (C)`, dan `Informed (I)` untuk tiap jabatan yang dibandingkan.
2. **Shared Processes Analysis**: Identifikasi proses bisnis yang dikerjakan atau diakses bersama oleh jabatan-jabatan tersebut (`SharedProcessesCount`).
3. **Workload Balance Analysis**: Analisis rasio distribusi beban kerja dan potensi ketimpangan tanggung jawab.
4. **AI Recommendation**: Rekomendasi restrukturisasi penotasian atau pembagian tugas yang lebih optimal.

### Komponen UI Frontend (`fe-cnt`)
- **Modal View**: `Cuba/Views/Shared/ModalSmartCompareResult.cshtml`
- **Fitur UI**:
  - **Comparison Overview Card**: Menampilkan statistik jabatan & total proses yang diiris.
  - **Metrics Distribution Table**: Visualisasi tabel perbandingan notasi RASCI.
  - **Detail Tabs**: *Discrepancies*, *Single Responsibility*, *Overlapping Tasks*, dan *Missing R/A*.
  - **Search & Filter Filter**: Pencarian kata kunci posisi / proses bisnis pada hasil komparasi.

### Arsitektur Backend (`be-cnt`)
- **Service**: `be_cnt.Services.AiService`
- **Method**: `ComparePositionsAiAsync(PositionCompareAiRequestDto request, List<RasciNotationAuditRawDto> auditData, CancellationToken cancellationToken)`
- **DTO**: `PositionCompareAiResultDto` & `PositionMetricsCompareDto`.

---

## 4. Generate Job Description AI (Pembuatan Deskripsi Jabatan Otomatis)

### Deskripsi Fitur
Fitur **Generate Jobdesc AI** menyusun dokumen Deskripsi Jabatan (*Job Description*) secara otomatis berdasarkan pemetaan notasi RASCI yang sah dari suatu Jabatan yang dipilih pengguna.

### Komponen Deskripsi Jabatan yang Dihasilkan
1. **Job Objective (Tujuan Jabatan Utama)**: Ringkasan naratif alasan keberadaan jabatan tersebut dalam organisasi.
2. **Key Responsibilities (Tugas Pelaksana Utama)**: Daftar aktivitas operasional yang bersumber hanya dari notasi **Responsible ('R')**.
4. **Technical Competencies (Kompetensi Teknis)**: Daftar keahlian teknis yang dibutuhkan untuk menjalankan tugas tersebut.
5. **Behavioural Competencies (Kompetensi Perilaku)**: Soft skills dan kompetensi perilaku yang relevan.

### Autocomplete Search Jabatan
Pada modal *Generate Jobdesc AI*, input pencarian Jabatan terintegrasi dengan endpoint Autocomplete dinamis:
- **Endpoint**: `GET /api/rasci-matrix/searchBy`
- **Query Parameters**:
  - `Type`: `job`
  - `Search`: `<keyword_jabatan>` (contoh: `manager`, `analyst`, dll.)
  - `DraftSoId`: `<draft_so_id>`
  - `DraftRasciId`: `<draft_rasci_id>`
- **Fitur JS**: Memiliki mekanisme *Debounce (300ms)* untuk meminimalkan beban request server dan mempercepat respon antarmuka.

### Komponen UI Frontend (`fe-cnt`)
- **Modal View**: `Cuba/Views/Shared/ModalGenerateJobdesc.cshtml`
- **Script Handling**: `Cuba/wwwroot/assets/js/rasci-matrix/index.js` (`searchGenJobdescPositions` & `selectGenJobdescPosition`).
- **Aksi UI**: Preview hasil Jobdesc, *Copy to Clipboard*, dan *Export Document*.

---

## 5. Standarisasi Aset Visual & UI Design (SVG Assets Integration)

Untuk memastikan konsistensi visual dan performa aplikasi, seluruh icon font legacy (`icofont`) pada halaman dan modal AI telah diganti menggunakan aset gambar SVG lokal berkualitas tinggi dari direktori:

📍 **Lokasi Asset**: `Cuba/wwwroot/assets/images/rasci/`

### Pemetaan Aset SVG yang Digunakan
| File SVG | Digunakan Pada Komponen / Modal | Fungsi Visual |
| :--- | :--- | :--- |
| `warning-circle.svg` | Menu Dropdown RASCI Index, Modal Audit Quality | Indikator Opsi Audit Quality / Anomali Warning |
| `danger-circle.svg` | Modal Audit Quality | Indikator Anomali Kritis (High Severity / Danger) |
| `warning_icon.svg` | Modal Audit Quality, Smart Compare | Icon Header Peringatan / Insight |
| `document.svg` | Menu Dropdown RASCI Index, Modal Generate Jobdesc | Icon Opsi Generate Jobdesc & Preview Dokumen |
| `clipboard.svg` | Modal Audit Quality, Modal Generate Jobdesc | Icon Notasi 'A' & Menyalin Jobdesc ke Clipboard |
| `chart.svg` | Modal Audit Quality, Modal Smart Compare | Icon Stat Summary & Metrik Grafis |
| `icon_compare.svg` | Modal Smart Compare Result | Icon Header Perbandingan Jabatan |
| `vector.svg` | Modal Audit Quality, Modal Smart Compare | Icon Arrow Navigation & Filter |
| `icon_filter.svg` | Modal Audit Quality, Smart Compare, Generate Jobdesc | Icon Input Pencarian & Dropdown Filter |
| `incon_success.svg` | Modal Smart Compare Result | Indikator Status Sukses / Berhasil |
| `a.svg` | Modal Generate Jobdesc | Badge Notasi Accountable ('A') |
| `r.svg` | Modal Generate Jobdesc | Badge Notasi Responsible ('R') |

---

## 🛠️ Ringkasan File Terkait

### Backend (`be-cnt`)
- `be-cnt/Interface/Service/IAiService.cs`: Contract Interface & Data Transfer Objects (DTOs).
- `be-cnt/Services/AiService.cs`: Implementasi Logika Integrasi AI Model & Analytics Engine.
- `be-cnt/Controllers/RasciMatrixController.cs`: Controller Endpoint untuk Autocomplete Search & AI Features.

### Frontend (`fe-cnt`)
- `Cuba/Views/Rasci/Index.cshtml`: Halaman utama RASCI Matrix dengan integrasi menu AI.
- `Cuba/Views/Shared/ModalAuditQuality.cshtml`: Modal tampilan Audit Kualitas RASCI AI.
- `Cuba/Views/Shared/ModalSmartCompareResult.cshtml`: Modal tampilan Perbandingan Jabatan AI.
- `Cuba/Views/Shared/ModalGenerateJobdesc.cshtml`: Modal tampilan Pembuatan Deskripsi Jabatan AI.
- `Cuba/wwwroot/assets/js/rasci-matrix/index.js`: Event handler, API fetcher, & autocomplete search logic.
- `Cuba/wwwroot/assets/images/rasci/`: Direktori Aset Gambar SVG & PNG Lokal.

---
*Dokumentasi ini dibuat secara otomatis untuk merekam pembaruan dan implementasi fitur AI pada proyek PERTAMINA CnT.*
