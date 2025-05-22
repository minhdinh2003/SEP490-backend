import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/controllers/auth/auth.service';
import { PrismaService } from 'src/repo/prisma.service';
import { CoreService } from 'src/core/core.service';
import { ServiceResponse } from 'src/model/response/service.response';
import { LoginRequest, ForgotPassswordRequest, ResetPasswordRequest, ChangePasswordRequest } from 'src/model/request';
import { Role } from '@prisma/client';
import { RegisterDto } from '../../model/dto/auth.dto';
// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn((data: string) => Promise.resolve('hashedPassword')),
  compare: jest.fn((plain: string, hash: string) => Promise.resolve(plain === 'validPassword')),
}));

// Mock generateToken
jest.mock('src/utils/token.utils', () => ({
  __esModule: true,
  default: (payload: any) => 'generatedToken',
}));

// Mock generateOtp
jest.mock('src/utils/common.utils', () => ({
  generateOtp: jest.fn(() => '123456'),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let coreService: CoreService;

  // Mở rộng mock cho prismaService với userRepo và otpRepo
  const prismaMock = {
    userRepo: {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      getById: jest.fn(),
      findUnique: jest.fn(),
    },
    otpRepo: {
      findOneWithCondition: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  // Mock cho CoreService với các phương thức cần thiết
  const coreServiceMock = {
    getMapperSerivce: jest.fn().mockReturnValue({
      mapData: jest.fn((data: any) => ({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      })),
    }),
    getEmailService: jest.fn().mockReturnValue({
      sendEmail: jest.fn().mockResolvedValue(true),
    }),
    getAuthService: jest.fn().mockReturnValue({
      getUserID: jest.fn().mockReturnValue('user123'),
    }),
    getNotificationService: jest.fn().mockReturnValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: CoreService, useValue: coreServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    coreService = module.get<CoreService>(CoreService);

    // Nếu AuthService sử dụng _authService và _emailService từ CoreService, đảm bảo các trường này được set:
    (authService as any)._authService = coreServiceMock.getAuthService();
    (authService as any)._emailService = coreServiceMock.getEmailService();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      };

      prismaMock.userRepo.findByEmail.mockResolvedValue(null);
      prismaMock.userRepo.create.mockResolvedValue({
        email: dto.email,
        id: 'user123',
        role: Role.USER,
      });

      const response: ServiceResponse = await authService.register(dto);
      expect(response.success).toBe(true);
      expect(response.data.token).toBe('generatedToken');
      expect(prismaMock.userRepo.create).toHaveBeenCalled();
    });

    it('should throw an error if email already exists', async () => {
        const dto: RegisterDto = {
          email: 'duplicate@example.com',
          password: 'password123',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: '',
          updatedBy: '',
        };
      
        prismaMock.userRepo.findByEmail.mockResolvedValue({ email: dto.email });
        try {
          await authService.register(dto);
          // Nếu không ném ra lỗi, test sẽ thất bại
          fail('Expected HttpException to be thrown');
        } catch (e: any) {
          expect(e.status).toBe(HttpStatus.BAD_REQUEST);
          // Sử dụng getResponse() thay vì e.message
          const errorResponse = e.getResponse();
          expect(errorResponse).toHaveProperty('message', 'Email đã tồn tại');
        }
      });
      
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginPayload: LoginRequest = {
        email: 'test@example.com',
        password: 'validPassword',
      };

      prismaMock.userRepo.findUnique.mockResolvedValue({
        email: loginPayload.email,
        fullName: 'Test User',
        passwordHash: 'hashedPassword',
        role: Role.USER,
        id: 'user123',
      });

      const response: ServiceResponse = await authService.login(loginPayload);
      expect(response.success).toBe(true);
      expect(response.data.token).toBe('generatedToken');
    });

    it('should throw error if credentials are invalid', async () => {
      const loginPayload: LoginRequest = {
        email: 'invalid@example.com',
        password: 'wrongPassword',
      };

      prismaMock.userRepo.findUnique.mockResolvedValue(null);
      await expect(authService.login(loginPayload)).rejects.toThrow(HttpException);
    });
  });

  describe('forgotPassword', () => {
    it('should send OTP email if email exists', async () => {
      const payload: ForgotPassswordRequest = {
        email: 'test@example.com',
      };

      prismaMock.userRepo.findByEmail.mockResolvedValue({ email: payload.email });
      prismaMock.otpRepo.findOneWithCondition.mockResolvedValue(null);
      prismaMock.otpRepo.create.mockResolvedValue(true);

      const response: ServiceResponse = await authService.forgotPassword(payload);
      expect(response.success).toBe(true);
      expect(prismaMock.otpRepo.create).toHaveBeenCalled();
      const emailService = (authService as any)._emailService;
      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should throw error if email is not provided', async () => {
      const payload: ForgotPassswordRequest = { email: '' };
      await expect(authService.forgotPassword(payload)).rejects.toThrow(HttpException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password if OTP is valid', async () => {
      const payload: ResetPasswordRequest = {
        email: 'test@example.com',
        Otp: '123456',
        newPassword: 'newPassword123',
      };

      prismaMock.otpRepo.findOneWithCondition.mockResolvedValue({
        id: 'otp1',
        email: payload.email,
        otp: payload.Otp,
        expiryTime: new Date(Date.now() + 10000),
      });
      prismaMock.userRepo.findByEmail.mockResolvedValue({
        id: 'user123',
        email: payload.email,
        passwordHash: 'oldHashedPassword',
      });
      prismaMock.userRepo.update.mockResolvedValue(true);
      prismaMock.otpRepo.delete.mockResolvedValue(true);

      const response: ServiceResponse = await authService.resetPassword(payload);
      expect(response.success).toBe(true);
    });

    it('should return bad request if OTP is invalid', async () => {
      const payload: ResetPasswordRequest = {
        email: 'test@example.com',
        Otp: '000000',
        newPassword: 'newPassword123',
      };

      prismaMock.otpRepo.findOneWithCondition.mockResolvedValue(null);
      const response: ServiceResponse = await authService.resetPassword(payload);
      expect(response.success).toBe(false);
    });
  });

  describe('changePassword', () => {
    it('should change password if current password is correct', async () => {
      const payload: ChangePasswordRequest = {
        password: 'validPassword',
        newPassword: 'newPassword123',
        // Ép kiểu confirmPassWord sang any để khắc phục lỗi kiểu
        confirmPassWord: 'newPassword123' as any,
      };

      prismaMock.userRepo.getById.mockResolvedValue({
        id: 'user123',
        passwordHash: 'hashedPassword',
      });
      prismaMock.userRepo.update.mockResolvedValue(true);

      const response: ServiceResponse = await authService.changePassword(payload);
      expect(response.success).toBe(true);
    });

    it('should throw error if current password is incorrect', async () => {
      const payload: ChangePasswordRequest = {
        password: 'wrongPassword',
        newPassword: 'newPassword123',
        confirmPassWord: 'newPassword123' as any,
      };

      prismaMock.userRepo.getById.mockResolvedValue({
        id: 'user123',
        passwordHash: 'hashedPassword',
      });

      await expect(authService.changePassword(payload)).rejects.toThrow(HttpException);
    });
  });

  describe('Token Blacklist', () => {
    it('should add token to blacklist and check correctly', () => {
      const token = 'Bearer someToken';
      authService.addTokenToBlacklist(token);
      expect(authService.isTokenBlacklisted('someToken')).toBe(true);
    });
  });
});
