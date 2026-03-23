
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  CalendarDays,
  Sparkles,
  Mail,
  UserCircle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SavedViewsList } from "@/components/inbox/SavedViewsList";
import { SaveViewDialog } from "@/components/inbox/SaveViewDialog";
import { FilterOptions } from "@/types/inbox";
import { useTeam } from "@/contexts/TeamContext";
import { teamMembers } from "@/types/team";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Main navigation categories
const navItems = [
  { name: "Dashboard", icon: BarChart2, path: "/" },
  { name: "Inbox", icon: Inbox, path: "/inbox",
    children: [
      { name: "Main Inbox", icon: Mail, path: "/inbox/main" },
      { name: "My Inbox", icon: UserCircle, path: "/inbox/private" },
    ]
  },
  { name: "Team Calendar", icon: CalendarDays, path: "/team-calendar" },
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
  { name: "Contacts", icon: Users, path: "/contacts" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Tasks": true,
    "Inbox": true
  });
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
          status: "all",
          platforms: [],
          dateRange: { start: undefined, end: undefined },
          priority: [],
          tags: [],
          teams: [],
          properties: [],
  });

  const { currentUser, setCurrentUser } = useTeam();

  const toggleGroup = (name: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleCreateView = () => {
    setSaveViewDialogOpen(true);
  };

  const handleSaveView = async (name: string, icon: string) => {
    console.log('Save view:', name, icon, currentFilters);
  };

  const handleSelectView = (filters: FilterOptions) => {
    navigate('/inbox/main', { state: { filters } });
  };

  const AgentSwitcher = ({ collapsed: isCollapsed }: { collapsed: boolean }) => (
    <div className={cn("border-t border-border p-2", isCollapsed && "flex justify-center")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 h-auto py-2",
              isCollapsed && "w-10 h-10 p-0 justify-center"
            )}
          >
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.name.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-xs font-medium truncate">{currentUser.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{currentUser.role}</span>
              </div>
            )}
            {!isCollapsed && <ChevronDown className="h-3 w-3 ml-auto shrink-0 text-muted-foreground" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-56">
          {teamMembers.map(member => (
            <DropdownMenuItem
              key={member.id}
              onClick={() => setCurrentUser(member)}
              className={cn(currentUser.id === member.id && "bg-accent")}
            >
              <div className="flex items-center gap-2 w-full">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.charAt(0)}
                </div>
                <span className="text-sm flex-1">{member.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{member.role}</span>
                {member.isOnline ? (
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

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
              className="w-[280px] h-full bg-white shadow-soft animate-slide-in-right p-4 flex flex-col"
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
              <nav className="space-y-2 flex-1">
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

              {/* Saved Views Section */}
              <div className="mt-6 border-t border-border pt-4">
                <SavedViewsList
                  onSelectView={handleSelectView}
                  onCreateView={handleCreateView}
                  collapsed={false}
                />
              </div>

              <AgentSwitcher collapsed={false} />
            </div>
          </div>
        )}

        <SaveViewDialog
          open={saveViewDialogOpen}
          onOpenChange={setSaveViewDialogOpen}
          filters={currentFilters}
          onSave={handleSaveView}
        />
      </>
    );
  }

  // For desktop: persistent sidebar with collapse functionality
  return (
    <div 
      className={cn(
        "h-screen sticky top-0 bg-white border-r border-[#EFF3F8] transition-all duration-300 shadow-soft flex flex-col",
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
      
      <nav className="mt-8 px-2 space-y-1 flex-1">
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
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span className="font-medium">{item.name}</span>}
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

      {/* Saved Views Section for Desktop */}
      {!collapsed && (
        <div className="border-t border-border pt-4 px-2">
          <SavedViewsList
            onSelectView={handleSelectView}
            onCreateView={handleCreateView}
            collapsed={collapsed}
          />
        </div>
      )}

      {/* Agent Switcher */}
      <AgentSwitcher collapsed={collapsed} />

      <SaveViewDialog
        open={saveViewDialogOpen}
        onOpenChange={setSaveViewDialogOpen}
        filters={currentFilters}
        onSave={handleSaveView}
      />
    </div>
  );
}
