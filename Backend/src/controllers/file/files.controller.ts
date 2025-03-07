import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/auth.guard';
import { CoreService } from 'src/core/core.service';
import { FileService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServiceResponse } from 'src/model/response/service.response';


@ApiTags('Files')
@Controller('api/file')
// @UseGuards(AuthGuard)
export class FilesController {
  constructor(private service: FileService, coreSevice: CoreService) {
  }


  @Post('upload')
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.service.uploadFile(file);
    return ServiceResponse.onSuccess(result);
  }

  @Post('move')
  @ApiBody({ schema: { type: 'object', properties: { fileIds: { type: 'array', items: { type: 'number' } } } } })
  async moveFilesToMain(@Body('fileIds') fileIds: number[]) {
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      throw new HttpException('No file IDs provided', HttpStatus.BAD_REQUEST);
    }
    const result = await this.service.moveFilesToMain(fileIds);
    if (result) {
      return { message: 'Files moved successfully', success: true };
    } else {
      throw new HttpException('Error moving files', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('')
  @ApiBody({ schema: { type: 'object', properties: { fileIds: { type: 'array', items: { type: 'number' } } } } })
  async deleteFiles(@Body('fileIds') fileIds: number[]) {
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      throw new HttpException('No file IDs provided', HttpStatus.BAD_REQUEST);
    }
    const result = await this.service.deleteFiles(fileIds);
    if (result) {
      return { message: 'Files deleted successfully', success: true };
    } else {
      throw new HttpException('Error deleting files', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
