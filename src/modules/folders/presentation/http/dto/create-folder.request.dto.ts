import { createZodDto } from 'nestjs-zod';
import { CreateFolderSchema } from '@bringit/contracts';

export class CreateFolderRequestDto extends createZodDto(CreateFolderSchema) {}
