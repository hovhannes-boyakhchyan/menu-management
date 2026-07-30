import { createZodDto } from 'nestjs-zod';
import { ProductEditResponseSchema } from '@bringit/contracts';

export class ProductEditResponseDto extends createZodDto(
  ProductEditResponseSchema,
) {}
