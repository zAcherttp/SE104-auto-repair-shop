// app/not-found.tsx
"use client";

import { Error } from "@/src/components/error";

export default function NotFound() {
  return <Error code={404} />;
}
