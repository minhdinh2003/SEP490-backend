/*
  Warnings:

  - Added the required column `reasonReject` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Request` ADD COLUMN `reasonReject` VARCHAR(191) NOT NULL;
