# Supabase + Vercel Deployment & Setup Guide
## One Bohol For Good Governance (OBGG)

This system is configured to run in both:
1. **Live Supabase PostgreSQL Mode** (connected via environment variables with realtime synchronization and persistent SQL storage).
2. **Instant Local Storage Fallback Mode** (works seamlessly offline or during preliminary presentations with all 200 pre-seeded members).

---

### Step 1: Supabase Database & Storage Setup (2 Minutes)

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard) and select or create a project.
2. In the left navigation, go to **SQL Editor** -> **New Query**.
3. Copy the complete SQL contents from `supabase/schema.sql` and click **Run**.
   - This creates:
     - `public.members` table with primary key `id` (`OBGG-2026-XXXX`).
     - Performance indexes on `region`, `province`, `municipality`, `role`, `sector`, and `status`.
     - Open Row Level Security (RLS) policies for the portal demo.
     - Realtime publication `ALTER PUBLICATION supabase_realtime ADD TABLE public.members`.
     - Public storage bucket `member-photos` for 1:1 ID portraits.
4. Navigate to **Project Settings** -> **API** and copy:
   - **Project URL** (`https://xxxxxxxxxxxx.supabase.co`)
   - **anon / public key** (`eyJhbGciOi...`)

---

### Step 2: Automatic Seed Data Population

- The application contains an **Auto-Seed Engine** in `src/lib/member-service.ts`.
- When you first load the portal connected to your new Supabase project, if `public.members` has 0 rows, the system **automatically seeds all 200 members in batches** into Supabase!
- You can also click the **"Reset (200)"** button in the top navigation bar at any time to reseed or reset the records back to the 200 initial members.

---

### Step 3: Vercel Production Deployment

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete One Bohol For Good Governance member portal"
   git push origin main
   ```
2. In your [Vercel Dashboard](https://vercel.com/new), import the repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase Anon API Key
4. Click **Deploy**. Vercel will build Next.js 15 App Router with full static and dynamic route optimization.
5. Your live URL will immediately be accessible online.

---

### Key Features Checklist
- [x] **Option A Institutional UI:** Solid Deep Forest Green (`#0B4619`), 3px Philippine Tricolor bar, zero rounded pills (`rounded-sm` / `rounded-md` borders).
- [x] **200 Unique Members:** 100% unique Filipino names, gender-matched portrait photos, authentic Bohol 3-district and 17-region distribution.
- [x] **Executive Command Center:** 4 KPI Cards + 3 Recharts Visualizations (Geographic Bar, Role Donut, Sectoral Horizontal Bar).
- [x] **GovTech DataTable:** Cascading filters (Region -> Province -> Municipality), status badges, instant one-click verification, and CSV export.
- [x] **4-Step Registration Wizard:** Age auto-calculator, client-side 1:1 photo cropping and compression, auto-issuance of next ID (`OBGG-2026-0201`+).
- [x] **Printable PVC Digital ID Modal:** Crisp deterministic QR Code (*"Phase 2: Live QR Verification Ready"*), high-contrast print layout.
