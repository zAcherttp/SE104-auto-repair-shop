import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import { Toaster } from "sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "../i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { ReactScan } from "../components/react-scan";
import { StrictMode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  let { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale;
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactScan />
        <StrictMode>
          <NextIntlClientProvider>
            <ThemeProvider
              enableSystem
              disableTransitionOnChange
              attribute="class"
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </StrictMode>
      </body>
    </html>
  );
}
