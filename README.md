# Element BC

Building consultancy website built with Next.js, Sanity CMS, and GSAP animations.

## Tech Stack

- **Framework**: Next.js (App Router, no TypeScript strict mode)
- **CMS**: Sanity v3 (studio at /studio)
- **Animations**: GSAP (ScrollTrigger, SplitText, CustomEase) + Locomotive Scroll
- **CSS**: Lumos utility framework (u- classes) + component CSS
- **Fonts**: Adelphi Variable (via next/font/local)
- **Hosting**: Vercel

## Getting Started

### Prerequisites
- Node.js 20+
- A Sanity project (create at sanity.io)

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token  # Only needed for seed script
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Seed Sanity Content

Populate your Sanity dataset with placeholder content:

```bash
npm run seed
```

### Sanity Studio

Access the CMS at [http://localhost:3000/studio](http://localhost:3000/studio)

## Project Structure

```
src/
├── app/
│   ├── (main)/          # Main site routes
│   │   ├── page.tsx     # Home
│   │   ├── about/       # About page
│   │   └── projects/    # Projects listing + detail
│   └── studio/          # Sanity Studio
├── components/
│   ├── layout/          # Navbar, Footer
│   └── ui/              # AnimationProvider, SVGs
├── hooks/               # Animation hooks (useAnimUtils, useSmoothScroll, etc.)
├── lib/
│   ├── animation/       # Animation types
│   ├── gsap/            # GSAP setup and plugin registration
│   └── sanity/          # Sanity client, schemas, queries
├── styles/              # globals.css, lumos-utilities.css, components.css
└── types/               # globals.d.ts (window type extensions)
```

## Deployment

Deploy via Vercel — connect the GitHub repo and add the environment variables in the Vercel dashboard.
