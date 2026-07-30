import { createZodDto } from 'nestjs-zod';
import { UpdateFolderSchema } from '@bringit/contracts';

export class UpdateFolderRequestDto extends createZodDto(UpdateFolderSchema) {}
