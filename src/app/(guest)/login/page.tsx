"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.auth.invalidCredentials);
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t.auth.somethingWentWrong);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
            <Image src="/logo.png" alt="RE FIT Logo" width={200} height={70} className="h-16 w-auto object-contain" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{t.auth.login}</CardTitle>
            <CardDescription>
              {t.auth.signIn} to your RE FIT account to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-white bg-destructive rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full transition-all duration-300 hover:scale-105" disabled={isLoading}>
                {isLoading ? t.common.loading : t.auth.signIn}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                {t.auth.dontHaveAccount}{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  {t.auth.signUp}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col items-center space-y-4">
          <Image src="/logo.png" alt="RE FIT Logo" width={100} height={35} className="h-8 w-auto opacity-80" />
          <p className="text-sm text-muted-foreground">&copy; 2026 RE FIT. {t.home.footerText}</p>
        </div>
      </footer>
    </div>
  );
}
