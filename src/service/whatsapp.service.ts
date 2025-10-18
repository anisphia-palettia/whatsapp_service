import { Client, LocalAuth } from "whatsapp-web.js";
import prisma from "../lib/prisma.lib";
import type { Session } from "../../prisma/generated/prisma";

export class WhatsAppService {
  private client: Client;
  private session: Session;
  private qrTimeout?: NodeJS.Timeout;

  constructor(session: Session) {
    this.session = session;
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: session.clientKey }),
      puppeteer: { headless: true },
    });
  }

  async init() {
    this.client.on("qr", async (qr) => {
      console.log(`[${this.session.clientKey}] QR Code generated`);
      await prisma.session.update({
        where: { id: this.session.id },
        data: { qr, status: "INITIALIZING" },
      });

      if (this.qrTimeout) clearTimeout(this.qrTimeout);
      this.qrTimeout = setTimeout(
        async () => {
          console.log(
            `[${this.session.clientKey}] QR expired, closing client...`
          );
          await this.close("DISCONNECTED");
        },
        3 * 60 * 1000
      );
    });

    this.client.on("ready", async () => {
      console.log(`[${this.session.clientKey}] Connected!`);
      if (this.qrTimeout) clearTimeout(this.qrTimeout);
      await prisma.session.update({
        where: { id: this.session.id },
        data: { status: "CONNECTED", qr: null },
      });
    });

    this.client.on("disconnected", async () => {
      console.log(`[${this.session.clientKey}] Disconnected`);
      await prisma.session.update({
        where: { id: this.session.id },
        data: { status: "DISCONNECTED" },
      });
    });

    await this.client.initialize();
  }

  async sendMessage(to: string, message: string) {
    await this.client.sendMessage(to, message);
  }

  async close(status: "DISCONNECTED" | "ERROR" = "DISCONNECTED") {
    try {
      await this.client.destroy();
    } catch {}
    await prisma.session.update({
      where: { id: this.session.id },
      data: { status },
    });
  }
}
