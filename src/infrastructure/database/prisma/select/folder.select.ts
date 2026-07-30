import { Prisma } from '@prisma/client';

export const oneFolderSelectFields = {
  id: true,
  locationId: true,
  name: true,
  parentId: true,
  position: true,
  color: true,
} as const satisfies Prisma.FolderSelect;

export const manyFoldersSelectFields = {
  id: true,
  name: true,
  parentId: true,
  position: true,
  color: true,
} as const satisfies Prisma.FolderSelect;

export const breadcrumbSelectFields = {
  id: true,
  name: true,
  parentId: true,
} as const satisfies Prisma.FolderSelect;

export type OneFolderType = Prisma.FolderGetPayload<{
  select: typeof oneFolderSelectFields;
}>;

export type ManyFoldersType = Prisma.FolderGetPayload<{
  select: typeof manyFoldersSelectFields;
}>;

export type BreadcrumbRow = Prisma.FolderGetPayload<{
  select: typeof breadcrumbSelectFields;
}>;
