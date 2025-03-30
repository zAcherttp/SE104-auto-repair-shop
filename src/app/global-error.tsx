"use client";
// Error boundaries must be Client Components
import { useEffect } from "react";
import { Error } from "../components/error";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  return (
    // global-error must include html and body tags
    <html>
      <body>
        <Error code={500} />
      </body>
    </html>
  );
}
