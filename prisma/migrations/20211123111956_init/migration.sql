-- CreateEnum
CREATE TYPE "BanEverywhereSettings" AS ENUM ('AUTOMATIC', 'WITH_VALIDATION', 'NONE');

-- CreateEnum
CREATE TYPE "Action" AS ENUM ('BAN', 'UNBAN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "twitchId" TEXT NOT NULL,
    "profile_image_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "fromId" TEXT NOT NULL,
    "fromUsername" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "toUsername" TEXT NOT NULL,
    "settings" "BanEverywhereSettings" NOT NULL DEFAULT E'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions" (
    "id" SERIAL NOT NULL,
    "action" "Action" NOT NULL,
    "user" TEXT NOT NULL,
    "streamer" TEXT NOT NULL,
    "moderator" TEXT NOT NULL,
    "reason" TEXT,
    "queueFor" TEXT NOT NULL,
    "inQueue" BOOLEAN DEFAULT false,
    "approved" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" SERIAL NOT NULL,
    "machine" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_display_name_key" ON "users"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_twitchId_key" ON "users"("twitchId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_fromId_toId_key" ON "settings"("fromId", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_fromUsername_toUsername_key" ON "settings"("fromUsername", "toUsername");

-- CreateIndex
CREATE UNIQUE INDEX "channels_username_key" ON "channels"("username");

-- CreateIndex
CREATE UNIQUE INDEX "channels_machine_username_key" ON "channels"("machine", "username");
