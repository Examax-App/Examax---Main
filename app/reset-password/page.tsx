import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordView } from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Ustaw nowe hasło",
  robots: { index: false, follow: false },
};

/** Reached from a password-reset link (via /auth/confirm), which signs the visitor in first. */
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) redirect(error?.code === "user_not_found" ? "/auth/deleted" : "/login?next=/reset-password");

  return (
    <AuthLayout terms={false}>
      <ResetPasswordView email={user.email ?? ""} />
    </AuthLayout>
  );
}
