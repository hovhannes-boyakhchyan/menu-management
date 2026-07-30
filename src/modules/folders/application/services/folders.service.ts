import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  MENU_MANAGEMENT_ERRORS,
  Breadcrumb,
  CreateFolder,
  DeleteItems,
  Folder,
  FolderTree,
  FolderTreeResponse,
  GetFolderContentQuery,
  FolderContentResponse,
  SearchFolderContentQuery,
  SearchFolderContentResponse,
  UpdateFolder,
  MoveItems,
  ReorderItems,
} from '@bringit/contracts';
import { FolderRepository } from '../../infrastructure/repositories';
import {
  PrismaService,
  asLocalized,
} from '../../../../infrastructure/database/prisma';
import { isCurrentlyAvailable } from '../../../../shared/utils';
import { ProductRepository } from '../../../products/infrastructure/repositories';
import { ComboRepository } from '../../../combos/infrastructure/repositories';
import {
  ComboInFolder,
  ManyFoldersType,
  ProductInFolder,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class FoldersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly folderRepository: FolderRepository,
    private readonly productRepository: ProductRepository,
    private readonly comboRepository: ComboRepository,
  ) {}

  async createFolder(locationId: string, dto: CreateFolder): Promise<Folder> {
    const parentId = dto.parentId ?? null;
    if (dto.name) {
      await this.assertNameAvailable(locationId, parentId, dto.name);
    }
    return this.folderRepository.create({
      locationId,
      name: dto.name,
      parentId,
      position: dto.position ?? undefined,
      color: dto.color,
    });
  }

  async updateFolder(folderId: string, dto: UpdateFolder): Promise<Folder> {
    const folder = await this.folderRepository.findById(folderId);
    if (!folder) {
      throw new NotFoundException(MENU_MANAGEMENT_ERRORS.FOLDER_NOT_FOUND);
    }
    if (dto.name) {
      await this.assertNameAvailable(
        folder.locationId,
        folder.parentId,
        dto.name,
        folderId,
      );
    }
    return this.folderRepository.update(
      { id: folderId },
      { ...dto, position: dto.position ?? undefined },
    );
  }

  private async assertNameAvailable(
    locationId: string,
    parentId: string | null,
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const taken = await this.folderRepository.existsWithName(
      locationId,
      parentId,
      name,
      excludeId,
    );
    if (taken) {
      throw new ConflictException(MENU_MANAGEMENT_ERRORS.FOLDER_NAME_EXISTS);
    }
  }

  private async assertMoveNamesAvailable(
    locationId: string,
    folderIds: string[],
    targetFolderId: string | null,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const moving = await this.folderRepository.findNamesByIds(
      locationId,
      folderIds,
      tx,
    );
    const names = moving
      .map((folder) => folder.name)
      .filter((name): name is string => !!name);
    if (!names.length) return;

    const existing = await this.folderRepository.findNamesByParent(
      locationId,
      targetFolderId,
      folderIds,
      tx,
    );
    const taken = new Set(existing.map((name) => name.toLowerCase()));

    for (const name of names) {
      const key = name.toLowerCase();
      if (taken.has(key)) {
        throw new ConflictException(MENU_MANAGEMENT_ERRORS.FOLDER_NAME_EXISTS);
      }
      taken.add(key);
    }
  }

  async deleteItems(locationId: string, dto: DeleteItems): Promise<void> {
    const { folderIds, productIds, comboIds } = dto;

    await this.prisma.$transaction(async (tx) => {
      if (folderIds.length) {
        await this.folderRepository.cascadeDeleteFolders(
          locationId,
          folderIds,
          tx,
        );
      }
      if (productIds.length) {
        await this.productRepository.softDeleteMany(productIds, locationId, tx);
      }
      if (comboIds.length) {
        await this.comboRepository.softDeleteMany(comboIds, locationId, tx);
      }
    });
  }

  async moveItems(locationId: string, dto: MoveItems): Promise<void> {
    const { folderIds, productIds, comboIds, targetFolderId = null } = dto;

    await this.prisma.$transaction(async (tx) => {
      if (folderIds.length) {
        await this.assertMoveNamesAvailable(
          locationId,
          folderIds,
          targetFolderId,
          tx,
        );
        await this.folderRepository.moveFolders(
          folderIds,
          targetFolderId,
          locationId,
          tx,
        );
      }
      if (productIds.length) {
        await this.productRepository.moveToFolder(
          productIds,
          targetFolderId,
          locationId,
          tx,
        );
      }
      if (comboIds.length) {
        await this.comboRepository.moveToFolder(
          comboIds,
          targetFolderId,
          locationId,
          tx,
        );
      }
    });
  }

  async reorderItems(locationId: string, dto: ReorderItems): Promise<void> {
    if (!dto.items.length) return;

    const folderId = dto.folderId || null;
    const folderItems: { id: string; position: number }[] = [];
    const productItems: { id: string; position: number }[] = [];
    const comboItems: { id: string; position: number }[] = [];

    dto.items.forEach((item, position) => {
      if (item.type === 'folder') {
        folderItems.push({ id: item.id, position });
      } else if (item.type === 'product') {
        productItems.push({ id: item.id, position });
      } else {
        comboItems.push({ id: item.id, position });
      }
    });

    await this.prisma.$transaction(async (tx) => {
      if (folderItems.length) {
        await this.folderRepository.updatePositions(
          locationId,
          folderId,
          folderItems,
          tx,
        );
      }
      if (productItems.length) {
        await this.productRepository.updatePositions(
          locationId,
          folderId,
          productItems,
          tx,
        );
      }
      if (comboItems.length) {
        await this.comboRepository.updatePositions(
          locationId,
          folderId,
          comboItems,
          tx,
        );
      }
    });
  }

  async getFolderContent(
    locationId: string,
    query: GetFolderContentQuery = {},
  ): Promise<FolderContentResponse> {
    const folderId = query.folderId || null;
    const includeCombos = query.includeCombos !== false;

    const [folders, products, combos, breadcrumbs] = await Promise.all([
      this.folderRepository.findManyByParent(locationId, folderId),
      this.productRepository.findManyByFolder(locationId, folderId),
      includeCombos
        ? this.comboRepository.findManyByFolder(locationId, folderId)
        : Promise.resolve([]),
      folderId ? this.buildBreadcrumbs(folderId) : Promise.resolve([]),
    ]);

    return {
      items: this.buildFolderContentItems(folders, products, combos),
      breadcrumbs,
    };
  }

  async getFolderTree(locationId: string): Promise<FolderTreeResponse> {
    const folders = await this.folderRepository.findMany({
      locationId,
      deletedAt: null,
    });

    folders.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const nodes = new Map<string, FolderTree>(
      folders.map((f) => [
        f.id,
        { id: f.id, name: f.name, color: f.color, children: [] },
      ]),
    );

    const roots: FolderTree[] = [];
    for (const f of folders) {
      const node = nodes.get(f.id)!;
      if (f.parentId === null) roots.push(node);
      else nodes.get(f.parentId)?.children.push(node);
    }

    return { items: roots };
  }

  async searchFolderContent(
    locationId: string,
    query: SearchFolderContentQuery = {},
  ): Promise<SearchFolderContentResponse> {
    const { name = '' } = query;

    const [folders, products, combos] = await Promise.all([
      this.folderRepository.findManyByName(locationId, name),
      this.productRepository.findManyByName(locationId, name),
      this.comboRepository.findManyByName(locationId, name),
    ]);

    return {
      items: this.buildFolderContentItems(folders, products, combos),
    };
  }

  private buildFolderContentItems(
    folders: ManyFoldersType[],
    products: ProductInFolder[],
    combos: ComboInFolder[],
  ) {
    const productItems = products.map((product) => ({
      id: product.id,
      name: asLocalized<string>(product.name),
      deliveryPrice: product.deliveryPrice,
      price: product.price,
      icon: product.locationProductType.icon,
      typeName: product.locationProductType.productType.typeName,
      isAvailable: isCurrentlyAvailable(product),
      position: product.position,
      imageFileId: product.imageFileId,
      imageUrl: product.imageUrl,
      type: 'product' as const,
    }));

    const comboItems = combos.map((combo) => ({
      id: combo.id,
      name: asLocalized<string>(combo.name),
      deliveryPrice: combo.deliveryPrice,
      price: combo.price,
      isAvailable: isCurrentlyAvailable(combo),
      position: combo.position,
      imageFileId: combo.imageFileId,
      imageUrl: combo.imageUrl,
      type: 'combo' as const,
    }));

    return [
      ...productItems,
      ...comboItems,
      ...folders.map((folder) => ({
        ...folder,
        type: 'folder' as const,
      })),
    ].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }

  private async buildBreadcrumbs(
    folderId: string | null,
  ): Promise<Breadcrumb[]> {
    const chain: Breadcrumb[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = await this.folderRepository.findBreadcrumb(currentId);
      if (!folder) break;
      chain.push({
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
      });
      currentId = folder.parentId;
    }

    return chain.reverse();
  }
}
