"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Header */}
      <header className="relative z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="RE FIT Logo" width={200} height={70} className="h-16 w-auto object-contain" />
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/login">{t.home.signIn}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Full Screen CTA */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Logo/Brand */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  RE FIT
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground font-light">
                {t.home.betterHealth}
              </p>
            </div>

            {/* Main CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button size="lg" asChild className="text-lg px-12 py-8 h-auto font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                <Link href="/onboarding">
                  {t.home.startYourJourney}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-12 py-8 h-auto hidden sm:inline-flex">
                <Link href="/login">
                  {t.home.signIn}
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <p className="text-3xl font-bold text-primary">9</p>
                <p className="text-sm text-muted-foreground">Personalized Recipes</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Customized</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-3xl font-bold text-primary">Free</p>
                <p className="text-sm text-muted-foreground">To Start</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">&copy; 2026 RE FIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
