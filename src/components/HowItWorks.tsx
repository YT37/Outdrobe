import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Mic, Brain, Sparkles, ShoppingCart } from "lucide-react";

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      icon: Mic,
      title: "Speak or Type",
      description: "Tell Outdrobe about your plans: 'I have a date tonight' or 'What should I wear to class?'",
      color: "#8B5CF6",
    },
    {
      icon: Brain,
      title: "Kloset Analyzes",
      description: "Kloset analyzes your wardrobe, checks outfit history, and considers event context.",
      color: "#EC4899",
    },
    {
      icon: Sparkles,
      title: "Get Suggestions",
      description: "Receive unique, color-coordinated outfit combinations that you haven't worn recently.",
      color: "#06B6D4",
    },
    {
      icon: ShoppingCart,
      title: "Fill the Gaps",
      description: "Missing items? Outdrobe finds affordable, high-rated alternatives with direct purchase links.",
      color: "#10B981",
    },
  ];

  return (
    <div id="how-it-works" ref={ref} className="py-20 bg-background relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-full blur-3xl"
      />

      {/* Left side floating orbs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[5%] top-[15%] size-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute left-[8%] top-[50%] size-40 bg-gradient-to-br from-pink-500/15 to-blue-500/15 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute left-[3%] bottom-[20%] size-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"
      />

      {/* Right side floating orbs */}
      <motion.div
        animate={{
          y: [0, 35, 0],
          x: [0, -12, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute right-[6%] top-[20%] size-36 bg-gradient-to-br from-blue-500/20 to-purple-500/15 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 8, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute right-[4%] top-[55%] size-28 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
        className="absolute right-[7%] bottom-[15%] size-32 bg-gradient-to-br from-purple-500/15 to-pink-500/20 rounded-full blur-3xl"
      />

      {/* Animated particles */}
      <motion.div
        animate={{
          y: [0, -100],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute left-[15%] top-[30%] size-2 bg-purple-500 rounded-full"
      />
      <motion.div
        animate={{
          y: [0, -120],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
        }}
        className="absolute right-[18%] top-[40%] size-2 bg-pink-500 rounded-full"
      />
      <motion.div
        animate={{
          y: [0, -90],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 2,
        }}
        className="absolute left-[20%] bottom-[30%] size-2 bg-blue-500 rounded-full"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            How It Works
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to perfect outfits, every time
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02, x: 10 }}
              className="flex flex-col md:flex-row items-center gap-6 mb-12 last:mb-0 p-6 rounded-2xl hover:bg-muted/50 transition-all cursor-pointer group"
            >
              <motion.div 
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                {/* Animated glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{ backgroundColor: step.color }}
                />
                <div
                  className="size-20 rounded-full flex items-center justify-center shrink-0 relative z-0 backdrop-blur-sm group-hover:shadow-2xl transition-shadow"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <step.icon className="size-10" style={{ color: step.color }} />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 size-8 rounded-full flex items-center justify-center text-sm shadow-lg z-20"
                  style={{ backgroundColor: step.color, color: "white" }}
                  whileHover={{ scale: 1.2 }}
                >
                  {index + 1}
                </motion.div>
              </motion.div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
