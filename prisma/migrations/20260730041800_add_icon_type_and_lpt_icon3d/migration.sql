-- CreateEnum
CREATE TYPE "IconType" AS ENUM ('simple', '3d');

-- DropIndex
DROP INDEX "icons_name_key";

-- AlterTable
ALTER TABLE "icons" ADD COLUMN     "type" "IconType" NOT NULL DEFAULT 'simple';

-- AlterTable
ALTER TABLE "location_product_types" DROP COLUMN "image_file_id",
DROP COLUMN "image_url",
ADD COLUMN     "icon_3d_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "icons_name_type_key" ON "icons"("name", "type");

-- CreateIndex
CREATE INDEX "location_product_types_icon_3d_id_idx" ON "location_product_types"("icon_3d_id");

-- AddForeignKey
ALTER TABLE "location_product_types" ADD CONSTRAINT "location_product_types_icon_3d_id_fkey" FOREIGN KEY ("icon_3d_id") REFERENCES "icons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
