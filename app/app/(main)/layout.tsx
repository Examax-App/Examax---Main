import { AppShell } from "@/components/app/AppShell";
import { Sidebar } from "@/components/app/Sidebar";
import { WORKSPACE_TITLE } from "@/lib/appNav";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      sidebar={<Sidebar title={WORKSPACE_TITLE} nav="main" showUsage />}
    >
      {children}
    </AppShell>
  );
}
