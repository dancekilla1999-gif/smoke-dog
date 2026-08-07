import { cn } from "@/lib/utils";

/**
 * Надпись-«бровка» с золотыми засечками по бокам.
 */
export function Eyebrow({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center",
        className
      )}
    >
      <span className="h-px w-8 bg-gold/60" />
      <span className="eyebrow">{children}</span>
      {align === "center" && <span className="h-px w-8 bg-gold/60" />}
    </div>
  );
}
