
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
interface MainLayoutProps {
  children: ReactNode;
}
export function MainLayout({
  children
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  return <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 transition-all duration-300">
        <div className="container h-[calc(100vh-2.5rem)] p-4 md:p-6 max-w-full animate-fade-in px-0 py-[20px] mx-0 rounded-none overflow-hidden">
          {children}
        </div>
      </main>
    </div>;
}
