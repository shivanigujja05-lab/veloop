# VELoop Rewards — API Documentation

This document specifies the backend REST API endpoints, request schemas, authentication rules, and response payloads for VELoop Rewards.

---

## 1. Architecture & Design Principles

1. **Backend as Source of Truth**: Balances, XP, levels, achievements, and withdrawal statuses are computed and validated exclusively on the server.
2. **Standard Response Envelope**:
   - Success: `{ "success": true, "message": "...", ...data }`
   - Failure: `{ "success": false, "message": "...", "errors": [...] }`
3. **Authentication**: All protected endpoints require a Bearer token in the `Authorization` header:
   ```
   Authorization: Bearer <jwt_token>
   ```

---

## 2. Authentication Endpoints

### 2.1 User Registration
- **Route**: `POST /api/auth/register`
- **Rate Limit**: 30 requests / 15 minutes
- **Request Body**:
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "Password@123",
  "referredBy": "VELOOP123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Account registered successfully",
  "token": "eyJhbGciOi...",
  "user": {
    "userId": "VLRUSR202654321",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "referralCode": "ALEX492",
    "accountStatus": "ACTIVE",
    "role": "user"
  }
}
```

### 2.2 User Login
- **Route**: `POST /api/auth/login`
- **Rate Limit**: 30 requests / 15 minutes
- **Request Body**:
```json
{
  "email": "demo@example.com",
  "password": "DemoUser@2026"
}
```

### 2.3 Admin Login
- **Route**: `POST /api/auth/admin/login`
- **Request Body**:
```json
{
  "email": "demo-admin@example.com",
  "password": "DemoAdmin@2026"
}
```

---

## 3. User Profile Endpoints

### 3.1 Unified Profile Me
- **Route**: `GET /api/profile/me`
- **Auth**: Protected (User Bearer Token)
- **Response (200 OK)**:
```json
{
  "success": true,
  "profile": {
    "userId": "VLRUSR202600123",
    "displayName": "Demo User",
    "email": "demo@example.com",
    "referralCode": "VELOOP123",
    "accountStatus": "ACTIVE",
    "memberSince": "2025-10-15T10:00:00.000Z",
    "isEmailVerified": true,
    "role": "user"
  },
  "rewards": {
    "ves": 3850,
    "sves": 1240,
    "gems": 240,
    "tokens": 5000,
    "xp": 6420,
    "reservedVes": 500
  },
  "levelProgress": {
    "currentLevel": 4,
    "currentLevelName": "Reward Explorer",
    "nextLevel": 5,
    "nextLevelName": "Gold Champion",
    "currentXp": 6420,
    "nextLevelXp": 8000,
    "xpRemaining": 1580,
    "progressPercentage": 21,
    "badgeIcon": "Zap",
    "badgeColor": "#F59E0B"
  }
}
```

### 3.2 Update Profile
- **Route**: `PATCH /api/profile/me`
- **Body**: `{ "name": "Updated Name", "profileImage": "https://..." }`

### 3.3 Rewards Balances
- **Route**: `GET /api/profile/rewards`
- **Response**: Returns VEs, SVEs, Gems, Tokens, XP, and reserved balances.

### 3.4 Level Progress
- **Route**: `GET /api/profile/level-progress`

### 3.5 Achievements & Progress
- **Route**: `GET /api/profile/achievements`
- **Response**: List of all platform achievements with user-specific unlock status, current progress, and rewards.

### 3.6 Withdrawal Summary
- **Route**: `GET /api/profile/withdrawal-summary`
- **Response**:
```json
{
  "success": true,
  "summary": {
    "totalRequests": 24,
    "pendingRequests": 2,
    "approvedRequests": 21,
    "rejectedRequests": 1,
    "totalAmountWithdrawn": 2450,
    "currencySymbol": "₹"
  },
  "recentWithdrawals": [...]
}
```

### 3.7 Referrals Snapshot
- **Route**: `GET /api/profile/referrals`

### 3.8 Recent Activity
- **Route**: `GET /api/profile/activity?limit=10`

---

## 4. Interactive Quick Actions Endpoints

### 4.1 Watch Sponsored Video
- **Route**: `POST /api/actions/watch-ad`
- **Effect**: Credits +50 VEs and +100 XP to the user's wallet, records an immutable transaction and activity log, and evaluates achievement unlocks.

### 4.2 Daily Bonus Check-in
- **Route**: `POST /api/actions/daily-bonus`
- **Effect**: Credits +20 Gems and +150 XP.

### 4.3 Convert SVEs to VEs
- **Route**: `POST /api/actions/convert-sve`
- **Body**: `{ "amount": 100 }`
- **Effect**: Debits 100 SVEs, credits 100 standard VEs at a 1:1 ratio.

### 4.4 Redeem Reward (Submit Withdrawal)
- **Route**: `POST /api/actions/redeem-reward`
- **Body**:
```json
{
  "vesAmount": 500,
  "payoutMethod": "UPI",
  "payoutDetails": {
    "upiId": "demouser@okhdfcbank",
    "holderName": "Demo User"
  }
}
```
- **Effect**: Validates balance, reserves 500 VEs, and creates a `PENDING` withdrawal record for ₹50 INR.

---

## 5. Admin Management Endpoints

All admin endpoints require `protectAdmin` middleware verification.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Returns aggregate user, balance, withdrawal, and referral metrics. |
| `GET` | `/api/admin/users` | Paginated user search with status filter. |
| `GET` | `/api/admin/users/:id` | Detailed profile, wallet, withdrawals, and transactions for a user. |
| `PATCH` | `/api/admin/users/:id/status` | Suspend or restore user account with mandatory reason. |
| `POST` | `/api/admin/users/:id/adjust-balance` | Auditable credit/debit balance adjustment. |
| `GET` | `/api/admin/withdrawals` | Filter withdrawal requests (PENDING, APPROVED, REJECTED). |
| `PATCH` | `/api/admin/withdrawals/:id` | Approve (disburse) or Reject (refund) redemption request. |
| `GET` | `/api/admin/levels` | List level configuration tiers. |
| `PUT` | `/api/admin/levels/:id` | Update level name, threshold, badge. |
| `GET` | `/api/admin/achievements` | List achievement rules and badge artwork. |
| `PUT` | `/api/admin/achievements/:id` | Update achievement requirement and rewards. |
| `GET` | `/api/admin/referrals` | Inspect referral network connections. |
| `GET` | `/api/admin/audit-logs` | Retrieve chronological security audit trail. |

