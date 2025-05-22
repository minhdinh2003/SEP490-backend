/*
  Warnings:

  - Added the required column `items` to the `TaskTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TaskTemplate` ADD COLUMN `items` JSON NOT NULL;
