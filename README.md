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


INSERT INTO TaskTemplate (title, priority, createdAt, updatedAt)
VALUES
  ('Kiểm tra xe (Tại nhà)', 1, NOW(), NOW()),
  ('Kiểm tra xe (Gara)', 2, NOW(), NOW()),
  ('Báo giá sửa chữa', 3, NOW(), NOW()),
  ('Tiến hành sửa chữa', 4, NOW(), NOW()),
  ('Kiểm tra sau sửa chữa', 5, NOW(), NOW()),
  ('Thanh toán chi phí', 6, NOW(), NOW()),
  ('Giao xe cho khách hàng', 7, NOW(), NOW()),
  ('Khác', 8, NOW(), NOW());


  
INSERT INTO Request (id, userId, description, reasonReject, status, price, approvedId, createdAt, updatedAt, createdBy, updatedBy, repairType, address, completedAt, images, imageRepairs, isUserConfirm, type, isPay) VALUES
(-1, Thay userid, 'Kiểm tra tình trạng xe', '', 'COMPLETED', 2000.00, NULL, '2025-03-30 14:53:33.119', '2025-03-30 15:05:06.787', 'Nguyen van a', 'Thuận Thuận', 'AT_HOME', NULL, NULL, '["https://utfs.io/f/TMOgyLnQ8lVcwkBua23iumJc6lkOMhnoD5IFLGevyXNA829Z"]', '["https://utfs.io/f/TMOgyLnQ8lVcdsW7jUq5OR2MF7fuTL8xQClr1ESsiNckDp4B"]', 1, 'car', 0);
