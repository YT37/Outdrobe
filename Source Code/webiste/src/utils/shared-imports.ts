// Common React imports
export { Suspense, useRef, useState } from "react";

// Third-party libraries
export { OrbitControls, PerspectiveCamera } from "@react-three/drei";
export { Canvas } from "@react-three/fiber";
export { motion, useInView } from "motion/react";
export { Link, useLocation } from "react-router-dom";

// Icons
export {
  Brain,
  Calendar,
  Heart,
  Home,
  Mic,
  Palette,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

// UI Components
export { Badge } from "../components/ui/badge";
export { Button } from "../components/ui/button";
export { Card, CardContent } from "../components/ui/card";

// Animation constants
export const DEFAULT_ANIMATION_CONFIG = {
  type: "spring",
  stiffness: 200,
  delay: 0.2,
};

// Common gradient backgrounds
export const GRADIENT_BACKGROUNDS = {
  primary:
    "bg-gradient-to-b from-background via-purple-50/30 to-background dark:via-purple-950/10",
  secondary:
    "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20",
  accent: "bg-gradient-to-br from-purple-500 to-pink-500",
};

// Color palette
export const BRAND_COLORS = {
  purple: "#8B5CF6",
  pink: "#EC4899",
  cyan: "#06B6D4",
  green: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
};
