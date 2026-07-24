# Frontend_KP

Frontend_KP adalah aplikasi frontend untuk platform kesehatan digital **Probit**. Dokumentasi ini ditulis supaya mudah dipahami oleh dua kelompok:

1. **Pengguna** yang ingin tahu cara memakai aplikasi.
2. **Developer** yang ingin menjalankan, memahami, atau mengembangkan kode frontend.

## Gambaran Singkat

Project ini dibangun dengan **React** dan **Vite**. Navigasi antar halaman diatur memakai **React Router**, sedangkan komunikasi ke backend memakai **Axios**. Aplikasi dibagi menjadi dua area utama:

1. **Area publik** terdiri dari landing page, login, registrasi, dan halaman informasi umum.
2. **Area login** untuk pengguna dan admin, masing-masing dengan layout dan menu yang berbeda.

## Fitur Utama

### Untuk Pengguna

- Melihat halaman utama dan informasi produk.
- Login, registrasi, lupa password, dan reset password.
- Mengisi dan mengelola profil kesehatan.
- Membuat rencana kesehatan melalui halaman generate plan.
- Membaca artikel kesehatan.
- Melihat detail artikel dan resep.
- Menyimpan artikel atau resep ke favorit.
- Melihat riwayat aktivitas.

### Untuk Admin

- Melihat dashboard admin.
- Mengelola data pengguna.
- Mengelola blog atau artikel.
- Mengelola laporan.
- Mengelola resep.
- Mengubah profil admin.
- Melihat activity logs.

## Teknologi yang Dipakai

- **React 19**
- **Vite**
- **React Router DOM**
- **Axios**
- **Tailwind CSS 4**
- **Lucide React**
- **jsPDF** dan **jsPDF-AutoTable**
- **@react-oauth/google**

## Cara Menjalankan Project

### 1. Install dependency

```bash
npm install
```

### 2. Jalankan mode development

```bash
npm run dev
```

### 3. Build untuk production

```bash
npm run build
```

### 4. Preview hasil build

```bash
npm run preview
```

### 5. Jalankan linting

```bash
npm run lint
```

## Cara Pakai untuk Pengguna Biasa

1. Buka halaman utama aplikasi.
2. Daftar akun baru atau login jika sudah punya akun.
3. Lengkapi profil kesehatan.
4. Gunakan dashboard untuk membaca artikel, melihat resep, dan membuat rencana kesehatan.
5. Simpan konten penting ke favorit dan cek riwayat aktivitas kapan saja.

## Cara Pakai untuk Admin

1. Login dengan akun admin.
2. Masuk ke route `/admin`.
3. Gunakan sidebar admin untuk mengelola pengguna, blog, laporan, resep, profil, dan activity logs.

## Struktur Folder Singkat

```text
src/
├── components/   # Komponen reusable seperti header, sidebar, toast
├── layouts/      # Layout user dan admin
├── pages/        # Halaman publik, user, dan admin
├── services/     # Koneksi ke API backend
├── utils/        # Helper umum
├── App.jsx       # Routing utama aplikasi
└── main.jsx      # Entry point aplikasi
```

## Routing Utama

### Publik

- `/` -> Landing page
- `/login` -> Login
- `/register` -> Registrasi
- `/ForgotPassword` -> Lupa password
- `/reset-password` -> Reset password
- `/blog/:id` -> Detail artikel publik
- `/terms` -> Terms of Service
- `/privacy` -> Privacy Policy

### User

- `/dashboard` -> Dashboard pengguna
- `/dashboard/health-profile` -> Profil kesehatan
- `/dashboard/generate-plan` -> Generate rencana kesehatan
- `/dashboard/profile` -> Profil akun pengguna
- `/dashboard/articles` -> Daftar artikel
- `/dashboard/articles/:id` -> Detail artikel pengguna
- `/dashboard/recipes` -> Daftar resep
- `/dashboard/recipes/:id` -> Detail resep pengguna
- `/dashboard/favorites` -> Favorit
- `/dashboard/activity-logs` -> Riwayat aktivitas

### Admin

- `/admin` -> Dashboard admin
- `/admin/users` -> Manajemen pengguna
- `/admin/blogs` -> Manajemen blog
- `/admin/reports` -> Manajemen laporan
- `/admin/recipes` -> Manajemen resep
- `/admin/profile` -> Profil admin
- `/admin/activity-logs` -> Riwayat aktivitas admin

## Konfigurasi API

Frontend ini memakai backend yang sudah diarahkan ke endpoint Railway pada file `src/services/api.js`.

- Token login disimpan di `localStorage` dengan key `token`.
- Jika token tersedia, Axios akan otomatis menambahkan header `Authorization: Bearer <token>`.

Kalau ingin memakai backend lain, ubah nilai `baseURL` di file tersebut.

## Catatan Pengembangan

- Layout user dan admin dipisah supaya navigasi lebih jelas.
- Sidebar pada mobile dibuat overlay agar lebih nyaman di layar kecil.
- Perubahan fitur biasanya ada di folder `pages/`, `components/`, dan `services/`.

## Troubleshooting Singkat

- Jika data tidak muncul, pastikan backend aktif dan endpoint API bisa diakses.
- Jika login berhasil tetapi halaman tidak berubah, cek apakah token sudah tersimpan di `localStorage`.
- Jika tampilan berantakan setelah perubahan, jalankan `npm run lint` dan cek kembali komponen layout atau CSS yang diubah.
