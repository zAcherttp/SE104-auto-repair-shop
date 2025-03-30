import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/src/components/login/login-form";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

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
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {t("app-name")}
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
