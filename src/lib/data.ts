/**
 * Единый источник контента сайта Smoke Dog Lounge & Bar.
 * Данные берутся из src/data/content.json — редактируются через /admin.
 */

import content from "@/data/content.json";

export const site = content.site;

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
    title: "Lounge & Bar",
    text: "Кальян, кухня и бар в одной атмосфере — без лишней суеты.",
  },
  {
    icon: "Music4",
    title: "DJ по пятницам и субботам",
    text: "Резиденты и гости. Живой вокал и сеты до закрытия.",
  },
  {
    icon: "UtensilsCrossed",
    title: "Кухня и бар",
    text: "Европейская и кавказская кухня, коктейли, крепкий алкоголь.",
  },
  {
    icon: "Wine",
    title: "Кальян",
    text: "Премиальный табак, свои миксы, мастера зала.",
  },
  {
    icon: "Leaf",
    title: "VIP · PS5 · караоке",
    text: "Закрытые зоны с PlayStation 5 и караоке-системой.",
  },
  {
    icon: "Crown",
    title: "Банкеты до 270 гостей",
    text: "Дни рождения, корпоративы, закрытые вечеринки — под ключ.",
  },
] as const;

export type MenuCategory = "Кальян" | "Закуски" | "Салаты" | "Горячее" | "Бар";

export interface MenuItem {
  name: string;
  description: string;
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
  lineup: string[];
  featured: boolean;
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
  "Закуски",
  "Салаты",
  "Горячее",
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
