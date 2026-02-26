/**
 * Recipe Types
 */

export interface Recipe {
  id: string;
  title: string;
  url: string;
  category: string | null;
  cookingTime: number | null;
  portion: number | null;
  ingredients: string;
  steps: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  imageUrl: string;
  dietType: DietType | null;
  prepDifficulty: PrepDifficulty | null;
  estimatedCostLevel: CostLevel | null;
  suitableFor: MealType | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DietType = 
  | 'Keto-Friendly'
  | 'High-Protein'
  | 'Low-Calories'
  | 'Regular'
  | 'Uncategorized';

export type PrepDifficulty = 
  | 'Easy'
  | 'Medium'
  | 'Hard';

export type CostLevel = 
  | '$'
  | '$$'
  | '$$$';

export type MealType = 
  | 'Breakfast'
  | 'Main Course'
  | 'Snack';

export interface RecipeFilters {
  dietType?: DietType;
  prepDifficulty?: PrepDifficulty;
  estimatedCostLevel?: CostLevel;
  suitableFor?: MealType;
  category?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

export interface RecipeApiResponse {
  success: boolean;
  count: number;
  data: Recipe[];
  error?: string;
}
