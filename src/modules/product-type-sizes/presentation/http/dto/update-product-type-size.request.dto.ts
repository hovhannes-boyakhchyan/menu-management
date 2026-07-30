import { createZodDto } from 'nestjs-zod';
import { UpdateProductTypeSizeRequestSchema } from '@bringit/contracts';

export class UpdateProductTypeSizeRequestDto extends createZodDto(
  UpdateProductTypeSizeRequestSchema,
) {}
