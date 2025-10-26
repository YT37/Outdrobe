import { ArrowDown, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Meet Kloset - Your Personal AI Stylist";
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for spinning
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [15, -15]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-15, 15]),
    springConfig
  );

  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Track mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

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
      initialX: 72,
      initialY: 48,
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28">
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
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        onMouseMove={handleMouseMove}
      >
        {clothingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{
              left: `${item.initialX}%`,
              top: `${item.initialY}%`,
              width: "200px",
              height: "200px",
              rotateX: hoveredItem === item.id ? rotateX : 0,
              rotateY: hoveredItem === item.id ? rotateY : 0,
              transformPerspective: 1000,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: hoveredItem === item.id ? 1 : 0.8,
              scale: hoveredItem === item.id ? item.scale * 1.2 : item.scale,
              y: [0, -25, 0],
              rotate:
                hoveredItem === item.id
                  ? 0
                  : [item.rotation, item.rotation + 8, item.rotation],
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
              opacity: hoveredItem === item.id ? 1 : 0.8,
              scale: item.scale,
            }}
            onHoverStart={() => setHoveredItem(item.id)}
            onHoverEnd={() => setHoveredItem(null)}
            whileTap={{ scale: item.scale * 1.3 }}
          >
            <div className="relative group">
              {/* Constant Colored Glow - Always Visible */}
              <motion.div
                animate={{
                  opacity:
                    hoveredItem === item.id
                      ? [0.4, 0.7, 0.4]
                      : [0.25, 0.45, 0.25],
                  scale:
                    hoveredItem === item.id ? [1.3, 1.5, 1.3] : [1.1, 1.3, 1.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                }}
                className="absolute inset-0 -z-10 pointer-events-none"
                style={{
                  backgroundColor: item.color,
                  filter: "blur(30px)",
                  transform: "scale(1.2)",
                }}
              />

              <item.Component
                color={item.color}
                className="w-full h-full drop-shadow-2xl transition-all duration-300 relative z-10"
              />

              {/* AI Sparkle Effect on Hover */}
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 z-20"
                >
                  <Sparkles className="size-8 text-yellow-400 fill-yellow-400 animate-pulse" />
                </motion.div>
              )}

              {/* Item Label on Hover */}
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-4 py-2 rounded-full text-sm"
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
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Typewriter Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full border-2 border-purple-500/20 backdrop-blur-sm min-h-[44px]"
          >
            <Sparkles className="size-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span className="text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-0.5"
              >
                |
              </motion.span>
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-4"
          >
            <h1
              className="text-7xl md:text-9xl tracking-tight"
              style={{
                fontFamily: "var(--font-heading)",
                WebkitTextStroke: "4px currentColor",
              }}
            >
              <span className="block">
                <span
                  className="text-black dark:text-white"
                  style={{ WebkitTextStroke: "4px currentColor" }}
                >
                  Out
                </span>
                <span
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                  style={{
                    WebkitTextStroke: "4px transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  drobe
                </span>
                <span
                  className="text-black dark:text-white"
                  style={{ WebkitTextStroke: "0px" }}
                >
                  .
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Subscript Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
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
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: "var(--font-body)",
              color: "#7C3AED",
            }}
          >
            Your agentic AI stylist that analyzes your wardrobe, creates unique
            combinations, remembers every outfit you've worn and{" "}
            <span style={{ fontWeight: "600", color: "#6D28D9" }}>
              shops for you
            </span>
            !
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="flex justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => {
                const featuresSection = document.getElementById("features");
                if (featuresSection) {
                  featuresSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="gap-2 text-lg px-10 py-7 shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 text-white"
              style={{
                background:
                  "linear-gradient(to right, #EC4899, #8B5CF6, #3B82F6)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background =
                  "linear-gradient(to right, #DB2777, #7C3AED, #2563EB)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background =
                  "linear-gradient(to right, #EC4899, #8B5CF6, #3B82F6)";
              }}
            >
              Get Started
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowDown className="size-5" />
              </motion.div>
            </Button>
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
