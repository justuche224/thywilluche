import { SigninForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - The Will Uche",
    description: "Login to your account",
  };
  

export default function SigninPage() {
  return (
    <div className="flex min-h-[90svh] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SigninForm />
      </div>
    </div>
  );
}
