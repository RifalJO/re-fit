"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface HydrationState {
  current: number; // ml
  target: number; // ml
  logs: { time: number; amount: number }[];
}

export function HydrationTracker() {
  const { biometrics } = useAppStore();
  
  const [hydration, setHydration] = useState<HydrationState>({
    current: 0,
    target: 2000, // Default 2L
    logs: [],
  });

  // Calculate personalized water target based on weight
  useEffect(() => {
    if (biometrics?.weight) {
      // Formula: weight (kg) * 35ml
      const target = Math.round(biometrics.weight * 35);
      setHydration((prev) => ({ ...prev, target }));
    }
  }, [biometrics?.weight]);

  const addWater = (amount: number) => {
    setHydration((prev) => ({
      ...prev,
      current: Math.min(prev.current + amount, prev.target),
      logs: [...prev.logs, { time: Date.now(), amount }],
    }));
  };

  const removeWater = (amount: number) => {
    setHydration((prev) => ({
      ...prev,
      current: Math.max(prev.current - amount, 0),
    }));
  };

  const resetHydration = () => {
    setHydration((prev) => ({
      ...prev,
      current: 0,
      logs: [],
    }));
  };

  const percentage = Math.round((hydration.current / hydration.target) * 100);
  const isComplete = hydration.current >= hydration.target;

  // Wave animation variants
  const waveVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 0.3,
      transition: { duration: 2, ease: "easeInOut" }
    },
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            💧 Hydration Tracker
          </span>
          {isComplete && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-green-500 text-white px-2 py-1 rounded-full"
            >
              ✓ Target reached!
            </motion.span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Wave Animation Background */}
        <div className="relative h-32 rounded-lg overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"
              fill="hsl(200, 80%, 50%)"
              variants={waveVariants}
              initial="initial"
              animate="animate"
              style={{
                transform: `translateY(${100 - percentage}%)`,
                transition: "transform 0.5s ease-out",
              }}
            />
          </svg>

          {/* Current amount display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={hydration.current}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {hydration.current}
              </span>
              <span className="text-sm text-blue-500 dark:text-blue-300 ml-1">
                / {hydration.target} ml
              </span>
            </motion.div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-3 transition-all duration-500"
          />
          <p className="text-xs text-muted-foreground text-center">
            {percentage}% of daily target
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => addWater(250)}
            variant="outline"
            size="sm"
            className="transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-1" />
            250ml
          </Button>
          <Button
            onClick={() => addWater(500)}
            variant="outline"
            size="sm"
            className="transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-1" />
            500ml
          </Button>
          <Button
            onClick={() => removeWater(250)}
            variant="outline"
            size="sm"
            disabled={hydration.current === 0}
            className="transition-all duration-300 hover:scale-105"
          >
            <Minus className="h-4 w-4 mr-1" />
            250ml
          </Button>
        </div>

        {/* Quick tips */}
        <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 rounded-lg p-3">
          <p>💡 <strong>Target kamu:</strong> {hydration.target}ml/hari (based on {biometrics?.weight}kg)</p>
          <p>🕐 <strong>Best times:</strong> Pagi (500ml), Sebelum makan (250ml), Setelah olahraga (500ml)</p>
        </div>

        {/* Reset button */}
        {hydration.logs.length > 0 && (
          <Button
            onClick={resetHydration}
            variant="ghost"
            size="sm"
            className="w-full transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Today
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
