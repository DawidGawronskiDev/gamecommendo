import { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth/components/auth-form";
import { getSession } from "@/features/auth/queries";

export const metadata: Metadata = {
  title: "Register | gamecommendo",
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-[1560px] justify-center px-4 py-16 md:px-8 md:py-24">
      <AuthForm mode="register" />
    </div>
  );
}
