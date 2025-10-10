import { ResetPasswordForm } from "@/components/auth/reset-password";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password - The Will Uche",
    description: "Reset your password here",
  };
  

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[90svh] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
