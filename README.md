# VELoop Rewards — Task 14: Complete Full-Stack User Profile & Admin Management System

A production-grade, full-stack **MERN** rewards command center and management system built for **VELoop Rewards**. The application features an interactive gamified user profile interface, real-time double-entry wallet ledger accounting, automated level and achievement progression, and a protected Super Admin management console.

---

## 🌟 Key Highlights & Features

- **Personal Rewards Command Center (`/user-profile`)**:
  - **Profile Hero Section**: Dynamic level progression, avatar with fallback initials, verified status, member ID copy action, and profile settings modal.
  - **Multi-Asset Ledger**: Real-time balances for all 5 assets:
    1. **VEs** (Virtual Earnings - cash-redeemable via UPI / Bank Transfer)
    2. **SVEs** (Silver Virtual Earnings - distinct silver visual treatment, 1:1 conversion to VEs)
    3. **Gems** (In-app multiplier currency and vault)
    4. **Tokens** (Platform sweepstakes & task tokens)
    5. **XP** (Experience points driving level progression)
  - **Gamified Level System**: Level 1 to 10 progression tiers, animated progress bar, XP remaining calculation, and next-tier perk preview.
  - **Achievements & Badges**: Milestone honors with progress tracking, category filtering, and bonus awards.
  - **Withdrawal & Payout Overview**: Real-time counts of pending, approved, and rejected redemptions, with accurate total withdrawn amount computed strictly from approved payouts.
  - **Quick Actions**: Interactive cards to Watch Sponsored Videos (+50 VEs, +100 XP), Claim Daily Streaks (+20 Gems, +150 XP), Convert SVEs, and Redeem Payouts.
  - **Referral Network Snapshot**: Unique referral code with one-click copy, successful vs pending invite statistics, and milestone progress bar.
  - **Activity Feed**: Compact chronological timeline of persisted transactions and reward credits.
  - **Branded States**: Shimmer skeleton loading screens, helpful empty states, and user-friendly error boundaries.

- **Protected Super Admin Console (`/admin`)**:
  - **Executive Dashboard**: Real-time aggregate KPIs, system alerts, asset distribution charts, and live platform event feed.
  - **User Management**: Search, filter by active/suspended status, and open comprehensive user detail dossiers.
  - **Auditable Balance Adjustments**: Credit and debit balances across any asset with mandatory audit reasons and before/after tracking.
  - **Account Restriction Controls**: Suspend and restore accounts with administrative reasons logged to the audit trail.
  - **Withdrawal Management**: Review pending redemptions, approve disbursements, or reject requests with automatic balance refunds.
  - **Level & Achievement Editors**: Dynamically configure XP thresholds, badge artwork, and milestone requirements.
  - **Tamper-Evident Audit Logs**: Complete chronological history of all administrative actions with actor emails, timestamps, and IP addresses.

- **Security & Data Integrity (Anti-Manipulation)**:
  - **Backend as Source of Truth**: Balances, XP, levels, and withdrawal statistics cannot be altered through client-side state manipulation or React DevTools.
  - **Strict Session Authentication**: All user endpoints derive identity solely from cryptographically verified JWT bearer tokens.
  - **Rate Limiting & Hardening**: `express-rate-limit` guards auth routes and sensitive operations; `helmet` secures HTTP headers; `express-validator` sanitizes all inputs.

---

## 🛠️ Mandatory Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Helmet, Morgan, Express-Validator, Express-Rate-Limit.
- **Frontend**: React 18, Vite, Bootstrap 5, CSS Modules (`.module.css`), Lucide React & React Icons, React Router DOM v6, Axios.
- **Palette**: Dark theme (`#161827`) with Navy, Gold (`#F59E0B`), Silver (`#CBD5E1`), Soft Blue (`#38BDF8`), and Emerald Green (`#10B981`).

---

## 📂 Project Structure

```
veloop/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection & in-memory fallback
│   │   ├── controllers/        # Auth, Profile, Actions, and Admin controllers
│   │   ├── middleware/         # JWT auth, Admin guard, Rate limiters, Error handler
│   │   ├── models/             # 10 Mongoose schemas (User, Wallet, Transaction, etc.)
│   │   ├── routes/             # Express API routes
│   │   ├── seed/               # Controlled demo database seeding script
│   │   ├── services/           # Reward ledger, Level engine, and Audit services
│   │   ├── utils/              # ID generators and response formatters
│   │   ├── validators/         # Input validation rules
│   │   ├── app.js              # Express app setup and middleware
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/             # Branding and SVG assets
│   │   ├── components/         # Modular React components with CSS modules
│   │   │   ├── Navbar/
│   │   │   ├── ProfileHero/
│   │   │   ├── RewardAssets/
│   │   │   ├── LevelProgress/
│   │   │   ├── AchievementCard/
│   │   │   ├── WithdrawalOverview/
│   │   │   ├── QuickActions/
│   │   │   ├── ReferralSnapshot/
│   │   │   ├── RecentActivity/
│   │   │   ├── AccountInformation/
│   │   │   ├── ProfileSkeleton/
│   │   │   ├── ProfileEmptyState/
│   │   │   ├── ProfileErrorState/
│   │   │   └── Modals/
│   │   ├── context/            # AuthContext and AdminAuthContext
│   │   ├── hooks/              # useProfile and useClipboard hooks
│   │   ├── pages/
│   │   │   ├── UserProfile/    # User Rewards Command Center
│   │   │   ├── Login/          # Member Sign In
│   │   │   ├── Register/       # New Member Join
│   │   │   └── Admin/          # Super Admin Dashboard & Management Pages
│   │   ├── services/           # Centralized API service layer
│   │   ├── utils/              # Currency and date formatters
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # React root
│   │   └── index.css           # Global dark theme styles
│   ├── .env.example
│   └── package.json
├── postman/
│   └── veloop_rewards.postman_collection.json
├── docs/
├── API_DOCUMENTATION.md        # Complete REST API specifications
├── DATABASE.md                 # Schemas, relationships, and indexing
├── SECURITY.md                 # Security architecture & anti-tamper safeguards
├── ADMIN_GUIDE.md              # Administrator operational manual
├── TESTING.md                  # Test suites and expected outcomes
├── DEMO_ACCESS.md              # Instant demo login credentials
├── README.md
└── package.json
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### 2. Installation
Install all dependencies in root or for both sub-projects:
```bash
# In the project root directory
npm run install:all
```

Or individually:
```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Environment Configuration
Create `.env` files in both `backend/` and `frontend/` using the provided `.env.example` templates:

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/veloop_rewards?retryWrites=true&w=majority
JWT_SECRET=veloop_super_secret_jwt_key_2026_demo_eval
ADMIN_SEED_EMAIL=demo-admin@example.com
ADMIN_SEED_PASSWORD=DemoAdmin@2026
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```
*(Note: If no `MONGO_URI` is provided, the backend automatically initializes an in-memory database fallback so you can evaluate the platform out of the box!)*

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=/api
```
The Vite development server proxies `/api` requests to the backend on port `5000`, so this also works when opening the frontend from another device on your network. For a deployed frontend, set `VITE_API_URL` to the deployed backend API URL.

### 4. Seed Demo Data
To seed initial demo accounts, level configurations, and withdrawal records:
```bash
npm run seed --prefix backend
```

### 5. Running the Application
From the project root on Windows, launch both servers in separate terminal windows:

```bash
npm run dev
```
Keep both the backend and frontend terminal windows running while using the app.

Or start them manually in two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 🔑 Demo Access Credentials

| Role | Portal URL | Email | Password |
|---|---|---|---|
| **Super Admin** | `http://localhost:5173/admin/login` | `demo-admin@example.com` | `DemoAdmin@2026` |
| **Demo User** | `http://localhost:5173/login` | `demo@example.com` | `DemoUser@2026` |

*Both login screens include one-click **"Auto Fill"** helper buttons for instant evaluation.*

---

## 🚀 Deployment Instructions

### Deploying the Backend (Render / Railway)
1. Push the repository to GitHub.
2. In **Render** or **Railway**, create a new Web Service pointing to the `backend` root.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV=production`.

### Deploying the Frontend (Vercel / Netlify)
1. In **Vercel**, import the repository and select the `frontend` directory as the root.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Configure Environment Variable: `VITE_API_URL` (pointing to your deployed backend URL).

---

## 📄 Documentation Links
- [Demo Access & Credentials](DEMO_ACCESS.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Database Architecture](DATABASE.md)
- [Security & Anti-Tampering](SECURITY.md)
- [Administrator Operational Guide](ADMIN_GUIDE.md)
- [Testing & Validation Guide](TESTING.md)
- [Postman API Collection](postman/veloop_rewards.postman_collection.json)
