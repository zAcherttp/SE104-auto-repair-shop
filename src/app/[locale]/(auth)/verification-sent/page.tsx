import { VerificationSent } from "@/src/components/auth/verification-sent";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <VerificationSent />
      </div>
    </div>
  );
}
