import { createZodDto } from 'nestjs-zod';
import { CatalogTemplateSchema } from '@bringit/contracts';

export class CatalogTemplateEditResponseDto extends createZodDto(
  CatalogTemplateSchema,
) {}
