<div align="center">

<!-- Animated SVG Header -->
<a href="https://pizzahub-client-smoky.vercel.app">
  <img src="https://readme-typing-svg.demolab.com?font=Anton&size=38&duration=3200&pause=1400&color=E50916&center=true&vCenter=true&width=760&height=65&lines=PIZZAHUB+%E2%80%94+WOOD-FIRED+MARKETPLACE;MULTI-VENDOR+ORDERING+%26+STRIPE+SAAS" alt="PizzaHub Animated Header" />
</a>

<p align="center">
  <strong>A role-based multi-vendor pizza ordering platform built with Next.js 15, Better Auth, Express, MongoDB, and Stripe Webhooks.</strong>
</p>

<p align="center">
  <a href="https://pizzahub-client-smoky.vercel.app">
    <img src="https://img.shields.io/badge/LIVE_SITE-pizzahub--client-E50916?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Website" />
  </a>
  <a href="https://pizzahub-server-three-opal.vercel.app">
    <img src="https://img.shields.io/badge/LIVE_API-pizzahub--server-18120E?style=for-the-badge&logo=express&logoColor=white" alt="Live API" />
  </a>
  <a href="https://github.com/devabunayem/pizzahub-client">
    <img src="https://img.shields.io/badge/CLIENT_REPO-GitHub-18120E?style=for-the-badge&logo=github&logoColor=white" alt="Client Repo" />
  </a>
  <a href="https://github.com/devabunayem/pizzahub-server">
    <img src="https://img.shields.io/badge/SERVER_REPO-GitHub-D97706?style=for-the-badge&logo=github&logoColor=white" alt="Server Repo" />
  </a>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,threejs,mongodb,express,nodejs,vercel&perline=9" alt="Core Tech Stack Icons" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Better_Auth-MongoDB_Adapter-18120E?style=flat-square&logo=shieldcheck&logoColor=D97706" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Stripe-Checkout_%26_Webhooks-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Motion-Framer_Motion_12-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Motion" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat-square&logo=greensock&logoColor=black" alt="GSAP" />
  <img src="https://img.shields.io/badge/Three.js-GLSL_Shader-000000?style=flat-square&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/ImgBB-CDN_Uploads-1C75BC?style=flat-square&logo=cloudflareimages&logoColor=white" alt="ImgBB" />
  <img src="https://img.shields.io/badge/Lucide-Icons-E50916?style=flat-square&logo=lucide&logoColor=white" alt="Lucide" />
</p>

</div>

---

## What Is PizzaHub?

PizzaHub connects neighborhood brick-oven pizza kitchens with hungry customers through one shared workflow instead of static mock pages:

- **Customers** browse approved dishes across local kitchens, filter by category/location, sort by price, save favorites, submit star ratings, place orders with a scheduled delivery date, track live order status, and cancel pending requests.
- **Vendors (Restaurants)** launch their own storefront, publish pizzas with ImgBB photo uploads, accept or reject incoming customer orders, and manage a Free-vs-Premium subscription powered by Stripe Checkout.
- **Admins** moderate user accounts (including optional block/unblock enforcement), approve or reject submitted dishes before they reach the public menu, and audit settled Stripe transactions in a read-only ledger.

---

## Project Links & Evaluation Credentials

| Resource | URL |
|---|---|
| **Live Web App** | [https://pizzahub-client-smoky.vercel.app](https://pizzahub-client-smoky.vercel.app) |
| **Live REST API** | [https://pizzahub-server-three-opal.vercel.app](https://pizzahub-server-three-opal.vercel.app) |
| **Client Repository** | [https://github.com/devabunayem/pizzahub-client](https://github.com/devabunayem/pizzahub-client) |
| **Server Repository** | [https://github.com/devabunayem/pizzahub-server](https://github.com/devabunayem/pizzahub-server) |

### Test Accounts (Also 1-Click Autofill on `/signin`)

| Role | Email | Password | What to Test |
|---|---|---|---|
| **Admin** | `admin@pizzahub.com` | `123456` | User search/block, approve/reject menu items, read-only Stripe transactions, charts |
| **Vendor (Premium)** | `mario@pizzahub.com` | `Vendor123` | Unlimited menu items, Premium badge & homepage priority, order accept/reject |
| **Vendor (Free)** | `luigi@pizzahub.com` | `Vendor123` | Enforced 3 active items limit, Stripe Premium upgrade flow |
| **Customer** | `customer@pizzahub.com` | `Customer123` | Place orders, duplicate date check, Order Status Timeline, Favorites, Reviews |

> **Stripe Test Card:** `4242 4242 4242 4242` (any future expiry like `12/30`, any 3-digit CVC).

---

## Core & Standout Features

### 1. Customer Workflow & UX
- **Editorial Wood-Fired Storefront (`/`):** Interactive 4-pizza spinning plate hero (GSAP ScrollTrigger + Lenis), 6+ database-driven Featured Menu cards that bump Premium kitchens to the front, 6 category showcases, *Why Choose PizzaHub?* with a live **Three.js GLSL wood-oven ember shader**, and *How PizzaHub Works*.
- **Browse Menu (`/menu`) & Multi-Image Details (`/menu/[id]`):** Public browsing with instant search, category tabs, location filter, and price asc/desc sorting. Clicking **View Details** redirects logged-out visitors to `/signin`.
- **Order Placement Rules:** Captures delivery date, address, and kitchen instructions. Prevents vendors from ordering their own dishes, admins from ordering, and duplicate active orders on the same pizza + delivery date.

### 2. Vendor Studio (`/dashboard/vendor`)
- **Free vs. Premium Quota:** Free vendors are capped at **3 active (`pending` / `approved`) items** both on the UI and in the Express route. Upgrading to Premium (`$29.99`) unlocks unlimited active dishes, a **Premium** crown badge, and homepage featured sorting.
- **ImgBB Upload Pipeline:** Direct client-side image upload with validation before creating or editing items in `menuItems`.
- **Incoming Order Controls:** Single-action **Accept** or **Reject** transitions on `pending` orders only, strictly scoped to the vendor's own kitchen.

### 3. Master Admin Console (`/dashboard/admin`)
- **Platform KPIs & Real Charts:** Custom donut and bar charts rendered straight from live database totals (no dummy numbers).
- **Menu & User Governance:** Filter accounts by role, search by name/email, toggle block status (optional feature implemented end-to-end), approve/reject/delete dishes, and audit Stripe payments with zero edit controls on financial records.

### 4. Optional Standout Features Included (3/3 Built)
1. **Order Status Timeline (`StatusTimeline`):** Visual step-by-step lifecycle tracker (`Pending` -> `Accepted` / `Rejected` / `Cancelled`) on Customer Orders.
2. **Favorites / Wishlist (`useFavorites` + `/dashboard/customer/favorites`):** Save/remove any dish from Home cards, Browse Menu, or Item Details with cross-component sync and a dedicated **Favorites** dashboard tab.
3. **Customer Reviews & Ratings (`POST /api/menu/:id/reviews`):** Embedded reviews inside `menuItems` with a 1–5 interactive star picker, tasting note form, live average rating calculation, and card badges — zero extra MongoDB collections added.

---

## Challenges Faced & How I Solved Them

### 1. Advanced Search, Multi-Filter & Price Sorting (`GET /api/menu`)
I wanted searching, filtering, and sorting to work cleanly together without resetting each other or scanning unapproved items.
- **API Query Parameters:** `GET /api/menu?search=<term>&category=<name>&location=<area>&sort=<key>&page=<n>&limit=<n>`
  - Baseline filter: always locks `{ status: 'approved' }` so `pending`, `rejected`, and `inactive` items never leak publicly.
  - `search`: case-insensitive regex matching across both `itemName` and `description`.
  - `category`: exact enum match across the 6 pizza categories (skipped when `All`).
  - `location`: partial regex match so typing `Brooklyn` matches `Brooklyn, NY`.
  - `sort`: maps directly to Mongoose `.sort()` — `price_asc` (`{ price: 1 }`), `price_desc` (`{ price: -1 }`), `oldest` (`{ createdAt: 1 }`), or default `newest` (`{ createdAt: -1 }`).
- **Frontend State (`src/app/menu/page.tsx`):** Syncs category pills from URL params (`/menu?category=...`), re-queries immediately when category/sort changes, and resets cleanly in one click.

### 2. Hybrid Better Auth + Express JWT Middleware Flow
Next.js handles sessions cleanly with **Better Auth** (including Google OAuth via `mongodb` adapter), while our Express API runs on a separate Vercel deployment that needs stateless, tamper-proof role checks on every mutation.
- **How they connect (`src/context/AuthContext.tsx`):**
  1. On email/password login or signup, the client authenticates with Express (`/api/auth/login` or `/api/auth/register`) and stores the signed JWT (`pizzahub_token`).
  2. On Google OAuth via Better Auth (`/api/auth/get-session`), `AuthContext` exchanges the verified session profile with `POST /api/auth/google` (on the server, forced to `customer` or `vendor` — **never** `admin`) and stores the Express JWT.
  3. Reloading any protected dashboard route reads the stored JWT immediately and validates it against `/api/auth/me` before rendering, preventing flash-redirects back to `/signin`.
- **Server Middleware Chain (`pizzahub-server/src/middlewares/auth.js`):**
  - `verifyToken`: extracts `Bearer <token>` (or cookie) -> verifies with `JWT_SECRET` (returns `401` if missing, invalid, or expired) -> fetches fresh user from MongoDB -> returns `403` if `user.isBlocked === true`.
  - `verifyRole(...roles)`: confirms `req.user.role` matches the endpoint requirement (`403 Forbidden` otherwise).

### 3. Preventing Fake Stripe Activations & Free-Limit Bypass
- `/payment/success` never activates Premium on its own. Even with Stripe Checkout's redirect `session_id`, activation requires Stripe signature verification (`stripe.webhooks.constructEvent`) on the server webhook (`/api/subscription/webhook` mounted before `express.json()`), or a direct server-to-server `stripe.checkout.sessions.retrieve()` check where `payment_status === 'paid'` AND `session.metadata.vendorId === req.user._id`.
- On vendor edits (`PATCH /api/menu/:id`), flipping an `inactive` item back to `approved` re-checks the 3-active-item quota for Free accounts, closing the workaround where a vendor could draft inactive items and turn them all active later.

---

## Technology Stack & Packages

| Layer | Technologies & Key Packages |
|---|---|
| **Framework & UI** | `next` (15.5 App Router), `react` (19), `typescript`, `tailwindcss`, `lucide-react`, `clsx`, `tailwind-merge` |
| **Auth & Database** | `better-auth` (with MongoDB adapter & Google OAuth), `mongodb` |
| **Animation & 3D** | `motion` (Framer Motion 12), `gsap`, `lenis`, `three`, `canvas-confetti` |
| **UX & Feedback** | `sileo` (spring dynamic-island toasts), bespoke shimmer skeletons, `ConfirmModal` dialogs |
| **Media & Deployment** | ImgBB REST API, Vercel |

---

## Environment Variables

Create `.env.local` in `pizzahub-client/` (never commit real secrets):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Better Auth & MongoDB Adapter
BETTER_AUTH_SECRET=your_32_plus_char_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
DB_NAME=pizzahub

# Google OAuth (Better Auth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Run Locally

```bash
# 1. Clone the client repository
git clone https://github.com/devabunayem/pizzahub-client.git
cd pizzahub-client

# 2. Install packages
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Fill in your API URL, Better Auth secret, MongoDB URI, Stripe publishable key, ImgBB key, and Google OAuth credentials

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (make sure `pizzahub-server` is running on port `5000`).
