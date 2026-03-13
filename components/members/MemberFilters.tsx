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
  const [activeSkills, setActiveSkills] = useState<Set<SkillCategory>>(new Set());

  function toggleSkill(skill: SkillCategory) {
    setActiveSkills((prev) => {
      const next = new Set(prev);
      if (skill === "All") {
        return new Set();
      }
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  }

  const filtered = useMemo(() => {
    let result = [...members];

    if (activeSkills.size > 0) {
      result = result.filter((m) =>
        m.skills.some((s) => activeSkills.has(s as SkillCategory))
      );
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
  }, [members, activeSkills, search]);

  const isAllActive = activeSkills.size === 0;

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

      {/* Skill filters + count */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-wrap gap-2">
          {SKILL_CATEGORIES.map((skill) => {
            const isActive = skill === "All" ? isAllActive : activeSkills.has(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-mono font-medium uppercase tracking-wider border transition-all duration-[var(--duration-fast)]",
                  isActive
                    ? "bg-brand-green/15 border-brand-green/40 text-brand-green"
                    : "bg-transparent border-white/[0.08] text-text-secondary hover:border-white/20 hover:text-white"
                )}
              >
                {skill}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-text-muted font-mono ml-4 whitespace-nowrap">
          {filtered.length} member{filtered.length !== 1 ? "s" : ""}
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
              setActiveSkills(new Set());
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
