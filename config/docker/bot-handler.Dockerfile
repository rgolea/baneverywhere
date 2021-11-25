FROM node:16.13-alpine3.13
WORKDIR /app

COPY dist/apps/bot-handler /app

RUN npm install
