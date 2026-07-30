import { createZodDto } from 'nestjs-zod';
import { IconsQuerySchema } from '@bringit/contracts';

export class IconsQueryDto extends createZodDto(IconsQuerySchema) {}
