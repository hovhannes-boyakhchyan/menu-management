import { ConfigService } from '@nestjs/config';

export interface ImageKitConfig {
  privateKey: string;
  env: string;
}

export const getImageKitConfig = (
  configService: ConfigService,
): ImageKitConfig => ({
  privateKey: configService.getOrThrow<string>('IMAGEKIT_PRIVATE_KEY'),
  env: configService.getOrThrow<string>('NODE_ENV'),
});

export const buildImageKitFolder = (config: ImageKitConfig): string =>
  `/${config.env}/uploads`;
