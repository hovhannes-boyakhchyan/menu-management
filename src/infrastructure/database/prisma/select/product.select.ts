import { Prisma } from '@prisma/client';
import { iconSelectFields } from './icon.select';
import { productModifierGroupsArgs } from './modifier-group.select';

export const manyProductSelectFields = {
  id: true,
  name: true,
  imageUrl: true,
  deliveryPrice: true,
  price: true,
  availability: true,
  availableFrom: true,
} as const satisfies Prisma.ProductSelect;

export type ManyProductsType = Prisma.ProductGetPayload<{
  select: typeof manyProductSelectFields;
}>;

export const manyProductWithTypeSelectFields = {
  ...manyProductSelectFields,
  locationProductTypeId: true,
} as const satisfies Prisma.ProductSelect;

export type ManyProductsWithTypeType = Prisma.ProductGetPayload<{
  select: typeof manyProductWithTypeSelectFields;
}>;

export const oneProductWithTypesSelectFields = {
  id: true,
  locationProductTypeId: true,
  name: true,
  description: true,
  imageFileId: true,
  imageUrl: true,
  deliveryPrice: true,
  price: true,
  locationId: true,
  availability: true,
  availableFrom: true,
  shape: true,
  templateId: true,
  sizeId: true,
  familyId: true,
  kitchenId: true,
  tags: true,
  locationProductType: {
    select: {
      id: true,
      icon: { select: iconSelectFields },
      productType: { select: { typeName: true } },
    },
  },
} as const satisfies Prisma.ProductSelect;

export type OneProductWithTypesType = Prisma.ProductGetPayload<{
  select: typeof oneProductWithTypesSelectFields;
}>;

export const oneProductWithModifierGroupsSelectFields = {
  id: true,
  locationId: true,
  name: true,
  description: true,
  deliveryPrice: true,
  price: true,
  imageUrl: true,
  imageFileId: true,
  availability: true,
  availableFrom: true,
  shape: true,
  templateId: true,
  sizeId: true,
  familyId: true,
  deletedAt: true,
  kitchenId: true,
  tags: true,
  locationProductType: {
    select: {
      id: true,
      name: true,
      icon: { select: iconSelectFields },
      icon3d: { select: iconSelectFields },
      productType: { select: { typeName: true } },
    },
  },
  size: {
    select: {
      id: true,
      name: true,
    },
  },
  modifierGroups: productModifierGroupsArgs,
} as const satisfies Prisma.ProductSelect;

export type OneProductWithModifierGroupsType = Prisma.ProductGetPayload<{
  select: typeof oneProductWithModifierGroupsSelectFields;
}>;

export const productCompactSelectFields = {
  id: true,
  name: true,
  description: true,
  kitchenId: true,
  imageFileId: true,
  imageUrl: true,
  deliveryPrice: true,
  price: true,
  availability: true,
  availableFrom: true,
  shape: true,
  modifierGroups: productModifierGroupsArgs,
} as const satisfies Prisma.ProductSelect;

export type ProductCompactType = Prisma.ProductGetPayload<{
  select: typeof productCompactSelectFields;
}>;

export const productInFolderSelectFields = {
  id: true,
  name: true,
  deliveryPrice: true,
  price: true,
  position: true,
  availability: true,
  availableFrom: true,
  imageFileId: true,
  imageUrl: true,
  locationProductType: {
    select: {
      icon: { select: iconSelectFields },
      productType: { select: { typeName: true } },
    },
  },
} as const satisfies Prisma.ProductSelect;

export type ProductInFolder = Prisma.ProductGetPayload<{
  select: typeof productInFolderSelectFields;
}>;
