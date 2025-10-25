import { Sparkles, Brain, ShoppingBag, Home, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ai-agent', label: 'Kloset', icon: Brain },
    { path: '/wardrobe', label: 'My Wardrobe', icon: ShoppingBag },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Sparkles className="size-6 text-purple-600" />
          <span className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="text-black dark:text-white">Out</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">drobe</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`gap-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                      : ''
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
