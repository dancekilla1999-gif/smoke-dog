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
    title: "Lounge",
    text: "Мягкий свет, диваны, свой темп вечера.",
  },
  {
    icon: "Music4",
    title: "Музыка",
    text: "DJ по пятницам и субботам, вокал.",
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
    title: "VIP",
    text: "Караоке, PS5, приватные зоны.",
  },
  {
    icon: "Gamepad2",
    title: "До 05:00",
    text: "Открыты каждый день до утра.",
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
