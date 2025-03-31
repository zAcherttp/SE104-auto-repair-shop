import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "vi"],

  // Used when no locale matches
  defaultLocale: "en",

  pathnames: {
    "/": "/",
    "/login": {
      vi: "/dang-nhap",
      en: "/login",
    },
    "/home": {
      vi: "/trang-chu",
      en: "/home",
    },
  },
});
