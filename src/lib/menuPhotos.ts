/**
 * Пул фото для нижнего баннера страницы «Меню» (`Menu.tsx`).
 * При переключении категории баннер показывает случайное фото из пула
 * этой конкретной категории — так, чтобы в «Супах» не выпадал стейк,
 * а в «Пиццах» — не суп. Каждый пул подобран по смыслу категории.
 *
 * Все фото — полноразмерные (без кадрирования, баннер их не обрезает,
 * см. `object-contain` в Menu.tsx) и, где это было доступно у фотографа,
 * сняты сбоку/под углом, а не строго сверху.
 *
 * Исключение — Пасты, Пиццы и Гарниры/Соусы: в присланной фотосессии
 * эти блюда сфотографированы только сверху (стандартная практика для
 * плоской подачи), кадра сбоку для них не существует.
 */

import type { MenuCategory } from "./data";

export interface MenuPhoto {
  src: string;
  alt: string;
}

type Filter = "Все" | MenuCategory;

const coldStarters: MenuPhoto[] = [
  { src: "/images/menu/tartare-salmon-avocado.jpg", alt: "Тартар из лосося на авокадо" },
  { src: "/images/menu/tartare-beef-moss.jpg", alt: "Тартар из говядины" },
];

const salads: MenuPhoto[] = [
  { src: "/images/menu/salad-greek.jpg", alt: "Греческий салат" },
  { src: "/images/menu/salad-avocado.jpg", alt: "Зелёный салат с авокадо" },
];

const soups: MenuPhoto[] = [
  { src: "/images/menu/pumpkin-soup.jpg", alt: "Тыквенный суп со страчателлой" },
  { src: "/images/menu/borscht.jpg", alt: "Борщ со сметаной" },
];

const mains: MenuPhoto[] = [
  { src: "/images/menu/food-steak.jpg", alt: "Стриплойн — подача Смок Дог" },
];

const grill: MenuPhoto[] = [
  { src: "/images/menu/food-steak.jpg", alt: "Стриплойн на гриле" },
];

const pasta: MenuPhoto[] = [
  { src: "/images/menu/pasta-mushroom.jpg", alt: "Паппарделле с брискетом" },
];

const burgers: MenuPhoto[] = [
  { src: "/images/menu/burger-beef.jpg", alt: "Бургер с говядиной" },
];

const pizza: MenuPhoto[] = [
  { src: "/images/menu/banner-pizza.jpg", alt: "Пицца четыре сыра с бураттой" },
];

const rolls: MenuPhoto[] = [
  { src: "/images/menu/food-sushi-set.jpg", alt: "Сет роллов с соевым соусом" },
];

const sides: MenuPhoto[] = [
  { src: "/images/menu/side-mini-potato.jpg", alt: "Мини-картофель с белыми грибами" },
];

const desserts: MenuPhoto[] = [
  { src: "/images/menu/food-cheesecake.jpg", alt: "Чизкейк с ягодами" },
  { src: "/images/menu/dessert-honey-cake.jpg", alt: "Медовик" },
];

const bar: MenuPhoto[] = [
  { src: "/images/gallery/mirror-arches.jpg", alt: "Барная зона Смок Дог" },
  { src: "/images/gallery/bar-candles.jpg", alt: "Лаундж-зона со статуей бульдога" },
];

const all: MenuPhoto[] = [
  ...coldStarters,
  ...salads,
  ...soups,
  ...mains,
  ...pasta,
  ...burgers,
  ...pizza,
  ...rolls,
  ...sides,
  ...desserts,
  ...bar,
].filter((photo, i, arr) => arr.findIndex((p) => p.src === photo.src) === i);

export const menuPhotoPools: Record<Filter, MenuPhoto[]> = {
  "Все": all,
  "Кальян": bar,
  "Холодные закуски": coldStarters,
  "Салаты": salads,
  "Горячие закуски": coldStarters,
  "Супы": soups,
  "Горячие блюда": mains,
  "Гриль": grill,
  "Пасты": pasta,
  "Бургеры / Шаурма": burgers,
  "Пиццы": pizza,
  "Роллы / Гунканы": rolls,
  "Гарниры": sides,
  "Соусы": sides,
  "Десерты": desserts,
  "Бар": bar,
};

/** Случайное фото из пула категории, по возможности отличное от предыдущего. */
export function pickMenuPhoto(filter: Filter, exclude?: string): MenuPhoto {
  const pool = menuPhotoPools[filter] ?? all;
  const candidates = exclude && pool.length > 1 ? pool.filter((p) => p.src !== exclude) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
