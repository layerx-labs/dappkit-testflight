FROM node:16.14 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --silent --no-audit
RUN npm install -g @angular/cli@13.3.1
COPY . .
RUN npm run build
LABEL maintainer="helder@taikai.network"

FROM nginx
WORKDIR /app
COPY --from=builder /app/dist/dappkit-testflight /usr/share/nginx/html
