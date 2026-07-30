export type ProductTypeSizeDefault = {
  name: string;
  code?: string | null;
  position: number;
};

export type ProductTypeSeed = {
  typeName: string;
  defaultSizes: ProductTypeSizeDefault[] | null;
};

export const PRODUCT_TYPES: ProductTypeSeed[] = [
  {
    typeName: 'pizza',
    defaultSizes: [
      { name: 'Small', code: 'S', position: 0 },
      { name: 'Medium', code: 'M', position: 1 },
      { name: 'Large', code: 'L', position: 2 },
      { name: 'Extra Large', code: 'XL', position: 3 },
    ],
  },
  {
    typeName: 'drink',
    defaultSizes: [
      { name: '330ml', code: '330', position: 0 },
      { name: '500ml', code: '500', position: 1 },
      { name: '1.5L', code: '1500', position: 2 },
    ],
  },
  { typeName: 'additionalOffer', defaultSizes: null },
  { typeName: 'additionalCharge', defaultSizes: null },
  { typeName: 'topping', defaultSizes: null },
  { typeName: 'sushi', defaultSizes: null },
  {
    typeName: 'burger',
    defaultSizes: [
      { name: 'Single', code: '1', position: 0 },
      { name: 'Double', code: '2', position: 1 },
      { name: 'Triple', code: '3', position: 2 },
    ],
  },
  {
    typeName: 'shawarma',
    defaultSizes: [
      { name: 'Pita', code: 'PIT', position: 0 },
      { name: 'Lafa', code: 'LAF', position: 1 },
      { name: 'Plate', code: 'PLT', position: 2 },
    ],
  },
  { typeName: 'sandwich', defaultSizes: null },
  { typeName: 'salad', defaultSizes: null },
  { typeName: 'flower', defaultSizes: null },
  { typeName: 'pasta', defaultSizes: null },
  { typeName: 'dessert', defaultSizes: null },
  { typeName: 'appetizer', defaultSizes: null },
  { typeName: 'general', defaultSizes: null },
  { typeName: 'sauce', defaultSizes: null },
  { typeName: 'pasterias', defaultSizes: null },
  { typeName: 'toast', defaultSizes: null },
  { typeName: 'pasta_ravioli', defaultSizes: null },
  { typeName: 'taco', defaultSizes: null },
];
