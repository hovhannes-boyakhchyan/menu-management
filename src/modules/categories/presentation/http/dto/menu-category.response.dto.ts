import { createZodDto } from 'nestjs-zod';
import { MenuCategoryResponseSchema } from '@bringit/contracts';

export class MenuCategoryResponseDto extends createZodDto(
  MenuCategoryResponseSchema,
) {}
