"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import type { ActivityLevel } from "@/types";
import { ACTIVITY_LABELS } from "@/types";
import { getIngredientPreferences } from "@/lib/ingredients";
import { useI18n } from "@/lib/i18n";

export function Step1Biometrics() {
  const form = useFormContext();
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t.onboarding.biometrics}</h3>
        <p className="text-sm text-muted-foreground">
          {t.onboarding.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.gender}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t.onboarding.gender} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">{t.onboarding.male}</SelectItem>
                  <SelectItem value="female">{t.onboarding.female}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.age}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="25"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.weight} (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="70"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.onboarding.height} (cm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="170"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function Step2Lifestyle() {
  const form = useFormContext();
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t.onboarding.lifestyle}</h3>
        <p className="text-sm text-muted-foreground">
          {t.onboarding.activityLevel}
        </p>
      </div>

      <FormField
        control={form.control}
        name="activityLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.onboarding.activityLevel}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t.onboarding.activityLevel} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                  <SelectItem key={level} value={level}>
                    {ACTIVITY_LABELS[level]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export function Step3Health() {
  const form = useFormContext();
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t.onboarding.health}</h3>
        <p className="text-sm text-muted-foreground">
          {t.onboarding.allergiesDescription}
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="isDiabetic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">{t.onboarding.isDiabetic}</FormLabel>
                <p className="text-sm text-muted-foreground">
                  {t.onboarding.isDiabetic}
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={() => (
            <FormItem>
              <FormLabel>{t.onboarding.allergies}</FormLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "telur", label: "Telur" },
                  { value: "susu", label: "Susu" },
                  { value: "kacang", label: "Kacang-kacangan" },
                  { value: "udang", label: "Udang/Seafood" },
                  { value: "ikan", label: "Ikan" },
                  { value: "gluten", label: "Gluten/Gandum" },
                ].map((allergy) => (
                  <FormField
                    key={allergy.value}
                    control={form.control}
                    name="allergies"
                    render={({ field: innerField }) => (
                      <FormItem
                        className="flex flex-row items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={innerField.value?.includes(allergy.value)}
                            onCheckedChange={(checked) => {
                              const current = innerField.value || [];
                              if (checked) {
                                innerField.onChange([...current, allergy.value]);
                              } else {
                                innerField.onChange(
                                  current.filter((a: string) => a !== allergy.value)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{allergy.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function Step4FoodPreferences() {
  const form = useFormContext();
  const { t } = useI18n();
  const ingredientPreferences = getIngredientPreferences();

  // Group ingredients by category
  const proteinSources = ingredientPreferences.filter((p) =>
    ["ayam", "sapi", "kambing", "ikan", "udang", "cumi", "kerang", "telur", "tahu", "tempe"].includes(
      p.category
    )
  );
  const dishTypes = ingredientPreferences.filter((p) =>
    ["soup", "goreng", "bakar", "tumis", "rebus", "mie", "nasi", "salad", "sate"].includes(p.category)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t.onboarding.foodPreferences}</h3>
        <p className="text-sm text-muted-foreground">
          {t.onboarding.preferredIngredientsDescription}
        </p>
      </div>

      <div className="space-y-6">
        {/* Protein Sources */}
        <div className="space-y-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Sumber Protein
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {proteinSources.map((ingredient) => (
              <FormField
                key={ingredient.category}
                control={form.control}
                name="preferredIngredients"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(ingredient.category)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, ingredient.category]);
                          } else {
                            field.onChange(
                              current.filter((c: string) => c !== ingredient.category)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{ingredient.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Dish Types */}
        <div className="space-y-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Jenis Masakan
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dishTypes.map((dish) => (
              <FormField
                key={dish.category}
                control={form.control}
                name="preferredIngredients"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(dish.category)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, dish.category]);
                          } else {
                            field.onChange(
                              current.filter((c: string) => c !== dish.category)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{dish.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Info note */}
        <div className="rounded-lg bg-primary/10 p-4 text-sm text-primary">
          <p>
            💡 Tip: Pilih beberapa opsi untuk mendapatkan rekomendasi yang beragam. Kosongkan untuk semua opsi.
          </p>
        </div>
      </div>
    </div>
  );
}
