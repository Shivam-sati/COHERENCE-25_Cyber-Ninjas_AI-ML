import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  BriefcaseIcon,
  Users,
  Award,
  Settings,
  Home,
  Bell,
  Search,
  User,
  Bookmark,
  HelpCircle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const mainRoutes = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    name: "Candidates",
    href: "/candidates",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    name: "Leaderboard",
    href: "/leaderboard",
    icon: <Award className="h-5 w-5" />,
  }
];

const additionalRoutes = [
  {
    name: "Saved",
    href: "/saved",
    icon: <Bookmark className="h-5 w-5" />,
  },
  {
    name: "Help",
    href: "/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  }
];

export function CompleteNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md z-[9999] md:hidden">
      <div className="flex items-center justify-center h-[65px] px-4">
        <div className="flex items-center justify-between w-full max-w-[600px] bg-background/80 backdrop-blur-md rounded-full border shadow-sm px-4">
          {mainRoutes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex flex-col items-center justify-center h-full text-[13px] font-medium transition-colors",
                isActive(route.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {route.icon}
              <span className="mt-1 leading-none">{route.name}</span>
            </Link>
          ))}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center justify-center h-full text-[13px] font-medium"
              >
                <User className="h-5 w-5" />
                <span className="mt-1 leading-none">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl z-[9999]">
              <SheetHeader className="mb-3">
                <SheetTitle className="text-sm">Menu</SheetTitle>
              </SheetHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1.5">
                  <div className="flex items-center space-x-1.5">
                    <User className="h-5 w-5" />
                    <span className="text-sm">John Doe</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bell className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-6 pr-2 py-1.5 text-sm rounded-md border bg-background"
                  />
                </div>

                <div className="space-y-0.5">
                  {additionalRoutes.map((route) => (
                    <Link
                      key={route.href}
                      to={route.href}
                      className={cn(
                        "flex items-center space-x-1.5 px-1.5 py-1.5 rounded-md transition-colors text-sm",
                        isActive(route.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {route.icon}
                      <span>{route.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-sm h-8"
                  >
                    <LogOut className="mr-1.5 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 