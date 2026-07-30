// import * as mysql from 'mysql2/promise';
// import type { RowDataPacket } from 'mysql2/promise';
// import { randomUUID } from 'crypto';
// import type { MenuType } from '@prisma/client';
// import type {
//   AdditionalofferRow,
//   LocationMenuRow,
//   LocationDisabledToppingRow,
//   LocationProductTypeRow,
//   DrinkRow,
//   FolderRow,
//   FoldersProductRow,
//   IconRow,
//   PizzaRow,
//   ProductCategoryRow,
//   ProductDealItemRow,
//   ProductRow,
//   ProductTypeRow,
//   ProductsAlertRow,
//   ProductsInCategoriesRow,
//   ToppingRow,
// } from './types/migrate-from-php-db.types';
//
// const OLD_URL = 'mysql://root:@localhost:3306/bringit_local';
// const NEW_URL = 'mysql://root:@localhost:3306/bringit_menu_management';
//
// type IdMap = Map<number, string>;
//
// function toBool(v: unknown): boolean {
//   if (v === null || v === undefined) return false;
//   return Number(v) !== 0;
// }
//
// function toUuidOrNull(v: unknown, map: IdMap): string | null {
//   if (v === null || v === undefined) return null;
//   const n = Number(v);
//   if (n === 0) return null;
//   const u = map.get(n);
//   return u ?? null;
// }
//
// function toUuid(v: unknown, map: IdMap): string {
//   const u = toUuidOrNull(v, map);
//   if (!u) throw new Error(`Missing mapping for id ${String(v)}`);
//   return u;
// }
//
// const VARCHAR_191_MAX = 191;
// function truncateVarchar191(s: string | null | undefined): string | null {
//   if (s == null) return null;
//   if (s.length <= VARCHAR_191_MAX) return s;
//   return s.slice(0, VARCHAR_191_MAX);
// }
//
// type ExistsCountRow = RowDataPacket & { cnt: number };
//
// async function mysqlTableExists(
//   conn: mysql.Connection,
//   tableName: string,
// ): Promise<boolean> {
//   const [rows] = await conn.query<ExistsCountRow[]>(
//     `SELECT COUNT(*) AS cnt FROM information_schema.tables
//      WHERE table_schema = DATABASE() AND table_name = ?`,
//     [tableName],
//   );
//   return Number(rows[0]?.cnt ?? 0) > 0;
// }
//
// async function main() {
//   if (!OLD_URL || !NEW_URL) {
//     console.error('Set both OLD_DATABASE_URL and DATABASE_URL.');
//     process.exit(1);
//   }
//
//   const oldDb = await mysql.createConnection(OLD_URL);
//   const newDb = await mysql.createConnection(NEW_URL);
//
//   const typeIdMap: IdMap = new Map();
//   const locationProductTypeIdMap: IdMap = new Map();
//   const productIdMap: IdMap = new Map();
//   const folderIdMap: IdMap = new Map();
//   const categoryIdMap: IdMap = new Map();
//   const productsInCategoryIdMap: IdMap = new Map();
//   const dealItemIdMap: IdMap = new Map();
//   const locationDisabledToppingIdMap: IdMap = new Map();
//   const pizzaIdMap: IdMap = new Map();
//   const toppingIdMap: IdMap = new Map();
//   const drinkIdMap: IdMap = new Map();
//   const additionalofferIdMap: IdMap = new Map();
//   const locationIdMap: IdMap = new Map();
//
//   function getOrCreateBusinessUuid(oldId: number): string {
//     let u = locationIdMap.get(oldId);
//     if (!u) {
//       u = randomUUID();
//       locationIdMap.set(oldId, u);
//     }
//     return u;
//   }
//
//   try {
//     console.log('1. product_type');
//     const [productTypes] = await oldDb.query<ProductTypeRow[]>(
//       'SELECT type_id, type_name, add_date FROM bringit_product_type',
//     );
//     for (const r of productTypes) {
//       const id = randomUUID();
//       typeIdMap.set(Number(r.type_id), id);
//       await newDb.query(
//         'INSERT INTO product_type (id, type_name, add_date, created_at, updated_at) VALUES (?, ?, ?, NOW(3), NOW(3))',
//         [id, r.type_name ?? null, r.add_date ?? null],
//       );
//     }
//
//     console.log('2. business_product_types');
//     const [bptRows] = await oldDb.query<LocationProductTypeRow[]>(
//       'SELECT id, business_id, product_type_id, name, description, icon, deleted FROM bringit_business_product_types',
//     );
//     for (const r of bptRows) {
//       const productTypeId = toUuidOrNull(r.product_type_id, typeIdMap);
//       if (productTypeId == null) {
//         console.warn(
//           `  Skipping business_product_types id=${r.id}: product_type_id ${r.product_type_id} has no mapping (e.g. 0 or 13).`,
//         );
//         continue;
//       }
//       const id = randomUUID();
//       locationProductTypeIdMap.set(Number(r.id), id);
//       const locationId = getOrCreateBusinessUuid(Number(r.business_id));
//       await newDb.query(
//         'INSERT INTO business_product_types (id, business_id, product_type_id, name, description, icon, deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))',
//         [
//           id,
//           locationId,
//           productTypeId,
//           r.name ?? null,
//           r.description ?? null,
//           r.icon ?? null,
//           toBool(r.deleted),
//         ],
//       );
//     }
//
//     console.log('2.a icons');
//     const [iconRows] = await oldDb.query<IconRow[]>(
//       'SELECT name FROM bringit_icons',
//     );
//     for (const r of iconRows) {
//       const id = randomUUID();
//       await newDb.query(
//         'INSERT INTO icons (id, name, image_file_id, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(3), NOW(3))',
//         [id, r.name, null, null],
//       );
//     }
//
//     console.log('3. pizza (legacy – before products for product_original_id)');
//     const [pizzaRows] = await oldDb.query<PizzaRow[]>(
//       'SELECT product_id, name, picture, shape, uniq_for_business_id, status, size_order FROM bringit_pizza',
//     );
//     for (const r of pizzaRows) {
//       const id = randomUUID();
//       pizzaIdMap.set(Number(r.product_id), id);
//       const uniqForLocationId =
//         r.uniq_for_business_id == null || Number(r.uniq_for_business_id) === 0
//           ? null
//           : getOrCreateBusinessUuid(Number(r.uniq_for_business_id));
//       await newDb.query(
//         'INSERT INTO pizza (id, name, picture, shape, uniq_for_business_id, status, size_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))',
//         [
//           id,
//           r.name ?? null,
//           r.picture ?? null,
//           r.shape ?? null,
//           uniqForLocationId,
//           toBool(r.status),
//           r.size_order ?? null,
//         ],
//       );
//     }
//
//     console.log('4. topping (legacy)');
//     const [toppingRows] = await oldDb.query<ToppingRow[]>(
//       'SELECT product_id, name, category, picture, uniq_for_business_id, status, can_be_sliced, sorting FROM bringit_topping',
//     );
//     for (const r of toppingRows) {
//       const id = randomUUID();
//       toppingIdMap.set(Number(r.product_id), id);
//       const uniqForLocationId =
//         r.uniq_for_business_id == null || Number(r.uniq_for_business_id) === 0
//           ? null
//           : getOrCreateBusinessUuid(Number(r.uniq_for_business_id));
//       await newDb.query(
//         'INSERT INTO topping (id, name, category, picture, uniq_for_business_id, status, can_be_sliced, sorting, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))',
//         [
//           id,
//           r.name ?? null,
//           r.category ?? null,
//           r.picture ?? null,
//           uniqForLocationId,
//           toBool(r.status),
//           toBool(r.can_be_sliced),
//           r.sorting ?? 0,
//         ],
//       );
//     }
//
//     console.log('5. drink (legacy)');
//     const [drinkRows] = await oldDb.query<DrinkRow[]>(
//       'SELECT product_id, name, description, picture, uniq_for_business_id, status FROM bringit_drink',
//     );
//     for (const r of drinkRows) {
//       const id = randomUUID();
//       drinkIdMap.set(Number(r.product_id), id);
//       const uniqForLocationId =
//         r.uniq_for_business_id == null || Number(r.uniq_for_business_id) === 0
//           ? null
//           : getOrCreateBusinessUuid(Number(r.uniq_for_business_id));
//       await newDb.query(
//         'INSERT INTO drink (id, name, description, picture, uniq_for_business_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(3), NOW(3))',
//         [
//           id,
//           r.name ?? null,
//           r.description ?? null,
//           r.picture ?? null,
//           uniqForLocationId,
//           toBool(r.status),
//         ],
//       );
//     }
//
//     console.log(
//       '6. additionaloffer (legacy – optional ID map for product_original_id)',
//     );
//     if (await mysqlTableExists(oldDb, 'bringit_additionaloffer')) {
//       const [aoRows] = await oldDb.query<AdditionalofferRow[]>(
//         'SELECT product_id, name, description, picture, uniq_for_business_id, status FROM bringit_additionaloffer',
//       );
//       for (const r of aoRows) {
//         const id = randomUUID();
//         additionalofferIdMap.set(Number(r.product_id), id);
//       }
//       console.log(
//         `  Built ${additionalofferIdMap.size} additionaloffer ID mappings (new schema has no table; UUIDs kept for traceability in product_original_id).`,
//       );
//     } else {
//       console.log(
//         '  Skipped: bringit_additionaloffer not found (unused in this DB).',
//       );
//     }
//
//     console.log(
//       '7. products (product_deal_item_id backfilled after product_deal_items)',
//     );
//     const [productRows] = await oldDb.query<ProductRow[]>(
//       'SELECT product_id, product_original_id, product_type_id, business_product_type_id, product_deal_item_id, product_name, product_description, product_picture, product_delivery_price, product_not_delivery_price, product_business_id, product_in_inventory, product_status, product_shape, kitchen_id FROM bringit_products',
//     );
//     const productDealItemIdBackfill: Array<{
//       productId: string;
//       dealItemIdOld: number;
//     }> = [];
//     for (const r of productRows) {
//       const locationProductTypeId = toUuidOrNull(
//         r.business_product_type_id,
//         locationProductTypeIdMap,
//       );
//       if (locationProductTypeId == null) {
//         console.warn(
//           `  Skipping product ${r.product_id}: business_product_type_id ${r.business_product_type_id} has no mapping (referenced business_product_types row was skipped).`,
//         );
//         continue;
//       }
//       const id = randomUUID();
//       productIdMap.set(Number(r.product_id), id);
//       if (
//         r.product_deal_item_id != null &&
//         Number(r.product_deal_item_id) !== 0
//       ) {
//         productDealItemIdBackfill.push({
//           productId: id,
//           dealItemIdOld: Number(r.product_deal_item_id),
//         });
//       }
//       let productOriginalId = toUuidOrNull(r.product_original_id, productIdMap);
//       if (
//         productOriginalId === null &&
//         r.product_original_id != null &&
//         Number(r.product_original_id) !== 0
//       ) {
//         const orig = Number(r.product_original_id);
//         productOriginalId =
//           pizzaIdMap.get(orig) ??
//           toppingIdMap.get(orig) ??
//           drinkIdMap.get(orig) ??
//           additionalofferIdMap.get(orig) ??
//           null;
//       }
//       const locationId = getOrCreateBusinessUuid(Number(r.product_business_id));
//       await newDb.query(
//         `INSERT INTO products (id, product_original_id, business_product_type_id, product_deal_item_id, product_name, product_description, product_picture, product_image_file_id, product_image_url, product_delivery_price, product_not_delivery_price, product_business_id, product_in_inventory, product_status, product_shape, kitchen_id, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
//         [
//           id,
//           productOriginalId,
//           locationProductTypeId,
//           null,
//           r.product_name ?? null,
//           r.product_description ?? null,
//           r.product_picture ?? null,
//           null,
//           null,
//           Number(r.product_delivery_price) || 0,
//           Number(r.product_not_delivery_price) || 0,
//           locationId,
//           toBool(r.product_in_inventory),
//           toBool(r.product_status),
//           r.product_shape ?? null,
//           r.kitchen_id != null ? String(r.kitchen_id) : '0',
//         ],
//       );
//     }
//
//     console.log('8. folders');
//     const [folderRows] = await oldDb.query<FolderRow[]>(
//       'SELECT folder_id, folder_business_id, folder_name, folder_father_id, folder_position, folder_status, folder_date, folder_color FROM bringit_folders',
//     );
//     for (const r of folderRows) {
//       const id = randomUUID();
//       folderIdMap.set(Number(r.folder_id), id);
//       const fatherId = toUuidOrNull(r.folder_father_id, folderIdMap);
//       const locationId = getOrCreateBusinessUuid(Number(r.folder_business_id));
//       await newDb.query(
//         `INSERT INTO folders (id, folder_business_id, folder_name, folder_father_id, folder_position, folder_status, folder_date, folder_color, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
//         [
//           id,
//           locationId,
//           r.folder_name ?? null,
//           fatherId,
//           r.folder_position ?? null,
//           toBool(r.folder_status),
//           r.folder_date ?? null,
//           r.folder_color ?? null,
//         ],
//       );
//     }
//
//     console.log('9. folders_products');
//     const [fpRows] = await oldDb.query<FoldersProductRow[]>(
//       'SELECT folder_id, product_id, status FROM bringit_folders_products',
//     );
//     for (const r of fpRows) {
//       const folderId = toUuidOrNull(r.folder_id, folderIdMap);
//       const productId = toUuidOrNull(r.product_id, productIdMap);
//       if (productId == null) {
//         console.warn(
//           `  Skipping folders_products folder_id=${r.folder_id} product_id=${r.product_id}: product has no mapping (referenced row was skipped).`,
//         );
//         continue;
//       }
//       const id = randomUUID();
//       await newDb.query(
//         'INSERT INTO folders_products (id, folder_id, product_id, status, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(3), NOW(3))',
//         [id, folderId, productId, toBool(r.status), null],
//       );
//     }
//
//     console.log('10. product_categories');
//     const [pcRows] = await oldDb.query<ProductCategoryRow[]>(
//       'SELECT category_id, category_product_id, category_business_id, category_name, category_list_order, category_products_limit, category_products_fixed_price, category_has_fixed_price, category_fixed_price, category_is_topping_divided, category_is_multiple_selection, category_is_mandatory FROM bringit_product_categories',
//     );
//     for (const r of pcRows) {
//       const productId = toUuidOrNull(r.category_product_id, productIdMap);
//       if (productId == null) {
//         console.warn(
//           `  Skipping product_categories category_id=${r.category_id}: category_product_id ${r.category_product_id} has no mapping (referenced product was skipped).`,
//         );
//         continue;
//       }
//       const id = randomUUID();
//       categoryIdMap.set(Number(r.category_id), id);
//       const locationId = getOrCreateBusinessUuid(
//         Number(r.category_business_id),
//       );
//       await newDb.query(
//         `INSERT INTO modifier_groups (id, category_product_id, category_business_id, category_name, category_list_order, max_select, min_select, category_products_fixed_price, category_has_fixed_price, category_fixed_price, category_is_topping_divided, category_is_multiple_selection, category_is_mandatory, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
//         [
//           id,
//           productId,
//           locationId,
//           r.category_name ?? null,
//           Number(r.category_list_order) || 0,
//           Number(r.category_products_limit) || 0,
//           0,
//           Number(r.category_products_fixed_price) || 0,
//           toBool(r.category_has_fixed_price),
//           Number(r.category_fixed_price) || 0,
//           toBool(r.category_is_topping_divided),
//           toBool(r.category_is_multiple_selection),
//           toBool(r.category_is_mandatory),
//         ],
//       );
//     }
//
//     console.log('11. product_deal_items');
//     const [pdiRows] = await oldDb.query<ProductDealItemRow[]>(
//       'SELECT item_id, item_deal_id, item_type_id FROM bringit_product_deal_items',
//     );
//     for (const r of pdiRows) {
//       const dealId = toUuidOrNull(r.item_deal_id, productIdMap);
//       const typeId = toUuidOrNull(r.item_type_id, locationProductTypeIdMap);
//       if (dealId == null || typeId == null) {
//         console.warn(
//           `  Skipping product_deal_items item_id=${r.item_id}: item_deal_id or item_type_id has no mapping (referenced row was skipped).`,
//         );
//         continue;
//       }
//       const id = randomUUID();
//       dealItemIdMap.set(Number(r.item_id), id);
//       await newDb.query(
//         'INSERT INTO product_deal_items (id, item_deal_id, item_type_id, item_status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(3), NOW(3))',
//         [id, dealId, typeId, 1],
//       );
//     }
//
//     console.log('12. Backfill products.product_deal_item_id');
//     for (const { productId, dealItemIdOld } of productDealItemIdBackfill) {
//       const dealItemIdNew = dealItemIdMap.get(dealItemIdOld);
//       if (dealItemIdNew) {
//         await newDb.query(
//           'UPDATE products SET product_deal_item_id = ? WHERE id = ?',
//           [dealItemIdNew, productId],
//         );
//       }
//     }
//
//     console.log('13. products_in_categories');
//     const [picRows] = await oldDb.query<ProductsInCategoriesRow[]>(
//       'SELECT product_id, product_original_id, product_category_id, product_name, product_price, product_in_inventory, product_picture, product_status FROM bringit_products_in_categories',
//     );
//     for (const r of picRows) {
//       const categoryId = toUuidOrNull(r.product_category_id, categoryIdMap);
//       if (categoryId == null) {
//         console.warn(
//           `  Skipping products_in_categories product_id=${r.product_id}: product_category_id ${r.product_category_id} has no mapping (referenced category was skipped).`,
//         );
//         continue;
//       }
//
//       const id = randomUUID();
//       productsInCategoryIdMap.set(Number(r.product_id), id);
//       let productOriginalId = toUuidOrNull(
//         r.product_original_id,
//         productsInCategoryIdMap,
//       );
//       if (
//         productOriginalId === null &&
//         r.product_original_id != null &&
//         Number(r.product_original_id) !== 0
//       ) {
//         const orig = Number(r.product_original_id);
//         productOriginalId =
//           toppingIdMap.get(orig) ??
//           pizzaIdMap.get(orig) ??
//           drinkIdMap.get(orig) ??
//           additionalofferIdMap.get(orig) ??
//           null;
//       }
//       await newDb.query(
//         `INSERT INTO modifiers (id, product_original_id, product_category_id, product_name, product_price, product_in_inventory, product_picture, product_status, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
//         [
//           id,
//           productOriginalId,
//           categoryId,
//           r.product_name ?? null,
//           Number(r.product_price) || 0,
//           toBool(r.product_in_inventory),
//           r.product_picture ?? null,
//           toBool(r.product_status),
//         ],
//       );
//     }
//
//     console.log('14. business_disabled_toppings');
//     const [bdtRows] = await oldDb.query<LocationDisabledToppingRow[]>(
//       'SELECT id, business_id, original_id FROM bringit_business_disabled_toppings',
//     );
//     for (const r of bdtRows) {
//       const id = randomUUID();
//       locationDisabledToppingIdMap.set(Number(r.id), id);
//       const locationId = getOrCreateBusinessUuid(Number(r.business_id));
//       const originalId = toUuid(r.original_id, toppingIdMap);
//       await newDb.query(
//         'INSERT INTO business_disabled_toppings (id, business_id, original_id, created_at, updated_at) VALUES (?, ?, ?, NOW(3), NOW(3))',
//         [id, locationId, originalId],
//       );
//     }
//
//     console.log('15. products_alerts');
//     const [paRows] = await oldDb.query<ProductsAlertRow[]>(
//       'SELECT product_id, business_id, alert_text FROM bringit_products_alerts',
//     );
//     for (const r of paRows) {
//       const productId = toUuidOrNull(r.product_id, productIdMap);
//       if (productId == null) {
//         console.warn(
//           `  Skipping products_alerts product_id=${r.product_id} business_id=${r.business_id}: product has no mapping (referenced product was skipped).`,
//         );
//         continue;
//       }
//       const id = randomUUID();
//       const locationId = getOrCreateBusinessUuid(Number(r.business_id));
//       await newDb.query(
//         'INSERT INTO products_alerts (id, product_id, business_id, alert_text, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(3), NOW(3))',
//         [id, productId, locationId, r.alert_text ?? null],
//       );
//     }
//
//     console.log('16. business_menu (mobile, desktop, kiosk, digital)');
//     type MenuSource = { table: string; menuType: MenuType };
//     const menuSources: MenuSource[] = [
//       { table: 'bringit_business_mobile_menu', menuType: 'mobile' },
//       { table: 'bringit_business_desktop_menu', menuType: 'desktop' },
//       { table: 'bringit_business_kiosk_menu', menuType: 'kiosk' },
//       { table: 'bringit_business_digital_menu', menuType: 'digital' },
//     ];
//
//     for (const source of menuSources) {
//       const [menuRows] = await oldDb.query<LocationMenuRow[]>(
//         `SELECT id, business_id, title, icon, parent_item_id, position, product_type_id, description, picture, deleted FROM ${source.table}`,
//       );
//
//       const menuIdMap: IdMap = new Map();
//
//       // First pass: assign UUIDs
//       for (const row of menuRows) {
//         const id = randomUUID();
//         menuIdMap.set(Number(row.id), id);
//       }
//
//       // Second pass: insert with resolved parent ids
//       for (const row of menuRows) {
//         const id = menuIdMap.get(Number(row.id));
//         if (!id) continue;
//
//         const locationId = getOrCreateBusinessUuid(Number(row.business_id));
//         const parentId =
//           row.parent_item_id != null && Number(row.parent_item_id) !== 0
//             ? (menuIdMap.get(Number(row.parent_item_id)) ?? null)
//             : null;
//
//         const productTypeId =
//           row.product_type_id != null && Number(row.product_type_id) !== 0
//             ? toUuidOrNull(row.product_type_id, typeIdMap)
//             : null;
//
//         await newDb.query(
//           `INSERT INTO business_menu (id, business_id, menu_type, title, icon, parent_item_id, position, product_type_id, description, picture, deleted, created_at, updated_at)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
//           [
//             id,
//             locationId,
//             source.menuType,
//             truncateVarchar191(row.title),
//             truncateVarchar191(row.icon),
//             parentId,
//             row.position ?? null,
//             productTypeId,
//             truncateVarchar191(row.description),
//             truncateVarchar191(row.picture),
//             toBool(row.deleted),
//           ],
//         );
//       }
//     }
//
//     // ── Post-migration validation ──────────────────────────────────────
//     console.log('\n=== Post-migration validation ===\n');
//
//     type CountRow = RowDataPacket & { cnt: number };
//     const queryCount = async (
//       conn: mysql.Connection,
//       sql: string,
//     ): Promise<number> => {
//       const [rows] = await conn.query<CountRow[]>(sql);
//       return Number(rows[0].cnt);
//     };
//
//     const tablePairs: Array<{
//       old: string;
//       new: string | null;
//       oldOptional?: boolean;
//     }> = [
//       { old: 'bringit_product_type', new: 'product_type' },
//       { old: 'bringit_business_product_types', new: 'business_product_types' },
//       { old: 'bringit_products', new: 'products' },
//       { old: 'bringit_folders', new: 'folders' },
//       { old: 'bringit_folders_products', new: 'folders_products' },
//       { old: 'bringit_product_categories', new: 'modifier_groups' },
//       {
//         old: 'bringit_products_in_categories',
//         new: 'modifiers',
//       },
//       { old: 'bringit_product_deal_items', new: 'product_deal_items' },
//       {
//         old: 'bringit_business_disabled_toppings',
//         new: 'business_disabled_toppings',
//       },
//       { old: 'bringit_products_alerts', new: 'products_alerts' },
//       { old: 'bringit_pizza', new: 'pizza' },
//       { old: 'bringit_topping', new: 'topping' },
//       { old: 'bringit_drink', new: 'drink' },
//       { old: 'bringit_additionaloffer', new: null, oldOptional: true },
//       { old: 'bringit_icons', new: 'icons' },
//     ];
//
//     console.log('Row count comparison:');
//     console.log(
//       `${'Old Table'.padEnd(42)} ${'Old'.padStart(7)} ${'New'.padStart(7)} ${'New Table'.padEnd(30)}`,
//     );
//     console.log('-'.repeat(92));
//
//     let hasCountMismatch = false;
//     for (const pair of tablePairs) {
//       if (pair.oldOptional && !(await mysqlTableExists(oldDb, pair.old))) {
//         console.log(
//           `${pair.old.padEnd(42)} ${'n/a'.padStart(7)} ${'n/a'.padStart(7)} ${'(optional, absent)'.padEnd(30)}`,
//         );
//         continue;
//       }
//       const oldCnt = await queryCount(
//         oldDb,
//         `SELECT COUNT(*) as cnt FROM ${pair.old}`,
//       );
//       if (pair.new == null) {
//         console.log(
//           `${pair.old.padEnd(42)} ${String(oldCnt).padStart(7)} ${'(dropped)'.padStart(7)}`,
//         );
//         continue;
//       }
//       const newCnt = await queryCount(
//         newDb,
//         `SELECT COUNT(*) as cnt FROM ${pair.new}`,
//       );
//       const marker = oldCnt !== newCnt ? ' ⚠' : ' ✓';
//       if (oldCnt !== newCnt) hasCountMismatch = true;
//       console.log(
//         `${pair.old.padEnd(42)} ${String(oldCnt).padStart(7)} ${String(newCnt).padStart(7)} ${pair.new.padEnd(30)}${marker}`,
//       );
//     }
//
//     const menuOldTables = [
//       'bringit_business_mobile_menu',
//       'bringit_business_desktop_menu',
//       'bringit_business_kiosk_menu',
//       'bringit_business_digital_menu',
//     ];
//     let totalMenuOld = 0;
//     for (const t of menuOldTables) {
//       totalMenuOld += await queryCount(
//         oldDb,
//         `SELECT COUNT(*) as cnt FROM ${t}`,
//       );
//     }
//     const menuNewCnt = await queryCount(
//       newDb,
//       'SELECT COUNT(*) as cnt FROM business_menu',
//     );
//     const menuMarker = totalMenuOld !== menuNewCnt ? ' ⚠' : ' ✓';
//     if (totalMenuOld !== menuNewCnt) hasCountMismatch = true;
//     console.log(
//       `${'bringit_business_*_menu (4 tables)'.padEnd(42)} ${String(totalMenuOld).padStart(7)} ${String(menuNewCnt).padStart(7)} ${'business_menu'.padEnd(30)}${menuMarker}`,
//     );
//
//     if (hasCountMismatch) {
//       console.warn(
//         '\n⚠ Row count mismatches detected. Some rows were skipped due to missing FK references (see warnings above).',
//       );
//     }
//
//     console.log('\nFK integrity checks:');
//     const fkChecks: Array<{ label: string; query: string }> = [
//       {
//         label: 'products -> business_product_types',
//         query: `SELECT COUNT(*) as cnt FROM products p LEFT JOIN business_product_types bpt ON p.business_product_type_id = bpt.id WHERE bpt.id IS NULL`,
//       },
//       {
//         label: 'products -> product_deal_items (nullable)',
//         query: `SELECT COUNT(*) as cnt FROM products p LEFT JOIN product_deal_items pdi ON p.product_deal_item_id = pdi.id WHERE p.product_deal_item_id IS NOT NULL AND pdi.id IS NULL`,
//       },
//       {
//         label: 'business_product_types -> product_type',
//         query: `SELECT COUNT(*) as cnt FROM business_product_types bpt LEFT JOIN product_type pt ON bpt.product_type_id = pt.id WHERE pt.id IS NULL`,
//       },
//       {
//         label: 'folders_products -> folders (nullable)',
//         query: `SELECT COUNT(*) as cnt FROM folders_products fp LEFT JOIN folders f ON fp.folder_id = f.id WHERE fp.folder_id IS NOT NULL AND f.id IS NULL`,
//       },
//       {
//         label: 'folders_products -> products',
//         query: `SELECT COUNT(*) as cnt FROM folders_products fp LEFT JOIN products p ON fp.product_id = p.id WHERE p.id IS NULL`,
//       },
//       {
//         label: 'modifier_groups -> products',
//         query: `SELECT COUNT(*) as cnt FROM modifier_groups mg LEFT JOIN products p ON mg.category_product_id = p.id WHERE p.id IS NULL`,
//       },
//       {
//         label: 'modifiers -> modifier_groups',
//         query: `SELECT COUNT(*) as cnt FROM modifiers m LEFT JOIN modifier_groups mg ON m.product_category_id = mg.id WHERE mg.id IS NULL`,
//       },
//       {
//         label: 'product_deal_items -> products (deal)',
//         query: `SELECT COUNT(*) as cnt FROM product_deal_items pdi LEFT JOIN products p ON pdi.item_deal_id = p.id WHERE p.id IS NULL`,
//       },
//       {
//         label: 'product_deal_items -> business_product_types',
//         query: `SELECT COUNT(*) as cnt FROM product_deal_items pdi LEFT JOIN business_product_types bpt ON pdi.item_type_id = bpt.id WHERE bpt.id IS NULL`,
//       },
//     ];
//
//     let hasFkIssues = false;
//     for (const check of fkChecks) {
//       const cnt = await queryCount(newDb, check.query);
//       const ok = cnt === 0;
//       if (!ok) hasFkIssues = true;
//       console.log(
//         `  ${ok ? '✓' : '✗'} ${check.label}: ${ok ? 'OK' : `${cnt} orphaned rows`}`,
//       );
//     }
//
//     if (hasFkIssues) {
//       console.error('\n✗ FK integrity issues found. Review the data above.');
//     } else {
//       console.log('\n✓ All FK integrity checks passed.');
//     }
//
//     console.log('\nDone.');
//   } catch (e) {
//     console.error(e);
//     process.exit(1);
//   } finally {
//     await oldDb.end();
//     await newDb.end();
//   }
// }
//
// void main();
