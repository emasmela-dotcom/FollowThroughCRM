// Load env before db (db reads DATABASE_URL at import time)
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

import { initDb } from "../src/lib/db";

async function main() {
  await initDb();
  console.log("DB schema applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
