import { config } from "dotenv";
import { execSync } from "child_process";

config({
  path: `.env.test`,
});

execSync(`DATABASE_URL=${process.env.DATABASE_URL} npx prisma migrate deploy`);
