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
import { CheckCircle, XCircle } from "lucide-react";
import { Link } from "@/src/i18n/navigation";

type VerificationStatus = "verifying" | "success" | "error";

export function VerifyAccount({
  status = "verifying",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  status?: VerificationStatus;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "verifying" && (
              <div className="rounded-full bg-blue-100 p-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              </div>
            )}
            {status === "success" && (
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl text-center">
            {status === "verifying" && "Verifying Your Account"}
            {status === "success" && "Account Verified"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "verifying" &&
              "Please wait while we verify your account..."}
            {status === "success" &&
              "Your account has been successfully verified."}
            {status === "error" &&
              "We couldn't verify your account. The link may have expired."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "success" && (
            <p className="text-sm text-muted-foreground">
              You can now log in to your account and start using our services.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-muted-foreground">
              Please request a new verification link or contact support if you
              continue to experience issues.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {status === "success" && (
            <Button className="w-full" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          )}
          {status === "error" && (
            <>
              <Button variant="outline" className="w-full">
                Resend Verification Email
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/login">Back to Login</Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
