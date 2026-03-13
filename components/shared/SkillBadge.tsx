import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: string;
  size?: "sm" | "md";
  golden?: boolean;
}

export function SkillBadge({ skill, size = "sm", golden }: SkillBadgeProps) {
  const isCore = skill === "Core Team";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm font-medium font-mono uppercase tracking-wider whitespace-nowrap shrink-0",
        golden
          ? "bg-amber-500/10 text-amber-400/80"
          : "bg-[#ffffff0a] text-text-secondary",
        size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
      )}
    >
      {isCore && golden ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
        </svg>
      ) : (
        <span className="opacity-50">#</span>
      )}
      {skill}
    </span>
  );
}
