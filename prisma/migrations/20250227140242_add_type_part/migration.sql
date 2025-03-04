-- AlterTable
ALTER TABLE `Product` ADD COLUMN `partType` ENUM('ENGINE', 'TRANSMISSION', 'BRAKE_SYSTEM', 'SUSPENSION', 'ELECTRICAL', 'COOLING_SYSTEM', 'FUEL_SYSTEM', 'EXHAUST_SYSTEM', 'BODY_PARTS', 'INTERIOR', 'EXTERIOR', 'TIRES_WHEELS', 'LIGHTING', 'FILTERS', 'BELTS', 'BATTERIES', 'STEERING', 'AIR_CONDITIONING', 'SAFETY', 'OTHERS') NOT NULL DEFAULT 'OTHERS';
