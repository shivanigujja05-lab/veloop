# VELoop Rewards — Super Admin Guide

This guide provides instructions for platform administrators managing the VELoop Rewards system.

---

## 1. Accessing the Admin Portal

1. Navigate to: `http://localhost:5173/admin/login`
2. Enter the Super Admin credentials:
   - **Email**: `demo-admin@example.com`
   - **Password**: `DemoAdmin@2026`
3. Click **Sign In to Admin Panel** (or use the one-click **"Auto Fill"** helper).

---

## 2. Navigating the Admin Console

The sidebar provides access to all administrative modules:

### 2.1 Dashboard (`/admin/dashboard`)
- **Real-Time KPIs**: Total users, active vs suspended count, total VEs in circulation, total cash paid out in INR, and pending withdrawal count.
- **Secondary Asset Gauges**: SVEs, Gems, Tokens, and platform-wide XP.
- **Security Alerts**: Real-time alerts regarding pending payouts or suspended accounts.
- **Platform Feed & Audit Stream**: Recent user actions and admin compliance logs.

### 2.2 User Management (`/admin/users`)
- **Search & Filter**: Find users by name, email, user ID (`VLRUSR...`), or referral code. Filter by `ACTIVE` or `SUSPENDED`.
- **User Inspector Modal**:
  - Click **Inspect** on any user row.
  - Review personal information, exact wallet balances across all 5 assets, and transaction history.
  - **Suspend / Restore Account**: Select status, enter a mandatory reason (e.g. "Suspicious automated activity"), and click **Update Status**. The user is immediately barred from calling APIs.
  - **Auditable Balance Adjustment**: Select an asset (`ves`, `sves`, `gems`, `tokens`, `xp`), select `CREDIT` or `DEBIT`, input an amount, enter the mandatory audit reason, and execute. The change is persisted and recorded with full before/after figures.

### 2.3 Withdrawal Management (`/admin/withdrawals`)
- **Filter**: Toggle between `Pending`, `Approved`, or `Rejected` payouts.
- **Approve Request**: Click the **Checkmark** button. The frozen VEs are permanently deducted, the payout is marked `APPROVED`, and the user's total withdrawn amount updates in real time.
- **Reject Request**: Click the **X** button, enter a clear rejection reason (e.g. "Invalid UPI ID provided"), and submit. The reserved VEs are automatically returned to the user's available wallet balance.

### 2.4 Level Configurations (`/admin/levels`)
- Manage level names, XP thresholds, and status badges (Levels 1 to 10).
- Edit any level row inline and click the checkmark to save.

### 2.5 Achievements (`/admin/achievements`)
- Manage achievement names, descriptions, unlock condition targets, and XP/VEs bonuses.

### 2.6 Referral Network (`/admin/referrals`)
- Inspect all peer invitations, referrer vs referred members, and bonus allocation records.

### 2.7 Audit Logs (`/admin/audit-logs`)
- Chronological, tamper-evident log of every administrative action, showing timestamp, admin email, IP address, and change details.

