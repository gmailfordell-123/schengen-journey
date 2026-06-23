import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  ...rest
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
      {...rest}
    >
      {eyebrow && (
        <p className={`eyebrow mb-4 ${light ? "" : "eyebrow-navy"}`}
           style={light ? {} : { color: "var(--gold-500)" }}>
          {eyebrow}
        </p>
      )}
      <h2
        className="text-h2"
        style={{ color: light ? "#fff" : "var(--ink)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-subhead mt-4"
          style={{ color: light ? "rgba(240,244,255,0.65)" : "var(--ink-muted)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
