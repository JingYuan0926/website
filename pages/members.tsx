import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Search } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { MemberFilters } from "@/components/members/MemberFilters";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SITE_NAME, SAMPLE_MEMBERS } from "@/lib/constants";
import type { Member } from "@/lib/types";

interface MembersPageProps {
  members: Member[];
}

export const getStaticProps: GetStaticProps<MembersPageProps> = async () => {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("display_order");

    return {
      props: { members: (data as Member[]) || [] },
      revalidate: 3600,
    };
  }

  return {
    props: { members: SAMPLE_MEMBERS as unknown as Member[] },
  };
};

/** Decorative crosshatch bar (like the screenshot header) */
function GradientBar() {
  return (
    <div className="flex-1 h-10 relative overflow-hidden ml-4">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 3px,
            rgba(20, 241, 149, 0.3) 3px,
            rgba(20, 241, 149, 0.3) 4px
          )`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-green/10 to-transparent" />
    </div>
  );
}

export default function MembersPage({
  members,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{`Members — ${SITE_NAME}`}</title>
        <meta
          name="description"
          content="Meet the builders, designers, and creators of Superteam Malaysia."
        />
      </Head>

      <main className="pt-28 lg:pt-36 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            {/* Header with icon + title + decorative bar */}
            <div className="flex items-center mb-10">
              <div className="flex items-center gap-3 shrink-0">
                <Search size={20} className="text-brand-green" />
                <h1 className="font-mono font-bold text-lg md:text-xl uppercase tracking-wider text-white">
                  Explore Members
                </h1>
              </div>
              <GradientBar />
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <MemberFilters members={members} />
          </AnimatedSection>
        </div>
      </main>
    </>
  );
}
