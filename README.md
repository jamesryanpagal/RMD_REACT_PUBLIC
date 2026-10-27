# RMD Land — Real Estate Lot Sales Dashboard

Web dashboard for a real estate company's lot sales operations. Admins and secretaries use it to manage subdivision inventory, clients, reservations, contracts, payments, and agent commissions. Built with **React 19**, **TypeScript**, and **Vite**, and used in production.

The backend API is a separate service: **[RMD_NEST_PUBLIC](https://github.com/jamesryanpagal/RMD_NEST_PUBLIC)** (NestJS, Prisma, PostgreSQL).

> This repository is shared for **portfolio and code review purposes only**. Environment files, deployment configuration, and production data are intentionally excluded.

---

## Tech Stack

| Area               | Technology                                                      |
| ------------------ | --------------------------------------------------------------- |
| Framework          | React 19, TypeScript, Vite 7                                    |
| Routing            | React Router 7                                                  |
| Server state       | TanStack Query                                                  |
| Tables & lists     | TanStack Table, TanStack Virtual                                |
| Forms & validation | React Hook Form, Zod                                            |
| HTTP & realtime    | Axios, Socket.IO client                                         |
| UI                 | Tailwind CSS 4, Radix UI, shadcn/ui, Lucide icons               |
| Utilities          | date-fns, moment-timezone, DOMPurify, deep-diff, react-to-print |

---

## Features

### Inventory

- Project pages with nested **phases, blocks, and lots**
- Status-aware views for lot availability

### Sales Workflow

- **Clients** and **agents** management
- **Reservations** and **contracts**, including payment terms and forfeiture
- **Payments:** payment schedules, recorded payments, and payment breakdowns
- **Printable receipts**, with the amount written out in words (Pesos and Centavos)
- **Agent commissions** with release tracking

### Roles & Access

- Two roles: **Admin** and **Secretary**
- The sidebar and routes are generated from each user's allowed modules, so users only see the pages they can open

### Approval Requests

- Changes made by secretaries go through an approval queue
- Admins see a **field-by-field comparison** of the current value and the requested change before they approve or reject it

### Audit Trail & Notifications

- Audit trail views per module
- **Real-time in-app notifications** over Socket.IO, with read and unread states

### Auth & UX

- Login and forgot-password flows
- Access token handling with **automatic refresh**: an Axios interceptor catches `401` responses, refreshes the token using an httpOnly cookie, and retries the original request
- Light and dark themes
- Sanitized HTML rendering with DOMPurify

---

## Project Structure

```
src/
├── api/                  # Axios instance, refresh-token interceptor, endpoint functions
├── components/           # App shell (header, sidebar), shared UI, data table, receipt view
│   ├── context/          # Auth and theme providers
│   └── ui/               # shadcn/ui-based primitives
├── hooks/
│   ├── queries/          # TanStack Query hooks per domain (projects, contracts, payments…)
│   └── socket/           # Notification socket hook
├── pages/
│   ├── onboarding/       # Login, forgot password
│   └── onboarded/        # Projects, reservations, clients, agents, users, contracts,
│                         # requests, audit trail, notifications, settings
├── routes/               # Route table and role/module-based access
├── utils/                # API paths, Zod schemas, helpers, socket client, timezone utils
└── lib/
```

---

## Suggested Starting Points for Review

- **Role/module-based routing:** `src/routes/page-routes.tsx`
- **Token refresh interceptor:** `src/api/base-request.api.ts`
- **Data fetching hooks:** `src/hooks/queries/`
- **Realtime notifications:** `src/utils/socket.ts`, `src/hooks/socket/useSocketNotification.ts`
- **Approval request diff view:** `src/pages/onboarded/requests/request.tsx`, `onDeepDiff` in `src/utils/helper.ts`
- **Receipt printing:** `src/components/payment-details.tsx`
- **Form validation schemas:** `src/utils/schema.z.ts`

---

## Related Repository

- **Backend API:** [RMD_NEST_PUBLIC](https://github.com/jamesryanpagal/RMD_NEST_PUBLIC): NestJS, Prisma, PostgreSQL, JWT auth, approval workflow, database-level audit triggers

---

## Author

**James Ryan Pagal**

- GitHub: [@jamesryanpagal](https://github.com/jamesryanpagal)
- LinkedIn: [jamesryanpagal](https://www.linkedin.com/in/james-ryan-pagal-293a691ba/)
- Portfolio: [opterna](https://www.opterna.cloud/)
