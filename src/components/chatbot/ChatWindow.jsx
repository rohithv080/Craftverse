import React, { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble.jsx";
import { useChatbot } from "../../contexts/ChatbotContext.jsx";

export default function ChatWindow({ onClose }) {
  const { messages, sendMessage, loading } = useChatbot();
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const onSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 right-4 w-[360px] max-h-[70vh] bg-slate-50/95 backdrop-blur border border-slate-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col z-[9999]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-600" />
            <div className="font-semibold">Kaithiran Assistant</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-slate-50 to-slate-100"
        >
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role}>
              {m.content}
            </MessageBubble>
          ))}

          {loading && (
            <div className="text-xs text-slate-500 px-2 py-1">
              Checking product details…
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} className="p-3 bg-white border-t">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about price or availability..."
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-2xl bg-sky-600 text-white px-3 py-2 text-sm disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
