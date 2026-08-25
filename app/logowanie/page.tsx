import type { Metadata } from "next";
import { AuthShell } from "@/components/app/AuthShell";
import { AuthForm } from "@/components/app/AuthForm";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do swojego konta Examax.",
};

export default function LogowaniePage() {
  return (
    <AuthShell>
      <AuthForm
        title="Zaloguj się do Examax"
        primaryLabel="Zaloguj się e-mailem"
        swapPrompt="Nie masz konta?"
        swapLabel="Zarejestruj się"
        swapHref="/rejestracja"
      />
    </AuthShell>
  );
}
