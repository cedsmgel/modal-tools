import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Modal Tools — Enterprise Edge Financial Platform",
  description: "Next.js & Cloudflare Edge Powered Asset & Financial Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-white font-sans text-zinc-950 antialiased selection:bg-zinc-900 selection:text-white dark:bg-zinc-950 dark:text-zinc-50 dark:selection:bg-zinc-100 dark:selection:text-zinc-900 flex flex-col">
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          localization={ptBR}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
