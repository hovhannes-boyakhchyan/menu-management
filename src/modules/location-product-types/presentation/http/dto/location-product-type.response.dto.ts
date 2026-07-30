import { createZodDto } from 'nestjs-zod';
import { LocationProductTypeResponseSchema } from '@bringit/contracts';

export class LocationProductTypeResponseDto extends createZodDto(
  LocationProductTypeResponseSchema,
) {}
