import Link from "next/link";
import { ArrowRight, Heart, Activity, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RE FIT</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary">
              How It Works
            </Link>
            <Button asChild>
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              🎯 Personalized Nutrition Plans
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Personal Path to{" "}
              <span className="text-primary">Better Health</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              RE FIT translates your biometric data into actionable, culturally relevant meal plans. 
              Start your journey to a healthier you with personalized nutrition recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/onboarding">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20 bg-muted/50 rounded-3xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Why Choose RE FIT?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine science-backed nutrition calculations with delicious, culturally relevant recipes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Biometric Analysis</h3>
                <p className="text-muted-foreground">
                  We calculate your BMR and TDEE using the Mifflin-St Jeor equation for precise calorie targets
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Utensils className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Recommendations</h3>
                <p className="text-muted-foreground">
                  Euclidean distance algorithm matches you with recipes that fit your nutritional profile
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
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
        <section id="how-it-works" className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get personalized recipe recommendations in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
              <div key={item.step} className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Nutrition?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join RE FIT today and discover meals that are perfect for your body and lifestyle
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
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
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 RE FIT. Personalized Nutrition Platform.</p>
        </div>
      </footer>
    </div>
  );
}
