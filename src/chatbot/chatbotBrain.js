// Enhanced rule-based intent & keywords extractor with better intelligence.
// Keeps everything local (no LLM). Export enhanced helpers.

export function classifyIntent(text) {
  if (!text) return "unknown";
  const t = text.toLowerCase();

  // Enhanced greeting patterns
  if (/\b(hi|hello|hey|good morning|good afternoon|good evening|help|start|begin)\b/.test(t)) return "greeting";
  
  // Enhanced price related patterns
  if (/\b(price|cost|how much|rupee|rs\.?|₹|expensive|cheap|budget|affordable|range)\b/.test(t)) return "price";
  
  // Enhanced availability patterns
  if (/\b(available|availability|in stock|stock|out of stock|have|qty|quantity|buy|purchase|order)\b/.test(t)) return "availability";
  
  // Enhanced search/browse patterns
  if (/\b(show|find|search|looking for|recommend|browse|list|display|what|which|tell me about)\b/.test(t)) return "search";
  
  // Category specific patterns
  if (/\b(pottery|ceramic|clay|handmade|wooden|wood|jewelry|fashion|gifts|home|living|pottery items)\b/.test(t)) return "search";
  
  // Trending/popular patterns
  if (/\b(trending|popular|best|top|hot|new|latest|featured|bestseller|bestselling)\b/.test(t)) return "trending";
  
  // Comparison patterns
  if (/\b(compare|difference|versus|vs|better|best|recommend|suggest)\b/.test(t)) return "comparison";
  
  // Support patterns
  if (/\b(support|issue|problem|complaint|return|refund|shipping|delivery)\b/.test(t)) return "support";

  return "unknown";
}

export function extractKeywords(text) {
  if (!text) return [];
  
  // Enhanced cleaning with better unicode support
  const cleaned = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Enhanced stop words list
  const stop = new Set([
    "what","is","the","a","an","of","for","please","show","find","search","do","you","have",
    "any","in","stock","available","price","cost","how","much","this","that","me","on","at",
    "it","and","to","from","with","i","need","want","looking","for","are","is","does","there",
    "can","could","would","should","will","about","also","some","all","your","our","very",
    "just","only","like","good","best","new","get","make","go","see","know","time","way"
  ]);

  const tokens = cleaned.split(" ").filter(w => w.length > 2 && !stop.has(w));
  
  // Enhanced keyword extraction with category mapping
  const categoryMappings = {
    'pottery': ['pottery', 'ceramic', 'clay', 'pot', 'vase'],
    'wooden': ['wooden', 'wood', 'carving', 'sculpture'],
    'jewelry': ['jewelry', 'jewellery', 'ornament', 'accessory'],
    'fashion': ['fashion', 'clothing', 'dress', 'shirt'],
    'gifts': ['gift', 'present', 'surprise'],
    'home': ['home', 'living', 'decor', 'decoration'],
    'pottery items': ['pottery', 'ceramic', 'clay', 'pottery items', 'ceramics']
  };

  // Expand keywords based on category mappings
  const expandedTokens = [...tokens];
  tokens.forEach(token => {
    Object.entries(categoryMappings).forEach(([category, synonyms]) => {
      if (synonyms.includes(token) && !expandedTokens.includes(category)) {
        expandedTokens.push(category);
      }
    });
  });
  
  // Return up to 8 tokens for better matching
  return expandedTokens.slice(0, 8);
}

export function formatINR(n) {
  if (n == null) return "N/A";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
  } catch {
    return `₹${n}`;
  }
}

// New helper functions for enhanced chatbot
export function generateSuggestions(intent, keywords) {
  const suggestions = {
    search: [
      "Show me pottery items",
      "Find wooden carvings",
      "What jewelry do you have?",
      "Display home decor items"
    ],
    price: [
      "Items under ₹500",
      "Budget-friendly options",
      "Premium products",
      "Price range ₹1000-2000"
    ],
    trending: [
      "What's trending now?",
      "Best sellers this month",
      "Most popular items",
      "New arrivals"
    ]
  };
  
  return suggestions[intent] || suggestions.search;
}

export function getRandomResponse(responseType) {
  const responses = {
    greeting: [
      "Hello! 👋 Welcome to Kaithiran! I'm here to help you find amazing handcrafted products.",
      "Hi there! 🙋‍♂️ I'm your shopping assistant. What can I help you find today?",
      "Welcome! ✨ I can help you discover our beautiful collection of handmade items."
    ],
    notFound: [
      "I couldn't find that specific item. Try searching with terms like 'pottery', 'wooden carvings', or 'handmade jewelry'.",
      "No matches found for that search. How about exploring our 'pottery' or 'gifts' collection?",
      "Hmm, I didn't find anything. Try broader terms like 'home decor' or 'fashion accessories'."
    ],
    error: [
      "Oops! I'm having trouble accessing our product database right now. Please try again in a moment.",
      "Sorry, something went wrong on my end. Could you try asking again?",
      "I'm experiencing some technical difficulties. Please bear with me and try again!"
    ]
  };
  
  const options = responses[responseType] || responses.error;
  return options[Math.floor(Math.random() * options.length)];
}
