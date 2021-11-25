FROM node:16.13-alpine3.13
WORKDIR /app

COPY dist/apps/bot-handler /app
COPY prisma/ app/

RUN npx prisma generate
RUN npm install
