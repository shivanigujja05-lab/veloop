# VELoop Rewards — Testing & Validation Guide

This document outlines the test cases and expected outcomes to verify compliance with all functional, security, and UI/UX acceptance criteria.

---

## 1. User Journey Test Cases

| Test Case | Steps to Execute | Expected Outcome | Status |
|---|---|---|---|
| **TC-01: Profile Load** | Log in with `demo@example.com` and open `/user-profile`. | Hero displays `Demo User`, `VLRUSR202600123`, `Level 04 — Reward Explorer`, 3,850 VEs, 1,240 SVEs, 240 Gems, 5,000 Tokens, 6,420 XP. | PASSED |
| **TC-02: Page Refresh** | Press browser Refresh (F5) on `/user-profile`. | Data reloads cleanly from backend; no state is lost or reset. | PASSED |
| **TC-03: Quick Action (Watch Ad)** | Click **Watch Ads** card in Quick Actions. | Video playback simulation runs, calls `POST /api/actions/watch-ad`, awards +50 VEs & +100 XP, updates profile immediately. | PASSED |
| **TC-04: Daily Bonus** | Click **Daily Streak** card in Quick Actions. | Calls `POST /api/actions/daily-bonus`, awards +20 Gems & +150 XP. | PASSED |
| **TC-05: SVE Conversion** | Click **Convert to VEs** on SVEs Card. Enter 100 SVEs. | Debits 100 SVEs, credits 100 standard VEs at 1:1 ratio. Toast confirms conversion. | PASSED |
| **TC-06: Submit Withdrawal** | Click **Redeem Payout** on VEs Card. Enter 200 VEs (₹20), select UPI, enter VPA, submit. | 200 VEs are moved to reserved balance, request is recorded with status `PENDING`. | PASSED |
| **TC-07: Copy Actions** | Click copy icon on User ID or Referral Code. | Clipboard receives text and a toast notification confirms the copy action. | PASSED |

---

## 2. Security & Anti-Manipulation Test Cases

| Test Case | Attack / Manipulation Attempt | Expected Backend Defense | Status |
|---|---|---|---|
| **SEC-01: Client Balance Tampering** | Open React DevTools or browser console and edit `rewards.ves = 999999`. Then trigger an action. | The backend rejects or ignores client-side memory modifications. Real balance remains 3,850 VEs. | PASSED |
| **SEC-02: Direct API Balance Modification** | Send `PATCH /api/profile/me` with `{ "ves": 999999, "xp": 50000 }`. | Backend validator ignores unauthorized keys. Only `name` and `profileImage` are updated. | PASSED |
| **SEC-03: User Identity Spoofing** | Call `GET /api/profile/me` with header or body `{ "userId": "another-user" }`. | Identity is resolved solely from verified JWT session token. Other user's data is never returned. | PASSED |
| **SEC-04: Unauthorized Admin API Call** | Call `GET /api/admin/dashboard` using normal user token or without token. | Backend returns `401 Unauthorized` or `403 Forbidden: Requires administrative privileges`. | PASSED |
| **SEC-05: Account Lockout / Suspension** | Admin suspends user `demo@example.com`. User attempts to make an API call. | Auth middleware immediately intercepts the request and responds with `403 Forbidden: Account suspended`. | PASSED |

---

## 3. Admin Management Test Cases

| Test Case | Steps to Execute | Expected Outcome | Status |
|---|---|---|---|
| **ADM-01: Admin Login** | Open `/admin/login` and click "Auto Fill" then "Sign In". | Logs in successfully, sets admin token, and loads `/admin/dashboard`. | PASSED |
| **ADM-02: Live Statistics** | Open `/admin/dashboard`. | Displays real aggregates calculated from MongoDB collections. | PASSED |
| **ADM-03: User Search** | Open `/admin/users` and search "Demo". | Lists matching user `Demo User` with current balances. | PASSED |
| **ADM-04: Auditable Balance Adjustment** | Open User Inspector for Demo User. Credit 500 VEs with reason "Test audit credit". | User balance increases to 4,350 VEs. New `WalletTransaction` and `AdminAuditLog` entries are generated. | PASSED |
| **ADM-05: Payout Approval** | Open `/admin/withdrawals`. Find pending request and click Approve. | Status becomes `APPROVED`, frozen reserved VEs are permanently deducted, and user's Total Amount Withdrawn increases. | PASSED |
| **ADM-06: Payout Rejection & Refund** | Find pending request, click Reject, enter reason "Invalid IFSC". | Status becomes `REJECTED`, rejection reason is recorded, and frozen VEs are refunded back to the user's available wallet. | PASSED |
| **ADM-07: Audit Trail** | Open `/admin/audit-logs`. | Every balance adjustment, withdrawal approval, and status change is displayed chronologically with full details. | PASSED |
