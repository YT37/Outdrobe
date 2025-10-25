import {
  Brain,
  Calendar,
  Card,
  CardContent,
  Mic,
  motion,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  useInView,
  useRef,
} from "../utils/shared-imports";

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

  return (
    <div
      id="features"
      ref={ref}
      className="py-20 bg-gradient-to-b from-background via-purple-50/30 to-background dark:via-purple-950/10"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-500/30 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <motion.div
                    className="size-14 rounded-xl flex items-center justify-center mb-4 relative"
                    style={{ backgroundColor: `${feature.color}20` }}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon
                      className="size-7"
                      style={{ color: feature.color }}
                    />
                  </motion.div>
                  <h3 className="text-xl mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
