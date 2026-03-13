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
import { AnnouncementsSection } from "@/components/landing/AnnouncementsSection";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SAMPLE_MEMBERS,
  SAMPLE_STATS,
  SAMPLE_PARTNERS,
  SAMPLE_TESTIMONIALS,
  FAQ_DEFAULT,
} from "@/lib/constants";
import type { Member, Partner, Testimonial, FAQItem, SiteContent, Announcement } from "@/lib/types";

interface HomePageProps {
  members: Member[];
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
  siteContent: Record<string, Record<string, string>>;
  announcements: Announcement[];
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  if (isSupabaseConfigured() && supabase) {
    const [membersRes, statsRes, partnersRes, testimonialsRes, faqRes, contentRes, announcementsRes] =
      await Promise.all([
        supabase.from("members").select("*").eq("is_spotlight", true).order("display_order"),
        supabase.from("site_stats").select("*").limit(1).single(),
        supabase.from("partners").select("*").order("display_order"),
        supabase.from("testimonials").select("*").order("display_order"),
        supabase.from("faq_items").select("*").order("display_order"),
        supabase.from("site_content").select("*"),
        supabase.from("announcements").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(5),
      ]);

    // Group site_content into { section: { key: value } }
    const siteContent: Record<string, Record<string, string>> = {};
    if (contentRes.data) {
      for (const row of contentRes.data as SiteContent[]) {
        if (!siteContent[row.section]) siteContent[row.section] = {};
        siteContent[row.section][row.key] = row.value;
      }
    }

    return {
      props: {
        members: (membersRes.data as Member[]) || [],
        stats: statsRes.data || SAMPLE_STATS,
        partners: (partnersRes.data as Partner[]) || [],
        testimonials: (testimonialsRes.data as Testimonial[]) || [],
        faqItems: (faqRes.data as FAQItem[]) || [],
        siteContent,
        announcements: (announcementsRes.data as Announcement[]) || [],
      },
      revalidate: 3600,
    };
  }

  // Fallback to sample data when Supabase is not configured
  return {
    props: {
      members: SAMPLE_MEMBERS as unknown as Member[],
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
      siteContent: {},
      announcements: [],
    },
  };
};

export default function Home({
  members,
  stats,
  partners,
  testimonials,
  faqItems,
  siteContent,
  announcements,
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
        <HeroSection content={siteContent?.hero} />
        <MissionSection content={siteContent?.mission} />
        <StatsSection stats={stats} />
        <EventsSection />
        <MemberSpotlight members={members} />
        <PartnersSection partners={partners} />
        <WallOfLove testimonials={testimonials} />
        <AnnouncementsSection announcements={announcements} />
        <FAQSection items={faqItems} />
        <JoinCTA content={siteContent?.join_cta} />
      </main>
    </>
  );
}
