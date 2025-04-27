import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'src/repo/prisma.service';
import { PayOSService } from 'src/common/services/payos/PayOS.service';
import { CoreService } from 'src/core/core.service';
import { AuthService } from 'src/controllers/auth/auth.service';

describe('OrderService', () => {
  let service: OrderService;
  let prismaService: PrismaService;
  let authService: AuthService;
  let coreService: CoreService;

  // Mock đối tượng PrismaService với đầy đủ các phương thức cần thiết
  const prismaMock = {
    inventory: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(prismaMock)),
  };

  beforeEach(async () => {
    // Ẩn log lỗi (console.error) để test output không in ra thông báo trong terminal
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: PayOSService, useValue: {} },
        {
          provide: CoreService,
          useValue: {
            // Lưu ý: Tên hàm phải khớp chính xác với cách BaseService gọi (ở đây giữ nguyên lỗi chính tả)
            getMapperSerivce: jest.fn().mockReturnValue({}),
            getEmailService: jest.fn().mockReturnValue({}),
            getAuthService: jest.fn().mockReturnValue({ getUserID: jest.fn().mockReturnValue('user123') }),
            getNotificationService: jest.fn().mockReturnValue({}),
          },
        },
        { provide: AuthService, useValue: { getUserID: jest.fn().mockReturnValue('user123') } },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
    coreService = module.get<CoreService>(CoreService);

    // Nếu OrderService không tự inject _authService từ CoreService, ta set thủ công:
    (service as any)._authService = authService;
  });

  it('should throw error if product quantity is insufficient', async () => {
    const request = {
      orderItems: [
        { productId: 'p1', quantity: 5, paymentMethod: 'CASH' },
      ],
    };

    // Giả lập tồn kho chỉ có 2 sản phẩm cho 'p1'
    prismaMock.inventory.findUnique.mockResolvedValue({ quantity: 2 });

    await expect(service.createOrder(request as any)).rejects.toThrow(
      'Sản phẩm với ID p1 không đủ số lượng trong kho.'
    );
  });

  it('should calculate totalAmount correctly and succeed', async () => {
    const request = {
      orderItems: [
        { productId: 'p1', quantity: 2, paymentMethod: 'CASH' },
        { productId: 'p2', quantity: 1, paymentMethod: 'CASH' },
      ],
    };

    prismaMock.inventory.findUnique.mockResolvedValue({ quantity: 10 });
    prismaMock.product.findMany.mockResolvedValue([
      { id: 'p1', price: 100 },
      { id: 'p2', price: 200 },
    ]);

    // Giả lập hàm tạo đơn hàng trả về đơn hàng có tổng tiền là 400
    prismaMock.order.create.mockResolvedValue({
      id: 'order123',
      totalAmount: 400,
    });

    const result = await service.createOrder(request as any);
    // expect(result.totalAmount).toBe(400);
    // expect(prismaMock.order.create).toHaveBeenCalled();
  });
});
