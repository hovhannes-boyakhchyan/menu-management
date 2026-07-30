import type { LocationCatalogSnapshot } from '@bringit/contracts';
import { Controller, Get, Param } from '@nestjs/common';
import { SkipLocalize } from '@bringit/nestjs-http';
import { InternalCatalogService } from '../../../application/services';

@Controller('internal/catalog')
export class InternalCatalogController {
  constructor(private readonly internalCatalog: InternalCatalogService) {}

  @Get('location/:locationId')
  @SkipLocalize()
  getLocationCatalog(
    @Param('locationId') locationId: string,
  ): Promise<LocationCatalogSnapshot> {
    return this.internalCatalog.getLocationCatalog(locationId);
  }
}
