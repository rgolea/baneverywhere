FROM node:16.13-alpine3.13
WORKDIR /app

COPY dist/apps/api /app
COPY prisma/ app/

RUN ./node_modules/.bin/prisma generate
RUN npm install
