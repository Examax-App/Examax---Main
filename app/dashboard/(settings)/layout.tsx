import { AppShell } from "@/components/app/AppShell";
import { Sidebar } from "@/components/app/Sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      sidebar={<Sidebar title="Ustawienia" backHref="/dashboard" nav="settings" />}
    >
      {children}
    </AppShell>
  );
}
