import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateFolderSchema,
  DeleteItemsSchema,
  GetFolderContentQuerySchema,
  MoveItemsSchema,
  SearchFolderContentQuerySchema,
  UpdateFolderSchema,
  ReorderItemsSchema,
} from '@bringit/contracts';
import { ZodValidationPipe } from '../../../../../infrastructure/http/pipes';
import { FoldersService } from '../../../application/services';
import {
  CreateFolderRequestDto,
  DeleteItemsRequestDto,
  FolderContentQueryDto,
  FolderContentResponseDto,
  FolderResponseDto,
  FolderTreeResponseDto,
  MoveItemsRequestDto,
  SearchFolderContentQueryDto,
  SearchFolderContentResponseDto,
  UpdateFolderRequestDto,
  ReorderItemsRequestDto,
} from '../dto';

@Controller('folders')
export class FoldersController {
  constructor(private readonly service: FoldersService) {}

  @Post(':locationId')
  @HttpCode(HttpStatus.CREATED)
  createFolder(
    @Param('locationId') locationId: string,
    @Body(new ZodValidationPipe({ schema: CreateFolderSchema }))
    dto: CreateFolderRequestDto,
  ): Promise<FolderResponseDto> {
    return this.service.createFolder(locationId, dto);
  }

  @Post('move/:locationId')
  @HttpCode(HttpStatus.OK)
  moveItems(
    @Param('locationId') locationId: string,
    @Body(new ZodValidationPipe({ schema: MoveItemsSchema }))
    dto: MoveItemsRequestDto,
  ): Promise<void> {
    return this.service.moveItems(locationId, dto);
  }

  @Post('delete/:locationId')
  @HttpCode(HttpStatus.OK)
  deleteItems(
    @Param('locationId') locationId: string,
    @Body(new ZodValidationPipe({ schema: DeleteItemsSchema }))
    dto: DeleteItemsRequestDto,
  ): Promise<void> {
    return this.service.deleteItems(locationId, dto);
  }

  @Patch('reorder/:locationId')
  @HttpCode(HttpStatus.OK)
  reorderItems(
    @Param('locationId') locationId: string,
    @Body(new ZodValidationPipe({ schema: ReorderItemsSchema }))
    dto: ReorderItemsRequestDto,
  ): Promise<void> {
    return this.service.reorderItems(locationId, dto);
  }

  @Patch(':locationId/:folderId')
  @HttpCode(HttpStatus.OK)
  updateFolder(
    @Param('folderId') folderId: string,
    @Body(new ZodValidationPipe({ schema: UpdateFolderSchema }))
    dto: UpdateFolderRequestDto,
  ): Promise<FolderResponseDto> {
    return this.service.updateFolder(folderId, dto);
  }

  @Get('content/:locationId')
  @HttpCode(HttpStatus.OK)
  getFolderContent(
    @Param('locationId') locationId: string,
    @Query(new ZodValidationPipe({ schema: GetFolderContentQuerySchema }))
    query: FolderContentQueryDto,
  ): Promise<FolderContentResponseDto> {
    return this.service.getFolderContent(locationId, query);
  }

  @Get('tree/:locationId')
  @HttpCode(HttpStatus.OK)
  getFolderTree(
    @Param('locationId') locationId: string,
  ): Promise<FolderTreeResponseDto> {
    return this.service.getFolderTree(locationId);
  }

  @Get('search/:locationId')
  @HttpCode(HttpStatus.OK)
  searchFoldersAndProducts(
    @Param('locationId') locationId: string,
    @Query(new ZodValidationPipe({ schema: SearchFolderContentQuerySchema }))
    query: SearchFolderContentQueryDto,
  ): Promise<SearchFolderContentResponseDto> {
    return this.service.searchFolderContent(locationId, query);
  }
}
