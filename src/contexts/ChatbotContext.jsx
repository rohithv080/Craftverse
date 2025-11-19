import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { classifyIntent, extractKeywords } from "../chatbot/chatbotBrain";

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
    setLoading(true);
    
    try {
      const productsRef = collection(db, 'products');
      let q;
      
      // Enhanced querying strategy based on intent type
      if (intent === "trending") {
        q = query(productsRef, orderBy('createdAt', 'desc'), limit(12));
      } else if (intent === "price") {
        q = query(productsRef, orderBy('price', 'asc'), limit(15));
      } else {
        q = query(productsRef, limit(20));
      }
      
      const snapshot = await getDocs(q);
      
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });

      // Enhanced AI-like scoring algorithm with multiple factors
      const scored = products.map(product => {
        const searchText = `${product.name || ''} ${product.category || ''} ${product.description || ''}`.toLowerCase();
        let score = 0;
        
        keywords.forEach(keyword => {
          const keywordLower = keyword.toLowerCase();
          
          // Advanced pattern matching with weighted scoring
          // Name match gets highest priority (10 points)
          if ((product.name || '').toLowerCase().includes(keywordLower)) {
            score += keywordLower.length > 3 ? 10 : 8;
          }
          
          // Category match gets high priority (8 points)
          if ((product.category || '').toLowerCase().includes(keywordLower)) {
            score += 8;
          }
          
          // Description match gets medium priority (5 points)
          if ((product.description || '').toLowerCase().includes(keywordLower)) {
            score += 5;
          }
          
          // Exact word boundary match bonus (3 points)
          const words = searchText.split(/\s+/);
          if (words.includes(keywordLower)) {
            score += 3;
          }
          
          // Partial match for longer keywords (2 points)
          if (keywordLower.length > 4 && searchText.includes(keywordLower)) {
            score += 2;
          }
        });
        
        // Intent-based score boosting for better recommendations
        if (intent === "trending") {
          // Boost trending/featured products
          if (product.trending || product.featured || product.popularity > 0.8) {
            score += 6;
          }
          // Boost based on sales/popularity metrics
          if (product.sold && product.sold > 10) {
            score += Math.min(product.sold / 10, 4);
          }
        }
        
        if (intent === "availability") {
          // Boost available products for availability queries
          if (product.quantity > 0) {
            score += 5;
          }
          // Penalize out of stock items
          if (product.quantity === 0) {
            score -= 2;
          }
        }
        
        // General quality boosters
        if (product.quantity > 0) score += 2; // Available products
        if (product.rating && product.rating >= 4) score += 2; // Highly rated
        if (product.reviews && product.reviews > 5) score += 1; // Well reviewed
        
        return { ...product, score };
      });

      // Advanced filtering and sorting with dynamic limits
      const minScore = intent === "trending" ? 1 : 2;
      const resultLimit = intent === "trending" ? 8 : (intent === "price" ? 10 : 6);
      
      const filteredResults = scored
        .filter(p => p.score >= minScore)
        .sort((a, b) => {
          // Primary sort by score
          if (b.score !== a.score) return b.score - a.score;
          
          // Secondary sort based on intent
          if (intent === "price") {
            return (a.price || 0) - (b.price || 0);
          }
          if (intent === "trending") {
            return (b.sold || 0) - (a.sold || 0);
          }
          if (intent === "availability") {
            return (b.quantity || 0) - (a.quantity || 0);
          }
          
          // Default: sort by rating then by name
          return (b.rating || 0) - (a.rating || 0);
        })
        .slice(0, resultLimit);

      return filteredResults;
      
    } catch (error) {
      return [];
    } finally {
      setLoading(false);
    }
  };

  const formatProductResults = (results, intent, keywords = []) => {
    if (results.length === 0) {
      const suggestions = [
        "Try searching for 'pottery items'",
        "Ask about 'wooden handicrafts'", 
        "Look for 'jewelry collections'",
        "Browse 'home decor items'",
        "Check 'trending products'"
      ];
      const randomSuggestions = suggestions.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      return `I couldn't find any products matching your search. 😔\n\n💡 **Try these instead:**\n• ${randomSuggestions.join('\n• ')}\n\nOr ask me "What's available?" to see all products!`;
    }

    // Smart header generation based on intent and context
    const contextualHeaders = {
      search: keywords.length > 0 ? 
        `Found **${results.length} amazing ${keywords.join(', ')} products** for you:` :
        `Found **${results.length} amazing products** for you:`,
      price: `Here are **${results.length} products** with great pricing:`,
      availability: `**${results.length} products** available right now:`,
      trending: `🔥 **What's Hot Right Now** - ${results.length} trending items:`,
      product_details: `Here are **${results.length} products** with detailed information:`,
      occasion: `Perfect for your occasion - **${results.length} products**:`,
      delivery: `**${results.length} products** with delivery info:`,
      comparison: `Compare these **${results.length} similar products**:`
    };

    const header = contextualHeaders[intent] || `Found **${results.length} products** for you:`;

    // Enhanced product formatting with richer information
    const lines = results.map((p, index) => {
      const price = p.price ? `₹${p.price?.toLocaleString()}` : "Price on request";
      const stock = p.quantity || 0;
      
      // Smart stock status with urgency indicators
      let stockText;
      if (stock === 0) {
        stockText = "❌ Out of stock";
      } else if (stock <= 3) {
        stockText = `🔥 Only ${stock} left - Hurry!`;
      } else if (stock <= 10) {
        stockText = `⚠️ Limited stock (${stock} available)`;
      } else {
        stockText = "✅ In stock";
      }
      
      const category = p.category ? ` • ${p.category}` : "";
      const rating = p.rating ? ` ⭐ ${p.rating}/5` : "";
      const reviews = p.reviews ? ` (${p.reviews} reviews)` : "";
      
      // Add trending indicator for hot products
      const trendingBadge = (p.trending || p.featured || (p.sold > 20)) ? " 🔥" : "";
      
      // Add special badges based on product properties
      let badges = [];
      if (p.handmade) badges.push("🤲 Handmade");
      if (p.ecofriendly) badges.push("🌱 Eco-friendly");
      if (p.newArrival) badges.push("✨ New");
      
      const badgeText = badges.length > 0 ? `\n  ${badges.join(' • ')}` : "";
      
      return `${index + 1}. **${p.name}**${trendingBadge}${category}${rating}${reviews}\n  💰 ${price} • ${stockText}${badgeText}`;
    });

    // Intent-specific suggestions for better engagement
    const smartSuggestions = {
      search: [
        "Show me similar items",
        "What's the price range?",
        "Are these available for delivery?",
        "Tell me about the quality"
      ],
      price: [
        "Show me budget options under ₹500",
        "What's the most expensive item?",
        "Any discounts available?",
        "Compare prices with similar products"
      ],
      availability: [
        "When will out-of-stock items be back?",
        "Can I pre-order unavailable items?",
        "Show me alternatives",
        "What's the delivery time?"
      ],
      trending: [
        "Why are these trending?",
        "Show me customer reviews",
        "What makes these special?",
        "Any new arrivals?"
      ]
    };

    const suggestions = smartSuggestions[intent] || [
      "Tell me more about these products",
      "Show me similar items",
      "What's trending today?",
      "Help me choose"
    ];
    
    const randomSuggestions = suggestions.sort(() => 0.5 - Math.random()).slice(0, 2);
    const footer = `\n\n💡 **You can also ask:**\n• "${randomSuggestions[0]}"\n• "${randomSuggestions[1]}"`;

    return `${header}\n\n${lines.join("\n\n")}${footer}`;
  };

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    const userMsg = { role: "user", content: trimmed, time: Date.now() };
    setMessages((m) => [...m, userMsg]);

    const intent = classifyIntent(trimmed);
    const keywords = extractKeywords(trimmed);
    
    // Enhanced greeting with personalization
    if (intent === "greeting") {
      const greetings = [
        "Hi there! 👋 Welcome to Kaithiran - your destination for beautiful handcrafted treasures!",
        "Hello! 🌟 I'm excited to help you discover amazing handmade products today!",
        "Hey! 😊 Ready to explore our stunning collection of artisan-made items?"
      ];
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      const response = `${greeting}\n\n🛍️ **I can help you with:**\n• Finding specific products\n• Checking prices and availability\n• Discovering trending items\n• Comparing similar products\n\n💡 **Try asking:**\n• "Show me pottery items"\n• "What's under ₹500?"\n• "What's trending today?"\n• "Find wooden carvings for gifts"`;
      
      setMessages((m) => [...m, { 
        role: "bot", 
        content: response,
        time: Date.now()
      }]);
      return;
    }

    // Enhanced support with categorized help
    if (intent === "support") {
      setMessages((m) => [...m, { 
        role: "bot", 
        content: `I'd be happy to help with support questions! 🛠️\n\n📋 **Common Support Topics:**\n• **Orders & Shipping** - Contact our support team\n• **Returns & Refunds** - Check our returns policy\n• **Product Questions** - I can help you find specific items!\n• **Technical Issues** - Try refreshing the page\n• **Payment Issues** - Contact customer service\n\n🔍 **I'm great at helping with:**\n• Product searches and recommendations\n• Price and availability checks\n• Finding similar items\n• Comparing products\n\nWhat specific product information can I help you find?`,
        time: Date.now()
      }]);
      return;
    }

    // Enhanced comparison with smart suggestions
    if (intent === "comparison") {
      const comparisonSuggestions = [
        "Compare pottery vs ceramic items",
        "Show me budget vs premium wooden items",
        "What's better for wedding gifts - jewelry or pottery?",
        "Compare handmade vs machine-made products",
        "Wooden decor vs brass items - which is better?"
      ];
      const randomSuggestions = comparisonSuggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      setMessages((m) => [...m, { 
        role: "bot", 
        content: `I can help you compare products! 🔍\n\n🎯 **Smart Comparisons:**\n• Material comparisons (wood vs ceramic vs brass)\n• Price range comparisons (budget vs premium)\n• Style comparisons (traditional vs modern)\n• Occasion-based comparisons (gifts vs home use)\n\n💡 **Try asking:**\n• "${randomSuggestions[0]}"\n• "${randomSuggestions[1]}"\n• "${randomSuggestions[2]}"\n\nOr tell me the specific products you want to compare!`,
        time: Date.now()
      }]);
      return;
    }

    // New: Handle product details queries
    if (intent === "product_details") {
      setLoading(true);
      try {
        const results = await searchProducts(keywords, intent);
        const response = formatProductResults(results, intent, keywords);
        setMessages((m) => [...m, { 
          role: "bot", 
          content: response,
          time: Date.now()
        }]);
      } catch (err) {
        setMessages((m) => [...m, { 
          role: "bot", 
          content: "I'm having trouble getting product details right now. Please try again or ask about specific categories like 'pottery' or 'wooden items'.",
          time: Date.now()
        }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // New: Handle occasion-based queries
    if (intent === "occasion") {
      setLoading(true);
      try {
        const results = await searchProducts(keywords, intent);
        const occasionResponse = results.length > 0 ? 
          formatProductResults(results, intent, keywords) :
          `I'd love to help you find the perfect items for your occasion! 🎉\n\n🎁 **Popular Occasion Categories:**\n• **Weddings** - Traditional pottery, brass items, jewelry\n• **Festivals** - Decorative items, lamps, spiritual products\n• **Birthdays** - Personalized gifts, jewelry, home decor\n• **Housewarming** - Home decor, pottery, wooden furniture\n• **Anniversaries** - Jewelry, couple items, decorative pieces\n\nTell me more about your occasion and I'll find perfect matches!`;
        
        setMessages((m) => [...m, { 
          role: "bot", 
          content: occasionResponse,
          time: Date.now()
        }]);
      } catch (err) {
        setMessages((m) => [...m, { 
          role: "bot", 
          content: "Let me help you find occasion-specific items! Try telling me about the event - wedding, birthday, festival, etc.",
          time: Date.now()
        }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // New: Handle delivery queries
    if (intent === "delivery") {
      setMessages((m) => [...m, { 
        role: "bot", 
        content: `📦 **Delivery Information:**\n\n🚚 **Shipping Options:**\n• Standard Delivery: 5-7 business days\n• Express Delivery: 2-3 business days\n• Same Day: Available in select cities\n\n📍 **Coverage:**\n• Pan-India delivery available\n• International shipping for select items\n• Free shipping on orders above ₹999\n\n📋 **Tracking:**\n• SMS and email updates\n• Real-time tracking available\n• Secure packaging guaranteed\n\nWould you like me to show you products that are ready for immediate dispatch?`,
        time: Date.now()
      }]);
      return;
    }

    // Enhanced unknown intent handling
    if (intent === "unknown") {
      const helpSuggestions = [
        "Show me trending pottery items",
        "What wooden products are available?",
        "Find jewelry under ₹1000",
        "Browse home decor collection",
        "Show me handmade gifts"
      ];
      const randomHelp = helpSuggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      setMessages((m) => [...m, { 
        role: "bot", 
        content: `I'm here to help you discover amazing products! 🛍️\n\n🤖 **I understand queries like:**\n• **Product Search:** "Show me pottery items"\n• **Price Queries:** "What's under ₹500?"\n• **Availability:** "Is this item in stock?"\n• **Trending:** "What's popular right now?"\n• **Occasions:** "Find wedding gifts"\n• **Comparisons:** "Compare wooden vs ceramic items"\n\n💡 **Try these examples:**\n• "${randomHelp[0]}"\n• "${randomHelp[1]}"\n• "${randomHelp[2]}"\n\nJust describe what you're looking for and I'll help you find it!`,
        time: Date.now()
      }]);
      return;
    }

    // Handle all search-related intents with enhanced AI
    setLoading(true);
    try {
      const results = await searchProducts(keywords, intent);
      const response = formatProductResults(results, intent, keywords);
      
      setMessages((m) => [...m, { 
        role: "bot", 
        content: response,
        time: Date.now()
      }]);

    } catch (err) {
      const errorMessages = [
        "Oops! I'm having trouble searching right now. Please try again in a moment! 🔄",
        "Sorry, there seems to be a connection issue. Could you try rephrasing your question? 🤔",
        "I encountered an error while searching. Let me try to help you differently - what specific product are you looking for? 🔍"
      ];
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      
      setMessages((m) => [...m, { 
        role: "bot", 
        content: randomError,
        time: Date.now()
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
