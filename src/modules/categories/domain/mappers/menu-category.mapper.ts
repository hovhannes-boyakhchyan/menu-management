import type { MenuCategoryResponse, MenuItem } from '@bringit/contracts';
import {
  CategoryWithItemsType,
  CategoryItemWithRefsType,
} from '../../../../infrastructure/database/prisma/select';
import { asLocalized } from '../../../../infrastructure/database/prisma';
import { isCurrentlyAvailable } from '../../../../shared/utils';
import { isComboAvailable } from '../../../combos/domain/utils';

export function mapMenuCategory(
  category: CategoryWithItemsType,
  disabledTemplateIds: ReadonlySet<string>,
): MenuCategoryResponse {
  return {
    id: category.id,
    locationId: category.locationId,
    name: asLocalized<string>(category.name),
    description: asLocalized<string | null>(category.description),
    icon: category.icon,
    imageUrl: category.imageUrl,
    position: category.position,
    items: category.items.flatMap(
      (item) => mapMenuItem(item, disabledTemplateIds) ?? [],
    ),
  };
}

function mapMenuItem(
  item: CategoryItemWithRefsType,
  disabledTemplateIds: ReadonlySet<string>,
): MenuItem | null {
  if (item.product) {
    const product = item.product;
    return {
      type: 'product',
      id: product.id,
      name: asLocalized<string>(product.name),
      imageUrl: product.imageUrl,
      deliveryPrice: product.deliveryPrice,
      price: product.price,
      availability: product.availability,
      availableFrom: product.availableFrom,
      isAvailable: isCurrentlyAvailable(product),
    };
  }

  if (item.combo) {
    const combo = item.combo;
    return {
      type: 'combo',
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

  return null;
}
