import { createZodDto } from 'nestjs-zod';
import { CreateProductsRequestSchema } from '@bringit/contracts';

export class CreateProductsRequestDto extends createZodDto(
  CreateProductsRequestSchema,
) {}
