-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `OrderHistory` ADD COLUMN `createdBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Promotion` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Review` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Task` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `TaskDetail` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Voucher` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Whitelist` ADD COLUMN `createdBy` VARCHAR(100) NULL,
    ADD COLUMN `updatedBy` VARCHAR(100) NULL;
