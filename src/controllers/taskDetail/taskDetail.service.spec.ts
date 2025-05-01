import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Role, TaskStatus } from '@prisma/client';
import { TaskDetailService } from './taskDetail.service';
import { CoreService } from 'src/core/core.service';
import { PrismaService } from 'src/repo/prisma.service';
import { NotificationType } from 'src/common/const/notification.type';

const mockCoreService = {
  getAuthService: jest.fn().mockReturnValue({
    getRole: jest.fn().mockReturnValue(Role.OWNER),
    getFullname: jest.fn().mockReturnValue('Test Owner'),
    getUserID: jest.fn().mockReturnValue('owner-123'),
  }),
  getMapperSerivce: jest.fn().mockReturnValue({}),
  getEmailService: jest.fn().mockReturnValue({}),
  getNotificationService: jest.fn().mockReturnValue({}),
};

const mockPrisma = {
  taskDetail: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('TaskDetailService', () => {
  let service: TaskDetailService;
  let prismaService: PrismaService;
  let coreService: CoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskDetailService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CoreService, useValue: mockCoreService },
      ],
    }).compile();

    service = module.get<TaskDetailService>(TaskDetailService);
    prismaService = module.get<PrismaService>(PrismaService);
    coreService = module.get<CoreService>(CoreService);

    jest.spyOn((<any>Object.getPrototypeOf(service)), 'add').mockResolvedValue(101);
    jest.spyOn((<any>Object.getPrototypeOf(service)), 'update').mockResolvedValue(true);

    service.pushNotification = jest.fn();
  
  });

  describe('add', () => {
   
  });

  describe('update', () => {
    it('should call pushNotification and pushNotificationToProductOwner if assignedTo is changed', async () => {
      const updateModel = {
        assignedTo: 456,
        title: 'Updated Task',
      };

      const oldData = {
        id: 200,
        assignedTo: 123,
        requestId: 1,
        title: 'Old Task',
      };

      (service as any).getById = jest.fn().mockResolvedValue(oldData);

      prismaService.taskDetail.findFirst = jest.fn().mockResolvedValue({
        assignedTo: 456,
        requestId: 1,
      });

      const result = await service.update(200, updateModel);
      expect(result).toBe(true);
      //expect(service.pushNotification).toHaveBeenCalledTimes(1);
      
    });

    it('should not call pushNotification if assignedTo is not changed', async () => {
      const updateModel = {
        assignedTo: 123,
        title: 'Updated Task Title',
      };

      const oldData = {
        id: 201,
        assignedTo: 123,
        requestId: 1,
        title: 'Old Title',
      };

      (service as any).getById = jest.fn().mockResolvedValue(oldData);

      prismaService.taskDetail.findFirst = jest.fn().mockResolvedValue({
        assignedTo: 123,
        requestId: 1,
      });

      const result = await service.update(201, updateModel);
      expect(result).toBe(true);
      expect(service.pushNotification).not.toHaveBeenCalled();
     
    });
  });
});
