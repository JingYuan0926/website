import { cn } from "@/lib/utils";

const SKILL_COLORS: Record<string, string> = {
  Rust: "bg-[oklch(30%_0.08_25)] text-[oklch(75%_0.12_25)]",
  Frontend: "bg-[oklch(30%_0.08_250)] text-[oklch(75%_0.12_250)]",
  Backend: "bg-[oklch(30%_0.08_200)] text-[oklch(75%_0.12_200)]",
  Design: "bg-[oklch(30%_0.08_320)] text-[oklch(75%_0.12_320)]",
  Content: "bg-[oklch(30%_0.08_155)] text-[oklch(75%_0.12_155)]",
  Growth: "bg-[oklch(30%_0.08_85)] text-[oklch(75%_0.12_85)]",
  Product: "bg-[oklch(30%_0.08_285)] text-[oklch(75%_0.12_285)]",
  Community: "bg-[oklch(30%_0.08_60)] text-[oklch(75%_0.12_60)]",
  DeFi: "bg-[oklch(30%_0.08_155)] text-[oklch(75%_0.12_155)]",
  NFTs: "bg-[oklch(30%_0.08_340)] text-[oklch(75%_0.12_340)]",
  "Core Team": "bg-brand-purple/15 text-brand-purple-light",
};

interface SkillBadgeProps {
  skill: string;
  size?: "sm" | "md";
}

export function SkillBadge({ skill, size = "sm" }: SkillBadgeProps) {
  const colorClass = SKILL_COLORS[skill] || "bg-surface-2 text-text-secondary";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        colorClass
      )}
    >
      {skill}
    </span>
  );
}
