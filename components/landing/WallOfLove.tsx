import { Markdown } from "@/components/shared/Markdown";
import { getInitials } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

interface WallOfLoveProps {
  testimonials: Testimonial[];
}

/** Convert @mentions and #hashtags to markdown links */
function linkifyContent(content: string): string {
  return content
    .replace(/(^|\s)@(\w+)/gm, "$1[@$2](https://x.com/$2)")
    .replace(/(^|\s)#(\w+)/gm, "$1[#$2](https://x.com/hashtag/$2)");
}

const MOCK_TWEETS: Testimonial[] = [
  {
    id: "m1",
    author_name: "Superteam Malaysia",
    author_handle: "@SuperteamMY",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=superteammy",
    content: "Proud to announce that Superteam Malaysia is officially one of the fastest-growing chapters in the @SuperteamDAO network!\n\nFrom hackathons to builder meetups, our community has shipped some incredible projects this year.\n\nLet's keep building 🔥",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=340&fit=crop",
    twitter_url: "https://x.com/SuperteamMY",
    is_tweet_embed: true,
    display_order: 1,
    created_at: "2025-12-01",
  },
  {
    id: "m2",
    author_name: "Raj Gokal",
    author_handle: "@rajgokal",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=rajgokal",
    content: "Solana is one of the strongest ecosystems out there and keeps growing. It was an awesome evening at the Founder's Villa Demo Day 2, with our fellow #VC friends and some innovative projects building on @solana 🔥\n\n@SuperteamMY is killing it! 🤩\n\n#Solana #ecosystem #Malaysia",
    image_url: "",
    twitter_url: "https://x.com/rajgokal",
    is_tweet_embed: true,
    display_order: 2,
    created_at: "2025-11-28",
  },
  {
    id: "m3",
    author_name: "Valentina",
    author_handle: "@vaacross",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=valentina",
    content: "I applied for residency in Malaysia and was rejected twice. Then I reached out to @SuperteamMY, who quickly connected me with an agency that handled everything. Within days, my application was approved.\n\nIf you're moving to Malaysia, @SuperteamMY is truly a life changing resource.",
    image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop",
    twitter_url: "https://x.com/vaacross",
    is_tweet_embed: true,
    display_order: 3,
    created_at: "2025-11-25",
  },
  {
    id: "m4",
    author_name: "Joe Takayama",
    author_handle: "@takayamajoe",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=joetakayama",
    content: "Alex and @SuperteamMY were one of my key milestones. It opened up so many doors for me.\n\nForever grateful for the intro to the @solana ecosystem. Changed my career trajectory completely.",
    image_url: "",
    twitter_url: "https://x.com/takayamajoe",
    is_tweet_embed: true,
    display_order: 4,
    created_at: "2025-11-20",
  },
  {
    id: "m5",
    author_name: "Superteam Malaysia",
    author_handle: "@SuperteamMY",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=superteammy",
    content: "Founder's Tea 2025 delivered results: web3 legal strategy, founder workshops, and more funding. Watch the recap video to see what you missed.\n\nNext one is going to be even bigger. Stay tuned 👀",
    image_url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=340&fit=crop",
    twitter_url: "https://x.com/SuperteamMY",
    is_tweet_embed: true,
    display_order: 5,
    created_at: "2025-11-18",
  },
  {
    id: "m6",
    author_name: "Mert Mumtaz",
    author_handle: "@0xMert_",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=0xmert",
    content: "The Superteam model works. Decentralized community chapters driving local adoption is how you actually grow a blockchain ecosystem.\n\nMalaysia chapter is a great example of this in action. Keep pushing @SuperteamMY 🫡",
    image_url: "",
    twitter_url: "https://x.com/0xMert_",
    is_tweet_embed: true,
    display_order: 6,
    created_at: "2025-11-15",
  },
  {
    id: "m7",
    author_name: "Superteam Malaysia",
    author_handle: "@SuperteamMY",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=superteammy",
    content: "Your crypto vaults have cold wallets.\n\nOur crypto vaults have Maserati.\n\nWe are not the same. 😎",
    image_url: "",
    twitter_url: "https://x.com/SuperteamMY",
    is_tweet_embed: true,
    display_order: 7,
    created_at: "2025-11-12",
  },
  {
    id: "m8",
    author_name: "Akshay BD",
    author_handle: "@AkshayBD",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=akshayyy",
    content: "This is how a community engages with founders in Malaysia. No hidden agendas, no passive-aggressive messaging or generally adversarial stances.\n\nPrinciple-based regulations and a forward-looking approach. They're leading as fast as a regulator can for a market of this size and that's worth prioritising.\n\nIf you're building something and feel lost, consider engaging with @SuperteamMY 🇲🇾",
    image_url: "",
    twitter_url: "https://x.com/AkshayBD",
    is_tweet_embed: true,
    display_order: 8,
    created_at: "2025-11-10",
  },
  {
    id: "m9",
    author_name: "Sugsven Sebastiaan",
    author_handle: "@sugsven",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=sugsven",
    content: "Unfadable the work being done by @SuperteamMY. Thanks also to the only one always helping us 🙏\n\n#Solana #Malaysia #Web3",
    image_url: "",
    twitter_url: "https://x.com/sugsven",
    is_tweet_embed: true,
    display_order: 9,
    created_at: "2025-11-08",
  },
  {
    id: "m10",
    author_name: "Superteam Malaysia",
    author_handle: "@SuperteamMY",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=superteammy",
    content: "Solana in Malaysia is just getting started 🚀\n\nWe hosted 12 events, onboarded 50+ new builders, and helped launch 8 projects this quarter alone.\n\nThe best is yet to come.",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=340&fit=crop",
    twitter_url: "https://x.com/SuperteamMY",
    is_tweet_embed: true,
    display_order: 10,
    created_at: "2025-11-05",
  },
  {
    id: "m11",
    author_name: "Belinda",
    author_handle: "@belinda_sol",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=belinda",
    content: "Solid vs. demo day organized by @SuperteamMY!\n\nOne of the best demo days I have been to recently — Projects touching web3 by going much more depth, consumer applications apart from defi protocols, more legit background, many from web2 such as ex-corporates, finance, commodity.\n\nIt's refreshing to see every first time founders trying to build with new ideas while chains in crypto still early played by grant-hunting devs. We're looking at real adoption and new liquidity — fresh money come with wishing traction or innovative use cases usually in a demo stage.\n\n#Solana #BuildOnSolana",
    image_url: "",
    twitter_url: "https://x.com/belinda_sol",
    is_tweet_embed: true,
    display_order: 11,
    created_at: "2025-11-01",
  },
  {
    id: "m12",
    author_name: "Wei Chen",
    author_handle: "@weichen_dev",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=weichen",
    content: "Just shipped my first Solana dApp after joining the @SuperteamMY hackathon. The mentorship was incredible — shoutout to the whole team!\n\n#BuildOnSolana",
    image_url: "",
    twitter_url: "https://x.com/weichen_dev",
    is_tweet_embed: true,
    display_order: 12,
    created_at: "2025-10-28",
  },
  {
    id: "m13",
    author_name: "Superteam Malaysia",
    author_handle: "@SuperteamMY",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=superteammy",
    content: "Take it everywhere 🌏\n\nBring your startup to Malaysia. The Superteam Malaysia community and partners will help you set up in this global business hub.\n\nJoin us at the Founder's Villa in October. #Solana",
    image_url: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=600&h=340&fit=crop",
    twitter_url: "https://x.com/SuperteamMY",
    is_tweet_embed: true,
    display_order: 13,
    created_at: "2025-10-25",
  },
  {
    id: "m14",
    author_name: "Daniel Tan",
    author_handle: "@dtan_crypto",
    author_title: "",
    author_avatar_url: "https://i.pravatar.cc/150?u=danieltan",
    content: "The bounty program through Superteam has been a game changer. Earned my first SOL by contributing actual value to real projects.\n\nHighly recommend for anyone getting into #Solana dev. @SuperteamMY making it happen.",
    image_url: "",
    twitter_url: "",
    is_tweet_embed: false,
    display_order: 14,
    created_at: "2025-10-20",
  },
];

function TweetCard({ testimonial, compact }: { testimonial: Testimonial; compact?: boolean }) {
  const processedContent = linkifyContent(testimonial.content);
  const hasLink = !!testimonial.twitter_url;
  const displayHandle =
    testimonial.author_handle || testimonial.author_title || null;

  return (
    <div
      className={`break-inside-avoid tweet-card rounded-xl p-3 transition-colors h-full flex flex-col ${hasLink ? "cursor-pointer" : ""}`}
      onClick={
        hasLink
          ? () => window.open(testimonial.twitter_url, "_blank", "noopener")
          : undefined
      }
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        {testimonial.author_avatar_url ? (
          <img
            src={testimonial.author_avatar_url}
            alt={testimonial.author_name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple-light font-bold text-[10px] flex-shrink-0">
            {getInitials(testimonial.author_name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-5 truncate">
                {testimonial.author_name}
              </p>
              {displayHandle && (
                <p className="text-xs text-[#71767b] leading-4 truncate">
                  {displayHandle}
                </p>
              )}
            </div>
            {hasLink && (
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-[#71767b] flex-shrink-0"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-2 text-[13px] text-[#d7dbdc] leading-[1.55] flex-1 overflow-hidden">
        <Markdown content={processedContent} className="tweet-prose" />
      </div>

      {/* Image */}
      {testimonial.image_url && (
        <div className="mt-2 rounded-lg overflow-hidden border border-[#2f3336] flex-shrink-0 aspect-video">
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

/**
 * Build a 4-column, 2-row layout:
 * - Image tweets → span 2 rows (fill a whole column)
 * - Text-only tweets → 1 row each (2 stack in a column)
 * Returns an array of { tweet, rowSpan } in column-major order.
 */
function buildGrid(data: Testimonial[]): { tweet: Testimonial; rowSpan: number }[] {
  const withImage = data.filter((t) => !!t.image_url);
  const textOnly = data.filter((t) => !t.image_url);

  const grid: { tweet: Testimonial; rowSpan: number }[] = [];
  let imgIdx = 0;
  let txtIdx = 0;

  for (let col = 0; col < 4; col++) {
    // Alternate: even cols get text pairs, odd cols get image tweets
    if (col % 2 === 0 && txtIdx + 1 < textOnly.length) {
      grid.push({ tweet: textOnly[txtIdx++], rowSpan: 1 });
      grid.push({ tweet: textOnly[txtIdx++], rowSpan: 1 });
    } else if (imgIdx < withImage.length) {
      grid.push({ tweet: withImage[imgIdx++], rowSpan: 2 });
    } else if (txtIdx + 1 < textOnly.length) {
      grid.push({ tweet: textOnly[txtIdx++], rowSpan: 1 });
      grid.push({ tweet: textOnly[txtIdx++], rowSpan: 1 });
    } else if (txtIdx < textOnly.length) {
      grid.push({ tweet: textOnly[txtIdx++], rowSpan: 1 });
    }
  }

  return grid;
}

export function WallOfLove({ testimonials }: WallOfLoveProps) {
  const data = testimonials.length >= 3 ? testimonials : MOCK_TWEETS;
  const grid = buildGrid(data);

  return (
    <section
      className="relative bg-black flex flex-col justify-center px-6 overflow-hidden"
      style={{ height: "100dvh", scrollSnapAlign: "start" }}
    >
      <div className="max-w-[1400px] mx-auto w-full" style={{ maxHeight: "80vh" }}>
        <div className="mb-6">
          <h2
            className="text-white font-semibold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)" }}
          >
            Wall of love
          </h2>
          <p className="mt-3 text-[#a1a1aa] text-sm leading-relaxed max-w-md">
            Hear from builders and ecosystem leaders in our community.
          </p>
        </div>

        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "1fr 1fr",
            gridAutoFlow: "column",
            height: "60vh",
          }}
        >
          {grid.map(({ tweet, rowSpan }) => (
            <div
              key={tweet.id}
              style={{ gridRow: rowSpan === 2 ? "span 2" : undefined, minHeight: 0 }}
            >
              <div className="h-full overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#0a0a0a]">
                <TweetCard testimonial={tweet} compact={rowSpan === 1} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-3">
          <a
            href="https://x.com/SuperteamMY"
            target="_blank"
            rel="noopener noreferrer"
            className="text-m font-bold text-[#ffffff] underline hover:text-white transition-colors"
          >
            View All...
          </a>
        </div>
      </div>
    </section>
  );
}
