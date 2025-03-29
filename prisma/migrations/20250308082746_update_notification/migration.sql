/*
  Warnings:

  - You are about to drop the column `isRead` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `rawData` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiveId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `isRead`,
    DROP COLUMN `message`,
    DROP COLUMN `userId`,
    ADD COLUMN `isViewed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rawData` VARCHAR(191) NOT NULL,
    ADD COLUMN `receiveId` INTEGER NOT NULL,
    ADD COLUMN `senderId` INTEGER NOT NULL,
    ADD COLUMN `senderName` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    MODIFY `createdBy` VARCHAR(191) NULL,
    MODIFY `updatedBy` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_receiveId_fkey` FOREIGN KEY (`receiveId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
