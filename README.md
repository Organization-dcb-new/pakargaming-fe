
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
| Network (IP tetap) | `pakargaming-dev-client` (`172.16.10.20`) | `pakargaming-prod-client` (`172.16.10.20`) |
| Runner | `[self-hosted, dev]` | `[self-hosted, prod]` |

Manual di server (versi yang sedang jalan ada di `.deployed-tag`):
`IMAGE_TAG=$(cat .deployed-tag) docker compose up -d`.

### `.env` di folder server

**Semua** konfigurasi app — termasuk `NEXT_PUBLIC_*` — ada di `.env` folder server, bukan di GitHub
(pola topup-be). Tidak ada yang tertanam di image: kode server membacanya saat runtime lewat
[`src/config/runtimeEnv.ts`](src/config/runtimeEnv.ts), dan nilai untuk browser dikirim layout lewat
`usePublicEnv()`. Isinya dan cara mengisinya: [`deploy/dev.env.example`](deploy/dev.env.example) /
[`deploy/prod.env.example`](deploy/prod.env.example). Compose membacanya untuk `${...}`; container hanya
menerima yang ada di `environment:`.

- Deploy pertama membuat `.env` sendiri (mode 600) dan menyalin ke situ yang dipakai container lama
  (port, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_SITE_BASE_URL`, `ENCRYPT_SECRET_KEY`), jadi tidak wajib dibuat
  dulu. Yang dulu tertanam di image (site key Turnstile, id GA) harus diisi sendiri.
- `NEXT_PUBLIC_API_BASE_URL`, `API_INTERNAL_URL`, `NEXT_SITE_BASE_URL`, `ENCRYPT_SECRET_KEY` wajib: kalau
  tetap kosong, deploy berhenti sebelum container lama disentuh.
- Setelah mengubah `.env`: jalankan ulang job deploy, atau perintah manual di atas. Tidak perlu build ulang.
- Di kode: jangan menulis `process.env.NEXT_PUBLIC_*` langsung — Next.js menggantinya dengan nilai saat
  build (kosong di image). Pakai fungsi di `runtimeEnv.ts` (server) atau `usePublicEnv()` (client).

### Edge proxy (nginx di host) — wajib

Rate limit per pembeli di backend memakai IP yang dikirim proxy `/api/proxy` sebagai `X-Client-IP`.
Proxy membaca IP itu dari satu header (`CLIENT_IP_HEADER`, default `x-real-ip`) yang hanya bisa
dipercaya kalau edge **menimpanya**, bukan meneruskan nilai dari pembeli:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;   # wajib: menimpa X-Real-IP kiriman pembeli
    # ...pengaturan lain yang sudah ada (TLS, dll.) tetap
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
| `NEXT_PUBLIC_API_BASE_URL` | wajib | URL backend **publik** tanpa `/v1`, **khusus** redirect login & link Google (dibuka browser). Jangan alamat internal. Tidak dipakai untuk request server |
| `API_INTERNAL_URL` | wajib | Backend di network Docker untuk **semua** request dari server ini (proxy, sitemap, metadata game, maintenance, pengumuman, logout): `http://172.16.10.10:4001`, port wajib. Tidak ada fallback. Syarat: `ALLOWED_IPS` backend memuat `172.16.10.20` — log deploy mengecek ini |
| `NEXT_SITE_BASE_URL` | wajib | Domain storefront: URL sitemap.xml, header `X-Forwarded-Origin/Referer` dari proxy |
| `ENCRYPT_SECRET_KEY` | wajib | "Enkripsi" body browser→proxy; bukan kontrol keamanan (kuncinya ada di browser) |
| `STOREFRONT_PROXY_SECRET` | kosong | Sama persis dengan backend; dikirim sebagai `X-Storefront-Key`. Jangan `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | kosong | Cloudflare Turnstile; aktif hanya kalau keduanya terisi |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | kosong | `G-XXXXXXXXXX`; kosong = GA tidak dimuat |
| `NEXT_PUBLIC_FOOTER_LOGO_URL` | kosong | Logo footer; kosong = logo bawaan |
| `CLIENT_IP_HEADER` | `x-real-ip` | Header yang ditimpa edge dengan IP pembeli |
| `FE_PUBLISH` | `127.0.0.1:3000` | Sisi host port mapping (tujuan reverse proxy) — lihat Edge proxy |

Log job deploy menampilkan nilainya (rahasia hanya `set` / `empty`).

### GitHub

- **Tidak ada secret GitHub yang dipakai** (selain `GITHUB_TOKEN` otomatis). Satu-satunya input build:
  Variable `NEXT_PUBLIC_IMAGE_HOSTS_DEV` / `_PROD` (opsional, host gambar tambahan untuk next/image —
  dikunci saat build). Secret lama (`NEXT_PUBLIC_*_DEV/_PROD`, `NEXT_SITE_BASE_URL_*`,
  `ENCRYPT_SECRET_KEY_*`, `STOREFRONT_PROXY_SECRET_*`, `TURNSTILE_SECRET_KEY_*`) boleh dihapus setelah
  `.env` server dev & production lengkap.
- Job deploy memakai environment `production` / `development`: pasang aturan proteksinya di
  Settings → Environments (branch `main` / `dev` saja, reviewer untuk production).
- Supaya PR tidak bisa di-merge kalau CI merah: Settings → Branches → aturan untuk `dev` dan `main` →
  wajibkan status check **CI / build + typecheck**.
