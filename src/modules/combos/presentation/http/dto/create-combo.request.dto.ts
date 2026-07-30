import { createZodDto } from 'nestjs-zod';
import { CreateComboRequestSchema } from '@bringit/contracts';

export class CreateComboRequestDto extends createZodDto(
  CreateComboRequestSchema,
) {}
