import { createZodDto } from 'nestjs-zod';
import { ToggleLocationDisabledTemplateResponseSchema } from '@bringit/contracts';

export class ToggleLocationDisabledTemplateResponseDto extends createZodDto(
  ToggleLocationDisabledTemplateResponseSchema,
) {}
