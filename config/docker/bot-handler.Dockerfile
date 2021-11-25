FROM node:16.13-alpine3.13
WORKDIR /app

COPY dist/apps/bot-handler /app
COPY prisma /app/prisma

RUN npm install
RUN ./node_modules/.bin/prisma generate
