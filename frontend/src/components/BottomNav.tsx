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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-3xl">
      <div className="flex items-center justify-around h-16 px-6 bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg dark:bg-card/80 dark:border-border/30">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all",
              isActive(route.href)
                ? "text-primary bg-primary/10 dark:bg-primary/15"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {route.icon}
            <span className="mt-1 text-xs font-medium">{route.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}