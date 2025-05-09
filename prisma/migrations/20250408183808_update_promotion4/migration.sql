-- AlterTable
ALTER TABLE `Promotion` ADD COLUMN `voucherQuantity` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `voucherUsed` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Voucher` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Voucher` ADD CONSTRAINT `Voucher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
