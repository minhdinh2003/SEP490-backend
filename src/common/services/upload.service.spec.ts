// upload.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { HttpException, HttpStatus } from '@nestjs/common';

// Thiết lập biến môi trường cần thiết
process.env.UPLOADTHING_TOKEN = 'test-token';

// Khai báo các hàm mock trước
const uploadFilesMock = jest.fn();
const deleteFilesMock = jest.fn();

// Định nghĩa UTApiMock dưới dạng function declaration (hoisted)
function UTApiMock() {
  return {
    uploadFiles: uploadFilesMock,
    deleteFiles: deleteFilesMock,
  };
}

// Sau đó, sử dụng UTApiMock trong lệnh jest.mock
jest.mock('uploadthing/server', () => ({
  UTApi: UTApiMock,
}));

describe('UploadService', () => {
  let service: UploadService;

  // Tạo file giả lập theo kiểu Express.Multer.File
  const fakeMulterFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: 4,
    buffer: Buffer.from('test'),
    stream: undefined as any,
    destination: '',
    filename: '',
    path: '',
  };

  beforeEach(async () => {
    // Reset các mock
    uploadFilesMock.mockReset();
    deleteFilesMock.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  describe('uploadTempFile', () => {
    it('should upload file successfully', async () => {
      // Giả lập uploadFiles trả về kết quả thành công
      const uploadResponse = { success: true, fileId: 'file123' };
      uploadFilesMock.mockResolvedValue(uploadResponse);

      const result = await service.uploadTempFile(fakeMulterFile);
      // Kiểm tra rằng hàm uploadFiles được gọi với mảng chứa file convert
      expect(uploadFilesMock).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'test.txt',
          }),
        ]),
      );
      expect(result).toEqual(uploadResponse);
    });

    it('should throw HttpException if upload fails', async () => {
      // Giả lập hàm uploadFiles ném lỗi
      uploadFilesMock.mockRejectedValue(new Error('Upload error'));

      await expect(service.uploadTempFile(fakeMulterFile)).rejects.toThrow(
        new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('deleteFiles', () => {
    it('should return object with success true if deletion is successful', async () => {
      // Giả lập deleteFiles trả về thành công
      deleteFilesMock.mockResolvedValue({ success: true });

      const result = await service.deleteFiles(['file123']);
      expect(deleteFilesMock).toHaveBeenCalledWith(['file123']);
      expect(result).toEqual({ success: true });
    });

    it('should return true if deletion response is unsuccessful', async () => {
      // Nếu deleteFiles trả về success false, hàm ném lỗi và catch sẽ trả về true
      deleteFilesMock.mockResolvedValue({ success: false });

      const result = await service.deleteFiles(['file123']);
      expect(result).toBe(true);
    });

    it('should return true if deleteFiles throws an error', async () => {
      // Nếu deleteFiles ném lỗi, hàm sẽ catch và trả về true
      deleteFilesMock.mockRejectedValue(new Error('Deletion error'));

      const result = await service.deleteFiles(['file123']);
      expect(result).toBe(true);
    });
  });
});
