"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PrototypeBadge } from "@/components/ui/badge";
import { LogoMark } from "@/components/site/logo";
import { useProfile } from "@/lib/profile-context";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { signIn } = useProfile();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const isReg = mode === "register";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const username = String(f.get("username") ?? "").trim();
    const errs: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
    if (password.length < 8) errs.password = "Use at least 8 characters.";
    if (isReg && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) errs.username = "3–20 letters, numbers or underscores.";
    if (isReg && password !== String(f.get("confirm"))) errs.confirm = "Passwords don't match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Prototype: password is validated for shape then discarded — never stored or sent.
    signIn({ email, ...(isReg ? { username, displayName: username } : {}) });
    router.push("/profile");
  };

  const field = (id: string, label: string, type = "text", auto?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} autoComplete={auto} aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `${id}-err` : undefined} />
      {errors[id] && <p id={`${id}-err`} role="alert" className="text-xs text-ruby">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="relative grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <div className="bg-board-pattern absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_center,black,transparent_65%)]" aria-hidden />
      <Card className="relative w-full max-w-md animate-fade-up">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <LogoMark size={40} />
            <PrototypeBadge label="Prototype auth" />
          </div>
          <h1 className="font-serif text-3xl font-semibold">{isReg ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-1 text-sm text-muted">{isReg ? "Join the All India Chess Club community." : "Log in to continue your games."}</p>
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            {isReg && field("username", "Username", "text", "username")}
            {field("email", "Email", "email", "email")}
            {field("password", "Password", "password", isReg ? "new-password" : "current-password")}
            {isReg && field("confirm", "Confirm password", "password", "new-password")}
            <Button type="submit" className="w-full" size="lg">{isReg ? "Sign up" : "Log in"}</Button>
          </form>
          <p className="mt-4 rounded-lg bg-surface-2 p-3 text-xs text-muted">
            Demo only: there is no server. Your profile is saved in this browser and your password is never stored.
          </p>
          <p className="mt-5 text-center text-sm text-muted">
            {isReg ? "Already have an account?" : "New to All India Chess Club?"}{" "}
            <Link href={isReg ? "/login" : "/register"} className="font-semibold text-gold hover:underline">{isReg ? "Log in" : "Sign up"}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
