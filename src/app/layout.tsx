import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data";
import {
  restaurantSchema,
  localBusinessSchema,
  faqSchema,
  websiteSchema,
} from "@/lib/schema";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/shared/Cursor";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { FloatingReserve } from "@/components/shared/FloatingReserve";
import { PromoPopup } from "@/components/shared/PromoPopup";
import { PageTransition, TransitionCurtain } from "@/components/providers/PageTransition";
import { YandexMetrika } from "@/components/providers/YandexMetrika";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title: {
    default: `${site.name} · ${site.nameRu} — лаундж-бар и кальянная, самый большой в России`,
    template: `%s · ${site.name}`,
  },
  description: site.descriptionShort,
  keywords: [
    "Smoke Dog",
    "Smoke Dog Lounge",
    "SD Lounge",
    "лаундж бар",
    "лаундж-бар Москва",
    "кальянная",
    "кальянная Москва",
    "кальян бар",
    "кальян-бар Москва",
    "кальянная рядом",
    "лаундж бар с кальяном",
    "lounge бар Москва",
    "кальян Москва",
    "ночной клуб Тульская",
    "смок дог тульская",
    "смоук дог тульская",
    "smoke dog тульская",
    "лаундж бар тульская",
    "кальянная тульская",
    "кальянная у метро тульская",
    "бар тульская метро",
    "банкеты Москва",
    "VIP караоке",
    "Холодильный переулок",
    "бронирование столика",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.nameRu} — ${site.concept}`,
    description: site.descriptionShort,
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.concept}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.nameRu}`,
    description: site.descriptionShort,
    images: ["/images/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "restaurant",
};

export const viewport: Viewport = {
  themeColor: "#060505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    restaurantSchema(),
    localBusinessSchema(),
    faqSchema(),
    websiteSchema(),
  ];

  return (
    <html lang="ru" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="grain">
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:text-noir"
        >
          Перейти к содержимому
        </a>

        <ScrollProgress />
        <Navbar />

        <SmoothScroll>
          <main id="main" className="ar-depth-root">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>

        <TransitionCurtain />
        <FloatingReserve />
        <Cursor />
        <Toaster />
        <YandexMetrika />
        <PromoPopup />
      </body>
    </html>
  );
}
