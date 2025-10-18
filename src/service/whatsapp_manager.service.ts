import { HTTPException } from "hono/http-exception";
import prisma from "../lib/prisma.lib";
import { WhatsAppService } from "../service/whatsapp.service";

export class WhatsAppManagerService {
  private sessions: Map<string, WhatsAppService> = new Map();

  async initAll() {
    const allSessions = await prisma.session.findMany();
    for (const session of allSessions) {
      const wa = new WhatsAppService(session);
      this.sessions.set(session.clientKey, wa);
      if (session.status !== "CONNECTED") await wa.init();
    }
  }

  async startOne(clientKey: string) {
    const session = await prisma.session.findUnique({
      where: { clientKey },
    });

    if (!session)
      throw new HTTPException(404, { message: "Session not found" });

    const client = new WhatsAppService(session);
    this.sessions.set(clientKey, client);
    await client.init();
  }

  async create(label: string) {
    const session = await prisma.session.create({ data: { label } });
    const wa = new WhatsAppService(session);
    this.sessions.set(session.clientKey, wa);
    await wa.init();
    return session;
  }

  get(clientKey: string) {
    return this.sessions.get(clientKey);
  }
}
