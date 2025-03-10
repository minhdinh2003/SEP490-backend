import { HttpException, HttpStatus, HttpVersionNotSupportedException, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { BaseService } from 'src/base/base.service';
import { CoreService } from 'src/core/core.service';
import { FileEntity } from 'src/model/entity/file.entity';
import { PrismaService } from 'src/repo/prisma.service';


@Injectable()
export class FileService extends BaseService<FileEntity, Prisma.FileCreateInput> {
    protected readonly _uploadService;
    constructor(
        coreService: CoreService,
        protected readonly prismaService: PrismaService) {
        super(prismaService, coreService);
        this._uploadService = coreService.getUploadFileService();
        this.setRepo("file");
    }

    async uploadFile(file: Express.Multer.File, tableType: string = "CourseMaterial") {
        var result = await this._uploadService.uploadTempFile(file);
        // Lấy dữ liệu sau khi upload từ response
        const fileData = result[0].data;

        // Lưu thông tin vào database
        const fileEntity = new FileEntity({
            fileKey: fileData.key,
            fileUrl: fileData.url,
            appUrl: fileData.appUrl,
            fileName: fileData.name,
            fileType: fileData.type,
            fileSize: fileData.size,
            isTemp: true,
            associatedTableType: tableType,
            associatedTableId: 0
        });

        var id = await super.add(fileEntity);
        fileEntity.id = id;
        return fileEntity;
    }

    async moveFilesToMain(fileIds: number[]): Promise<boolean> {
        // Tìm các file có trong danh sách fileIds
        const files = await this.getMany({ id: { in: fileIds } });

        if (files.length === 0) {
            throw new HttpException('Files not found', HttpStatus.NOT_FOUND);
        }

        // Cập nhật trường isTemp thành false cho tất cả file trong danh sách
        await this.updateMany({ id: { in: fileIds } }, { isTemp: false });
        return true;
    }

    //to-do: delete chapter, lesson , ....
    async deleteFiles(fileIds: number[]): Promise<boolean> {
        const files = await this.getMany({ id: { in: fileIds } });
        if (!files) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }

        await this._uploadService.deleteFiles(files.map(x => `${x.fileKey}`));
        await this.removeIDs(files.map(x => x.id));
        return true;
    };


}
