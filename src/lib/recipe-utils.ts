import type { Recipe } from "@/types";

/**
 * Calculate Euclidean distance between two recipes based on macros
 */
export function euclideanDistance(recipe1: Recipe, recipe2: Recipe): number {
  const proteinDiff = recipe1.protein - recipe2.protein;
  const carbDiff = recipe1.karbohidrat - recipe2.karbohidrat;
  const fatDiff = recipe1.lemak - recipe2.lemak;

  return Math.sqrt(
    proteinDiff * proteinDiff +
    carbDiff * carbDiff +
    fatDiff * fatDiff
  );
}

/**
 * Find K-Nearest Neighbors for a given recipe
 * Returns recipes with similar protein but varying carb/fat profiles
 */
export function findKNearestNeighbors(
  targetRecipe: Recipe,
  allRecipes: Recipe[],
  k: number = 3
): Recipe[] {
  // Calculate distances for all recipes
  const recipesWithDistance = allRecipes
    .filter((recipe) => recipe["nama-makanan"] !== targetRecipe["nama-makanan"])
    .map((recipe) => ({
      recipe,
      distance: euclideanDistance(targetRecipe, recipe),
      proteinDiff: Math.abs(recipe.protein - targetRecipe.protein),
    }));

  // Filter recipes with similar protein (within 20%)
  const similarProtein = recipesWithDistance.filter(
    (r) => r.proteinDiff <= targetRecipe.protein * 0.2
  );

  // Sort by distance and take top K
  const neighbors = similarProtein
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k)
    .map((r) => r.recipe);

  return neighbors;
}

/**
 * Get alternative recipes (2nd and 3rd nearest neighbors)
 * These maintain protein level but offer different carb/fat profiles
 */
export function getAlternativeRecipes(
  targetRecipe: Recipe,
  allRecipes: Recipe[]
): Recipe[] {
  const neighbors = findKNearestNeighbors(targetRecipe, allRecipes, 5);
  
  // Return 2nd and 3rd neighbors (skip the closest one which is already shown)
  return neighbors.slice(1, 3);
}

/**
 * Get random recipes for discovery
 */
export function getRandomRecipes(
  allRecipes: Recipe[],
  count: number = 3
): Recipe[] {
  const shuffled = [...allRecipes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Extract ingredients from recipe name
 * This is a simple implementation - in production you'd want NLP
 */
export function extractIngredients(recipeName: string): string[] {
  // Common Indonesian ingredients
  const ingredientMap: Record<string, string[]> = {
    "ayam": ["ayam", "daging ayam"],
    "sapi": ["daging sapi", "sapi"],
    "ikan": ["ikan", "daging ikan"],
    "udang": ["udang"],
    "telur": ["telur"],
    "tahu": ["tahu"],
    "tempe": ["tempe"],
    "nasi": ["nasi", "beras"],
    "mie": ["mie", "mi", "tepung terigu"],
    "soto": ["bumbu soto", "kunyit", "jahe"],
    "gado": ["kacang tanah", "sayuran"],
    "gado-gado": ["kacang tanah", "sayuran", "tahu", "tempe", "telur"],
    "bakar": ["kecap manis", "bumbu bakar"],
    "goreng": ["minyak goreng", "tepung"],
    "soup": ["kaldu", "sayuran"],
    "sayur": ["sayuran", "santan"],
    "rendang": ["daging sapi", "santan", "bumbu rendang"],
    "sate": ["daging", "bumbu kacang", "kecap manis"],
    "pecel": ["kacang tanah", "sayuran", "bumbu pecel"],
  };

  const ingredients: string[] = [];
  const lowerName = recipeName.toLowerCase();

  Object.entries(ingredientMap).forEach(([keyword, items]) => {
    if (lowerName.includes(keyword)) {
      ingredients.push(...items);
    }
  });

  // If no ingredients found, return the recipe name itself
  if (ingredients.length === 0) {
    ingredients.push(recipeName.toLowerCase());
  }

  return Array.from(new Set(ingredients)); // Remove duplicates
}

/**
 * Generate grocery list from selected recipes
 */
export function generateGroceryList(recipes: Recipe[]): Record<string, string[]> {
  const ingredientMap: Record<string, string[]> = {};

  recipes.forEach((recipe) => {
    const ingredients = extractIngredients(recipe["nama-makanan"]);
    
    ingredients.forEach((ingredient) => {
      // Categorize ingredients
      const category = categorizeIngredient(ingredient);
      
      if (!ingredientMap[category]) {
        ingredientMap[category] = [];
      }
      
      if (!ingredientMap[category].includes(ingredient)) {
        ingredientMap[category].push(ingredient);
      }
    });
  });

  return ingredientMap;
}

/**
 * Categorize ingredients for shopping list
 */
function categorizeIngredient(ingredient: string): string {
  const categories: Record<string, string[]> = {
    "Protein": ["ayam", "sapi", "ikan", "udang", "telur", "daging"],
    "Tahu & Tempe": ["tahu", "tempe"],
    "Sayuran": ["sayur", "sayuran", "kangkung", "bayam", "kol"],
    "Bumbu": ["bumbu", "kunyit", "jahe", "kencur", "lengkuas"],
    "Kacang-kacangan": ["kacang"],
    "Karbohidrat": ["nasi", "beras", "mie", "mi", "tepung"],
    "Minyak & Santan": ["minyak", "santan"],
    "Kecap & Saus": ["kecap"],
    "Lainnya": [],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((kw) => ingredient.includes(kw))) {
      return category;
    }
  }

  return "Lainnya";
}
