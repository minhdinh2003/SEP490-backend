-- AlterTable
ALTER TABLE `Product` ADD COLUMN `accidentDetails` TEXT NULL,
    ADD COLUMN `engineCondition` TEXT NULL,
    ADD COLUMN `floodDamageDetails` TEXT NULL,
    ADD COLUMN `insuranceExpiry` DATETIME(3) NULL,
    ADD COLUMN `originalPaintPercentage` INTEGER NULL,
    ADD COLUMN `registrationExpiry` DATETIME(3) NULL,
    ADD COLUMN `transmissionCondition` TEXT NULL;
