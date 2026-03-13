import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ContentMap { [key: string]: string }

const ease = [0.25, 1, 0.5, 1] as const;

const FAQ_CATEGORIES = [
  {
    label: "General",
    image: "/faq/general.png",
    questions: [
      { q: "What is Superteam Malaysia?", a: "Superteam Malaysia is the leading community for Solana builders in Malaysia. We connect developers, designers, and creators with opportunities, mentorship, and resources in the Web3 ecosystem." },
      { q: "Who can join Superteam Malaysia?", a: "Anyone passionate about building on Solana — developers, designers, marketers, content creators, and community builders. Whether you're a beginner or experienced, there's a place for you." },
      { q: "Is there a membership fee?", a: "No, joining Superteam Malaysia is completely free. We're a community-driven organization supported by the Solana Foundation and ecosystem partners." },
      { q: "How do I become a member?", a: "Join our Telegram group and introduce yourself. Attend our events, participate in bounties, and contribute to the community. Active contributors get recognized and earn member status." },
      { q: "Where are you based?", a: "We're primarily based in Kuala Lumpur, but our community spans across Malaysia. We host events in KL and occasionally in other cities like Penang and Johor Bahru." },
    ],
  },
  {
    label: "Events",
    image: "/faq/events.png",
    questions: [
      { q: "How often do you host events?", a: "We host weekly ecosystem syncs, monthly builder nights, and quarterly hackathons. Check our Luma calendar for the latest schedule." },
      { q: "Are events online or in-person?", a: "We run both. Our weekly syncs are hybrid, builder nights are in-person in KL, and hackathons vary. All events are listed on our Luma page with format details." },
      { q: "Can I speak at an event?", a: "Absolutely! We're always looking for speakers who can share their Web3 journey, technical knowledge, or project updates. Reach out to us on Telegram to propose a talk." },
      { q: "Do you host hackathons?", a: "Yes, we run quarterly hackathons with prizes from ecosystem partners. We also help members participate in global Solana hackathons like Colosseum." },
      { q: "How do I stay updated on events?", a: "Follow us on X (@SuperteamMY), join our Telegram group, and subscribe to our Luma calendar for real-time event updates." },
    ],
  },
  {
    label: "Opportunities",
    image: "/faq/opportunities.png",
    questions: [
      { q: "What kind of bounties are available?", a: "Bounties range from development tasks, content creation, design work, to community management. Check Superteam Earn for the latest opportunities with rewards in SOL and USDC." },
      { q: "How do grants work?", a: "We help connect builders with grants from the Solana Foundation, ecosystem partners, and our own micro-grant program. We also provide guidance on writing grant proposals." },
      { q: "Can you help me find a Web3 job?", a: "Yes! We regularly share job postings from Solana ecosystem companies. Our network includes founders and hiring managers across the ecosystem who actively recruit from our community." },
      { q: "Do you offer mentorship?", a: "We pair builders with experienced mentors for technical guidance, architecture reviews, and go-to-market strategy. Reach out in our Telegram to get matched with a mentor." },
      { q: "How can my project get support?", a: "Present at our demo days, apply for ecosystem grants through us, and leverage our network for introductions to investors and partners. We've helped launch over 12 projects." },
    ],
  },
];

export function FAQSection({ faqItems = [], content = {} }: { faqItems?: { question: string; answer: string; category: string }[]; content?: ContentMap }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Build categories from DB data, fallback to hardcoded
  const categories = faqItems.length > 0
    ? [...new Set(faqItems.map((f) => f.category))].map((cat) => ({
        label: cat,
        image: content[`faq.image_${cat.toLowerCase()}`] || `/faq/${cat.toLowerCase()}.png`,
        questions: faqItems.filter((f) => f.category === cat).map((f) => ({ q: f.question, a: f.answer })),
      }))
    : FAQ_CATEGORIES;

  const category = categories[activeCategory];

  return (
    <section
      id="faq"
      className="relative px-6 flex items-center overflow-hidden py-16 lg:py-0"
      style={{ minHeight: "85dvh", scrollSnapAlign: "start", backgroundColor: "#0a0a0a" }}
    >
      {/* City skyline background */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: "60%",
          backgroundImage: "url(/city.svg)",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom center",
          backgroundSize: "100vw auto",
          opacity: 0.15,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
        }}
      />
      <div className="relative max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-20">
          {/* Left side */}
          <div className="flex flex-col">
            <h2
              className="text-white font-semibold tracking-tight leading-[1.1]"
              style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
            >
              Frequently asked
              <br />
              questions
            </h2>

            <div className="mt-8 flex items-center gap-6">
              {categories.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => {
                    setActiveCategory(i);
                    setOpenIndex(0);
                  }}
                  className={`relative pb-2 text-sm font-semibold transition-colors ${
                    activeCategory === i
                      ? "text-white"
                      : "text-[#555] hover:text-white"
                  }`}
                >
                  {cat.label}
                  {activeCategory === i && (
                    <motion.div
                      layoutId="faq-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9945ff]"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Category image — hidden on mobile */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:flex mt-8 rounded-xl border border-dashed border-[#333] bg-[#0a0a0a] overflow-hidden items-center justify-center"
                style={{ height: 280 }}
              >
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side — accordion */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease }}
                className="divide-y divide-[#1a1a1a]"
              >
                {category.questions.map((item, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-4 py-5 text-left"
                      >
                        <span
                          className={`text-base font-medium transition-colors ${
                            isOpen ? "text-white" : "text-[#a1a1aa]"
                          }`}
                        >
                          {item.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-[#666] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <p className="pb-5 text-sm text-[#888] leading-relaxed">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
