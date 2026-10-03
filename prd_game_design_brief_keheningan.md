# Product Requirements Document (PRD) & Game Design Brief
## Proyek: "Keheningan" — A Contemplative Zen Exploration Web Game

---

### 1. Executive Summary & Vision Statement
**Keheningan** adalah game eksplorasi web responsif berbasis *mobile-first* yang mengedepankan pengalaman kontemplatif, ketenangan batin, dan keindahan estetika Zen Jepang (*Wabi-sabi* 侘寂, *Ma* 間, dan *Ensō* 円相).

Game ini dirancang bukan sebagai produk yang menuntut kompetisi atau pencapaian angka (*zero combat, zero XP, zero coins, no HUD*), melainkan sebagai **lukisan interaktif yang hidup** di mana pemain diajak untuk melambat (*slow down*), menjelajahi desa berkabut, berbincang dengan penduduk bersahaja, bertemu Guru Zen Nan In, dan meresapi momen refleksi hening.

---

### 2. Core Pillars & Philosophy
1. **Keheningan & Presensi (Silence & Presence):** Antarmuka (UI) nyaris tak kasat mata (*near-invisible UI*). Tidak ada bilah status darah (HP), level, timer tergesa-gesa, atau penanda misi (*quest markers*).
2. **Offline-First & Frictionless:** Game dapat dijalankan sepenuhnya tanpa koneksi internet setelah pemuatan pertama (*PWA / offline-ready*), tanpa registrasi akun, tanpa popup *"Game Saved"*.
3. **Penyimpanan Lokal Senyap (Quiet Local Save):** Setiap jejak langkah, dialog, dan status perenungan tersimpan otomatis di perangkat pemain (*localStorage / IndexedDB*).
4. **Dwibahasa Instan (Bilingual ID | EN):** Dukungan penuh bahasa Indonesia dan Inggris yang dapat diubah seketika di layar mana pun tanpa me-reload aplikasi.
5. **Estetika Washi & Sumi-e:** Terinspirasi dari lukisan tinta arang sumi-e dan sapuan cat air lembut di atas tekstur kertas washi bersuhu hangat.

---

### 3. Target Audience & Form Factors
* **Persona Pemain:** Pecinta game indie naratif/kontemplatif (seperti *A Short Hike*, *Journey*, *Townscaper*), praktisi *mindfulness*, atau siapa saja yang mencari jeda ketenangan di sela hiruk-pikuk harian.
* **Platform:** Web responsif, diutamakan untuk perangkat genggam (*Mobile Portrait 390 × 844*), dengan skalabilitas proporsional ke Tablet dan Desktop tanpa merusak keintiman komposisi pemandangan.

---

### 4. MVP Scope & Anti-Scope

| Termasuk dalam MVP (Scope) | Di Luar Batasan MVP (Strict Anti-Scope) |
| :--- | :--- |
| • Layar Pembuka / Title Screen (Mulai, Lanjutkan, Mulai Baru) | ✕ Sistem Login, Sign-up, atau Profil Pengguna |
| • Eksplorasi Desa (*Tap-to-move* & interaksi kontekstual) | ✕ Kompatibilitas Multiplayer / Leaderboard sosial |
| • Interaksi Dialog Penduduk Desa (Pak Tua Penjaga Air) | ✕ Pertarungan (*Combat*), Musuh, HP/Mana bar |
| • Pertemuan Guru Zen Nan In & Dialog Teh Kosong | ✕ Inventaris tas (*Inventory*), Crafting, atau Toko |
| • Layar Refleksi Penuh (Animasi Ensō & Catatan Musafir) | ✕ Mata uang game (Gold, Gems, Coins), XP, Level |
| • Sistem *Local-first Auto-Save* & reset lokal | ✕ Quest Log, Minimap yang berisik, atau Achievement Badges |
| • Toggle Bahasa Real-time (ID / EN) | ✕ Pop-up iklan, notifikasi agresif, mikrotransaksi |

---

### 5. Detailed Screen Specifications (The 5 Core MVP Flows)

#### Layar 1: Home / Title Screen
* **Tujuan:** Menghadirkan ketenangan instan begitu aplikasi dibuka.
* **Elemen UI:**
  * Simbol kaligrafi **Ensō (円相)** di pusat layar dengan denyut napas halus.
  * Tipografi judul besar serambi: **KEHENINGAN**.
  * Sub-judul puitis: *"sebuah perjalanan kecil dalam diam"* / *"a quiet journey in silence"*.
  * Opsi navigasi dinamis:
    * `LANJUTKAN` (jika terdapat save data tersimpan, menampilkan waktu/lokasi terakhir).
    * `MULAI` (memulai perjalanan).
    * `MULAI DARI AWAL` (opsi sekunder dengan konfirmasi hening untuk mereset save data lokal).
  * Pengalih bahasa ringkas `ID | EN` di bagian atas.
  * Indikator status hening: *"Tersimpan lokal di perangkat • Mainkan kapan saja tanpa internet"*.

#### Layar 2: Village Exploration (Desa Lembah Embun)
* **Tujuan:** Area eksplorasi visual desa pegunungan yang asri dan tenang.
* **Interaksi & Navigasi:**
  * Kontrol *Tap-to-move* pada tanah setapak dan batu kali.
  * Penanda kontekstual minimal saat mendekati objek penting: `Duduk`, `Bicara`, `Lihat`.
  * Tombol pintas elegan: `Menghampiri Guru Nan In` di serambi bambu.
* **Visual:** Rumah kayu tradisional, pohon dedalu yang meliuk lembut, gemericik sungai jernih, dan kepulan asap teh tipis di kejauhan.

#### Layar 3: Villager Interaction (Pak Tua Penjaga Air)
* **Tujuan:** Dialog bersahaja yang menggambarkan kebijaksanaan hidup sehari-hari.
* **Elemen Antarmuka:**
  * Latar belakang lanskap desa tetap transparan terlihat di balik dialog.
  * Kartu dialog washi paper elegan dengan kutipan Pak Tua:
    * *"Hari ini sungai mengalir lebih tenang."* (*"The river flows quieter today."*)
  * Pilihan tindakan pemain:
    1. `Duduk Bersama` (menikmati suasana hening sejenak).
    2. `Bicara Seputar Arus` (mendengarkan nasihat tentang air).
    3. `Pamit Lanjut Melangkah` (kembali ke penjelajahan desa).

#### Layar 4: Nan In Zen Dialogue (Kuil Kabut Gunung Engaku-ji)
* **Tujuan:** Klimaks filosofis yang terinspirasi dari kisah Zen klasik "Secangkir Teh Penuh".
* **Karakter:** Guru Nan In duduk bersila di selasar *engawa*, menuangkan teh hijau pekat ke mangkuk keramik.
* **Pilihan Dialog Reflektif:**
  * Pertanyaan Guru: *"Apa yang kau cari?"* (*"What do you seek?"*)
  * Opsi respons batin pemain:
    1. *"Aku tidak tahu."* (Kekosongan awal; cangkir yang siap menerima).
    2. *"Kedamaian."* (Mencari telaga jernih di tengah deru dunia).
    3. *"Aku hanya berjalan."* (Tanpa tujuan kaku, menyatu bersama angin bambu).
  * Aksi ritual: `Tuang Teh Bersama` yang memicu pemahaman Zen.

#### Layar 5: Reflection Moment (Air & Ensō)
* **Tujuan:** Ruang hening sejenak untuk mengendapkan dialog sebelum melanjutkan perjalanan.
* **Elemen Visual:**
  * Lingkaran Ensō berputar perlahan mengikuti ritme tarikan dan hembusan napas.
  * Aforisme reflektif:
    > *"Air tidak pernah terburu-buru. Namun setiap batu pada akhirnya dipeluk dengan kelembutan yang tak terbantahkan."*
  * Navigasi lembut: *"Sentuh di mana saja untuk melangkah"* tanpa tombol kotak yang kaku.

---

### 6. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   Client Browser / PWA                 │
├────────────────────────────────────────────────────────┤
│  [UI Layer]: Semantic HTML5 + TailwindCSS + Noto Serif │
│  [Interactions]: Vanilla JS (Event Listeners & State)  │
│  [Audio Engine]: Web Audio API (Ambience Wind & Water) │
├────────────────────────────────────────────────────────┤
│                 Offline Persistence Layer              │
│       ┌────────────────────────────────────────┐       │
│       │  window.localStorage / IndexedDB       │       │
│       │  - player_location: string             │       │
│       │  - timestamp: ISOString                │       │
│       │  - dialogue_progress: object           │       │
│       │  - language_pref: "ID" | "EN"          │       │
│       │  - tea_ceremony_completed: boolean     │       │
│       └────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────┘
```

* **Zero Backend Dependency:** Tidak memerlukan API server eksternal saat dimainkan.
* **Performa Ringan:** Pemuatan aset gambar terkompresi dengan format WebP / SVG vektor presisi tinggi agar muat dengan cepat pada koneksi lambat sekalipun.

---

### 7. Design System & Visual Tokens

* **Palet Warna:**
  * Background Kanvas: `#FCF9F0` (Washi White / Krem Beras Tenang)
  * Kontainer Permukaan: `#F6F3EA` & `#F0EAE1` (Kertas Alami)
  * Teks & Tinta Primer: `#242321` (Charcoal Sumi Ink)
  * Aksen Alami: `#4A5548` (Sage Moss Green) & `#8C7A6B` (Kayu Bambu Kering)
* **Tipografi:**
  * *Display & Reflective Headers:* Noto Serif / Merriweather (berwibawa, anggun, kontemplatif).
  * *UI & Body Labels:* Inter / DM Sans (bersih, terbaca jelas dengan tracking luas).
* **Bentuk & Sudut:** Radius halus (`rounded-lg` / `rounded-xl`) mencerminkan batu kali yang terkikis halus oleh aliran air.

---

### 8. Success Metrics & Definition of Done
1. **Atmosferik:** Pemain merasakan ketenangan batin dalam 15 detik pertama setelah membuka layar judul.
2. **Kemandirian Perangkat:** 100% fungsional saat mode pesawat diaktifkan setelah pemuatan awal.
3. **Kesesuaian Filosofi:** Tidak ada kebocoran elemen game RPG tradisional (tidak ada skor, level up, quest marker berkedip, atau popup kemenangan).
4. **Aksesibilitas Responsif:** Nyaman digunakan dengan satu tangan pada layar ponsel 390px, dan tetap menawan saat dibuka di monitor lebar desktop.
