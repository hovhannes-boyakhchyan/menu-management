-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "MenuItemAvailability" AS ENUM ('available', 'sold_out', 'sold_out_today');

-- CreateEnum
CREATE TYPE "PizzaShape" AS ENUM ('round', 'rectangular');

-- CreateTable
CREATE TABLE "icons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_file_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "icons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "icon_id" TEXT,
    "image_file_id" TEXT,
    "image_url" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_items" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "product_id" TEXT,
    "combo_id" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "category_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_type" (
    "id" TEXT NOT NULL,
    "type_name" TEXT NOT NULL,
    "default_sizes" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_templates" (
    "id" TEXT NOT NULL,
    "product_type_id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "image_file_id" TEXT,
    "image_url" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT,
    "metadata" JSONB,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "catalog_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_product_types" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "product_type_id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "icon_id" TEXT,
    "image_file_id" TEXT,
    "image_url" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "location_product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_type_sizes" (
    "id" TEXT NOT NULL,
    "location_product_type_id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "code" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_type_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "folder_id" TEXT,
    "location_product_type_id" TEXT NOT NULL,
    "template_id" TEXT,
    "size_id" TEXT,
    "family_id" TEXT,
    "kitchen_id" TEXT,
    "name" JSONB,
    "description" JSONB,
    "image_file_id" TEXT,
    "image_url" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "delivery_price" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "availability" "MenuItemAvailability" NOT NULL DEFAULT 'available',
    "available_from" TIMESTAMPTZ(6),
    "shape" "PizzaShape",
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "name" TEXT,
    "parent_id" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier_groups" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" JSONB,
    "position" INTEGER NOT NULL DEFAULT 0,
    "min_select" INTEGER NOT NULL DEFAULT 0,
    "max_select" INTEGER NOT NULL DEFAULT 0,
    "allow_duplicate_modifiers" BOOLEAN NOT NULL DEFAULT false,
    "is_sliceable" BOOLEAN NOT NULL DEFAULT false,
    "fixed_price" INTEGER NOT NULL DEFAULT 0,
    "fixed_price_limit" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "modifier_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifiers" (
    "id" TEXT NOT NULL,
    "template_id" TEXT,
    "modifier_group_id" TEXT NOT NULL,
    "name" JSONB,
    "price" INTEGER NOT NULL DEFAULT 0,
    "availability" "MenuItemAvailability" NOT NULL DEFAULT 'available',
    "available_from" TIMESTAMPTZ(6),
    "image_file_id" TEXT,
    "image_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "modifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combos" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "folder_id" TEXT,
    "name" JSONB,
    "description" JSONB,
    "image_file_id" TEXT,
    "image_url" TEXT,
    "kitchen_id" TEXT,
    "delivery_price" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "availability" "MenuItemAvailability" NOT NULL DEFAULT 'available',
    "available_from" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_slots" (
    "id" TEXT NOT NULL,
    "combo_id" TEXT NOT NULL,
    "allowed_type_id" TEXT NOT NULL,
    "title" JSONB,
    "position" INTEGER NOT NULL DEFAULT 0,
    "min_select" INTEGER NOT NULL DEFAULT 1,
    "max_select" INTEGER NOT NULL DEFAULT 1,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "combo_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_slot_choices" (
    "id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price_delta" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "combo_slot_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_disabled_templates" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "location_disabled_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "icons_name_key" ON "icons"("name");

-- CreateIndex
CREATE INDEX "categories_location_id_idx" ON "categories"("location_id");

-- CreateIndex
CREATE INDEX "categories_icon_id_idx" ON "categories"("icon_id");

-- CreateIndex
CREATE INDEX "category_items_category_id_position_idx" ON "category_items"("category_id", "position");

-- CreateIndex
CREATE INDEX "category_items_product_id_idx" ON "category_items"("product_id");

-- CreateIndex
CREATE INDEX "category_items_combo_id_idx" ON "category_items"("combo_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_items_category_id_product_id_key" ON "category_items"("category_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_items_category_id_combo_id_key" ON "category_items"("category_id", "combo_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_type_type_name_key" ON "product_type"("type_name");

-- CreateIndex
CREATE INDEX "catalog_templates_product_type_id_idx" ON "catalog_templates"("product_type_id");

-- CreateIndex
CREATE INDEX "catalog_templates_category_idx" ON "catalog_templates"("category");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_templates_product_type_id_name_key" ON "catalog_templates"("product_type_id", "name");

-- CreateIndex
CREATE INDEX "location_product_types_location_id_idx" ON "location_product_types"("location_id");

-- CreateIndex
CREATE INDEX "location_product_types_product_type_id_idx" ON "location_product_types"("product_type_id");

-- CreateIndex
CREATE INDEX "location_product_types_icon_id_idx" ON "location_product_types"("icon_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_product_types_location_id_product_type_id_key" ON "location_product_types"("location_id", "product_type_id");

-- CreateIndex
CREATE INDEX "product_type_sizes_location_product_type_id_idx" ON "product_type_sizes"("location_product_type_id");

-- CreateIndex
CREATE INDEX "products_location_id_idx" ON "products"("location_id");

-- CreateIndex
CREATE INDEX "products_location_product_type_id_idx" ON "products"("location_product_type_id");

-- CreateIndex
CREATE INDEX "products_template_id_idx" ON "products"("template_id");

-- CreateIndex
CREATE INDEX "products_size_id_idx" ON "products"("size_id");

-- CreateIndex
CREATE INDEX "products_family_id_idx" ON "products"("family_id");

-- CreateIndex
CREATE INDEX "products_kitchen_id_idx" ON "products"("kitchen_id");

-- CreateIndex
CREATE INDEX "products_folder_id_idx" ON "products"("folder_id");

-- CreateIndex
CREATE INDEX "folders_location_id_idx" ON "folders"("location_id");

-- CreateIndex
CREATE INDEX "folders_parent_id_idx" ON "folders"("parent_id");

-- CreateIndex
CREATE INDEX "modifier_groups_product_id_idx" ON "modifier_groups"("product_id");

-- CreateIndex
CREATE INDEX "modifiers_modifier_group_id_idx" ON "modifiers"("modifier_group_id");

-- CreateIndex
CREATE INDEX "modifiers_template_id_idx" ON "modifiers"("template_id");

-- CreateIndex
CREATE INDEX "combos_location_id_idx" ON "combos"("location_id");

-- CreateIndex
CREATE INDEX "combos_folder_id_idx" ON "combos"("folder_id");

-- CreateIndex
CREATE INDEX "combo_slots_combo_id_idx" ON "combo_slots"("combo_id");

-- CreateIndex
CREATE INDEX "combo_slots_allowed_type_id_idx" ON "combo_slots"("allowed_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "combo_slots_combo_id_position_key" ON "combo_slots"("combo_id", "position");

-- CreateIndex
CREATE INDEX "combo_slot_choices_slot_id_idx" ON "combo_slot_choices"("slot_id");

-- CreateIndex
CREATE INDEX "combo_slot_choices_product_id_idx" ON "combo_slot_choices"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "combo_slot_choices_slot_id_product_id_key" ON "combo_slot_choices"("slot_id", "product_id");

-- CreateIndex
CREATE INDEX "location_disabled_templates_template_id_idx" ON "location_disabled_templates"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_disabled_templates_location_id_template_id_key" ON "location_disabled_templates"("location_id", "template_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "icons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_items" ADD CONSTRAINT "category_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_items" ADD CONSTRAINT "category_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_items" ADD CONSTRAINT "category_items_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_templates" ADD CONSTRAINT "catalog_templates_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_product_types" ADD CONSTRAINT "location_product_types_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_product_types" ADD CONSTRAINT "location_product_types_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "icons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_type_sizes" ADD CONSTRAINT "product_type_sizes_location_product_type_id_fkey" FOREIGN KEY ("location_product_type_id") REFERENCES "location_product_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_location_product_type_id_fkey" FOREIGN KEY ("location_product_type_id") REFERENCES "location_product_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "catalog_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "product_type_sizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "modifier_groups" ADD CONSTRAINT "modifier_groups_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifiers" ADD CONSTRAINT "modifiers_modifier_group_id_fkey" FOREIGN KEY ("modifier_group_id") REFERENCES "modifier_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifiers" ADD CONSTRAINT "modifiers_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "catalog_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combos" ADD CONSTRAINT "combos_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_slots" ADD CONSTRAINT "combo_slots_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_slots" ADD CONSTRAINT "combo_slots_allowed_type_id_fkey" FOREIGN KEY ("allowed_type_id") REFERENCES "location_product_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_slot_choices" ADD CONSTRAINT "combo_slot_choices_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "combo_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_slot_choices" ADD CONSTRAINT "combo_slot_choices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_disabled_templates" ADD CONSTRAINT "location_disabled_templates_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "catalog_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

