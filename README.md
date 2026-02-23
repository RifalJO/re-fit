# RE FIT - Personalized Nutrition Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-green?logo=prisma)](https://www.prisma.io)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)

**RE FIT** is a precision-targeted nutritional platform that translates biometric data into actionable, culturally relevant meal plans. Built with Next.js 14, TypeScript, and Prisma ORM.

## 🎯 Features

- **Personalized Nutrition Plans** - BMR & TDEE calculation using Mifflin-St Jeor equation
- **Smart Recipe Recommendations** - Euclidean distance algorithm for meal matching
- **Allergy-Safe Filtering** - Advanced filtering for dietary restrictions
- **User Authentication** - Secure login/signup with NextAuth.js
- **Weight Tracking** - Historical weight progress visualization
- **Favorite Recipes** - Save and manage your favorite meals
- **Responsive Design** - Beautiful UI with Tailwind CSS & shadcn/ui

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18 |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Backend** | Next.js API Routes, TypeScript |
| **Database** | PostgreSQL (Vercel Postgres) |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js (Credentials) |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod validation |

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn
- PostgreSQL database (for production)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/re-fit.git
cd re-fit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
# Copy the example env file
cp .env.example .env.local
```

Edit `.env.local` with your database connection string:

```env
DATABASE_URL="file:./prisma/dev.db"  # For local SQLite development
NEXTAUTH_SECRET="your-secret-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
re-fit/
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── data/
│       ├── data_makanan.csv    # Recipe dataset
│       └── kamus_bahan.json    # Allergy mapping
├── src/
│   ├── app/
│   │   ├── (guest)/       # Public routes (onboarding, results)
│   │   ├── (member)/      # Protected routes (dashboard)
│   │   ├── api/           # API endpoints
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── onboarding/    # Onboarding form components
│   │   ├── recipes/       # Recipe card components
│   │   └── charts/        # Recharts components
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── prisma.ts      # Prisma client
│   │   ├── store.ts       # Zustand store
│   │   └── data.ts        # Data loading utilities
│   └── types/
│       └── index.ts       # TypeScript types
└── .env.local             # Environment variables
```

## 🗄️ Database Schema

The application uses the following tables:

- **User** - Authentication & user accounts
- **Biometrics** - User health data (gender, age, weight, height, activity level)
- **Favorite** - Saved recipes
- **WeightEntry** - Weight tracking history
- **Account** - OAuth provider accounts
- **Session** - User sessions

## 📊 Recipe Dataset

Recipes are sourced from [Dapur Umami](https://www.dapurumami.com) with:
- 300+ Indonesian recipes
- Nutritional information (calories, protein, carbs, fat, fiber)
- Allergy mapping for 6 common allergens

## 🔐 Authentication

RE FIT uses NextAuth.js with credentials authentication:
- Email/password login
- Bcrypt password hashing
- JWT-based sessions
- Protected API routes

## 🚢 Deployment

### Deploy to Vercel with PostgreSQL

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add Vercel Postgres database
   - Set environment variables:
     - `DATABASE_URL` (auto-set by Vercel Postgres)
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`

3. **Run migrations**
   ```bash
   vercel link
   vercel env pull
   npx prisma generate
   npx prisma db push
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📸 Screenshots

### Landing Page
*Add screenshot here*

### Onboarding Form
*Add screenshot here*

### Recipe Recommendations
*Add screenshot here*

### User Dashboard
*Add screenshot here*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is created for educational purposes (Skripsi/Thesis).

## 👨‍💻 Author

**Kinga**  
Gunadarma University - Semester 8  
Computer Science Student

---

**RE FIT** - Your Personal Path to Better Health 🎯
