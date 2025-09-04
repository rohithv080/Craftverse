import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../firebase/firebaseConfig"; // use your existing firebase config export
import { classifyIntent, extractKeywords, formatINR } from "../chatbot/chatbotBrain";
import { searchProducts, pickBestMatch } from "../chatbot/firestoreQueries";

const ChatbotContext = createContext();

export function ChatbotProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => {
    // load from sessionStorage if present
    try {
      const saved = sessionStorage.getItem("chatbot_messages");
      return saved ? JSON.parse(saved) : [{
        role: "bot",
        content: "Hi! I can help with pottery & handcraft products — ask about price, availability, or name of the product.",
      }];
    } catch {
      return [{
        role: "bot",
        content: "Hi! I can help with pottery & handcraft products — ask about price, availability, or name of the product.",
      }];
    }
  });

  // persist basic conversation so page reload doesn't clear it
  useEffect(() => {
    try {
      sessionStorage.setItem("chatbot_messages", JSON.stringify(messages.slice(-50)));
    } catch {}
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    const userMsg = { role: "user", content: trimmed, time: Date.now() };
    setMessages((m) => [...m, userMsg]);

    const intent = classifyIntent(trimmed);
    const allowed = ["price", "availability", "search", "greeting"];
    if (!allowed.includes(intent)) {
      const decline = { role: "bot", content: "I was not trained to answer this type of questions." };
      setMessages((m) => [...m, decline]);
      return;
    }

    if (intent === "greeting") {
      setMessages((m) => [...m, { role: "bot", content: "Hello! Ask me things like ‘price of terracotta vase’ or ‘is the blue mug in stock?’." }]);
      return;
    }

    setLoading(true);
    try {
      const keywords = extractKeywords(trimmed);
      const results = await searchProducts(db, { keywords, topK: 6 });
      const best = pickBestMatch(results, keywords);

      if (intent === "search") {
        if (results.length === 0) {
          setMessages((m) => [...m, { role: "bot", content: "I couldn't find matching products. Try different, more specific keywords (example: 'terracotta vase medium')." }]);
        } else {
          const lines = results.slice(0, 6).map((p) => {
            const price = p.priceINR != null ? formatINR(p.priceINR) : "N/A";
            const stock = p.stock ?? 0;
            return `• ${p.name} — ${price} — ${stock > 0 ? stock + " in stock" : "out of stock"}`;
          });
          setMessages((m) => [...m, { role: "bot", content: lines.join("\n") }]);
        }
        return;
      }

      if (!best) {
        setMessages((m) => [...m, { role: "bot", content: "I couldn't find that item. Try a more specific name (e.g., 'terracotta vase medium')." }]);
        return;
      }

      if (intent === "price") {
        const price = best.priceINR != null ? formatINR(best.priceINR) : "Price not set";
        setMessages((m) => [...m, { role: "bot", content: `${best.name} costs ${price}. SKU: ${best.sku ?? "N/A"}.` }]);
      } else if (intent === "availability") {
        const priceText = best.priceINR != null ? ` priced at ${formatINR(best.priceINR)}` : "";
        const available = (best.stock ?? 0) > 0;
        const stockText = available ? `${best.stock} in stock` : "currently out of stock";
        setMessages((m) => [...m, { role: "bot", content: `${best.name} is ${stockText}${priceText}.` }]);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((m) => [...m, { role: "bot", content: "Sorry, something went wrong while checking the database." }]);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ open, setOpen, messages, sendMessage, loading, setMessages }), [open, messages, loading]);

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

export const useChatbot = () => useContext(ChatbotContext);
