import { Hono } from "hono";
import { logger } from "./platform/logger.js";

export const app = new Hono();

app.get("/health", (c) => c.json({ ok: true }));
app.get("/health/live", (c) => c.json({ ok: true }));

// Modules mount here
// app.route("/api/auth", authRoutes);
// app.route("/api/markets", tradingRoutes);
// app.route("/api/portfolio", portfolioRoutes);

app.onError((err, c) => {
  logger.error(err);
  return c.json({ error: err.message }, 500);
});
