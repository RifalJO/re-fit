"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Utensils, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResponsiveRecipeFilter, type RecipeFilters } from "@/components/recipes/recipe-filter-ultimate";
import { EnhancedRecipeCard } from "@/components/recipes/enhanced-recipe-card";
import { useAppStore } from "@/lib/store";
import type { Recipe } from "@/types";

const DEFAULT_FILTERS: RecipeFilters = {
  dietType: [],
  prepDifficulty: [],
  estimatedCostLevel: [],
  suitableFor: [],
  category: "",
  search: "",
  calories: [0, 2000],
  protein: [0, 100],
  carbs: [0, 200],
  fat: [0, 100],
  cookingTime: [0, 180],
  portion: [1, 20],
};

export default function ExplorePage() {
  const [loading, setLoading] = useState(true);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState<RecipeFilters>(DEFAULT_FILTERS);
  const { favorites, addFavorite, removeFavorite } = useAppStore();

  // Load all recipes on mount
  useEffect(() => {
    loadAllRecipes();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, allRecipes]);

  const loadAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes");
      const data = await response.json();

      if (data.success) {
        setAllRecipes(data.data);
        setFilteredRecipes(data.data);
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allRecipes];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title?.toLowerCase().includes(searchLower) ||
          recipe.ingredients?.toLowerCase().includes(searchLower)
      );
    }

    // Apply numeric filters
    if (filters.calories[0] > 0 || filters.calories[1] < 2000) {
      filtered = filtered.filter(
        (r) => (r.calories ?? 0) >= filters.calories[0] && (r.calories ?? 0) <= filters.calories[1]
      );
    }

    if (filters.protein[0] > 0 || filters.protein[1] < 100) {
      filtered = filtered.filter(
        (r) => (r.protein ?? 0) >= filters.protein[0] && (r.protein ?? 0) <= filters.protein[1]
      );
    }

    if (filters.carbs[0] > 0 || filters.carbs[1] < 200) {
      filtered = filtered.filter(
        (r) => (r.carbs ?? 0) >= filters.carbs[0] && (r.carbs ?? 0) <= filters.carbs[1]
      );
    }

    if (filters.fat[0] > 0 || filters.fat[1] < 100) {
      filtered = filtered.filter(
        (r) => (r.fat ?? 0) >= filters.fat[0] && (r.fat ?? 0) <= filters.fat[1]
      );
    }

    if (filters.cookingTime[0] > 0 || filters.cookingTime[1] < 180) {
      filtered = filtered.filter(
        (r) => (r.cookingTime ?? 0) >= filters.cookingTime[0] && (r.cookingTime ?? 0) <= filters.cookingTime[1]
      );
    }

    if (filters.portion[0] > 1 || filters.portion[1] < 20) {
      filtered = filtered.filter(
        (r) => (r.portion ?? 1) >= filters.portion[0] && (r.portion ?? 1) <= filters.portion[1]
      );
    }

    // Apply category filters
    if (filters.dietType.length > 0) {
      filtered = filtered.filter((r) => r.dietType && filters.dietType.includes(r.dietType));
    }

    if (filters.prepDifficulty.length > 0) {
      filtered = filtered.filter((r) => r.prepDifficulty && filters.prepDifficulty.includes(r.prepDifficulty));
    }

    if (filters.estimatedCostLevel.length > 0) {
      filtered = filtered.filter((r) => r.estimatedCostLevel && filters.estimatedCostLevel.includes(r.estimatedCostLevel));
    }

    if (filters.suitableFor.length > 0) {
      filtered = filtered.filter((r) => r.suitableFor && filters.suitableFor.includes(r.suitableFor));
    }

    setFilteredRecipes(filtered);
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    const recipeId = recipe.title ?? recipe["nama-makanan"] ?? "";
    if (!recipeId) return;

    const isFavorite = favorites.some(
      (f) => (f.title ?? f["nama-makanan"]) === recipeId
    );

    if (isFavorite) {
      removeFavorite(recipeId);
    } else {
      addFavorite(recipe);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading 1,159 recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Utensils className="h-6 w-6" />
                Global Menu Explorer
              </h1>
              <p className="text-sm text-muted-foreground">
                Explore all {allRecipes.length} recipes from Dapur Umami
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search bar (desktop) */}
              <div className="hidden md:flex relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>

              {/* Mobile filter button */}
              <ResponsiveRecipeFilter
                filters={filters}
                onFilterChange={setFilters}
                totalRecipes={allRecipes.length}
                filteredRecipes={filteredRecipes.length}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <ResponsiveRecipeFilter
            filters={filters}
            onFilterChange={setFilters}
            totalRecipes={allRecipes.length}
            filteredRecipes={filteredRecipes.length}
          />

          {/* Recipe Grid */}
          <div className="flex-1">
            {/* Stats bar */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-semibold">
                        {filteredRecipes.length} recipes found
                      </span>
                    </div>
                    {(filters.dietType.length > 0 ||
                      filters.prepDifficulty.length > 0 ||
                      filters.estimatedCostLevel.length > 0 ||
                      filters.suitableFor.length > 0 ||
                      filters.calories[0] > 0 ||
                      filters.calories[1] < 2000 ||
                      filters.protein[0] > 0 ||
                      filters.protein[1] < 100 ||
                      filters.carbs[0] > 0 ||
                      filters.carbs[1] < 200 ||
                      filters.fat[0] > 0 ||
                      filters.fat[1] < 100) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters(DEFAULT_FILTERS)}
                        className="text-xs"
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Grid */}
            {filteredRecipes.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredRecipes.map((recipe) => (
                  <EnhancedRecipeCard
                    key={recipe.id ?? recipe.title}
                    recipe={recipe}
                    isFavorite={favorites.some(
                      (f) => (f.title ?? f["nama-makanan"]) === (recipe.title ?? recipe["nama-makanan"])
                    )}
                    onToggleFavorite={handleToggleFavorite}
                    showChart={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
