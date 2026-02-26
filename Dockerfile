FROM node:20-alpine

WORKDIR /app


# Install deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build Next.js
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
