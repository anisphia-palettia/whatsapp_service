import { createFactory } from "hono/factory";

type Env = {
  Variables: {
    foo: string;
  };
};

export const { createApp, createHandlers, createMiddleware } =
  createFactory<Env>({
    initApp: (c) => {
      console.log("Hono is running");
    },
  });
