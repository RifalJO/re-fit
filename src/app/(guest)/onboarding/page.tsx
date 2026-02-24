import Link from "next/link";
import Image from "next/image";
import { OnboardingForm } from "@/components/onboarding";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="RE FIT Logo" width={200} height={70} className="h-16 w-auto object-contain" />
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
        <div className="container mx-auto px-4 flex flex-col items-center space-y-4">
          <Image src="/logo.png" alt="RE FIT Logo" width={100} height={35} className="h-8 w-auto opacity-80" />
          <p className="text-sm text-muted-foreground">Step 1 of your journey to better health</p>
        </div>
      </footer>
    </div>
  );
}
