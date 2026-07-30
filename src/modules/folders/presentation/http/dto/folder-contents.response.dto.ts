import { createZodDto } from 'nestjs-zod';
import { FolderContentResponseSchema } from '@bringit/contracts';

export class FolderContentResponseDto extends createZodDto(
  FolderContentResponseSchema,
) {}
