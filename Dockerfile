# Node 24 LTS, versi & digest dipatok supaya build bisa diulang dan base image tidak berubah diam-diam.
# Naikkan versi: ambil tag + digest terbaru node:24.x-alpine dari Docker Hub, ganti di KETIGA baris FROM,
# lalu samakan node-version di .github/workflows/ci.yml supaya CI mengecek build yang sama dengan yang dikirim.
FROM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS builder
WORKDIR /app
# NEXT_PUBLIC_* di-inline ke bundle saat `yarn build` — kosong di sini = kosong selamanya di image ini.
# Build-arg yang dikirim CI tapi tidak dideklarasikan di sini diabaikan diam-diam (begitu GA dulu hilang).
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ENCRYPT_KEY
ARG NEXT_SITE_BASE_URL
ARG ENCRYPT_SECRET_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_IMAGE_HOSTS
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ENCRYPT_KEY=$NEXT_PUBLIC_ENCRYPT_KEY
ENV NEXT_SITE_BASE_URL=$NEXT_SITE_BASE_URL
ENV ENCRYPT_SECRET_KEY=$ENCRYPT_SECRET_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_IMAGE_HOSTS=$NEXT_PUBLIC_IMAGE_HOSTS
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
# .dockerignore membuang .env*, .git, .next & node_modules lokal — rahasia lokal tidak ikut ke image
COPY . .
RUN yarn build

FROM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS runner
WORKDIR /app
ENV NODE_ENV=production
# server.js (output standalone) listen di HOSTNAME:PORT. Docker mengisi HOSTNAME dengan ID container,
# jadi tanpa ini server hanya listen di IP container dan healthcheck compose (wget ke 127.0.0.1:3000 di
# dalam container) selalu gagal. 0.0.0.0 di dalam container tidak membuka apa pun ke luar: yang dipublish
# ke host tetap `ports:` compose (default 127.0.0.1:3000).
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# Rahasia runtime (ENCRYPT_SECRET_KEY, TURNSTILE_SECRET_KEY, STOREFRONT_PROXY_SECRET, ...) diberikan lewat
# `environment:` compose (deploy/docker-compose.*.yml), bukan build-arg, supaya tidak tersimpan di layer image.

# Jalan sebagai user `node` (bawaan image), bukan root: celah di app tidak langsung jadi akses root container.
# File dimiliki `node` supaya cache optimasi gambar (.next/cache) tetap bisa ditulis.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
