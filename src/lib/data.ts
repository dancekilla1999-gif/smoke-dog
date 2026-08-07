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
    title: "2 этажа · 1400 м²",
    text: "Самый большой lounge-бар в России. Пространство для любого настроения.",
  },
  {
    icon: "Music4",
    title: "DJ и живой вокал",
    text: "Топовые диджеи столицы и живой вокал — от релакса до вечеринок.",
  },
  {
    icon: "UtensilsCrossed",
    title: "Кухня и бар",
    text: "Европейская и кавказская кухня, авторские коктейли и премиальные кальяны.",
  },
  {
    icon: "Wine",
    title: "Кальянная культура",
    text: "Премиальный табак, авторские миксы и профессиональные мастера.",
  },
  {
    icon: "Leaf",
    title: "VIP с PS5 и караоке",
    text: "Приватные зоны с современной караоке-системой и PlayStation 5.",
  },
  {
    icon: "Crown",
    title: "Банкеты и мероприятия",
    text: "Вместимость до 270 человек. Полное сопровождение вашего события.",
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

export const menuCategories: MenuCategory[] = [
  "Кальян",
  "Закуски",
  "Салаты",
  "Горячее",
  "Бар",
];

export const menu = content.menu as MenuItem[];

export const events = content.events;

export const testimonials = content.testimonials;

export const faq = content.faq;

export const gallery = content.gallery;
