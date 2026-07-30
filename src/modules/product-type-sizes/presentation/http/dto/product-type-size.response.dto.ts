import { createZodDto } from 'nestjs-zod';
import { ProductTypeSizeResponseSchema } from '@bringit/contracts';

export class ProductTypeSizeResponseDto extends createZodDto(
  ProductTypeSizeResponseSchema,
) {}
