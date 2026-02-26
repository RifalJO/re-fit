"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MacroChart } from "@/components/charts/macro-chart";
import type { Recipe } from "@/types";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
  showChart?: boolean;
}

export function RecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  showChart = true,
}: RecipeCardProps) {
  return (
    <Card className="group relative overflow-hidden card-hover transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1 pr-2 transition-colors duration-300 group-hover:text-primary">
            {recipe["nama-makanan"] ?? recipe.title ?? "Unknown Recipe"}
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
        {/* Calories badge */}
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-all duration-300 group-hover:bg-primary/20">
          {(recipe.kalori ?? recipe.calories ?? 0).toFixed(0)} calories
        </div>

        {/* Macro grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {(recipe.protein ?? 0).toFixed(1)}g
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {(recipe.karbohidrat ?? recipe.carbs ?? 0).toFixed(1)}g
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {(recipe.lemak ?? recipe.fat ?? 0).toFixed(1)}g
            </p>
          </div>
        </div>

        {/* Fiber info */}
        <div className="flex items-center justify-between text-sm transition-all duration-300">
          <span className="text-muted-foreground">Fiber</span>
          <span className="font-medium">{(recipe.serat ?? 0).toFixed(1)}g</span>
        </div>

        {/* Macro chart */}
        {showChart && (
          <div className="h-[100px] w-full animate-fade-in">
            <MacroChart
              protein={recipe.protein ?? 0}
              carbohydrates={recipe.karbohidrat ?? recipe.carbs ?? 0}
              fat={recipe.lemak ?? recipe.fat ?? 0}
              size="sm"
              showLabels={false}
            />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <a
          href={recipe.link ?? recipe.url ?? "#"}
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
