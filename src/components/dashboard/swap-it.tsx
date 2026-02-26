"use client";

import { useState, useEffect } from "react";
import { Shuffle, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { getAlternativeRecipes, getRandomRecipes } from "@/lib/recipe-utils";
import { loadRecipes } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import type { Recipe } from "@/types";

interface SwapItRecipeProps {
  recipe: Recipe;
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
          <div className="space-y-2">
            <p className="text-sm font-medium">Alternative Recipes:</p>
            <div className="grid gap-4">
              {alternatives.map((alt, index) => (
                <div key={index} className="animate-fade-in">
                  <RecipeCard 
                    recipe={alt} 
                    showChart={false}
                    isFavorite={favorites.some((f) => (f["nama-makanan"] ?? f.title) === (alt["nama-makanan"] ?? alt.title))}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              💡 These recipes have similar protein but different carb/fat profiles
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
