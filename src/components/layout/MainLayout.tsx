
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
  
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#F9FAFC] to-[#EFF3F8]">
      {!isPhonePage && <Sidebar />}
      <main className={`flex-1 transition-all duration-300 ${isPhonePage ? 'pl-0' : ''}`}>
        <div className="container min-h-[calc(100vh-2.5rem)] h-auto p-4 md:p-6 max-w-full animate-fade-in px-4 md:px-8 py-[20px] mx-0 rounded-none overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
