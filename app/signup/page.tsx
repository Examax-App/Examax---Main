import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpFlow } from "@/components/auth/SignUpFlow";

export const metadata: Metadata = {
  title: "Załóż konto",
  description: "Załóż konto Examax i zacznij przygotowania do egzaminu ósmoklasisty lub matury.",
};

/** Dub's register page (dubinc/dub: (auth-marketing)/register/page.tsx): a page of its own. */
export default function SignupPage() {
  return (
    <AuthLayout>
      <SignUpFlow />
    </AuthLayout>
  );
}
