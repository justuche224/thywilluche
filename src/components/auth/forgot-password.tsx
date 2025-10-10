"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isPending, startTransition] = React.useTransition();
  const [done, setDone] = useState(false);

  const formSchema = z.object({
    email: z.email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          email: values.email,
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
        {
          onSuccess: async () => {
            setDone(true);
            toast.success("Reset password link sent successfully");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    });
  };

  return (
    <Form {...form}>
      <Done done={done} setDone={setDone} callbackURL="/auth/login" />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Forgot your password?</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to reset your password
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        If ypu have an account, we will send a link to your email to reset your password.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <Field>
                  <Button type="submit" disabled={isPending}>
                    {isPending
                      ? "Sending Reset Password Link..."
                      : "Send Reset Password Link"}
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or
                </FieldSeparator>
                <FieldDescription className="text-center">
                  Remember your password?{" "}
                  <Link href="/auth/login">Sign in</Link>
                </FieldDescription>
              </FieldGroup>
            </div>
            <div className="bg-muted relative hidden md:block">
              <Image
                src="/images/community.jpg"
                alt="community"
                width={500}
                height={500}
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </form>
    </Form>
  );
}

const Done = ({
  done,
  setDone,
  callbackURL,
}: {
  done: boolean;
  setDone: (done: boolean) => void;
  callbackURL: string;
}) => {
  const router = useRouter();
  return (
    <Dialog open={done} onOpenChange={setDone}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password link sent successfully!</DialogTitle>
          <DialogDescription>
            <h1 className="text-lg font-semibold">
              A link has been sent to your email to reset your password.
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Check your email for the reset password link. you might need to
              check your spam folder and mark it as not spam.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              router.push(callbackURL);
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
