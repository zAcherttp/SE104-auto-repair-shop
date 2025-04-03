import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "../i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";

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
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    // TODO: what should i put here?
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider
            enableSystem
            disableTransitionOnChange
            attribute="class"
            defaultTheme="dark"
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
