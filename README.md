# Amartha Assist Frontend

An AI-powered customer service chatbot interface for Amartha, an Indonesian fintech P2P lending platform.

## Overview

Amartha Assist is a conversational AI assistant that helps users navigate Amartha's products and services:
- **Modal** - Microloans for women entrepreneurs
- **Celengan** - Investment products with various returns
- **AmarthaLink** - PPOB agent services (bills, top-up, cash withdrawal)

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4 with Radix UI components
- **Authentication**: Supabase Auth (SSR)
- **AI Chat**: Server-Sent Events (SSE) for streaming responses
- **Deployment**: Cloudflare Pages

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Authenticated routes
│   ├── (public)/           # Public routes
│   └── layout.tsx          # Root layout
├── components/
│   ├── chat/               # Chat UI components
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── navbar.tsx          # Navigation bar
│   └── FloatingChatButton.tsx
├── modules/
│   ├── amartha-link/       # AmarthaLink PPOB features
│   ├── celengan/           # Investment products
│   ├── login/              # Authentication
│   ├── register/           # User registration
│   ├── onboarding/         # User onboarding flow
│   ├── product/            # Product showcase
│   └── modal/              # Loan application
├── hooks/                  # Custom React hooks
├── services/               # API service layer
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

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
