"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { Heart, TrendingUp, Activity, Utensils, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeGrid } from "@/components/recipes";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import {
  IntermittentFastingTracker,
  HydrationTracker,
  MacroBalanceRadar,
  SwapItRecipe,
  RandomDiscoveryMenu,
  GroceryList,
} from "@/components/dashboard";
import type { Recipe } from "@/types";

interface DbWeightEntry {
  id: string;
  weight: number;
  date: string;
}

interface DbBiometrics {
  gender: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  isDiabetic: boolean;
  allergies: string;
  preferences: string;
}

interface DbRecommendation {
  recipeId: string;
  name: string;
  kalori: number;
  protein: number;
  karbohidrat: number;
  lemak: number;
  serat: number;
  link: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    biometrics,
    metrics,
    favorites,
    weightHistory,
    recommendations,
    setBiometrics,
    setMetrics,
    removeFavorite,
    addFavorite,
    addWeightEntry,
    setRecommendations,
  } = useAppStore();

  // Load user data from database on mount
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  async function loadUserData() {
    try {
      // Load biometrics
      const bioRes = await fetch("/api/user/biometrics");
      const bioData = await bioRes.json();

      if (bioData.biometrics) {
        const dbBio = bioData.biometrics as DbBiometrics;
        const localBio = {
          gender: dbBio.gender as "male" | "female",
          age: dbBio.age,
          weight: dbBio.weight,
          height: dbBio.height,
          activityLevel: dbBio.activityLevel as import("@/types").ActivityLevel,
        };
        setBiometrics(localBio);

        // Recalculate metrics
        let BMR = 10 * dbBio.weight + 6.25 * dbBio.height - 5 * dbBio.age;
        BMR += dbBio.gender === "male" ? 5 : -161;
        const activityMultipliers: Record<string, number> = {
          sedentary: 1.2,
          lightly_active: 1.375,
          moderately_active: 1.55,
          very_active: 1.725,
          extra_active: 1.9,
        };
        const TDEE = BMR * (activityMultipliers[dbBio.activityLevel] || 1.2);
        const calorieTarget = dbBio.isDiabetic ? TDEE * 0.95 : TDEE;

        setMetrics({
          BMR: Math.round(BMR),
          TDEE: Math.round(TDEE),
          calorieTarget: Math.round(calorieTarget),
        });
      }

      // Load favorites
      const favRes = await fetch("/api/user/favorites");
      const favData = await favRes.json();

      if (favData.favorites) {
        // Favorites are loaded but not converted to local store format
        // The dashboard will show them from the database directly
      }

      // Load weight history
      const weightRes = await fetch("/api/user/weight");
      const weightData = await weightRes.json();

      if (weightData.weightEntries) {
        const dbWeights = weightData.weightEntries as DbWeightEntry[];
        // Load into store
        dbWeights.forEach((entry: DbWeightEntry) => {
          // Only add if not already in store
          const exists = weightHistory.some(
            (w) => w.date === entry.date.split("T")[0]
          );
          if (!exists) {
            addWeightEntry(entry.weight, entry.date);
          }
        });
      }

      // Load recommendations
      const recRes = await fetch("/api/user/recommendations");
      const recData = await recRes.json();

      if (recData.recommendations && recData.recommendations.length > 0) {
        const dbRecs = recData.recommendations as DbRecommendation[];
        // Convert to Recipe format
        const recipeRecs = dbRecs.map((rec) => ({
          "nama-makanan": rec.name,
          kalori: rec.kalori,
          protein: rec.protein,
          karbohidrat: rec.karbohidrat,
          lemak: rec.lemak,
          serat: rec.serat,
          link: rec.link,
        }));
        setRecommendations(recipeRecs);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleFavorite = async (recipe: Recipe) => {
    const recipeName = recipe["nama-makanan"] || recipe.title || "";
    if (!recipeName) return;

    const isFavorite = favorites.some(
      (f) => (f["nama-makanan"] || f.title) === recipeName
    );

    if (isFavorite) {
      removeFavorite(recipeName);
      await fetch(`/api/user/favorites?recipeId=${recipeName}`, {
        method: "DELETE",
      });
    } else {
      addFavorite(recipe);
      await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipeName,
          name: recipeName,
          kalori: recipe.kalori || recipe.calories || 0,
          protein: recipe.protein || 0,
          karbohidrat: recipe.karbohidrat || recipe.carbs || 0,
          lemak: recipe.lemak || recipe.fat || 0,
          serat: recipe.serat || 0,
          link: recipe.link || recipe.url || "",
        }),
      });
    }
  };

  const handleToggleRecommendationFavorite = async (recipe: Recipe) => {
    const recipeName = recipe["nama-makanan"] || recipe.title || "";
    if (!recipeName) return;

    const isFavorite = favorites.some(
      (f) => (f["nama-makanan"] || f.title) === recipeName
    );

    if (isFavorite) {
      removeFavorite(recipeName);
      await fetch(`/api/user/favorites?recipeId=${recipeName}`, {
        method: "DELETE",
      });
    } else {
      addFavorite(recipe);
      await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipeName,
          name: recipeName,
          kalori: recipe.kalori || recipe.calories || 0,
          protein: recipe.protein || 0,
          karbohidrat: recipe.karbohidrat || recipe.carbs || 0,
          lemak: recipe.lemak || recipe.fat || 0,
          serat: recipe.serat || 0,
          link: recipe.link || recipe.url || "",
        }),
      });
    }
  };

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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="RE FIT Logo" width={200} height={70} className="h-16 w-auto object-contain" />
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild className="hidden md:flex">
                <Link href="/dashboard/explore" className="flex items-center">
                  <Utensils className="h-4 w-4 mr-2" />
                  Explore All Recipes
                </Link>
              </Button>
              <div className="text-sm text-muted-foreground text-right">
                <p className="font-medium text-foreground">{session.user?.name || session.user?.email}</p>
                <p className="text-xs">{session.user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  signOut({ callbackUrl: "/" });
                }}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="md:hidden flex animate-fade-in">
          <Button asChild className="w-full flex items-center justify-center shadow-md">
            <Link href="/dashboard/explore">
              <Utensils className="h-4 w-4 mr-2" />
              Explore All Recipes
            </Link>
          </Button>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Basal Metabolic Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.BMR)}</div>
                <p className="text-xs text-muted-foreground">
                  calories burned at rest
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Daily Energy Expenditure
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.TDEE)}</div>
                <p className="text-xs text-muted-foreground">
                  calories burned daily
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Daily Calorie Target
                </CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.calorieTarget)}</div>
                <p className="text-xs text-muted-foreground">
                  recommended intake
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bento Grid - New Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Row 1: IF Tracker & Hydration */}
          <div className="lg:col-span-2 animate-scale-in">
            <IntermittentFastingTracker />
          </div>
          <div className="lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <HydrationTracker />
          </div>

          {/* Row 2: Macro Balance - Full width */}
          <div className="lg:col-span-4 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <MacroBalanceRadar />
          </div>

          {/* Row 3: Random Discovery & Swap-It */}
          <div className="lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <RandomDiscoveryMenu />
          </div>
          {favorites.length > 0 && (
            <div className="lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <SwapItRecipe recipe={favorites[0]} />
            </div>
          )}

          {/* Row 4: Grocery List - Full width */}
          <div className="lg:col-span-4 animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <GroceryList />
          </div>
        </div>

        {/* Weight History Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weight History</CardTitle>
          </CardHeader>
          <CardContent>
            {weightHistory.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString()
                      }
                      formatter={(value) => [`${value} kg`, "Weight"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No weight history yet. Start tracking your progress!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Recipes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recommended For You</h2>
            {recommendations.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {recommendations.length} recipes
              </span>
            )}
          </div>

          {recommendations.length > 0 ? (
            <RecipeGrid
              recipes={recommendations}
              favorites={favorites}
              onToggleFavorite={handleToggleRecommendationFavorite}
            />
          ) : (
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
          )}
        </div>

        {/* Favorite Recipes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Favorite Recipes</h2>
            {favorites.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {favorites.length} saved recipes
              </span>
            )}
          </div>

          {favorites.length > 0 ? (
            <RecipeGrid
              recipes={favorites}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
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
          )}
        </div>

        {/* Biometrics Summary */}
        {biometrics && (
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{biometrics.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{biometrics.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{biometrics.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-medium">{biometrics.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Activity</p>
                  <p className="font-medium capitalize">
                    {biometrics.activityLevel.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 RE FIT. Your personalized nutrition partner.</p>
        </div>
      </footer>
    </div>
  );
}
