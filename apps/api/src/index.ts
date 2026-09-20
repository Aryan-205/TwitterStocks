import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { env } from "./platform/env.js";
import { logger } from "./platform/logger.js";

serve({ fetch: app.fetch, port: env.PORT }, () => {
  logger.info(`API listening on ${env.PORT}`);
});
