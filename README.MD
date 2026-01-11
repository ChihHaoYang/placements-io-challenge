# Ad Campaign & Invoice Manager (Placements.io Challenge)

A full-stack application designed to manage advertising campaigns, line items, and billing invoices. This project demonstrates a monorepo architecture using React for the frontend and Node.js (Hono) for the backend, focusing on data consistency, clean architecture, and user experience.

## 🚀 Features Implemented

### Bucket 1: Core Features

- Backend Data Model: A relational database schema (SQLite via Prisma) modeling Campaigns, Line Items, and Invoices.
- Data Seeding: Automated script to seed the database with the provided sample dataset.
- List Views: A paginated table of Campaigns with aggregated financial data (Booked Budget vs. Actual Spend).
- Detail Views: Comprehensive drill-down into Campaign Line Items.
- Editing Capability: Ability to modify adjustments for individual line items with optimistic UI updates.

### Bucket 2: Advanced Features

- Change History (Audit Log): Tracks all modifications made to invoice adjustments, viewable via a timeline UI.
- CSV Export: Server-side streaming export functionality to download all campaign data.
- Unit & Integration Tests: Robust testing suite using Vitest and React Testing Library covering utility logic and component interactions.

## 🛠 Tech Stack

**Frontend** (/client)

- Framework: React + Vite
- Language: TypeScript
- UI Library: Mantine v8 (Table, AppShell, Modals, Timeline)
- State Management: TanStack Query v5 (Server state & Caching)
- Routing: React Router V7
- Testing: Vitest, React Testing Library
- Utilities: react-countup (Animations), intl (Formatting)

**Backend** (/server)

- Runtime: Node.js
- Framework: Hono (Lightweight, fast standards-based web framework)
- Database: SQLite (Embedded, zero-config)
- ORM: Prisma
- Language: TypeScript

## ⚙️ Design Decisions & Trade-offs

1. Monorepo & BFF (Backend for Frontend) Pattern

- _Decision_: Instead of mocking data in the frontend, I implemented a real lightweight backend using Hono and SQLite.
- _Reasoning_: This allows for realistic implementation of Server-side Pagination, Aggregation (SUM/GROUP BY), and Transactional Integrity (updating adjustments + writing audit logs atomically).

2. Prisma & SQLite

- _Decision_: Used SQLite instead of PostgreSQL/MySQL.
- _Reasoning_: To satisfy the requirement of "Easy to build and run". The reviewer does not need to spin up a Docker container; the database is a simple file.

3. TanStack Query vs. Redux

- _Decision_: Chose TanStack Query over Redux/Zustand.
- _Reasoning_: The application state is primarily "Server State" (syncing with DB). React Query handles caching, deduplication, and invalidation (e.g., updating the total budget immediately after editing a line item) much better than a global store.

4. Optimistic UI & UX

- Implemented debounced inputs for editing adjustments to reduce API calls.
- Used tabular-nums CSS and ticker animations to provide a professional financial dashboard feel without layout shifts.

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### 1. Clone the repository

```Bash

git clone https://github.com/ChihHaoYang/placements-io-challenge
cd placements-challenge
```

### 2. Setup Backend (Server & Database)

The backend uses SQLite, so you need to initialize the database file and seed the data.

First create a `.env` file under `server` folder with following content

```
DATABASE_URL="file:./dev.db"
```

Backend setup steps

```Bash
cd server

# Install dependencies
npm install

# Initialize Database (Run Migrations)
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database with sample data (This will take a while)
npx tsx prisma/seed.ts
# You should see: "Seeding finished."

# Return to root
cd ..
```

### 3. Setup Frontend (Client)

```Bash

cd client

# Install dependencies
npm install

# Return to root
cd ..
```

## ▶️ Running the App

You need to run both the backend server and the frontend client. You can do this in two separate terminal windows.

### Terminal 1: Backend

```Bash

cd server
npm run dev
# Server will start at http://localhost:3000
```

### Terminal 2: Frontend

```Bash

cd client
npm run dev
# Client will start at http://localhost:5173
```

Open your browser and navigate to http://localhost:5173.

## 🧪 Running Tests

Unit and integration tests are located in the client directory.

```Bash

cd client
npm test
```

This will run the Vitest suite checking:

- Number formatting utilities.
- Component interaction (Debounce logic on inputs).
- Page integration.

## Project Structure

```Plaintext
.
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # UI Components (AnimatedNumber, HistoryModal, etc.)
│   │   ├── hooks/          # React Query Hooks (useCampaigns, etc.)
│   │   ├── pages/          # Page Views (CampaignList, CampaignDetail)
│   │   ├── routes/         # React Router settings
│   │   ├── test/           # Vitest setup and render util for Mantine
│   │   └── types/          # Type definitions used by Frontend
│   └── vite.config.ts
└── server/                 # Backend Application
    ├── prisma/
    │   ├── schema.prisma   # Database Schema
    │   ├── prisma.ts       # Prisma client
    │   └── seed.ts         # Data Seeding Script
    └── src/
        └── index.ts        # API Routes & Logic

```
