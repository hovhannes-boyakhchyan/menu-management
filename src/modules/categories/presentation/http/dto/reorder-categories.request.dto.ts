import { createZodDto } from 'nestjs-zod';
import { ReorderCategoriesSchema } from '@bringit/contracts';

export class ReorderCategoriesRequestDto extends createZodDto(
  ReorderCategoriesSchema,
) {}
