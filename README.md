# agnos-frontend

Hospital middleware frontend that connects patients and staff in real time. Patients use a registration form to submit their information; staff monitor all active patient sessions live via a real-time dashboard. Built with Next.js App Router, TypeScript, Tailwind CSS, and WebSocket.

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

## Pages

| Path | Description |
|---|---|
| `/patient?hospital_code=<code>` | Patient Registration Form — กรอกข้อมูลและส่งแบบฟอร์ม real-time |
| `/staff` | Staff Login |
| `/staff/view` | Staff Real-Time View — ดู patient sessions แบบ live พร้อม status filter |

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
| `NEXT_PUBLIC_WS_BASE_URL` | WebSocket server URL |

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

## Bonus features

- **httpOnly cookie สำหรับ refresh token** — refresh_token เก็บใน httpOnly cookie ผ่าน Next.js Server Action ไม่ถูก JavaScript อ่านได้
- **Auto-refresh** — access_token ถูก refresh อัตโนมัติก่อนหมดอายุ 60 วินาที ไม่ต้อง login ใหม่
- **Restore session on reload** — เปิดหน้า `/staff/view` ใหม่จะ restore access token จาก cookie อัตโนมัติ
- **WebSocket status indicator** — แสดง live / กำลังเชื่อมต่อ / ขาดการเชื่อมต่อ แบบ real-time
- **Session filter tabs** — กรอง patient session ตาม status: filling / submitted / inactive พร้อม count
