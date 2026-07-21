import { spawnSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("DATABASE_URL is not configured; skipping database migrations.");
  process.exit(0);
}

if (!/^postgres(?:ql)?:\/\//.test(databaseUrl)) {
  console.error("DATABASE_URL is configured but is not a PostgreSQL URL.");
  process.exit(1);
}

console.log("Applying pending production database migrations.");
const result = spawnSync(
  process.execPath,
  ["./node_modules/prisma/build/index.js", "migrate", "deploy"],
  { env: process.env, stdio: "inherit" },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
