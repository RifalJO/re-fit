"use client";

import { Heart, Clock, DollarSign, Utensils, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MacroChart } from "@/components/charts/macro-chart";
import type { Recipe } from "@/types";
import { cn } from "@/lib/utils";

interface EnhancedRecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
  showChart?: boolean;
}

// Helper to get recipe name
const getRecipeName = (recipe: Recipe) => {
  return recipe.title || recipe["nama-makanan"] || recipe.name || "Unknown Recipe";
};

// Helper to get recipe link
const getRecipeLink = (recipe: Recipe) => {
  return recipe.url || recipe.link || "#";
};

// Helper to get calories
const getCalories = (recipe: Recipe) => {
  return recipe.calories || recipe.kalori || 0;
};

// Helper to get macros
const getProtein = (recipe: Recipe) => {
  return recipe.protein || 0;
};

const getCarbs = (recipe: Recipe) => {
  return recipe.carbs || recipe.karbohidrat || 0;
};

const getFat = (recipe: Recipe) => {
  return recipe.fat || recipe.lemak || 0;
};

// Badge color helpers
const getDietTypeColor = (dietType?: string | null) => {
  switch (dietType) {
    case "Keto-Friendly":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "High-Protein":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "Low-Calories":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Regular":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getDifficultyColor = (difficulty?: string | null) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Hard":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getCostColor = (cost?: string | null) => {
  switch (cost) {
    case "$":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "$$":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "$$$":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getMealTypeColor = (mealType?: string | null) => {
  switch (mealType) {
    case "Breakfast":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "Main Course":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "Snack":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export function EnhancedRecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  showChart = true,
}: EnhancedRecipeCardProps) {
  const name = getRecipeName(recipe);
  const link = getRecipeLink(recipe);
  const calories = getCalories(recipe);
  const protein = getProtein(recipe);
  const carbs = getCarbs(recipe);
  const fat = getFat(recipe);

  return (
    <Card className="group relative overflow-hidden card-hover transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1 pr-2 transition-colors duration-300 group-hover:text-primary">
            {name}
          </h3>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mt-1 -mr-2 transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(recipe);
              }}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground hover:text-red-500"
                )}
              />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Feature badges row */}
        <div className="flex flex-wrap gap-1.5">
          {recipe.dietType && (
            <Badge variant="outline" className={cn("text-xs font-medium", getDietTypeColor(recipe.dietType))}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {recipe.dietType}
            </Badge>
          )}
          {recipe.suitableFor && (
            <Badge variant="outline" className={cn("text-xs font-medium", getMealTypeColor(recipe.suitableFor))}>
              <Utensils className="h-3 w-3 mr-1" />
              {recipe.suitableFor}
            </Badge>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-2">
          {recipe.cookingTime && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookingTime} min</span>
            </div>
          )}
          {recipe.prepDifficulty && (
            <Badge variant="outline" className={cn("text-xs", getDifficultyColor(recipe.prepDifficulty))}>
              {recipe.prepDifficulty}
            </Badge>
          )}
          {recipe.estimatedCostLevel && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className={cn("text-xs font-medium", getCostColor(recipe.estimatedCostLevel))}>
                {recipe.estimatedCostLevel}
              </span>
            </div>
          )}
        </div>

        {/* Calories badge */}
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-all duration-300 group-hover:bg-primary/20">
          {calories.toFixed(0)} calories
        </div>

        {/* Macro grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {protein.toFixed(1)}g
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {carbs.toFixed(1)}g
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {fat.toFixed(1)}g
            </p>
          </div>
        </div>

        {/* Macro chart */}
        {showChart && (
          <div className="h-[100px] w-full animate-fade-in">
            <MacroChart
              protein={protein}
              carbohydrates={carbs}
              fat={fat}
              size="sm"
              showLabels={false}
            />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline w-full text-center block transition-all duration-300 hover:scale-105"
        >
          View Recipe →
        </a>
      </CardFooter>
    </Card>
  );
}
