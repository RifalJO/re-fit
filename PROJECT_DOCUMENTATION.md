# RE FIT - Comprehensive Project Documentation

> **Personalized Nutrition Platform with Indonesian Recipe Recommendations**  
> Thesis Project (Skripsi) - Gunadarma University

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [Health Calculations](#health-calculations)
7. [Core Features](#core-features)
8. [API Endpoints](#api-endpoints)
9. [Recipe Dataset](#recipe-dataset)
10. [Development Commands](#development-commands)
11. [Deployment](#deployment)

---

## Project Overview

**RE FIT** is a comprehensive personalized nutrition platform that helps users get tailored Indonesian meal recommendations based on their biometric data, health conditions, and food preferences.

### What It Does

1. **Collects user biometric data** through a multi-step onboarding process
2. **Calculates metabolic metrics** (BMR, TDEE, calorie targets) using scientific formulas
3. **Recommends recipes** from a dataset of 300+ Indonesian dishes using Euclidean distance algorithms
4. **Filters recipes** based on allergies and dietary restrictions
5. **Tracks health metrics** including weight history and water intake
6. **Provides advanced features** like intermittent fasting tracking, macro analysis, recipe swapping, and grocery list generation
7. **Supports bilingual interface** (Indonesian/English)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    RE FIT Application                    │
├─────────────────────────────────────────────────────────┤
│  Frontend: Next.js 14 + React 18 + TypeScript           │
│  Styling: Tailwind CSS + shadcn/ui                      │
│  State: Zustand (client-side persistence)               │
├─────────────────────────────────────────────────────────┤
│  Backend: Next.js API Routes                            │
│  Database: PostgreSQL (production) / SQLite (dev)       │
│  ORM: Prisma 6                                          │
│  Auth: NextAuth.js 5 (JWT + Credentials)                │
├─────────────────────────────────────────────────────────┤
│  Deployment: Vercel                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14.2.35 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS 3.4.1 |
| **Components** | shadcn/ui (Radix UI based) |
| **Database** | PostgreSQL / SQLite |
| **ORM** | Prisma 6.0.0 |
| **Auth** | NextAuth.js 5.0.0-beta.30 |
| **State Management** | Zustand 5.0.11 |
| **Forms** | React Hook Form 7.71.2 |
| **Validation** | Zod 4.3.6 |
| **Charts** | Recharts 3.7.0 |
| **Animations** | Framer Motion 12.34.3 |
| **Icons** | Lucide React |
| **Password Hashing** | bcryptjs 3.0.3 |
| **Deployment** | Vercel |

### Key Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "14.2.35",
    "react": "18",
    "react-dom": "18",
    "typescript": "5",
    "@prisma/client": "6.0.0",
    "next-auth": "5.0.0-beta.30",
    "zustand": "5.0.11",
    "tailwindcss": "3.4.1",
    "recharts": "3.7.0",
    "react-hook-form": "7.71.2",
    "zod": "4.3.6",
    "framer-motion": "12.34.3",
    "lucide-react": "^0.511.0",
    "bcryptjs": "3.0.3"
  },
  "devDependencies": {
    "prisma": "6.0.0",
    "@types/node": "20",
    "@types/react": "18",
    "eslint": "8",
    "eslint-config-next": "14.2.35"
  }
}
```

---

## Directory Structure

```
re-fit/
├── prisma/
│   ├── schema.prisma           # Database schema (10 models)
│   └── dev.db                  # SQLite database (development)
│
├── public/
│   ├── logo.png                # Application logo
│   ├── favicon.ico
│   ├── recipes_data_app_ready.csv  # Recipe dataset (300+ recipes)
│   └── data_makanan.csv        # Raw recipe data
│
├── src/
│   ├── app/
│   │   ├── (guest)/            # Public routes (route group)
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login page
│   │   │   ├── signup/
│   │   │   │   └── page.tsx    # Registration page
│   │   │   ├── onboarding/
│   │   │   │   └── page.tsx    # 4-step onboarding form
│   │   │   └── results/
│   │   │       └── page.tsx    # Recipe recommendations results
│   │   │
│   │   ├── (member)/           # Protected routes (route group)
│   │   │   └── dashboard/
│   │   │       ├── page.tsx    # Main dashboard
│   │   │       └── recipes/    # Recipe browsing pages
│   │   │
│   │   ├── api/                # API endpoints (13 routes)
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/  # NextAuth route handler
│   │   │   │   ├── register/       # User registration
│   │   │   │   └── signout/        # Sign out endpoint
│   │   │   ├── user/
│   │   │   │   ├── biometrics/     # User biometrics CRUD
│   │   │   │   ├── favorites/      # Favorite recipes CRUD
│   │   │   │   ├── recommendations/ # Recipe recommendations
│   │   │   │   └── weight/         # Weight tracking CRUD
│   │   │   └── recipes/        # Recipe-related endpoints
│   │   │       ├── route.ts
│   │   │       ├── [title]/
│   │   │       └── recommendations/
│   │   │
│   │   ├── fonts/              # Custom fonts
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/
│   │   ├── charts/             # Recharts components
│   │   │   └── macro-chart.tsx
│   │   │
│   │   ├── dashboard/          # Dashboard widgets
│   │   │   ├── intermittent-fasting.tsx  # IF timer tracker
│   │   │   ├── hydration-tracker.tsx     # Water intake tracker
│   │   │   ├── macro-balance-radar.tsx   # Macro analysis radar chart
│   │   │   ├── swap-it.tsx               # Recipe swap feature
│   │   │   └── grocery-list.tsx          # Shopping list generator
│   │   │
│   │   ├── onboarding/         # Onboarding form components
│   │   │   ├── form-schema.ts      # Zod validation schema
│   │   │   ├── form-steps.tsx      # 4-step form wizard
│   │   │   └── onboarding-form.tsx # Main form container
│   │   │
│   │   ├── recipes/            # Recipe display components
│   │   │   ├── recipe-card.tsx         # Single recipe card
│   │   │   ├── enhanced-recipe-card.tsx # Enhanced version
│   │   │   ├── recipe-filter.tsx       # Filter controls
│   │   │   └── recipe-grid.tsx         # Grid layout
│   │   │
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── switch.tsx
│   │   │   └── tabs.tsx
│   │   │
│   │   ├── auth-provider.tsx   # NextAuth session provider
│   │   └── language-switcher.tsx  # i18n language toggle
│   │
│   ├── lib/
│   │   ├── i18n/               # Internationalization
│   │   │   ├── index.ts
│   │   │   ├── provider.tsx    # i18n context provider
│   │   │   └── translations.ts # ID/EN translations
│   │   │
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── store.ts            # Zustand state management
│   │   ├── data.ts             # Data loading utilities
│   │   ├── ingredients.ts      # Ingredient preferences data
│   │   ├── recipe-utils.ts     # Recipe algorithms (KNN, distance)
│   │   ├── session.ts          # Session utilities
│   │   └── utils.ts            # General utilities (cn, format)
│   │
│   └── types/
│       ├── index.ts            # Main type definitions
│       └── recipe.ts           # Recipe-specific types
│
├── .env.example                # Environment variables template
├── .env.local                  # Local environment (gitignored)
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── components.json             # shadcn/ui configuration
├── vercel.json                 # Vercel deployment config
└── package.json                # Project dependencies
```

---

## Database Schema

### 10 Prisma Models

| Model | Purpose |
|-------|---------|
| `User` | User accounts for authentication |
| `Account` | OAuth provider accounts (Google, GitHub) |
| `Session` | User session management |
| `VerificationToken` | Email verification tokens |
| `Biometrics` | User health data (gender, age, weight, height, activity, allergies, diabetes) |
| `Favorite` | Saved recipes per user |
| `WeightEntry` | Weight tracking history |
| `Recommendation` | Personalized recipe recommendations |
| `Recipe` | Master recipe catalog from Dapur Umami |

### Key Model: User

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Hashed with bcrypt
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  biometrics    Biometrics?
  favorites     Favorite[]
  weightEntries WeightEntry[]
  recommendations Recommendation[]
}
```

### Key Model: Biometrics

```prisma
model Biometrics {
  id             String   @id @default(cuid())
  userId         String   @unique
  gender         String   // "male" or "female"
  age            Int
  weight         Float    // in kg
  height         Float    // in cm
  activityLevel  String   // sedentary, lightly_active, etc.
  isDiabetic     Boolean  @default(false)
  allergies      String   // JSON string array of allergy types
  preferences    String   // JSON string array of ingredient preferences
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Key Model: Recipe

```prisma
model Recipe {
  id                 String   @id @default(cuid())
  title              String   @unique // nama masakan
  url                String   // URL original resep
  category           String?  // kategori masakan
  cookingTime        Int?     // waktu masak dalam menit
  portion            Int?     // jumlah porsi
  ingredients        String   // bahan-bahan (text)
  steps              String   // langkah-langkah (text)
  calories           Float?   // kalori (Kkal)
  protein            Float?   // protein (gram)
  carbs              Float?   // karbohidrat (gram)
  fat                Float?   // lemak (gram)
  imageUrl           String   // URL thumbnail
  dietType           String?  // Keto-Friendly, High-Protein, Low-Calories, Regular
  prepDifficulty     String?  // Easy, Medium, Hard
  estimatedCostLevel String?  // $, $$, $$$
  suitableFor        String?  // Breakfast, Main Course, Snack
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  favorites       Favorite[]
  recommendations Recommendation[]

  @@index([dietType])
  @@index([calories])
}
```

---

## Authentication System

### Configuration (`src/lib/auth.ts`)

- **Provider:** NextAuth.js 5.0.0-beta.30
- **Strategy:** JWT sessions
- **Method:** Credentials (email/password)
- **Security:** bcryptjs password hashing
- **Adapter:** Prisma Adapter
- **Sign-in Page:** `/login`

### Authentication Flow

```
1. User submits credentials (email + password)
        ↓
2. Server finds user in database
        ↓
3. Password verified with bcrypt.compare()
        ↓
4. JWT token created with user ID
        ↓
5. Session stored in browser (cookie)
        ↓
6. Protected routes check session validity
```

### Protected Routes

Route groups in Next.js App Router:
- `(guest)/` - Public pages (login, signup, onboarding)
- `(member)/` - Protected pages (dashboard, results)

Middleware checks session validity and redirects unauthenticated users.

---

## Health Calculations

### BMR (Basal Metabolic Rate)

**Mifflin-St Jeor Equation** - Most accurate formula for modern populations

**Male:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```

**Female:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
```

### TDEE (Total Daily Energy Expenditure)

```
TDEE = BMR × Activity Multiplier
```

| Activity Level | Multiplier | Description |
|----------------|------------|-------------|
| Sedentary | 1.2 | Rarely exercise |
| Lightly Active | 1.375 | Exercise 1-3 days/week |
| Moderately Active | 1.55 | Exercise 3-5 days/week |
| Very Active | 1.725 | Exercise 6-7 days/week |
| Extra Active | 1.9 | Exercise 2x per day |

### Calorie Target

```
Normal User:    Calorie Target = TDEE
Diabetic User:  Calorie Target = TDEE × 0.95 (5% deficit)
```

### Water Intake Target

```
Daily Water Target (ml) = Weight (kg) × 35
```

---

## Core Features

### 1. Onboarding System (4-Step Wizard)

**Location:** `src/components/onboarding/`

| Step | Data Collected |
|------|----------------|
| **1. Biometrics** | Gender, Age, Weight (kg), Height (cm) |
| **2. Lifestyle** | Activity Level (5 options) |
| **3. Health** | Diabetes toggle, Allergy selection (6 types) |
| **4. Food Preferences** | Protein sources (10 options), Dish types (11 options) |

**Allergy Types:**
- Telur (Eggs)
- Susu (Dairy)
- Kacang (Peanuts)
- Udang (Shrimp)
- Ikan (Fish)
- Gluten

### 2. Recipe Recommendation Engine

**Location:** `src/lib/recipe-utils.ts`

**Algorithms:**

#### Euclidean Distance
Calculates recipe similarity based on macros (protein, carbs, fat):

```typescript
distance = √(proteinDiff² + carbDiff² + fatDiff²)
```

#### K-Nearest Neighbors (KNN)
Finds recipes with similar protein but varying carb/fat profiles for the "Swap-It" feature.

#### Allergy Filtering
Filters recipes containing allergen keywords from the allergy map (`kamus_bahan.json`).

### 3. Dashboard Features

**Location:** `src/app/(member)/dashboard/page.tsx`

#### Metrics Cards
- BMR display
- TDEE display
- Daily calorie target

#### Bento Grid Widgets

| Widget | File | Function |
|--------|------|----------|
| **Intermittent Fasting Tracker** | `intermittent-fasting.tsx` | Timer for 16:8, 18:6, 20:4 protocols with circular progress |
| **Hydration Tracker** | `hydration-tracker.tsx` | Water intake logging with wave animation, personalized target |
| **Macro Balance Radar** | `macro-balance-radar.tsx` | Radar chart comparing favorite recipes' macros vs. targets |
| **Swap-It Recipe** | `swap-it.tsx` | Find alternative recipes with similar protein but different macros |
| **Random Discovery** | `swap-it.tsx` | Random recipe discovery with shuffle functionality |
| **Grocery List** | `grocery-list.tsx` | Generate shopping list from selected favorite recipes |

#### Charts
- **Weight History:** Line chart showing weight changes over time (Recharts)
- **Macro Balance:** Radar chart comparing protein, carbs, fat (Recharts)

### 4. Recipe Management

- Browse all 300+ recipes
- Filter by:
  - Diet Type (Keto, High-Protein, Low-Calories, Regular)
  - Prep Difficulty (Easy, Medium, Hard)
  - Cost Level ($, $$, $$$)
  - Meal Type (Breakfast, Main Course, Snack)
- Save/unsave favorites
- View detailed nutritional information

### 5. Weight Tracking

- Add weight entries with custom dates
- View historical data in line chart
- Track progress toward goals

### 6. Internationalization (i18n)

**Location:** `src/lib/i18n/`

**Supported Languages:**
- Indonesian (default)
- English

**Translation Categories:**
- `home` - Landing page content
- `onboarding` - Form labels and steps
- `auth` - Login/signup messages
- `results` - Results page text
- `dashboard` - Dashboard labels
- `common` - Shared UI text

---

## API Endpoints

### Authentication (3 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration with email/password |
| `POST` | `/api/auth/signout` | Sign out and clear session |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth.js handler |

### User Data (4 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/user/biometrics` | Get/set user biometrics |
| `GET/POST/DELETE` | `/api/user/favorites` | Manage favorite recipes |
| `GET/POST` | `/api/user/recommendations` | Get personalized recommendations |
| `GET/POST/DELETE` | `/api/user/weight` | Weight entries CRUD |

### Recipes (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recipes` | Get all recipes |
| `GET` | `/api/recipes/[title]` | Get single recipe by title |
| `GET` | `/api/recipes/recommendations` | Get personalized recommendations |
| `GET` | `/api/recipes/recommendations/high-protein` | Get high-protein recipes |
| `GET` | `/api/recipes/recommendations/low-cal-breakfast` | Get low-calorie breakfast recipes |
| `GET` | `/api/recipes/recommendations/quick-meals` | Get quick meal recipes |

---

## Recipe Dataset

### Source
Dapur Umami Indonesian Recipe Collection

### Total Recipes
300+ recipes

### Recipe Structure

| Field | Type | Description |
|-------|------|-------------|
| `nama-makanan` / `title` | String | Recipe name (unique identifier) |
| `url` | String | Original recipe URL |
| `category` | String | Recipe category |
| `cookingTime` | Int | Cooking time in minutes |
| `portion` | Int | Number of servings |
| `ingredients` | String | Ingredients list (text) |
| `steps` | String | Cooking steps (text) |
| `calories` / `kalori` | Float | Calories (Kkal) |
| `protein` | Float | Protein (grams) |
| `carbs` / `karbohidrat` | Float | Carbohydrates (grams) |
| `fat` / `lemak` | Float | Fat (grams) |
| `serat` | Float | Fiber (grams) |
| `imageUrl` | String | Recipe image URL |
| `dietType` | String | Keto-Friendly, High-Protein, Low-Calories, Regular |
| `prepDifficulty` | String | Easy, Medium, Hard |
| `estimatedCostLevel` | String | $, $$, $$$ |
| `suitableFor` | String | Breakfast, Main Course, Snack |

### Diet Types

- **Keto-Friendly** - Low carb, high fat
- **High-Protein** - High protein content
- **Low-Calories** - Calorie-restricted
- **Regular** - Standard recipes
- **Uncategorized** - Not yet classified

---

## Development Commands

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Create production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Database (Prisma)
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with recipes from CSV
npm run db:studio        # Open Prisma Studio (visual database editor)

# Git
git status               # Check git status
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to GitHub (triggers Vercel deploy)
```

### Environment Variables

Create `.env.local` based on `.env.example`:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"           # SQLite for local development
# For production: DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## Deployment

### Platform
**Vercel** - Automatic deployment on push to `main` branch

### Build Process

```
1. Push code to GitHub
        ↓
2. Vercel detects changes
        ↓
3. Runs: npm install
        ↓
4. Runs: prisma generate
        ↓
5. Runs: next build
        ↓
6. Deploys to production
        ↓
7. Live URL updated
```

### Deployment URLs

- **Production:** https://re-fit.vercel.app
- **Preview:** Auto-generated for each branch

### Build Output

```
Route (app)                                         Size     First Load JS
┌ ○ /                                               14.7 kB         145 kB
├ ○ /_not-found                                     876 B          88.4 kB
├ ƒ /api/auth/[...nextauth]                         0 B                0 B
├ ƒ /api/auth/register                              0 B                0 B
├ ƒ /api/user/biometrics                            0 B                0 B
├ ƒ /api/user/favorites                             0 B                0 B
├ ƒ /api/recipes                                    0 B                0 B
├ ○ /dashboard                                      69 kB           325 kB
├ ○ /login                                          7.14 kB         121 kB
├ ○ /onboarding                                     52.3 kB         195 kB
└ ○ /results                                        6.52 kB         254 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## Project Summary

**RE FIT** is a full-stack, production-ready personalized nutrition application that demonstrates:

✅ Complete authentication system with NextAuth.js  
✅ Complex health calculations (BMR, TDEE, calorie targets)  
✅ Recipe recommendation algorithms (Euclidean distance, KNN)  
✅ Real-time data visualization with Recharts  
✅ Responsive UI with modern design (Tailwind CSS + shadcn/ui)  
✅ Database design with Prisma ORM (10 models)  
✅ API development with Next.js App Router (13 endpoints)  
✅ Internationalization support (Indonesian/English)  
✅ Advanced features (intermittent fasting, hydration tracking, grocery lists)  
✅ Automatic deployment with Vercel CI/CD  

---

**Developed for:** Skripsi (Thesis) - Gunadarma University  
**Tech Stack:** Next.js 14, TypeScript, Prisma, PostgreSQL, Tailwind CSS  
**Status:** ✅ Production Ready - Deployed on Vercel
