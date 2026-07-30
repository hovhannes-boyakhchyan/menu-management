import { createZodDto } from 'nestjs-zod';
import { UpdateProductSchema } from '@bringit/contracts';

export class UpdateProductRequestDto extends createZodDto(
  UpdateProductSchema,
) {}
