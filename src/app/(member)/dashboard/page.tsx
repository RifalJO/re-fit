"use client";

import { useEffect, useState, useCallback } from "react";
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
import {
  Heart,
  TrendingUp,
  Activity,
  Utensils,
  LogOut,
  Plus,
  Droplets,
  Timer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Flame,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeCard } from "@/components/recipes/recipe-card";
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
import { motion } from "framer-motion";

// Types
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

// Skeleton Components
function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Mini Components for Smart Summary
function MiniProgressCard({
  icon: Icon,
  title,
  value,
  target,
  unit,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: number;
  target: number;
  unit: string;
  color: string;
}) {
  const percentage = Math.min(Math.round((value / target) * 100), 100);

  return (
    <motion.div
      variants={scaleInVariants}
      className="relative overflow-hidden rounded-2xl bg-card p-4 shadow-sm border border-border/50"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full blur-2xl -mr-8 -mt-8`} />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{title}</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {formatNumber(value)}
            <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>
          </div>
          <p className="text-xs text-muted-foreground">of {formatNumber(target)}{unit} target</p>
        </div>
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground text-right">{percentage}%</p>
      </div>
    </motion.div>
  );
}

function WeightSparkline({ data }: { data: { date: string; weight: number }[] }) {
  if (data.length === 0) return null;

  const recentData = data.slice(-7);
  const minWeight = Math.min(...recentData.map((d) => d.weight));
  const maxWeight = Math.max(...recentData.map((d) => d.weight));
  const range = maxWeight - minWeight || 1;

  const points = recentData
    .map((d, i) => {
      const x = (i / (recentData.length - 1)) * 100;
      const y = 100 - ((d.weight - minWeight) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const trend = recentData.length >= 2
    ? recentData[recentData.length - 1].weight - recentData[0].weight
    : 0;

  return (
    <motion.div
      variants={scaleInVariants}
      className="relative overflow-hidden rounded-2xl bg-card p-4 shadow-sm border border-border/50"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-5 rounded-full blur-2xl -mr-8 -mt-8" />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Weight Trend</span>
          </div>
          <span className={`text-xs font-medium ${trend < 0 ? "text-green-600" : trend > 0 ? "text-red-600" : "text-muted-foreground"}`}>
            {trend < 0 ? "↓" : trend > 0 ? "↑" : "→"} {Math.abs(trend).toFixed(1)}kg
          </span>
        </div>
        <div className="h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              points={points}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Last 7 entries • {recentData[recentData.length - 1]?.weight.toFixed(1)}kg current
        </p>
      </div>
    </motion.div>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [macroExpanded, setMacroExpanded] = useState(false);

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

  // Hydration state (lifted from tracker for summary)
  const [hydrationProgress, setHydrationProgress] = useState(0);

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
      }

      // Load weight history
      const weightRes = await fetch("/api/user/weight");
      const weightData = await weightRes.json();

      if (weightData.weightEntries) {
        const dbWeights = weightData.weightEntries as DbWeightEntry[];
        dbWeights.forEach((entry: DbWeightEntry) => {
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

  // Hydration update handler
  const handleHydrationUpdate = useCallback((current: number, target: number) => {
    setHydrationProgress(Math.round((current / target) * 100));
  }, []);

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

  // Quick actions for mobile FAB
  const handleQuickAddWeight = () => {
    const weight = prompt("Enter your weight (kg):");
    if (weight && !isNaN(Number(weight))) {
      addWeightEntry(Number(weight), new Date().toISOString().split("T")[0]);
    }
  };

  const handleQuickAddWater = () => {
    // This would ideally open a modal, but for simplicity we'll just add 250ml
    // In production, create a proper modal component
    const event = new CustomEvent("quick-add-water", { detail: { amount: 250 } });
    window.dispatchEvent(event);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header Skeleton */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-12 w-32" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Skeleton */}
        <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          <MetricsSkeleton />
          <SectionSkeleton title="Recommended For You" />
        </main>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      {/* ==================== HEADER ==================== */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="RE FIT Logo" width={200} height={70} className="h-16 w-auto object-contain" />
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild className="hidden md:flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                <Link href="/dashboard/explore">
                  <Utensils className="h-4 w-4" />
                  Explore Recipes
                </Link>
              </Button>
              <div className="text-sm text-muted-foreground text-right hidden sm:block">
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
                className="hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Mobile Explore Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden"
        >
          <Button asChild className="w-full shadow-md">
            <Link href="/dashboard/explore" className="flex items-center justify-center gap-2">
              <Utensils className="h-4 w-4" />
              Explore All Recipes
            </Link>
          </Button>
        </motion.div>

        {/* ==================== 1. SMART SUMMARY SECTION (Sticky) ==================== */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="sticky top-[73px] z-40 bg-background/80 backdrop-blur-sm -mx-4 px-4 py-4 md:static md:mx-0 md:px-0"
        >
          <div className="space-y-4">
            {/* Greeting & Calorie Target */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"},{" "}
                        <span className="font-semibold text-foreground">{session.user?.name?.split(" ")[0] || "there"}</span>!
                      </p>
                      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Ready to fuel your body?
                      </h1>
                    </div>
                    <div className="hidden md:block">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Calorie Target Highlight */}
                  {metrics && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border border-primary/20"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Flame className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Daily Calorie Target</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-bold text-primary">
                          {formatNumber(metrics.calorieTarget)}
                        </span>
                        <span className="text-lg text-muted-foreground">kcal</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on your BMR ({formatNumber(metrics.BMR)} kcal) and activity level
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Mini Progress Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics && (
                <MiniProgressCard
                  icon={Target}
                  title="Calories"
                  value={0}
                  target={metrics.calorieTarget}
                  unit=" kcal"
                  color="bg-primary"
                />
              )}
              <MiniProgressCard
                icon={Droplets}
                title="Hydration"
                value={hydrationProgress}
                target={100}
                unit="%"
                color="bg-blue-500"
              />
              <MiniProgressCard
                icon={Timer}
                title="Fasting"
                value={0}
                target={16}
                unit=" hrs"
                color="bg-purple-500"
              />
              {weightHistory.length > 0 && (
                <WeightSparkline data={weightHistory} />
              )}
            </div>
          </div>
        </motion.section>

        {/* ==================== 2. DAILY TRACKING SECTION ==================== */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Daily Tracking</h2>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div variants={scaleInVariants}>
              <IntermittentFastingTracker />
            </motion.div>
            <motion.div variants={scaleInVariants}>
              <HydrationTracker onHydrationUpdate={handleHydrationUpdate} />
            </motion.div>
          </div>
        </motion.section>

        {/* ==================== 3. PROGRESS & INSIGHTS SECTION ==================== */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Progress & Insights</h2>
            </div>
          </motion.div>

          {/* Weight History Chart - Full Width */}
          <motion.div variants={scaleInVariants}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Weight Journey</CardTitle>
              </CardHeader>
              <CardContent>
                {weightHistory.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weightHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          labelFormatter={(label) =>
                            new Date(label).toLocaleDateString()
                          }
                          formatter={(value) => [`${value} kg`, "Weight"]}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid hsl(var(--border))",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm">No weight entries yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start tracking to see your progress</p>
                    <Button
                      onClick={handleQuickAddWeight}
                      variant="outline"
                      size="sm"
                      className="mt-3"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Weight
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Macro Balance Radar - Collapsible */}
          <motion.div variants={scaleInVariants}>
            <Card className="shadow-sm">
              <CardHeader className="cursor-pointer" onClick={() => setMacroExpanded(!macroExpanded)}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Macro Balance Analysis
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-8">
                    {macroExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {macroExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <CardContent>
                    <MacroBalanceRadar />
                  </CardContent>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </motion.section>

        {/* ==================== 4. RECIPE EXPERIENCE SECTION ==================== */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Recommended Recipes */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Recommended For You</h2>
              </div>
              {recommendations.length > 0 && (
                <span className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
                  {recommendations.length} recipes
                </span>
              )}
            </div>

            {recommendations.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.slice(0, 6).map((recipe, index) => (
                  <motion.div
                    key={recipe["nama-makanan"]}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecipeCard
                      recipe={recipe}
                      showChart={false}
                      isFavorite={favorites.some((f) => (f["nama-makanan"] || f.title) === recipe["nama-makanan"])}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Utensils className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium">No recommendations yet</p>
                    <p className="text-sm mt-1">
                      Complete the onboarding to get personalized recipe recommendations
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/onboarding">Start Onboarding</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Favorite Recipes */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-bold">Favorite Recipes</h2>
              </div>
              {favorites.length > 0 && (
                <span className="text-sm text-muted-foreground bg-red-500/10 px-3 py-1 rounded-full">
                  {favorites.length} saved
                </span>
              )}
            </div>

            {favorites.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.slice(0, 6).map((recipe, index) => (
                  <motion.div
                    key={recipe["nama-makanan"]}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecipeCard
                      recipe={recipe}
                      showChart={false}
                      isFavorite={true}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                      <Heart className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="font-medium">No favorite recipes yet</p>
                    <p className="text-sm mt-1">
                      Save recipes from your recommendations to see them here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Bento Grid - Additional Features */}
          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <RandomDiscoveryMenu />
            </motion.div>
            {favorites.length > 0 && (
              <motion.div
                variants={scaleInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <SwapItRecipe recipe={favorites[0]} />
              </motion.div>
            )}
          </div>

          {/* Grocery List - Full Width */}
          <motion.div
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <GroceryList />
          </motion.div>
        </motion.section>

        {/* ==================== PROFILE SUMMARY ==================== */}
        {biometrics && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Gender</p>
                      <p className="font-semibold capitalize">{biometrics.gender}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Age</p>
                      <p className="font-semibold">{biometrics.age} years</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Weight</p>
                      <p className="font-semibold">{biometrics.weight} kg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Height</p>
                      <p className="font-semibold">{biometrics.height} cm</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Activity</p>
                      <p className="font-semibold capitalize text-sm">
                        {biometrics.activityLevel.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>
        )}
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t py-6 bg-background/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 RE FIT. Your personalized nutrition partner.</p>
        </div>
      </footer>

      {/* ==================== MOBILE FLOATING ACTION BUTTON ==================== */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleQuickAddWater}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600"
            >
              <Droplets className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleQuickAddWeight}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
