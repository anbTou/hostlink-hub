
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  BarChart2,
  Book,
  Users,
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
  Sparkles,
  Mail,
  MessageSquare,
  Phone as PhoneIcon,
  Globe,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Main navigation categories
const navItems = [
  { name: "Dashboard", icon: BarChart2, path: "/" },
  { 
    name: "Inbox", 
    icon: Inbox, 
    path: "/inbox", 
    children: [
      { name: "Email", icon: Mail, path: "/inbox/email" },
      { name: "Airbnb", icon: Home, path: "/inbox/airbnb" },
      { name: "Booking", icon: Calendar, path: "/inbox/booking" },
      { name: "VRBO", icon: Globe, path: "/inbox/vrbo" },
      { name: "WhatsApp", icon: MessageSquare, path: "/inbox/whatsapp" },
    ]
  },
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
  { name: "Contacts", icon: Users, path: "/phone" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Tasks": true, // Default to expanded
    "Inbox": true  // Also expand inbox by default
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
              className="w-[280px] h-full bg-white shadow-soft animate-slide-in-right p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-bold text-xl text-primary flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Hostsy
                </h1>
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
                            "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors",
                            isActive(item.path) && "text-primary"
                          )}
                          onClick={() => toggleGroup(item.name)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
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
                                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                                  isActive(child.path)
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-secondary hover:text-foreground"
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
                          "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors font-medium",
                          isActive(item.path)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-secondary hover:text-foreground"
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

  // For desktop: persistent sidebar with collapse functionality
  return (
    <div 
      className={cn(
        "h-screen sticky top-0 bg-white border-r border-[#EFF3F8] transition-all duration-300 shadow-soft",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h1 className="font-bold text-primary flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          Hostsy
        </h1>}
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
                    "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors",
                    isActive(item.path) && "text-primary",
                    collapsed && "justify-center"
                  )}
                  onClick={() => !collapsed && toggleGroup(item.name)}
                >
                  <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    {collapsed ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="focus:outline-none">
                            <item.icon className={cn(
                              "h-5 w-5",
                              isActive(item.path) && "text-primary"
                            )} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-48 bg-white shadow-soft rounded-xl border-none z-50">
                          <Link to={item.path}>
                            <DropdownMenuItem className="rounded-lg">All {item.name}</DropdownMenuItem>
                          </Link>
                          {item.children.map((child) => (
                            <Link key={child.name} to={child.path}>
                              <DropdownMenuItem className={cn(
                                "rounded-lg flex items-center",
                                isActive(child.path) && "bg-primary/10 text-primary font-medium"
                              )}>
                                <child.icon className="h-4 w-4 mr-2" />
                                <span>{child.name}</span>
                              </DropdownMenuItem>
                            </Link>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </>
                    )}
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
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                          isActive(child.path)
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-secondary hover:text-foreground"
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
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors font-medium",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary hover:text-foreground",
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
