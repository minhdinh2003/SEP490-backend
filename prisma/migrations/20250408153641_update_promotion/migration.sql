/*
  Warnings:

  - Added the required column `type` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Promotion` ADD COLUMN `type` ENUM('EVENT', 'DISCOUNT', 'MAINTENANCE') NOT NULL;
