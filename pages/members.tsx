import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
            <SectionHeading
              label="Community"
              title="Our members"
              description="Explore the talented builders and creators in the Superteam Malaysia community."
            />
          </AnimatedSection>

          <div className="mt-12">
            <MemberFilters members={members} />
          </div>
        </div>
      </main>
    </>
  );
}
