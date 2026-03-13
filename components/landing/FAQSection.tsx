import { useState } from "react";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Markdown } from "@/components/shared/Markdown";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/lib/types";

interface FAQSectionProps {
  items: FAQItem[];
}

function AccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-white group-hover:text-brand-purple-light transition-colors">
          {item.question}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-text-muted transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-sm text-text-secondary leading-relaxed pr-8">
            {item.image_url && (
              <img
                src={item.image_url}
                alt=""
                className="w-full max-w-md rounded-lg mb-3 border border-border-subtle"
              />
            )}
            <Markdown content={item.answer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({ items }: FAQSectionProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection>
          <SectionHeading
            label="FAQ"
            title="Frequently asked questions"
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection stagger className="mt-12">
          {items.map((item) => (
            <AnimatedItem key={item.id || item.question}>
              <AccordionItem item={item} />
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
