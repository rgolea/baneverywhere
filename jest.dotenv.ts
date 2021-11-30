import { config } from "dotenv";
import { execSync } from "child_process";

config({
  path: `.env.test`,
});

if(!process.env.CI){
  execSync(`DATABASE_URL=${process.env.DATABASE_URL} npx prisma migrate deploy`);
}
