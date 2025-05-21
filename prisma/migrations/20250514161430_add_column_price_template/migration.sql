-- AlterTable
ALTER TABLE `Product` ADD COLUMN `ownerCount` INTEGER NULL;

-- AlterTable
ALTER TABLE `TaskTemplate` ADD COLUMN `price` INTEGER NULL DEFAULT 0;
