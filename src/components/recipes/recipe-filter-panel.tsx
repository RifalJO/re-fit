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
import { cn } from "@/lib/utils";

export interface RecipeFilters {
  dietType: string[];
  prepDifficulty: string[];
  estimatedCostLevel: string[];
  suitableFor: string[];
  maxCookingTime: number;
  search: string;
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
      maxCookingTime: 120,
      search: localFilters.search,
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFilterCount =
    filters.dietType.length +
    filters.prepDifficulty.length +
    filters.estimatedCostLevel.length +
    filters.suitableFor.length +
    (filters.maxCookingTime < 120 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header with clear all */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Filters</h3>
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

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-6 pr-4">
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

          <Separator />

          {/* Cooking Time Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Max Cooking Time</Label>
            </div>
            <div className="space-y-4">
              <Slider
                value={[localFilters.maxCookingTime]}
                onValueChange={(value) =>
                  updateFilter("maxCookingTime", value[0])
                }
                min={5}
                max={120}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>5 min</span>
                <span className="font-medium text-foreground">
                  {localFilters.maxCookingTime} min
                </span>
                <span>120 min</span>
              </div>
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
    (filters.maxCookingTime < 120 ? 1 : 0);

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
      <SheetContent className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle className="flex items-center justify-between">
            <span>Filter Recipes</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <Separator />
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
      <div className="hidden lg:block w-72 flex-shrink-0">
        <RecipeFilterSidebar {...props} />
      </div>

      {/* Mobile Drawer trigger - shown in header */}
      <div className="lg:hidden">
        <RecipeFilterDrawer {...props} />
      </div>
    </>
  );
}
