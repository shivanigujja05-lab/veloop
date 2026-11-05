# VELoop Rewards — Demo Access & Evaluation Guide

This document contains evaluation credentials and environment instructions for testing the VELoop Rewards User Profile & Admin Management System.

---

## 1. Quick Access Credentials

### A. Super Administrator (Admin Management Portal)
- **Admin Portal URL**: `http://localhost:5173/admin/login`
- **Email**: `demo-admin@example.com`
- **Password**: `DemoAdmin@2026`
- **Role**: `SUPER_ADMIN`
- **Capabilities**:
  - Live aggregate platform dashboard metrics
  - Full user search, status enforcement (Suspend/Restore with reason)
  - Auditable balance adjustments (Credit/Debit with mandatory audit reasons)
  - Review, approve, and reject withdrawal redemption requests
  - Configure level thresholds & achievements
  - Inspect protected security audit trail

> **Convenience Feature**: The Admin Login page includes a one-click **"Auto Fill"** and one-click copy buttons for immediate testing.

---

### B. Demo Member (User Rewards Profile)
- **User Profile URL**: `http://localhost:5173/user-profile`
- **Login URL**: `http://localhost:5173/login`
- **Email**: `demo@example.com`
- **Password**: `DemoUser@2026`
- **User ID**: `VLRUSR202600123`
- **Referral Code**: `VELOOP123`
- **Baseline Rewards Data**:
  - **VEs**: 3,850 VEs
  - **SVEs**: 1,240 SVEs
  - **Gems**: 240 Gems
  - **Tokens**: 5,000 Tokens
  - **XP**: 6,420 XP (Level 04 — Reward Explorer; 1,580 XP remaining to Level 05)
  - **Withdrawals**: 21 Approved (₹2,450 total withdrawn), 2 Pending, 1 Rejected

> **Convenience Feature**: The User Login page also includes a one-click **"Auto Fill"** button.

---

## 2. Resetting / Reseeding Demo Data

To reset the database back to pristine initial demo baseline values at any time:

```bash
# Navigate to the backend directory
cd backend

# Execute the seed script
npm run seed
```

Output:
```
--- Starting Database Seeding ---
Cleared existing data.
Seeded 10 Level Configurations.
Seeded 6 Achievements.
Seeded Admin User: demo-admin@example.com
Seeded 24 Withdrawal records for Demo User (21 Approved, 2 Pending, 1 Rejected).
--- Database Seeding Completed Successfully ---
```

---

## 3. Local Evaluation Quickstart

### Step 1: Install Dependencies
```bash
npm install --prefix backend
npm install --prefix frontend
```

### Step 2: Start Backend API (Port 5000)
```bash
cd backend
npm run dev
```

### Step 3: Start Frontend Client (Port 5173)
```bash
cd frontend
npm run dev
```

Open your browser to:
- **User Profile**: `http://localhost:5173/user-profile`
- **Admin Portal**: `http://localhost:5173/admin/login`

