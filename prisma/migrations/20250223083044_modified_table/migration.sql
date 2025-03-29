/*
  Warnings:

  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `address` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `state`,
    ADD COLUMN `district` VARCHAR(100) NULL,
    ADD COLUMN `province` VARCHAR(100) NULL,
    ADD COLUMN `ward` VARCHAR(100) NULL;
