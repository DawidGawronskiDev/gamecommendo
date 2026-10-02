"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const AUTH_FORM_COPY = {
  login: {
    title: "Log in",
    intro: "Welcome back. Log in with your email and password.",
    submit: "Log in",
    pending: "Logging in…",
    switchPrompt: "No account yet?",
    switchLabel: "Register",
    switchHref: "/register",
  },
  register: {
    title: "Register",
    intro:
      "Create an account. Nothing is sold here, so no payment details are ever asked for.",
    submit: "Create account",
    pending: "Creating account…",
    switchPrompt: "Already registered?",
    switchLabel: "Log in",
    switchHref: "/login",
  },
};

type AuthFormFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  hint?: string;
};

function AuthFormField({ id, label, hint, ...props }: AuthFormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
      >
        {label}
      </label>
      <Input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

type AuthFormProps = React.ComponentProps<"form"> & {
  mode: keyof typeof AUTH_FORM_COPY;
};

export function AuthForm({ mode, className, ...props }: AuthFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const copy = AUTH_FORM_COPY[mode];
  const isRegister = mode === "register";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    const password = String(data.get("password"));

    setIsPending(true);
    setMessage(null);

    const { error } = isRegister
      ? await authClient.signUp.email({
          name: String(data.get("name")).trim(),
          email,
          password,
        })
      : await authClient.signIn.email({ email, password });

    if (error) {
      setIsPending(false);
      setMessage(
        error.message ??
          "Something went wrong. Check your details and try again.",
      );
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="auth-form-heading"
      className={cn("flex w-full max-w-sm flex-col gap-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <h1
          id="auth-form-heading"
          className="font-heading text-3xl leading-none font-extrabold tracking-tighter uppercase md:text-5xl"
        >
          {copy.title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {copy.intro}
        </p>
      </div>
      <div className="flex flex-col gap-5">
        {isRegister && (
          <AuthFormField
            id="name"
            name="name"
            label="Name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
          />
        )}
        <AuthFormField
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <AuthFormField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
          minLength={8}
          maxLength={128}
          hint={isRegister ? "At least 8 characters." : undefined}
        />
      </div>
      <div className="flex flex-col gap-3">
        {message && (
          <p role="alert" className="text-sm text-destructive">
            {message}
          </p>
        )}
        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? copy.pending : copy.submit}
        </Button>
        <p className="text-sm text-muted-foreground">
          {copy.switchPrompt}{" "}
          <Link
            href={copy.switchHref}
            className="text-foreground underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.switchLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
