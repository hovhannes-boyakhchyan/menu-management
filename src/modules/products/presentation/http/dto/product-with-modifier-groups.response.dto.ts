import { createZodDto } from 'nestjs-zod';
import { ProductWithModifierGroupsSchema } from '@bringit/contracts';

export class ProductWithModifierGroupsResponseDto extends createZodDto(
  ProductWithModifierGroupsSchema,
) {}
