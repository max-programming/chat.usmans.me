import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const globalForDb = globalThis as unknown as {
  postgresClient?: ReturnType<typeof postgres>;
  db?: ReturnType<typeof drizzle>;
};

const client = globalForDb.postgresClient ?? postgres(process.env.DATABASE_URL);
if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

export const db = globalForDb.db ?? drizzle({ client, schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
