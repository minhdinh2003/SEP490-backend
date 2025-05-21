/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `totalAmount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `price` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `agreedPrice` INTEGER NULL;
