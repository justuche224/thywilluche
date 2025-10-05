"use client"

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldSeparator,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import React from "react";
import {useRouter} from "next/navigation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

export function SignupForm({
                               className,
                               ...props
                           }: React.ComponentProps<"form">) {

    const [isPending, startTransition] = React.useTransition();
    const router = useRouter();

    const checkUserNameAvailability = async (username: string) => {
        const {data: response, error} = await authClient.isUsernameAvailable({
            username,
        });
        if (error) {
            toast.error("Failed to check username availability");
        }
        return !!response?.available;
    }

    const formSchema = z
        .object({
            name: z
                .string()
                .min(2)
                .max(50)
                .regex(/^[a-zA-Z0-9\s-]+$/, {
                    message:
                        "Name can only contain letters, numbers, spaces, and hyphens.",
                }),
            email: z.email(),
            username: z.string().min(5).max(20).refine(
                async (username) => {
                    if (username === "") return false;
                    return await checkUserNameAvailability(username);
                },
                {message: "Username is already taken"}
            ),
            password: z
                .string()
                .min(8, "Password must be at least 8 characters long")
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/\d/, "Password must contain at least one number")
                .regex(
                    /[@$!%*?&#]/,
                    "Password must contain at least one special character (@$!%*?&#)"
                ),
            confirmPassword: z
                .string()
                .min(8, "Password must be at least 8 characters long"),
        })
        .refine((data) => data.password === data.confirmPassword, {
            path: ["confirmPassword"],
            message: "Passwords do not match",
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof  formSchema>) => {
        startTransition(async () => {
            await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
                username: values.username,
            }, {
                onSuccess: () => {
                    toast.success("Account created successfully");
                    router.push("/community/home");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            })
        })
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your email below to create your account
                                </p>
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="John Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="johndoe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                    </FormItem>
                                )}
                            />
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
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
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
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
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Creating Account..." : "Create Account"}
                                </Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <FieldDescription className="text-center">
                                Already have an account? <Link href="/auth/login">Sign in</Link>
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
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </form>
        </Form>
    );
}
