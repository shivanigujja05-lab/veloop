# VELoop Rewards — Security & Data Integrity Architecture

This document details the security model, authorization barriers, and data integrity safeguards implemented across the VELoop Rewards system.

---

## 1. Core Security Principle: Backend Source of Truth

As mandated in **Section 3 & Section 51** of the specification:
> **"The evaluator must be able to open browser DevTools, edit local state or network requests, and verify that the backend strictly rejects unauthorized changes."**

### How Frontend Manipulation is Prevented:
1. **Zero Client Trust**:
   - The user cannot submit an arbitrary balance update (e.g. `ves: 999999`). There is no endpoint that accepts balance values from normal user requests.
   - Profile update endpoints (`PATCH /api/profile/me`) accept only `name` and `profileImage`. Any balance, level, or XP parameters included in the request body are ignored and filtered by validation middleware.
2. **Session-Derived User Identity**:
   - The user cannot access another user's data by passing `{ "userId": "another-user" }` in the URL or payload.
   - User identity is strictly resolved on the server from the cryptographically verified JWT bearer token: `req.user = await User.findById(decoded.id)`.
3. **Double-Entry Wallet Accounting**:
   - Balances are altered only through internal service functions (`adjustUserBalance`).
   - Every balance change automatically produces an immutable `WalletTransaction` with `previousBalance`, `newBalance`, amount, reason, and reference ID.
4. **Reserved Balance Safeguards**:
   - When a redemption request is submitted, the corresponding VEs are frozen in `reservedVes`.
   - If the administrator rejects the request, the frozen VEs are released back into the user's available balance.
   - If approved, the frozen VEs are permanently deducted. A user cannot spend their VEs twice while a withdrawal is pending.

---

## 2. Authentication & Authorization

### 2.1 Cryptographic Password Security
- Passwords are hashed using **Bcrypt** with 10 salt rounds before saving.
- The password field is excluded from all default queries (`select: false`).
- Plaintext passwords are never returned in any API response or logged to stdout.

### 2.2 JWT Bearer Tokens
- Tokens are signed with a server-side `JWT_SECRET`.
- Tokens expire after 7 days and include the user's database `id` and `role`.
- Tampered or expired tokens immediately return `401 Unauthorized`.

### 2.3 Strict Admin Permission Guard
- Ordinary users cannot call admin routes (`/api/admin/*`).
- Admin endpoints use `protectAdmin` middleware, which verifies that the token was signed specifically for an active `AdminUser` with `SUPER_ADMIN` or `ADMIN_MODERATOR` role.
- Repeated failed admin login attempts trigger account lockout to prevent brute-force attacks.

---

## 3. Threat Mitigation & Hardening

| Vector | Mitigation Strategy |
|---|---|
| **Brute Force Attacks** | `express-rate-limit` enforces 30 attempts per 15 minutes on auth endpoints. |
| **HTTP Header Injection** | `helmet` middleware secures HTTP headers (CSP, HSTS, X-Content-Type-Options). |
| **Cross-Origin Attacks** | CORS middleware restricts origins to authorized client domains. |
| **Data Pollution** | `express-validator` validates and sanitizes all incoming bodies. |
| **Information Leakage** | Centralized error handler captures errors and converts them to user-friendly messages without leaking database stack traces or SQL/Mongo query details. |
| **Account Suspension** | Users marked `SUSPENDED` are rejected at the authentication middleware level with a 403 Forbidden code. |

