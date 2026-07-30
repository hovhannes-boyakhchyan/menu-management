import { createZodDto } from 'nestjs-zod';
import { GetFolderContentQuerySchema } from '@bringit/contracts';

export class FolderContentQueryDto extends createZodDto(
  GetFolderContentQuerySchema,
) {}
