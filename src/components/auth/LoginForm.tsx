"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong");
      } else {
        router.push("/users");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to login");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-full max-w-sm'>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Email'
                          className='w-full'
                          type='email'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className='text-xs font-normal' />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='space-y-2'>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Password'
                          className='w-full'
                          type='password'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className='text-xs font-normal' />
                    </div>
                  </FormItem>
                )}
              />

              {error && <p className='text-red-600'>{error}</p>}

              <Button
                type='submit'
                className='w-full'
                disabled={loading || !form.formState.isValid}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          <div className='text-center text-sm mt-2'>
            <span>Don&apos;t have an account? </span>
            <Link
              href='/create-account'
              className='text-blue-600 hover:underline'>
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
