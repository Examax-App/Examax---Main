import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AccountDeleted } from "@/components/auth/AccountDeleted";

export const metadata: Metadata = {
  title: "Konto usunięte",
  robots: { index: false, follow: false },
};

/** Where a browser lands when the account its session belonged to no longer exists (app/auth/deleted). */
export default function AccountDeletedPage() {
  return (
    <AuthLayout terms={false}>
      <AccountDeleted />
    </AuthLayout>
  );
}
