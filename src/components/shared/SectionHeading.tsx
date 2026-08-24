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
      {eyebrow && (
        <div className="mb-4">
          <Eyebrow align={align}>{eyebrow}</Eyebrow>
        </div>
      )}
      <TextReveal
        as="h2"
        text={title}
        className="text-balance font-serif text-[2rem] leading-[1.08] tracking-tight text-bone sm:text-5xl lg:text-[3.1rem]"
      />
      {intro && (
        <p
          className={cn(
            "mt-5 max-w-lg text-pretty text-[15px] leading-[1.75] text-ash sm:text-[16px]",
            align === "center" && "mx-auto"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
