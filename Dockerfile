
# ---- Base Node image ----
FROM node:18 AS builder

WORKDIR /app

# ---- Copy and build client ----
COPY client/package*.json ./client/
COPY client/vite.config.ts ./client/
COPY client/index.html ./client/
COPY client/public ./client/public
COPY client/src ./client/src

WORKDIR /app/client
RUN npm install && npm run build

# ---- Copy and build server ----
WORKDIR /app
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/
COPY server/src ./server/src
COPY server/src/collections.json ./server/src/collections.json
COPY server/run-docker.sh ./server/run-docker.sh

WORKDIR /app/server
RUN npm install && npm install -g ts-node

# ---- Final runtime image ----
FROM node:18

WORKDIR /app

COPY --from=builder /app/server /app/server
COPY --from=builder /app/client/dist /app/server/public

RUN npm install -g ts-node serve

WORKDIR /app/server

CMD ["./run-docker.sh"]
