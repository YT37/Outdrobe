import { motion, useAnimation } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect } from "react";
import { Heart, Sparkles, Zap, Target } from "lucide-react";

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { 
      value: "≥90%", 
      label: "User Satisfaction",
      icon: Heart,
      color: "#FF6B9D"
    },
    { 
      value: "100%", 
      label: "Non-Redundant Outfits",
      icon: Sparkles,
      color: "#8B5CF6"
    },
    { 
      value: "<2s", 
      label: "Response Time",
      icon: Zap,
      color: "#FFE66D"
    },
    { 
      value: "≥95%", 
      label: "Accurate Suggestions",
      icon: Target,
      color: "#4ECDC4"
    },
  ];

  return (
    <div ref={ref} className="py-20 bg-gradient-to-b from-background to-purple-50/30 dark:to-purple-950/10 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" 
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              className="text-center group"
            >
              <motion.div
                className="inline-flex items-center justify-center mb-3 relative"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {/* Pulsing glow effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-2xl blur-xl"
                  style={{ backgroundColor: stat.color }}
                />
                <div 
                  className="size-16 rounded-2xl flex items-center justify-center relative z-10 backdrop-blur-sm"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon 
                    className="size-8" 
                    style={{ color: stat.color }}
                  />
                </div>
              </motion.div>
              <motion.div 
                className="text-4xl md:text-6xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent transition-all"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
