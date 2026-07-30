import { createZodDto } from 'nestjs-zod';
import { SaveAllLocationProductTypeItemsSchema } from '@bringit/contracts';

export class SaveAllLocationProductTypesRequestDto extends createZodDto(
  SaveAllLocationProductTypeItemsSchema,
) {}
