import { createZodDto } from 'nestjs-zod';
import { FolderSchema } from '@bringit/contracts';

export class FolderResponseDto extends createZodDto(FolderSchema) {}
