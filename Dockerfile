FROM node:25-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:25-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ENCRYPT_KEY
ARG NEXT_SITE_BASE_URL
ARG ENCRYPT_SECRET_KEY

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ENCRYPT_KEY=$NEXT_PUBLIC_ENCRYPT_KEY
ENV NEXT_SITE_BASE_URL=$NEXT_SITE_BASE_URL
ENV ENCRYPT_SECRET_KEY=$ENCRYPT_SECRET_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:25-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]