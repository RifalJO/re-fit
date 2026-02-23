import Link from "next/link";
import { Heart } from "lucide-react";
import { OnboardingForm } from "@/components/onboarding";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RE FIT</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Let&apos;s Get to Know You</h1>
            <p className="text-muted-foreground">
              Answer a few questions so we can personalize your nutrition plan
            </p>
          </div>

          <OnboardingForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Step 1 of your journey to better health</p>
        </div>
      </footer>
    </div>
  );
}
