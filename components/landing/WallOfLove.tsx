import dynamic from "next/dynamic";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Markdown } from "@/components/shared/Markdown";
import { getInitials } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

interface WallOfLoveProps {
  testimonials: Testimonial[];
}

const ReactTweet = dynamic(
  () => import("react-tweet").then((m) => ({ default: m.Tweet })),
  { ssr: false }
);

function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : null;
}

/** Convert @mentions and #hashtags to markdown links */
function linkifyContent(content: string): string {
  return content
    .replace(/(^|\s)@(\w+)/gm, "$1[@$2](https://x.com/$2)")
    .replace(/(^|\s)#(\w+)/gm, "$1[#$2](https://x.com/hashtag/$2)");
}

function TweetCard({ testimonial }: { testimonial: Testimonial }) {
  const processedContent = linkifyContent(testimonial.content);
  const hasLink = !!testimonial.twitter_url;
  const displayHandle =
    testimonial.author_handle || testimonial.author_title || null;

  return (
    <div
      className={`break-inside-avoid tweet-card rounded-2xl px-4 pt-3 pb-3 transition-colors ${hasLink ? "cursor-pointer" : ""}`}
      onClick={
        hasLink
          ? () => window.open(testimonial.twitter_url, "_blank", "noopener")
          : undefined
      }
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        {testimonial.author_avatar_url ? (
          <img
            src={testimonial.author_avatar_url}
            alt={testimonial.author_name}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple-light font-bold text-sm flex-shrink-0">
            {getInitials(testimonial.author_name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 pt-0.5">
              <p className="text-[15px] font-bold text-[#e7e9ea] leading-5 truncate">
                {testimonial.author_name}
              </p>
              {displayHandle && (
                <p className="text-[15px] text-[#8b98a5] leading-5 truncate">
                  {displayHandle}
                </p>
              )}
            </div>
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-[#8b98a5] flex-shrink-0"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 text-[15px] text-[#e7e9ea] leading-[1.5]">
        <Markdown content={processedContent} className="tweet-prose" />
      </div>

      {/* Image */}
      {testimonial.image_url && (
        <div className="mt-3 rounded-xl overflow-hidden border border-[rgb(56,68,77)]">
          <img
            src={testimonial.image_url}
            alt=""
            className="w-full object-cover max-h-[300px]"
          />
        </div>
      )}
    </div>
  );
}

export function WallOfLove({ testimonials }: WallOfLoveProps) {
  if (!testimonials.length) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <SectionHeading
            label="Community"
            title="Wall of love"
            description="Hear from builders and ecosystem leaders in our community."
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection
          stagger
          className="mt-14 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {testimonials.map((testimonial) => {
            const tweetId =
              testimonial.is_tweet_embed && testimonial.twitter_url
                ? extractTweetId(testimonial.twitter_url)
                : null;

            return (
              <AnimatedItem key={testimonial.id}>
                {tweetId ? (
                  <div className="break-inside-avoid tweet-embed" data-theme="dark">
                    <ReactTweet id={tweetId} />
                  </div>
                ) : (
                  <TweetCard testimonial={testimonial} />
                )}
              </AnimatedItem>
            );
          })}
        </AnimatedSection>
      </div>
    </section>
  );
}
