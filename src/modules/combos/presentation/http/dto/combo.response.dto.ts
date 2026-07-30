import { createZodDto } from 'nestjs-zod';
import { ComboResponseSchema } from '@bringit/contracts';

export class ComboResponseDto extends createZodDto(ComboResponseSchema) {}
