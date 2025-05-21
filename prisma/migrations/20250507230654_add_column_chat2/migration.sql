-- AlterTable
ALTER TABLE `Chat` ADD COLUMN `receiveId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Chat_receiveId_idx` ON `Chat`(`receiveId`);
