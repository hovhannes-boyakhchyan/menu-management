import { PizzaShape } from '@prisma/client';
import type { LocalizedText } from '@bringit/contracts';

export type PizzaTemplateSeed = {
  name: LocalizedText;
  position: number;
  metadata: { shape: PizzaShape };
  imageFileId: string;
  imageUrl: string;
};

export const PIZZA_TEMPLATES: PizzaTemplateSeed[] = [
  {
    name: { he: 'פיצה ענקית', en: 'Giant Pizza', ru: 'Гигантская пицца' },
    position: 1,
    metadata: { shape: PizzaShape.round },
    imageFileId: '6a2d52e55c7cd75eb884a742',
    imageUrl: 'https://ik.imagekit.io/bringit/pizza/giantSize.png',
  },
  {
    name: { he: 'פיצה משפחתית', en: 'Family Pizza', ru: 'Семейная пицца' },
    position: 2,
    metadata: { shape: PizzaShape.round },
    imageFileId: '6a2d52e75c7cd75eb884ac11',
    imageUrl: 'https://ik.imagekit.io/bringit/pizza/familySize.png',
  },
  {
    name: { he: 'פיצה בינונית', en: 'Medium Pizza', ru: 'Средняя пицца' },
    position: 3,
    metadata: { shape: PizzaShape.round },
    imageFileId: '6a2d52e85c7cd75eb884af9d',
    imageUrl: 'https://ik.imagekit.io/bringit/pizza/familySizeMd.png',
  },
  {
    name: { he: 'פיצה אישית', en: 'Personal Pizza', ru: 'Персональная пицца' },
    position: 4,
    metadata: { shape: PizzaShape.round },
    imageFileId: '6a2d52e95c7cd75eb884b245',
    imageUrl: 'https://ik.imagekit.io/bringit/pizza/smallSize.png',
  },
  {
    name: {
      he: 'פיצה חצי מטר',
      en: 'Half-Meter Pizza',
      ru: 'Полуметровая пицца',
    },
    position: 5,
    metadata: { shape: PizzaShape.rectangular },
    imageFileId: '6a2d52ea5c7cd75eb884b560',
    imageUrl: 'https://ik.imagekit.io/bringit/pizza/rectangle.png',
  },
  {
    name: { he: 'פיצה מטר', en: 'Meter Pizza', ru: 'Метровая пицца' },
    position: 6,
    metadata: { shape: PizzaShape.rectangular },
    imageFileId: '6a2d52ea5c7cd75eb884b560',
    imageUrl: 'https://ik.imagekit.io/bringit/pizza/rectangle.png',
  },
  {
    name: {
      he: 'פיצה משפחתית ללא גלוטן',
      en: 'Gluten-Free Family Pizza',
      ru: 'Семейная пицца без глютена',
    },
    position: 7,
    metadata: { shape: PizzaShape.round },
    imageFileId: '6a2d52e75c7cd75eb884ac11',
    imageUrl: 'https://ik.imagekit.io/bringit/pizza/familySize.png',
  },
];
