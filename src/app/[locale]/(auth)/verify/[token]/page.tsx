import { useTranslations } from "next-intl";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-poppins",
});

export default function VerifyPage({ params }: { params: { token: string } }) {
  const t = useTranslations("verify");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="text-center">
        <h1
          className={`${poppins.variable} font-semibold text-4xl text-foreground`}
        >
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{t("description")}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {t("token")}: {params.token}
        </p>
      </div>
    </div>
  );
}
