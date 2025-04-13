import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/db/drizzle/migrations',
  schema: './src/db/drizzle/schemas.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './db.sqlite3',
  },
});
