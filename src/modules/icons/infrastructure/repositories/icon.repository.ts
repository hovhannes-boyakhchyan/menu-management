import { Injectable } from '@nestjs/common';
import { IconType as IconTypeFilter } from '@bringit/contracts';
import { PrismaService } from '../../../../infrastructure/database/prisma';
import {
  IconType,
  iconSelectFields,
} from '../../../../infrastructure/database/prisma/select';

@Injectable()
export class IconRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(type?: IconTypeFilter): Promise<IconType[]> {
    return this.prisma.icon.findMany({
      where: type ? { type } : undefined,
      select: iconSelectFields,
    });
  }
}
