/*
  Warnings:

  - You are about to drop the column `productId` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `times` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the `Voucher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Promotion` DROP FOREIGN KEY `Promotion_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Voucher` DROP FOREIGN KEY `Voucher_promotionId_fkey`;

-- AlterTable
ALTER TABLE `Promotion` DROP COLUMN `productId`,
    DROP COLUMN `times`,
    DROP COLUMN `type`,
    ADD COLUMN `content` TEXT NOT NULL;

-- DropTable
DROP TABLE `Voucher`;
