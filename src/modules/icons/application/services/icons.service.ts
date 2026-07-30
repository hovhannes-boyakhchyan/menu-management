import { Injectable } from '@nestjs/common';
import type { IconsQuery, IconsResponse } from '@bringit/contracts';
import { IconRepository } from '../../infrastructure/repositories/icon.repository';

@Injectable()
export class IconsService {
  constructor(private readonly iconRepository: IconRepository) {}

  async getIcons(query: IconsQuery): Promise<IconsResponse> {
    return this.iconRepository.findMany(query.type);
  }
}
