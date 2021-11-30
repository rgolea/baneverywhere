import { config } from "dotenv";
import { execSync } from "child_process";

config({
  path: `.env.test`,
});

let DATABASE_URL = process.env.DATABASE_URL;
if(process.env.DATABASE_HOST){
  DATABASE_URL = `postgres://postgres:postgres@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/baneverywhere-testing?schema=public`;
}
execSync(`DATABASE_URL=${DATABASE_URL} npx prisma migrate deploy`);
