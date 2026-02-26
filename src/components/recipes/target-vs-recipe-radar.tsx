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

interface TargetVsRecipeRadarProps {
  recipe: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dailyTarget: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface ChartData {
  subject: string;
  recipe: number;
  target: number;
  percentage: number;
  fullMark: number;
}

export function TargetVsRecipeRadar({ recipe, dailyTarget }: TargetVsRecipeRadarProps) {
  const data: ChartData[] = useMemo(() => {
    // Calculate percentages
    const caloriePercentage = (recipe.calories / dailyTarget.calories) * 100;
    const proteinPercentage = (recipe.protein / dailyTarget.protein) * 100;
    const carbsPercentage = (recipe.carbs / dailyTarget.carbs) * 100;
    const fatPercentage = (recipe.fat / dailyTarget.fat) * 100;

    // Find the maximum value for scaling
    const maxValue = Math.max(
      recipe.calories,
      dailyTarget.calories,
      recipe.protein,
      dailyTarget.protein,
      recipe.carbs,
      dailyTarget.carbs,
      recipe.fat,
      dailyTarget.fat
    );

    return [
      {
        subject: "Calories",
        recipe: recipe.calories,
        target: dailyTarget.calories,
        percentage: caloriePercentage,
        fullMark: maxValue * 1.2,
      },
      {
        subject: "Protein (g)",
        recipe: recipe.protein,
        target: dailyTarget.protein,
        percentage: proteinPercentage,
        fullMark: maxValue * 1.2,
      },
      {
        subject: "Carbs (g)",
        recipe: recipe.carbs,
        target: dailyTarget.carbs,
        percentage: carbsPercentage,
        fullMark: maxValue * 1.2,
      },
      {
        subject: "Fat (g)",
        recipe: recipe.fat,
        target: dailyTarget.fat,
        percentage: fatPercentage,
        fullMark: maxValue * 1.2,
      },
    ];
  }, [recipe, dailyTarget]);

  // Calculate overall insight
  const avgPercentage = useMemo(() => {
    const percentages = data.map(d => d.percentage);
    return percentages.reduce((a, b) => a + b, 0) / percentages.length;
  }, [data]);

  const getInsightMessage = () => {
    if (avgPercentage > 100) {
      return {
        text: "⚠️ This recipe exceeds your daily targets!",
        color: "text-red-600",
      };
    } else if (avgPercentage > 75) {
      return {
        text: "✅ This is a substantial meal that covers most of your daily needs.",
        color: "text-green-600",
      };
    } else if (avgPercentage > 50) {
      return {
        text: "👍 This is a well-balanced meal for your daily targets.",
        color: "text-blue-600",
      };
    } else {
      return {
        text: "💡 This is a light meal. You may want to pair it with other foods.",
        color: "text-amber-600",
      };
    }
  };

  const insight = getInsightMessage();

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
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
              name="Daily Target"
              dataKey="target"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <Radar
              name="This Recipe"
              dataKey="recipe"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.3}
            />
            <Legend />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === "This Recipe") {
                  const percentage = data[props?.index ?? 0]?.percentage.toFixed(1);
                  return [`${value} (${percentage}% of target)`, "Amount"];
                }
                return [`${value}`, "Amount"];
              }}
              contentStyle={{
                fontSize: "12px",
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Message */}
      <div className={cn("text-sm font-medium", insight.color)}>
        {insight.text}
      </div>

      {/* Percentage Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-muted/50 text-center"
          >
            <p className="text-xs text-muted-foreground mb-1">{item.subject}</p>
            <p className="text-lg font-bold">{item.percentage.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              of daily target
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
