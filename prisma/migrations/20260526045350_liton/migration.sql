-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `passwordHash` VARCHAR(255) NULL,
    `image` VARCHAR(500) NULL,
    `position` VARCHAR(120) NULL,
    `phone` VARCHAR(60) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `lastLoginAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `roleId` CHAR(36) NOT NULL,
    `areaId` CHAR(36) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_roleId_idx`(`roleId`),
    INDEX `User_areaId_idx`(`areaId`),
    INDEX `User_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` CHAR(36) NOT NULL,
    `code` ENUM('ADMIN', 'ASSISTENTIAL_STAFF', 'SAFETY_COMMITTEE', 'BIOMEDICAL_ENGINEERING', 'COORDINATOR') NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `description` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` CHAR(36) NOT NULL,
    `key` VARCHAR(120) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `module` VARCHAR(80) NOT NULL,
    `description` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Permission_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `roleId` CHAR(36) NOT NULL,
    `permissionId` CHAR(36) NOT NULL,

    PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(140) NOT NULL,
    `description` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Area_name_key`(`name`),
    INDEX `Area_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(140) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `areaId` CHAR(36) NOT NULL,

    INDEX `Service_deletedAt_idx`(`deletedAt`),
    UNIQUE INDEX `Service_areaId_name_key`(`areaId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncidentReport` (
    `id` CHAR(36) NOT NULL,
    `code` VARCHAR(40) NOT NULL,
    `type` ENUM('INCIDENT', 'ADVERSE_EVENT', 'SENTINEL_EVENT', 'NEAR_MISS') NOT NULL,
    `status` ENUM('REPORTED', 'IN_ANALYSIS', 'IN_FOLLOW_UP', 'CLOSED', 'REOPENED') NOT NULL DEFAULT 'REPORTED',
    `reportType` ENUM('FIRST_TIME', 'FOLLOW_UP') NOT NULL DEFAULT 'FIRST_TIME',
    `notificationDate` DATETIME(3) NOT NULL,
    `institutionName` VARCHAR(180) NOT NULL,
    `institutionLevel` VARCHAR(80) NULL,
    `city` VARCHAR(120) NOT NULL,
    `department` VARCHAR(120) NOT NULL,
    `measuresTaken` BOOLEAN NOT NULL DEFAULT false,
    `measuresDescription` TEXT NULL,
    `eventDate` DATETIME(3) NOT NULL,
    `detailedDescription` TEXT NOT NULL,
    `primaryDiagnosis` TEXT NULL,
    `causeDetected` BOOLEAN NOT NULL DEFAULT false,
    `causeDescription` TEXT NULL,
    `patientWeightKg` DECIMAL(6, 2) NULL,
    `physicalCondition` TEXT NULL,
    `relevantPathologies` TEXT NULL,
    `clinicalObservations` TEXT NULL,
    `devicePhysicalFeatures` TEXT NULL,
    `additionalCorrectiveActions` TEXT NULL,
    `digitalSignature` TEXT NULL,
    `submittedAt` DATETIME(3) NULL,
    `closedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `reportedById` CHAR(36) NOT NULL,
    `areaId` CHAR(36) NULL,
    `serviceId` CHAR(36) NULL,
    `biomedicalEquipmentId` CHAR(36) NULL,

    UNIQUE INDEX `IncidentReport_code_key`(`code`),
    INDEX `IncidentReport_status_type_idx`(`status`, `type`),
    INDEX `IncidentReport_eventDate_idx`(`eventDate`),
    INDEX `IncidentReport_notificationDate_idx`(`notificationDate`),
    INDEX `IncidentReport_areaId_idx`(`areaId`),
    INDEX `IncidentReport_serviceId_idx`(`serviceId`),
    INDEX `IncidentReport_reportedById_idx`(`reportedById`),
    INDEX `IncidentReport_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatientInfo` (
    `id` CHAR(36) NOT NULL,
    `patientInitials` VARCHAR(12) NOT NULL,
    `identificationNumber` VARCHAR(80) NULL,
    `age` INTEGER NULL,
    `sex` ENUM('FEMALE', 'MALE', 'OTHER', 'UNDISCLOSED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `incidentReportId` CHAR(36) NOT NULL,

    UNIQUE INDEX `PatientInfo_incidentReportId_key`(`incidentReportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceInfo` (
    `id` CHAR(36) NOT NULL,
    `genericName` VARCHAR(180) NOT NULL,
    `commercialName` VARCHAR(180) NULL,
    `manufacturer` VARCHAR(180) NULL,
    `lotOrSerialNumber` VARCHAR(140) NULL,
    `modelReference` VARCHAR(140) NULL,
    `brand` VARCHAR(140) NULL,
    `sanitaryRegistration` VARCHAR(140) NULL,
    `softwareVersion` VARCHAR(80) NULL,
    `distributorImporter` VARCHAR(180) NULL,
    `operatingArea` VARCHAR(180) NULL,
    `reportedToManufacturer` BOOLEAN NOT NULL DEFAULT false,
    `additionalNote` TEXT NULL,
    `associatedAccessories` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `incidentReportId` CHAR(36) NOT NULL,

    UNIQUE INDEX `DeviceInfo_incidentReportId_key`(`incidentReportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReporterInfo` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `profession` VARCHAR(140) NOT NULL,
    `address` VARCHAR(220) NULL,
    `phone` VARCHAR(60) NULL,
    `email` VARCHAR(190) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `incidentReportId` CHAR(36) NOT NULL,

    UNIQUE INDEX `ReporterInfo_incidentReportId_key`(`incidentReportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncidentOutcome` (
    `id` CHAR(36) NOT NULL,
    `key` VARCHAR(80) NOT NULL,
    `label` VARCHAR(180) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `incidentReportId` CHAR(36) NOT NULL,

    UNIQUE INDEX `IncidentOutcome_incidentReportId_key_key`(`incidentReportId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RootCauseAnalysis` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `conclusion` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `incidentReportId` CHAR(36) NOT NULL,
    `createdById` CHAR(36) NULL,

    INDEX `RootCauseAnalysis_incidentReportId_idx`(`incidentReportId`),
    INDEX `RootCauseAnalysis_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IshikawaCategory` (
    `id` CHAR(36) NOT NULL,
    `category` VARCHAR(80) NOT NULL,
    `description` TEXT NULL,
    `contributingFactors` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `rootCauseAnalysisId` CHAR(36) NOT NULL,

    UNIQUE INDEX `IshikawaCategory_rootCauseAnalysisId_category_key`(`rootCauseAnalysisId`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FiveWhy` (
    `id` CHAR(36) NOT NULL,
    `sequence` INTEGER NOT NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `rootCauseAnalysisId` CHAR(36) NOT NULL,

    UNIQUE INDEX `FiveWhy_rootCauseAnalysisId_sequence_key`(`rootCauseAnalysisId`, `sequence`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SafetyAction` (
    `id` CHAR(36) NOT NULL,
    `type` ENUM('CORRECTIVE', 'PREVENTIVE') NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `dueDate` DATETIME(3) NOT NULL,
    `completedAt` DATETIME(3) NULL,
    `evidenceNotes` TEXT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `incidentReportId` CHAR(36) NOT NULL,
    `assigneeId` CHAR(36) NULL,
    `createdById` CHAR(36) NOT NULL,

    INDEX `SafetyAction_status_dueDate_idx`(`status`, `dueDate`),
    INDEX `SafetyAction_assigneeId_idx`(`assigneeId`),
    INDEX `SafetyAction_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BiomedicalEquipment` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(180) NOT NULL,
    `brand` VARCHAR(140) NULL,
    `model` VARCHAR(140) NULL,
    `serial` VARCHAR(140) NULL,
    `manufacturer` VARCHAR(180) NULL,
    `manufactureYear` INTEGER NULL,
    `location` VARCHAR(180) NOT NULL,
    `status` ENUM('ACTIVE', 'IN_MAINTENANCE', 'OUT_OF_SERVICE', 'RETIRED') NOT NULL DEFAULT 'ACTIVE',
    `lastMaintenanceAt` DATETIME(3) NULL,
    `nextMaintenanceAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `areaId` CHAR(36) NULL,

    UNIQUE INDEX `BiomedicalEquipment_serial_key`(`serial`),
    INDEX `BiomedicalEquipment_status_idx`(`status`),
    INDEX `BiomedicalEquipment_areaId_idx`(`areaId`),
    INDEX `BiomedicalEquipment_nextMaintenanceAt_idx`(`nextMaintenanceAt`),
    INDEX `BiomedicalEquipment_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maintenance` (
    `id` CHAR(36) NOT NULL,
    `type` ENUM('PREVENTIVE', 'CORRECTIVE', 'CALIBRATION', 'VALIDATION') NOT NULL,
    `performedAt` DATETIME(3) NOT NULL,
    `nextDueAt` DATETIME(3) NULL,
    `provider` VARCHAR(180) NULL,
    `description` TEXT NOT NULL,
    `result` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `biomedicalEquipmentId` CHAR(36) NOT NULL,

    INDEX `Maintenance_performedAt_idx`(`performedAt`),
    INDEX `Maintenance_nextDueAt_idx`(`nextDueAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evidence` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `description` TEXT NULL,
    `fileUrl` VARCHAR(500) NOT NULL,
    `mimeType` VARCHAR(120) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `incidentReportId` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` CHAR(36) NOT NULL,
    `fileName` VARCHAR(220) NOT NULL,
    `fileUrl` VARCHAR(500) NOT NULL,
    `mimeType` VARCHAR(120) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `incidentReportId` CHAR(36) NULL,
    `safetyActionId` CHAR(36) NULL,

    INDEX `Attachment_incidentReportId_idx`(`incidentReportId`),
    INDEX `Attachment_safetyActionId_idx`(`safetyActionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncidentTimeline` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('REPORTED', 'IN_ANALYSIS', 'IN_FOLLOW_UP', 'CLOSED', 'REOPENED') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `incidentReportId` CHAR(36) NOT NULL,
    `createdById` CHAR(36) NULL,

    INDEX `IncidentTimeline_incidentReportId_createdAt_idx`(`incidentReportId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncidentChangeLog` (
    `id` CHAR(36) NOT NULL,
    `field` VARCHAR(120) NOT NULL,
    `oldValue` TEXT NULL,
    `newValue` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `incidentReportId` CHAR(36) NOT NULL,
    `changedById` CHAR(36) NULL,

    INDEX `IncidentChangeLog_incidentReportId_createdAt_idx`(`incidentReportId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` CHAR(36) NOT NULL,
    `type` ENUM('INCIDENT_CREATED', 'STATUS_CHANGED', 'ACTION_DUE', 'ACTION_OVERDUE', 'SYSTEM') NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `message` TEXT NOT NULL,
    `readAt` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` CHAR(36) NOT NULL,

    INDEX `Notification_userId_readAt_idx`(`userId`, `readAt`),
    INDEX `Notification_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` CHAR(36) NOT NULL,
    `action` VARCHAR(120) NOT NULL,
    `entity` VARCHAR(120) NOT NULL,
    `entityId` CHAR(36) NULL,
    `ipAddress` VARCHAR(80) NULL,
    `userAgent` VARCHAR(500) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` CHAR(36) NULL,

    INDEX `AuditLog_entity_entityId_idx`(`entity`, `entityId`),
    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Indicator` (
    `id` CHAR(36) NOT NULL,
    `key` VARCHAR(120) NOT NULL,
    `name` VARCHAR(180) NOT NULL,
    `value` DECIMAL(12, 2) NOT NULL,
    `periodStart` DATETIME(3) NOT NULL,
    `periodEnd` DATETIME(3) NOT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Indicator_key_key`(`key`),
    INDEX `Indicator_periodStart_periodEnd_idx`(`periodStart`, `periodEnd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` CHAR(36) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentReport` ADD CONSTRAINT `IncidentReport_reportedById_fkey` FOREIGN KEY (`reportedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentReport` ADD CONSTRAINT `IncidentReport_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentReport` ADD CONSTRAINT `IncidentReport_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentReport` ADD CONSTRAINT `IncidentReport_biomedicalEquipmentId_fkey` FOREIGN KEY (`biomedicalEquipmentId`) REFERENCES `BiomedicalEquipment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientInfo` ADD CONSTRAINT `PatientInfo_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeviceInfo` ADD CONSTRAINT `DeviceInfo_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReporterInfo` ADD CONSTRAINT `ReporterInfo_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentOutcome` ADD CONSTRAINT `IncidentOutcome_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RootCauseAnalysis` ADD CONSTRAINT `RootCauseAnalysis_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IshikawaCategory` ADD CONSTRAINT `IshikawaCategory_rootCauseAnalysisId_fkey` FOREIGN KEY (`rootCauseAnalysisId`) REFERENCES `RootCauseAnalysis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FiveWhy` ADD CONSTRAINT `FiveWhy_rootCauseAnalysisId_fkey` FOREIGN KEY (`rootCauseAnalysisId`) REFERENCES `RootCauseAnalysis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SafetyAction` ADD CONSTRAINT `SafetyAction_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SafetyAction` ADD CONSTRAINT `SafetyAction_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SafetyAction` ADD CONSTRAINT `SafetyAction_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BiomedicalEquipment` ADD CONSTRAINT `BiomedicalEquipment_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_biomedicalEquipmentId_fkey` FOREIGN KEY (`biomedicalEquipmentId`) REFERENCES `BiomedicalEquipment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evidence` ADD CONSTRAINT `Evidence_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_safetyActionId_fkey` FOREIGN KEY (`safetyActionId`) REFERENCES `SafetyAction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentTimeline` ADD CONSTRAINT `IncidentTimeline_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentChangeLog` ADD CONSTRAINT `IncidentChangeLog_incidentReportId_fkey` FOREIGN KEY (`incidentReportId`) REFERENCES `IncidentReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
