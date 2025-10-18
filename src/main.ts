import app from "./app";
import { envConfig } from "./config/env.config";

const APP_PORT = envConfig.APP_PORT;

function bootstrap() {
  Bun.serve({
    fetch: app.fetch,
    port: APP_PORT,
  });
}

bootstrap();
