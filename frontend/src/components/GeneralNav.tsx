import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  BriefcaseIcon,
  Users,
  Award,
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
  }
];

export function GeneralNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="border-t">
      <div className="flex items-center justify-around h-[60px] px-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-colors",
              isActive(route.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {route.icon}
            <span className="mt-0.5">{route.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 