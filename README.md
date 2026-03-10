# Superteam Malaysia

The official website for Superteam Malaysia — the home for Solana builders in Malaysia.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (Pages Router, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)

## Features

- **Landing Page** with 9 sections: Hero, Mission, Stats (animated counters), Events (Luma integration), Member Spotlight, Partners, Wall of Love, FAQ (accordion), Join CTA
- **Members Directory** with search and skill-based filtering
- **Admin Dashboard** (CMS) for managing all content — members, events, partners, testimonials, FAQ, site stats
- **Role-Based Access Control** — Admin and Editor roles
- **Fully Responsive** — mobile, tablet, and desktop
- **SEO Optimized** — Open Graph meta tags, semantic HTML
- **ISR (Incremental Static Regeneration)** — pages revalidate every hour for fresh content
- **Dark Theme** with OKLCH color system and tinted neutrals

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (optional — the site works with sample data without it)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database Setup

1. Create a new Supabase project
2. Go to the SQL Editor in your Supabase dashboard
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. This creates all tables, RLS policies, default data, and an auto-profile trigger

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Admin Dashboard

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS.

To create an admin user:
1. Create a user in Supabase Auth (Dashboard > Authentication > Users > Add User)
2. Update their role in the `profiles` table to `'admin'`

## Project Structure

```
pages/
├── index.tsx             # Landing page
├── members.tsx           # Members directory
├── admin/                # Admin dashboard (6 CRUD pages + settings)
│   ├── index.tsx         # Dashboard overview
│   ├── login.tsx         # Auth login
│   ├── members.tsx       # Manage members
│   ├── events.tsx        # Manage events
│   ├── partners.tsx      # Manage partners
│   ├── testimonials.tsx  # Manage testimonials
│   ├── faq.tsx           # Manage FAQ
│   └── settings.tsx      # Site stats
components/
├── layout/               # Navbar, Footer
├── landing/              # 9 landing page sections
├── members/              # MemberCard, MemberFilters
├── admin/                # AdminLayout, DataTable, FormModal
├── shared/               # AnimatedSection, SectionHeading, SkillBadge
lib/
├── supabase.ts           # Supabase client
├── types.ts              # TypeScript interfaces
├── constants.ts          # Config, sample data
├── utils.ts              # Helpers
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Build

```bash
npm run build
npm start
```

## Supabase Schema

| Table | Purpose |
|-------|---------|
| `members` | Community member profiles |
| `events` | Events with Luma integration |
| `partners` | Ecosystem partner logos |
| `testimonials` | Wall of Love content |
| `faq_items` | FAQ accordion items |
| `site_stats` | Landing page statistics |
| `profiles` | Admin user roles (linked to auth.users) |

All tables have Row Level Security enabled with public read and authenticated admin write.
