// Legacy Recipe type (for backward compatibility)
export interface LegacyRecipe {
  "nama-makanan": string;
  kalori: number;
  protein: number;
  karbohidrat: number;
  lemak: number;
  serat: number;
  link: string;
}

// New Recipe type with feature engineering fields
export interface Recipe {
  id?: string;
  title?: string;
  "nama-makanan"?: string;
  url?: string;
  category?: string | null;
  cookingTime?: number | null;
  portion?: number | null;
  ingredients?: string;
  steps?: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  karbohidrat?: number | null;
  fat?: number | null;
  lemak?: number | null;
  serat?: number;
  imageUrl?: string;
  dietType?: DietType | null;
  prepDifficulty?: PrepDifficulty | null;
  estimatedCostLevel?: CostLevel | null;
  suitableFor?: MealType | null;
  link?: string;
  kalori?: number;
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

export type AllergyType = "telur" | "susu" | "kacang" | "udang" | "ikan" | "gluten";

export type IngredientCategory =
  | "ayam"
  | "sapi"
  | "kambing"
  | "ikan"
  | "udang"
  | "cumi"
  | "kerang"
  | "telur"
  | "tahu"
  | "tempe"
  | "soup"
  | "goreng"
  | "bakar"
  | "tumis"
  | "rebus"
  | "mie"
  | "nasi"
  | "salad"
  | "sate";

export interface AllergyMap {
  telur: string[];
  susu: string[];
  kacang: string[];
  udang: string[];
  ikan: string[];
  gluten: string[];
}

export type Gender = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export interface UserBiometrics {
  gender: Gender;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  activityLevel: ActivityLevel;
}

export interface HealthConstraints {
  isDiabetic: boolean;
  allergies: AllergyType[];
}

export interface FoodPreferences {
  preferredIngredients: IngredientCategory[];
}

export interface CalculatedMetrics {
  BMR: number;
  TDEE: number;
  calorieTarget: number;
}

export interface AppState {
  // Form state
  biometrics: UserBiometrics | null;
  healthConstraints: HealthConstraints | null;
  foodPreferences: FoodPreferences | null;

  // Calculated metrics
  metrics: CalculatedMetrics | null;

  // Results
  recommendations: Recipe[];

  // Member features
  favorites: Recipe[];
  weightHistory: { date: string; weight: number }[];

  // Actions
  setBiometrics: (biometrics: UserBiometrics) => void;
  setHealthConstraints: (constraints: HealthConstraints) => void;
  setFoodPreferences: (preferences: FoodPreferences) => void;
  setMetrics: (metrics: CalculatedMetrics) => void;
  setRecommendations: (recipes: Recipe[]) => void;
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (recipeName: string) => void;
  addWeightEntry: (weight: number, date?: string) => void;
  resetState: () => void;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedenter (jarang olahraga)",
  lightly_active: "Ringan (olahraga 1-3 hari/minggu)",
  moderately_active: "Sedang (olahraga 3-5 hari/minggu)",
  very_active: "Berat (olahraga 6-7 hari/minggu)",
  extra_active: "Ekstra (olahraga 2x sehari)",
};
