import {
  Brain,
  MessageSquare,
  Mic,
  Palette,
  Send,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  outfitSuggestion?: OutfitSuggestion;
  dealSuggestion?: DealSuggestion;
  agentAction?: string;
}

interface OutfitSuggestion {
  items: string[];
  reasoning: string;
  colorScore: number;
  style: string;
}

interface DealSuggestion {
  item: string;
  price: string;
  store: string;
  link: string;
  imageUrl?: string;
}

export function AIAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content:
        "Hey there! 👋 I'm Kloset, your AI stylist. What's your plan today? I can help you find the perfect outfit!",
      timestamp: new Date(),
      agentAction: "greeting",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const agentResponse = generateAgentResponse(inputValue);
      setMessages((prev) => [...prev, agentResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateAgentResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();

    // Detect context
    if (lowerInput.includes("date") || lowerInput.includes("dinner")) {
      return {
        id: Date.now().toString(),
        type: "agent",
        content:
          "Perfect timing for a date outfit! 💕 Let me create something special for you...",
        timestamp: new Date(),
        outfitSuggestion: {
          items: [
            "Black slim-fit jeans",
            "Beige button-up shirt",
            "Brown leather jacket",
            "White sneakers",
          ],
          reasoning:
            "This combination balances casual comfort with sophisticated style. The complementary beige and black create visual interest, while the brown jacket adds warmth. Perfect contrast for a memorable evening!",
          colorScore: 92,
          style: "Smart Casual",
        },
        agentAction: "outfit_generation",
      };
    } else if (
      lowerInput.includes("interview") ||
      lowerInput.includes("professional") ||
      lowerInput.includes("work")
    ) {
      return {
        id: Date.now().toString(),
        type: "agent",
        content:
          "Let's make a great first impression! I'm analyzing your wardrobe for professional options...",
        timestamp: new Date(),
        outfitSuggestion: {
          items: [
            "Navy blue suit",
            "White dress shirt",
            "Burgundy tie",
            "Black oxford shoes",
          ],
          reasoning:
            "Navy conveys trust and professionalism. The burgundy tie adds a pop of confidence without being too bold. This triadic color scheme (navy-white-burgundy) is both classic and powerful.",
          colorScore: 95,
          style: "Formal",
        },
        dealSuggestion: {
          item: "Burgundy Silk Tie",
          price: "$15.99",
          store: "Amazon",
          link: "#",
          imageUrl:
            "https://images.unsplash.com/photo-1589756823695-278bc8b6c4f0?w=200",
        },
        agentAction: "outfit_with_deal",
      };
    } else if (
      lowerInput.includes("class") ||
      lowerInput.includes("campus") ||
      lowerInput.includes("college")
    ) {
      return {
        id: Date.now().toString(),
        type: "agent",
        content:
          "Campus vibes coming right up! Let me check what you haven't worn recently...",
        timestamp: new Date(),
        outfitSuggestion: {
          items: [
            "Light blue jeans",
            "Grey hoodie",
            "White t-shirt",
            "Canvas sneakers",
          ],
          reasoning:
            "Comfortable and casual for all-day campus wear. The analogous grey-blue palette is easy on the eyes and gives off relaxed student energy. You haven't worn this combo in 12 days!",
          colorScore: 88,
          style: "Casual",
        },
        agentAction: "outfit_generation",
      };
    } else if (
      lowerInput.includes("party") ||
      lowerInput.includes("night out") ||
      lowerInput.includes("club")
    ) {
      return {
        id: Date.now().toString(),
        type: "agent",
        content: "Time to stand out! 🌟 Creating a bold look for you...",
        timestamp: new Date(),
        outfitSuggestion: {
          items: [
            "Black skinny jeans",
            "Metallic silver top",
            "Black leather jacket",
            "Heeled boots",
          ],
          reasoning:
            "High contrast black and silver creates drama and catches light perfectly for nightlife. This monochromatic base with metallic accents gives you that streetwear edge.",
          colorScore: 90,
          style: "Streetwear",
        },
        agentAction: "outfit_generation",
      };
    } else {
      return {
        id: Date.now().toString(),
        type: "agent",
        content:
          'I\'d love to help! Could you tell me more about the occasion? For example:\n\n• "I have a date tonight"\n• "Job interview tomorrow"\n• "Just class on campus"\n• "Going to a party"\n\nThe more context you give me, the better I can style you! 😊',
        timestamp: new Date(),
        agentAction: "context_request",
      };
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // In a real implementation, this would use Web Speech API
    if (!isListening) {
      // Start listening
      setTimeout(() => {
        setInputValue("I've got a date tonight");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full border border-purple-500/20">
            <Brain className="size-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm">Meet Kloset</span>
          </div>
          <h1 className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Agentic AI Stylist
          </h1>
          <p className="text-muted-foreground">
            Speak naturally or type your plans. Kloset will create the perfect
            outfit just for you.
          </p>
        </motion.div>

        {/* Agent Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {[
            { icon: Brain, label: "Remembers All Outfits", color: "#8B5CF6" },
            { icon: Palette, label: "Color Theory Expert", color: "#EC4899" },
            { icon: ShoppingBag, label: "Finds Best Deals", color: "#10B981" },
            { icon: TrendingUp, label: "Learns Your Style", color: "#F59E0B" },
          ].map((capability, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-3 py-2 gap-2 border-2"
              style={{ borderColor: `${capability.color}40` }}
            >
              <capability.icon
                className="size-4"
                style={{ color: capability.color }}
              />
              <span className="text-sm">{capability.label}</span>
            </Badge>
          ))}
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 shadow-2xl">
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-3 ${
                        message.type === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <Avatar className="size-10 shrink-0">
                        <AvatarFallback
                          className={
                            message.type === "agent"
                              ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                              : "bg-muted"
                          }
                        >
                          {message.type === "agent" ? (
                            <Sparkles className="size-5" />
                          ) : (
                            "U"
                          )}
                        </AvatarFallback>
                      </Avatar>

                      {/* Message Content */}
                      <div
                        className={`flex-1 max-w-[80%] ${
                          message.type === "user" ? "items-end" : ""
                        }`}
                      >
                        <div
                          className={`rounded-2xl p-4 ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto"
                              : "bg-muted"
                          }`}
                        >
                          <p className="whitespace-pre-line">
                            {message.content}
                          </p>
                        </div>

                        {/* Outfit Suggestion */}
                        {message.outfitSuggestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-3 p-4 bg-white dark:bg-card rounded-xl border-2 border-purple-500/20"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="size-5 text-purple-600" />
                              <span className="text-sm">Outfit Suggestion</span>
                              <Badge variant="secondary" className="ml-auto">
                                {message.outfitSuggestion.style}
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-3">
                              {message.outfitSuggestion.items.map(
                                (item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="size-2 rounded-full bg-purple-500" />
                                    <span className="text-sm">{item}</span>
                                  </div>
                                )
                              )}
                            </div>

                            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg mb-3">
                              <p className="text-sm text-muted-foreground">
                                💡 {message.outfitSuggestion.reasoning}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Palette className="size-4 text-purple-600" />
                              <span className="text-sm">
                                Color Harmony Score:
                              </span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${message.outfitSuggestion.colorScore}%`,
                                  }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                />
                              </div>
                              <span className="text-sm">
                                {message.outfitSuggestion.colorScore}%
                              </span>
                            </div>
                          </motion.div>
                        )}

                        {/* Deal Suggestion */}
                        {message.dealSuggestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-3 p-4 bg-white dark:bg-card rounded-xl border-2 border-green-500/20"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <ShoppingBag className="size-5 text-green-600" />
                              <span className="text-sm">
                                Missing Item Found
                              </span>
                            </div>

                            <div className="flex gap-3 items-center">
                              {message.dealSuggestion.imageUrl && (
                                <div className="size-16 bg-muted rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={message.dealSuggestion.imageUrl}
                                    alt={message.dealSuggestion.item}
                                    className="size-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-sm mb-1">
                                  {message.dealSuggestion.item}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {message.dealSuggestion.store}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg text-green-600">
                                  {message.dealSuggestion.price}
                                </p>
                                <Button size="sm" className="mt-1" asChild>
                                  <a
                                    href={message.dealSuggestion.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Deal
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <p className="text-xs text-muted-foreground mt-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <Sparkles className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl p-4">
                      <div className="flex gap-2">
                        <div className="size-2 bg-purple-500 rounded-full animate-pulse" />
                        <div className="size-2 bg-purple-500 rounded-full animate-pulse delay-150" />
                        <div className="size-2 bg-purple-500 rounded-full animate-pulse delay-300" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant={isListening ? "default" : "outline"}
                    onClick={toggleVoice}
                    className={
                      isListening
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"
                        : ""
                    }
                  >
                    {isListening ? (
                      <Volume2 className="size-5" />
                    ) : (
                      <Mic className="size-5" />
                    )}
                  </Button>

                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type or speak your plans..."
                    className="flex-1"
                    disabled={isListening}
                  />

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="size-5" />
                  </Button>
                </div>

                {isListening && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-center mt-2 text-purple-600 dark:text-purple-400"
                  >
                    🎤 Listening... Speak naturally
                  </motion.p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground mb-3">
            Try these prompts:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "I've got a date tonight",
              "Job interview tomorrow at 9",
              "Just class on campus",
              "Going to a party this weekend",
            ].map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(prompt)}
                className="text-xs"
              >
                <MessageSquare className="size-3 mr-1" />
                {prompt}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
