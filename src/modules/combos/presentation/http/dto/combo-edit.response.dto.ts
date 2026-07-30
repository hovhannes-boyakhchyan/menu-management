import { createZodDto } from 'nestjs-zod';
import { ComboEditResponseSchema } from '@bringit/contracts';

export class ComboEditResponseDto extends createZodDto(
  ComboEditResponseSchema,
) {}
