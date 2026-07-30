import { createZodDto } from 'nestjs-zod';
import { MoveItemsSchema } from '@bringit/contracts';

export class MoveItemsRequestDto extends createZodDto(MoveItemsSchema) {}
