"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RecipeGrid } from "@/components/recipes";
import { useAppStore, filterRecipesByAllergies, getRecommendedRecipes } from "@/lib/store";
import { loadRecipes, loadAllergyMap } from "@/lib/data";
import { filterRecipesByIngredients } from "@/lib/ingredients";
import type { Recipe } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const hasBiometrics = useAppStore((state) => !!state.biometrics);

  // Redirect to dashboard ONLY if user is authenticated (logged in)
  // Do NOT redirect guest users who just completed onboarding
  useEffect(() => {
    // Only redirect if session is confirmed authenticated
    if (status === "authenticated" && hasBiometrics) {
      router.push("/dashboard");
    }
  }, [status, hasBiometrics, router]);

  const {
    metrics,
    healthConstraints,
    foodPreferences,
    recommendations,
    setRecommendations,
    favorites,
    addFavorite,
    removeFavorite,
  } = useAppStore();

  useEffect(() => {
    async function loadData() {
      try {
        const [recipes, allergyData] = await Promise.all([
          loadRecipes(),
          loadAllergyMap(),
        ]);

        // If no recommendations yet, calculate them
        if (recommendations.length === 0 && metrics) {
          // First filter by allergies
          let filtered = filterRecipesByAllergies(
            recipes,
            healthConstraints?.allergies || [],
            allergyData as unknown as Record<string, string[]>
          );

          // Then filter by food preferences (if any selected)
          if (foodPreferences?.preferredIngredients && foodPreferences.preferredIngredients.length > 0) {
            const preferenceFiltered = filterRecipesByIngredients(
              filtered,
              foodPreferences.preferredIngredients
            );
            // Only use preference filtered if we have results, otherwise fall back to allergy filtered
            if (preferenceFiltered.length > 0) {
              filtered = preferenceFiltered;
            }
          }

          const recommended = getRecommendedRecipes(
            filtered,
            metrics.calorieTarget / 3, // Target per meal (assuming 3 meals)
            9
          );

          setRecommendations(recommended);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, healthConstraints, recommendations.length, setRecommendations, foodPreferences?.preferredIngredients]);

  const handleToggleFavorite = (recipe: Recipe) => {
    const isFavorite = favorites.some(
      (f) => f["nama-makanan"] === recipe["nama-makanan"]
    );

    if (isFavorite) {
      removeFavorite(recipe["nama-makanan"]);
    } else {
      addFavorite(recipe);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (!metrics || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">No Recommendations Yet</h2>
          <p className="text-muted-foreground">
            Please complete the onboarding form to get personalized recipe recommendations.
          </p>
          <Button asChild>
            <Link href="/onboarding">Start Onboarding</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/onboarding">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="RE FIT Logo" width={200} height={70} className="h-16 w-auto object-contain" />
          </Link>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Metrics Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">BMR</p>
                <p className="text-2xl font-bold text-primary">{metrics.BMR}</p>
                <p className="text-xs text-muted-foreground">calories/day</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TDEE</p>
                <p className="text-2xl font-bold text-primary">{metrics.TDEE}</p>
                <p className="text-xs text-muted-foreground">calories/day</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Target</p>
                <p className="text-2xl font-bold text-primary">{metrics.calorieTarget}</p>
                <p className="text-xs text-muted-foreground">calories/day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <p className="text-muted-foreground">
                {recommendations.length} recipes tailored to your nutritional needs
              </p>
            </div>
          </div>

          <RecipeGrid
            recipes={recommendations}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {/* CTA for Account Creation */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Want to track your progress?
                </h3>
                <p className="text-muted-foreground">
                  Create an account to save your favorite recipes, track your weight over time,
                  and get even more personalized recommendations.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link href="/signup?from=results">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col items-center space-y-4">
          <Image src="/logo.png" alt="RE FIT Logo" width={100} height={35} className="h-8 w-auto opacity-80" />
          <p className="text-sm text-muted-foreground">Recipes sourced from Dapur Umami</p>
        </div>
      </footer>
    </div>
  );
}
