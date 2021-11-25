FROM node:16.13-alpine3.13
WORKDIR /app

COPY prisma/ /app

RUN npm install
