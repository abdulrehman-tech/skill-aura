# Skillora

> **Trade time, not money. Learn anything.**

A web-platform prototype where users **exchange skills** using a **time-credit system** — teach 1 hour, earn 1 credit, spend it learning anything else. Built as a university assignment prototype.

![Skillora](public/logo.jpg)

---

## Features (all 9 from the brief)

| # | Feature | Where to see it |
|---|---|---|
| 1 | Smart Matching — by skill, time, learning style | `/match` (3-step wizard) |
| 2 | Time Credit System — 1 h = 1 credit | navbar pill, dashboard, booking |
| 3 | Wide Range of Skills — 7 categories | `/browse` (25 mock skills) |
| 4 | Rating & Badges — Beginner / Expert / Pro | `/leaderboard`, every profile |
| 5 | Group Sessions — multi-user exchanges | `/sessions` → "Group only" tab |
| 6 | Cross-Cultural Learning | session type "cultural" + diverse tutor pool |
| 7 | User Verification | verified checkmark on profiles |
| 8 | Premium Subscription | `/premium` (free vs $9.99/mo) |
| 9 | Digital Certificates | `/certificates` |

---

## Stack

- **Vite + React 18 + TypeScript**
- **TailwindCSS 3** — utility-first styling
- **Radix UI** primitives (Dialog, Tabs, Avatar, Dropdown)
- **React Router v6** — client-side routing
- **lucide-react** — icons
- **localStorage** — persists current user, sessions, theme

No backend. All state is client-side mock data — perfect for presentation/demo.

---

## Run it

```bash
cd skill-aura
npm install
npm run dev
```

Open <http://localhost:5173>. Build for prod with `npm run build`.

### Quick demo flow

1. Land on `/` — hero, 9 features, categories, featured tutors.
2. Click **Get started** → 3-step signup → 5 welcome credits.
3. Or **Login** → 3 quick-login avatars (any email works in the form too).
4. **Dashboard** → credits, stats, upcoming sessions, recent activity.
5. **Smart Match** (`/match`) — 3-question wizard returns ranked tutor matches with reasons.
6. **Browse** (`/browse`) — search, filter by category/level, book any skill.
7. Click any **skill card** → detail page with reviews + tutor sidebar + booking modal.
8. Visit **Leaderboard**, **Premium**, **Certificates** — all populated.
9. Toggle dark mode in the navbar.

---

## Project structure

```
src/
├── App.tsx                    # router setup
├── main.tsx
├── index.css                  # Tailwind + utility classes
├── components/
│   ├── layout/                # Navbar, Footer
│   ├── ui/                    # Logo, Avatar, Badge, RatingStars, CreditPill, Modal
│   └── BookingDialog.tsx      # reusable booking modal
├── pages/                     # Landing, Login, Signup, Dashboard, Browse,
│                              # SkillDetail, Match, Sessions, Profile,
│                              # Leaderboard, Certificates, Premium, NotFound
├── data/
│   ├── users.ts               # 12 tutors with full profiles
│   ├── skills.ts              # 25 skills across 7 categories
│   ├── sessions.ts            # mock past + upcoming
│   ├── certificates.ts
│   └── categories.ts
├── lib/
│   ├── store.ts               # localStorage wrapper
│   ├── matching.ts            # Smart Match scoring algorithm
│   ├── types.ts
│   └── utils.ts
└── hooks/
    └── useUser.ts             # reactive current-user hook
```

---

## Smart Match algorithm (`src/lib/matching.ts`)

Pure function. For each skill scores:

```
score =
  (title/tag matches query)       ? +5
+ (skill.category matches input)  ? +3
+ (tutor available at slot)       ? +2
+ (style matches skill or tutor)  ? +2
+ skill.rating
+ (verified tutor)                ? +0.5
```

Returns top 8 with the reasons that contributed — shown as chips on each match card.

---

## Brand

- **Logo**: gradient emblem at `public/logo.jpg`
- **Palette**: teal → sky → indigo → violet (drawn from the logo)
- **Type**: Inter (Google Fonts)
- **Tone**: friendly, modern, generous spacing, rounded-2xl, soft shadows

---

## Mocks & limits (out of scope)

- No real auth, payments, video calls, or email — this is a UI prototype.
- Data lives in `src/data/*.ts` and `localStorage`.
- "Download certificate" / "Join meeting" buttons trigger alerts.
- "Upgrade to Premium" sets a flag on the user — no real billing.

---

## Built from spec

This prototype implements every section of the SkillSwap project brief — rebranded as **Skillora** for the assignment. See the original PDF for problem statement, target users, business model, and value proposition (all reflected in `/`, `/premium`, and the brand voice).

Built for university presentation.
