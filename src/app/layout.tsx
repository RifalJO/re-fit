import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { I18nProvider } from "@/lib/i18n";
import { RouterProvider } from "@/contexts/router-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RE FIT - Personalized Nutrition",
  description: "Democratize personalized nutrition by translating biometric data into actionable meal plans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            <RouterProvider>{children}</RouterProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
