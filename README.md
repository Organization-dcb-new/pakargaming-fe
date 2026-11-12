
  # Revise Web Design

  This is a code bundle for Revise Web Design. The original project is available at https://www.figma.com/design/i6Kynff3FL1R3qzVCPabXr/Revise-Web-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
## Deploy

Image dibangun CI (`.github/workflows/main.yml` → production, `dev.yml` → dev) lalu dijalankan
docker compose di server. Container mendengarkan `127.0.0.1:3000` saja; yang menghadap internet
adalah nginx/Caddy di host.

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

- Port 3000 tidak boleh bisa dijangkau dari internet (compose sudah `127.0.0.1:3000:3000`; cek juga
  firewall). Kalau bisa, siapa pun bisa mengirim `X-Real-IP` palsu tanpa lewat nginx.
- IP yang tidak sah / tidak ada dikirim sebagai `X-Client-IP: unknown` — backend menaruh semuanya di
  satu bucket rate limit bersama, jadi salah konfigurasi terlihat sebagai 429 massal, bukan rate limit mati.

### Env runtime (server-only, `environment:` compose)

| Env | Default | Keterangan |
| --- | --- | --- |
| `CLIENT_IP_HEADER` | `x-real-ip` | Header yang ditimpa edge dengan IP pembeli |
| `STOREFRONT_PROXY_SECRET` | kosong | Sama dengan backend; dikirim sebagai `X-Storefront-Key`. Jangan `NEXT_PUBLIC_` |
| `TURNSTILE_SECRET_KEY` | kosong | Secret Cloudflare Turnstile |
| `ENCRYPT_SECRET_KEY` | — | "Enkripsi" body browser→proxy; bukan kontrol keamanan (kuncinya ada di browser) |

### Build-arg (di-inline saat build — kosong di build = kosong di image)

`NEXT_PUBLIC_API_BASE_URL`, `NEXT_SITE_BASE_URL`, `NEXT_PUBLIC_ENCRYPT_KEY`, `ENCRYPT_SECRET_KEY`,
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_IMAGE_HOSTS` (opsional). Di CI diambil dari secret
`<NAMA>_PROD` / `<NAMA>_DEV`; `NEXT_PUBLIC_IMAGE_HOSTS_PROD/_DEV` dari Variables (bukan rahasia).

### GitHub

- Secrets: `NEXT_PUBLIC_TURNSTILE_SITE_KEY_PROD/_DEV`, `TURNSTILE_SECRET_KEY_PROD/_DEV` (opsional, kalau
  tidak diisi di `.env` server), `STOREFRONT_PROXY_SECRET_PROD/_DEV` (opsional, sama).
- Job deploy memakai environment `production` / `development`: pasang aturan proteksinya di
  Settings → Environments (branch `main` / `dev` saja, reviewer untuk production).
