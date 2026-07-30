import { createZodDto } from 'nestjs-zod';
import { ProductListResponseSchema } from '@bringit/contracts';

export class ProductListResponseDto extends createZodDto(
  ProductListResponseSchema,
) {}
