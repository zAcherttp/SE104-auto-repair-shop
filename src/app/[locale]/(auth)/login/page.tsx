"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

import { z } from "zod";
import { loginFormSchema } from "@/lib/schema/form";
import { Form, FormField } from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSubmitButton from "@/src/components/form-submit-button";
import { Separator } from "@/src/components/ui/separator";

type FormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Member Login</CardTitle>
            <CardDescription>
              Sign in to access the garage management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        {...field}
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                ></FormField>
                <Separator/>
                  <FormSubmitButton
                    className="w-full"
                    text="Sign In"
                    isDisabled={form.formState.isSubmitting}
                  />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
