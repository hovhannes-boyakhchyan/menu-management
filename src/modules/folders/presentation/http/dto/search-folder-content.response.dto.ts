import { createZodDto } from 'nestjs-zod';
import { SearchFolderContentResponseSchema } from '@bringit/contracts';

export class SearchFolderContentResponseDto extends createZodDto(
  SearchFolderContentResponseSchema,
) {}
