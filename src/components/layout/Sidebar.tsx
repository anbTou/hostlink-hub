
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  BarChart2,
  Book,
  Phone,
  CheckSquare,
  Settings,
  Menu,
  X,
  Home,
  Calendar,
  Clock,
  FileText,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Flag,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Main navigation categories
const navItems = [
  { name: "Dashboard", icon: BarChart2, path: "/" },
  { name: "Inbox", icon: Inbox, path: "/inbox" },
  { name: "Tasks", icon: CheckSquare, path: "/tasks", 
    children: [
      { name: "Today", icon: Clock, path: "/tasks/today" },
      { name: "This Week", icon: Calendar, path: "/tasks/week" },
      { name: "Later", icon: FileText, path: "/tasks/later" },
      { name: "All Tasks", icon: CheckSquare, path: "/tasks/all" },
    ]
  },
  { name: "Quick Notes", icon: FileText, path: "/notes" },
  { name: "Knowledge Base", icon: Book, path: "/knowledge" },
  { name: "Property Info", icon: Home, path: "/property" },
  { name: "Phone", icon: Phone, path: "/phone" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Tasks": true // Default to expanded
  });

  const toggleGroup = (name: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // For desktop: persistent sidebar with collapse functionality
  // For mobile: overlay menu triggered by button
  
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="w-[280px] h-full gradient-sidebar p-4 shadow-lg animate-slide-in-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-semibold text-xl text-primary">GuestAssist</h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.name} className="space-y-1">
                    {item.children ? (
                      <>
                        <div 
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
                            isActive(item.path) && "text-primary"
                          )}
                          onClick={() => toggleGroup(item.name)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </div>
                          {expandedGroups[item.name] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                        
                        {expandedGroups[item.name] && (
                          <div className="ml-8 space-y-1 mt-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                  isActive(child.path)
                                    ? "gradient-active text-primary-foreground"
                                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                              >
                                <child.icon className="h-4 w-4" />
                                <span>{child.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          isActive(item.path)
                            ? "gradient-active text-primary-foreground"
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div 
      className={cn(
        "h-screen sticky top-0 gradient-sidebar border-r border-border transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h1 className="font-semibold text-primary">GuestAssist</h1>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto")}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      <nav className="mt-8 px-2 space-y-1">
        {navItems.map((item) => (
          <div key={item.name} className="space-y-1">
            {item.children ? (
              <>
                <div 
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
                    isActive(item.path) && "text-primary",
                    collapsed && "justify-center"
                  )}
                  onClick={() => !collapsed && toggleGroup(item.name)}
                >
                  <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                  {!collapsed && (
                    expandedGroups[item.name] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </div>
                
                {!collapsed && expandedGroups[item.name] && (
                  <div className="ml-8 space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive(child.path)
                            ? "gradient-active text-primary-foreground"
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive(item.path)
                    ? "gradient-active text-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
