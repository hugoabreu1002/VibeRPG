import * as schema from "./schema";

const dbType = process.env.DB_TYPE?.toLowerCase() || "postgresql";

export let db: any;

if (dbType === "sqlite") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for SQLite (e.g. file:./dev.db)");
  }

  const Database = await import("better-sqlite3").then((m) => m.default);
  const { drizzle } = await import("drizzle-orm/node-sqlite");

  const sqliteDb = new Database(process.env.DATABASE_URL.replace(/^file:/, ""));
  db = drizzle(sqliteDb, { schema });
} else {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  const { drizzle } = await import("drizzle-orm/node-postgres");
  const pg = await import("pg");
  const { Pool } = pg;

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}

export * from "./schema";
