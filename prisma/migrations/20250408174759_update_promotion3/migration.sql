/*
  Warnings:

  - Added the required column `minUseAmount` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Promotion` ADD COLUMN `minUseAmount` INTEGER NOT NULL;
