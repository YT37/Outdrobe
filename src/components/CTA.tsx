import { Button, Link, Mic, Users, Zap, motion } from "../utils/shared-imports";

export function CTA() {
  const features = [
    { icon: Mic, text: "Voice & Text Input" },
    { icon: Users, text: "Personalized for You" },
    { icon: Zap, text: "Instant Suggestions" },
  ];

  return (
    <div className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl mb-6">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who never worry about "what to wear" again. Kloset,
            your AI fashion advisor, is ready to help.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
              >
                <feature.icon className="size-4" />
                <span className="text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link to="/kloset">
              <Button
                size="lg"
                className="text-lg px-12 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Start Your Fashion Journey
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Free to start
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10 container mx-auto px-4 mt-24 pt-12 border-t border-border"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 Outdrobe. Your AI Fashion Companion.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
