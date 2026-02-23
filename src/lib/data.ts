import type { Recipe, AllergyMap } from "@/types";

export async function loadRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch("/data/data_makanan.csv");
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error("Error loading recipes:", error);
    return [];
  }
}

export async function loadAllergyMap(): Promise<AllergyMap> {
  try {
    const response = await fetch("/data/kamus_bahan.json");
    return await response.json();
  } catch (error) {
    console.error("Error loading allergy map:", error);
    return {} as AllergyMap;
  }
}

function parseCSV(csvText: string): Recipe[] {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    
    const recipe: Recipe = {
      "nama-makanan": "",
      kalori: 0,
      protein: 0,
      karbohidrat: 0,
      lemak: 0,
      serat: 0,
      link: "",
    };

    headers.forEach((header, index) => {
      const value = values[index] || "";
      const key = header as keyof Recipe;
      // Convert numeric fields
      if (["kalori", "protein", "karbohidrat", "lemak", "serat"].includes(header)) {
        recipe[key] = (parseFloat(value) || 0) as never;
      } else {
        recipe[key] = value as never;
      }
    });

    return recipe;
  });
}

// Handle CSV lines that might contain commas in values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Filter recipes based on allergies
export function filterRecipesByAllergies(
  recipes: Recipe[],
  allergies: string[],
  allergyMap: AllergyMap
): Recipe[] {
  if (!allergies || allergies.length === 0) return recipes;

  return recipes.filter((recipe) => {
    const recipeName = recipe["nama-makanan"].toLowerCase();

    for (const allergy of allergies) {
      const keywords = allergyMap[allergy as keyof AllergyMap] || [];
      for (const keyword of keywords) {
        if (recipeName.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }
    return true;
  });
}

// Calculate Euclidean distance for recipe matching
export function calculateRecipeDistance(
  recipe: Recipe,
  targetCalories: number,
  targetProtein?: number,
  targetCarbs?: number,
  targetFat?: number
): number {
  // Normalize values (simplified approach)
  const calorieDiff = Math.abs(recipe.kalori - targetCalories) / targetCalories;

  // If macro targets are provided, include them in the calculation
  if (targetProtein && targetCarbs && targetFat) {
    const proteinDiff = Math.abs(recipe.protein - targetProtein) / targetProtein;
    const carbsDiff = Math.abs(recipe.karbohidrat - targetCarbs) / targetCarbs;
    const fatDiff = Math.abs(recipe.lemak - targetFat) / targetFat;

    // Weighted average (calories most important)
    return calorieDiff * 0.5 + proteinDiff * 0.2 + carbsDiff * 0.2 + fatDiff * 0.1;
  }

  return calorieDiff;
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
