import { Layout } from "@/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout withSidebar>{children}</Layout>;
}