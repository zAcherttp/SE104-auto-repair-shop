import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication redirects are handled by middleware
  return <>{children}</>;
}
