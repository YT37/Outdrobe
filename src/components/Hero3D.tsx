import { MessageSquare, Mic, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

// Fashion clothing SVG components
function TShirt({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M65 45L50 55L50 95L60 95L60 180L140 180L140 95L150 95L150 55L135 45L130 35C130 28 122 25 100 25C78 25 70 28 70 35L65 45Z"
        fill={color}
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="100" cy="115" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="100" cy="130" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function Jacket({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M65 40L55 50L50 90L50 185L95 185L95 55L80 45L70 35L65 40Z"
        fill={color}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M135 40L145 50L150 90L150 185L105 185L105 55L120 45L130 35L135 40Z"
        fill={color}
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="95"
        y="45"
        width="10"
        height="140"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M70 60L95 55"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M130 60L105 55"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  );
}

function Dress({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M70 30L60 45L55 60L50 180L75 185L100 140L125 185L150 180L145 60L140 45L130 30L115 25L100 30L85 25L70 30Z"
        fill={color}
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="100" cy="35" r="8" fill="currentColor" opacity="0.2" />
      <path
        d="M80 70Q100 75 120 70"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <path
        d="M75 100Q100 105 125 100"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
    </svg>
  );
}

function Pants({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M65 40L60 50L55 90L60 185L85 185L95 100L95 40L65 40Z"
        fill={color}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M135 40L140 50L145 90L140 185L115 185L105 100L105 40L135 40Z"
        fill={color}
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="95"
        y="40"
        width="10"
        height="25"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  );
}

function Sweater({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 50L50 60L48 100L48 170L65 170L65 60L85 50L100 55L115 50L135 60L135 170L152 170L152 100L150 60L140 50L130 40C128 32 118 28 100 28C82 28 72 32 70 40L60 50Z"
        fill={color}
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="65"
        y="80"
        width="70"
        height="3"
        fill="currentColor"
        opacity="0.3"
        rx="1.5"
      />
      <rect
        x="65"
        y="95"
        width="70"
        height="3"
        fill="currentColor"
        opacity="0.3"
        rx="1.5"
      />
      <rect
        x="65"
        y="110"
        width="70"
        height="3"
        fill="currentColor"
        opacity="0.3"
        rx="1.5"
      />
    </svg>
  );
}

interface ClothingItem {
  id: number;
  Component: typeof TShirt;
  color: string;
  initialX: number;
  initialY: number;
  rotation: number;
  scale: number;
  delay: number;
  name: string;
}

export function Hero3D() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const clothingItems: ClothingItem[] = [
    {
      id: 1,
      Component: TShirt,
      color: "#FF6B9D", // Hot Pink
      initialX: 15,
      initialY: 25,
      rotation: -12,
      scale: 1.2,
      delay: 0,
      name: "Classic Tee",
    },
    {
      id: 2,
      Component: Jacket,
      color: "#4ECDC4", // Turquoise
      initialX: 75,
      initialY: 15,
      rotation: 8,
      scale: 1.4,
      delay: 0.2,
      name: "Bomber Jacket",
    },
    {
      id: 3,
      Component: Dress,
      color: "#FFE66D", // Sunny Yellow
      initialX: 65,
      initialY: 60,
      rotation: -5,
      scale: 1.3,
      delay: 0.4,
      name: "Summer Dress",
    },
    {
      id: 4,
      Component: Pants,
      color: "#95E1D3", // Mint Green
      initialX: 10,
      initialY: 65,
      rotation: 15,
      scale: 1.1,
      delay: 0.6,
      name: "Denim Jeans",
    },
    {
      id: 5,
      Component: Sweater,
      color: "#A8E6CF", // Soft Green
      initialX: 82,
      initialY: 70,
      rotation: -8,
      scale: 1.25,
      delay: 0.8,
      name: "Cozy Sweater",
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20" />

      {/* Animated Geometric Patterns */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Clothing Items */}
      <div className="absolute inset-0 pointer-events-none">
        {clothingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.initialX}%`,
              top: `${item.initialY}%`,
              width: "120px",
              height: "120px",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: hoveredItem === item.id ? 1 : 0.7,
              scale: hoveredItem === item.id ? item.scale * 1.15 : item.scale,
              y: [0, -20, 0],
              rotate: [item.rotation, item.rotation + 5, item.rotation],
            }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
              y: {
                duration: 4 + item.id * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              },
              rotate: {
                duration: 5 + item.id * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              },
            }}
            whileInView={{
              opacity: hoveredItem === item.id ? 1 : 0.7,
              scale: item.scale,
            }}
            onHoverStart={() => setHoveredItem(item.id)}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <div className="relative group">
              <item.Component
                color={item.color}
                className="w-full h-full drop-shadow-2xl transition-all duration-300"
              />

              {/* AI Sparkle Effect on Hover */}
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="size-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                </motion.div>
              )}

              {/* Item Label on Hover */}
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-3 py-1 rounded-full text-xs"
                >
                  {item.name}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full border-2 border-purple-500/20 backdrop-blur-sm"
          >
            <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Meet Kloset - Your AI Voice Stylist
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-7xl md:text-9xl mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="block">
              <span className="text-black dark:text-white">Out</span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                drobe
              </span>
            </span>
          </motion.h1>

          {/* Subscript Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-lg md:text-xl mb-8 text-muted-foreground tracking-wide uppercase"
            style={{
              fontFamily: "var(--font-slogan)",
              fontWeight: "300",
              letterSpacing: "0.2em",
            }}
          >
            Never Wonder What to Wear
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Outdrobe is powered by{" "}
            <span className="text-foreground">Kloset</span>, your agentic AI
            stylist that analyzes your wardrobe, creates unique combinations,
            and <span className="text-foreground">remembers every outfit</span>{" "}
            you've worn.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/ai-agent">
              <Button
                size="lg"
                className="gap-2 text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
              >
                <Mic className="size-5" />
                Start Voice Chat
              </Button>
            </Link>
            <Link to="/wardrobe">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-10 py-7 border-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all hover:scale-105"
              >
                <MessageSquare className="size-5" />
                View My Wardrobe
              </Button>
            </Link>
          </motion.div>

          {/* Example Prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            {[
              "I've got a date tonight",
              "What should I wear for class?",
              "Outfit for a job interview",
            ].map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2 + index * 0.1, duration: 0.5 }}
                className="px-4 py-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-full border border-border text-sm text-muted-foreground hover:border-purple-500/50 hover:text-foreground transition-all cursor-pointer"
              >
                "{prompt}"
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
