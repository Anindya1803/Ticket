# College Help Request System

A scalable ticketing system for colleges, built with Next.js 15, PostgreSQL, and Prisma.

## Features
- **Authentication**: Secure login via Google or Credentials (NextAuth v5).
- **Roles**: Student (Creator), Staff (Resolver), Admin (Manager).
- **Dashboard**: Real-time overview of ticket status.
- **Tickets**: Create, track, and comment on support requests.
- **Responsive**: Mobile-first design for students on the go.

## Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL Database (Local or Cloud like Supabase/Neon)

### 2. Installation
```bash
# Install dependencies
npm install

# Setup Environment
cp .env.example .env
# Edit .env and add your DATABASE_URL and AUTH_SECRET
```

### 3. Database Setup
```bash
# Push schema to database
npx prisma db push

# Generate client
npx prisma generate
```

### 4. Run Locally
```bash
npm run dev
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the Environment Variables (`DATABASE_URL`, `AUTH_SECRET`, etc.).
4. Deploy!

### Database Scaling
For a college with 1200 users:
- **Connection Pooling**: Use a connection pooler (like Supabase Transaction pool or PgBouncer) to prevent "Too many connections" errors during peak times (e.g., semester start).
- **Indexing**: Prisma handles basic indices, but monitor `Ticket` queries on `status` and `creatorId`.

## Load Testing
We use [k6](https://k6.io/) for load testing.
```bash
# Install k6
choco install k6

# Run load test
k6 run scripts/load-test.js
```
