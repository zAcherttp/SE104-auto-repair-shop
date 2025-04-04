import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/src/components/login/login-form";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-poppins",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.login" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LoginPage() {
  const t = useTranslations("global");
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center ">
          <div className="bg-primary text-foreground flex size-9 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span
            className={`${poppins.variable} font-semibold text-4xl text-foreground`}
          >
            {t("app-name")}
          </span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
