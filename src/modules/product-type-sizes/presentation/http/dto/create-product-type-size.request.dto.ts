import { createZodDto } from 'nestjs-zod';
import { CreateProductTypeSizeRequestSchema } from '@bringit/contracts';

export class CreateProductTypeSizeRequestDto extends createZodDto(
  CreateProductTypeSizeRequestSchema,
) {}
