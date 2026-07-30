import { Injectable } from '@nestjs/common';
import { CatalogTemplateRepository } from '../../infrastructure/repositories';
import { CatalogTemplate, CatalogTemplateResponse } from '@bringit/contracts';
import { asLocalized } from '../../../../infrastructure/database/prisma';

@Injectable()
export class CatalogTemplatesService {
  constructor(
    private readonly catalogTemplateRepository: CatalogTemplateRepository,
  ) {}

  async list(filter: {
    productType?: string;
    category?: string;
  }): Promise<CatalogTemplateResponse[]> {
    const templates = await this.catalogTemplateRepository.findByFilter(filter);
    return asLocalized<CatalogTemplateResponse[]>(templates);
  }

  async listForEdit(filter: {
    productType?: string;
    category?: string;
  }): Promise<CatalogTemplate[]> {
    const templates = await this.catalogTemplateRepository.findByFilter(filter);
    return asLocalized<CatalogTemplate[]>(templates);
  }
}
