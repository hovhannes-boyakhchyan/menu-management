import { createZodDto } from 'nestjs-zod';
import { DeleteItemsSchema } from '@bringit/contracts';

export class DeleteItemsRequestDto extends createZodDto(DeleteItemsSchema) {}
