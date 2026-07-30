import { createZodDto } from 'nestjs-zod';
import { CreateLocationProductTypeSchema } from '@bringit/contracts';

export class CreateLocationProductTypeRequestDto extends createZodDto(
  CreateLocationProductTypeSchema,
) {}
