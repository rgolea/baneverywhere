FROM node:16.13-alpine3.13
WORKDIR /app

COPY --from=builder ./dist /app
COPY --from=builder ./package.json /app
COPY --from=builder ./package-lock.json /app
COPY --from=builder ./prisma /app
COPY --from=builder ./decorate-angular-cli.js /app

RUN npm install
RUN npm run generate
