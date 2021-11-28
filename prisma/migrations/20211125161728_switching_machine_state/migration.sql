/*
  Warnings:

  - You are about to drop the `channels` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "machineUUID" TEXT;

-- DropTable
DROP TABLE "channels";

-- CreateTable
CREATE TABLE "machines" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machines_uuid_key" ON "machines"("uuid");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_machineUUID_fkey" FOREIGN KEY ("machineUUID") REFERENCES "machines"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
