import { Prisma } from '@prisma/client';

export const oneLocationDisabledTemplateSelectFields = {
  id: true,
  locationId: true,
  templateId: true,
} as const satisfies Prisma.LocationDisabledTemplateSelect;

export type OneLocationDisabledTemplateType =
  Prisma.LocationDisabledTemplateGetPayload<{
    select: typeof oneLocationDisabledTemplateSelectFields;
  }>;

export const manyLocationDisabledTemplateSelectFields =
  oneLocationDisabledTemplateSelectFields;

export type ManyLocationDisabledTemplateType =
  Prisma.LocationDisabledTemplateGetPayload<{
    select: typeof manyLocationDisabledTemplateSelectFields;
  }>;
