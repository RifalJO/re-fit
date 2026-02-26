# RE FIT Dashboard Documentation

> **Main User Interface for Personalized Nutrition Management**

---

## Table of Contents

1. [Overview](#overview)
2. [Access & Authentication](#access--authentication)
3. [Layout Structure](#layout-structure)
4. [Header Component](#header-component)
5. [Metrics Cards](#metrics-cards)
6. [Bento Grid Features](#bento-grid-features)
7. [Weight History Chart](#weight-history-chart)
8. [Recipe Sections](#recipe-sections)
9. [Profile Summary](#profile-summary)
10. [Navigation Routes](#navigation-routes)
11. [Technical Implementation](#technical-implementation)

---

## Overview

The **Dashboard** is the central hub of the RE FIT application where users can:

- View their personalized health metrics (BMR, TDEE, calorie targets)
- Track daily nutrition goals (intermittent fasting, hydration, macros)
- Monitor weight progress over time
- Discover and manage recommended recipes
- Save and organize favorite recipes
- Generate grocery lists from favorite meals

**Location:** `src/app/(member)/dashboard/page.tsx`

**Route:** `/dashboard`

---

## Access & Authentication

### Protected Route

The dashboard is a **protected route** using Next.js route groups:

```
src/app/(member)/dashboard/
```

### Authentication Flow

| Step | Description |
|------|-------------|
| 1 | User session checked via `useSession()` hook |
| 2 | If `unauthenticated` → Redirect to `/login` |
| 3 | If `authenticated` → Load user data from database |
| 4 | If `loading` → Show loading spinner |

### Code Implementation

```typescript
const { data: session, status } = useSession();

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login");
    return;
  }

  if (status === "authenticated") {
    loadUserData();
  }
}, [status, router]);
```

---

## Layout Structure

The dashboard follows a **vertical stack layout** with the following sections:

```
┌─────────────────────────────────────────────────────┐
│                    HEADER                            │
│  Logo | User Info | Explore Button | Sign Out       │
├─────────────────────────────────────────────────────┤
│                 MOBILE EXPLORE BAR                   │
│         (Visible only on mobile devices)             │
├─────────────────────────────────────────────────────┤
│              METRICS CARDS (3 columns)               │
│    BMR Card  |  TDEE Card  |  Calorie Target Card   │
├─────────────────────────────────────────────────────┤
│                                                    │
│              BENTO GRID FEATURES                    │
│  ┌──────────────┬──────────────┐                   │
│  │   IF Tracker │  Hydration   │  (Row 1)          │
│  ├──────────────┴──────────────┤                   │
│  │      Macro Balance Radar     │  (Row 2)         │
│  ├──────────────┬──────────────┤                   │
│  │  Random Disc │   Swap-It    │  (Row 3)          │
│  ├──────────────┴──────────────┤                   │
│  │        Grocery List          │  (Row 4)         │
│  └─────────────────────────────┘                   │
├─────────────────────────────────────────────────────┤
│              WEIGHT HISTORY CHART                    │
│         (Line chart with Recharts)                  │
├─────────────────────────────────────────────────────┤
│           RECOMMENDED RECIPES SECTION                │
│         (Grid of recipe cards)                       │
├─────────────────────────────────────────────────────┤
│            FAVORITE RECIPES SECTION                  │
│         (Grid of saved recipes)                      │
├─────────────────────────────────────────────────────┤
│              PROFILE SUMMARY CARD                    │
│    Gender | Age | Weight | Height | Activity        │
├─────────────────────────────────────────────────────┤
│                    FOOTER                            │
│         © 2026 RE FIT. All rights reserved.          │
└─────────────────────────────────────────────────────┘
```

---

## Header Component

### Structure

```tsx
<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
  <div className="container mx-auto px-4 py-3">
    <div className="flex items-center justify-between">
      {/* Logo */}
      {/* User Info & Actions */}
    </div>
  </div>
</header>
```

### Components

| Element | Description | Icon |
|---------|-------------|------|
| **Logo** | Links to `/dashboard`, displays RE FIT branding | - |
| **Explore Button** | Navigate to full recipe catalog | `Utensils` |
| **User Info** | Display user name and email | - |
| **Sign Out** | Logout and redirect to home | `LogOut` |

### Responsive Behavior

- **Desktop:** All elements visible
- **Mobile:** Explore button moved to mobile-only bar below header

---

## Metrics Cards

Three cards displaying calculated health metrics based on user biometrics.

### Card 1: Basal Metabolic Rate (BMR)

| Property | Value |
|----------|-------|
| **Icon** | `Activity` |
| **Title** | Basal Metabolic Rate |
| **Value** | `metrics.BMR` (formatted number) |
| **Description** | "calories burned at rest" |

**Formula:** Mifflin-St Jeor Equation

```
Male:   BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
Female: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
```

### Card 2: Total Daily Energy Expenditure (TDEE)

| Property | Value |
|----------|-------|
| **Icon** | `TrendingUp` |
| **Title** | Total Daily Energy Expenditure |
| **Value** | `metrics.TDEE` (formatted number) |
| **Description** | "calories burned daily" |

**Formula:**

```
TDEE = BMR × Activity Multiplier
```

### Card 3: Daily Calorie Target

| Property | Value |
|----------|-------|
| **Icon** | `Utensils` |
| **Title** | Daily Calorie Target |
| **Value** | `metrics.calorieTarget` (formatted number) |
| **Description** | "recommended intake" |

**Formula:**

```
Normal User:    Calorie Target = TDEE
Diabetic User:  Calorie Target = TDEE × 0.95
```

### Layout

- **Desktop:** 3 columns (`md:grid-cols-3`)
- **Mobile:** Single column stack
- **Animation:** `animate-fade-in`

---

## Bento Grid Features

A modern bento-style grid layout showcasing interactive health tracking widgets.

### Grid Configuration

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Row 1: 2 columns each */}
  {/* Row 2: 4 columns (full width) */}
  {/* Row 3: 2 columns each */}
  {/* Row 4: 4 columns (full width) */}
</div>
```

### Feature 1: Intermittent Fasting Tracker

**Component:** `IntermittentFastingTracker`

**File:** `src/components/dashboard/intermittent-fasting.tsx`

| Property | Description |
|----------|-------------|
| **Position** | Row 1, Left (2 columns) |
| **Function** | Timer for intermittent fasting protocols |
| **Protocols** | 16:8, 18:6, 20:4 |
| **Features** | Start/stop timer, progress display, protocol selection |
| **Animation Delay** | 0s |

### Feature 2: Hydration Tracker

**Component:** `HydrationTracker`

**File:** `src/components/dashboard/hydration-tracker.tsx`

| Property | Description |
|----------|-------------|
| **Position** | Row 1, Right (2 columns) |
| **Function** | Daily water intake logging |
| **Target** | Weight × 35ml (personalized) |
| **Features** | Add/remove water, wave animation, progress indicator |
| **Animation Delay** | 0.1s |

### Feature 3: Macro Balance Radar

**Component:** `MacroBalanceRadar`

**File:** `src/components/dashboard/macro-balance-radar.tsx`

| Property | Description |
|----------|-------------|
| **Position** | Row 2, Full width (4 columns) |
| **Function** | Visualize macronutrient balance |
| **Chart Type** | Radar chart (Recharts) |
| **Metrics** | Protein, Carbohydrates, Fat |
| **Data Source** | User's favorite recipes |
| **Animation Delay** | 0.2s |

### Feature 4: Random Discovery Menu

**Component:** `RandomDiscoveryMenu`

**File:** `src/components/dashboard/swap-it.tsx`

| Property | Description |
|----------|-------------|
| **Position** | Row 3, Left (2 columns) |
| **Function** | Discover random recipes |
| **Features** | Shuffle button, recipe preview, quick view |
| **Animation Delay** | 0.3s |

### Feature 5: Swap-It Recipe

**Component:** `SwapItRecipe`

**File:** `src/components/dashboard/swap-it.tsx`

| Property | Description |
|----------|-------------|
| **Position** | Row 3, Right (2 columns) |
| **Function** | Find recipe alternatives |
| **Algorithm** | K-Nearest Neighbors (KNN) |
| **Criteria** | Similar protein, different carbs/fat |
| **Data Source** | First favorite recipe |
| **Animation Delay** | 0.4s |
| **Condition** | Only shown if user has favorites |

### Feature 6: Grocery List

**Component:** `GroceryList`

**File:** `src/components/dashboard/grocery-list.tsx`

| Property | Description |
|----------|-------------|
| **Position** | Row 4, Full width (4 columns) |
| **Function** | Generate shopping list |
| **Features** | Select favorites, extract ingredients, checklist |
| **Animation Delay** | 0.5s |

---

## Weight History Chart

A line chart visualizing user's weight progression over time.

### Component

```tsx
<Card>
  <CardHeader>
    <CardTitle>Weight History</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={weightHistory}>
        {/* Chart configuration */}
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

### Chart Configuration

| Property | Value |
|----------|-------|
| **Chart Type** | Line Chart |
| **Library** | Recharts |
| **Height** | 300px |
| **X-Axis** | Date (formatted as locale date) |
| **Y-Axis** | Weight (kg) |
| **Data Key** | `weight` |
| **Stroke Color** | `hsl(var(--primary))` |
| **Dot Style** | Filled circle |

### Data Format

```typescript
interface WeightEntry {
  date: string;  // ISO date string
  weight: number; // in kg
}
```

### Empty State

If no weight entries exist:

```tsx
<div className="h-[200px] flex items-center justify-center text-muted-foreground">
  No weight history yet. Start tracking your progress!
</div>
```

---

## Recipe Sections

### Section 1: Recommended For You

Displays personalized recipe recommendations based on user biometrics and preferences.

#### Data Source

- **API:** `/api/user/recommendations`
- **Algorithm:** Euclidean distance matching
- **Count:** Variable (based on recommendations)

#### Features

| Feature | Description |
|---------|-------------|
| **Recipe Grid** | Display recipes in responsive grid |
| **Favorite Toggle** | Save/unsave recipes |
| **Recipe Count** | Display total recommendations |
| **Empty State** | Show onboarding CTA if no recommendations |

#### Empty State

```tsx
<Card>
  <CardContent className="pt-6">
    <div className="text-center py-8 text-muted-foreground">
      <Utensils className="h-12 w-12 mx-auto mb-4 opacity-20" />
      <p>No recommendations yet</p>
      <p className="text-sm">
        Complete the onboarding to get personalized recipe recommendations
      </p>
      <Button asChild className="mt-4">
        <Link href="/onboarding">Start Onboarding</Link>
      </Button>
    </div>
  </CardContent>
</Card>
```

### Section 2: Favorite Recipes

Displays user's saved recipes for quick access.

#### Data Source

- **API:** `/api/user/favorites`
- **Storage:** Database + Zustand store
- **Count:** Unlimited

#### Features

| Feature | Description |
|---------|-------------|
| **Recipe Grid** | Display saved recipes |
| **Remove from Favorites** | Unsave recipes |
| **Favorite Count** | Display total saved recipes |
| **Empty State** | Show message if no favorites |

#### Empty State

```tsx
<Card>
  <CardContent className="pt-6">
    <div className="text-center py-8 text-muted-foreground">
      <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
      <p>No favorite recipes yet</p>
      <p className="text-sm">
        Save recipes from your recommendations to see them here
      </p>
    </div>
  </CardContent>
</Card>
```

### Recipe Grid Component

**Component:** `RecipeGrid`

**File:** `src/components/recipes/recipe-grid.tsx`

#### Props

```typescript
interface RecipeGridProps {
  recipes: Recipe[];
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
}
```

---

## Profile Summary

A card displaying user's biometric information.

### Displayed Information

| Field | Format | Example |
|-------|--------|---------|
| **Gender** | Capitalized | "Male" / "Female" |
| **Age** | Number + "years" | "25 years" |
| **Weight** | Number + "kg" | "70 kg" |
| **Height** | Number + "cm" | "175 cm" |
| **Activity** | Formatted (underscores → spaces) | "Moderately Active" |

### Layout

- **Desktop:** 5 columns (`md:grid-cols-5`)
- **Mobile:** 2 columns (`grid-cols-2`)

### Data Source

- **API:** `/api/user/biometrics`
- **Store:** Zustand `biometrics` state

---

## Navigation Routes

### Internal Links

| Link | Destination | Component |
|------|-------------|-----------|
| `/dashboard` | Dashboard home | Logo |
| `/dashboard/explore` | All recipes | Explore button |
| `/dashboard/recipes/[title]` | Recipe detail | Recipe card click |
| `/onboarding` | Onboarding form | Empty state CTA |
| `/` | Home page | Sign out redirect |

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/user/biometrics` | GET | Load user biometrics |
| `/api/user/favorites` | GET/POST/DELETE | Manage favorites |
| `/api/user/weight` | GET/POST | Load/add weight entries |
| `/api/user/recommendations` | GET | Load recommendations |

---

## Technical Implementation

### State Management

**Library:** Zustand

**Store:** `useAppStore`

#### State Variables

```typescript
const {
  biometrics,           // User health data
  metrics,              // Calculated BMR/TDEE/calories
  favorites,            // Saved recipes
  weightHistory,        // Weight entries
  recommendations,      // Recommended recipes
  setBiometrics,        // Set biometrics
  setMetrics,           // Set metrics
  removeFavorite,       // Remove favorite
  addFavorite,          // Add favorite
  addWeightEntry,       // Add weight
  setRecommendations,   // Set recommendations
} = useAppStore();
```

### Data Loading Sequence

```typescript
async function loadUserData() {
  // 1. Load biometrics
  const bioRes = await fetch("/api/user/biometrics");
  const bioData = await bioRes.json();
  setBiometrics(localBio);
  setMetrics(calculatedMetrics);

  // 2. Load favorites
  const favRes = await fetch("/api/user/favorites");
  const favData = await favRes.json();

  // 3. Load weight history
  const weightRes = await fetch("/api/user/weight");
  const weightData = await weightRes.json();

  // 4. Load recommendations
  const recRes = await fetch("/api/user/recommendations");
  const recData = await recRes.json();
  setRecommendations(recipeRecs);
}
```

### Favorite Toggle Implementation

```typescript
const handleToggleFavorite = async (recipe: Recipe) => {
  const recipeName = recipe["nama-makanan"] || recipe.title || "";
  if (!recipeName) return;

  const isFavorite = favorites.some(
    (f) => (f["nama-makanan"] || f.title) === recipeName
  );

  if (isFavorite) {
    // Remove from favorites
    removeFavorite(recipeName);
    await fetch(`/api/user/favorites?recipeId=${recipeName}`, {
      method: "DELETE",
    });
  } else {
    // Add to favorites
    addFavorite(recipe);
    await fetch("/api/user/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipeId: recipeName,
        name: recipeName,
        kalori: recipe.kalori || 0,
        protein: recipe.protein || 0,
        karbohidrat: recipe.karbohidrat || 0,
        lemak: recipe.lemak || 0,
        serat: recipe.serat || 0,
        link: recipe.link || "",
      }),
    });
  }
};
```

### Responsive Design

#### Breakpoints

| Breakpoint | Width | Layout Change |
|------------|-------|---------------|
| `md` | 768px | 3-column metrics, 2-column bento |
| `lg` | 1024px | 4-column bento grid |

#### Mobile-Only Elements

```tsx
{/* Mobile Explore Bar */}
<div className="md:hidden flex animate-fade-in">
  <Button asChild className="w-full">
    <Link href="/dashboard/explore">
      <Utensils className="h-4 w-4 mr-2" />
      Explore All Recipes
    </Link>
  </Button>
</div>
```

### Animations

| Animation | Usage |
|-----------|-------|
| `animate-fade-in` | Metrics cards, mobile explore bar |
| `animate-scale-in` | Bento grid items (staggered delays) |
| `card-hover` | Card hover effects |

### Loading State

```tsx
if (status === "loading" || loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}
```

### Utilities Used

| Utility | File | Purpose |
|---------|------|---------|
| `formatNumber` | `src/lib/utils.ts` | Format metric numbers |
| `cn` | `src/lib/utils.ts` | Class name merging |

---

## Summary

The RE FIT Dashboard is a **comprehensive, responsive, and interactive** nutrition management interface that combines:

✅ **Real-time health metrics** (BMR, TDEE, calorie targets)
✅ **Interactive tracking widgets** (IF, hydration, macros)
✅ **Data visualization** (weight history chart, macro radar)
✅ **Recipe management** (recommendations, favorites, grocery lists)
✅ **Responsive design** (mobile-first, adaptive layouts)
✅ **Smooth animations** (fade-in, scale-in, hover effects)
✅ **Efficient data loading** (parallel API calls, Zustand state)

**File:** `src/app/(member)/dashboard/page.tsx`
**Route:** `/dashboard`
**Status:** ✅ Production Ready

---

**Last Updated:** February 26, 2026
**Version:** 1.0
