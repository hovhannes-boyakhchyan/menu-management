import { Inject, Injectable } from '@nestjs/common';
import { STORAGE_SERVICE } from '../../../../shared/storage/storage.interface';
import type { StorageService } from '../../../../shared/storage/storage.interface';
import { UploadImageResponse } from '@bringit/contracts';

@Injectable()
export class ImageUploadService {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async uploadImage(params: {
    buffer: Buffer;
    mimeType?: string;
    name?: string | null;
  }): Promise<UploadImageResponse> {
    const { buffer, mimeType, name } = params;

    const uploadResult = await this.storageService.uploadImage({
      buffer,
      filename: this.buildProductImageFilename({ name }),
      mimeType,
    });

    return {
      url: uploadResult.url,
      fileId: uploadResult.fileId,
    };
  }

  async removeImage(fileId: string): Promise<void> {
    await this.storageService.deleteImage(fileId);
  }

  private buildProductImageFilename(params: { name?: string | null }): string {
    const { name } = params;
    const safeName =
      name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'product';

    const timestamp = Date.now();
    return `${safeName}-${timestamp}`;
  }
}
