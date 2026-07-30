import 'dotenv/config';
import { MenuItemAvailability, PizzaShape, Prisma } from '@prisma/client';
import type { LocalizedText } from '@bringit/contracts';
import { createSeedPrismaClient } from './prisma-client';

const LOCATION_ID = '6354aec2-b295-48d3-a46b-274f287fe6c9';

const prisma = createSeedPrismaClient();

const TR: Record<string, { he: string; ru: string }> = {
  // type labels (plural)
  Pizzas: { he: 'פיצות', ru: 'Пиццы' },
  Burgers: { he: 'המבורגרים', ru: 'Бургеры' },
  Shawarma: { he: 'שווארמה', ru: 'Шаурма' },
  Drinks: { he: 'משקאות', ru: 'Напитки' },
  Sandwiches: { he: 'כריכים', ru: 'Сэндвичи' },
  Salads: { he: 'סלטים', ru: 'Салаты' },
  Sushi: { he: 'סושי', ru: 'Суши' },
  Desserts: { he: 'קינוחים', ru: 'Десерты' },
  Pasta: { he: 'פסטה', ru: 'Паста' },
  Sauces: { he: 'רטבים', ru: 'Соусы' },
  // type singulars
  Pizza: { he: 'פיצה', ru: 'Пицца' },
  Burger: { he: 'המבורגר', ru: 'Бургер' },
  Drink: { he: 'משקה', ru: 'Напиток' },
  Sandwich: { he: 'כריך', ru: 'Сэндвич' },
  Salad: { he: 'סלט', ru: 'Салат' },
  Dessert: { he: 'קינוח', ru: 'Десерт' },
  Sauce: { he: 'רוטב', ru: 'Соус' },
  // sizes
  Small: { he: 'קטן', ru: 'Маленький' },
  Medium: { he: 'בינוני', ru: 'Средний' },
  Large: { he: 'גדול', ru: 'Большой' },
  'Extra Large': { he: 'גדול במיוחד', ru: 'Очень большой' },
  Single: { he: 'בודד', ru: 'Одинарный' },
  Double: { he: 'כפול', ru: 'Двойной' },
  Triple: { he: 'משולש', ru: 'Тройной' },
  Pita: { he: 'פיתה', ru: 'Пита' },
  Lafa: { he: 'לאפה', ru: 'Лафа' },
  Plate: { he: 'צלחת', ru: 'Тарелка' },
  '330ml': { he: '330 מ"ל', ru: '330 мл' },
  '500ml': { he: '500 מ"ל', ru: '500 мл' },
  '1.5L': { he: '1.5 ליטר', ru: '1.5 л' },
  // pizza flavors
  Margherita: { he: 'מרגריטה', ru: 'Маргарита' },
  Pepperoni: { he: 'פפרוני', ru: 'Пепперони' },
  'Four Cheese': { he: 'ארבע גבינות', ru: 'Четыре сыра' },
  Veggie: { he: 'ירקות', ru: 'Овощная' },
  Mushroom: { he: 'פטריות', ru: 'Грибная' },
  Tuna: { he: 'טונה', ru: 'Тунец' },
  Bulgarian: { he: 'בולגרית', ru: 'Болгарская' },
  Spicy: { he: 'חריף', ru: 'Острый' },
  Hawaiian: { he: 'הוואית', ru: 'Гавайская' },
  'BBQ Chicken': { he: 'עוף ברביקיו', ru: 'Курица барбекю' },
  'Meat Lovers': { he: 'אוהבי בשר', ru: 'Мясная' },
  Greek: { he: 'יווני', ru: 'Греческий' },
  Pesto: { he: 'פסטו', ru: 'Песто' },
  Truffle: { he: 'כמהין', ru: 'Трюфельная' },
  Buffalo: { he: 'באפלו', ru: 'Буффало' },
  White: { he: 'לבנה', ru: 'Белая' },
  Onion: { he: 'בצל', ru: 'Лук' },
  Salami: { he: 'סלמי', ru: 'Салями' },
  // burger flavors
  Classic: { he: 'קלאסי', ru: 'Классический' },
  Cheeseburger: { he: 'צ׳יזבורגר', ru: 'Чизбургер' },
  Bacon: { he: 'בייקון', ru: 'Бекон' },
  Vegan: { he: 'טבעוני', ru: 'Веганский' },
  BBQ: { he: 'ברביקיו', ru: 'Барбекю' },
  'Blue Cheese': { he: 'גבינה כחולה', ru: 'Голубой сыр' },
  Chicken: { he: 'עוף', ru: 'Курица' },
  Fish: { he: 'דג', ru: 'Рыба' },
  Smash: { he: 'סמאש', ru: 'Смэш' },
  Teriyaki: { he: 'טריאקי', ru: 'Терияки' },
  Jalapeño: { he: 'חלפיניו', ru: 'Халапеньо' },
  // shawarma flavors
  Armenian: { he: 'ארמנית', ru: 'Армянская' },
  Lamb: { he: 'טלה', ru: 'Баранина' },
  Mixed: { he: 'מעורב', ru: 'Ассорти' },
  Beef: { he: 'בקר', ru: 'Говядина' },
  'Spicy Armenian': { he: 'ארמנית חריפה', ru: 'Армянская острая' },
  'Laffa Special': { he: 'לאפה מיוחדת', ru: 'Лафа специальная' },
  'Plate Deluxe': { he: 'צלחת דלוקס', ru: 'Тарелка делюкс' },
  // drink flavors
  'Coca Cola': { he: 'קוקה קולה', ru: 'Кока-Кола' },
  Sprite: { he: 'ספרייט', ru: 'Спрайт' },
  Fanta: { he: 'פנטה', ru: 'Фанта' },
  Water: { he: 'מים', ru: 'Вода' },
  'Orange Juice': { he: 'מיץ תפוזים', ru: 'Апельсиновый сок' },
  Beer: { he: 'בירה', ru: 'Пиво' },
  'Diet Coke': { he: 'דייט קולה', ru: 'Дайет Кола' },
  Lemonade: { he: 'לימונדה', ru: 'Лимонад' },
  'Iced Tea': { he: 'תה קר', ru: 'Холодный чай' },
  'Energy Drink': { he: 'משקה אנרגיה', ru: 'Энергетик' },
  'Soda Water': { he: 'מי סודה', ru: 'Содовая' },
  'Apple Juice': { he: 'מיץ תפוחים', ru: 'Яблочный сок' },
  'Cola Zero': { he: 'קולה זירו', ru: 'Кола Зеро' },
  Tonic: { he: 'מי טוניק', ru: 'Тоник' },
  // sandwich flavors
  Egg: { he: 'ביצה', ru: 'Яйцо' },
  Cheese: { he: 'גבינה', ru: 'Сыр' },
  Avocado: { he: 'אבוקדו', ru: 'Авокадо' },
  Omelette: { he: 'חביתה', ru: 'Омлет' },
  Club: { he: 'קלאב', ru: 'Клаб' },
  BLT: { he: 'בי.אל.טי', ru: 'БЛТ' },
  Schnitzel: { he: 'שניצל', ru: 'Шницель' },
  Caprese: { he: 'קפרזה', ru: 'Капрезе' },
  Falafel: { he: 'פלאפל', ru: 'Фалафель' },
  // salad flavors
  Caesar: { he: 'קיסר', ru: 'Цезарь' },
  Green: { he: 'ירוק', ru: 'Зелёный' },
  Quinoa: { he: 'קינואה', ru: 'Киноа' },
  Cobb: { he: 'קוב', ru: 'Кобб' },
  Beet: { he: 'סלק', ru: 'Свекольный' },
  Fattoush: { he: 'פתוש', ru: 'Фаттуш' },
  // sushi flavors
  California: { he: 'קליפורניה', ru: 'Калифорния' },
  Salmon: { he: 'סלמון', ru: 'Лосось' },
  Tempura: { he: 'טמפורה', ru: 'Темпура' },
  'Spicy Tuna': { he: 'טונה חריפה', ru: 'Острый тунец' },
  Dragon: { he: 'דרקון', ru: 'Дракон' },
  Rainbow: { he: 'קשת', ru: 'Радуга' },
  Eel: { he: 'צלופח', ru: 'Угорь' },
  Philadelphia: { he: 'פילדלפיה', ru: 'Филадельфия' },
  Crispy: { he: 'קריספי', ru: 'Хрустящий' },
  // dessert flavors
  Tiramisu: { he: 'טירמיסו', ru: 'Тирамису' },
  Brownies: { he: 'בראוניז', ru: 'Брауни' },
  'Ice Cream': { he: 'גלידה', ru: 'Мороженое' },
  Malabi: { he: 'מלבי', ru: 'Малаби' },
  Cheesecake: { he: 'עוגת גבינה', ru: 'Чизкейк' },
  'Chocolate Cake': { he: 'עוגת שוקולד', ru: 'Шоколадный торт' },
  Pancakes: { he: 'פנקייק', ru: 'Панкейки' },
  Waffle: { he: 'וופל', ru: 'Вафля' },
  'Fruit Salad': { he: 'סלט פירות', ru: 'Фруктовый салат' },
  'Crème Brûlée': { he: 'קרם ברולה', ru: 'Крем-брюле' },
  // pasta flavors
  Bolognese: { he: 'בולונז', ru: 'Болоньезе' },
  Alfredo: { he: 'אלפרדו', ru: 'Альфредо' },
  Rosé: { he: 'רוזה', ru: 'Розе' },
  Arrabbiata: { he: 'אַרַבְּיָאטָה', ru: 'Аррабьята' },
  Carbonara: { he: 'קרבונרה', ru: 'Карбонара' },
  'Mac & Cheese': { he: 'מק אנד צ׳יז', ru: 'Макароны с сыром' },
  Primavera: { he: 'פרימוורה', ru: 'Примавера' },
  Ravioli: { he: 'רביולי', ru: 'Равиоли' },
  Lasagna: { he: 'לזניה', ru: 'Лазанья' },
  // sauce flavors
  Garlic: { he: 'שום', ru: 'Чесночный' },
  'Sweet Chili': { he: 'צ׳ילי מתוק', ru: 'Сладкий чили' },
  Mayo: { he: 'מיונז', ru: 'Майонез' },
  Ketchup: { he: 'קטשופ', ru: 'Кетчуп' },
  Tahini: { he: 'טחינה', ru: 'Тахини' },
  Aioli: { he: 'איולי', ru: 'Айоли' },
  Hummus: { he: 'חומוס', ru: 'Хумус' },
  'Hot Sauce': { he: 'רוטב חריף', ru: 'Острый соус' },
  // modifiers
  Extras: { he: 'תוספות', ru: 'Добавки' },
  Olives: { he: 'זיתים', ru: 'Оливки' },
  Mushrooms: { he: 'פטריות', ru: 'Грибы' },
  // combo names
  'Pizza Meal': { he: 'ארוחת פיצה', ru: 'Пицца-комбо' },
  'Burger Meal': { he: 'ארוחת המבורגר', ru: 'Бургер-комбо' },
  'Family Combo': { he: 'קומבו משפחתי', ru: 'Семейное комбо' },
  'Sushi Meal': { he: 'ארוחת סושי', ru: 'Суши-комбо' },
  "Couple's Meal": { he: 'ארוחה זוגית', ru: 'Комбо для двоих' },
  'Lunch Special': { he: 'מבצע צהריים', ru: 'Бизнес-ланч' },
  'Pasta Combo': { he: 'קומבו פסטה', ru: 'Паста-комбо' },
  'Sushi Platter': { he: 'מגש סושי', ru: 'Суши-сет' },
  'Veggie Box': { he: 'בוקס ירקות', ru: 'Овощной бокс' },
  'Kids Meal': { he: 'ארוחת ילדים', ru: 'Детское комбо' },
  'Mega Combo': { he: 'מגה קומבו', ru: 'Мега комбо' },
  'Drinks Bundle': { he: 'מארז משקאות', ru: 'Набор напитков' },
  // slot titles
  'Choose Pizza': { he: 'בחר פיצה', ru: 'Выберите пиццу' },
  'Choose Drink': { he: 'בחר משקה', ru: 'Выберите напиток' },
  Sides: { he: 'תוספות', ru: 'Гарниры' },
  'Sushi Rolls': { he: 'רולים', ru: 'Роллы' },
  Starter: { he: 'מנה ראשונה', ru: 'Закуска' },
  Main: { he: 'מנה עיקרית', ru: 'Основное блюдо' },
  Rolls: { he: 'רולים', ru: 'Роллы' },
  'Pick Drinks': { he: 'בחר משקאות', ru: 'Выберите напитки' },
  // category
  Combo: { he: 'קומבו', ru: 'Комбо' },
};

const tr = (en: string): LocalizedText => {
  const t = TR[en];
  return t ? { he: t.he, en, ru: t.ru } : { he: en, en, ru: en };
};

// Compose "<flavor> <type>" with natural per-language word order.
const productName = (flavor: string, type: string): LocalizedText => {
  const f = tr(flavor);
  const t = tr(type);
  return {
    he: `${t.he} ${f.he}`,
    en: `${f.en} ${t.en}`,
    ru: `${t.ru} ${f.ru}`,
  };
};

const sampleDescription = (flavor: string): LocalizedText => {
  const f = tr(flavor);
  return {
    he: `${f.he} - תיאור לדוגמה`,
    en: `${flavor} - sample description`,
    ru: `${f.ru} - пример описания`,
  };
};

const comboDescription = (name: string): LocalizedText => {
  const n = tr(name);
  return {
    he: `${n.he} קומבו`,
    en: `${name} combo`,
    ru: `${n.ru} комбо`,
  };
};

function unsplash(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`;
}

type Image = { imageUrl: string | null; imageFileId: string | null };

function pickImage(ids: string[], i: number): Image {
  if (i % 6 === 0) return { imageUrl: null, imageFileId: null };
  return { imageUrl: unsplash(ids[i % ids.length]), imageFileId: null };
}

const COMBO_IMAGES = [
  '1504674900247-0877df9cc836',
  '1565299624946-b28f40a0ae38',
  '1568901346375-23c9450c58cd',
];

const MODIFIER_IMAGES = [
  '1486297678162-eb2a19b0a32d',
  '1546069901-ba9599a7e63c',
  '1502741224143-90386d7f8c82',
];

const AVAILABILITY_CYCLE: MenuItemAvailability[] = [
  MenuItemAvailability.available,
  MenuItemAvailability.available,
  MenuItemAvailability.sold_out,
  MenuItemAvailability.sold_out_today,
];

function priceFor(i: number): number {
  return 1500 + ((i * 137) % 7000);
}

type SizeDef = { name: string; code: string };

type TypeDef = {
  type: string;
  label: string;
  singular: string;
  icon: string;
  images: string[];
  sizes?: SizeDef[];
  shape?: boolean;
  products: string[];
};

const TYPE_DEFS: TypeDef[] = [
  {
    type: 'pizza',
    label: 'Pizzas',
    singular: 'Pizza',
    icon: 'pizza1',
    shape: true,
    images: [
      '1513104890138-7c749659a591',
      '1565299624946-b28f40a0ae38',
      '1574071318508-1cdbab80d002',
    ],
    sizes: [
      { name: 'Small', code: 'S' },
      { name: 'Medium', code: 'M' },
      { name: 'Large', code: 'L' },
      { name: 'Extra Large', code: 'XL' },
    ],
    products: [
      'Margherita',
      'Pepperoni',
      'Four Cheese',
      'Veggie',
      'Mushroom',
      'Tuna',
      'Bulgarian',
      'Spicy',
      'Hawaiian',
      'BBQ Chicken',
      'Meat Lovers',
      'Greek',
      'Pesto',
      'Truffle',
      'Buffalo',
      'White',
      'Onion',
      'Salami',
    ],
  },
  {
    type: 'burger',
    label: 'Burgers',
    singular: 'Burger',
    icon: 'hamburguer1',
    images: [
      '1568901346375-23c9450c58cd',
      '1571091718767-18b5b1457add',
      '1550547660-d9450f859349',
    ],
    sizes: [
      { name: 'Single', code: '1' },
      { name: 'Double', code: '2' },
      { name: 'Triple', code: '3' },
    ],
    products: [
      'Classic',
      'Cheeseburger',
      'Bacon',
      'Double',
      'Spicy',
      'Vegan',
      'Mushroom',
      'BBQ',
      'Blue Cheese',
      'Chicken',
      'Fish',
      'Smash',
      'Teriyaki',
      'Jalapeño',
    ],
  },
  {
    type: 'shawarma',
    label: 'Shawarma',
    singular: 'Shawarma',
    icon: 'shawarma1',
    images: ['1529006557810-274b9b2fc783', '1633321702518-7feccafb94d5'],
    sizes: [
      { name: 'Pita', code: 'PIT' },
      { name: 'Lafa', code: 'LAF' },
      { name: 'Plate', code: 'PLT' },
    ],
    products: [
      'Armenian',
      'Lamb',
      'Mixed',
      'Chicken',
      'Beef',
      'Spicy Armenian',
      'Laffa Special',
      'Plate Deluxe',
    ],
  },
  {
    type: 'drink',
    label: 'Drinks',
    singular: 'Drink',
    icon: 'drinks1',
    images: ['1581006852262-e4307cf6283a', '1437418747212-8d9709afab22'],
    sizes: [
      { name: '330ml', code: '330' },
      { name: '500ml', code: '500' },
      { name: '1.5L', code: '1500' },
    ],
    products: [
      'Coca Cola',
      'Sprite',
      'Fanta',
      'Water',
      'Orange Juice',
      'Beer',
      'Diet Coke',
      'Lemonade',
      'Iced Tea',
      'Energy Drink',
      'Soda Water',
      'Apple Juice',
      'Cola Zero',
      'Tonic',
    ],
  },
  {
    type: 'sandwich',
    label: 'Sandwiches',
    singular: 'Sandwich',
    icon: 'sandwich1',
    images: ['1539252554453-80ab65ce3586', '1528735602780-2552fd46c7af'],
    products: [
      'Tuna',
      'Egg',
      'Cheese',
      'Avocado',
      'Omelette',
      'Club',
      'BLT',
      'Schnitzel',
      'Caprese',
      'Falafel',
    ],
  },
  {
    type: 'salad',
    label: 'Salads',
    singular: 'Salad',
    icon: 'salad1',
    images: ['1512621776951-a57141f2eefd', '1546069901-ba9599a7e63c'],
    products: [
      'Greek',
      'Caesar',
      'Green',
      'Quinoa',
      'Tuna',
      'Cobb',
      'Beet',
      'Pasta',
      'Fattoush',
      'Caprese',
    ],
  },
  {
    type: 'sushi',
    label: 'Sushi',
    singular: 'Sushi',
    icon: 'sushi1',
    images: ['1579871494447-9811cf80d66c', '1611143669185-af224c5e3252'],
    products: [
      'California',
      'Salmon',
      'Tuna',
      'Tempura',
      'Veggie',
      'Spicy Tuna',
      'Dragon',
      'Rainbow',
      'Eel',
      'Philadelphia',
      'Avocado',
      'Crispy',
    ],
  },
  {
    type: 'dessert',
    label: 'Desserts',
    singular: 'Dessert',
    icon: 'dessert1',
    images: ['1551024601-bec78aea704b', '1488477181946-6428a0291777'],
    products: [
      'Tiramisu',
      'Brownies',
      'Ice Cream',
      'Malabi',
      'Cheesecake',
      'Chocolate Cake',
      'Pancakes',
      'Waffle',
      'Fruit Salad',
      'Crème Brûlée',
    ],
  },
  {
    type: 'pasta',
    label: 'Pasta',
    singular: 'Pasta',
    icon: 'spaguetti1',
    images: ['1551892374-ecf8754cf8b0', '1621996346565-e3dbc646d9a9'],
    products: [
      'Bolognese',
      'Alfredo',
      'Rosé',
      'Pesto',
      'Arrabbiata',
      'Carbonara',
      'Mac & Cheese',
      'Primavera',
      'Ravioli',
      'Lasagna',
    ],
  },
  {
    type: 'sauce',
    label: 'Sauces',
    singular: 'Sauce',
    icon: 'sauce1',
    images: ['1472476443507-c7a5948772fc', '1466637574441-749b8f19452f'],
    products: [
      'Garlic',
      'Sweet Chili',
      'Mayo',
      'Ketchup',
      'Tahini',
      'BBQ',
      'Aioli',
      'Hummus',
      'Pesto',
      'Hot Sauce',
    ],
  },
];

type CreatedProduct = { id: string; name: string; price: number };

async function cleanup(): Promise<void> {
  await prisma.$transaction([
    prisma.categoryItem.deleteMany({
      where: { category: { locationId: LOCATION_ID } },
    }),
    prisma.category.deleteMany({ where: { locationId: LOCATION_ID } }),
    prisma.comboSlotChoice.deleteMany({
      where: { slot: { combo: { locationId: LOCATION_ID } } },
    }),
    prisma.comboSlot.deleteMany({
      where: { combo: { locationId: LOCATION_ID } },
    }),
    prisma.combo.deleteMany({ where: { locationId: LOCATION_ID } }),
    prisma.modifier.deleteMany({
      where: { modifierGroup: { product: { locationId: LOCATION_ID } } },
    }),
    prisma.modifierGroup.deleteMany({
      where: { product: { locationId: LOCATION_ID } },
    }),
    prisma.product.deleteMany({ where: { locationId: LOCATION_ID } }),
    prisma.productTypeSize.deleteMany({
      where: { locationProductType: { locationId: LOCATION_ID } },
    }),
    prisma.locationProductType.deleteMany({
      where: { locationId: LOCATION_ID },
    }),
    prisma.folder.deleteMany({ where: { locationId: LOCATION_ID } }),
  ]);
  console.log(`Cleaned existing menu data for location ${LOCATION_ID}`);
}

async function getProductTypeIds(): Promise<Map<string, string>> {
  const names = TYPE_DEFS.map((t) => t.type);
  const rows = await prisma.productType.findMany({
    where: { typeName: { in: names } },
    select: { id: true, typeName: true },
  });
  const map = new Map(rows.map((r) => [r.typeName, r.id]));
  const missing = names.filter((n) => !map.has(n));
  if (missing.length) {
    throw new Error(
      `Missing global product types: ${missing.join(', ')}. Run the main seed first (npm run seed / prisma db seed).`,
    );
  }
  return map;
}

async function getIconIds(): Promise<Map<string, string>> {
  const names = TYPE_DEFS.map((t) => t.icon);
  const rows = await prisma.icon.findMany({
    where: { name: { in: names } },
    select: { id: true, name: true },
  });
  return new Map(rows.map((r) => [r.name, r.id]));
}

async function createFolders(): Promise<{ root: string[]; deals: string }> {
  const drinks = await prisma.folder.create({
    data: {
      locationId: LOCATION_ID,
      name: 'Drinks',
      position: 0,
      color: '#3498DB',
    },
  });
  const deals = await prisma.folder.create({
    data: {
      locationId: LOCATION_ID,
      name: 'Combos',
      position: 1,
      color: '#27AE60',
    },
  });
  return { root: [drinks.id, deals.id], deals: deals.id };
}

async function main(): Promise<void> {
  console.log(`Generating test menu for location ${LOCATION_ID} ...`);

  await cleanup();

  const productTypeIds = await getProductTypeIds();
  const iconIds = await getIconIds();
  const folders = await createFolders();
  const folderPool = [...folders.root, null];

  let imageCounter = 0;
  let productCounter = 0;

  const lptByType = new Map<string, string>();
  const productsByType = new Map<string, CreatedProduct[]>();

  for (const def of TYPE_DEFS) {
    const lpt = await prisma.locationProductType.create({
      data: {
        locationId: LOCATION_ID,
        productTypeId: productTypeIds.get(def.type)!,
        name: tr(def.label),
        iconId: iconIds.get(def.icon) ?? null,
      },
    });
    lptByType.set(def.type, lpt.id);

    const sizeMap = new Map<string, string>();
    if (def.sizes) {
      for (let s = 0; s < def.sizes.length; s++) {
        const size = def.sizes[s];
        const row = await prisma.productTypeSize.create({
          data: {
            locationProductTypeId: lpt.id,
            name: tr(size.name),
            code: size.code,
            position: s,
          },
        });
        sizeMap.set(size.name, row.id);
      }
    }

    const created: CreatedProduct[] = [];
    const sizeIds = [...sizeMap.values()];
    for (let p = 0; p < def.products.length; p++) {
      const i = productCounter++;
      const image = pickImage(def.images, imageCounter++);
      const availability = AVAILABILITY_CYCLE[i % AVAILABILITY_CYCLE.length];
      const price = priceFor(i);
      const sizeId = sizeIds.length ? sizeIds[p % sizeIds.length] : null;
      const folderId = folderPool[i % folderPool.length];
      const product = await prisma.product.create({
        data: {
          locationId: LOCATION_ID,
          locationProductTypeId: lpt.id,
          folderId,
          sizeId,
          name: productName(def.products[p], def.singular),
          description:
            p % 2 === 0 ? sampleDescription(def.products[p]) : Prisma.JsonNull,
          price,
          deliveryPrice: price + 300,
          position: p,
          availability,
          availableFrom:
            i % 9 === 0 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
          shape: def.shape
            ? p % 2 === 0
              ? PizzaShape.round
              : PizzaShape.rectangular
            : null,
          tags: p % 2 === 0 ? ['popular'] : [],
          imageFileId: image.imageFileId,
          imageUrl: image.imageUrl,
        },
      });
      created.push({
        id: product.id,
        name: (product.name as { he: string }).he,
        price,
      });

      if (p % 4 === 0) {
        const group = await prisma.modifierGroup.create({
          data: {
            productId: product.id,
            name: tr('Extras'),
            position: 0,
            minSelect: 0,
            maxSelect: 3,
            allowDuplicateModifiers: p % 8 === 0,
            isSliceable: def.shape ?? false,
            fixedPrice: 0,
            fixedPriceLimit: 0,
          },
        });
        const mods = ['Cheese', 'Onion', 'Olives', 'Mushrooms'];
        for (let m = 0; m < 3; m++) {
          const modImage = pickImage(MODIFIER_IMAGES, imageCounter++);
          await prisma.modifier.create({
            data: {
              modifierGroupId: group.id,
              name: tr(mods[m % mods.length]),
              price: 200 + m * 100,
              availability: MenuItemAvailability.available,
              imageFileId: modImage.imageFileId,
              imageUrl: modImage.imageUrl,
              tags: [],
            },
          });
        }
      }
    }
    productsByType.set(def.type, created);
  }

  const totalProducts = [...productsByType.values()].reduce(
    (acc, list) => acc + list.length,
    0,
  );
  console.log(
    `Created ${lptByType.size} location product types and ${totalProducts} products`,
  );

  type SlotSpec = {
    title: string;
    type: string;
    minSelect: number;
    maxSelect: number;
    choiceCount: number;
  };
  type ComboSpec = {
    name: string;
    slots: SlotSpec[];
    inFolder: boolean;
    withImage: boolean;
    availability: MenuItemAvailability;
  };

  const comboSpecs: ComboSpec[] = [
    {
      name: 'Pizza Meal',
      slots: [
        {
          title: 'Choose Pizza',
          type: 'pizza',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 3,
        },
        {
          title: 'Choose Drink',
          type: 'drink',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 3,
        },
      ],
      inFolder: true,
      withImage: true,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Burger Meal',
      slots: [
        {
          title: 'Burger',
          type: 'burger',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 4,
        },
        {
          title: 'Sides',
          type: 'salad',
          minSelect: 0,
          maxSelect: 2,
          choiceCount: 4,
        },
        {
          title: 'Drink',
          type: 'drink',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 4,
        },
      ],
      inFolder: false,
      withImage: true,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Family Combo',
      slots: [
        {
          title: 'Pizzas',
          type: 'pizza',
          minSelect: 1,
          maxSelect: 3,
          choiceCount: 5,
        },
        {
          title: 'Drinks',
          type: 'drink',
          minSelect: 1,
          maxSelect: 2,
          choiceCount: 3,
        },
        {
          title: 'Dessert',
          type: 'dessert',
          minSelect: 0,
          maxSelect: 1,
          choiceCount: 3,
        },
      ],
      inFolder: true,
      withImage: false,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Sushi Meal',
      slots: [
        {
          title: 'Sushi Rolls',
          type: 'sushi',
          minSelect: 2,
          maxSelect: 4,
          choiceCount: 5,
        },
      ],
      inFolder: false,
      withImage: true,
      availability: MenuItemAvailability.sold_out_today,
    },
    {
      name: "Couple's Meal",
      slots: [
        {
          title: 'Starter',
          type: 'sandwich',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 3,
        },
        {
          title: 'Main',
          type: 'shawarma',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 3,
        },
        {
          title: 'Drinks',
          type: 'drink',
          minSelect: 0,
          maxSelect: 2,
          choiceCount: 4,
        },
        {
          title: 'Dessert',
          type: 'dessert',
          minSelect: 0,
          maxSelect: 1,
          choiceCount: 3,
        },
      ],
      inFolder: false,
      withImage: true,
      availability: MenuItemAvailability.sold_out,
    },
    {
      name: 'Lunch Special',
      slots: [
        {
          title: 'Sandwich',
          type: 'sandwich',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 4,
        },
        {
          title: 'Drink',
          type: 'drink',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 4,
        },
      ],
      inFolder: true,
      withImage: true,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Pasta Combo',
      slots: [
        {
          title: 'Pasta',
          type: 'pasta',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 5,
        },
        {
          title: 'Salad',
          type: 'salad',
          minSelect: 0,
          maxSelect: 1,
          choiceCount: 4,
        },
        {
          title: 'Drink',
          type: 'drink',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 3,
        },
      ],
      inFolder: false,
      withImage: true,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Sushi Platter',
      slots: [
        {
          title: 'Rolls',
          type: 'sushi',
          minSelect: 3,
          maxSelect: 6,
          choiceCount: 8,
        },
      ],
      inFolder: true,
      withImage: true,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Veggie Box',
      slots: [
        {
          title: 'Salads',
          type: 'salad',
          minSelect: 1,
          maxSelect: 2,
          choiceCount: 5,
        },
        {
          title: 'Sauces',
          type: 'sauce',
          minSelect: 0,
          maxSelect: 2,
          choiceCount: 5,
        },
      ],
      inFolder: false,
      withImage: false,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Kids Meal',
      slots: [
        {
          title: 'Burger',
          type: 'burger',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 3,
        },
        {
          title: 'Drink',
          type: 'drink',
          minSelect: 1,
          maxSelect: 1,
          choiceCount: 3,
        },
        {
          title: 'Dessert',
          type: 'dessert',
          minSelect: 0,
          maxSelect: 1,
          choiceCount: 3,
        },
      ],
      inFolder: true,
      withImage: true,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Mega Combo',
      slots: [
        {
          title: 'Pizzas',
          type: 'pizza',
          minSelect: 2,
          maxSelect: 4,
          choiceCount: 6,
        },
        {
          title: 'Burgers',
          type: 'burger',
          minSelect: 1,
          maxSelect: 2,
          choiceCount: 5,
        },
        {
          title: 'Drinks',
          type: 'drink',
          minSelect: 2,
          maxSelect: 4,
          choiceCount: 6,
        },
        {
          title: 'Desserts',
          type: 'dessert',
          minSelect: 1,
          maxSelect: 2,
          choiceCount: 4,
        },
      ],
      inFolder: true,
      withImage: true,
      availability: MenuItemAvailability.available,
    },
    {
      name: 'Drinks Bundle',
      slots: [
        {
          title: 'Pick Drinks',
          type: 'drink',
          minSelect: 2,
          maxSelect: 6,
          choiceCount: 8,
        },
      ],
      inFolder: false,
      withImage: true,
      availability: MenuItemAvailability.available,
    },
  ];

  const createdComboIds: string[] = [];

  for (let c = 0; c < comboSpecs.length; c++) {
    const spec = comboSpecs[c];
    const basePrice = priceFor(c + 1000);
    const combo = await prisma.combo.create({
      data: {
        locationId: LOCATION_ID,
        folderId: spec.inFolder ? folders.deals : null,
        name: tr(spec.name),
        description: comboDescription(spec.name),
        price: basePrice,
        deliveryPrice: basePrice + 500,
        position: c,
        availability: spec.availability,
        imageFileId: null,
        imageUrl: spec.withImage
          ? unsplash(COMBO_IMAGES[c % COMBO_IMAGES.length])
          : null,
      },
    });
    createdComboIds.push(combo.id);

    for (let s = 0; s < spec.slots.length; s++) {
      const slotSpec = spec.slots[s];
      const allowedTypeId = lptByType.get(slotSpec.type);
      const typeProducts = productsByType.get(slotSpec.type) ?? [];
      if (!allowedTypeId || typeProducts.length === 0) continue;

      const slot = await prisma.comboSlot.create({
        data: {
          comboId: combo.id,
          allowedTypeId,
          title: tr(slotSpec.title),
          position: s,
          minSelect: slotSpec.minSelect,
          maxSelect: slotSpec.maxSelect,
        },
      });

      const choiceProducts = typeProducts.slice(0, slotSpec.choiceCount);
      for (let ch = 0; ch < choiceProducts.length; ch++) {
        await prisma.comboSlotChoice.create({
          data: {
            slotId: slot.id,
            productId: choiceProducts[ch].id,
            priceDelta: ch === 0 ? 0 : ch * 150,
            position: ch,
            isDefault: ch === 0,
          },
        });
      }
    }
  }

  const totalCombos = comboSpecs.length;
  const totalMenuItems = totalProducts + totalCombos;
  console.log(`Created ${totalCombos} combos with slots and choices`);

  // Categories: "Combo" first (all combos), then one category per product type
  const comboCategory = await prisma.category.create({
    data: { locationId: LOCATION_ID, name: tr('Combo'), position: 0 },
  });
  await prisma.categoryItem.createMany({
    data: createdComboIds.map((comboId, index) => ({
      categoryId: comboCategory.id,
      comboId,
      position: index,
    })),
  });

  let categoryPosition = 1;
  for (const def of TYPE_DEFS) {
    const products = productsByType.get(def.type) ?? [];
    if (!products.length) continue;

    const category = await prisma.category.create({
      data: {
        locationId: LOCATION_ID,
        name: tr(def.label),
        iconId: iconIds.get(def.icon) ?? null,
        position: categoryPosition++,
      },
    });
    await prisma.categoryItem.createMany({
      data: products.map((product, index) => ({
        categoryId: category.id,
        productId: product.id,
        position: index,
      })),
    });
  }

  console.log(`Created ${categoryPosition} categories (Combo + per type)`);
  console.log(
    `Total menu items: ${totalMenuItems} (${totalProducts} products + ${totalCombos} combos)`,
  );
  console.log('Test menu generation completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error generating test menu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
