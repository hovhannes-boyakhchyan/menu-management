import { createZodDto } from 'nestjs-zod';
import { UpdateComboRequestSchema } from '@bringit/contracts';

export class UpdateComboRequestDto extends createZodDto(
  UpdateComboRequestSchema,
) {}
