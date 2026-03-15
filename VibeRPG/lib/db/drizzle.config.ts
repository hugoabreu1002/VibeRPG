import { defineConfig } from "drizzle-kit";
import path from "path";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for SQLite mode (e.g. file:./dev.db)");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
