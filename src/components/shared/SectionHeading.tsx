import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { TextReveal } from "./TextReveal";

interface Props {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Единый блок заголовка секции: бровка + пословный reveal + подводка.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow align={align}>{eyebrow}</Eyebrow>}
      <TextReveal
        as="h2"
        text={title}
        className="mt-4 text-balance text-[2rem] leading-[1.08] text-bone sm:mt-5 sm:text-5xl lg:text-[3.25rem]"
      />
      {intro && (
        <p
          className={cn(
            "mt-5 text-pretty text-[15px] leading-[1.7] text-ash sm:text-base sm:leading-relaxed lg:text-lg",
            align === "center" && "mx-auto max-w-xl"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
