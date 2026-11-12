# Node 24 LTS, versi & digest dipatok supaya build bisa diulang dan base image tidak berubah diam-diam.
# Naikkan versi: ambil tag + digest terbaru node:24.x-alpine dari Docker Hub, ganti di KETIGA baris FROM.
FROM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS builder
WORKDIR /app
# NEXT_PUBLIC_* di-inline ke bundle saat `yarn build` — kosong di sini = kosong selamanya di image ini.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ENCRYPT_KEY
ARG NEXT_SITE_BASE_URL
ARG ENCRYPT_SECRET_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_IMAGE_HOSTS

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ENCRYPT_KEY=$NEXT_PUBLIC_ENCRYPT_KEY
ENV NEXT_SITE_BASE_URL=$NEXT_SITE_BASE_URL
ENV ENCRYPT_SECRET_KEY=$ENCRYPT_SECRET_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_IMAGE_HOSTS=$NEXT_PUBLIC_IMAGE_HOSTS

COPY --from=deps /app/node_modules ./node_modules
# .dockerignore membuang .env*, .git, .next & node_modules lokal — rahasia lokal tidak ikut ke image
COPY . .
RUN yarn build

FROM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS runner
WORKDIR /app
ENV NODE_ENV=production
# Rahasia runtime (TURNSTILE_SECRET_KEY, STOREFRONT_PROXY_SECRET, ...) diberikan lewat `environment:`
# compose, bukan build-arg, supaya tidak tersimpan di layer image.

# Jalan sebagai user `node` (bawaan image), bukan root: celah di app tidak langsung jadi akses root container.
# File dimiliki `node` supaya cache optimasi gambar (.next/cache) tetap bisa ditulis.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
