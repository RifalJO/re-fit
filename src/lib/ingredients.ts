// Ingredient mapping for food preferences
// Maps user-friendly categories to Indonesian ingredient keywords found in recipe names

import type { Recipe, IngredientCategory } from "@/types";

export const ingredientCategories = {
  // Protein sources
  ayam: {
    label: "Chicken",
    keywords: ["ayam", "chicken", "poultry", "unggas"],
  },
  sapi: {
    label: "Beef",
    keywords: ["sapi", "daging", "beef", "steak", "bistik", "paru", "lidah", "iga", "buntut"],
  },
  kambing: {
    label: "Goat/Lamb",
    keywords: ["kambing", "goat", "lamb", "domba"],
  },
  ikan: {
    label: "Fish",
    keywords: ["ikan", "tuna", "salmon", "teri", "bandeng", "kakap", "gurame", "patin", "mujair", "nila", "tongkol", "dori", "cakalang", "bawal", "coan coan", "kembung"],
  },
  udang: {
    label: "Shrimp/Prawns",
    keywords: ["udang", "shrimp", "prawn", "ebi", "rebon"],
  },
  cumi: {
    label: "Squid/Cuttlefish",
    keywords: ["cumi", "squid", "cuttlefish"],
  },
  kerang: {
    label: "Shellfish",
    keywords: ["kerang", "shellfish", "clam", "mussel", "siput"],
  },
  telur: {
    label: "Eggs",
    keywords: ["telur", "egg", "omelet", "omelette", "dadar", "orak arik", "ceplok", "fu yung hai"],
  },
  tahu: {
    label: "Tofu",
    keywords: ["tahu", "tofu", "tauhu"],
  },
  tempe: {
    label: "Tempeh",
    keywords: ["tempe", "tempeh"],
  },
  
  // Dish types
  soup: {
    label: "Soup",
    keywords: ["sup", "soup", "kaldu", "kuah", "soto", "tom yam", "tom yum"],
  },
  goreng: {
    label: "Fried",
    keywords: ["goreng", "fried", "crispy", "renyah"],
  },
  bakar: {
    label: "Grilled/BBQ",
    keywords: ["bakar", "grill", "bbq", "barbecue", "panggang"],
  },
  tumis: {
    label: "Stir-fried",
    keywords: ["tumis", "cah", "stir fry", "oseng", "cap cay", "cap cay"],
  },
  rebus: {
    label: "Boiled/Stewed",
    keywords: ["rebus", "boiled", "tim", "stew", "pindang"],
  },
  mie: {
    label: "Noodles",
    keywords: ["mie", "mi", "noodle", "noodles", "kwetiau", "kwetiaw", "bihun", "soun", "spaghetti", "makaroni", "pasta"],
  },
  nasi: {
    label: "Rice-based",
    keywords: ["nasi", "rice", "gorong", "bungkus"],
  },
  salad: {
    label: "Salad",
    keywords: ["salad", "sayur", "buah", "fresh"],
  },
  sate: {
    label: "Satay",
    keywords: ["sate", "satay", "skewer"],
  },
};

export interface IngredientPreference {
  category: IngredientCategory;
  label: string;
  keywords: string[];
}

// Helper function to get all ingredient preferences as array
export function getIngredientPreferences(): IngredientPreference[] {
  return Object.entries(ingredientCategories).map(([category, data]) => ({
    category: category as IngredientCategory,
    label: data.label,
    keywords: data.keywords,
  }));
}

// Filter recipes based on preferred ingredients
export function filterRecipesByIngredients(
  recipes: Recipe[],
  preferredIngredients: IngredientCategory[]
): Recipe[] {
  if (!preferredIngredients || preferredIngredients.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    const recipeName = (recipe["nama-makanan"] ?? recipe.title ?? "").toLowerCase();

    // Check if recipe name contains any of the preferred ingredient keywords
    for (const category of preferredIngredients) {
      const keywords = ingredientCategories[category]?.keywords || [];
      for (const keyword of keywords) {
        if (recipeName.includes(keyword.toLowerCase())) {
          return true;
        }
      }
    }

    return false;
  });
}

// Get ingredient categories from recipe name
export function getRecipeIngredients(recipeName: string): IngredientCategory[] {
  const name = recipeName.toLowerCase();
  const matched: IngredientCategory[] = [];

  for (const [category, data] of Object.entries(ingredientCategories)) {
    for (const keyword of data.keywords) {
      if (name.includes(keyword.toLowerCase())) {
        if (!matched.includes(category as IngredientCategory)) {
          matched.push(category as IngredientCategory);
        }
        break;
      }
    }
  }

  return matched;
}
