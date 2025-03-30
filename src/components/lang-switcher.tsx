// // app/components/LanguageSwitcher.tsx
// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useTransition } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
// } from "@/src/components/ui/select";
// import { GlobeIcon } from "lucide-react";

// export default function LanguageSwitcher({
//   currentLang,
// }: {
//   currentLang: Locale;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [, startTransition] = useTransition();

//   const onLanguageChange = (lang: Locale) => {
//     const newPath = pathname.replace(/^\/[a-z]{2}/, `/${lang}`);
//     startTransition(() => {
//       router.push(newPath);
//     });
//   };

//   return (
//     <Select onValueChange={onLanguageChange} defaultValue={currentLang}>
//       <SelectTrigger className="w-[180px]">
//         <GlobeIcon className="h-4 w-4" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>Language</SelectLabel>
//           <SelectItem value="en">English</SelectItem>
//           <SelectItem value="vi">Tiếng Việt</SelectItem>
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   );
// }
