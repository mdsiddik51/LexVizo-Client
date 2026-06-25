# LexVizo - LegalEase Digital Legal Representation Platform

LexVizo is a premium, high-performance web platform designed to seamlessly connect individuals and businesses with top-tier legal professionals. It streamlines client intake, lawyer discovery, retainer payment processing, and case management under a secure role-based access system.

---

## 🚀 Purpose
Traditional legal hiring is often limited to law firms or physical consultations. LexVizo democratizes access to legal aid, enables emerging lawyers to reach clients globally, and provides a secure, streamlined hiring experience using the modern MERN stack.

---

## ✨ Key Features
- **Public Legal Discovery Catalog**: Discover, search, filter by specialization/availability, and sort expert lawyers by hourly rates. Includes responsive mobile (2-column), tablet (3-column), and desktop (4-column) grids.
- **Hiring Retainer Pipelines**: Clients can hire lawyers directly, with requests pending review.
- **Secure Stripe Checkout Integration**: Pay retainer fees online. The checkout interface locks and disables payment indicators once settled successfully.
- **Client Evaluation and Feedback**: Share reviews and assessments. Reviews are restricted solely to users with verified active hiring logs.
- **Nested Dashboard Control Panels**:
  - **User (Client)**: Track hiring histories, update display avatars via imgBB API, modify profile names, and manage review comments.
  - **Lawyer**: Action incoming client hiring requests (Accept/Reject), update practice categories, bio, hourly fee, and supplemental service packages.
  - **Admin**: Oversee the user list registry (change roles or delete accounts), audit global Stripe payment histories, and view analytical totals.
- **Enterprise Security Verification**: Employs BetterAuth for OAuth/Google/credential registrations and session tokens for role-specific API calls.

---

## 📦 NPM Packages Used

### Client Dependencies:
- `@better-auth/mongo-adapter` — Database connection adapter for authentication schema.
- `better-auth` — Session and multi-role authentication handler.
- `@heroui/react` & `@heroui/styles` — Cyber-minimalist dashboard UI components.
- `@stripe/stripe-js` — Client side Stripe checkout integration.
- `stripe` — Payment gateways and session validation.
- `motion` — Framer motion animations.
- `lucide` & `lucide-react` & `react-icons` — Cyber-minimalist icon vectors.
- `mongodb` — Core Atlas connection drivers.
- `next` — High-performance React app framework.
- `react-hot-toast` — Real-time user event feedback.
- `sweetalert2` — Premium confirm dialog alerts.

### Server Dependencies:
- `express` — Lightweight API server framework.
- `cors` — Cross-Origin Resource Sharing.
- `dotenv` — Environmental configuration storage.
- `mongodb` — Database interface queries.
- `stripe` — Stripe backend payment confirmation.

---

## 🛠️ Environmental Keys (Sample Template)
Ensure that you establish appropriate variable parameters in your configuration files:
- `MONGO_DB_URI` (MongoDB Atlas connectivity)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Stripe transaction key)
- `STRIPE_SECRET_KEY` (Secure payment signing key)
- `NEXT_PUBLIC_IMG_UP_DATA` (imgBB API key vector)
- `BETTER_AUTH_SECRET` (Session encrypting key)
- `CLIENT_URI` & `NEXT_URI` (Hosting base URLs)


---

Live Link --> https://lexvizo.vercel.app