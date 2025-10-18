import { cors } from "hono/cors";
import { createApp } from "./lib/hono_factory.lib";
import { errorhandler } from "./lib/error.handler";
import { notFoundHandler } from "./lib/not_found.handler";
import whatsapp from "./handler/whatsapp.handler";

const app = createApp();

app.use("", cors());

app.route("", whatsapp);

app.notFound(notFoundHandler);
app.onError(errorhandler);

export default app;
