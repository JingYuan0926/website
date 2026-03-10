import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
        <span className="text-sm font-medium text-text-primary group-hover:text-brand-purple-light transition-colors duration-[var(--duration-fast)]">
          {item.question}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-text-muted transition-transform duration-[var(--duration-normal)]",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm text-text-secondary leading-relaxed pr-8">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({ items }: FAQSectionProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
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
