/*
  Warnings:

  - You are about to drop the column `location` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `promotionId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Inventory` DROP COLUMN `location`,
    ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `promotionId`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `description`,
    DROP COLUMN `lastLogin`,
    DROP COLUMN `postalCode`;
