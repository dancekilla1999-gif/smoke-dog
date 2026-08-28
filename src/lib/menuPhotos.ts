/**
 * Пул фото для нижнего баннера страницы «Меню» (`Menu.tsx`).
 * При переключении категории баннер показывает случайное фото из пула,
 * подобранного под смысл категории — так, чтобы «Закуски», «Бар» и
 * «Горячие блюда» визуально отличались друг от друга.
 *
 * Все изображения — из уже существующей библиотеки сайта
 * (`public/images/menu/`, `public/images/gallery/`), новых фото не добавлено.
 */

import type { MenuCategory } from "./data";

export interface MenuPhoto {
  src: string;
  alt: string;
}

type Filter = "Все" | MenuCategory;

const starters: MenuPhoto[] = [
  { src: "/images/menu/food-antipasti.jpg", alt: "Ассорти антипасти — подача Смок Дог" },
  { src: "/images/menu/food-charcuterie.jpg", alt: "Мясная тарелка" },
  { src: "/images/menu/food-asparagus.jpg", alt: "Спаржа на гриле" },
];

const salads: MenuPhoto[] = [
  { src: "/images/menu/salad-greek.jpg", alt: "Греческий салат" },
  { src: "/images/menu/food-asparagus.jpg", alt: "Спаржа на гриле" },
];

const mains: MenuPhoto[] = [
  { src: "/images/menu/food-steak.jpg", alt: "Стейк — подача Смок Дог" },
  { src: "/images/menu/food-mushroom-cream.jpg", alt: "Крем-суп с грибами" },
];

const pizza: MenuPhoto[] = [
  { src: "/images/menu/banner-pizza.jpg", alt: "Пицца четыре сыра с бураттой" },
  { src: "/images/menu/food-charcuterie.jpg", alt: "Мясная тарелка" },
];

const pasta: MenuPhoto[] = [
  { src: "/images/menu/pasta-mushroom.jpg", alt: "Паста с грибами" },
  { src: "/images/menu/food-mushroom-cream.jpg", alt: "Крем-суп с грибами" },
];

const rolls: MenuPhoto[] = [
  { src: "/images/menu/food-sushi-set.jpg", alt: "Сет роллов — подача Смок Дог" },
];

const desserts: MenuPhoto[] = [
  { src: "/images/menu/dessert-fondant.jpg", alt: "Шоколадный фондан" },
  { src: "/images/menu/food-cheesecake.jpg", alt: "Чизкейк" },
  { src: "/images/menu/food-fruit-plate.jpg", alt: "Фруктовая тарелка" },
];

const bar: MenuPhoto[] = [
  { src: "/images/gallery/mirror-arches.jpg", alt: "Барная зона Смок Дог" },
  { src: "/images/gallery/bar-candles.jpg", alt: "Лаундж-зона со статуей бульдога" },
];

const all: MenuPhoto[] = [
  ...starters,
  ...salads,
  ...mains,
  ...pizza,
  ...pasta,
  ...rolls,
  ...desserts,
  ...bar,
].filter((photo, i, arr) => arr.findIndex((p) => p.src === photo.src) === i);

export const menuPhotoPools: Record<Filter, MenuPhoto[]> = {
  "Все": all,
  "Кальян": bar,
  "Холодные закуски": starters,
  "Салаты": salads,
  "Горячие закуски": starters,
  "Супы": mains,
  "Горячие блюда": mains,
  "Гриль": mains,
  "Пасты": pasta,
  "Бургеры": mains,
  "Пиццы": pizza,
  "Роллы / Гунканы": rolls,
  "Гарниры": mains,
  "Соусы": mains,
  "Десерты": desserts,
  "Бар": bar,
};

/** Случайное фото из пула категории, по возможности отличное от предыдущего. */
export function pickMenuPhoto(filter: Filter, exclude?: string): MenuPhoto {
  const pool = menuPhotoPools[filter] ?? all;
  const candidates = exclude && pool.length > 1 ? pool.filter((p) => p.src !== exclude) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
