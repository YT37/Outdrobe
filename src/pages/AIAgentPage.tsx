import {
  Brain,
  Mic,
  Palette,
  Send,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { createChatService, Message } from "../utils/chatService";
import { createVoiceService } from "../utils/voiceService";

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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatService = useRef(
    createChatService({
      onMessageAdd: (message) => setMessages((prev) => [...prev, message]),
      onProcessingChange: setIsProcessing,
      onSpeechTrigger: (text) => voiceService.speakText(text),
    })
  ).current;

  const voiceService = useRef(
    createVoiceService({
      onTranscriptionStart: () => {},
      onTranscriptionComplete: (text: string) => {
        setInputValue("");
        chatService.handleUserMessage(text);
      },
      onTranscriptionError: (_error: string) => {},
      onStateChange: (listening: boolean, transcribing: boolean) => {
        setIsListening(listening);
        setIsTranscribing(transcribing);
      },
      setInputValue: setInputValue,
      onSpeechStart: () => setIsSpeaking(true),
      onSpeechEnd: () => setIsSpeaking(false),
      onSpeechError: (_error: string) => setIsSpeaking(false),
    })
  ).current;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageContent = inputValue;
    setInputValue("");

    await chatService.handleUserMessage(messageContent);
  };

  const toggleVoice = () => {
    if (!isListening) {
      voiceService.startVoiceInput();
    } else {
      voiceService.stopVoiceInput();
    }
  };

  const [, setIsFocused] = useState(false);
  const hasMessages = messages.length > 1; // More than just the welcome message

  return (
    <div className="min-h-screen pt-16 pb-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 max-w-4xl min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        {/* Header - Always visible when no messages */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center mt-32 mb-16"
            >
              <h1
                className="text-3xl tracking-tight mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                }}
              >
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Klo
                </span>
                <span className="text-foreground">set</span>
                <span className="dark:text-white">.</span>
              </h1>
              <p
                className="text-muted-foreground text-lg"
                style={{ fontFamily: "var(--font-slogan)" }}
              >
                Your Agentic AI Stylist
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Container - Only show when has messages */}
        <AnimatePresence>
          {hasMessages && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 shadow-2xl">
                <CardContent className="p-0">
                  {/* Messages Area */}
                  <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                      {messages
                        .filter(
                          (message) => message && message.id && message.content
                        )
                        .map((message) => (
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
                                    : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
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

                                {/* Speaking indicator for agent messages */}
                                {message.type === "agent" && isSpeaking && (
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Volume2 className="size-4 animate-pulse" />
                                      <span>Speaking...</span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        voiceService.stopSpeaking()
                                      }
                                      className="h-6 px-2 text-xs hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20"
                                    >
                                      <VolumeX className="size-3 mr-1" />
                                      Stop
                                    </Button>
                                  </div>
                                )}
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
                                    <Sparkles className="size-5 text-purple-500" />
                                    <span className="text-sm">
                                      Outfit Suggestion
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="ml-auto"
                                    >
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
                                          <span className="text-sm">
                                            {item}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>

                                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg mb-3">
                                    <p className="text-sm text-muted-foreground">
                                      💡 {message.outfitSuggestion.reasoning}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Palette className="size-4 text-purple-500" />
                                    <span className="text-sm text-muted-foreground">
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
                                    <ShoppingBag className="size-5 text-green-500" />
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
                                      <Button
                                        size="sm"
                                        className="mt-1 bg-green-600 hover:bg-green-700"
                                        asChild
                                      >
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
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant={isListening ? "default" : "outline"}
                        onClick={toggleVoice}
                        className={
                          isListening
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"
                            : isTranscribing
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 animate-pulse"
                            : ""
                        }
                        disabled={false}
                      >
                        {isListening ? (
                          <Brain className="size-5 animate-spin" />
                        ) : isTranscribing ? (
                          <Brain className="size-5 animate-spin" />
                        ) : (
                          <Mic className="size-5" />
                        )}
                      </Button>

                      <Input
                        value={inputValue}
                        onChange={(e: any) => setInputValue(e.target.value)}
                        onKeyPress={(e: any) =>
                          e.key === "Enter" && handleSendMessage()
                        }
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
          )}
        </AnimatePresence>

        {/* Centered Input - Show when no messages */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="border-2 shadow-xl">
                <CardContent className="p-2">
                  <div className="flex gap-3 items-center px-4 py-2">
                    <div className="flex gap-1 pl-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleVoice}
                        className={`size-10 ${
                          isListening
                            ? "text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                            : isTranscribing
                            ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30 animate-pulse"
                            : ""
                        }`}
                        disabled={isTranscribing}
                      >
                        {isListening ? (
                          <Brain className="size-5 animate-spin" />
                        ) : isTranscribing ? (
                          <Brain className="size-5 animate-spin" />
                        ) : (
                          <Mic className="size-5" />
                        )}
                      </Button>
                    </div>

                    <Input
                      value={inputValue}
                      onChange={(e: any) => setInputValue(e.target.value)}
                      onKeyPress={(e: any) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="How can I help you today?"
                      className="flex-1 text-lg py-7 px-4 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isListening}
                    />

                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isProcessing}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 size-11 rounded-xl shrink-0"
                      size="icon"
                    >
                      <Send className="size-5" />
                    </Button>
                  </div>

                  {isListening && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-center mt-2 pb-2 text-purple-600"
                    >
                      🎤 Listening... Speak naturally
                    </motion.p>
                  )}

                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2 mt-2 pb-2"
                    >
                      <p className="text-xs text-blue-600">
                        🔊 AI is speaking...
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => voiceService.stopSpeaking()}
                        className="h-6 px-2 text-xs"
                      >
                        Stop
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Capability Buttons - Only show when no messages */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-6 flex flex-wrap justify-center gap-3"
            >
              {[
                {
                  icon: Brain,
                  label: "Remembers All Outfits",
                  color: "#8B5CF6",
                },
                {
                  icon: Palette,
                  label: "Color Theory Expert",
                  color: "#EF4444",
                },
                {
                  icon: ShoppingBag,
                  label: "Finds Best Deals",
                  color: "#10B981",
                },
                {
                  icon: TrendingUp,
                  label: "Learns Your Style",
                  color: "#F59E0B",
                },
              ].map((capability, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="px-5 py-6 gap-3 relative dark:backdrop-blur-xl dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 dark:text-white"
                  style={{
                    boxShadow: `0 0 20px ${capability.color}40, 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)`,
                    background: `linear-gradient(135deg, ${capability.color}15, ${capability.color}05)`,
                  }}
                >
                  <capability.icon
                    className="size-5"
                    style={{ color: capability.color }}
                  />
                  <span className="text-sm">{capability.label}</span>
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
