export const env = {
  PORT: Number(process.env.PORT ?? 3002),
  DATABASE_URL: process.env.DATABASE_URL ?? "postgres://ssm:ssm@localhost:5433/ssm",
  REDIS_URL: process.env.REDIS_URL ?? "redis://localhost:6381",
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-secret-change-me-32-chars-min",
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? "",
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
};