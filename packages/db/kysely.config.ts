import { defineConfig } from "kysely-ctl";
export default defineConfig({
  dialect: "pg",
  migrations: { migrationFolder: "migrations" },
  seeds: { seedFolder: "seeds" },
});
