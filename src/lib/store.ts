import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, Recipe } from "@/types";

const initialState = {
  biometrics: null,
  healthConstraints: null,
  foodPreferences: null,
  metrics: null,
  recommendations: [],
  favorites: [],
  weightHistory: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setBiometrics: (biometrics) => {
        set({ biometrics });
        // Recalculate metrics if health constraints exist
        const { healthConstraints } = get();
        if (healthConstraints) {
          const metrics = calculateMetrics(biometrics, healthConstraints);
          if (metrics) {
            get().setMetrics(metrics);
          }
        }
      },

      setHealthConstraints: (healthConstraints) => {
        set({ healthConstraints });
        // Recalculate metrics if biometrics exist
        const { biometrics } = get();
        if (biometrics) {
          const metrics = calculateMetrics(biometrics, healthConstraints);
          if (metrics) {
            get().setMetrics(metrics);
          }
        }
      },

      setFoodPreferences: (foodPreferences) => set({ foodPreferences }),

      setMetrics: (metrics) => set({ metrics }),

      setRecommendations: (recommendations) => set({ recommendations }),

      addFavorite: (recipe) => {
        const { favorites } = get();
        const exists = favorites.some(
          (f) => f["nama-makanan"] === recipe["nama-makanan"]
        );
        if (!exists) {
          set({ favorites: [...favorites, recipe] });
        }
      },

      removeFavorite: (recipeName) => {
        const { favorites } = get();
        set({
          favorites: favorites.filter(
            (f) => f["nama-makanan"] !== recipeName
          ),
        });
      },

      addWeightEntry: (weight, date) => {
        const { weightHistory } = get();
        const newEntry = {
          date: date || new Date().toISOString().split("T")[0],
          weight,
        };
        set({ weightHistory: [...weightHistory, newEntry] });
      },

      resetState: () => set(initialState),
    }),
    {
      name: "refit-storage",
      partialize: (state) => ({
        biometrics: state.biometrics,
        healthConstraints: state.healthConstraints,
        foodPreferences: state.foodPreferences,
        metrics: state.metrics,
        favorites: state.favorites,
        weightHistory: state.weightHistory,
      }),
    }
  )
);

// Helper function to calculate BMR and TDEE
function calculateMetrics(
  biometrics: AppState["biometrics"],
  healthConstraints: AppState["healthConstraints"]
) {
  if (!biometrics) return null;

  const { gender, age, weight, height, activityLevel } = biometrics;

  // Mifflin-St Jeor Equation for BMR
  let BMR = 10 * weight + 6.25 * height - 5 * age;
  BMR += gender === "male" ? 5 : -161;

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  const TDEE = BMR * (activityMultipliers[activityLevel] || 1.2);

  // Adjust for diabetes if applicable
  let calorieTarget = TDEE;
  if (healthConstraints?.isDiabetic) {
    // Slight deficit for diabetic management
    calorieTarget = TDEE * 0.95;
  }

  return {
    BMR: Math.round(BMR),
    TDEE: Math.round(TDEE),
    calorieTarget: Math.round(calorieTarget),
  };
}

// Euclidean distance calculation for recipe matching
export function calculateRecipeDistance(
  recipe: Recipe,
  targetCalories: number
): number {
  const recipeCalories = recipe.kalori;
  const calorieDifference = Math.abs(recipeCalories - targetCalories);

  // Normalize and calculate distance (simplified version)
  // In production, this would use all macros
  return calorieDifference / targetCalories;
}

// Filter recipes based on allergies
export function filterRecipesByAllergies(
  recipes: Recipe[],
  allergies: string[],
  allergyMap: Record<string, string[]>
): Recipe[] {
  if (!allergies || allergies.length === 0) return recipes;

  return recipes.filter((recipe) => {
    const recipeName = recipe["nama-makanan"].toLowerCase();

    for (const allergy of allergies) {
      const keywords = allergyMap[allergy] || [];
      for (const keyword of keywords) {
        if (recipeName.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }
    return true;
  });
}

// Get top N recommended recipes based on calorie target
export function getRecommendedRecipes(
  recipes: Recipe[],
  targetCalories: number,
  count: number = 9
): Recipe[] {
  const scored = recipes.map((recipe) => ({
    recipe,
    score: calculateRecipeDistance(recipe, targetCalories),
  }));

  // Sort by score (lower is better)
  scored.sort((a, b) => a.score - b.score);

  // Return top N recipes
  return scored.slice(0, count).map((s) => s.recipe);
}
