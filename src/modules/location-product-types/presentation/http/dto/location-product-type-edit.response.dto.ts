import { createZodDto } from 'nestjs-zod';
import { LocationProductTypeSchema } from '@bringit/contracts';

export class LocationProductTypeEditResponseDto extends createZodDto(
  LocationProductTypeSchema,
) {}
