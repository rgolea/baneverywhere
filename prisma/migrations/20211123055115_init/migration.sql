-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `twitchId` VARCHAR(191) NOT NULL,
    `profile_image_url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_login_key`(`login`),
    UNIQUE INDEX `users_display_name_key`(`display_name`),
    UNIQUE INDEX `users_twitchId_key`(`twitchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromId` VARCHAR(191) NOT NULL,
    `fromUsername` VARCHAR(191) NOT NULL,
    `toId` VARCHAR(191) NOT NULL,
    `toUsername` VARCHAR(191) NOT NULL,
    `settings` ENUM('AUTOMATIC', 'WITH_VALIDATION', 'NONE') NOT NULL DEFAULT 'NONE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `settings_fromId_toId_key`(`fromId`, `toId`),
    UNIQUE INDEX `settings_fromUsername_toUsername_key`(`fromUsername`, `toUsername`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` ENUM('BAN', 'UNBAN') NOT NULL,
    `user` VARCHAR(191) NOT NULL,
    `streamer` VARCHAR(191) NOT NULL,
    `moderator` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `queueFor` VARCHAR(191) NOT NULL,
    `inQueue` BOOLEAN NULL DEFAULT false,
    `approved` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machine` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `channels_username_key`(`username`),
    UNIQUE INDEX `channels_machine_username_key`(`machine`, `username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
