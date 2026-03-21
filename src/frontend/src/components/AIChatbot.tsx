import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useAddChatMessage, useChatHistory } from "../hooks/useQueries";
import { generateFitbotResponse, suggestionChips } from "../lib/fitbot";

interface LocalMessage {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const INITIAL_MESSAGES: LocalMessage[] = [
  {
    id: "init",
    role: "assistant",
    content:
      "Hey! I'm your AI Fitness Coach 💪 I can help you with workouts, nutrition, recovery, and motivation. What would you like to work on today?",
  },
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: history } = useChatHistory();
  const { mutateAsync: addMessage } = useAddChatMessage();
  const [localMessages, setLocalMessages] =
    useState<LocalMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Listen for the nav "AI Coach" button to open the panel from anywhere
  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
    }
    window.addEventListener("fittrack:open_coach", handleOpen);
    return () => window.removeEventListener("fittrack:open_coach", handleOpen);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only when history length changes
  useEffect(() => {
    if (history && history.length > 0) {
      const mapped: LocalMessage[] = history.map((m, i) => ({
        id: `hist-${i}`,
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      setLocalMessages([INITIAL_MESSAGES[0], ...mapped]);
    }
  }, [history?.length]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally scroll on message count or typing changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages.length, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: LocalMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    setLocalMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    const response = generateFitbotResponse(text);
    const botMsg: LocalMessage = {
      id: `b-${Date.now()}`,
      role: "assistant",
      content: response,
    };
    setLocalMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);

    try {
      await addMessage({ role: "user", content: text });
      await addMessage({ role: "assistant", content: response });
    } catch {
      // silently ignore
    }
  };

  return (
    <>
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            data-ocid="coach.card"
            className="fixed bottom-24 right-6 z-50 w-[360px] h-[520px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow:
                "0 0 40px 0 rgba(0,200,255,0.18), 0 8px 32px 0 rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0 bg-card/90 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-display font-bold text-foreground">
                  AI Fitness Coach
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Online · Ready to help
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                data-ocid="coach.close_button"
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-4 py-3 space-y-3">
                <AnimatePresence>
                  {localMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === "assistant"
                            ? "bg-primary/15 border border-primary/20"
                            : "bg-accent/15 border border-accent/20"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <Bot className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-accent" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "assistant"
                            ? "bg-muted/60 text-foreground rounded-tl-sm border border-border"
                            : "bg-primary/15 text-foreground rounded-tr-sm border border-primary/20"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <div className="flex gap-2.5" data-ocid="coach.loading_state">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="bg-muted/60 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center border border-border">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Suggestion chips */}
            <div
              className="px-4 pt-2 flex gap-2 overflow-x-auto pb-2 flex-shrink-0"
              style={{ scrollbarWidth: "none" }}
            >
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => sendMessage(chip)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-primary/25 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border flex gap-2 flex-shrink-0">
              <Input
                data-ocid="coach.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder="Ask your AI coach..."
                className="bg-muted/60 border-border text-foreground placeholder:text-muted-foreground flex-1"
              />
              <Button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                data-ocid="coach.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 shadow-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-[#00c8ff]/30 pointer-events-none" />
        )}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          data-ocid="coach.open_modal_button"
          className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-[#0a1628] border-2 border-[#00c8ff] hover:border-[#00c8ff]/80"
          style={{
            boxShadow: isOpen
              ? "0 0 0 0 transparent"
              : "0 0 24px 4px rgba(0,200,255,0.45), 0 4px 16px 0 rgba(0,0,0,0.5)",
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="w-6 h-6 text-[#00c8ff]" />
              </motion.span>
            ) : (
              <motion.span
                key="bot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Bot className="w-6 h-6 text-[#00c8ff]" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
}
