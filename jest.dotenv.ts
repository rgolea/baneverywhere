import { config } from "dotenv";
import { execSync } from "child_process";

config({
  path: `.env.test`,
});

execSync(`DATABASE_URL=postgres://postgres:postgres@localhost:5432/baneverywhere-testing?schema=public npx prisma migrate deploy`);
