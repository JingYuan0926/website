import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { EventsSection } from "@/components/landing/EventsSection";
import { MemberSpotlight } from "@/components/landing/MemberSpotlight";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { WallOfLove } from "@/components/landing/WallOfLove";
import { FAQSection } from "@/components/landing/FAQSection";
import { JoinCTA } from "@/components/landing/JoinCTA";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SAMPLE_MEMBERS,
  SAMPLE_EVENTS,
  SAMPLE_STATS,
  SAMPLE_PARTNERS,
  SAMPLE_TESTIMONIALS,
  FAQ_DEFAULT,
} from "@/lib/constants";
import type { Member, Event, Partner, Testimonial, FAQItem } from "@/lib/types";

interface HomePageProps {
  members: Member[];
  events: Event[];
  stats: {
    members_count: number;
    events_hosted: number;
    projects_funded: number;
    bounties_completed: number;
    community_reach: number;
  };
  partners: Partner[];
  testimonials: Testimonial[];
  faqItems: FAQItem[];
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  if (isSupabaseConfigured() && supabase) {
    const [membersRes, eventsRes, statsRes, partnersRes, testimonialsRes, faqRes] =
      await Promise.all([
        supabase.from("members").select("*").eq("is_spotlight", true).order("display_order"),
        supabase.from("events").select("*").eq("status", "upcoming").order("date"),
        supabase.from("site_stats").select("*").limit(1).single(),
        supabase.from("partners").select("*").order("display_order"),
        supabase.from("testimonials").select("*").order("display_order"),
        supabase.from("faq_items").select("*").order("display_order"),
      ]);

    return {
      props: {
        members: (membersRes.data as Member[]) || [],
        events: (eventsRes.data as Event[]) || [],
        stats: statsRes.data || SAMPLE_STATS,
        partners: (partnersRes.data as Partner[]) || [],
        testimonials: (testimonialsRes.data as Testimonial[]) || [],
        faqItems: (faqRes.data as FAQItem[]) || [],
      },
      revalidate: 3600,
    };
  }

  // Fallback to sample data when Supabase is not configured
  return {
    props: {
      members: SAMPLE_MEMBERS as unknown as Member[],
      events: SAMPLE_EVENTS as unknown as Event[],
      stats: SAMPLE_STATS,
      partners: SAMPLE_PARTNERS as unknown as Partner[],
      testimonials: SAMPLE_TESTIMONIALS as unknown as Testimonial[],
      faqItems: FAQ_DEFAULT.map((item, i) => ({
        id: String(i + 1),
        question: item.question,
        answer: item.answer,
        display_order: i,
        created_at: new Date().toISOString(),
      })),
    },
  };
};

export default function Home({
  members,
  events,
  stats,
  partners,
  testimonials,
  faqItems,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{`${SITE_NAME} — Build the Future of Web3 from Malaysia`}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:title" content={`${SITE_NAME} — Build the Future of Web3 from Malaysia`} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SuperteamMY" />
      </Head>

      <main>
        <HeroSection />
        <MissionSection />
        <StatsSection stats={stats} />
        <EventsSection events={events} />
        <MemberSpotlight members={members} />
        <PartnersSection partners={partners} />
        <WallOfLove testimonials={testimonials} />
        <FAQSection items={faqItems} />
        <JoinCTA />
      </main>
    </>
  );
}
