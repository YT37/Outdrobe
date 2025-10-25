import { Brain, Mic, ShoppingCart, Sparkles } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      icon: Mic,
      title: "Speak or Type",
      description:
        "Tell Outdrobe about your plans: 'I have a date tonight' or 'What should I wear to class?'",
      color: "#8B5CF6",
    },
    {
      icon: Brain,
      title: "Kloset Analyzes",
      description:
        "Kloset analyzes your wardrobe, checks outfit history, and considers event context.",
      color: "#EC4899",
    },
    {
      icon: Sparkles,
      title: "Get Suggestions",
      description:
        "Receive unique, color-coordinated outfit combinations that you haven't worn recently.",
      color: "#06B6D4",
    },
    {
      icon: ShoppingCart,
      title: "Fill the Gaps",
      description:
        "Missing items? Outdrobe finds affordable, high-rated alternatives with direct purchase links.",
      color: "#10B981",
    },
  ];

  return (
    <div id="how-it-works" ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">How It Works</h2>
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
              className="flex flex-col md:flex-row items-center gap-6 mb-12 last:mb-0"
            >
              <div className="relative">
                <div
                  className="size-20 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <step.icon
                    className="size-10"
                    style={{ color: step.color }}
                  />
                </div>
                <div
                  className="absolute -top-2 -right-2 size-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: step.color, color: "white" }}
                >
                  {index + 1}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-10 mt-32 w-0.5 h-12 bg-gradient-to-b from-border to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
