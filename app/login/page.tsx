import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { getProviderStatus } from "@/lib/auth/providers";
import { safeNext } from "@/lib/auth/redirect";
import { LOGIN_ERRORS, LOGIN_NOTICES } from "@/lib/auth/loginNotices";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do swojego konta Examax.",
  /* An account form, not a page to land on from search; its links still count. */
  robots: { index: false, follow: true },
};

/** Dub's login page (dubinc/dub: (auth-marketing)/login/page.tsx): a page of its own. */
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; notice?: string }> }) {
  const [{ next, error, notice }, providers] = await Promise.all([searchParams, getProviderStatus()]);
  const arrival = error
    ? { message: LOGIN_ERRORS[error] ?? LOGIN_ERRORS.oauth, tone: "error" as const }
    : notice && LOGIN_NOTICES[notice]
      ? { message: LOGIN_NOTICES[notice], tone: "success" as const }
      : undefined;
  return (
    <AuthLayout>
      <LoginPanel next={safeNext(next)} providers={providers} notice={arrival} />
    </AuthLayout>
  );
}
