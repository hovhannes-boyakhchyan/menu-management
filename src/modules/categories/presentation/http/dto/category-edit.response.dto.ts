import { createZodDto } from 'nestjs-zod';
import { CategoryEditResponseSchema } from '@bringit/contracts';

export class CategoryEditResponseDto extends createZodDto(
  CategoryEditResponseSchema,
) {}
