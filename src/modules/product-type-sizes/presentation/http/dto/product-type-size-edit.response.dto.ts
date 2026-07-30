import { createZodDto } from 'nestjs-zod';
import { ProductTypeSizeSchema } from '@bringit/contracts';

export class ProductTypeSizeEditResponseDto extends createZodDto(
  ProductTypeSizeSchema,
) {}
