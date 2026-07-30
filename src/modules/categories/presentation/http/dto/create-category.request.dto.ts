import { createZodDto } from 'nestjs-zod';
import { CreateCategorySchema } from '@bringit/contracts';

export class CreateCategoryRequestDto extends createZodDto(
  CreateCategorySchema,
) {}
