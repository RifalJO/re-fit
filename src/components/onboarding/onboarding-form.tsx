"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { onboardingSchema, type OnboardingFormData } from "./form-schema";
import { Step1Biometrics, Step2Lifestyle, Step3Health, Step4FoodPreferences } from "./form-steps";
import type { UserBiometrics, HealthConstraints, CalculatedMetrics, FoodPreferences } from "@/types";
import { ACTIVITY_MULTIPLIERS } from "@/types";
import { useI18n } from "@/lib/i18n";

export function OnboardingForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const setBiometrics = useAppStore((state) => state.setBiometrics);
  const setHealthConstraints = useAppStore((state) => state.setHealthConstraints);
  const setFoodPreferences = useAppStore((state) => state.setFoodPreferences);
  const setMetrics = useAppStore((state) => state.setMetrics);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      gender: "male",
      age: undefined,
      weight: undefined,
      height: undefined,
      activityLevel: "sedentary",
      isDiabetic: false,
      allergies: [],
      preferredIngredients: [],
    },
  });

  const steps = [
    { title: t.onboarding.biometrics, component: Step1Biometrics },
    { title: t.onboarding.lifestyle, component: Step2Lifestyle },
    { title: t.onboarding.health, component: Step3Health },
    { title: t.onboarding.foodPreferences, component: Step4FoodPreferences },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const onSubmit = async (data: OnboardingFormData) => {
    // Create biometrics object
    const biometrics: UserBiometrics = {
      gender: data.gender,
      age: data.age,
      weight: data.weight,
      height: data.height,
      activityLevel: data.activityLevel,
    };

    // Create health constraints object
    const healthConstraints: HealthConstraints = {
      isDiabetic: data.isDiabetic,
      allergies: data.allergies as HealthConstraints["allergies"],
    };

    // Create food preferences object
    const foodPreferences: FoodPreferences = {
      preferredIngredients: data.preferredIngredients as import("@/types").IngredientCategory[],
    };

    // Calculate BMR using Mifflin-St Jeor Equation
    let BMR = 10 * data.weight + 6.25 * data.height - 5 * data.age;
    BMR += data.gender === "male" ? 5 : -161;

    // Calculate TDEE
    const TDEE = BMR * ACTIVITY_MULTIPLIERS[data.activityLevel];

    // Adjust calorie target for diabetes
    const calorieTarget = data.isDiabetic ? TDEE * 0.95 : TDEE;

    const metrics: CalculatedMetrics = {
      BMR: Math.round(BMR),
      TDEE: Math.round(TDEE),
      calorieTarget: Math.round(calorieTarget),
    };

    // Save to local store (for immediate use)
    setBiometrics(biometrics);
    setHealthConstraints(healthConstraints);
    setFoodPreferences(foodPreferences);
    setMetrics(metrics);

    // Save to database (if authenticated)
    try {
      await fetch("/api/user/biometrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: data.gender,
          age: data.age,
          weight: data.weight,
          height: data.height,
          activityLevel: data.activityLevel,
          isDiabetic: data.isDiabetic,
          allergies: data.allergies,
          preferences: data.preferredIngredients,
        }),
      });
    } catch (error) {
      console.error("Failed to save biometrics to database:", error);
    }

    // Navigate to results
    router.push("/results");
  };

  const nextStep = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // Validate current step fields before proceeding
    const fieldsToValidate = [
      ["gender", "age", "weight", "height"], // Step 1
      ["activityLevel"], // Step 2
      ["isDiabetic", "allergies"], // Step 3
      [], // Step 4 (no validation needed, optional)
    ][currentStep];

    const isValid = await methods.trigger(fieldsToValidate as (keyof import("./form-schema").OnboardingFormData)[]);
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-8 animate-fade-in"
      >
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold transition-all duration-300">
              {t.onboarding.step} {currentStep + 1}: {steps[currentStep].title}
            </h2>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} {t.onboarding.of} {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 transition-all duration-500" />
        </div>

        <div className="rounded-lg border bg-card p-6 animate-scale-in shadow-md">
          <CurrentStepComponent />
        </div>

        <div className="flex justify-between animate-fade-in">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="transition-all duration-300 hover:scale-105"
          >
            {t.onboarding.previous}
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button type="submit" className="transition-all duration-300 hover:scale-105">
              {t.onboarding.getRecommendations}
            </Button>
          ) : (
            <Button type="button" onClick={nextStep} className="transition-all duration-300 hover:scale-105">
              {t.onboarding.next}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
