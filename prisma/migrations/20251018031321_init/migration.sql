-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('INITIALIZING', 'CONNECTED', 'DISCONNECTED', 'ERROR');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "clientKey" TEXT NOT NULL,
    "label" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'INITIALIZING',
    "qr" TEXT,
    "phoneNumber" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_clientKey_key" ON "Session"("clientKey");
