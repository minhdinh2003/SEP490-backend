/*
  Warnings:

  - Added the required column `discountValue` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minUseRequest` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Promotion` ADD COLUMN `discountType` ENUM('PERCENTAGE', 'AMOUNT') NOT NULL DEFAULT 'PERCENTAGE',
    ADD COLUMN `discountValue` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `minUseRequest` INTEGER NOT NULL;
