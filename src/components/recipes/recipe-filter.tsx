"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { DietType, PrepDifficulty, CostLevel, MealType } from "@/types";

interface RecipeFilters {
  dietType?: DietType;
  prepDifficulty?: PrepDifficulty;
  estimatedCostLevel?: CostLevel;
  suitableFor?: MealType;
  search?: string;
}

interface RecipeFilterPanelProps {
  filters: RecipeFilters;
  onFilterChange: (filters: RecipeFilters) => void;
  onClearFilters?: () => void;
}

export function RecipeFilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
}: RecipeFilterPanelProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== "");

  const handleClear = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      onFilterChange({});
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Diet Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Diet Type</label>
          <Select
            value={filters.dietType || ""}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                dietType: value as DietType || undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All diet types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All diet types</SelectItem>
              <SelectItem value="Keto-Friendly">Keto-Friendly</SelectItem>
              <SelectItem value="High-Protein">High-Protein</SelectItem>
              <SelectItem value="Low-Calories">Low-Calories</SelectItem>
              <SelectItem value="Regular">Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meal Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Meal Type</label>
          <Select
            value={filters.suitableFor || ""}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                suitableFor: value as MealType || undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All meal types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All meal types</SelectItem>
              <SelectItem value="Breakfast">Breakfast</SelectItem>
              <SelectItem value="Main Course">Main Course</SelectItem>
              <SelectItem value="Snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <Select
            value={filters.prepDifficulty || ""}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                prepDifficulty: value as PrepDifficulty || undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cost Level Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Cost Level</label>
          <Select
            value={filters.estimatedCostLevel || ""}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                estimatedCostLevel: value as CostLevel || undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All cost levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All cost levels</SelectItem>
              <SelectItem value="$">$ (Budget)</SelectItem>
              <SelectItem value="$$">$$ (Moderate)</SelectItem>
              <SelectItem value="$$$">$$$ (Premium)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Recipes</label>
        <Input
          placeholder="Search by recipe name or ingredients..."
          value={filters.search || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              search: e.target.value || undefined,
            })
          }
          className="w-full"
        />
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.dietType && (
            <Badge variant="secondary" className="gap-1">
              Diet: {filters.dietType}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() =>
                  onFilterChange({ ...filters, dietType: undefined })
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.suitableFor && (
            <Badge variant="secondary" className="gap-1">
              Meal: {filters.suitableFor}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() =>
                  onFilterChange({ ...filters, suitableFor: undefined })
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.prepDifficulty && (
            <Badge variant="secondary" className="gap-1">
              Difficulty: {filters.prepDifficulty}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() =>
                  onFilterChange({ ...filters, prepDifficulty: undefined })
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.estimatedCostLevel && (
            <Badge variant="secondary" className="gap-1">
              Cost: {filters.estimatedCostLevel}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() =>
                  onFilterChange({ ...filters, estimatedCostLevel: undefined })
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() =>
                  onFilterChange({ ...filters, search: undefined })
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
