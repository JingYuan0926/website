import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Markdown } from "@/components/shared/Markdown";
import { getInitials } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

interface WallOfLoveProps {
  testimonials: Testimonial[];
  content?: Record<string, string>;
}

const ReactTweet = dynamic(
  () => import("react-tweet").then((m) => ({ default: m.Tweet })),
  { ssr: false }
) as React.ComponentType<{ id: string }>;

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
      className={`break-inside-avoid tweet-card rounded-2xl px-4 pt-3 pb-3 transition-colors h-full flex flex-col ${hasLink ? "cursor-pointer" : ""}`}
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
      <div className="mt-3 text-[15px] text-[#e7e9ea] leading-[1.5] flex-1 overflow-hidden">
        <Markdown content={processedContent} className="tweet-prose" />
      </div>

      {/* Image */}
      {testimonial.image_url && (
        <div className="mt-3 rounded-xl overflow-hidden border border-[rgb(56,68,77)] flex-shrink-0 aspect-video">
          <img
            src={testimonial.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

export function WallOfLove({ testimonials, content = {} }: WallOfLoveProps) {
  const c = (key: string, fallback: string) => content[key] || fallback;
  const [showAll, setShowAll] = useState(false);
  if (!testimonials?.length) return null;

  const MOBILE_LIMIT = 5;
  const visibleTestimonials = showAll ? testimonials : testimonials;

  return (
    <section
      className="relative bg-black px-6 py-16 lg:py-24"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-8">
          <h2
            className="text-white font-semibold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
          >
            {c("testimonials.title", "Wall of love")}
          </h2>
          <p className="mt-3 text-[#a1a1aa] text-sm leading-relaxed max-w-md">
            {c("testimonials.description", "Hear from builders and ecosystem leaders in our community.")}
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          {visibleTestimonials.map((testimonial, i) => {
            const tweetId =
              testimonial.is_tweet_embed && testimonial.twitter_url
                ? extractTweetId(testimonial.twitter_url)
                : null;

            return (
              <div
                key={testimonial.id}
                className={i >= MOBILE_LIMIT && !showAll ? "hidden sm:block" : ""}
              >
                <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
                  {tweetId ? (
                    <div className="tweet-embed" data-theme="dark">
                      <ReactTweet id={tweetId} />
                    </div>
                  ) : (
                    <TweetCard testimonial={testimonial} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {testimonials.length > MOBILE_LIMIT && !showAll && (
          <div className="sm:hidden mt-6 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-5 py-2.5 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Show all
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
