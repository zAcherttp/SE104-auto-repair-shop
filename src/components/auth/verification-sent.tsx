import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/src/components/ui/card";
import { MailIcon } from "lucide-react";
import { Link } from "@/src/i18n/navigation";

export function VerificationSent({
  email = "your email",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  email?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <MailIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Verification Email Sent
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a verification link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Please check your email and click on the verification link to
            complete your registration. If you don&apos;t see the email, check
            your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full">
            Resend Verification Email
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="underline underline-offset-4">
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
