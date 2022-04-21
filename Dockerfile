FROM node:16.14 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --silent --no-audit
COPY . .
RUN npm run build
LABEL maintainer="helder@taikai.network"

FROM nginx
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
