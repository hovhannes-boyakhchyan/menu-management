import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config';
import { PrismaModule } from './infrastructure/database/prisma';
import { StorageModule } from './infrastructure/storage/storage.module';
import { ProductTypesModule } from './modules/product-types/product-types.module';
import { ProductTypeSizesModule } from './modules/product-type-sizes/product-type-sizes.module';
import { LocationProductTypesModule } from './modules/location-product-types/location-product-types.module';
import { ProductsModule } from './modules/products/products.module';
import { CatalogTemplatesModule } from './modules/catalog-templates/catalog-templates.module';
import { CombosModule } from './modules/combos/combos.module';
import { IconsModule } from './modules/icons/icons.module';
import { FoldersModule } from './modules/folders/folders.module';
import { ModifierGroupsModule } from './modules/modifier-groups/modifier-groups.module';
import { ModifiersModule } from './modules/modifiers/modifiers.module';
import { ImageUploadModule } from './modules/image-upload/image-upload.module';
import { LocationDisabledTemplatesModule } from './modules/location-disabled-templates/location-disabled-templates.module';
import { MenuModule } from './modules/menu/menu.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { InternalCatalogModule } from './modules/internal-catalog/internal-catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    StorageModule,
    ProductTypesModule,
    ProductTypeSizesModule,
    LocationProductTypesModule,
    ProductsModule,
    CatalogTemplatesModule,
    CombosModule,
    IconsModule,
    FoldersModule,
    ModifierGroupsModule,
    ModifiersModule,
    ImageUploadModule,
    LocationDisabledTemplatesModule,
    MenuModule,
    CategoriesModule,
    InternalCatalogModule,
  ],
})
export class AppModule {}
