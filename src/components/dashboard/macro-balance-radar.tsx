"use client";

import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import type { Recipe } from "@/types";

interface MacroData {
  subject: string;
  target: number;
  actual: number;
  fullMark: number;
}

export function MacroBalanceRadar() {
  const { metrics, favorites } = useAppStore();

  // Calculate average macros from favorited recipes
  const averageFavoritesMacros = useMemo(() => {
    if (!favorites || favorites.length === 0) {
      return { protein: 0, carbohydrates: 0, fat: 0 };
    }

    const total = favorites.reduce(
      (acc, recipe) => ({
        protein: acc.protein + recipe.protein,
        carbohydrates: acc.carbohydrates + recipe.carbohydrate,
        fat: acc.fat + recipe.lemak,
      }),
      { protein: 0, carbohydrates: 0, fat: 0 }
    );

    return {
      protein: total.protein / favorites.length,
      carbohydrates: total.carbohydrates / favorites.length,
      fat: total.fat / favorites.length,
    };
  }, [favorites]);

  // Calculate insight message
  const insight = useMemo(() => {
    if (!metrics || favorites.length === 0) return null;

    const { protein, carbohydrates, fat } = averageFavoritesMacros;
    const targetPerMeal = {
      protein: metrics.calorieTarget * 0.3 / 4, // 30% calories from protein
      carbohydrates: metrics.calorieTarget * 0.45 / 4, // 45% from carbs
      fat: metrics.calorieTarget * 0.25 / 9, // 25% from fat
    };

    const diffs = {
      protein: ((protein - targetPerMeal.protein) / targetPerMeal.protein) * 100,
      carbohydrates: ((carbohydrates - targetPerMeal.carbohydrates) / targetPerMeal.carbohydrates) * 100,
      fat: ((fat - targetPerMeal.fat) / targetPerMeal.fat) * 100,
    };

    const highestDiff = Object.entries(diffs).reduce((a, b) => 
      Math.abs(b[1]) > Math.abs(a[1]) ? b : a
    );

    if (highestDiff[1] > 15) {
      const nutrient = highestDiff[0] === "protein" ? "Protein" : highestDiff[0] === "carbohydrates" ? "Karbohidrat" : "Lemak";
      return `⚠️ Resep favorit kamu ${Math.round(highestDiff[1])}% lebih tinggi dalam ${nutrient} dari target!`;
    } else if (highestDiff[1] < -15) {
      const nutrient = highestDiff[0] === "protein" ? "Protein" : highestDiff[0] === "carbohydrates" ? "Karbohidrat" : "Lemak";
      return `✅ Bagus! Resep favorit kamu seimbang dalam ${nutrient}.`;
    }

    return "✅ Resep favorit kamu cukup seimbang dengan target.";
  }, [metrics, favorites, averageFavoritesMacros]);

  // Prepare radar chart data
  const data: MacroData[] = useMemo(() => {
    if (!metrics) return [];

    const targetPerMeal = {
      protein: Math.round(metrics.calorieTarget * 0.3 / 4),
      carbohydrates: Math.round(metrics.calorieTarget * 0.45 / 4),
      fat: Math.round(metrics.calorieTarget * 0.25 / 9),
    };

    const maxVal = Math.max(
      targetPerMeal.protein,
      targetPerMeal.carbohydrates,
      targetPerMeal.fat,
      averageFavoritesMacros.protein,
      averageFavoritesMacros.carbohydrates,
      averageFavoritesMacros.fat
    );

    return [
      {
        subject: "Protein (g)",
        target: targetPerMeal.protein,
        actual: Math.round(averageFavoritesMacros.protein),
        fullMark: maxVal * 1.2,
      },
      {
        subject: "Karbohidrat (g)",
        target: targetPerMeal.carbohydrates,
        actual: Math.round(averageFavoritesMacros.carbohydrates),
        fullMark: maxVal * 1.2,
      },
      {
        subject: "Lemak (g)",
        target: targetPerMeal.fat,
        actual: Math.round(averageFavoritesMacros.fat),
        fullMark: maxVal * 1.2,
      },
    ];
  }, [metrics, averageFavoritesMacros]);

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎯 Macro Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Lengkapi onboarding untuk melihat analisis macro
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🎯 Macro Balance Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[300px]">
          {favorites.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, "auto"]} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                />
                <Radar
                  name="Target per Meal"
                  dataKey="target"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Favorite Average"
                  dataKey="actual"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip
                  formatter={(value) => [`${value}g`, "Amount"]}
                  contentStyle={{
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Favorite-kan resep untuk melihat analisis macro</p>
            </div>
          )}
        </div>

        {/* Insight */}
        {insight && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            {insight}
          </div>
        )}

        {/* Legend explanation */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Target per Meal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Favorite Average</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
