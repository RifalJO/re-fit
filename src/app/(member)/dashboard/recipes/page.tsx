"use client";

import { useState, useEffect } from "react";
import { EnhancedRecipeCard, RecipeFilterPanel } from "@/components/recipes";
import type { Recipe, DietType, PrepDifficulty, CostLevel, MealType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeFilters {
  dietType?: DietType;
  prepDifficulty?: PrepDifficulty;
  estimatedCostLevel?: CostLevel;
  suitableFor?: MealType;
  search?: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RecipeFilters>({});

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.dietType) params.append("dietType", filters.dietType);
        if (filters.prepDifficulty) params.append("prepDifficulty", filters.prepDifficulty);
        if (filters.estimatedCostLevel) params.append("estimatedCostLevel", filters.estimatedCostLevel);
        if (filters.suitableFor) params.append("suitableFor", filters.suitableFor);
        if (filters.search) params.append("search", filters.search);

        const response = await fetch(`/api/recipes?${params.toString()}`);
        const data = await response.json();
        if (data.success) {
          setRecipes(data.data);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const handleFilterChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Recipe Explorer</h1>
        <p className="text-muted-foreground mt-1">
          Discover {recipes.length} delicious recipes with detailed nutritional information
        </p>
      </div>

      {/* Filters */}
      <RecipeFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Recipe Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed bg-muted/25">
          <div className="text-center">
            <p className="text-lg font-medium">No recipes found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <EnhancedRecipeCard
              key={recipe.id || recipe.title || ""}
              recipe={recipe}
              showChart={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
