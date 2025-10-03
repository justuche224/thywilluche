import { SignupForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - The Will Uche",
  description: "Register for an account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[90svh] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
