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
    <nav className="hidden md:block border-b">
      <div className="flex items-center justify-center gap-4 h-14 max-w-screen-xl mx-auto px-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-accent",
              isActive(route.href)
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {route.icon}
            <span>{route.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}