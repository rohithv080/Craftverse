import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { classifyIntent, extractKeywords, formatINR, getRandomResponse, generateSuggestions } from "../chatbot/chatbotBrain";

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
        content: "Hi! 👋 I'm your personal shopping assistant at Kaithiran! I can help you:\n\n🔍 **Search products** - \"Show me pottery items\"\n💰 **Check prices** - \"What's the price of wooden carvings?\"\n📦 **Check availability** - \"Is this item in stock?\"\n🔥 **Find trending items** - \"What's popular right now?\"\n🎁 **Get recommendations** - \"Suggest gifts under ₹500\"\n\nWhat can I help you find today?",
      }];
    } catch {
      return [{
        role: "bot",
        content: "Hi! 👋 I'm your personal shopping assistant at Kaithiran! I can help you find amazing handcrafted products. What are you looking for today?",
      }];
    }
  });

  // persist enhanced conversation
  useEffect(() => {
    try {
      sessionStorage.setItem("chatbot_messages", JSON.stringify(messages.slice(-50)));
    } catch {}
  }, [messages]);

  const searchProducts = async (keywords, intent = "search") => {
    try {
      const productsRef = collection(db, 'products');
      let q;
      
      // Enhanced querying based on intent
      if (intent === "trending") {
        q = query(productsRef, orderBy('createdAt', 'desc'), limit(8));
      } else {
        q = query(productsRef, limit(12));
      }
      
      const snapshot = await getDocs(q);
      
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });

      // Enhanced keyword matching with scoring
      const scored = products.map(product => {
        const searchText = `${product.name || ''} ${product.category || ''} ${product.description || ''}`.toLowerCase();
        let score = 0;
        
        keywords.forEach(keyword => {
          const keywordLower = keyword.toLowerCase();
          if (searchText.includes(keywordLower)) {
            // Boost score for exact matches in name
            if ((product.name || '').toLowerCase().includes(keywordLower)) score += 3;
            // Boost score for category matches
            else if ((product.category || '').toLowerCase().includes(keywordLower)) score += 2;
            // Regular content match
            else score += 1;
          }
        });
        
        return { ...product, score };
      });

      // Return scored and filtered results
      return scored
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const formatProductResults = (results, intent) => {
    if (results.length === 0) {
      return getRandomResponse('notFound');
    }

    const header = {
      search: `Found **${results.length} amazing products** for you:`,
      price: `Here are **${results.length} products** with pricing:`,
      availability: `**${results.length} products** found - here's their availability:`,
      trending: `🔥 **Trending now** - ${results.length} hot items:`,
    }[intent] || `Found **${results.length} products**:`;

    const lines = results.map((p) => {
      const price = p.price ? `₹${p.price?.toLocaleString()}` : "Price not set";
      const stock = p.quantity || 0;
      const stockText = stock > 0 ? (stock <= 5 ? `⚠️ Only ${stock} left!` : "✅ In stock") : "❌ Out of stock";
      const category = p.category ? ` • ${p.category}` : "";
      
      return `• **${p.name}**${category}\n  💰 ${price} • ${stockText}`;
    });

    const suggestions = generateSuggestions(intent);
    const randomSuggestions = suggestions.slice(0, 2);

    return `${header}\n\n${lines.join("\n\n")}\n\n💡 **Try asking:** "${randomSuggestions.join('" or "')}"`;
  };

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    const userMsg = { role: "user", content: trimmed, time: Date.now() };
    setMessages((m) => [...m, userMsg]);

    const intent = classifyIntent(trimmed);
    
    if (intent === "greeting") {
      const response = getRandomResponse('greeting') + "\n\n💡 **Try asking:**\n• \"Show me pottery items\"\n• \"What's under ₹500?\"\n• \"What's trending?\"\n• \"Find wooden carvings\"";
      setMessages((m) => [...m, { 
        role: "bot", 
        content: response
      }]);
      return;
    }

    if (intent === "support") {
      setMessages((m) => [...m, { 
        role: "bot", 
        content: "I'd be happy to help with support questions! 🛠️\n\nFor:\n• **Orders & Shipping** - Contact our support team\n• **Returns & Refunds** - Check our returns policy\n• **Product Questions** - I can help you find specific items!\n• **Technical Issues** - Try refreshing the page\n\nWhat specific product information can I help you find?" 
      }]);
      return;
    }

    if (intent === "comparison") {
      setMessages((m) => [...m, { 
        role: "bot", 
        content: "I can help you compare products! 🔍\n\nTry asking:\n• \"Compare pottery vs ceramic items\"\n• \"Show me budget vs premium options\"\n• \"What's better for gifts - wooden or clay items?\"\n\nOr tell me the specific products you want to compare!" 
      }]);
      return;
    }

    if (intent === "unknown") {
      const suggestions = generateSuggestions('search');
      setMessages((m) => [...m, { 
        role: "bot", 
        content: `I'm here to help you find products! 🛍️\n\n**Try asking about:**\n• **Prices:** "What's the price of pottery items?"\n• **Categories:** "Show me wooden carvings"\n• **Availability:** "Is this item in stock?"\n• **Trending:** "What's popular right now?"\n\n💡 **Quick suggestions:**\n• "${suggestions[0]}"\n• "${suggestions[1]}"\n• "${suggestions[2]}"` 
      }]);
      return;
    }

    setLoading(true);
    try {
      const keywords = extractKeywords(trimmed);
      const results = await searchProducts(keywords, intent);

      const response = formatProductResults(results, intent);
      setMessages((m) => [...m, { 
        role: "bot", 
        content: response
      }]);

    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((m) => [...m, { 
        role: "bot", 
        content: getRandomResponse('error')
      }]);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ 
    open, 
    setOpen, 
    messages, 
    sendMessage, 
    loading, 
    setMessages 
  }), [open, messages, loading]);

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

export const useChatbot = () => useContext(ChatbotContext);
