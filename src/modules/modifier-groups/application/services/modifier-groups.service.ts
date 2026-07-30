import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  MENU_MANAGEMENT_ERRORS,
  UpdateMenuModifier,
  UpdateMenuModifierGroup,
} from '@bringit/contracts';
import { checkSelectionRange } from '../../domain/utils';
import { ModifierGroupRepository } from '../../infrastructure/repositories';
import { ModifierRepository } from '../../../modifiers/infrastructure/repositories';

@Injectable()
export class ModifierGroupsService {
  constructor(
    private readonly modifierGroupRepository: ModifierGroupRepository,
    private readonly modifierRepository: ModifierRepository,
  ) {}

  async remove(id: string): Promise<void> {
    const existing = await this.modifierGroupRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(
        MENU_MANAGEMENT_ERRORS.MODIFIER_GROUP_NOT_FOUND,
      );
    }

    await this.modifierGroupRepository.delete(id);
  }

  async replaceProductModifierGroups(params: {
    productId: string;
    modifierGroups: UpdateMenuModifierGroup[];
    tx: Prisma.TransactionClient;
  }): Promise<void> {
    const { tx, productId, modifierGroups } = params;

    const existingGroups =
      await this.modifierGroupRepository.findManyByProductIdWithModifierIds(
        productId,
        tx,
      );

    const groupIdsToDelete = this.computeIdsToDelete(
      existingGroups.map((group) => group.id),
      modifierGroups,
    );

    await this.modifierGroupRepository.deleteMany(groupIdsToDelete, tx);

    const existingModifierIdsByGroup = new Map(
      existingGroups.map((group) => [
        group.id,
        group.modifiers.map((modifier) => modifier.id),
      ]),
    );

    await Promise.all(
      modifierGroups.map((modifierGroup) =>
        this.replaceModifierGroup({
          productId,
          modifierGroup,
          existingModifierIds: modifierGroup.id
            ? (existingModifierIdsByGroup.get(modifierGroup.id) ?? [])
            : [],
          tx,
        }),
      ),
    );
  }

  private async replaceModifierGroup(params: {
    productId: string;
    modifierGroup: UpdateMenuModifierGroup;
    existingModifierIds: string[];
    tx: Prisma.TransactionClient;
  }): Promise<void> {
    const { tx, productId, modifierGroup, existingModifierIds } = params;

    const modifierGroupId = await this.upsertModifierGroup({
      tx,
      productId,
      modifierGroup,
    });

    await this.replaceModifiers({
      modifierGroupId,
      modifiers: modifierGroup.modifiers ?? [],
      existingModifierIds,
      tx,
    });
  }

  private async replaceModifiers(params: {
    modifierGroupId: string;
    modifiers: UpdateMenuModifier[];
    existingModifierIds: string[];
    tx: Prisma.TransactionClient;
  }): Promise<void> {
    const { tx, modifierGroupId, modifiers, existingModifierIds } = params;

    const modifierIdsToDelete = this.computeIdsToDelete(
      existingModifierIds,
      modifiers,
    );

    await this.modifierRepository.deleteMany(modifierIdsToDelete, tx);

    await Promise.all(
      modifiers.map((modifier) =>
        this.upsertModifier({
          modifierGroupId,
          modifier,
          tx,
        }),
      ),
    );
  }

  private async upsertModifierGroup(params: {
    productId: string;
    modifierGroup: UpdateMenuModifierGroup;
    tx: Prisma.TransactionClient;
  }): Promise<string> {
    const { tx, productId, modifierGroup } = params;
    const { id } = modifierGroup;

    if (
      modifierGroup.minSelect !== undefined &&
      modifierGroup.maxSelect !== undefined
    ) {
      checkSelectionRange(modifierGroup.minSelect, modifierGroup.maxSelect);
    }

    if (id) {
      await this.modifierGroupRepository.update(
        id,
        {
          name: modifierGroup.name,
          position: modifierGroup.position,
          minSelect: modifierGroup.minSelect,
          maxSelect: modifierGroup.maxSelect,
          fixedPriceLimit: modifierGroup.fixedPriceLimit,
          fixedPrice: modifierGroup.fixedPrice,
          isSliceable: modifierGroup.isSliceable,
          allowDuplicateModifiers: modifierGroup.allowDuplicateModifiers,
        },
        tx,
      );
      return id;
    }

    const created = await this.modifierGroupRepository.create(
      {
        productId,
        name: modifierGroup.name,
        position: modifierGroup.position,
        minSelect: modifierGroup.minSelect,
        maxSelect: modifierGroup.maxSelect,
        fixedPriceLimit: modifierGroup.fixedPriceLimit,
        fixedPrice: modifierGroup.fixedPrice,
        isSliceable: modifierGroup.isSliceable,
        allowDuplicateModifiers: modifierGroup.allowDuplicateModifiers,
      },
      tx,
    );

    return created.id;
  }

  private async upsertModifier(params: {
    modifierGroupId: string;
    modifier: UpdateMenuModifier;
    tx: Prisma.TransactionClient;
  }): Promise<void> {
    const { tx, modifierGroupId, modifier } = params;

    if (modifier.id) {
      await this.modifierRepository.update(
        modifier.id,
        {
          name: modifier.name,
          price: modifier.price,
          imageUrl: modifier.imageUrl,
        },
        tx,
      );
      return;
    }

    await this.modifierRepository.create(
      {
        modifierGroupId,
        name: modifier.name,
        price: modifier.price,
        imageUrl: modifier.imageUrl,
        templateId: modifier.templateId,
      },
      tx,
    );
  }

  private computeIdsToDelete(
    existingIds: string[],
    incoming: { id?: string }[],
  ): string[] {
    const incomingIds = new Set(
      incoming.map((item) => item.id).filter((id): id is string => Boolean(id)),
    );
    return existingIds.filter((id) => !incomingIds.has(id));
  }
}
