FROM node:16.13-alpine3.13
WORKDIR /app

COPY dist /app
COPY package.json /app
COPY package-lock.json /app
COPY prisma /app
COPY decorate-angular-cli.js /app

RUN npm install
RUN npm run generate
