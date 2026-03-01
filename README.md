# ATMS - Agricultural Trading Management System

A comprehensive, production-ready ERP system built with Next.js for agricultural trading businesses. It supports **multiple Admins** and **multiple Users** for inventory, purchases, sales, customers, providers, and reports.

---

## 👥 Roles: Multiple Admins & Multiple Users

The system allows **multiple admin accounts** and **multiple user accounts**. Each admin or user has their own login; teams can share the same business data.

### Admin (multiple admins)

- **Who:** Owners, managers, or staff with full control. **Multiple admins** can exist in the system.
- **Access:** Full access to the entire application.
- **Responsibilities:**
  - Register or be added as an admin (new admin accounts can be created)
  - Login and manage all modules
  - Manage products, providers, customers, purchases, sales
  - View dashboard, reports, and low-stock alerts
  - Change password, forgot/reset password
  - Use **Settings** for app preferences
- **Routes:** `/register` (create new admin), `/login`, `/dashboard`, `/products`, `/providers`, `/customers`, `/purchases`, `/sales`, `/reports`, `/settings`, `/forgot-password`, `/reset-password`, `/change-password` (if implemented).

### User (multiple users)

- **Who:** Staff or team members using the system for daily operations. **Multiple users** can have their own accounts.
- **Access:** After login, access to business modules as permitted by their role.
- **Responsibilities:**
  - Sign in at `/login` with their own credentials
  - Use Dashboard for overview and low-stock alerts
  - Add/edit products, providers, and customers (as allowed)
  - Record purchases and sales
  - View and filter reports
  - Request password reset if needed
- **Routes:** `/login`, `/dashboard`, `/products`, `/providers`, `/customers`, `/purchases`, `/sales`, `/reports`, `/forgot-password`, `/reset-password`.


---

## 🚀 Features

### Authentication

- ✅ Multiple Admin & User accounts
- ✅ Registration for new admins (and users, if enabled)
- ✅ Secure Login with JWT HTTPOnly Cookies
- ✅ Forgot / Reset Password via Email
- ✅ Change Password
- ✅ Protected Routes with Middleware

### Business Modules (Admin & User)

- ✅ **Products** – Add, edit, delete products; units: KG, Quintal, Ton
- ✅ **Providers** – Manage suppliers/farmers and contact details
- ✅ **Customers** – Store buyers and payment history
- ✅ **Purchases** – Multi-product purchases with automatic stock increase
- ✅ **Sales** – Sales with stock checks and profit calculation
- ✅ **Dashboard** – Stats, low-stock alerts, recent transactions
- ✅ **Reports** – Daily, monthly, yearly profit/loss and filters

### Other

- 📊 Automated stock tracking  
- 💰 Profit per transaction  
- 📈 Due tracking (providers and customers)  
- 🔔 Low stock alerts  
- 📱 Responsive UI  
- 🎨 Tailwind CSS  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), JavaScript/JSX, Tailwind CSS, Lucide-React, React Hot Toast  
- **Backend:** Next.js API Routes, Prisma ORM, MongoDB, JWT (HTTPOnly cookies via `jose`), bcryptjs  

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)
- Optional: email service for forgot/reset password

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**  
   Copy `.env.example` to `.env` (or create it) and set:
   ```env
   DATABASE_URL="<YOUR_MONGODB_URI>"
   JWT_SECRET="your-secret-change-in-production"
   JWT_EXPIRES_IN="7d"

   # Resend (for auth emails)
   RESEND_API_KEY="re_your_api_key"
   FROM_EMAIL="info@yourdomain.com"
   ```

3. **Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## 📚 Usage Guide

### For Admins & Users

1. **Registration:** Go to **Get Started** or `/user/register` to create an account.
2. **Login:** Accessible via `/user/login` (or `/login`).
3. **Dashboard:** Overview of stock, sales, and analytics.
4. **Modules:** Manage **Products**, **Providers**, **Customers**, **Purchases**, and **Sales** from the sidebar.
5. **Reports:** Generate daily, monthly, or yearly financial insights.
6. **Password Management:** Reset via email or change in settings.

### Quick Flows

| Task            | Where        | Steps |
|----------------|---------------|--------|
| Add product     | Products      | Add Product → name, unit → Save |
| Record purchase | Purchases     | Select provider → Add products, qty, price → Enter paid amount → Save |
| Record sale     | Sales         | Select customer → Add products, cost/sale price → Save (profit auto) |
| View reports    | Reports       | Choose period/range → View/export |

---

## 🔒 Security

- Password hashing (bcryptjs)
- JWT in HTTPOnly cookies (XSS mitigation)
- SameSite cookies
- Input validation on APIs
- Protected routes via middleware
- Session expiry (e.g. 7 days)

---

## 🗄️ Database (Key Models)

- **Admin** – Multiple admin accounts (each with login, full access).
- **User** – Multiple user accounts (each with login, role-based access as configured).
- **Product** – Items and stock.
- **Provider** – Suppliers/farmers.
- **Customer** – Buyers.
- **Purchase / PurchaseItem** – Purchase transactions.
- **Sale / SaleItem** – Sales and profit.

---

## 📁 Project Structure

```
atms/
├── src/
│   ├── app/
│   │   ├── (admin)/       # Admin-specific routes
│   │   ├── user/          # User/Team-specific routes
│   │   ├── api/           # API routes (auth, user, admin)
│   │   ├── layout.jsx
│   │   └── globals.css
│   ├── components/        # Shared components and UI primitives
│   ├── services/          # Business logic layer
│   ├── dal/               # Data Access Layer
│   ├── lib/               # Utilities (Prisma, Auth, Resend)
│   └── middleware.js      # Global route protection
├── prisma/
│   └── schema.prisma
└── package.json
```

---

## 📝 API Overview

### Auth (Admin / User)

- `POST /api/auth/register` – Register new admin (multiple admins)
- `POST /api/auth/login` – Login (any admin or user)
- `POST /api/auth/logout` – Logout
- `POST /api/auth/forgot-password` – Request reset
- `POST /api/auth/reset-password` – Reset with token
- `POST /api/auth/change-password` – Change password

### Business (Protected)

- `GET/POST/PUT/DELETE /api/products`
- `GET/POST/PUT/DELETE /api/providers`
- `GET/POST/PUT/DELETE /api/customers`
- `GET/POST /api/purchases`
- `GET/POST /api/sales`
- `GET /api/dashboard`
- `GET /api/reports`

---

## 🚀 Deployment

1. Set production env vars (e.g. on Vercel).
2. Build and start:
   ```bash
   npm run build
   npm start
   ```

---

---

## 🔧 Troubleshooting

### 1. Database Connection (DNS/Timeout)
If you see a "DNS resolution" error or `no record found for Query { name: Name("_mongodb._tcp.cluster.mongodb.net.") }`:
- **Cause**: Invalid or placeholder `DATABASE_URL` in `.env`.
- **Fix**: Ensure your `DATABASE_URL` is a real MongoDB connection string.
  - **Atlas**: `mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/<DB_NAME>?retryWrites=true&w=majority`
  - **Local**: `mongodb://localhost:27017/atms`
- **Restart**: After updating `.env`, stop the server (Ctrl+C) and run `npm run dev` again.

### 2. Prisma Sync
If you receive "Module not found" or database schema errors:
- Ensure you have run:
  ```bash
  npx prisma generate
  npx prisma db push
  ```

---

## 📄 License

For educational and commercial use.

---

**Note:** Always change `JWT_SECRET` and database credentials before production.
