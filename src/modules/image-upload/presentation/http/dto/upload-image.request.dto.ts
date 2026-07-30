import { createZodDto } from 'nestjs-zod';
import { UploadImageFormRequestSchema } from '@bringit/contracts';

export class UploadImageRequestDto extends createZodDto(
  UploadImageFormRequestSchema,
) {}
