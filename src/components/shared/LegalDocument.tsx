import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { LEGAL_REVISION, legalDocs, operator, type LegalDocHref } from "@/lib/legal";

export { LEGAL_REVISION, legalDocs, operator };

/**
 * Общая обёртка юридических документов сайта (политика, согласия, оферта):
 * единый вид, дата редакции, реквизиты оператора и перекрёстные ссылки.
 * Дата редакции — константа: меняется только при изменении текста документов.
 */

export function LegalPage({
  eyebrow = "Документы",
  title,
  subtitle,
  children,
  current,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  current: LegalDocHref;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <section
        id="processing"
        className="relative border-t border-white/[0.07] py-16 sm:py-20 lg:py-24"
      >
        <div className="container-wide">
          <div className="mx-auto max-w-3xl space-y-10 text-[16px] leading-relaxed text-bone">
            <p className="text-sm text-ash">Редакция от {LEGAL_REVISION}</p>
            {children}
            <OperatorDetails />
            <nav aria-label="Другие документы" className="border-t border-white/[0.07] pt-8">
              <p className="text-xs uppercase tracking-eyebrow text-ash">Другие документы</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {legalDocs
                  .filter((d) => d.href !== current)
                  .map((d) => (
                    <li key={d.href}>
                      <Link
                        href={d.href}
                        className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-gold"
                      >
                        {d.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl text-bone">{title}</h2>
      {children}
    </div>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 marker:text-gold/70">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function OperatorDetails() {
  return (
    <LegalSection title="Реквизиты оператора">
      <p>
        {operator.legalName}
        <br />
        ИНН: {operator.inn}
        <br />
        Адрес: {operator.address}
        <br />
        Телефон: {operator.phone}
        <br />
        Электронная почта: {operator.email}
        <br />
        Сайт: {operator.siteUrl}
      </p>
    </LegalSection>
  );
}
