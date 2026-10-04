import { NextResponse } from "next/server";
import { faq, menu, site } from "@/lib/data";

/**
 * Данные заведения для голосового администратора Софи.
 *
 * Софи раз в сутки забирает отсюда адрес, часы и меню — чтобы по телефону
 * называть ровно то, что написано на сайте, а не вести второе меню, которое
 * рано или поздно разъедется с первым. Всё здесь и так публично: это те же
 * сведения, что на страницах «Меню» и «Контакты».
 *
 * Собирается при сборке сайта. Меню, изменённое в админке, попадает сюда
 * со следующим выкатом.
 */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    version: 1,
    name: site.nameRu || site.name,
    description: site.descriptionShort,
    concept: site.concept,
    phone: site.phone,
    banquetPhone: site.banquetPhone,
    email: site.email,
    website: site.url,
    address: {
      street: site.address.street,
      city: site.address.city,
      metro: site.address.metro,
      lat: site.address.lat,
      lng: site.address.lng,
    },
    hours: site.hoursSchema,
    // Вопросы и ответы с сайта: по ним Софи отвечает про парковку,
    // карту лояльности, ВИП-зоны — теми же словами, что на сайте.
    faq: faq.filter((item) => item.q && item.a),
    menu: menu.map((item) => ({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      tag: item.tag || null,
    })),
  });
}
