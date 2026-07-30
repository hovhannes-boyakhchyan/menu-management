import { createZodDto } from 'nestjs-zod';
import { UpdateCategorySchema } from '@bringit/contracts';

export class UpdateCategoryRequestDto extends createZodDto(
  UpdateCategorySchema,
) {}
