import type { Metadata } from "next";
import { AuthShell } from "@/components/app/AuthShell";
import { AuthForm } from "@/components/app/AuthForm";

export const metadata: Metadata = {
  title: "Załóż konto",
  description: "Załóż darmowe konto Examax i zacznij przygotowania.",
};

export default function RejestracjaPage() {
  return (
    <AuthShell>
      <AuthForm
        title="Załóż konto Examax"
        primaryLabel="Zarejestruj się e-mailem"
        swapPrompt="Masz już konto?"
        swapLabel="Zaloguj się"
        swapHref="/login"
      />
    </AuthShell>
  );
}
