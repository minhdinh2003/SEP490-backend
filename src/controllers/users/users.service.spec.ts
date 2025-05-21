import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { ServiceResponse } from 'src/model/response/service.response';
import { PageRequest } from 'src/model/request/page.request';
import { UserEntity } from 'src/model/entity/user.entity';
import { UserDetail } from 'src/model/dto/user.dto';
import { UsersService } from './users.service';
import { PrismaService } from 'src/repo/prisma.service';
import { CoreService } from 'src/core/core.service';
import { Gender } from '@prisma/client';

// Cập nhật CoreService để bao gồm getFullname trong getAuthService
const mockCoreService = {
  getMapperSerivce: jest.fn().mockReturnValue({
    mapData: jest.fn().mockImplementation((source, sourceType, targetType) => source),
  }),
  getEmailService: jest.fn().mockReturnValue({
    sendEmail: jest.fn().mockResolvedValue(true),
  }),
  getAuthService: jest.fn().mockReturnValue({
    getUserID: jest.fn().mockReturnValue('user-123'),
    getFullname: jest.fn().mockReturnValue('Test Auth'),
  }),
  getNotificationService: jest.fn().mockReturnValue({}),
};

const mockPrisma = {
  userRepo: {
    findByEmail: jest.fn(),
    findOneWithCondition: jest.fn(),
  },
  notificationRepo: {
    getPaging: jest.fn(),
  },
  notification: {
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let coreService: CoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CoreService, useValue: mockCoreService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    coreService = module.get<CoreService>(CoreService);

    // Override các phương thức của BaseService được sử dụng trong UsersService.
    (service as any).repository = {
      create: jest.fn().mockResolvedValue({ id: 100 }),
      update: jest.fn().mockResolvedValue(true),
    };
    (service as any).getOneAndReference = jest.fn().mockResolvedValue({
      id: 100,
      email: 'test@example.com',
      fullName: 'Test User',
      gender: Gender.MALE,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '',
      updatedBy: '',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should add a new user and send email when email does not exist', async () => {
      // Giả lập findByEmail trả về null (không tồn tại user)
      mockPrisma.userRepo.findByEmail.mockResolvedValue(null);

      const testUser: UserEntity = {
        id: 0,
        email: 'test@example.com',
        passwordHash: '',
        role: 'USER',
        fullName: 'Test User',
        gender: Gender.MALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      };

      // Theo code mẫu, mật khẩu được ép thành "12345678"
      const generatedPassword = "12345678";

      const userId = await service.add(testUser);

      expect(mockPrisma.userRepo.findByEmail).toHaveBeenCalledWith(testUser.email);
      expect((service as any).repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: testUser.email,
          passwordHash: expect.any(String),
        }),
        { select: { id: true } },
        expect.any(Object)
      );
      expect(coreService.getEmailService().sendEmail).toHaveBeenCalledWith(
        testUser.email,
        "Quản trị đã tạo tài khoản cho bạn",
        "AdminCreateAccountForStudent.html",
        expect.objectContaining({
          userName: testUser.email,
          passWord: generatedPassword,
        })
      );
      expect(userId).toBe(100);
    });

    it('should include auth fullname in extra create data when adding user', async () => {
      mockPrisma.userRepo.findByEmail.mockResolvedValue(null);

      const testUser: UserEntity = {
        id: 0,
        email: 'new@example.com',
        passwordHash: '',
        role: 'USER',
        fullName: 'New User',
        gender: Gender.MALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      };

      await service.add(testUser);

      const extraData = (service as any).repository.create.mock.calls[0][2];
      expect(extraData).toMatchObject({ createdBy: 'Test Auth', updatedBy: 'Test Auth' });
    });

    // *** Các test case bổ sung cho trường hợp invalid/null ***
    it('should throw error if required field email is null when adding user', async () => {
      const testUser: UserEntity = {
        id: 0,
        email: null as any, // Email không hợp lệ
        passwordHash: '',
        role: 'USER',
        fullName: 'Test User',
        gender: Gender.MALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      };

      // Giả lập findByEmail ném lỗi khi nhận giá trị email không hợp lệ
      mockPrisma.userRepo.findByEmail.mockImplementation(() => {
        throw new Error('Invalid email');
      });
      await expect(service.add(testUser)).rejects.toThrow('Invalid email');
    });
  });

  describe('update', () => {
    it('should update user when email is not taken by another user', async () => {
      mockPrisma.userRepo.findOneWithCondition.mockResolvedValue(null);

      const updateData: Partial<UserEntity> = {
        email: 'newemail@example.com',
      };

      const result = await service.update(100, updateData);

      expect(mockPrisma.userRepo.findOneWithCondition).toHaveBeenCalledWith({
        id: { not: 100 },
        email: updateData.email,
      });
      expect((service as any).repository.update).toHaveBeenCalledWith(100, updateData, expect.any(Object));
      expect(result).toBe(true);
    });

    it('should include auth fullname in extra update data when updating user', async () => {
      mockPrisma.userRepo.findOneWithCondition.mockResolvedValue(null);

      const updateData: Partial<UserEntity> = { email: 'update@example.com' };

      await service.update(100, updateData);

      const extraData = (service as any).repository.update.mock.calls[0][2];
      expect(extraData).toMatchObject({ updatedBy: 'Test Auth' });
    });

    // *** Các test case bổ sung cho trường hợp invalid/null ***
    it('should throw error if required field email is null when updating user', async () => {
      const updateData: Partial<UserEntity> = {
        email: null as any,
      };

      // Giả lập findOneWithCondition ném lỗi khi nhận email không hợp lệ
      mockPrisma.userRepo.findOneWithCondition.mockImplementation(() => {
        throw new Error('Invalid email');
      });
      await expect(service.update(100, updateData)).rejects.toThrow('Invalid email');
    });

    it('should throw HttpException if email already exists on another user', async () => {
      mockPrisma.userRepo.findOneWithCondition.mockResolvedValue({
        id: 200,
        email: 'newemail@example.com',
        passwordHash: 'xxx',
        role: 'USER',
        fullName: 'Another User',
        gender: Gender.FEMALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      });
      const updateData: Partial<UserEntity> = { email: 'newemail@example.com' };

      await expect(service.update(100, updateData)).rejects.toThrow(HttpException);
      await expect(service.update(100, updateData)).rejects.toThrow('Email đã tồn tại');
    });
  });

  describe('getCurrentUser', () => {
    it('should call getUserID from auth service and return current user wrapped in ServiceResponse', async () => {
      const authService = coreService.getAuthService();
      const getUserIDSpy = jest.spyOn(authService, 'getUserID');

      const fakeUser = {
        id: 100,
        email: 'test@example.com',
        fullName: 'Test User',
        gender: Gender.MALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      };
      (service as any).getOneAndReference.mockResolvedValue(fakeUser);

      const response: ServiceResponse = await service.getCurrentUser();

      expect(getUserIDSpy).toHaveBeenCalled();
      expect(coreService.getMapperSerivce().mapData).toHaveBeenCalledWith(
        fakeUser,
        expect.any(Function),
        expect.any(Function)
      );
      expect(response.success).toBe(true);
      expect(response.data).toEqual(fakeUser);
    });

    it('should throw error if current user is not found', async () => {
      (service as any).getOneAndReference.mockResolvedValue(null);

      await expect(service.getCurrentUser()).rejects.toThrow(HttpException);
      await expect(service.getCurrentUser()).rejects.toThrow('User not exist');
    });
  });

  describe('getNotification', () => {
    it('should return notifications from notificationRepo', async () => {
      const pageRequest: PageRequest = { pageNumber: 1, pageSize: 10, includeReferences: {} };
      const mockPagingData = { data: [], total: 0 };
      mockPrisma.notificationRepo.getPaging.mockResolvedValue(mockPagingData);

      const result = await service.getNotification(pageRequest);

      expect(mockPrisma.notificationRepo.getPaging).toHaveBeenCalledWith(pageRequest, false);
      expect(result).toEqual(mockPagingData);
    });
  });

  describe('updateViewNotification', () => {
    it('should update notification as viewed and return true', async () => {
      mockPrisma.notification.update.mockResolvedValue({ id: 5, isViewed: true });

      const result = await service.updateViewNotification(5);

      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 5 },
        data: { isViewed: true },
      });
      expect(result).toBe(true);
    });
  });
});
