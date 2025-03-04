/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Whitelist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `Whitelist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `times` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Promotion` ADD COLUMN `times` INTEGER NOT NULL,
    ADD COLUMN `type` ENUM('BUY', 'REPAIR') NOT NULL DEFAULT 'BUY';

-- CreateIndex
CREATE UNIQUE INDEX `Whitelist_userId_key` ON `Whitelist`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Whitelist_productId_key` ON `Whitelist`(`productId`);
