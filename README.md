# Calculator

A minimal, responsive web application featuring a full-featured calculator homepage, a protected games catalog behind server-side access-code authorization, and a Supabase-authenticated administrator dashboard.

## Features

- **Calculator Homepage (`/`)**: Standard arithmetic, percentages, decimals, negative numbers, parentheses, order of operations, clear (`AC`), backspace, keyboard input, and division-by-zero error handling. Independent of backend availability.
- **Protected Games Section (`/games`, `/games/:slug`)**: Gated behind server-verified access codes or authenticated administrator accounts. Includes search, category filtering (`Arcade`, `Puzzle`, `Strategy`, `Racing`, `Platformer`, `Multiplayer`, `Casual`, `Other`), built-in playable HTML5 games, legal embeds, and official external links.
- **Administrator System (`/admin`)**: Supabase Auth email/password login with server-side `admin_users` role verification, cryptographic backend access code generation, code rotation (revoking prior active codes and sessions), expiration controls, and game/category management.

---

## Project Structure

```text
public/
  _redirects                  # Cloudflare Pages SPA fallback
  favicon.svg
src/
  admin/                      # Admin login, access-code, game, and category managers
  assets/images/              # Generated game thumbnails
  calculator/                 # Independent expression evaluator and Calculator widget
  components/                 # Navbar and GameCard
  games/                      # Access gate, games library, and built-in playable games
  lib/                        # Supabase client, API adapter, and History router
  pages/                      # CalculatorPage, GamesPage, GamePlayerPage, AdminPage
  styles/                     # Global Tailwind CSS v4 styles
supabase/
  config.toml
  migrations/
    001_initial_schema.sql    # Tables, RLS policies, and seed categories/games
  functions/                  # Edge Functions for Cloudflare Pages static deployment
server.ts                     # Express + Vite server for local/Node runtime (port 3000)
wrangler.toml                 # Cloudflare Pages output configuration
```

---

## 1. Supabase Setup & Database Initialization

1. Create a new project in [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in the Supabase Dashboard (or run `supabase db push` via the Supabase CLI) and execute `supabase/migrations/001_initial_schema.sql`. This creates:
   - `admin_users`
   - `game_categories` (seeded with the 8 standard categories)
   - `games` (seeded with initial built-in and official external games)
   - `access_codes` (SHA-256 hashed codes; never plaintext)
   - `access_sessions` (expiring session tokens)
   - `access_rate_limits` (IP-hashed brute-force protection)
   - `app_settings`
   - Row Level Security (RLS) policies ensuring anonymous clients cannot read `games`, `game_categories`, `access_codes`, or `access_sessions`.
3. **Create an Administrator Account**:
   - In Supabase Dashboard → **Authentication → Users**, create a user with your admin email and password (disable public signups in **Authentication → Providers → Email**).
   - Copy the new user's UUID and insert them into `public.admin_users`:
     ```sql
     INSERT INTO public.admin_users (user_id, email, role)
     VALUES ('<auth-user-uuid>', 'admin@example.com', 'admin');
     ```
4. **Deploy Edge Functions** (required for static Cloudflare Pages hosting):
   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase secrets set ACCESS_TOKEN_SECRET=<random-32-byte-secret>
   supabase functions deploy verify-access-code
   supabase functions deploy games-catalog
   supabase functions deploy admin-access-codes
   supabase functions deploy admin-games
   supabase functions deploy admin-categories
   ```

---

## 2. Environment Variables

Copy `.env.example` to `.env` for local development:

```env
PORT=3000
NODE_ENV=development

# Public browser variables
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_BACKEND_MODE=api

# Server-only variables (do NOT prefix with VITE_)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ACCESS_TOKEN_SECRET=replace-with-random-32-byte-secret
```

- When running with `server.ts` (Node.js/AI Studio), keep `VITE_BACKEND_MODE=api`. The Express server handles `/api/*` using `SUPABASE_SERVICE_ROLE_KEY` exclusively on the server.
- When deploying statically to **Cloudflare Pages**, set `VITE_BACKEND_MODE=supabase` so the frontend calls your deployed Supabase Edge Functions directly using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never expose `SUPABASE_SERVICE_ROLE_KEY` in Cloudflare Pages client build variables.

---

## 3. Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To typecheck and build for production:

```bash
npm run lint
npm run build
```

---

## 4. GitHub & Cloudflare Deployment

1. Push the repository to GitHub.
2. In **Cloudflare Dashboard → Workers & Pages**:
   - **If deploying as a Worker** (default Git import):
     - **Build command**: `npm run build`
     - **Deploy command**: `npx wrangler deploy`
     - Ensure `name` in `wrangler.toml` matches your Worker's name in Cloudflare. `wrangler.toml` uses `[assets]` (`directory = "./dist"`, `not_found_handling = "single-page-application"`).
   - **If deploying as Pages** (**Create → Looking to deploy Pages? Get started**):
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - `public/_redirects` handles SPA client-side routing (`/games`, `/games/:slug`, `/admin`).
3. Add these **Build / Environment variables** in Cloudflare:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon public key
   - `VITE_BACKEND_MODE` = `supabase`
4. Deploy.
