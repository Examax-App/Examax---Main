"use client";

import { useFormStatus } from "react-dom";
import { AuthButton } from "@/components/auth/pieces";

/** The auth button as a server-action form's submit: it shows the spinner while the action runs. */
export function FormSubmit({ children, variant }: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger" }) {
  const { pending } = useFormStatus();
  return (
    <AuthButton type="submit" variant={variant} loading={pending}>
      {children}
    </AuthButton>
  );
}
