import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  COMMON_ERRORS,
  type UploadImageResponse,
  UploadImageFormRequestSchema,
} from '@bringit/contracts';
import { ZodValidationPipe } from '../../../../../infrastructure/http/pipes';
import { UploadImageRequestDto } from '../dto';
import { ImageUploadService } from '../../../aplication/services';
@Controller('image')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile()
    file: {
      buffer: Buffer;
      mimetype: string;
    },
    @Body(new ZodValidationPipe({ schema: UploadImageFormRequestSchema }))
    body: UploadImageRequestDto,
  ): Promise<UploadImageResponse> {
    if (!file) {
      throw new BadRequestException(COMMON_ERRORS.FILE_REQUIRED);
    }

    const { name } = body;

    const result = await this.imageUploadService.uploadImage({
      buffer: file.buffer,
      mimeType: file.mimetype,
      name,
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  }

  @Delete(':fileId')
  @HttpCode(HttpStatus.OK)
  async removeImage(@Param('fileId') fileId: string): Promise<void> {
    await this.imageUploadService.removeImage(fileId);
  }
}
