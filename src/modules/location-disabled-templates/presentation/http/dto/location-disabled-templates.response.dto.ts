import { createZodDto } from 'nestjs-zod';
import { LocationDisabledTemplatesResponseSchema } from '@bringit/contracts';

export class LocationDisabledTemplatesResponseDto extends createZodDto(
  LocationDisabledTemplatesResponseSchema,
) {}
