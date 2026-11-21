# 🍕 PizzaHub — Client (Frontend)

> **PizzaHub** is an international-grade, wood-fired pizza ordering & multi-vendor delivery platform connecting local brick-oven pizzerias with pizza lovers.

---

## 🔗 Project Links
- **Live Website:** [https://pizzahub-client-smoky.vercel.app](https://pizzahub-client-smoky.vercel.app)
- **Live API Endpoint:** [https://pizzahub-server-three-opal.vercel.app](https://pizzahub-server-three-opal.vercel.app)
- **Client GitHub Repository:** [https://github.com/devabunayem/pizzahub-client](https://github.com/devabunayem/pizzahub-client)
- **Server GitHub Repository:** [https://github.com/devabunayem/pizzahub-server](https://github.com/devabunayem/pizzahub-server)

---

## 👤 Credentials for Evaluation

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@pizzahub.com` | `123456` | Full platform governance, user & menu moderation, Stripe ledger |
| **Vendor (Premium)** | `mario@pizzahub.com` | `Vendor123` | Unlimited items, featured homepage placement & Premium badge |
| **Vendor (Free)** | `luigi@pizzahub.com` | `Vendor123` | Free tier (maximum 3 active menu items) |
| **Customer** | `customer@pizzahub.com` | `Customer123` | Order pizzas, schedule delivery & track live status |

> **Stripe Test Card for Verification:** `4242 4242 4242 4242` (Any future expiration date, any 3-digit CVC, postal code `10001`).

---

## ✨ Important Features

### 1. 🍕 Customer Experience
- **Interactive Wood-Fired Hero & Editorial Home:** 4-pizza interactive wooden plate selector with GSAP scroll-scrubbed rotation, hand-brushed SVG highlights (`BrushHighlight`), masked `TextReveal`, 6 Featured Menu Items prioritizing Premium kitchens, 6 bespoke travertine category showcases, and a procedural **Three.js GLSL Wood-Oven Fire Shader** with rising sparks (`OvenEmberCanvas`).
- **Advanced Browse Menu (`/menu`):** Search by name or ingredient, filter across 6 culinary categories or location, and sort by newest or price ascending/descending.
- **Order Scheduling & Status Timeline:** Place orders specifying delivery date, physical address, and kitchen notes; cancel `pending` orders anytime; track live status with `StatusTimeline`.

### 2. 🏪 Restaurant Vendor Studio (`/dashboard/vendor`)
- **Kitchen Command Overview:** Live Bento `PremiumStatCard` KPIs with micro-sparklines, `StatusDonutChart` for incoming order mix, and `MetricBarChart` for menu listing health.
- **Menu Management & ImgBB Upload:** Add, edit, activate/deactivate, or delete listings with direct **ImgBB** photo upload.
- **Subscription Tier Rules & Stripe Checkout:** Free tier allows up to 3 active items; upgrade to Premium (`$29.99/mo`) via Stripe Checkout with verified webhook activation.

### 3. 🛡️ Master Administrator Console (`/dashboard/admin`)
- **Platform Analytics & Charts:** 6 clickable Bento KPI cards, `StatusDonutChart` for platform account mix, and `MetricBarChart` for platform scale overview.
- **User & Menu Moderation:** Search/filter accounts, optional block/unblock control, approve/reject/delete vendor dishes, and inspect the read-only Stripe transaction audit ledger.

### 4. 🎨 Editorial Design System & Engineering Polish
- **3-Font Editorial Pairing:** `Anton` (`.font-display`), `Instrument Serif` italic (`.font-editorial`), and `Plus Jakarta Sans` inside a unified `1280px` `.site-container`.
- **In-Dashboard Profile Editor (`/dashboard/profile`):** Edit full name, restaurant brand name, and upload profile photos directly inside the dashboard without leaving the workspace.
- **Bespoke Shimmer Skeleton Loading:** Warm ivory & espresso shimmer skeletons across all 22 App Router routes with dedicated `loading.tsx` boundaries.
- **Top-Center Dynamic Island Toasts (`sileo`):** Physics-based spring notifications positioned at `top-center` alongside accessible `ConfirmModal` dialogs (zero native `alert()`/`confirm()`).

---

## 🛠️ Technology Stack & Packages

- **Framework:** Next.js 15.5 (App Router) & React 19
- **Language:** TypeScript
- **Authentication:** Better Auth (`better-auth`) with MongoDB adapter, JWT plugin & Google OAuth (`socialProviders.google`)
- **Styling:** Tailwind CSS
- **3D & Motion:** Three.js (`three`), GSAP + ScrollTrigger (`gsap`), Lenis Smooth Scroll (`lenis`), Motion (`motion/react`)
- **Icons:** Lucide React (`lucide-react`)
- **Notifications:** Sileo (`sileo`) & Canvas Confetti (`canvas-confetti`)
- **Image Hosting:** ImgBB API

---

## ⚙️ Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Better Auth & Google OAuth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database
MONGODB_URI=your_mongodb_connection_uri
DB_NAME=pizzahub
```

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devabunayem/pizzahub-client.git
   cd pizzahub-client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env.local` file in the root directory using the variable names listed above.
4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
