
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
| Network | `pakargaming_network` | `pakargaming_network` |
| Runner | `[self-hosted, dev]` | `[self-hosted, prod]` |

Manual di server (versi yang sedang jalan ada di `.deployed-tag`):
`IMAGE_TAG=$(cat .deployed-tag) docker compose up -d`. Rahasia yang biasanya dikirim job tidak ada saat
itu, jadi yang dibutuhkan container harus ada di `.env` folder tersebut — atau jalankan ulang job deploy.

### `.env` di folder server

Dibaca compose untuk `${...}` di file compose; container hanya menerima yang ada di `environment:`.
Nilai dari job (secret GitHub) menang atas `.env`; secret yang tidak didefinisikan tidak menimpa `.env`.
Deploy pertama menyalin ke `.env` apa pun yang belum diset job maupun `.env`, dari container yang sedang
jalan (port, header IP, secret yang dulu hanya ada di compose server).

| Var | Default | Keterangan |
| --- | --- | --- |
| `FE_PUBLISH` | `127.0.0.1:3000` | Sisi host port mapping (tujuan nginx). Tetap di `127.0.0.1` — lihat Edge proxy |
| `CLIENT_IP_HEADER` | `x-real-ip` | Lihat tabel env runtime |
| `STOREFRONT_PROXY_SECRET`, `TURNSTILE_SECRET_KEY` | kosong | Kalau tidak disimpan sebagai secret GitHub |

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

### Env runtime (server-only, `environment:` compose)

| Env | Default | Keterangan |
| --- | --- | --- |
| Env | Default | Sumber | Keterangan |
| --- | --- | --- | --- |
| `ENCRYPT_SECRET_KEY` | — | secret `ENCRYPT_SECRET_KEY_<ENV>` | "Enkripsi" body browser→proxy; bukan kontrol keamanan (kuncinya ada di browser). Dibaca saat runtime (layout & proxy) |
| `NEXT_SITE_BASE_URL` | — | secret `NEXT_SITE_BASE_URL_<ENV>` | Header `X-Forwarded-Origin/Referer` dari proxy |
| `STOREFRONT_PROXY_SECRET` | kosong | secret `STOREFRONT_PROXY_SECRET_<ENV>` atau `.env` | Sama dengan backend; dikirim sebagai `X-Storefront-Key`. Jangan `NEXT_PUBLIC_` |
| `TURNSTILE_SECRET_KEY` | kosong | secret `TURNSTILE_SECRET_KEY_<ENV>` atau `.env` | Secret Cloudflare Turnstile |
| `CLIENT_IP_HEADER` | `x-real-ip` | `.env` | Header yang ditimpa edge dengan IP pembeli |

`<ENV>` = `DEV` (dev.yml) / `PROD` (main.yml). Log job deploy menampilkan mana yang terisi (nama saja).

### Build-arg (di-inline saat build — kosong di build = kosong di image)

`NEXT_PUBLIC_API_BASE_URL`, `NEXT_SITE_BASE_URL`, `NEXT_PUBLIC_ENCRYPT_KEY`, `ENCRYPT_SECRET_KEY`,
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_IMAGE_HOSTS` (opsional).
Di CI diambil dari secret `<NAMA>_PROD` / `<NAMA>_DEV`; `NEXT_PUBLIC_IMAGE_HOSTS_PROD/_DEV` dari Variables
(bukan rahasia). Build-arg baru wajib dideklarasikan `ARG` + `ENV` di Dockerfile — kalau tidak, Docker
mengabaikannya diam-diam.

### GitHub

- Secrets: lihat dua tabel di atas.
- Job deploy memakai environment `production` / `development`: pasang aturan proteksinya di
  Settings → Environments (branch `main` / `dev` saja, reviewer untuk production).
- Supaya PR tidak bisa di-merge kalau CI merah: Settings → Branches → aturan untuk `dev` dan `main` →
  wajibkan status check **CI / build + typecheck**.
