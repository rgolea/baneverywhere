FROM node:16.13-alpine3.13
WORKDIR /app

COPY dist/apps/queue-processor /app
COPY prisma/ app/

RUN npm install
RUN ./node_modules/.bin/prisma generate
