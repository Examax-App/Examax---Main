import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { AlternativeBanner } from "@/components/auth/pieces";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do swojego konta Examax.",
};

/** Dub's login page (dubinc/dub: (auth-marketing)/login/page.tsx), in Polish. */
export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h3 className="text-center text-xl font-semibold text-charcoal">Zaloguj się do Examax</h3>
        <div className="mt-8">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm font-medium text-fog">
          Nie masz konta?&nbsp;
          <Link href="/signup" className="font-semibold text-slate transition-colors hover:text-charcoal">
            Zarejestruj się
          </Link>
        </p>
        <div className="mt-12 w-full">
          <AlternativeBanner text="Szukasz konta dla szkoły lub placówki?" cta="Zaloguj się jako instytucja" href="/schools" />
        </div>
      </div>
    </AuthLayout>
  );
}
