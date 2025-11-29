# Amartha Assist Frontend

A Next.js application for Amartha Assist.

## Prerequisites

- Node.js 18+
- pnpm

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Running the App

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

## Deployment

### Cloudflare Pages

```bash
pnpm deploy:cf
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm deploy:cf` | Deploy to Cloudflare Pages |
