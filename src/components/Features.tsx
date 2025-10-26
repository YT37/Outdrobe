import {
  Brain,
  Calendar,
  Mic,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: Brain,
    title: "Agentic AI Memory",
    description:
      "Remembers every outfit combination to prevent repetition. Kloset learns and adapts to your preferences over time.",
    color: "#8B5CF6",
  },
  {
    icon: Mic,
    title: "Voice-First Experience",
    description:
      "Simply speak naturally: 'I've got a date tonight' or 'What should I wear for class tomorrow?' and get instant outfit suggestions.",
    color: "#EC4899",
  },
  {
    icon: Sparkles,
    title: "Smart Color Matching",
    description:
      "Uses color contrast principles to create visually appealing combinations that work perfectly for any occasion.",
    color: "#06B6D4",
  },
  {
    icon: ShoppingBag,
    title: "Intelligent Shopping",
    description:
      "Missing something? Outdrobe finds the cheapest, highest-rated options online and provides direct purchase links.",
    color: "#10B981",
  },
  {
    icon: Calendar,
    title: "Event-Based Planning",
    description:
      "Context-aware outfit suggestions based on your event type, weather, and personal calendar.",
    color: "#F59E0B",
  },
  {
    icon: TrendingUp,
    title: "Adaptive Learning",
    description:
      "Continuously improves recommendations based on your feedback and style evolution.",
    color: "#EF4444",
  },
];

export function Features() {
  return (
    <div
      id="features"
      className="py-24 bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <Sparkles className="size-12 text-purple-600 dark:text-purple-400 mx-auto" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            An intelligent fashion companion that thinks, remembers, and acts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-500/30 group">
                <CardContent className="p-6">
                  <motion.div
                    className="size-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}20` }}
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon
                      className="size-7"
                      style={{ color: feature.color }}
                    />
                  </motion.div>
                  <h3 className="text-xl mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
