"use client";

import { useState, useEffect } from "react";
import { Shuffle, ArrowRightLeft, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { getAlternativeRecipes, getRandomRecipes } from "@/lib/recipe-utils";
import { loadRecipes } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/types";

interface SwapItRecipeProps {
  recipe: Recipe;
}

interface MacroComparison {
  protein: { diff: number; percentage: number };
  carbs: { diff: number; percentage: number };
  fat: { diff: number; percentage: number };
  calories: { diff: number; percentage: number };
}

// Helper to get macro values with fallbacks
const getMacros = (recipe: Recipe) => ({
  calories: recipe.calories ?? recipe.kalori ?? 0,
  protein: recipe.protein ?? 0,
  carbs: recipe.carbs ?? recipe.karbohidrat ?? 0,
  fat: recipe.fat ?? recipe.lemak ?? 0,
});

// Calculate macro comparison
const calculateComparison = (original: Recipe, alternative: Recipe): MacroComparison => {
  const orig = getMacros(original);
  const alt = getMacros(alternative);

  return {
    protein: {
      diff: alt.protein - orig.protein,
      percentage: orig.protein !== 0 ? ((alt.protein - orig.protein) / orig.protein) * 100 : 0,
    },
    carbs: {
      diff: alt.carbs - orig.carbs,
      percentage: orig.carbs !== 0 ? ((alt.carbs - orig.carbs) / orig.carbs) * 100 : 0,
    },
    fat: {
      diff: alt.fat - orig.fat,
      percentage: orig.fat !== 0 ? ((alt.fat - orig.fat) / orig.fat) * 100 : 0,
    },
    calories: {
      diff: alt.calories - orig.calories,
      percentage: orig.calories !== 0 ? ((alt.calories - orig.calories) / orig.calories) * 100 : 0,
    },
  };
};

// Macro Visual Bar Component
function MacroComparisonBar({
  label,
  originalValue,
  alternativeValue,
  diff,
  percentage,
}: {
  label: string;
  originalValue: number;
  alternativeValue: number;
  diff: number;
  percentage: number;
}) {
  const maxValue = Math.max(originalValue, alternativeValue);
  const isIncrease = diff > 0;
  const isDecrease = diff < 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{originalValue.toFixed(1)}g</span>
          <span className="text-xs">→</span>
          <span className={cn(
            "font-semibold",
            isIncrease ? "text-red-600" : isDecrease ? "text-green-600" : "text-muted-foreground"
          )}>
            {alternativeValue.toFixed(1)}g
          </span>
        </div>
      </div>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Original value bar */}
        <div
          className="absolute top-0 left-0 h-full bg-primary/30 rounded-full"
          style={{ width: `${(originalValue / maxValue) * 100}%` }}
        />
        
        {/* Alternative value bar */}
        <div
          className="absolute top-0 left-0 h-full bg-accent/60 rounded-full transition-all duration-500"
          style={{ width: `${(alternativeValue / maxValue) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-end">
        {isIncrease ? (
          <span className="text-xs text-red-600 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            +{diff.toFixed(1)}g ({percentage.toFixed(1)}%)
          </span>
        ) : isDecrease ? (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <ArrowDownRight className="h-3 w-3" />
            {diff.toFixed(1)}g ({percentage.toFixed(1)}%)
          </span>
        ) : (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Minus className="h-3 w-3" />
            No change
          </span>
        )}
      </div>
    </div>
  );
}

export function SwapItRecipe({ recipe }: SwapItRecipeProps) {
  const [alternatives, setAlternatives] = useState<Recipe[]>([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const { addFavorite, removeFavorite, favorites } = useAppStore();

  // Load recipes on mount
  useEffect(() => {
    loadRecipes().then(setAllRecipes);
  }, []);

  const handleSwap = () => {
    if (allRecipes.length > 0) {
      const alts = getAlternativeRecipes(recipe, allRecipes);
      setAlternatives(alts);
      setShowAlternatives(true);
    }
  };

  const handleToggleFavorite = async (recipeToToggle: Recipe) => {
    const recipeId = recipeToToggle["nama-makanan"] ?? recipeToToggle.title ?? "";
    if (!recipeId) return;

    const isFavorite = favorites.some(
      (f) => (f["nama-makanan"] ?? f.title) === recipeId
    );

    if (isFavorite) {
      removeFavorite(recipeId);
      await fetch(`/api/user/favorites?recipeId=${encodeURIComponent(recipeId)}`, {
        method: "DELETE",
      });
    } else {
      addFavorite(recipeToToggle);
      await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId,
          name: recipeId,
          kalori: recipeToToggle.kalori ?? recipeToToggle.calories ?? 0,
          protein: recipeToToggle.protein ?? 0,
          karbohidrat: recipeToToggle.karbohidrat ?? recipeToToggle.carbs ?? 0,
          lemak: recipeToToggle.lemak ?? recipeToToggle.fat ?? 0,
          serat: recipeToToggle.serat ?? 0,
          link: recipeToToggle.link ?? recipeToToggle.url ?? "",
        }),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Swap-It Recipe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Current Recipe:
          </p>
          <RecipeCard 
            recipe={recipe} 
            showChart={false}
            isFavorite={favorites.some((f) => (f["nama-makanan"] ?? f.title) === (recipe["nama-makanan"] ?? recipe.title))}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        <Button
          onClick={handleSwap}
          className="w-full transition-all duration-300 hover:scale-105"
        >
          <Shuffle className="h-4 w-4 mr-2" />
          Find Alternatives
        </Button>

        {showAlternatives && alternatives.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm font-medium">Alternative Recipes with Macro Comparison:</p>
            <div className="grid gap-6">
              {alternatives.map((alt, index) => {
                const comparison = calculateComparison(recipe, alt);
                
                return (
                  <div key={index} className="animate-fade-in space-y-3">
                    {/* Recipe Card */}
                    <RecipeCard
                      recipe={alt}
                      showChart={false}
                      isFavorite={favorites.some((f) => (f["nama-makanan"] ?? f.title) === (alt["nama-makanan"] ?? alt.title))}
                      onToggleFavorite={handleToggleFavorite}
                    />

                    {/* Macro Comparison Visual */}
                    <Card className="bg-muted/30">
                      <CardContent className="p-4 space-y-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Macro Comparison (vs Original)
                        </p>
                        
                        <MacroComparisonBar
                          label="Protein"
                          originalValue={getMacros(recipe).protein}
                          alternativeValue={getMacros(alt).protein}
                          diff={comparison.protein.diff}
                          percentage={comparison.protein.percentage}
                        />

                        <MacroComparisonBar
                          label="Carbohydrates"
                          originalValue={getMacros(recipe).carbs}
                          alternativeValue={getMacros(alt).carbs}
                          diff={comparison.carbs.diff}
                          percentage={comparison.carbs.percentage}
                        />

                        <MacroComparisonBar
                          label="Fat"
                          originalValue={getMacros(recipe).fat}
                          alternativeValue={getMacros(alt).fat}
                          diff={comparison.fat.diff}
                          percentage={comparison.fat.percentage}
                        />

                        <MacroComparisonBar
                          label="Calories"
                          originalValue={getMacros(recipe).calories}
                          alternativeValue={getMacros(alt).calories}
                          diff={comparison.calories.diff}
                          percentage={comparison.calories.percentage}
                        />

                        {/* Summary Insight */}
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            💡{" "}
                            {comparison.protein.percentage > 15 ? (
                              <span className="text-green-600 font-medium">
                                Higher protein (+{comparison.protein.percentage.toFixed(0)}%) with{" "}
                                {comparison.carbs.percentage < -15 ? "lower" : "similar"} carbs
                              </span>
                            ) : comparison.carbs.percentage < -15 ? (
                              <span className="text-green-600 font-medium">
                                Lower carbs ({comparison.carbs.percentage.toFixed(0)}%) - great for cutting!
                              </span>
                            ) : comparison.fat.percentage > 20 ? (
                              <span className="text-amber-600 font-medium">
                                Higher fat content ({comparison.fat.percentage.toFixed(0)}%)
                              </span>
                            ) : (
                              <span className="text-blue-600 font-medium">
                                Similar macro profile - good alternative choice
                              </span>
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              💡 These recipes have similar protein but different carb/fat profiles. Green = better choice, Red = higher value.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RandomDiscoveryMenu() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);
  const [hasShuffled, setHasShuffled] = useState(false);
  const { addFavorite, removeFavorite, favorites } = useAppStore();

  // Load recipes on mount
  useEffect(() => {
    loadRecipes().then((recipes) => {
      setAllRecipes(recipes);
      // Auto-load 3 random recipes
      const random = getRandomRecipes(recipes, 3);
      setRandomRecipes(random);
      setHasShuffled(true);
    });
  }, []);

  const handleShuffle = () => {
    if (allRecipes.length > 0) {
      const random = getRandomRecipes(allRecipes, 3);
      setRandomRecipes(random);
      setHasShuffled(true);
    }
  };

  const handleToggleFavorite = async (recipeToToggle: Recipe) => {
    const recipeId = recipeToToggle["nama-makanan"] ?? recipeToToggle.title ?? "";
    if (!recipeId) return;

    const isFavorite = favorites.some(
      (f) => (f["nama-makanan"] ?? f.title) === recipeId
    );

    if (isFavorite) {
      removeFavorite(recipeId);
      await fetch(`/api/user/favorites?recipeId=${encodeURIComponent(recipeId)}`, {
        method: "DELETE",
      });
    } else {
      addFavorite(recipeToToggle);
      await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId,
          name: recipeId,
          kalori: recipeToToggle.kalori ?? recipeToToggle.calories ?? 0,
          protein: recipeToToggle.protein ?? 0,
          karbohidrat: recipeToToggle.karbohidrat ?? recipeToToggle.carbs ?? 0,
          lemak: recipeToToggle.lemak ?? recipeToToggle.fat ?? 0,
          serat: recipeToToggle.serat ?? 0,
          link: recipeToToggle.link ?? recipeToToggle.url ?? "",
        }),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🎲 Random Discovery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleShuffle}
          variant="outline"
          className="w-full transition-all duration-300 hover:scale-105"
        >
          <Shuffle className="h-4 w-4 mr-2" />
          {hasShuffled ? "Shuffle Again" : "Surprise Me"}
        </Button>

        {randomRecipes.length > 0 && (
          <div className="grid gap-4">
            {randomRecipes.map((recipe, index) => (
              <motion.div
                key={recipe["nama-makanan"]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RecipeCard
                  recipe={recipe}
                  showChart={false}
                  isFavorite={favorites.some((f) => (f["nama-makanan"] ?? f.title) === (recipe["nama-makanan"] ?? recipe.title))}
                  onToggleFavorite={handleToggleFavorite}
                />
              </motion.div>
            ))}
          </div>
        )}

        {randomRecipes.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Click &quot;Surprise Me&quot; to discover new recipes!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { motion } from "framer-motion";
