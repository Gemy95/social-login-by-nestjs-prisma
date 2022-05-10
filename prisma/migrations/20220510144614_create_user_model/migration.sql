-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `picture_url` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL DEFAULT 'MALE',
    `birth_date` DATE NULL,
    `social_access_token` VARCHAR(191) NULL,
    `referral` VARCHAR(191) NULL,
    `provider` ENUM('NONE', 'GOOGLE', 'TWITTER', 'FACEBOOK', 'INSTAGRAM', 'APPLE') NOT NULL DEFAULT 'NONE',
    `status` ENUM('PENDING_OTP', 'PENDING_COMPLETE_PROFILE', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING_OTP',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    UNIQUE INDEX `User_social_access_token_key`(`social_access_token`),
    UNIQUE INDEX `User_referral_key`(`referral`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
