"use client";

import type { Recipe } from "@/types";
import { RecipeCard } from "./recipe-card";

interface RecipeGridProps {
  recipes: Recipe[];
  favorites?: Recipe[];
  onToggleFavorite?: (recipe: Recipe) => void;
  showChart?: boolean;
}

export function RecipeGrid({
  recipes,
  favorites = [],
  onToggleFavorite,
  showChart = true,
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed bg-muted/25">
        <div className="text-center">
          <p className="text-lg font-medium">No recipes found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your preferences
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe["nama-makanan"]}
          recipe={recipe}
          isFavorite={favorites.some(
            (f) => f["nama-makanan"] === recipe["nama-makanan"]
          )}
          onToggleFavorite={onToggleFavorite}
          showChart={showChart}
        />
      ))}
    </div>
  );
}
