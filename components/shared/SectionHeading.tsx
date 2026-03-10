interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {label && (
        <span className="text-xs font-medium tracking-widest uppercase text-text-muted mb-3 block">
          {label}
        </span>
      )}
      <h2 className="text-fluid-xl font-semibold tracking-tight text-white leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
