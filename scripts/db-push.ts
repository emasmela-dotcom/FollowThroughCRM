import { config } from "dotenv";
import { initDb } from "../src/lib/db";

// Load .env.local (Next.js) or .env
config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  await initDb();
  console.log("DB schema applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
