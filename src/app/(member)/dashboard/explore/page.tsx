"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Filter, Utensils, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RecipeFilterDrawer, RecipeFilterSidebar, type RecipeFilters } from "@/components/recipes/recipe-filter-ultimate";
import { useAppStore } from "@/lib/store";
import { useRouterState } from "@/contexts/router-context";
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

const ITEMS_PER_PAGE = 24;

export default function ExplorePage() {
  const router = useRouter();
  const { exploreFilters, setExploreFilters } = useRouterState();
  const [loading, setLoading] = useState(true);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState<RecipeFilters>(
    exploreFilters?.filters ?? DEFAULT_FILTERS
  );
  const [currentPage, setCurrentPage] = useState(
    exploreFilters?.page ?? 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const { favorites, addFavorite, removeFavorite } = useAppStore();

  // Load all recipes on mount
  useEffect(() => {
    loadAllRecipes();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, allRecipes]);

  // Save state when filters or page change
  useEffect(() => {
    if (!loading) {
      setExploreFilters({ page: currentPage, filters });
    }
  }, [currentPage, filters, loading]);

  // Update displayed recipes when page or filtered recipes change
  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedRecipes(filteredRecipes.slice(start, end));
    setTotalPages(Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE));
  }, [currentPage, filteredRecipes]);

  const loadAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes");
      const data = await response.json();

      if (data.success) {
        setAllRecipes(data.data);
        setFilteredRecipes(data.data);
        setDisplayedRecipes(data.data.slice(0, ITEMS_PER_PAGE));
        setTotalPages(Math.ceil(data.data.length / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [allRecipes, filters]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading recipes...</p>
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
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Utensils className="h-6 w-6" />
                Global Menu Explorer
              </h1>
              <p className="text-sm text-muted-foreground">
                Explore all {allRecipes.length.toLocaleString()} recipes from Dapur Umami
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
              <div className="lg:hidden">
                <RecipeFilterDrawer
                  filters={filters}
                  onFilterChange={setFilters}
                  totalRecipes={allRecipes.length}
                  filteredRecipes={filteredRecipes.length}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <RecipeFilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              totalRecipes={allRecipes.length}
              filteredRecipes={filteredRecipes.length}
            />
          </div>

          {/* Recipe Grid */}
          <div className="flex-1">
            {/* Stats bar */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold">
                      {filteredRecipes.length} recipes found
                    </span>
                  </div>
                  {displayedRecipes.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredRecipes.length)} of {filteredRecipes.length}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recipe Grid with Images */}
            {displayedRecipes.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {displayedRecipes.map((recipe) => (
                    <Link
                      key={recipe.id ?? recipe.title}
                      href={`/dashboard/recipes/${encodeURIComponent(recipe.title ?? recipe["nama-makanan"] ?? "")}`}
                      className="group"
                    >
                      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        {/* Recipe Image */}
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          {recipe.imageUrl ? (
                            <Image
                              src={recipe.imageUrl}
                              alt={recipe.title ?? recipe["nama-makanan"] ?? "Recipe image"}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={true}
                              unoptimized={true}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Utensils className="h-12 w-12 opacity-20" />
                            </div>
                          )}
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Recipe Info */}
                        <CardContent className="p-4 space-y-3">
                          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {recipe.title ?? recipe["nama-makanan"]}
                          </h3>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1">
                            {recipe.dietType && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                {recipe.dietType}
                              </span>
                            )}
                            {recipe.prepDifficulty && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                {recipe.prepDifficulty}
                              </span>
                            )}
                          </div>

                          {/* Nutrition Info */}
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 rounded bg-green-50 dark:bg-green-950/20">
                              <p className="text-muted-foreground">Protein</p>
                              <p className="font-semibold text-green-600 dark:text-green-400">
                                {(recipe.protein ?? 0).toFixed(0)}g
                              </p>
                            </div>
                            <div className="text-center p-2 rounded bg-blue-50 dark:bg-blue-950/20">
                              <p className="text-muted-foreground">Carbs</p>
                              <p className="font-semibold text-blue-600 dark:text-blue-400">
                                {(recipe.carbs ?? recipe.karbohidrat ?? 0).toFixed(0)}g
                              </p>
                            </div>
                            <div className="text-center p-2 rounded bg-amber-50 dark:bg-amber-950/20">
                              <p className="text-muted-foreground">Fat</p>
                              <p className="font-semibold text-amber-600 dark:text-amber-400">
                                {(recipe.fat ?? recipe.lemak ?? 0).toFixed(0)}g
                              </p>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                            {recipe.cookingTime && (
                              <span className="flex items-center gap-1">
                                <span>⏱️</span> {recipe.cookingTime} min
                              </span>
                            )}
                            {recipe.portion && (
                              <span className="flex items-center gap-1">
                                <span>🍽️</span> {recipe.portion} portions
                              </span>
                            )}
                            {recipe.calories && (
                              <span className="flex items-center gap-1">
                                <span>🔥</span> {recipe.calories} cal
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
