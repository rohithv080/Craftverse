import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { classifyIntent, extractKeywords, formatINR } from "../chatbot/chatbotBrain";

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

  const searchProducts = async (keywords) => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, limit(10));
      const snapshot = await getDocs(q);
      
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });

      // Simple keyword matching
      const filtered = products.filter(product => {
        const searchText = `${product.name || ''} ${product.category || ''} ${product.description || ''}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
      });

      return filtered.slice(0, 6);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    const userMsg = { role: "user", content: trimmed, time: Date.now() };
    setMessages((m) => [...m, userMsg]);

    const intent = classifyIntent(trimmed);
    
    if (intent === "greeting") {
      setMessages((m) => [...m, { 
        role: "bot", 
        content: "Hello! I'm here to help you find products on Kaithiran. You can ask me about:\n• Product prices\n• Product availability\n• Search for specific items\n• Get recommendations\n\nTry asking: 'Show me pottery items' or 'What's the price of wooden carvings?'" 
      }]);
      return;
    }

    if (intent === "unknown") {
      setMessages((m) => [...m, { 
        role: "bot", 
        content: "I can help you with product information! Try asking about:\n• Prices: 'What's the price of...?'\n• Availability: 'Is this item in stock?'\n• Search: 'Show me pottery items'\n• Categories: 'What fashion items do you have?'" 
      }]);
      return;
    }

    setLoading(true);
    try {
      const keywords = extractKeywords(trimmed);
      const results = await searchProducts(keywords);

      if (intent === "search") {
        if (results.length === 0) {
          setMessages((m) => [...m, { 
            role: "bot", 
            content: "I couldn't find any products matching your search. Try different keywords like 'pottery', 'wooden', 'handmade', or 'jewelry'." 
          }]);
        } else {
          const lines = results.map((p) => {
            const price = p.price ? `₹${p.price}` : "Price not set";
            const stock = p.quantity || 0;
            const stockText = stock > 0 ? `${stock} in stock` : "Out of stock";
            return `• **${p.name}** — ${price} — ${stockText}`;
          });
          setMessages((m) => [...m, { 
            role: "bot", 
            content: `Found ${results.length} products:\n\n${lines.join("\n")}\n\nClick on any product to view details!` 
          }]);
        }
        return;
      }

      if (results.length === 0) {
        setMessages((m) => [...m, { 
          role: "bot", 
          content: "I couldn't find that specific item. Try searching with broader terms like 'pottery', 'wooden carvings', or 'handmade jewelry'." 
        }]);
        return;
      }

      const best = results[0]; // Take first result as best match

      if (intent === "price") {
        const price = best.price ? `₹${best.price}` : "Price not set";
        setMessages((m) => [...m, { 
          role: "bot", 
          content: `**${best.name}** costs ${price}.\n\nCategory: ${best.category || 'Not specified'}\nDescription: ${best.description?.substring(0, 100) || 'No description available'}...` 
        }]);
      } else if (intent === "availability") {
        const price = best.price ? `₹${best.price}` : "Price not set";
        const stock = best.quantity || 0;
        const stockText = stock > 0 ? `${stock} units in stock` : "Currently out of stock";
        setMessages((m) => [...m, { 
          role: "bot", 
          content: `**${best.name}** is ${stockText}.\n\nPrice: ${price}\nCategory: ${best.category || 'Not specified'}` 
        }]);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((m) => [...m, { 
        role: "bot", 
        content: "Sorry, I'm having trouble accessing the product database right now. Please try again in a moment." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ open, setOpen, messages, sendMessage, loading, setMessages }), [open, messages, loading]);

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

export const useChatbot = () => useContext(ChatbotContext);
