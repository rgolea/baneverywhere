FROM node:16.13-alpine3.13
WORKDIR /app

COPY --from=build dist /app
COPY --from=build package.json /app
COPY --from=build package-lock.json /app
COPY --from=build prisma /app
COPY --from=build decorate-angular-cli.js /app

RUN npm install
RUN npm run generate
