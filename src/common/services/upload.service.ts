import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UTApi } from "uploadthing/server";
@Injectable()
export class UploadService {

  private readonly utApi: UTApi;
  UPLOADTHING_TOKEN = "";
  constructor() {
    this.UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN;
    this.utApi = new UTApi();
  }

  private convertMulterFileToFileEsque(file: Express.Multer.File): Blob & { name: string } {
    const blob: Blob & { name: string } = new Blob([file.buffer], { type: file.mimetype }) as any;
    blob.name = file.originalname;
    return blob;
  }

  // Upload file vào thư mục tạm trên UploadThing
  async uploadTempFile(file: Express.Multer.File) {
    const fileEsque = this.convertMulterFileToFileEsque(file);
    try {
      // Gọi hàm uploadFiles từ UTApi
      const response = await this.utApi.uploadFiles([fileEsque]);
      return response;
    } catch (error) {
      throw new HttpException(
        'Failed to upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Xóa file từ UploadThing
  async deleteFiles(fileIds: string[]) {
    try {
      const deleteResponse = await this.utApi.deleteFiles(fileIds);
      if (!deleteResponse.success) {
        throw new Error('Failed to delete file');
      }
      return { success: deleteResponse.success };
    } catch (error) {
      // throw new HttpException(
      //   'Failed to delete file',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
      // region lưu ảnh ở bên mỹ: dẫn tới việc đồng bộ lâu qua các máy chủ. => lúc xóa mà chưa đồng bộ
      // xong thì chưa có
      return true;
    }
  }

}
