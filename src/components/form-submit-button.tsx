import React from "react";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormSubmitButtonProps {
  text: string;
  isDisabled: boolean;
}

export default function FormSubmitButton({
  text,
  isDisabled,
}: FormSubmitButtonProps) {
  return (
    <Button type="submit" className="w-30" disabled={isDisabled}>
      <span
        className={`transition-all duration-200 ${
          isDisabled ? "opacity-0 blur-md scale-95" : "opacity-100 blur-0"
        }`}
      >
        {text}
      </span>

      <span
        className={`absolute transition-all duration-200 ${
          isDisabled ? "opacity-100 blur-0" : "opacity-0 blur-md scale-105"
        }`}
      >
        <Loader2 className="animate-spin" />
      </span>
    </Button>
  );
}
