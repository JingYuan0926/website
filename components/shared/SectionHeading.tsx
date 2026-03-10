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
        <span className="text-fluid-sm font-semibold tracking-widest uppercase text-brand-purple-light mb-3 block">
          {label}
        </span>
      )}
      <h2 className="text-fluid-xl font-bold tracking-tight text-text-primary leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-fluid-base text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
