import { ForgotPasswordForm } from "@/components/auth/forgot-password";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password - The Will Uche",
    description: "Forgot your password? Reset it here",
  };
  

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[90svh] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
