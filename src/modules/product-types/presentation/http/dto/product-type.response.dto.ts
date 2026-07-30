import { createZodDto } from 'nestjs-zod';
import { ProductTypesResponseSchema } from '@bringit/contracts';

export class ProductTypesResponseDto extends createZodDto(
  ProductTypesResponseSchema,
) {}
