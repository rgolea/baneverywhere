import { config } from "dotenv";
import { execSync } from "child_process";

config({
  path: `.env.test`,
});

execSync(`npx prisma migrate deploy`);
