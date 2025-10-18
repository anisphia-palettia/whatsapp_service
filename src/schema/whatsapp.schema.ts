import z from "zod";

export const WhatsappSchema = {
  send: z.object({
    to: z.string(),
    message: z.string(),
  }),
  params: z.object({
    clientKey: z.string(),
  }),
};
