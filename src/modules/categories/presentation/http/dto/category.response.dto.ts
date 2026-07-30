import { createZodDto } from 'nestjs-zod';
import { CategoryResponseSchema } from '@bringit/contracts';

export class CategoryResponseDto extends createZodDto(CategoryResponseSchema) {}
