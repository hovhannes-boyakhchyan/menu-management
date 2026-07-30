import { createZodDto } from 'nestjs-zod';
import { CatalogTemplateResponseSchema } from '@bringit/contracts';

export class CatalogTemplateResponseDto extends createZodDto(
  CatalogTemplateResponseSchema,
) {}
