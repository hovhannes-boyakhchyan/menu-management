import { createZodDto } from 'nestjs-zod';
import { SaveCategoryItemsSchema } from '@bringit/contracts';

export class SaveCategoryItemsRequestDto extends createZodDto(
  SaveCategoryItemsSchema,
) {}
