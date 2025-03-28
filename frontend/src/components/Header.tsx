import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Moon,
  Sun,
  X,
  Bell,
  Search,
  User,
  BriefcaseIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background/80 backdrop-blur-md"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BriefcaseIcon className="h-6 w-6 text-primary mr-2" />
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ResumeScreener
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            {!isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Profile</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">John Doe</h3>
                        <p className="text-sm text-muted-foreground">john@example.com</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Account Settings
                      </Button>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                        <User className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {!isMobile && (
              <Link to="/candidates">
                <Button
                  className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-200"
                >
                  Find Talent
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b p-4"
          >
            <div className="container mx-auto px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, candidates, or skills..."
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <div className="flex justify-between items-center h-16 px-4 border-b">
              <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <BriefcaseIcon className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-xl">ResumeScreener</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="focus:outline-none"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
              <div className="pt-4 mt-4 border-t">
                <Link to="/candidates" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-200"
                  >
                    Find Talent
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
