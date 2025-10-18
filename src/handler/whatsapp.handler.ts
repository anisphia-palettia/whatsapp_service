import { HTTPException } from "hono/http-exception";
import { SessionCreateInputObjectSchema } from "../../prisma/generated/zod/schemas";
import { createApp } from "../lib/hono_factory.lib";
import prisma from "../lib/prisma.lib";
import zodValidator from "../middleware/zod_validator.middleware";
import { WhatsappSchema } from "../schema/whatsapp.schema";
import { WhatsAppManagerService } from "../service/whatsapp_manager.service";
import { errorResponse, successResponse } from "../utils/api_response.util";

const manager = new WhatsAppManagerService();
const whatsapp = createApp().basePath("/whatsapp");

whatsapp.post(
  "/create",
  zodValidator("json", SessionCreateInputObjectSchema),
  async (c) => {
    const { label } = c.req.valid("json");
    const session = await manager.create(label);
    return successResponse(c, {
      message: "Session created",
      data: {
        clientKey: session.clientKey,
        label: session.label,
        status: session.status,
      },
    });
  }
);
whatsapp.get(
  "/:clientKey/qr",
  zodValidator("param", WhatsappSchema.params),
  async (c) => {
    const { clientKey } = c.req.valid("param");
    const session = await prisma.session.findUnique({
      where: { clientKey },
    });
    if (!session)
      throw new HTTPException(404, { message: "Session not found" });
    if (session.qr) {
      return successResponse(c, {
        message: "QR available",
        data: { qr: `https://quickchart.io/qr?text=${session.qr}` },
      });
    }
    return successResponse(c, {
      message: "No QR (already connected or expired)",
    });
  }
);

whatsapp.post(
  "/:clientKey/send",
  zodValidator("json", WhatsappSchema.send),
  zodValidator("param", WhatsappSchema.params),
  async (c) => {
    const { to, message } = c.req.valid("json");
    const { clientKey } = c.req.valid("param");
    const session = manager.get(clientKey);
    if (!session)
      throw new HTTPException(404, { message: "Session not found" });
    const jid: string = to.includes("@c.us")
      ? to
      : "62" + to.replace(/^0/, "") + "@c.us";
    await session.sendMessage(jid, message);
    return successResponse(c, { message: "Message sent" });
  }
);

export default whatsapp;
