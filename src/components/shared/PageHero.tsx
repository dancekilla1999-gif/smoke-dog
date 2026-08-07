import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Компактный hero для внутренних страниц.
 * Даёт единый премиальный вход на каждую вкладку.
 */
export function PageHero({ eyebrow, title, subtitle, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-white/[0.06] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24",
        className
      )}
    >
      {/* soft gradient + grain atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-noir via-noir/95 to-transparent" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold/[0.04] blur-3xl" />

      <div className="container-wide relative">
        <p className="eyebrow text-gold/90">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.1rem,5vw,3.6rem)] font-light leading-[1.12] tracking-tight text-bone">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ash sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
