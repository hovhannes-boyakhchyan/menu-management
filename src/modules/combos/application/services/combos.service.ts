import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  ComboResponse,
  ComboEditResponse,
  ComboListResponse,
  CreateComboRequest,
  UpdateAvailabilityRequest,
  UpdateComboRequest,
  UpdateComboSlot,
} from '@bringit/contracts';
import { MENU_MANAGEMENT_ERRORS } from '@bringit/contracts';
import {
  PrismaService,
  toLocalizedInput,
  asLocalized,
} from '../../../../infrastructure/database/prisma';
import { SUCCESS_MESSAGES } from '../../../../shared/constants';
import {
  computeAvailableFrom,
  isModifierAvailable,
} from '../../../../shared/utils';
import { isProductAvailable } from '../../../products/domain/utils';
import { isComboAvailable } from '../../domain/utils';
import type {
  ComboType,
  ManyCombosType,
} from '../../../../infrastructure/database/prisma/select';
import {
  ComboRepository,
  ComboSlotRepository,
  ComboSlotChoiceRepository,
} from '../../infrastructure/repositories';
import { LocationProductTypesService } from '../../../location-product-types/application/services';
import { LocationDisabledTemplateRepository } from '../../../location-disabled-templates/infrastructure/repositories';

@Injectable()
export class CombosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly comboRepository: ComboRepository,
    private readonly comboSlotRepository: ComboSlotRepository,
    private readonly comboSlotChoiceRepository: ComboSlotChoiceRepository,
    private readonly locationProductTypesService: LocationProductTypesService,
    private readonly locationDisabledTemplateRepository: LocationDisabledTemplateRepository,
  ) {}

  async getById(id: string): Promise<ComboResponse> {
    const combo = await this.assertComboExists(id);
    const disabledTemplateIds =
      await this.locationDisabledTemplateRepository.findTemplateIdsByLocationId(
        combo.locationId,
      );
    return this.mapComboResponse(combo, disabledTemplateIds);
  }

  async getByIdForEdit(id: string): Promise<ComboEditResponse> {
    const combo = await this.getById(id);
    return asLocalized<ComboEditResponse>(combo);
  }

  async getByLocationId(locationId: string): Promise<ComboListResponse[]> {
    const [combos, disabledTemplateIds] = await Promise.all([
      this.comboRepository.findManyByLocationId(locationId),
      this.locationDisabledTemplateRepository.findTemplateIdsByLocationId(
        locationId,
      ),
    ]);
    return combos.map((combo) =>
      this.mapComboListResponse(combo, disabledTemplateIds),
    );
  }

  async create(dto: CreateComboRequest): Promise<{ message: string }> {
    await this.prisma.$transaction(async (tx) => {
      await this.validateProductTypes(dto, tx);

      await this.comboRepository.create(
        {
          locationId: dto.locationId,
          name: dto.name,
          description: toLocalizedInput(dto.description ?? null),
          imageFileId: dto.imageFileId ?? null,
          imageUrl: dto.imageUrl ?? null,
          kitchenId: dto.kitchenId ?? null,
          deliveryPrice: dto.deliveryPrice,
          price: dto.price,
          folderId: dto.folderId ?? null,
          slots: {
            create: dto.slots.map((slot) => ({
              allowedTypeId: slot.allowedTypeId,
              title: toLocalizedInput(slot.title ?? null),
              position: slot.position,
              minSelect: slot.minSelect,
              maxSelect: slot.maxSelect,
              choices: {
                createMany: {
                  data: slot.choices.map((choice) => ({
                    productId: choice.productId,
                    priceDelta: choice.priceDelta,
                    position: choice.position,
                    isDefault: choice.isDefault,
                  })),
                },
              },
            })),
          },
        },
        tx,
      );
    });

    return { message: SUCCESS_MESSAGES.COMBO_CREATED };
  }

  async update(
    comboId: string,
    dto: UpdateComboRequest,
  ): Promise<{ message: string }> {
    await this.prisma.$transaction(async (tx) => {
      await this.assertComboExists(comboId, tx);

      await this.comboRepository.update(
        comboId,
        {
          name: dto.name,
          description: toLocalizedInput(dto.description),
          imageFileId: dto.imageFileId,
          imageUrl: dto.imageUrl,
          kitchenId: dto.kitchenId,
          deliveryPrice: dto.deliveryPrice,
          price: dto.price,
          folderId: dto.folderId,
        },
        tx,
      );

      const keepIds = await Promise.all(
        dto.slots.map((slot) => this.upsertSlot(comboId, slot, tx)),
      );

      await this.comboSlotRepository.deleteOthers(comboId, keepIds, tx);
    });

    return { message: SUCCESS_MESSAGES.COMBO_UPDATED };
  }

  async updateAvailability(
    id: string,
    dto: UpdateAvailabilityRequest,
  ): Promise<{ message: string }> {
    await this.assertComboExists(id);

    await this.comboRepository.update(id, {
      availability: dto.availability,
      availableFrom: computeAvailableFrom(dto.availability),
    });

    return { message: SUCCESS_MESSAGES.COMBO_AVAILABILITY_UPDATED };
  }

  private async assertComboExists(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ComboType> {
    const combo = await this.comboRepository.findById(id, tx);
    if (!combo) {
      throw new NotFoundException(MENU_MANAGEMENT_ERRORS.COMBO_NOT_FOUND);
    }
    return combo;
  }

  private async upsertSlot(
    comboId: string,
    slot: UpdateComboSlot,
    tx: Prisma.TransactionClient,
  ): Promise<string> {
    const slotData = {
      allowedTypeId: slot.allowedTypeId,
      title: toLocalizedInput(slot.title ?? null),
      position: slot.position,
      minSelect: slot.minSelect,
      maxSelect: slot.maxSelect,
    };

    let slotId: string;
    if (slot.id) {
      await this.comboSlotRepository.update(slot.id, slotData, tx);
      slotId = slot.id;
    } else {
      const created = await this.comboSlotRepository.create(
        { comboId, ...slotData },
        tx,
      );
      slotId = created.id;
    }

    const keepIds = await Promise.all(
      slot.choices.map(async (choice) => {
        const { id } = await this.comboSlotChoiceRepository.upsertOne(
          {
            slotId,
            productId: choice.productId,
            priceDelta: choice.priceDelta,
            position: choice.position,
            isDefault: choice.isDefault,
          },
          tx,
        );
        return id;
      }),
    );

    await this.comboSlotChoiceRepository.deleteOthers(slotId, keepIds, tx);

    return slotId;
  }

  private async validateProductTypes(
    dto: CreateComboRequest,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    if (dto.slots.length === 0) return;
    const types = dto.slots.map((slot) => ({
      locationProductTypeId: slot.allowedTypeId,
      locationId: dto.locationId,
    }));
    await this.locationProductTypesService.validateLocationProductTypesBatch(
      types,
      tx,
    );
  }

  private mapComboListResponse(
    combo: ManyCombosType,
    disabledTemplateIds: ReadonlySet<string>,
  ): ComboListResponse {
    return {
      id: combo.id,
      name: asLocalized<string>(combo.name),
      imageUrl: combo.imageUrl,
      deliveryPrice: combo.deliveryPrice,
      price: combo.price,
      availability: combo.availability,
      availableFrom: combo.availableFrom,
      isAvailable: isComboAvailable(combo, disabledTemplateIds),
    };
  }

  private mapComboResponse(
    combo: ComboType,
    disabledTemplateIds: ReadonlySet<string>,
  ): ComboResponse {
    return asLocalized<ComboResponse>({
      ...combo,
      isAvailable: isComboAvailable(combo, disabledTemplateIds),
      slots: combo.slots.map((slot) => ({
        ...slot,
        choices: slot.choices.map((choice) => ({
          ...choice,
          product: {
            ...choice.product,
            isAvailable: isProductAvailable(
              choice.product,
              disabledTemplateIds,
            ),
            modifierGroups: choice.product.modifierGroups.map((group) => ({
              ...group,
              modifiers: group.modifiers.map((modifier) => ({
                ...modifier,
                isAvailable: isModifierAvailable(modifier, disabledTemplateIds),
              })),
            })),
          },
        })),
      })),
    });
  }
}
