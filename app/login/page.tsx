import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginPanel } from "@/components/auth/LoginPanel";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do swojego konta Examax.",
};

/** Dub's login page (dubinc/dub: (auth-marketing)/login/page.tsx): a page of its own. */
export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginPanel />
    </AuthLayout>
  );
}
