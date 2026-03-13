import { useState, useMemo, useCallback } from "react";
import { Search, Shuffle, ArrowDownAZ } from "lucide-react";
import { cn } from "@/lib/utils";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { MemberCard } from "./MemberCard";
import type { Member, SkillCategory } from "@/lib/types";

interface MemberFiltersProps {
  members: Member[];
}

type SortMode = "default" | "name" | "shuffle";

export function MemberFilters({ members }: MemberFiltersProps) {
  const [search, setSearch] = useState("");
  const [activeSkill, setActiveSkill] = useState<SkillCategory>("All");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const handleShuffle = useCallback(() => {
    setSortMode("shuffle");
    setShuffleSeed((s) => s + 1);
  }, []);

  const filtered = useMemo(() => {
    let result = [...members];

    if (activeSkill !== "All") {
      result = result.filter((m) => m.skills.includes(activeSkill));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (sortMode === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "shuffle") {
      // Simple seeded shuffle
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(
          ((Math.sin(i * 9301 + shuffleSeed * 49297) + 1) / 2) * (i + 1)
        );
        [result[i], result[j]] = [result[j], result[i]];
      }
    }

    return result;
  }, [members, activeSkill, search, sortMode, shuffleSeed]);

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-2xl mb-6">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          placeholder="Search by member name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm bg-[#0a0a0a] border border-white/[0.06] text-white placeholder:text-text-muted focus:outline-none focus:border-brand-green/40 focus:ring-1 focus:ring-brand-green/20 transition-colors font-mono"
        />
      </div>

      {/* Skill filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SKILL_CATEGORIES.map((skill) => (
          <button
            key={skill}
            onClick={() => setActiveSkill(skill)}
            className={cn(
              "px-3.5 py-1.5 text-xs font-mono font-medium uppercase tracking-wider border transition-all duration-[var(--duration-fast)]",
              activeSkill === skill
                ? "bg-brand-green/15 border-brand-green/40 text-brand-green"
                : "bg-transparent border-white/[0.08] text-text-secondary hover:border-white/20 hover:text-white"
            )}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Sort controls + count */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={handleShuffle}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium uppercase tracking-wider border transition-all",
            sortMode === "shuffle"
              ? "border-brand-green/40 text-brand-green"
              : "border-white/[0.08] text-text-secondary hover:border-white/20 hover:text-white"
          )}
        >
          <Shuffle size={12} />
          Shuffle
        </button>
        <button
          onClick={() => setSortMode("name")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium uppercase tracking-wider border transition-all",
            sortMode === "name"
              ? "border-brand-green/40 text-brand-green"
              : "border-white/[0.08] text-text-secondary hover:border-white/20 hover:text-white"
          )}
        >
          <ArrowDownAZ size={12} />
          Name
        </button>

        <span className="text-xs text-text-muted font-mono ml-1">
          &bull; {filtered.length} member{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-white/[0.06]">
          <p className="text-text-secondary text-sm font-mono">
            No members found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveSkill("All");
              setSortMode("default");
            }}
            className="mt-4 px-4 py-2 text-xs font-mono uppercase tracking-wider border border-white/[0.08] text-text-secondary hover:text-white hover:border-white/20 transition-all"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
