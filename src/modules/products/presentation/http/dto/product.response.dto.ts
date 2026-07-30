import { createZodDto } from 'nestjs-zod';
import { ProductResponseSchema } from '@bringit/contracts';

export class ProductResponseDto extends createZodDto(ProductResponseSchema) {}
