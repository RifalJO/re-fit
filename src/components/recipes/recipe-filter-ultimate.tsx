"use client";

import { useState } from "react";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface RecipeFilters {
  dietType: string[];
  prepDifficulty: string[];
  estimatedCostLevel: string[];
  suitableFor: string[];
  category: string;
  search: string;
  // Numeric filters
  calories: [number, number];
  protein: [number, number];
  carbs: [number, number];
  fat: [number, number];
  cookingTime: [number, number];
  portion: [number, number];
}

interface RecipeFilterProps {
  filters: RecipeFilters;
  onFilterChange: (filters: RecipeFilters) => void;
  totalRecipes: number;
  filteredRecipes: number;
}

const DIET_TYPES = [
  { value: "Keto-Friendly", label: "Keto-Friendly", color: "bg-purple-500" },
  { value: "High-Protein", label: "High-Protein", color: "bg-red-500" },
  { value: "Low-Calories", label: "Low-Calories", color: "bg-green-500" },
  { value: "Regular", label: "Regular", color: "bg-blue-500" },
];

const PREP_DIFFICULTIES = [
  { value: "Easy", label: "Easy", icon: "🟢" },
  { value: "Medium", label: "Medium", icon: "🟡" },
  { value: "Hard", label: "Hard", icon: "🔴" },
];

const COST_LEVELS = [
  { value: "$", label: "Budget-Friendly", icon: "$" },
  { value: "$$", label: "Moderate", icon: "$$" },
  { value: "$$$", label: "Premium", icon: "$$$" },
];

const MEAL_TYPES = [
  { value: "Breakfast", label: "Breakfast", icon: "🌅" },
  { value: "Main Course", label: "Main Course", icon: "🍽️" },
  { value: "Snack", label: "Snack", icon: "🍿" },
];

export function RecipeFilterPanel({
  filters,
  onFilterChange,
  totalRecipes,
  filteredRecipes,
}: RecipeFilterProps) {
  const [localFilters, setLocalFilters] = useState<RecipeFilters>(filters);

  const updateFilter = <K extends keyof RecipeFilters>(
    key: K,
    value: RecipeFilters[K]
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof RecipeFilters, value: string) => {
    const current = localFilters[key as keyof RecipeFilters] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearAllFilters = () => {
    const cleared: RecipeFilters = {
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
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFilterCount =
    filters.dietType.length +
    filters.prepDifficulty.length +
    filters.estimatedCostLevel.length +
    filters.suitableFor.length +
    (filters.calories[0] > 0 || filters.calories[1] < 2000 ? 1 : 0) +
    (filters.protein[0] > 0 || filters.protein[1] < 100 ? 1 : 0) +
    (filters.carbs[0] > 0 || filters.carbs[1] < 200 ? 1 : 0) +
    (filters.fat[0] > 0 || filters.fat[1] < 100 ? 1 : 0) +
    (filters.cookingTime[0] > 0 || filters.cookingTime[1] < 180 ? 1 : 0) +
    (filters.portion[0] > 1 || filters.portion[1] < 20 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header with clear all */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ultimate Filter</h3>
          <p className="text-sm text-muted-foreground">
            {filteredRecipes} of {totalRecipes} recipes
          </p>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Clear all ({activeFilterCount})
          </Button>
        )}
      </div>

      <Separator />

      <ScrollArea className="h-[calc(100vh-350px)]">
        <div className="space-y-6 pr-4">
          {/* Search */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Search</Label>
            </div>
            <Input
              placeholder="Search recipes or ingredients..."
              value={localFilters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Calories Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Calories</Label>
            </div>
            <div className="space-y-4">
              <Slider
                value={[filters.calories[0], filters.calories[1]]}
                onValueChange={(value) =>
                  updateFilter("calories", value as [number, number])
                }
                min={0}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.calories[0]} cal</span>
                <span className="font-medium text-foreground">
                  {filters.calories[1]} cal
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Protein Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Protein</Label>
            </div>
            <div className="space-y-4">
              <Slider
                value={[filters.protein[0], filters.protein[1]]}
                onValueChange={(value) =>
                  updateFilter("protein", value as [number, number])
                }
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.protein[0]}g</span>
                <span className="font-medium text-foreground">
                  {filters.protein[1]}g
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Carbs Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Carbohydrates</Label>
            </div>
            <div className="space-y-4">
              <Slider
                value={[filters.carbs[0], filters.carbs[1]]}
                onValueChange={(value) =>
                  updateFilter("carbs", value as [number, number])
                }
                min={0}
                max={200}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.carbs[0]}g</span>
                <span className="font-medium text-foreground">
                  {filters.carbs[1]}g
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fat Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Fat</Label>
            </div>
            <div className="space-y-4">
              <Slider
                value={[filters.fat[0], filters.fat[1]]}
                onValueChange={(value) =>
                  updateFilter("fat", value as [number, number])
                }
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.fat[0]}g</span>
                <span className="font-medium text-foreground">
                  {filters.fat[1]}g
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cooking Time Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Cooking Time</Label>
            </div>
            <div className="space-y-4">
              <Slider
                value={[filters.cookingTime[0], filters.cookingTime[1]]}
                onValueChange={(value) =>
                  updateFilter("cookingTime", value as [number, number])
                }
                min={0}
                max={180}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.cookingTime[0]} min</span>
                <span className="font-medium text-foreground">
                  {filters.cookingTime[1]} min
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Portion Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Portions</Label>
            </div>
            <div className="space-y-4">
              <Slider
                value={[filters.portion[0], filters.portion[1]]}
                onValueChange={(value) =>
                  updateFilter("portion", value as [number, number])
                }
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.portion[0]} portions</span>
                <span className="font-medium text-foreground">
                  {filters.portion[1]} portions
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Diet Type Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Diet Type</Label>
            </div>
            <div className="space-y-2">
              {DIET_TYPES.map((diet) => (
                <div
                  key={diet.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`diet-${diet.value}`}
                    checked={filters.dietType.includes(diet.value)}
                    onCheckedChange={() =>
                      toggleArrayFilter("dietType", diet.value)
                    }
                  />
                  <Label
                    htmlFor={`diet-${diet.value}`}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        diet.color
                      )}
                    />
                    {diet.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Prep Difficulty Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Difficulty</Label>
            </div>
            <div className="space-y-2">
              {PREP_DIFFICULTIES.map((diff) => (
                <div
                  key={diff.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`diff-${diff.value}`}
                    checked={filters.prepDifficulty.includes(diff.value)}
                    onCheckedChange={() =>
                      toggleArrayFilter("prepDifficulty", diff.value)
                    }
                  />
                  <Label
                    htmlFor={`diff-${diff.value}`}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <span>{diff.icon}</span>
                    {diff.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Cost Level Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Cost Level</Label>
            </div>
            <div className="space-y-2">
              {COST_LEVELS.map((cost) => (
                <div
                  key={cost.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`cost-${cost.value}`}
                    checked={filters.estimatedCostLevel.includes(cost.value)}
                    onCheckedChange={() =>
                      toggleArrayFilter("estimatedCostLevel", cost.value)
                    }
                  />
                  <Label
                    htmlFor={`cost-${cost.value}`}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <span className="font-medium">{cost.icon}</span>
                    {cost.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Meal Type Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Meal Type</Label>
            </div>
            <div className="space-y-2">
              {MEAL_TYPES.map((meal) => (
                <div
                  key={meal.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`meal-${meal.value}`}
                    checked={filters.suitableFor.includes(meal.value)}
                    onCheckedChange={() =>
                      toggleArrayFilter("suitableFor", meal.value)
                    }
                  />
                  <Label
                    htmlFor={`meal-${meal.value}`}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <span>{meal.icon}</span>
                    {meal.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Desktop Sidebar Component
export function RecipeFilterSidebar({
  filters,
  onFilterChange,
  totalRecipes,
  filteredRecipes,
}: RecipeFilterProps) {
  return (
    <Card className="sticky top-4 h-fit">
      <CardContent className="p-4">
        <RecipeFilterPanel
          filters={filters}
          onFilterChange={onFilterChange}
          totalRecipes={totalRecipes}
          filteredRecipes={filteredRecipes}
        />
      </CardContent>
    </Card>
  );
}

// Mobile Drawer Component
export function RecipeFilterDrawer({
  filters,
  onFilterChange,
  totalRecipes,
  filteredRecipes,
}: RecipeFilterProps) {
  const [open, setOpen] = useState(false);

  const activeFilterCount =
    filters.dietType.length +
    filters.prepDifficulty.length +
    filters.estimatedCostLevel.length +
    filters.suitableFor.length +
    (filters.calories[0] > 0 || filters.calories[1] < 2000 ? 1 : 0) +
    (filters.protein[0] > 0 || filters.protein[1] < 100 ? 1 : 0) +
    (filters.carbs[0] > 0 || filters.carbs[1] < 200 ? 1 : 0) +
    (filters.fat[0] > 0 || filters.fat[1] < 100 ? 1 : 0) +
    (filters.cookingTime[0] > 0 || filters.cookingTime[1] < 180 ? 1 : 0) +
    (filters.portion[0] > 1 || filters.portion[1] < 20 ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] sm:w-[400px] p-0">
        <SheetHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Filter Recipes</SheetTitle>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const cleared: RecipeFilters = {
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
                    onFilterChange(cleared);
                  }}
                  className="text-xs h-8"
                >
                  Clear all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredRecipes} of {totalRecipes} recipes
          </p>
        </SheetHeader>
        <div className="p-4">
          <RecipeFilterPanel
            filters={filters}
            onFilterChange={onFilterChange}
            totalRecipes={totalRecipes}
            filteredRecipes={filteredRecipes}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Combined component that renders sidebar on desktop and drawer on mobile
export function ResponsiveRecipeFilter(props: RecipeFilterProps) {
  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <RecipeFilterSidebar {...props} />
      </div>

      {/* Mobile Drawer trigger - shown in header */}
      <div className="lg:hidden">
        <RecipeFilterDrawer {...props} />
      </div>
    </>
  );
}
