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
import React from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const formSchema = z.object({
    usernameOrEmail: z
      .string()
      .min(1, "Username or email is required")
      .refine((value) => {
        const isEmail = value.includes("@");
        if (isEmail) {
          return z.email().safeParse(value).success;
        }
        return true;
      }, "Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const isEmail = values.usernameOrEmail.includes("@");

      if (isEmail) {
        // Sign in with email
        await authClient.signIn.email(
          {
            email: values.usernameOrEmail,
            password: values.password,
          },
          {
            onSuccess: () => {
              toast.success("Logged in successfully");
              router.push("/admin");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
          }
        );
      } else {
        // Sign in with a username
        await authClient.signIn.username(
          {
            username: values.usernameOrEmail,
            password: values.password,
          },
          {
            onSuccess: () => {
              toast.success("Logged in successfully");
              router.push("/community/home");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
          }
        );
      }
    });
  };

  return (
    <Form {...form}>
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
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email or username below to login to your account
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="usernameOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username or Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="johndoe or johndoe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Field>
                  <FieldDescription>
                    Forgot your password?{" "}
                    <Link href="/auth/forgot-password">Reset it</Link>
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or
                </FieldSeparator>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register">Sign up</Link>
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
          By clicking login, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </form>
    </Form>
  );
}
