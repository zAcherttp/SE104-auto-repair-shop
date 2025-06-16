import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
    </div>
  );
}
