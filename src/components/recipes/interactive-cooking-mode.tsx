"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChefHat, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface InteractiveCookingModeProps {
  recipeTitle: string;
  steps: string;
  cookingTime?: number | null;
  portion?: number | null;
  onComplete?: () => void;
}

export function InteractiveCookingMode({
  recipeTitle,
  steps,
  cookingTime,
  portion,
  onComplete,
}: InteractiveCookingModeProps) {
  // Parse steps into array (handle both numbered and bullet formats)
  const parseSteps = (stepsText: string): string[] => {
    // Try to split by common step delimiters
    const stepPatterns = [
      /\d+\.\s*/g, // "1. ", "2. "
      /Step \d+:\s*/gi, // "Step 1: ", "Step 2: "
      /\n-\s*/g, // "\n- "
      /\n\*\s*/g, // "\n* "
      /\n\d+\)/g, // "\n1) "
    ];

    let cleanedSteps = stepsText.trim();
    
    // Remove common prefixes
    cleanedSteps = cleanedSteps.replace(/^(Instructions:|Directions:|Cara Membuat:|Langkah:)\s*/i, "");
    
    // Split by the first matching pattern
    for (const pattern of stepPatterns) {
      if (pattern.test(cleanedSteps)) {
        const parts = cleanedSteps.split(pattern);
        return parts.filter(s => s.trim().length > 0).map(s => s.trim());
      }
    }

    // Fallback: split by newlines
    return cleanedSteps.split('\n').filter(s => s.trim().length > 0).map(s => s.trim());
  };

  const stepArray = parseSteps(steps);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const progress = ((currentStep + 1) / stepArray.length) * 100;

  const handleNext = () => {
    if (currentStep < stepArray.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Cooking Mode</h2>
            </div>
            <div className="text-sm opacity-90">
              Step {currentStep + 1} of {stepArray.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <Progress value={progress} className="h-2" />
          
          <div className="mt-2 text-sm opacity-90">
            {recipeTitle}
            {cookingTime && (
              <span className="ml-4">⏱️ {cookingTime} min</span>
            )}
            {portion && (
              <span className="ml-4">🍽️ {portion} portions</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Step Carousel */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
        <Card className="w-full max-w-3xl shadow-2xl">
          <CardContent className="p-6 md:p-10">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {stepArray.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "bg-primary scale-125"
                      : completedSteps.has(index)
                      ? "bg-green-500"
                      : "bg-muted hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Current step content */}
            <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-3xl font-bold mb-4">
                  {currentStep + 1}
                </span>
              </div>
              
              <p className="text-lg md:text-xl leading-relaxed text-foreground max-w-2xl">
                {stepArray[currentStep]}
              </p>

              {/* Completion checkbox */}
              <div className="mt-8">
                <Button
                  variant={completedSteps.has(currentStep) ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleStepComplete(currentStep)}
                  className={cn(
                    "gap-2 transition-all duration-300",
                    completedSteps.has(currentStep) && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  <CheckCircle2 className={cn(
                    "h-5 w-5",
                    completedSteps.has(currentStep) ? "fill-white" : ""
                  )} />
                  {completedSteps.has(currentStep) ? "Completed!" : "Mark as Complete"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="border-t bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>

          {currentStep === stepArray.length - 1 ? (
            <Button
              variant="default"
              size="lg"
              onClick={handleFinish}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-5 w-5" />
              Finish Cooking
            </Button>
          ) : (
            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Step overview (optional - shows all steps in small preview) */}
      <div className="border-t bg-muted/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stepArray.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "flex-shrink-0 px-3 py-2 rounded-lg text-xs transition-all duration-200",
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted",
                  completedSteps.has(index) && "ring-2 ring-green-500"
                )}
              >
                <span className="font-semibold">Step {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
