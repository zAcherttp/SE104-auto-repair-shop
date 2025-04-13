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
    "/signup": {
      vi: "/dang-ky",
      en: "/signup",
    },
    "/home": {
      vi: "/trang-chu",
      en: "/home",
    },
    "/tasks": {
      vi: "/viec",
      en: "/tasks",
    },
    "/vehicles": {
      vi: "/phuong-tien",
      en: "/vehicles",
    },
  },
});
