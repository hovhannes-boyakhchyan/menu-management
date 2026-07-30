import { createZodDto } from 'nestjs-zod';
import { SearchFolderContentQuerySchema } from '@bringit/contracts';

export class SearchFolderContentQueryDto extends createZodDto(
  SearchFolderContentQuerySchema,
) {}
