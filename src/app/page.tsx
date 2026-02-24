import Link from "next/link";
import { ArrowRight, Activity, Utensils, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
            <Image src="/logo.png" alt="RE FIT Logo" width={200} height={70} className="h-16 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
              How It Works
            </Link>
            <Button asChild className="transition-all duration-300 hover:scale-105">
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-slide-up">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium animate-scale-in shadow-sm">
              🎯 Personalized Nutrition Plans
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight transition-all duration-300">
                Your Personal Path to{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Better Health</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                RE FIT translates your biometric data into actionable, culturally relevant meal plans.
                Start your journey to a healthier you with personalized nutrition recommendations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" asChild className="text-lg px-8 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Link href="/onboarding">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 transition-all duration-300 hover:scale-105">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20 bg-muted/50 rounded-3xl animate-fade-in">
          <div className="text-center space-y-4 mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold transition-all duration-300">Why Choose RE FIT?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine science-backed nutrition calculations with delicious, culturally relevant recipes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto stagger-animation">
            <Card className="border-0 shadow-lg card-hover">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <Activity className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Biometric Analysis</h3>
                <p className="text-muted-foreground">
                  We calculate your BMR and TDEE using the Mifflin-St Jeor equation for precise calorie targets
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <Utensils className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Recommendations</h3>
                <p className="text-muted-foreground">
                  Euclidean distance algorithm matches you with recipes that fit your nutritional profile
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Allergy-Safe</h3>
                <p className="text-muted-foreground">
                  Advanced filtering ensures recipes are safe for your dietary restrictions and allergies
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="container mx-auto px-4 py-20 animate-fade-in">
          <div className="text-center space-y-4 mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold transition-all duration-300">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get personalized recipe recommendations in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto stagger-animation">
            {[
              {
                step: "1",
                title: "Enter Your Info",
                description: "Share your biometrics, activity level, and any health constraints",
              },
              {
                step: "2",
                title: "Get Calculations",
                description: "We calculate your BMR, TDEE, and optimal calorie target",
              },
              {
                step: "3",
                title: "Discover Recipes",
                description: "Receive 9 personalized recipe recommendations tailored to you",
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4 animate-scale-in">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold transition-transform duration-300 hover:scale-110">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold transition-all duration-300">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 animate-fade-in">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 text-center space-y-6 shadow-2xl animate-scale-in">
            <h2 className="text-3xl md:text-4xl font-bold transition-all duration-300">
              Ready to Transform Your Nutrition?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join RE FIT today and discover meals that are perfect for your body and lifestyle
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 transition-all duration-300 hover:scale-105 shadow-lg">
              <Link href="/onboarding">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col items-center space-y-4">
          <Image src="/logo.png" alt="RE FIT Logo" width={150} height={50} className="h-12 w-auto" />
          <p className="text-sm text-muted-foreground">&copy; 2026 RE FIT. Personalized Nutrition Platform.</p>
        </div>
      </footer>
    </div>
  );
}
