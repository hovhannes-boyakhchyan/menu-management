import type { RowDataPacket } from 'mysql2/promise';

export interface ProductTypeRow extends RowDataPacket {
  type_id: number;
  type_name: string | null;
  add_date: Date | null;
}

export interface LocationProductTypeRow extends RowDataPacket {
  id: number;
  business_id: number;
  product_type_id: number;
  name: string | null;
  description: string | null;
  icon: string | null;
  deleted: number | boolean;
}

export interface PizzaRow extends RowDataPacket {
  product_id: number;
  name: string | null;
  picture: string | null;
  shape: string | null;
  uniq_for_business_id: number | null;
  status: number | boolean;
  size_order: number | null;
}

export interface ToppingRow extends RowDataPacket {
  product_id: number;
  name: string | null;
  category: string | null;
  picture: string | null;
  uniq_for_business_id: number | null;
  status: number | boolean;
  can_be_sliced: number | boolean;
  sorting: number | null;
}

export interface DrinkRow extends RowDataPacket {
  product_id: number;
  name: string | null;
  description: string | null;
  picture: string | null;
  uniq_for_business_id: number | null;
  status: number | boolean;
}

export interface ProductRow extends RowDataPacket {
  product_id: number;
  product_original_id: number | null;
  product_type_id: number;
  business_product_type_id: number;
  product_deal_item_id: number | null;
  product_name: string | null;
  product_description: string | null;
  product_picture: string | null;
  product_delivery_price: number | null;
  product_not_delivery_price: number | null;
  product_business_id: number;
  product_in_inventory: number | boolean;
  product_status: number | boolean;
  product_shape: string | null;
  kitchen_id: number | null;
}

export interface FolderRow extends RowDataPacket {
  folder_id: number;
  folder_business_id: number;
  folder_name: string | null;
  folder_father_id: number | null;
  folder_position: number | null;
  folder_status: number | boolean;
  folder_date: Date | null;
  folder_color: string | null;
}

export interface FoldersProductRow extends RowDataPacket {
  folder_id: number;
  product_id: number;
  status: number | boolean;
}

export interface ProductCategoryRow extends RowDataPacket {
  category_id: number;
  category_product_id: number;
  category_business_id: number;
  category_name: string | null;
  category_list_order: number | null;
  category_products_limit: number | null;
  category_products_fixed_price: number | null;
  category_has_fixed_price: number | boolean;
  category_fixed_price: number | null;
  category_is_topping_divided: number | boolean;
  category_is_multiple_selection: number | boolean;
  category_is_mandatory: number | boolean;
}

export interface ProductDealItemRow extends RowDataPacket {
  item_id: number;
  item_deal_id: number;
  item_type_id: number;
}

export interface ProductsInCategoriesRow extends RowDataPacket {
  product_id: number;
  product_original_id: number | null;
  product_category_id: number;
  product_name: string | null;
  product_price: number | null;
  product_in_inventory: number | boolean;
  product_picture: string | null;
  product_status: number | boolean;
}

export interface LocationDisabledToppingRow extends RowDataPacket {
  id: number;
  business_id: number;
  original_id: number;
}

export interface ProductsAlertRow extends RowDataPacket {
  product_id: number;
  business_id: number;
  alert_text: string | null;
}

export interface IconRow extends RowDataPacket {
  name: string;
}

export interface AdditionalofferRow extends RowDataPacket {
  product_id: number;
  name: string | null;
  description: string | null;
  picture: string | null;
  uniq_for_business_id: number | null;
  status: number | boolean;
}

export interface LocationMenuRow extends RowDataPacket {
  id: number;
  business_id: number;
  title: string | null;
  icon: string | null;
  parent_item_id: number | null;
  position: number | null;
  product_type_id: number | null;
  description: string | null;
  picture: string | null;
  deleted: number | boolean;
}
