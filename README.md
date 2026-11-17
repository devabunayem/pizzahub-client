# 🍕 PizzaHub — Client (Frontend)

> **PizzaHub** is a modern, high-performance pizza ordering & delivery platform connecting local wood-fired artisanal pizzerias with pizza lovers worldwide.

---

## 🔗 Project Links
- **Live Website:** [https://pizzahub-client.vercel.app](https://pizzahub-client.vercel.app) *(Deploy URL)*
- **Client GitHub Repository:** [https://github.com/devabunayem/pizzahub-client](https://github.com/devabunayem/pizzahub-client)
- **Server GitHub Repository:** [https://github.com/devabunayem/pizzahub-server](https://github.com/devabunayem/pizzahub-server)

---

## 👤 Credentials for Evaluation

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@pizzahub.com` | `123456` | Full platform control & audit |
| **Vendor (Premium)** | `mario@pizzahub.com` | `Vendor123` | Unlimited items, Stripe subscription |
| **Vendor (Free)** | `luigi@pizzahub.com` | `Vendor123` | Max 3 items tier |
| **Customer** | `customer@pizzahub.com` | `Customer123` | Order pizzas & track status |

> **Stripe Test Card for Verification:** `4242 4242 4242 4242` (Any future expiration date, any 3-digit CVC, postal code `10001`).

---

## ✨ Important Features

### 1. 🍕 Customer Experience
- **Public & Interactive Menu:** Browse approved & active pizzas with high-resolution imagery and detailed descriptions.
- **Advanced Search & Filtering:** Filter by 6 culinary categories and city/area location.
- **Dynamic Price Sorting:** Sort pizzas in ascending or descending price order.
- **Order Scheduling:** Place orders specifying exact delivery date, physical delivery address, and custom kitchen notes.
- **Order Cancellation:** Cancel orders anytime while they remain in `pending` status.
- **Order Status Timeline (Optional Feature 1):** Interactive visual stepper timeline (`Order Placed ➔ Accepted & Preparing ➔ Delivery Scheduled`).

### 2. 🏪 Restaurant Vendor Dashboard
- **Real-time Overview:** Live metrics for total items, approved pizzas, pending orders, and accepted orders.
- **Add Menu Item:** Full form with validation and direct file upload to **ImgBB API**.
- **Subscription Tier Rules:** Free vendors can publish a maximum of 3 active pizzas.
- **Stripe Checkout Integration:** Upgrade to Premium ($29.99/mo) for unlimited items and a verified golden badge.
- **Order Moderation:** Accept or Reject incoming customer orders with a single click.

### 3. 🛡️ Master Administrator Dashboard
- **Platform Analytics:** Total users, vendors, customers, menu items, pending reviews, and gross revenue.
- **User Moderation:** Search users by name or email, filter by role, and instant **Block / Unblock** control.
- **Menu Moderation:** Review pending pizzas, approve or reject items, or delete non-compliant listings.
- **Transactions Ledger:** Read-only audit trail of Stripe checkout payments with tamper-proof records.

### 4. 🎨 Design & Polish (Optional Feature 2)
- **Dark / Light Mode Toggle:** Smooth theme switching with persistent user preference using `next-themes`.
- **Framer Motion Animations:** Smooth hero entrance, floating score badges, and hover feedback.
- **No Reload Issues:** Bulletproof authentication state persistence preventing accidental logouts on page refresh.

---

## 🛠️ Technology Stack & Packages

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Authentication:** Better Auth (`better-auth`) with MongoDB adapter (`mongodb`) & JWT plugin
- **Styling:** Tailwind CSS with custom warm pizza palette
- **Icons:** Lucide React
- **Animations:** Motion (`motion/react`)
- **Theme:** `next-themes` (Dark / Light mode)
- **Physics Toast Notifications:** `sileo` (Physics-based spring toasts)
- **Confirmation Modals:** Custom accessible `ConfirmModal` (Zero browser native alerts/confirms)
- **Loading State Experience:** Bespoke shimmer wave skeleton loading (`MenuGridSkeleton`, `ItemDetailSkeleton`, `DashboardOverviewSkeleton`, `OrderListSkeleton`, `TableSkeleton`)
- **Celebration Effects:** `canvas-confetti`
- **Image Hosting:** ImgBB API

---

## ⚙️ Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_IMGBB_API_KEY=ed9cd2830c7038c0b9ba40977ad448f4

# Better Auth Configuration (MongoDB Adapter)
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
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

3. **Configure Environment Variables:**
   - Copy `.env.local.example` to `.env.local` and add your keys.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏆 Challenge Requirements Implementation

1. **Advanced Search & Price Sorting:**
   - The `/menu` page dispatches query parameters `?search=<text>&category=<category>&location=<area>&sort=price_asc|price_desc`.
   - The Express backend parses the query, applies regex matching across `itemName` and `description`, filters approved items, and applies MongoDB indexing for sorting.

2. **JWT & Server-Side Role Verification:**
   - Tokens are securely stored in `localStorage` and `cookie`.
   - The backend `verifyToken` middleware decodes the JWT and validates user active status against MongoDB.
   - The `verifyRole('admin')` and `verifyRole('vendor')` middlewares enforce strict RBAC before any resource modification.

3. **Better Auth with MongoDB Adapter:**
   - Next.js App Router route handler at `/api/auth/[...all]` powered by `better-auth` with official `mongodbAdapter`.
   - Integrates custom user schema fields (`role`, `isBlocked`, `businessName`, `subscriptionPlan`, `subscriptionExpiresAt`).
   - Integrated with the `jwt` plugin ensuring seamless interoperability between Next.js client sessions and Express REST API authorization.
