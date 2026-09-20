import { Hono } from "hono";
export const tradingRoutes = new Hono();
tradingRoutes.post("/buy", (c) => c.json({ error: "Not implemented" }, 501));
tradingRoutes.post("/sell", (c) => c.json({ error: "Not implemented" }, 501));
