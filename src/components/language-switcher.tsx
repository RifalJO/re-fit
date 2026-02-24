"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const locales: { value: Locale; label: string; flag: string }[] = [
    { value: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLocale = locales.find((l) => l.value === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLocale?.flag}</span>
          <span className="hidden md:inline text-sm font-medium">
            {currentLocale?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.value}
            onClick={() => setLocale(loc.value)}
            className="flex items-center gap-3 cursor-pointer transition-colors duration-200 hover:bg-muted"
          >
            <span className="text-xl">{loc.flag}</span>
            <span className="font-medium">{loc.label}</span>
            {locale === loc.value && (
              <span className="ml-auto text-primary text-sm font-semibold">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
