<br><div align="center">
  <img src="public/logo.png" alt="LockIn Logo" width="80" />

  # 🔒 LockIn

  ### Interview on your schedule — with industry experts.

  A full-stack mock interview platform where candidates book 1-on-1 sessions with verified interviewers, conduct HD video calls, and receive AI-powered feedback — all powered by a credit-based economy.

  [![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=000)](https://react.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff)](https://supabase.com/)
  [![Stream](https://img.shields.io/badge/Stream_Video-005FFF?logo=stream&logoColor=fff)](https://getstream.io/)
  [![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?logo=clerk&logoColor=fff)](https://clerk.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)

  [Live Demo](#) · [Report Bug](https://github.com/nishith-s-acharya/prepon/issues) · [Request Feature](https://github.com/nishith-s-acharya/prepon/issues)

</div>

---

## 📸 Screenshots

<div align="center">

| Landing Page | Interviewer Dashboard |
|:---:|:---:|
| ![Landing Page](public/screenshots/hero-landing.png) | ![Dashboard](public/screenshots/dashboard.png) |

| Booking & Scheduling | AI Feedback Report |
|:---:|:---:|
| ![Booking Page](public/screenshots/booking-page.png) | ![AI Feedback](public/screenshots/ai-feedback.png) |

</div>

---

## ✨ Features

### 🎯 For Interviewees
- **Browse Expert Interviewers** — Filter by category: Frontend, Backend, System Design, DSA, DevOps, Mobile, Behavioral, and Full Stack
- **One-Click Slot Booking** — Pick from available time slots and confirm with a single click
- **HD Video Calls** — 45-minute sessions powered by Stream with screen sharing, recording, and instant playback
- **AI-Powered Feedback** — Post-interview analysis by Google Gemini covering technical depth, communication, problem-solving, strengths, and areas for improvement
- **Persistent Chat** — Message your interviewer before and after the call to share resources, prep notes, and follow-ups
- **Credit-Based Plans** — Subscribe for monthly credits with rollover; Free (1 credit), Starter ($29/5 credits), Pro ($69/15 credits)

### 🧑‍💼 For Interviewers
- **Set Your Availability** — Define your schedule once; candidates book from your open slots
- **AI Question Generator** — Role-specific interview questions generated live via Gemini AI, tailored to the candidate's category
- **Earn Credits** — Get paid per session with configurable credit rates
- **Withdrawal System** — Request payouts anytime; admin-approved with email notifications via Resend
- **Dashboard Analytics** — Track credit balance, total earnings, completed sessions, and withdrawal history

### 🛡️ Platform-Wide
- **Clerk Authentication** — Secure sign-up/sign-in with social logins and a beautifully themed dark UI
- **Role-Based Onboarding** — Guided flow for both interviewees and interviewers with profile setup
- **Arcjet Security** — Bot protection, token-bucket rate limiting, and abuse prevention on all critical API routes
- **Booking Cancellation & Refunds** — Full credit refund with automatic availability slot restoration
- **Responsive Design** — Fully optimized for desktop and mobile with a premium dark theme

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Client (Browser)                  │
│  Next.js 16 App Router · React 19 · Tailwind CSS v4     │
│  shadcn/ui · Radix UI · Motion (Framer Motion)          │
├──────────────────────────────────────────────────────────┤
│                      Authentication                      │
│              Clerk (SSO, Webhooks, Themes)               │
├────────────────┬──────────────────┬──────────────────────┤
│  Server Actions│   API Routes     │    Webhooks          │
│  (actions/)    │   (app/api/)     │   (Clerk sync)       │
├────────────────┴──────────────────┴──────────────────────┤
│                    Business Logic                        │
│  Booking · Scheduling · AI Questions · Feedback          │
│  Credit System · Withdrawals · Cancellations             │
├──────────────────────────────────────────────────────────┤
│                    External Services                     │
│  Stream (Video/Chat) · Gemini AI · Resend (Email)       │
│  Arcjet (Rate Limiting & Security)                      │
├──────────────────────────────────────────────────────────┤
│                      Database                            │
│         Supabase PostgreSQL · Prisma ORM v7              │
│  Users · Bookings · Availability · Feedback · Payouts   │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Server-side rendering, server actions, file-based routing |
| **Frontend** | React 19, Tailwind CSS v4 | Component architecture, utility-first styling |
| **UI Components** | shadcn/ui, Radix UI | Accessible, customizable primitives |
| **Animations** | Motion (Framer Motion) | Micro-interactions, page transitions |
| **Authentication** | Clerk | Social login, session management, webhooks |
| **Database** | Supabase (PostgreSQL) | Managed Postgres with connection pooling |
| **ORM** | Prisma v7 | Type-safe database queries, migrations |
| **Video/Chat** | Stream | HD video calls, screen sharing, recording, real-time chat |
| **AI** | Google Gemini API | Interview question generation, feedback analysis |
| **Email** | Resend + React Email | Transactional emails (withdrawal notifications) |
| **Security** | Arcjet | Token-bucket rate limiting, bot protection |
| **Styling** | Dark theme with amber/gold accent palette | Premium, modern aesthetic |

---

## 📁 Project Structure

```
preptron/
├── app/
│   ├── (auth)/                    # Auth routes (sign-in, sign-up)
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (explore)/                 # Public explore page
│   ├── (main)/                    # Protected routes
│   │   ├── appointments/          # Interviewee appointments view
│   │   ├── call/[callId]/         # Video call room
│   │   ├── dashboard/             # Interviewer dashboard
│   │   │   └── _components/       # Dashboard sub-components
│   │   ├── interviewers/[id]/     # Interviewer profile & booking
│   │   └── onboarding/            # Role selection & profile setup
│   ├── api/webhooks/              # Clerk webhook handler
│   ├── layout.js                  # Root layout (Clerk, theme, fonts)
│   ├── page.jsx                   # Landing page
│   └── globals.css                # Global styles & design tokens
│
├── actions/                       # Server Actions
│   ├── aiQuestions.jsx            # Gemini AI question generation
│   ├── appointments.js            # Fetch interviewee bookings
│   ├── booking.js                 # Slot booking + Stream call creation
│   ├── call.js                    # Call data + Stream token generation
│   ├── cancelBooking.js           # Booking cancellation + credit refund
│   ├── dashboard.js               # Availability, stats, withdrawals
│   ├── explore.js                 # Public interviewer listing
│   ├── onboarding.js              # User role onboarding
│   └── profile.js                 # Profile management
│
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── animate-ui/                # Custom animated components
│   ├── AppointmentCard.jsx        # Session card with status & feedback
│   ├── FeedBackModel.jsx          # AI feedback report modal
│   ├── Header.jsx                 # Navigation header
│   ├── RoleRedirect.jsx           # Auto-redirect by role
│   ├── UpgradeModal.jsx           # Plan upgrade prompt
│   └── reuseables.jsx             # Shared typography components
│
├── hooks/                         # Custom React hooks
│   ├── use-controlled-state.jsx
│   ├── use-fetch.jsx              # Data fetching with loading states
│   └── use-is-in-view.jsx         # Intersection observer hook
│
├── lib/
│   ├── arcjet.js                  # Rate limiter factory + checker
│   ├── checkUser.js               # Clerk → DB user sync
│   ├── data.js                    # Static data (plans, categories, UI config)
│   ├── helper.js                  # Date/time utilities & slot generation
│   ├── prisma.js                  # Prisma client singleton
│   └── utils.js                   # General utilities (cn)
│
├── emails/
│   └── WithdrawalRequestEmail.jsx # React Email template
│
├── prisma/
│   ├── schema.prisma              # Database schema (7 models, 8 enums)
│   ├── seed.js                    # Database seeder
│   └── migrations/                # Database migrations
│
└── public/                        # Static assets (logos, favicons)
```

---

## 📊 Database Schema

The application uses **7 models** and **8 enums** to power the complete interview lifecycle:

```mermaid
erDiagram
    User ||--o{ Availability : sets
    User ||--o{ Booking : "books as interviewee"
    User ||--o{ Booking : "conducts as interviewer"
    User ||--o{ CreditTransaction : has
    User ||--o{ Payout : requests
    Booking ||--o| Feedback : receives
    Booking ||--o{ CreditTransaction : generates

    User {
        string id PK
        string clerkUserId UK
        string email UK
        UserRole role
        int credits
        string currentPlan
        string bio
        string title
        string company
        int yearsExp
        InterviewCategory[] categories
        int creditRate
        int creditBalance
    }

    Booking {
        string id PK
        string intervieweeId FK
        string interviewerId FK
        datetime startTime
        datetime endTime
        BookingStatus status
        int creditsCharged
        string streamCallId UK
    }

    Feedback {
        string id PK
        string bookingId FK
        string summary
        string technical
        string communication
        string problemSolving
        FeedbackRating overallRating
        string[] strengths
        string[] improvements
    }
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- Accounts on: [Clerk](https://clerk.com), [Supabase](https://supabase.com), [Stream](https://getstream.io), [Google AI Studio](https://aistudio.google.com), [Arcjet](https://arcjet.com), [Resend](https://resend.com)

### 1. Clone the repository

```bash
git clone https://github.com/nishith-s-acharya/prepon.git
cd prepon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# ── Clerk Authentication ──────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ── Database (Supabase PostgreSQL) ────────────────────
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# ── Stream (Video & Chat) ────────────────────────────
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key

# ── Supabase ──────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx

# ── Google Gemini AI ──────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Arcjet (Rate Limiting) ───────────────────────────
ARCJET_KEY=ajkey_xxxxx

# ── Resend (Emails) ──────────────────────────────────
RESEND_API_KEY=re_xxxxx
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed the database
npx prisma db seed
```

### 5. Configure Clerk Webhook

Set up a webhook in your [Clerk Dashboard](https://dashboard.clerk.com) pointing to:
```
https://your-domain.com/api/webhooks/clerk
```

Subscribe to the `user.created` and `user.updated` events.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🔑 Key Implementation Details

### Credit Economy
- **Interviewees** subscribe to plans (Free/Starter/Pro) that grant monthly credits
- **1 credit = 1 session** — credits are deducted on booking and credited to the interviewer
- **Interviewers** accumulate credits and can request withdrawals with a 20% platform fee
- All credit movements are tracked via the `CreditTransaction` ledger

### AI Integration (Gemini)
- **Question Generation**: Category-specific prompts generate 6 tailored questions per session
- **Model Fallback**: Automatically cycles through `gemini-2.0-flash-lite` → `gemini-2.0-flash` → `gemini-2.5-flash-lite` on quota exhaustion
- **Feedback Reports**: AI-generated analysis covering technical skills, communication, problem-solving, with actionable recommendations

### Video Calls (Stream)
- Calls are created server-side with `@stream-io/node-sdk` during booking
- Both participants are registered as `host` for full permissions
- Settings include 1080p recording, screen sharing, and auto-transcription
- Time-based access control: 10min early join, 30min late buffer

### Security (Arcjet)
- **Token-bucket rate limiting** on booking (5 req/hr) and withdrawal (3 req/hr) endpoints
- Per-user fingerprinting via Clerk user ID (not IP-based)
- Both `LIVE` mode enforcement with graceful error messages

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (includes `prisma generate`) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma migrate dev` | Create and apply migrations |
| `npx prisma db seed` | Seed the database |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. The `postinstall` script automatically runs `prisma generate`
5. Deploy!

> **Note:** Make sure your Supabase database allows connections from Vercel's IP ranges, or use connection pooling.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

  **Built with ❤️ by [Nishith S Acharya](https://github.com/nishith-s-acharya)**

  If this project helped you, consider giving it a ⭐

</div>
