### uploadthing 
1. Sử dụng nodev20

### Chạy lần đầu: 

npx prisma migrate deploy

### Migration data

npx prisma migrate dev --name your_migration_name


INSERT INTO User ( fullName, email, passwordHash, role, gender, dateOfBirth, phoneNumber, addressLine1, addressLine2, city, state, country, createdAt, updatedAt, profilePictureURL, createdBy, updatedBy)
VALUES ( 'Admin', 'admin@gmail.com', '$2b$10$SQWXM89rPw9KW.XU95y6KuddKr0cVbpMyhJxVk7vyuiIvTpyy4Vka', 'ADMIN', 'MALE', NOW(), '', '', '', '', '', '', NOW(), NOW(), '', '', '');



ALTER TABLE `Whitelist`
DROP INDEX `Whitelist_userId_key`,
DROP INDEX `Whitelist_productId_key`;