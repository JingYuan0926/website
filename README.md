# Superteam Malaysia

The official website for Superteam Malaysia — the home for Solana builders in Malaysia.

## Project Overview

A full-featured community website with a public landing page showcasing members, events, and opportunities in the Solana ecosystem, plus a comprehensive admin dashboard (CMS) for content management. The site integrates with Luma for event calendar data and Supabase for database, auth, and file storage.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (Pages Router, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)
- **Other Libraries**: React Tweet, React Easy Crop, Marked (Markdown), date-fns, clsx, React Hot Toast

## Features

- **Landing Page** with 9 sections: Hero, Mission, Stats (animated counters), Events (Luma integration), Member Spotlight, Partners, Wall of Love, FAQ (accordion), Join CTA
- **Members Directory** with search and skill-based filtering, card flip interactions with role-based color gradients
- **Admin Dashboard** (CMS) for managing all content — members, events, partners, testimonials, FAQ, announcements, mission pillars, site stats, and site content
- **Luma Calendar Integration** — dual-layer caching (Supabase + CDN) with background sync
- **Role-Based Access Control** — Admin and Editor roles
- **Fully Responsive** — mobile, tablet, and desktop
- **ISR (Incremental Static Regeneration)** — pages revalidate every hour for fresh content
- **Dark Theme** with custom design tokens and tinted neutrals

## Installation

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (optional — the site works with sample data without it)

### Steps

```bash
# Clone the repository
git clone https://github.com/JingYuan0926/website.git
cd website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials (see below)
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SYNC_SECRET=your-sync-secret
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Site URL used for background sync triggers |
| `SYNC_SECRET` | No | Bearer token to protect the Luma sync endpoint |

## Local Development

```bash
# Start the development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Admin Dashboard

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS.

To create an admin user:
1. Create a user in Supabase Auth (Dashboard > Authentication > Users > Add User)
2. Update their role in the `profiles` table to `'admin'`

## Database Setup

1. Create a new [Supabase](https://supabase.com) project
2. Go to the SQL Editor in your Supabase dashboard
3. Run the migration files in order from `supabase/migrations/`:
   - `000_luma_events.sql` — Luma events cache and sync metadata tables
   - `001_initial_schema.sql` — Core schema (members, events, partners, testimonials, FAQ, stats, profiles) with RLS policies and default data
   - `002_cms_enhancements.sql` — CMS enhancements (announcements, site content, mission pillars)
   - `003_mission_faq_images.sql` — Image support for mission pillars and FAQ
4. Create storage buckets in Supabase: `avatars`, `logos`, `events`, `general`

### Supabase Schema

| Table | Purpose |
|---|---|
| `members` | Community member profiles with skills and social links |
| `events` | Events with Luma integration |
| `luma_events` | Cached Luma calendar events (future and past) |
| `luma_sync_meta` | Sync metadata for cache invalidation |
| `partners` | Ecosystem partner logos and tiers (gold/silver/partner) |
| `testimonials` | Wall of Love content (tweets and quotes) |
| `faq_items` | FAQ accordion items |
| `mission_pillars` | Mission section pillars |
| `announcements` | Published announcements |
| `site_stats` | Landing page statistics (single row) |
| `site_content` | CMS key-value content for hero, mission, CTAs |
| `profiles` | Admin/editor user roles (linked to auth.users) |

All tables have Row Level Security enabled with public read and authenticated admin write.

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/luma-events` | GET | Fetch cached Luma events. Query params: `period` (future/past), `cursor` (pagination) |
| `/api/sync-luma-events` | POST | Trigger background sync from Luma API. Protected by `SYNC_SECRET` bearer token |

## Project Structure

```
pages/
├── index.tsx                # Landing page
├── members.tsx              # Members directory
├── api/
│   ├── luma-events.ts       # Cached Luma events endpoint
│   └── sync-luma-events.ts  # Background sync worker
└── admin/                   # Admin dashboard
    ├── index.tsx             # Dashboard overview
    ├── members.tsx           # Manage members
    ├── events.tsx            # Manage events
    ├── partners.tsx          # Manage partners
    ├── testimonials.tsx      # Manage testimonials
    ├── faq.tsx               # Manage FAQ
    ├── announcements.tsx     # Manage announcements
    ├── content.tsx           # Manage site content
    ├── mission.tsx           # Manage mission pillars
    └── settings.tsx          # Site stats

components/
├── landing/                 # Landing page sections (Hero, MemberSpotlight, WallOfLove, etc.)
├── admin/                   # Admin components (AdminLayout, DataTable, FormModal, ImageUpload)
├── shared/                  # Reusable components (AnimatedSection, SkillBadge, Markdown)
├── members/                 # MemberCard, MemberFilters
└── layout/                  # Navbar, Footer

lib/
├── supabase.ts              # Supabase client configuration
├── types.ts                 # TypeScript interfaces
├── constants.ts             # Config and sample data
└── utils.ts                 # Helper functions

supabase/
└── migrations/              # Database migration SQL files

public/                      # Static assets (logos, videos, images)
styles/
└── globals.css              # Tailwind config + custom theme variables
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

### Other Platforms

```bash
# Build the production bundle
npm run build

# Start the production server
npm run start
```

Ensure all environment variables are configured in your hosting platform.
