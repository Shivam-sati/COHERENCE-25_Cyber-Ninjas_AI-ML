import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  BriefcaseIcon,
  Users,
  Award,
  Settings,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
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
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  }
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors",
              isActive(route.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {route.icon}
            <span className="mt-1">{route.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 