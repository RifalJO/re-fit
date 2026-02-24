"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type FastingProtocol = "16:8" | "18:6" | "20:4";

interface FastingState {
  isActive: boolean;
  protocol: FastingProtocol;
  startTime: number | null;
  endTime: number | null;
}

export function IntermittentFastingTracker() {
  const [fasting, setFasting] = useState<FastingState>({
    isActive: false,
    protocol: "16:8",
    startTime: null,
    endTime: null,
  });

  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!fasting.isActive || !fasting.endTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = fasting.endTime! - now;

      if (remaining <= 0) {
        setFasting((prev) => ({ ...prev, isActive: false }));
        setTimeRemaining("Fasting completed!");
        setProgress(100);
        return;
      }

      // Calculate time remaining
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);

      // Calculate progress
      const total = fasting.endTime - fasting.startTime!;
      const elapsed = now - fasting.startTime!;
      setProgress((elapsed / total) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [fasting.isActive, fasting.endTime, fasting.startTime]);

  const startFasting = (protocol: FastingProtocol) => {
    const [fastHours] = protocol.split(":").map(Number);
    const startTime = Date.now();
    const endTime = startTime + fastHours * 60 * 60 * 1000;

    setFasting({
      isActive: true,
      protocol,
      startTime,
      endTime,
    });
  };

  const stopFasting = () => {
    setFasting({
      isActive: false,
      protocol: fasting.protocol,
      startTime: null,
      endTime: null,
    });
    setTimeRemaining("");
    setProgress(0);
  };

  const protocols: FastingProtocol[] = ["16:8", "18:6", "20:4"];

  // Calculate circumference for circular progress
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>⏰ Intermittent Fasting</span>
          {fasting.isActive && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {fasting.protocol}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {!fasting.isActive ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground text-center">
                Choose your fasting protocol:
              </p>

              <div className="grid grid-cols-3 gap-2">
                {protocols.map((protocol) => (
                  <Button
                    key={protocol}
                    onClick={() => startFasting(protocol)}
                    variant="outline"
                    className="flex flex-col h-auto py-3 transition-all duration-300 hover:scale-105 hover:border-primary"
                  >
                    <span className="text-lg font-bold">{protocol}</span>
                    <span className="text-xs text-muted-foreground">
                      {protocol === "16:8" && "16h fast / 8h eat"}
                      {protocol === "18:6" && "18h fast / 6h eat"}
                      {protocol === "20:4" && "20h fast / 4h eat"}
                    </span>
                  </Button>
                ))}
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>💡 <strong>16:8</strong> - Pemula friendly, mudah dijalani</p>
                <p>💡 <strong>18:6</strong> - Menengah, hasil lebih optimal</p>
                <p>💡 <strong>20:4</strong> - Advanced, hasil maksimal</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Circular Timer */}
              <div className="relative">
                <svg width="200" height="200" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="hsl(var(--primary))"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "linear" }}
                    strokeLinecap="round"
                    className="transition-colors duration-300"
                  />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    key={timeRemaining}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-primary"
                  >
                    {timeRemaining}
                  </motion.span>
                  <span className="text-xs text-muted-foreground mt-1">
                    remaining
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">
                  🍽️ Eating window opens in:
                </p>
                <p className="text-xs text-muted-foreground">
                  Stay strong! Your body is burning fat.
                </p>
              </div>

              {/* Stop button */}
              <Button
                onClick={stopFasting}
                variant="outline"
                size="sm"
                className="w-full transition-all duration-300 hover:scale-105"
              >
                <X className="h-4 w-4 mr-2" />
                Stop Fasting
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
