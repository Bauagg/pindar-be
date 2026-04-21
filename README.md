# Pindar Backend API

REST API backend untuk aplikasi Pindar, dibangun dengan Node.js, Express, dan PostgreSQL.

---

## Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v20+
- [PostgreSQL](https://www.postgresql.org/) v14+ (untuk mode development)
- [Docker](https://www.docker.com/) & Docker Compose (untuk mode Docker)

---

## Setup & Menjalankan (Mode Development)

### 1. Clone Repository

```bash
git clone <repo-url>
cd pindar-be
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Salin file contoh environment dan sesuaikan isinya:

```bash
cp .env.example .env
```

Edit file `.env` — pastikan konfigurasi database, SMTP, dan JWT key sudah benar.

> Untuk generate RSA key pair:
> ```bash
> openssl genrsa -out private.pem 2048
> openssl rsa -in private.pem -pubout -out public.pem
> ```
> Salin isi kedua file tersebut ke `PRIVATE_KEY` dan `PUBLIC_KEY` di `.env`.

### 4. Buat Database

Pastikan PostgreSQL sudah berjalan, lalu buat database:

```bash
psql -U postgres -c "CREATE DATABASE pindar;"
```

### 5. Jalankan Migration

Jalankan script SQL **sesuai urutan berikut** (urutan penting karena ada foreign key antar tabel):

```bash
psql -U postgres -d pindar -f migration/script/USER.sql
psql -U postgres -d pindar -f migration/script/LENDER.sql
psql -U postgres -d pindar -f migration/script/CREDIT_CARD.sql
psql -U postgres -d pindar -f migration/script/CONTENT.sql
psql -U postgres -d pindar -f migration/script/ANNOUNCEMENT.sql
psql -U postgres -d pindar -f migration/script/NOTIFICATION.sql
psql -U postgres -d pindar -f migration/script/TRIGGER.sql
psql -U postgres -d pindar -f migration/script/INSERT_PARAMETER.sql
```

> Jika PostgreSQL meminta password, tambahkan `PGPASSWORD=<password>` di depan setiap perintah:
> ```bash
> PGPASSWORD=your_password psql -U postgres -h localhost -d pindar -f migration/script/USER.sql
> ```

### 6. Jalankan Server

```bash
npm run dev
```

Server berjalan di `http://localhost:4000`

---

## Menjalankan dengan Docker

> **Penting:** Pastikan server lokal (`npm run dev`) sudah dimatikan sebelum menjalankan Docker, karena keduanya menggunakan port 4000.

### 1. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` sesuai kebutuhan. Khusus Docker, `DB_HOST` **tidak perlu diubah** — sudah di-override otomatis oleh Docker Compose menjadi `db`.

### 2. Build Image

```bash
docker build -t pindar-be .
```

### 3. Jalankan Semua Service

```bash
docker compose up -d
```

Perintah ini akan menjalankan:
- **`db`** — PostgreSQL container (migration SQL dijalankan otomatis saat pertama kali)
- **`app`** — Aplikasi backend di port 4000

### 4. Cek Status Container

```bash
docker compose ps
```

### 5. Lihat Log

```bash
docker compose logs -f app   # log aplikasi
docker compose logs -f db    # log database
```

### 6. Test Koneksi

```bash
curl http://localhost:4000/api/auth
```

### 7. Stop Container

```bash
docker compose down        # stop, data DB tetap tersimpan
docker compose down -v     # stop + hapus data DB (reset total)
```

---

## Struktur Project

```
pindar-be/
├── server.js                  # Entry point
├── Dockerfile                 # Docker build config
├── docker-compose.yml         # Docker Compose (app + DB)
├── .env.example               # Template environment variable
├── src/
│   ├── app.js                 # Express setup & routing
│   ├── route/                 # Router per fitur
│   ├── controller/            # Handler request/response
│   ├── service/               # Business logic
│   ├── repository/            # Query database
│   ├── middleware/            # Auth JWT & error handler
│   ├── configuration/         # DB pool, SMTP, API permission
│   └── utils/                 # Helper validasi & enkripsi
└── migration/
    └── script/                # SQL schema migration (jalankan berurutan)
```

---

## API Endpoints

| Prefix              | Fitur                  |
|---------------------|------------------------|
| `/api/auth`         | Login, refresh token   |
| `/api/user`         | Signup, profil customer |
| `/api/admin`        | CRUD user admin        |
| `/api/lender`       | CRUD lender/pinjaman   |
| `/api/credit-card`  | CRUD kartu kredit      |
| `/api/content`      | Artikel & komentar     |
| `/api/announcement` | Pengumuman             |
| `/api/notification` | Notifikasi user        |
| `/api/faq`          | FAQ produk             |
| `/api/parameter`    | Parameter sistem       |
| `/api/file`         | Upload/download file   |
| `/api/product`      | Produk umum            |
