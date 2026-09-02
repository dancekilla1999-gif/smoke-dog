import { site } from "./data";

/**
 * Юридические документы сайта: реквизиты оператора, дата редакции, список страниц.
 * Дата редакции — константа, меняется только при изменении текста документов.
 */

export const LEGAL_REVISION = "2 сентября 2026 г.";

/** Реквизиты оператора персональных данных / исполнителя. */
export const operator = {
  legalName: site.legalName,
  inn: "610104705022",
  address: `${site.address.postal}, ${site.address.city}, ${site.address.street}`,
  email: site.email,
  phone: site.phone,
  siteUrl: site.url,
  brand: site.name,
};

export const legalDocs = [
  { href: "/privacy", label: "Политика обработки персональных данных" },
  { href: "/consent", label: "Согласие на обработку персональных данных" },
  { href: "/marketing-consent", label: "Согласие на рекламную рассылку" },
  { href: "/offer", label: "Публичная оферта" },
] as const;

export type LegalDocHref = (typeof legalDocs)[number]["href"];
