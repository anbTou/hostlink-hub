
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 ${!isMobile ? 'ml-[70px]' : ''} transition-all duration-300`}>
        <div className="container mx-auto p-4 md:p-6 max-w-7xl animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
