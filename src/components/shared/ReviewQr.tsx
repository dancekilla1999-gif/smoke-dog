import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";

/**
 * Компактная карточка с QR на страницу /review — «оставьте отзыв».
 * Используется в блоке контактов; тот же QR доступен как постер
 * для печати в /print/review-poster.svg (и .png) — для стойки на столе.
 */
export function ReviewQr() {
  return (
    <Reveal delay={0.2}>
      <div className="flex flex-col items-center gap-5 border border-white/[0.07] bg-graphite/40 p-8 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="shrink-0 rounded-sm border border-gold/30 bg-bone p-2">
          <Image
            src="/images/brand/review-qr.png"
            alt="QR-код: оставить отзыв о Smoke Dog"
            width={104}
            height={104}
            className="h-[104px] w-[104px]"
          />
        </div>
        <div>
          <p className="eyebrow text-gold/90">Ваше мнение важно</p>
          <p className="mt-2 font-serif text-xl text-bone">Поделитесь впечатлениями</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ash">
            Отсканируйте QR-код или{" "}
            <Link href="/review" className="text-gold underline-offset-4 hover:underline">
              оставьте отзыв онлайн
            </Link>
            .
          </p>
        </div>
      </div>
    </Reveal>
  );
}
