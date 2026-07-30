import { createZodDto } from 'nestjs-zod';
import { IconsResponseSchema } from '@bringit/contracts';

export class IconsResponseDto extends createZodDto(IconsResponseSchema) {}
