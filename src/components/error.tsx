"use client";

import Link from "next/link";
import { OctagonAlert } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { useTranslations } from "next-intl";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bricolage",
});

export function Error({ code }: { code: number }) {
  const t = useTranslations("error");
  const errorMessage = t(`${code}`) || "An error occurred.";
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <OctagonAlert className="h-10 w-10 mr-4" />
        <span
          className={`${bricolage.variable} font-bold text-5xl`}
          style={{ fontFamily: "var(--font-bricolage)" }}
        >
          {code}
        </span>
      </div>
      <p
        className={`${bricolage.variable} text-muted-foreground mb-6`}
        style={{ fontFamily: "var(--font-bricolage)" }}
      >
        {errorMessage}
      </p>
      <Link
        href="/"
        className={`${bricolage.variable} px-4 py-2 border rounded-md transition-colors shadow-sm hover:bg-primary/5`}
        style={{ fontFamily: "var(--font-bricolage)" }}
      >
        {t("go-to-homepage")}
      </Link>
    </div>
  );
}
