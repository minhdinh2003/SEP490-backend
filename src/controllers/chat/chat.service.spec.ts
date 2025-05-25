// chat.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/repo/prisma.service';
import { CoreService } from 'src/core/core.service';
import { NotificationType } from 'src/common/const/notification.type';
import { ChatEntity } from 'src/model/entity/chat.entity';
import { UserEntity } from 'src/model/entity/user.entity';

// Giả lập đối tượng dummy cho RequestEntity với đầy đủ các thuộc tính cần thiết.
// (Chúng ta ép kiểu sang "any" cho đơn giản)
const dummyRequest: any = {
  id: 1,
  userId: 'user456',
  user: {
    id: 'user456',
    email: 'dummy@test.com',
    passwordHash: 'dummyHash',
    role: 'USER',
    fullName: 'Dummy User',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  description: 'Dummy request description',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: '',
  updatedBy: '',
  status: 'PENDING',
  images: [],
  imageRepairs: [],
  isUserConfirm: false,
  extraProp1: null,
  extraProp2: null,
  extraProp3: null,
  extraProp4: null,
  extraProp5: null,
};

// Giả lập các dependency
const prismaMock = {
  request: {
    findFirst: jest.fn(),
  },
};

const coreServiceMock = {
  getMapperSerivce: jest.fn().mockReturnValue({}),
  getEmailService: jest.fn().mockReturnValue({}),
  getAuthService: jest.fn().mockReturnValue({
    getUserID: jest.fn().mockReturnValue('user123'),
    getFullname: jest.fn().mockReturnValue('Test User'),
  }),
  getNotificationService: jest.fn().mockReturnValue({}),
};

describe('ChatService', () => {
  let service: ChatService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: CoreService, useValue: coreServiceMock },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Nếu ChatService sử dụng _authService từ CoreService, set thủ công:
    (service as any)._authService = coreServiceMock.getAuthService();

    // Overide phương thức "add" trong lớp cha BaseService để trả về 100.
    // Ta truy xuất prototype của lớp cha thông qua:
    const basePrototype = Object.getPrototypeOf(Object.getPrototypeOf(service));
    basePrototype.add = jest.fn().mockResolvedValue(100);

    // Override các phương thức pushNotification và pushNotificationToProductOnwer để theo dõi lời gọi
    (service as any).pushNotification = jest.fn().mockResolvedValue(null);
    (service as any).pushNotificationToProductOnwer = jest.fn().mockResolvedValue(null);
  });

  describe('add', () => {
    // Tạo đối tượng chatEntity đầy đủ các thuộc tính cần thiết theo kiểu ChatEntity
    const chatEntity: ChatEntity = {
      id: 0, // ID sẽ được tạo bởi hệ thống, ta đặt là 0 lúc test
      requestId: 1,
      message: 'Hello',
      senderId: 123,
      sender: {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'dummyHash',
        role: 'USER',
        fullName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserEntity,
      request: dummyRequest,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '',
      updatedBy: '',
      receiveId: 0,
      isNormal: false,
      isRead: false
    };

    it('should call pushNotification if request.userId != current user id', async () => {
      // Giả lập request tìm thấy với userId khác (ví dụ: "user456")
      prismaMock.request.findFirst.mockResolvedValue({ id: 1, userId: 'user456' });

      const id = await service.add(chatEntity);

      expect(id).toBe(100);
      expect((service as any).pushNotification).toHaveBeenCalledWith(
        'user456',
        NotificationType.PRODUCT_OWNER_CHAT_REQUEST,
        JSON.stringify({
          id: 100,
          requestId: 1,
          message: chatEntity.message,
        }),
        'Test User',
        'user123'
      );
      expect((service as any).pushNotificationToProductOnwer).not.toHaveBeenCalled();
    });

    it('should call pushNotificationToProductOnwer if request.userId equals current user id', async () => {
      // Giả lập request tìm thấy với userId bằng người dùng hiện tại (user123)
      prismaMock.request.findFirst.mockResolvedValue({ id: 1, userId: 'user123' });

      const id = await service.add(chatEntity);

      expect(id).toBe(100);
      expect((service as any).pushNotificationToProductOnwer).toHaveBeenCalledWith(
        NotificationType.USER_CHAT_REQUEST,
        JSON.stringify({
          id: 100,
          requestId: 1,
          message: chatEntity.message,
        }),
        'Test User',
        'user123'
      );
      expect((service as any).pushNotification).not.toHaveBeenCalled();
    });
  });
});
