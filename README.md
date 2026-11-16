
  # Revise Web Design

  This is a code bundle for Revise Web Design. The original project is available at https://www.figma.com/design/i6Kynff3FL1R3qzVCPabXr/Revise-Web-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
## Deploy

Polanya sama dengan topup-be dan topup-admin-fe:

| Kapan | Workflow | Yang terjadi |
| --- | --- | --- |
| Setiap pull request | `.github/workflows/ci.yml` | `yarn build` + `yarn typecheck` (Node sama dengan Dockerfile) |
| Push ke `dev` | `dev.yml` | CI → image `dev-x.y.z` ke GHCR → deploy ke server dev |
| Push ke `main` | `main.yml` | CI → image `prod-x.y.z` ke GHCR → deploy ke server production |

- Versi = satu di atas tag `dev-*` / `prod-*` tertinggi. Tag git di-push **sebelum** build, jadi dua run
  tidak pernah membangun (dan menimpa) versi yang sama.
- Job deploy (runner self-hosted di server) menjalankan [`deploy/deploy.sh`](deploy/deploy.sh): memasang
  `deploy/docker-compose.<dev|prod>.yml` sebagai `docker-compose.yml` di folder server, pull image, start,
  menunggu healthcheck container (`/robots.txt`, tanpa backend — backend mati tidak me-rollback
  storefront), dan **rollback otomatis** ke versi sebelumnya kalau tidak sehat dalam 90 detik.
  3 versi terakhir disimpan di server.
- Ubah compose di repo, bukan di server: deploy berikutnya menimpa salinan server.

| | Dev | Production |
| --- | --- | --- |
| Folder server | `/opt/dev-deploy/fe-client-dev` | `/data/prod-deploy/fe-client-prod` |
| Container | `fe-client-dev` | `fe-client-prod` |
| Network (IP tetap) | `pakargaming-dev` (`172.20.0.20`) | `pakargaming-prod` (`172.20.0.20`) |
| Runner | `[self-hosted, dev]` | `[self-hosted, prod]` |

Manual di server (versi yang sedang jalan ada di `.deployed-tag`):
`IMAGE_TAG=$(cat .deployed-tag) docker compose up -d`.

### `.env` di folder server

Semua yang dibaca container saat **runtime** ada di `.env` folder server, bukan di GitHub (pola
topup-be). Isinya dan cara mengisinya: [`deploy/dev.env.example`](deploy/dev.env.example) /
[`deploy/prod.env.example`](deploy/prod.env.example). Compose membacanya untuk `${...}`; container hanya
menerima yang ada di `environment:`.

- Deploy pertama membuat `.env` sendiri (mode 600) dan menyalin ke situ yang dipakai container lama
  (port, `ENCRYPT_SECRET_KEY`, `NEXT_SITE_BASE_URL`), jadi tidak wajib dibuat dulu.
- `ENCRYPT_SECRET_KEY` & `NEXT_SITE_BASE_URL` wajib: kalau tetap kosong, deploy berhenti sebelum
  container lama disentuh.
- Setelah mengubah `.env`: jalankan ulang job deploy, atau perintah manual di atas. Tidak perlu build ulang.

### Edge proxy (nginx di host) — wajib

Rate limit per pembeli di backend memakai IP yang dikirim proxy `/api/proxy` sebagai `X-Client-IP`.
Proxy membaca IP itu dari satu header (`CLIENT_IP_HEADER`, default `x-real-ip`) yang hanya bisa
dipercaya kalau edge **menimpanya**, bukan meneruskan nilai dari pembeli:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;   # wajib: menimpa X-Real-IP kiriman pembeli
    # ...pengaturan lain yang sudah ada (WebSocket /api/ws, TLS, dll.) tetap
}
```

Caddy (`reverse_proxy 127.0.0.1:3000`) sudah mengisi `X-Forwarded-For` sendiri; kalau memakai Caddy,
set `CLIENT_IP_HEADER=x-forwarded-for` (proxy mengambil entri **paling kanan**, yang ditambahkan Caddy)
atau tambahkan `header_up X-Real-IP {remote_host}`.

- Port 3000 tidak boleh bisa dijangkau dari internet (default compose `127.0.0.1:3000`; cek juga
  firewall). Kalau bisa, siapa pun bisa mengirim `X-Real-IP` palsu tanpa lewat nginx. `deploy.sh`
  memberi peringatan di log job kalau port ter-publish di semua alamat.
- IP yang tidak sah / tidak ada dikirim sebagai `X-Client-IP: unknown` — backend menaruh semuanya di
  satu bucket rate limit bersama, jadi salah konfigurasi terlihat sebagai 429 massal, bukan rate limit mati.

### Env runtime (`.env` server → `environment:` compose)

| Env | Default | Keterangan |
| --- | --- | --- |
| `ENCRYPT_SECRET_KEY` | wajib | "Enkripsi" body browser→proxy; bukan kontrol keamanan (kuncinya ada di browser). Dibaca saat runtime (layout & proxy) |
| `NEXT_SITE_BASE_URL` | wajib | Header `X-Forwarded-Origin/Referer` dari proxy |
| `STOREFRONT_PROXY_SECRET` | kosong | Sama persis dengan backend; dikirim sebagai `X-Storefront-Key`. Jangan `NEXT_PUBLIC_` |
| `TURNSTILE_SECRET_KEY` | kosong | Secret Cloudflare Turnstile (aktif hanya kalau site key ada di image) |
| `CLIENT_IP_HEADER` | `x-real-ip` | Header yang ditimpa edge dengan IP pembeli |
| `FE_PUBLISH` | `127.0.0.1:3000` | Sisi host port mapping (tujuan reverse proxy) — lihat Edge proxy |

Log job deploy menampilkan mana yang terisi (nama saja, tanpa nilai).

### Build-arg (secret GitHub, di-inline saat build — kosong di build = kosong di image)

Settings → Secrets and variables → Actions → **Repository** secrets (job build tidak memakai
environment, jadi Environment secrets tidak terbaca), `<ENV>` = `DEV` / `PROD`:

| Secret | Wajib? | Isi |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL_<ENV>` | ✅ | URL backend tanpa `/v1` |
| `NEXT_SITE_BASE_URL_<ENV>` | ✅ | Domain storefront (untuk sitemap.xml); samakan dengan `.env` server |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY_<ENV>` | berpasangan dengan `TURNSTILE_SECRET_KEY` di `.env` | Site key Cloudflare Turnstile |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID_<ENV>` | opsional | `G-XXXXXXXXXX`; kosong = GA tidak dimuat |
| `NEXT_PUBLIC_ENCRYPT_KEY_<ENV>` | opsional | Belum dibaca kode |

Variables (bukan secret): `NEXT_PUBLIC_IMAGE_HOSTS_<ENV>` (opsional). Mengubah salah satunya butuh push
ulang (image baru). Build-arg baru wajib dideklarasikan `ARG` + `ENV` di Dockerfile — kalau tidak,
Docker mengabaikannya diam-diam. Secret `ENCRYPT_SECRET_KEY_*`, `STOREFRONT_PROXY_SECRET_*` dan
`TURNSTILE_SECRET_KEY_*` tidak dipakai lagi: hapus setelah nilainya ada di `.env` server.

### GitHub

- Job deploy memakai environment `production` / `development`: pasang aturan proteksinya di
  Settings → Environments (branch `main` / `dev` saja, reviewer untuk production).
- Supaya PR tidak bisa di-merge kalau CI merah: Settings → Branches → aturan untuk `dev` dan `main` →
  wajibkan status check **CI / build + typecheck**.
