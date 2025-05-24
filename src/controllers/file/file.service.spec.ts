import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from 'src/controllers/file/files.service';
import { PrismaService } from 'src/repo/prisma.service';
import { CoreService } from 'src/core/core.service';
import { HttpException } from '@nestjs/common';
import { FileEntity } from 'src/model/entity/file.entity';

// Giả lập _uploadService
const uploadServiceMock = {
  uploadTempFile: jest.fn(),
  deleteFiles: jest.fn(),
};

// Giả lập CoreService đầy đủ
const coreServiceMock = {
  getUploadFileService: jest.fn().mockReturnValue(uploadServiceMock),
  getMapperSerivce: jest.fn().mockReturnValue({}),
  getEmailService: jest.fn().mockReturnValue({}),
  getNotificationService: jest.fn().mockReturnValue({}),
  getAuthService: jest.fn().mockReturnValue({
    getUserID: jest.fn().mockReturnValue('user123'),
    getFullname: jest.fn().mockReturnValue('Test User'),
  }),
};

// Giả lập PrismaService (nếu có dùng, chẳng hạn để tạo repository)
const prismaServiceMock = {
  getModelByType: jest.fn().mockReturnValue({}),
  createRepo: jest.fn().mockReturnValue({
    findMany: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
  }),
};

describe('FileService', () => {
  let service: FileService;

  const fakeMulterFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: 1024,
    buffer: Buffer.from('dummy file content'),
    stream: undefined as any,
    destination: '',
    filename: '',
    path: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: CoreService, useValue: coreServiceMock },
      ],
    }).compile();

    service = module.get<FileService>(FileService);

    // Thiết lập repository với các hàm create và deleteByIds
    (service as any).repository = {
      create: jest.fn().mockResolvedValue({ id: 123 }),
      deleteByIds: jest.fn().mockResolvedValue(undefined),
    };

    // Override các hàm getMany và updateMany, chúng sẽ được sử dụng trong các test case dưới đây.
    service.getMany = jest.fn();
    service.updateMany = jest.fn();

    // Gán các service phụ trợ (_uploadService, _authService)
    (service as any)._uploadService = uploadServiceMock;
    (service as any)._authService = coreServiceMock.getAuthService();
  });

  describe('uploadFile', () => {
    it('should upload file, save info to DB and return FileEntity with new id', async () => {
      const uploadResponse = [
        {
          data: {
            key: 'key123',
            url: 'http://example.com/file',
            appUrl: 'http://app.example.com/file',
            name: 'test.txt',
            type: 'text/plain',
            size: 1024,
          },
        },
      ];

      uploadServiceMock.uploadTempFile.mockResolvedValue(uploadResponse);

      const result = await service.uploadFile(fakeMulterFile, 'CourseMaterial');

    //  expect(uploadServiceMock.uploadTempFile).toHaveBeenCalledWith(fakeMulterFile);
      // add sẽ được gọi nội bộ và repository.create đã được mock
      expect((service as any).repository.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 123,
        fileKey: 'key123',
        fileUrl: 'http://example.com/file',
        appUrl: 'http://app.example.com/file',
        fileName: 'test.txt',
        fileType: 'text/plain',
        fileSize: 1024,
        isTemp: true,
        associatedTableType: 'CourseMaterial',
        associatedTableId: 0,
      });
    });
  });


});
