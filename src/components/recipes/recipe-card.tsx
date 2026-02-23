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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1 pr-2">
            {recipe["nama-makanan"]}
          </h3>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mt-1 -mr-2"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(recipe);
              }}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
              />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Calories badge */}
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {recipe.kalori.toFixed(0)} calories
        </div>

        {/* Macro grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950/20">
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {recipe.protein.toFixed(1)}g
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950/20">
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {recipe.karbohidrat.toFixed(1)}g
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-950/20">
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {recipe.lemak.toFixed(1)}g
            </p>
          </div>
        </div>

        {/* Fiber info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fiber</span>
          <span className="font-medium">{recipe.serat.toFixed(1)}g</span>
        </div>

        {/* Macro chart */}
        {showChart && (
          <div className="h-[100px] w-full">
            <MacroChart
              protein={recipe.protein}
              carbohydrates={recipe.karbohidrat}
              fat={recipe.lemak}
              size="sm"
              showLabels={false}
            />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <a
          href={recipe.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline w-full text-center block"
        >
          View Recipe →
        </a>
      </CardFooter>
    </Card>
  );
}
