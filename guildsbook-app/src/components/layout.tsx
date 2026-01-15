import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  withSidebar?: boolean;
  sidebarClassName?: string;
}

export function Layout({
  children,
  withSidebar = false,
  sidebarClassName,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {withSidebar && <Sidebar className={sidebarClassName} />}
        <main className={cn("flex-1", withSidebar && "lg:ml-64")}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}