-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "clientEventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_clientEventId_key" ON "Event"("clientEventId");
