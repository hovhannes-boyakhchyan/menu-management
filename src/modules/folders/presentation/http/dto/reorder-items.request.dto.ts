import { createZodDto } from 'nestjs-zod';
import { ReorderItemsSchema } from '@bringit/contracts';

export class ReorderItemsRequestDto extends createZodDto(ReorderItemsSchema) {}
