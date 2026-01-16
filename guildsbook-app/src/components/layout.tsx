"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { useSidebar } from "@/contexts/sidebar-context";
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
  const { isOpen } = useSidebar();
  const shouldShowSidebar = withSidebar && isOpen;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {shouldShowSidebar && <Sidebar className={sidebarClassName} />}
        <main className={cn(
          "flex-1 min-w-0 transition-all",
          withSidebar && shouldShowSidebar && "lg:ml-16 lg:mr-16",
          withSidebar && !shouldShowSidebar && "lg:ml-4 lg:mr-4"
        )}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}