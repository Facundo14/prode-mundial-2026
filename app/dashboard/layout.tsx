import { auth } from "@clerk/nextjs/server";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const isAdmin = userId && userId === process.env.ADMIN_USER_ID;

  return (
    <DashboardShell isAdmin={!!isAdmin}>
      {children}
    </DashboardShell>
  );
}
