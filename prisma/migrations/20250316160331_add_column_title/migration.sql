-- DropIndex
DROP INDEX `TaskDetail_taskId_idx` ON `TaskDetail`;

-- AlterTable
ALTER TABLE `TaskDetail` ADD COLUMN `title` TEXT NULL;
