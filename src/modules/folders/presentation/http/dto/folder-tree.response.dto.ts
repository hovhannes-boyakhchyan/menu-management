import { createZodDto } from 'nestjs-zod';
import { FolderTreeResponseSchema } from '@bringit/contracts';

export class FolderTreeResponseDto extends createZodDto(
  FolderTreeResponseSchema,
) {}
