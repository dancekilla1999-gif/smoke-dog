/**
 * Единый источник контента сайта Smoke Dog Lounge & Bar.
 * Данные берутся из src/data/content.json — редактируются через /admin.
 */

import content from "@/data/content.json";

export const site = content.site;

/**
 * Прямая ссылка на форму отзыва организации в Яндекс Картах (Яндекс Бизнес).
 * Используется для review-gating: 5-звёздочные отзывы на /review предлагаем
 * гостю продублировать на Яндекс Картах — это поднимает публичный рейтинг.
 * ID организации: yandex.ru/maps/org/smoke_dog/76863719030/
 */
export const yandexReviewUrl =
  "https://yandex.ru/maps/org/smoke_dog/76863719030/reviews/?add-review=true";

export const nav = [
  { label: "О нас", href: "/about" },
  { label: "Меню", href: "/menu" },
  { label: "Афиша", href: "/events" },
  { label: "Галерея", href: "/gallery" },
  { label: "Банкеты", href: "/banquets" },
  { label: "Контакты", href: "/contacts" },
] as const;

export const conceptStates = content.conceptStates;

export const advantages = [
  {
    icon: "Sparkles",
    title: "Лаундж",
    text: "Мягкий свет, диваны, свой темп вечера.",
  },
  {
    icon: "Music4",
    title: "Музыка",
    text: "Диджей по пятницам и субботам, вокал.",
  },
  {
    icon: "UtensilsCrossed",
    title: "Кухня и бар",
    text: "Европейская, кавказская, коктейли.",
  },
  {
    icon: "Wine",
    title: "Кальян",
    text: "Премиальный табак и свои миксы.",
  },
  {
    icon: "Crown",
    title: "ВИП",
    text: "Караоке, PS5, приватные зоны.",
  },
  {
    icon: "Gamepad2",
    title: "До 05:00",
    text: "Открыты каждый день до утра.",
  },
] as const;

export type MenuCategory =
  | "Кальян"
  | "Холодные закуски"
  | "Салаты"
  | "Горячие закуски"
  | "Супы"
  | "Горячие блюда"
  | "Гриль"
  | "Пасты"
  | "Бургеры"
  | "Пиццы"
  | "Роллы / Гунканы"
  | "Гарниры"
  | "Соусы"
  | "Десерты"
  | "Бар";

export interface MenuItem {
  name: string;
  description?: string;
  weight?: string;
  price: string;
  category: MenuCategory;
  tag?: "Сигниче" | "Выбор шефа" | "Веган" | "Хит";
  image?: string;
}

export interface EventItem {
  title: string;
  subtitle: string;
  date: string;
  weekday: string;
  time: string;
  poster: string;
  /** Необязательное видео вместо статичной картинки (poster — fallback/постер видео) */
  video?: string;
  lineup: string[];
  featured: boolean;
  /** Ссылка для брони — если событие у партнёра (например SOUL), ведёт на его сайт */
  reserveUrl?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  category?: string;
  span?: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

export const menuCategories: MenuCategory[] = [
  "Кальян",
  "Холодные закуски",
  "Салаты",
  "Горячие закуски",
  "Супы",
  "Горячие блюда",
  "Гриль",
  "Пасты",
  "Бургеры",
  "Пиццы",
  "Роллы / Гунканы",
  "Гарниры",
  "Соусы",
  "Десерты",
  "Бар",
];

export const menu = content.menu as MenuItem[];
export const events = content.events as EventItem[];
export const testimonials = content.testimonials as TestimonialItem[];
export const faq: FaqItem[] = (content.faq as Array<Record<string, string>>).map((item) => ({
  q: item.q ?? item.question ?? "",
  a: item.a ?? item.answer ?? "",
}));
export const gallery = content.gallery as GalleryItem[];
