
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({
  children
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isPhonePage = location.pathname === "/phone";
  
  return <div className="flex min-h-screen bg-background">
      {!isPhonePage && <Sidebar />}
      <main className={`flex-1 transition-all duration-300 ${isPhonePage ? 'pl-0' : ''}`}>
        <div className="container h-[calc(100vh-2.5rem)] p-4 md:p-6 max-w-full animate-fade-in px-0 py-[20px] mx-0 rounded-none overflow-hidden">
          {children}
        </div>
      </main>
    </div>;
}
