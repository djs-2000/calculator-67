# Calculator

A minimal, responsive web calculator with 60 structured high school math review pages across six core courses, a searchable formula reference sheet, a protected study guides portal behind server-side access-code authorization, and a Supabase-authenticated administrator dashboard.

## Features

- **Calculator Homepage (`/`)**: Standard arithmetic, percentages, decimals, negative numbers, parentheses, order of operations, clear (`AC`), backspace, keyboard input, and division-by-zero error handling. Independent of backend availability.
- **High School Math Review (`/courses`, `/courses/:course/:page`, `/formulas`)**: 10 review pages for each of the 6 common high school math courses (**Algebra 1**, **Geometry**, **Algebra 2**, **Trigonometry & Precalculus**, **AP Calculus AB/BC**, **AP Statistics**) with key formulas, study rules, worked step-by-step examples, interactive self-checks, and a searchable 60-page formula sheet.
- **Protected Guides Section (`/guides`, `/guides/:slug`)**: Revealed via `1234 =` on the calculator and gated behind server-verified access codes or authenticated administrator accounts. Includes search, category filtering, interactive demonstrations, embeds, and official external references.
- **Administrator System (`/admin`)**: Supabase Auth email/password login with server-side `admin_users` role verification, cryptographic backend access code generation, code rotation (revoking prior active codes and sessions), expiration controls, and guide/category management.

---

## Project Structure

```text
public/
  favicon.svg
src/
  admin/                      # Admin login, access-code, guide, and category managers
  assets/images/              # Guide thumbnails
  calculator/                 # Independent expression evaluator and Calculator widget
  components/                 # Navbar and GuideCard
  guides/                     # Access gate, guides library, and interactive walkthroughs
  lib/                        # Supabase client, API adapter, and History router
  math/                       # 6 high school math courses (10 pages each = 60 pages)
  pages/                      # CalculatorPage, CoursesPage, CourseReviewPage, FormulasPage, GuidesPage, GuideDetailPage, AdminPage
  styles/                     # Global Tailwind CSS v4 styles
supabase/
  config.toml
  migrations/
    001_initial_schema.sql    # Tables, RLS policies, and initial seed rows
    002_guides_catalog_update.sql
  functions/                  # Edge Functions for static hosting
server.ts                     # Express + Vite server for local/Node runtime (port 3000)
vercel.json                   # Vercel SPA rewrites
```

---

## Deploying Edge Functions

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy verify-access-code
supabase functions deploy guides-catalog
supabase functions deploy admin-access-codes
supabase functions deploy admin-guides
supabase functions deploy admin-categories
```
