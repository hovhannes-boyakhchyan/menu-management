import { createZodDto } from 'nestjs-zod';
import { UpdateLocationProductTypeSchema } from '@bringit/contracts';

export class UpdateLocationProductTypeRequestDto extends createZodDto(
  UpdateLocationProductTypeSchema,
) {}
