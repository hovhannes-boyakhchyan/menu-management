import { createZodDto } from 'nestjs-zod';
import { ComboListResponseSchema } from '@bringit/contracts';

export class ComboListResponseDto extends createZodDto(
  ComboListResponseSchema,
) {}
