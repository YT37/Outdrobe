import {
  Brain,
  Home,
  Moon,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Sun,
} from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/kloset", label: "Kloset", icon: Brain },
  { path: "/wardrobe", label: "My Wardrobe", icon: ShoppingBag },
  { path: "/marketplace", label: "Marketplace", icon: ShoppingCart },
];

export function Navigation() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") !== "false"
  );
  const { scrollY } = useScroll();

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
  }, [isDarkMode]);

  // Track mouse position for navbar visibility
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY;

    if (latest < 50 || latest < previous) {
      setIsVisible(true);
    } else if (latest > previous && latest > 100) {
      setIsVisible(false);
    }

    setLastScrollY(latest);
  });

  const navTransition = { duration: 0.3 };
  const buttonBaseClass = "gap-2.5 px-6 py-6 text-base";

  const renderNavItems = () =>
    navItems.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Link key={item.path} to={item.path}>
          <Button
            size="lg"
            variant={isDarkMode ? "ghost" : isActive ? "default" : "ghost"}
            className={`${buttonBaseClass} border ${
              isDarkMode
                ? `backdrop-blur-xl ${
                    isActive
                      ? "border-white/40 text-white shadow-lg"
                      : "bg-white/10 border-white/20 hover:bg-white/20 text-white/80"
                  }`
                : `${
                    isActive
                      ? "bg-white text-purple-600 hover:bg-white/90 border-white/30"
                      : "text-white hover:bg-white/20 border-transparent"
                  }`
            }`}
            style={
              isDarkMode && isActive
                ? {
                    background:
                      "linear-gradient(to right, #9333EA, #DB2777, #2563EB)",
                    color: "white",
                  }
                : isDarkMode || !isActive
                ? {
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                  }
                : undefined
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        </Link>
      );
    });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={navTransition}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b ${
        isDarkMode ? "border-transparent" : "border-white/30 shadow-lg"
      }`}
      style={
        isDarkMode
          ? {}
          : {
              background:
                "linear-gradient(to right, #3B82F6, #8B5CF6, #EC4899, #8B5CF6, #3B82F6)",
            }
      }
    >
      <div className="container mx-auto px-6 py-6 flex items-center justify-between gap-3 min-h-[88px]">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Sparkles className="h-8 w-8 text-white drop-shadow-lg" />
          <span className="text-2xl text-white font-heading">Outdrobe</span>
        </Link>

        <div className="flex items-center gap-3">
          {renderNavItems()}

          <Button
            size="lg"
            variant="ghost"
            onClick={toggleDarkMode}
            className={`border ${
              isDarkMode
                ? "backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 text-white/80"
                : "text-white hover:bg-white/20 border-transparent"
            } px-6 py-6`}
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
            }}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
