# 📊 RE FIT Dashboard Documentation

## Overview

Dashboard adalah halaman utama untuk user yang sudah login. Halaman ini menampilkan ringkasan metrik kesehatan, fitur tracking, dan rekomendasi resep yang dipersonalisasi.

**Route:** `/dashboard`  
**Access:** Protected (requires authentication)  
**Layout:** Bento Grid Design dengan responsive design

---

## 🎯 Features

### 1. **Metrics Overview** (3 Cards)

Menampilkan 3 metrik utama yang dihitung berdasarkan biometri user:

| Metric | Description | Calculation |
|--------|-------------|-------------|
| **BMR** (Basal Metabolic Rate) | Kalori yang dibakar tubuh saat istirahat | Mifflin-St Jeor Equation |
| **TDEE** (Total Daily Energy Expenditure) | Total kalori yang dibakar per hari | BMR × Activity Multiplier |
| **Daily Calorie Target** | Target kalori harian untuk maintain/cut | TDEE (atau TDEE × 0.95 untuk diabetic) |

**Example:**
```
BMR: 1,523 calories/day
TDEE: 2,361 calories/day
Daily Target: 2,361 calories/day
```

---

### 2. **Bento Grid Widgets**

#### Row 1: Health Trackers

##### **Intermittent Fasting Tracker**
- **File:** `src/components/dashboard/intermittent-fasting.tsx`
- **Features:**
  - Timer untuk tracking fasting window
  - Pilihan protokol: 16:8, 18:6, 20:4
  - Circular progress indicator
  - Real-time countdown

**Usage:**
```typescript
<IntermittentFastingTracker />
```

##### **Hydration Tracker**
- **File:** `src/components/dashboard/hydration-tracker.tsx`
- **Features:**
  - Tracking asupan air harian
  - Target otomatis: weight (kg) × 35ml
  - Wave animation progress
  - Quick add buttons (+250ml, +500ml)

**Usage:**
```typescript
<HydrationTracker />
```

---

#### Row 2: Recipe Features

##### **Macro Balance Radar**
- **File:** `src/components/dashboard/macro-balance-radar.tsx`
- **Features:**
  - Radar chart perbandingan macros
  - Target vs Actual (dari favorite recipes)
  - Insight message otomatis

**Chart Data:**
- Protein (g)
- Carbohydrates (g)
- Fat (g)

**Usage:**
```typescript
<MacroBalanceRadar />
```

##### **Swap-It Recipe**
- **File:** `src/components/dashboard/swap-it.tsx`
- **Features:**
  - Cari alternatif resep dengan protein similar
  - Visual comparison bars (macros)
  - KNN algorithm untuk matching

**Usage:**
```typescript
<SwapItRecipe recipe={currentRecipe} />
```

##### **Random Discovery Menu**
- **File:** `src/components/dashboard/swap-it.tsx`
- **Features:**
  - Random recipe discovery
  - Shuffle button
  - Quick favorite toggle

**Usage:**
```typescript
<RandomDiscoveryMenu />
```

##### **Grocery List**
- **File:** `src/components/dashboard/grocery-list.tsx`
- **Features:**
  - Generate shopping list dari favorite recipes
  - Categorize ingredients otomatis
  - Checklist items

**Usage:**
```typescript
<GroceryList recipes={selectedRecipes} />
```

---

#### Row 3: Recipe Collections

##### **Recommended Recipes**
- **Source:** User's biometrics + preferences
- **Algorithm:** Euclidean distance + KNN
- **Count:** 9 recipes default
- **Component:** `RecipeGrid`

**API:** `GET /api/user/recommendations`

##### **Favorite Recipes**
- **Source:** User's saved recipes
- **Storage:** Database (table: `Favorite`)
- **Component:** `RecipeGrid`

**API:** `GET /api/user/favorites`

---

### 3. **Weight History Chart**

- **File:** `src/components/dashboard/weight-chart.tsx`
- **Type:** Line chart (Recharts)
- **Data Source:** `GET /api/user/weight`
- **Features:**
  - Time-series weight tracking
  - Trend line
  - Interactive tooltips

**Usage:**
```typescript
<WeightHistoryChart data={weightEntries} />
```

---

### 4. **User Profile Summary**

Menampilkan informasi biometri user:

| Field | Example |
|-------|---------|
| Gender | Male/Female |
| Age | 25 years |
| Weight | 70 kg |
| Height | 175 cm |
| Activity Level | Moderately Active |

---

## 🔌 API Integration

### Dashboard Data Flow

```
┌─────────────────────────────────────────┐
│          Dashboard Page Load            │
└───────────────┬─────────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
/api/user/   /api/user/   /api/
biometrics   favorites    recipes
    │           │           │
    └───────────┴───────────┘
                │
                ▼
        Display Dashboard
```

### Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/user/biometrics` | GET | Fetch user biometrics |
| `/api/user/favorites` | GET | Fetch favorite recipes |
| `/api/user/weight` | GET | Fetch weight history |
| `/api/user/recommendations` | GET | Fetch personalized recipes |
| `/api/recipes` | GET | Fetch all recipes (for explore) |

---

## 🎨 UI Components

### Layout Structure

```tsx
<div className="min-h-screen flex flex-col bg-background">
  {/* Header */}
  <header className="sticky top-0 z-40">
    {/* Logo, User Info, Logout */}
  </header>

  {/* Main Content */}
  <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
    {/* Metrics Cards (3 columns) */}
    <div className="grid gap-4 md:grid-cols-3">
      <BMRCard />
      <TDEECard />
      <CalorieTargetCard />
    </div>

    {/* Bento Grid (4 columns) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Row 1 */}
      <IntermittentFastingTracker />
      <HydrationTracker />
      
      {/* Row 2 */}
      <MacroBalanceRadar />
      <SwapItRecipe />
      <RandomDiscoveryMenu />
      <GroceryList />
    </div>

    {/* Recipe Sections */}
    <RecommendedRecipes />
    <FavoriteRecipes />
    
    {/* Weight Chart */}
    <WeightHistoryChart />
    
    {/* Profile Summary */}
    <UserProfileCard />
  </main>
</div>
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Columns | Layout |
|------------|---------|--------|
| Mobile (< 768px) | 1 | Single column stack |
| Tablet (768px - 1024px) | 2 | Two columns grid |
| Desktop (> 1024px) | 4 | Four columns bento grid |

---

## 🔄 State Management

### Zustand Store

**File:** `src/lib/store.ts`

```typescript
interface AppState {
  // Metrics
  metrics: CalculatedMetrics | null;
  
  // Recipes
  recommendations: Recipe[];
  favorites: Recipe[];
  
  // Weight
  weightHistory: { date: string; weight: number }[];
  
  // Actions
  setMetrics: (metrics) => void;
  addFavorite: (recipe) => void;
  removeFavorite: (recipeName) => void;
  addWeightEntry: (weight, date) => void;
}
```

**Usage:**
```typescript
import { useAppStore } from '@/lib/store';

const { favorites, addFavorite } = useAppStore();
```

---

## 🧮 Calculations

### BMR (Mifflin-St Jeor)

**Male:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```

**Female:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
```

### TDEE

```
TDEE = BMR × Activity Multiplier
```

| Activity Level | Multiplier |
|----------------|------------|
| Sedentary | 1.2 |
| Lightly Active | 1.375 |
| Moderately Active | 1.55 |
| Very Active | 1.725 |
| Extra Active | 1.9 |

### Calorie Target

```
Normal:    Calorie Target = TDEE
Diabetic:  Calorie Target = TDEE × 0.95
```

---

## 🐛 Troubleshooting

### Issue: Metrics Not Showing

**Cause:** Biometrics not set  
**Solution:** Redirect to `/onboarding`

```typescript
if (!biometrics) {
  return <OnboardingPrompt />;
}
```

### Issue: Recipes Not Loading

**Cause:** API error or empty database  
**Solution:** Check API response and database seed

```bash
# Verify database
npx ts-node prisma/debug-db.ts

# Check API
curl http://localhost:3000/api/recipes
```

### Issue: Images Not Loading

**Cause:** Domain not allowed  
**Solution:** Check `next.config.mjs` image config

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'assets.dapurumami.com',
    },
  ],
}
```

---

## 📊 Performance Optimization

### Client-Side Rendering

- Use `useEffect` for data fetching
- Implement loading states with skeletons
- Cache API responses with React Query (optional)

### Image Optimization

```tsx
<Image
  src={recipe.imageUrl}
  alt={recipe.title}
  fill
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Pagination

- Explore page: 24 recipes per page
- URL-based pagination: `?page=1`, `?page=2`

---

## 🔐 Security

### Protected Routes

Dashboard is protected by NextAuth middleware:

```typescript
// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### API Authentication

All API endpoints require valid session:

```typescript
// /api/user/favorites/route.ts
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## 📈 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Export weight data to CSV
- [ ] Meal planning calendar
- [ ] Recipe rating system
- [ ] Social sharing features
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)

---

## 📞 Support

For issues or questions:
1. Check `prisma/debug-db.ts` for database verification
2. Review API logs in Vercel dashboard
3. Inspect browser console for client-side errors

---

**Last Updated:** 2026-02-26  
**Version:** 1.0.0  
**Maintained by:** RE FIT Development Team
