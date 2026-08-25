import { site, faq, menu } from "@/lib/data";

/**
 * JSON-LD разметка Schema.org: Restaurant (наследует LocalBusiness), FAQ и WebSite.
 * Помогает поисковикам показывать расширенный сниппет: адрес, часы, кухню, меню.
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;

const openingHoursSpecification = site.hoursSchema.map((h) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: [...h.days],
  opens: h.opens,
  closes: h.closes,
}));

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.city,
  postalCode: site.address.postal,
  addressCountry: site.address.country,
};

const geo = {
  "@type": "GeoCoordinates",
  latitude: site.address.lat,
  longitude: site.address.lng,
};

/** Restaurant + LocalBusiness */
export function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${baseUrl}/#restaurant`,
    name: site.name,
    alternateName: site.nameRu,
    legalName: site.legalName,
    description: site.descriptionShort,
    slogan: site.tagline,
    url: baseUrl,
    telephone: site.phone,
    email: site.email,
    image: [`${baseUrl}/images/brand/og.jpg`, `${baseUrl}/images/gallery/lounge-bright.jpg`],
    logo: `${baseUrl}/images/brand/logo.png`,
    priceRange: site.priceRange,
    servesCuisine: [...site.cuisine],
    currenciesAccepted: "RUB",
    paymentAccepted: "Наличные, банковские карты",
    address: postalAddress,
    geo,
    hasMap: `https://yandex.ru/maps/?text=${encodeURIComponent(
      `${site.address.city}, ${site.address.street}`
    )}`,
    openingHoursSpecification,
    acceptsReservations: "True",
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/#reservation`,
        inLanguage: "ru-RU",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "FoodEstablishmentReservation",
        name: "Бронирование стола",
      },
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Кальянная зона", value: true },
      { "@type": "LocationFeatureSpecification", name: "Лаундж-зона", value: true },
      { "@type": "LocationFeatureSpecification", name: "Диджей-сеты", value: true },
      { "@type": "LocationFeatureSpecification", name: "ВИП-зоны", value: true },
      { "@type": "LocationFeatureSpecification", name: "Караоке", value: true },
    ],
    sameAs: [site.social.instagram, site.social.telegram, site.social.whatsapp],
    hasMenu: {
      "@type": "Menu",
      name: "Меню Смок Дог",
      url: `${baseUrl}/#menu`,
      inLanguage: "ru-RU",
      hasMenuSection: Array.from(new Set(menu.map((m) => m.category))).map((category) => ({
        "@type": "MenuSection",
        name: category,
        hasMenuItem: menu
          .filter((m) => m.category === category)
          .map((m) => ({
            "@type": "MenuItem",
            name: m.name,
            description: m.description,
            offers: {
              "@type": "Offer",
              price: m.price.replace(/\D/g, ""),
              priceCurrency: "RUB",
            },
          })),
      })),
    },
  };
}

/** LocalBusiness — отдельным узлом для локального поиска */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    name: `${site.name} · ${site.nameRu}`,
    description: site.descriptionShort,
    image: `${baseUrl}/images/brand/og.jpg`,
    logo: `${baseUrl}/images/brand/logo.png`,
    url: baseUrl,
    telephone: site.phone,
    email: site.email,
    priceRange: site.priceRange,
    address: postalAddress,
    geo,
    openingHoursSpecification,
    sameAs: [site.social.instagram, site.social.telegram, site.social.whatsapp],
  };
}

/** FAQPage — расширенный сниппет с вопросами */
export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** WebSite */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: `${site.name} — ${site.concept}`,
    url: baseUrl,
    inLanguage: "ru-RU",
    publisher: { "@id": `${baseUrl}/#restaurant` },
  };
}
