import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { VerifyView } from "@/components/auth/VerifyView";

export const metadata: Metadata = {
  title: "Potwierdź adres e-mail",
  robots: { index: false, follow: false },
};

/** Links that did not work, fresh activation links, and the halfway point of an address change (components/auth/VerifyView.tsx). */
export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ error?: string; type?: string; notice?: string }> }) {
  const { error, type, notice } = await searchParams;
  return (
    <AuthLayout terms={notice !== "email-change-pending"}>
      <VerifyView error={error} type={type} notice={notice} />
    </AuthLayout>
  );
}
