import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { MemberCard } from "./MemberCard";
import type { Member, SkillCategory } from "@/lib/types";

interface MemberFiltersProps {
  members: Member[];
}

export function MemberFilters({ members }: MemberFiltersProps) {
  const [search, setSearch] = useState("");
  const [activeSkill, setActiveSkill] = useState<SkillCategory>("All");

  const filtered = useMemo(() => {
    let result = members;

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

    return result;
  }, [members, activeSkill, search]);

  return (
    <div>
      {/* Search + Filters */}
      <div className="space-y-5 mb-10">
        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-1 border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-colors"
          />
        </div>

        {/* Skill filters */}
        <div className="flex flex-wrap gap-2">
          {SKILL_CATEGORIES.map((skill) => (
            <button
              key={skill}
              onClick={() => setActiveSkill(skill)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-[var(--duration-fast)]",
                activeSkill === skill
                  ? "bg-brand-purple text-white"
                  : "bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary"
              )}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted mb-6">
        {filtered.length} member{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-text-secondary text-sm">
            No members found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveSkill("All");
            }}
            className="mt-3 text-sm text-brand-purple-light hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
