import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpFlow } from "@/components/auth/SignUpFlow";

export const metadata: Metadata = {
  title: "Załóż konto",
  description: "Załóż darmowe konto Examax i zacznij przygotowania do egzaminu.",
};

/** Dub's register page (dubinc/dub: (auth-marketing)/register), in Polish. */
export default function SignupPage() {
  return (
    <AuthLayout>
      <SignUpFlow />
    </AuthLayout>
  );
}
