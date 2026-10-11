import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpFlow } from "@/components/auth/SignUpFlow";
import { getProviderStatus } from "@/lib/auth/providers";
import { safeNext } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Załóż konto",
  description: "Załóż konto Examax i zacznij przygotowania do egzaminu ósmoklasisty lub matury.",
  /* An account form, not a page to land on from search; its links still count. */
  robots: { index: false, follow: true },
};

/** Dub's register page (dubinc/dub: (auth-marketing)/register/page.tsx): a page of its own. */
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [{ next }, providers] = await Promise.all([searchParams, getProviderStatus()]);
  return (
    <AuthLayout>
      <SignUpFlow next={safeNext(next)} providers={providers} />
    </AuthLayout>
  );
}
