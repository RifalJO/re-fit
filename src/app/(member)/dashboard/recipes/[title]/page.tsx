"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Clock, Users, TrendingUp, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InteractiveCookingMode } from "@/components/recipes/interactive-cooking-mode";
import { TargetVsRecipeRadar } from "@/components/recipes/target-vs-recipe-radar";
import { useAppStore } from "@/lib/store";
import type { Recipe } from "@/types";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { title } = params;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCookingMode, setShowCookingMode] = useState(false);

  const { metrics, favorites, addFavorite, removeFavorite } = useAppStore();

  useEffect(() => {
    if (title) {
      fetchRecipe(decodeURIComponent(title as string));
    }
  }, [title]);

  const fetchRecipe = async (recipeTitle: string) => {
    try {
      const response = await fetch(`/api/recipes?search=${encodeURIComponent(recipeTitle)}`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        // Find exact match or closest match
        const foundRecipe = data.data.find(
          (r: Recipe) => (r.title ?? r["nama-makanan"] ?? "").toLowerCase() === recipeTitle.toLowerCase()
        ) || data.data[0];

        setRecipe(foundRecipe);
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!recipe) return;

    const isFavorite = favorites.some(
      (f) => (f.title ?? f["nama-makanan"]) === (recipe.title ?? recipe["nama-makanan"])
    );

    if (isFavorite) {
      removeFavorite(recipe.title ?? recipe["nama-makanan"] ?? "");
    } else {
      addFavorite(recipe);
    }
  };

  const isFavorite = recipe && favorites.some(
    (f) => (f.title ?? f["nama-makanan"]) === (recipe.title ?? recipe["nama-makanan"])
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe || showCookingMode) {
    if (showCookingMode && recipe) {
      return (
        <InteractiveCookingMode
          recipeTitle={recipe.title ?? "Unknown Recipe"}
          steps={recipe.steps ?? ""}
          cookingTime={recipe.cookingTime}
          portion={recipe.portion}
          onComplete={() => setShowCookingMode(false)}
        />
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Recipe not found</p>
      </div>
    );
  }

  const calories = recipe.calories ?? 0;
  const protein = recipe.protein ?? 0;
  const carbs = recipe.carbs ?? recipe.karbohidrat ?? 0;
  const fat = recipe.fat ?? recipe.lemak ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold">{recipe.title}</h1>
              {recipe.category && (
                <p className="text-sm text-muted-foreground">{recipe.category}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isFavorite ? "default" : "outline"}
                size="sm"
                onClick={handleToggleFavorite}
                className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
              >
                {isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Recipe Image & Quick Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Recipe Image */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title ?? "Recipe image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect fill='%23e5e7eb' width='400' height='225'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ChefHat className="h-16 w-16" />
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                {recipe.cookingTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{recipe.cookingTime} minutes</span>
                  </div>
                )}
                
                {recipe.portion && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{recipe.portion} portions</span>
                  </div>
                )}

                {recipe.prepDifficulty && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{recipe.prepDifficulty}</Badge>
                  </div>
                )}

                {recipe.estimatedCostLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Cost:</span>
                    <Badge variant="outline">{recipe.estimatedCostLevel}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {recipe.dietType && (
                <Badge variant="secondary">{recipe.dietType}</Badge>
              )}
              {recipe.suitableFor && (
                <Badge variant="secondary">{recipe.suitableFor}</Badge>
              )}
            </div>
          </div>

          {/* Right Column - Details & Nutrition */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nutrition Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nutrition Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-primary/5">
                    <p className="text-2xl font-bold text-primary">{calories.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10">
                    <p className="text-2xl font-bold text-green-600">{protein.toFixed(1)}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-500/10">
                    <p className="text-2xl font-bold text-blue-600">{carbs.toFixed(1)}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-amber-500/10">
                    <p className="text-2xl font-bold text-amber-600">{fat.toFixed(1)}g</p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                </div>

                {/* Target vs Recipe Radar Chart */}
                {metrics && (
                  <div className="mt-6">
                    <TargetVsRecipeRadar
                      recipe={{ calories, protein, carbs, fat }}
                      dailyTarget={{
                        calories: metrics.calorieTarget,
                        protein: metrics.calorieTarget * 0.3 / 4,
                        carbs: metrics.calorieTarget * 0.45 / 4,
                        fat: metrics.calorieTarget * 0.25 / 9,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cooking Mode Button */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Cook?</h3>
                    <p className="text-sm text-muted-foreground">
                      Follow step-by-step instructions in cooking mode
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setShowCookingMode(true)}
                    className="gap-2"
                  >
                    <ChefHat className="h-5 w-5" />
                    Start Cooking Mode
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            {recipe.ingredients && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{recipe.ingredients}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Steps Preview */}
            {recipe.steps && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{recipe.steps}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* External Link */}
            {recipe.url && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  asChild
                  className="gap-2"
                >
                  <a
                    href={recipe.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Original Recipe
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
