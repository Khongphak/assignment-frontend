# agnos-frontend

Next.js 16 frontend for the Agnos assessment, built with the App Router, TypeScript, Tailwind CSS, and ESLint.

## Project Structure

```
agnos-frontend/
├── app/              # Next.js App Router — pages, layouts, and route handlers
├── components/       # Reusable UI components (pure presentational or compound)
├── hooks/            # Custom React hooks (data-fetching, state, side-effects)
├── services/         # API / external-service clients (REST, WebSocket, etc.)
├── lib/              # Shared utilities and helpers with no React dependency
├── types/            # Shared TypeScript types and interfaces
└── public/           # Static assets served at the root path
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in the values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the REST API |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Deploying to Vercel

Push to GitHub and import the repository in the [Vercel dashboard](https://vercel.com/new). Set the environment variables from `.env.local.example` in **Project Settings → Environment Variables** before deploying.
