FROM node:16.13-alpine3.13
WORKDIR /app

COPY prisma/ /app
COPY config/migration/ /app

RUN npm install
RUN ./node_modules/.bin/prisma generate
