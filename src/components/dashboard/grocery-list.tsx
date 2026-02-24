"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/lib/store";
import { generateGroceryList } from "@/lib/recipe-utils";
import type { Recipe } from "@/types";

export function GroceryList() {
  const { favorites } = useAppStore();
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showList, setShowList] = useState(false);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipes((prev) => {
      const exists = prev.find((r) => r["nama-makanan"] === recipe["nama-makanan"]);
      if (exists) {
        return prev.filter((r) => r["nama-makanan"] !== recipe["nama-makanan"]);
      }
      return [...prev, recipe];
    });
  };

  const handleGenerateList = () => {
    setShowList(true);
  };

  const handleToggleItem = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleClearList = () => {
    setCheckedItems({});
    setSelectedRecipes([]);
    setShowList(false);
  };

  const groceryList = generateGroceryList(selectedRecipes);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          📝 Grocery List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipe Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Pilih resep untuk rencana harian:</p>
          
          {favorites.length > 0 ? (
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {favorites.map((recipe) => (
                <motion.div
                  key={recipe["nama-makanan"]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleSelectRecipe(recipe)}
                >
                  {selectedRecipes.find(
                    (r) => r["nama-makanan"] === recipe["nama-makanan"]
                  ) ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="text-sm flex-1">{recipe["nama-makanan"]}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Favorite-kan resep terlebih dahulu
            </p>
          )}
        </div>

        {/* Generate Button */}
        {selectedRecipes.length > 0 && (
          <Button
            onClick={handleGenerateList}
            className="w-full transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Plan My Day ({selectedRecipes.length} recipes)
          </Button>
        )}

        {/* Grocery List */}
        {showList && Object.keys(groceryList).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">🛒 Shopping List:</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearList}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              <div className="space-y-3">
                {Object.entries(groceryList).map(([category, items]) => (
                  <div key={category} className="space-y-1">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase">
                      {category}
                    </h5>
                    <div className="grid gap-1">
                      {items.map((item) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <Checkbox
                            checked={checkedItems[`${category}-${item}`]}
                            onCheckedChange={() =>
                              handleToggleItem(`${category}-${item}`)
                            }
                          />
                          <span
                            className={
                              checkedItems[`${category}-${item}`]
                                ? "line-through text-muted-foreground"
                                : ""
                            }
                          >
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="text-xs text-muted-foreground text-center">
              {Object.values(checkedItems).filter(Boolean).length} of{" "}
              {Object.values(groceryList).flat().length} items checked
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
