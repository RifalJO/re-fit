import { z } from "zod";

export const onboardingSchema = z.object({
  gender: z.enum(["male", "female"], {
    message: "Please select a gender",
  }),
  age: z
    .number({
      message: "Age must be a number",
    })
    .min(10, "Age must be at least 10")
    .max(120, "Age must be less than 120"),
  weight: z
    .number({
      message: "Weight must be a number",
    })
    .min(20, "Weight must be at least 20 kg")
    .max(300, "Weight must be less than 300 kg"),
  height: z
    .number({
      message: "Height must be a number",
    })
    .min(50, "Height must be at least 50 cm")
    .max(250, "Height must be less than 250 cm"),
  activityLevel: z.enum(
    ["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"],
    {
      message: "Please select an activity level",
    }
  ),
  isDiabetic: z.boolean(),
  allergies: z.array(z.string()),
  preferredIngredients: z.array(z.string()),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
