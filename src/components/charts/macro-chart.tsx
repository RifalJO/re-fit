"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface MacroChartProps {
  protein: number;
  carbohydrates: number;
  fat: number;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

// Colors matching the nutrient cards in recipe-card.tsx
// Protein: green-600, Carbs: blue-600, Fat: amber-600
const COLORS = {
  protein: "#16a34a",  // green-600 - matches Protein card
  carbohydrates: "#2563eb",  // blue-600 - matches Carbs card
  fat: "#d97706",  // amber-600 - matches Fat card
};

const DATA_COLORS = [COLORS.protein, COLORS.carbohydrates, COLORS.fat];

export function MacroChart({
  protein,
  carbohydrates,
  fat,
  size = "sm",
  showLabels = false,
}: MacroChartProps) {
  const data = [
    { name: "Protein", value: protein, color: COLORS.protein },
    { name: "Carbs", value: carbohydrates, color: COLORS.carbohydrates },
    { name: "Fat", value: fat, color: COLORS.fat },
  ];

  const dimensions = {
    sm: { height: 100, innerRadius: 25, outerRadius: 40 },
    md: { height: 150, innerRadius: 35, outerRadius: 55 },
    lg: { height: 200, innerRadius: 50, outerRadius: 75 },
  };

  const { height, innerRadius, outerRadius } = dimensions[size];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          dataKey="value"
          label={showLabels ? ({ percent }) => `${((percent || 0) * 100).toFixed(0)}%` : false}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={DATA_COLORS[index]} />
          ))}
        </Pie>
        {showLabels && (
          <Legend
            verticalAlign="bottom"
            height={20}
            formatter={(value) => (
              <span className="text-xs text-foreground">{value}</span>
            )}
          />
        )}
        <Tooltip
          formatter={(value) => [`${Number(value || 0).toFixed(1)}g`, "Amount"]}
          contentStyle={{
            fontSize: "12px",
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
