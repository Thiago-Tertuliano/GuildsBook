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
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-background/95 overflow-hidden">
      <Header />
      <div className="flex flex-1 relative min-h-0">
        {shouldShowSidebar && <Sidebar className={sidebarClassName} />}
        <main className={cn(
          "flex-1 min-w-0 transition-all duration-300 ease-in-out",
          "bg-gradient-to-br from-background via-background/98 to-background",
          "overflow-y-auto overflow-x-hidden", // Apenas o main tem scroll
          withSidebar && shouldShowSidebar && "ml-64", // Margem para o sidebar fixo
          withSidebar && !shouldShowSidebar && "ml-0"
        )}>
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
      {/* Footer apenas quando não há sidebar (páginas públicas) */}
      {!withSidebar && <Footer />}
    </div>
  );
}