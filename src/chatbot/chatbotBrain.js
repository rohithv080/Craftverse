// Enhanced rule-based intent & keywords extractor with advanced AI-like intelligence.
// Comprehensive training data and pattern recognition for e-commerce chatbot.

export function classifyIntent(text) {
  if (!text) return "unknown";
  const t = text.toLowerCase();

  // Enhanced greeting patterns with more variations
  if (/\b(hi|hello|hey|hiya|howdy|greetings|good morning|good afternoon|good evening|help|start|begin|welcome|what's up|namaste)\b/.test(t)) return "greeting";
  
  // Enhanced price related patterns with Indian context
  if (/\b(price|cost|how much|rupee|rs\.?|₹|expensive|cheap|budget|affordable|range|rate|charges|value|worth|money|paisa|thousand|hundred|lakh)\b/.test(t)) return "price";
  
  // Enhanced availability patterns
  if (/\b(available|availability|in stock|stock|out of stock|have|qty|quantity|buy|purchase|order|sold out|inventory|reserve|book)\b/.test(t)) return "availability";
  
  // Enhanced search/browse patterns with more synonyms
  if (/\b(show|find|search|looking for|recommend|browse|list|display|what|which|tell me about|explore|discover|see|view|check|get me|bring|fetch)\b/.test(t)) return "search";
  
  // Enhanced category specific patterns with Indian product context
  if (/\b(pottery|ceramic|clay|handmade|wooden|wood|jewelry|jewellery|fashion|gifts|home|living|pottery items|handicraft|craft|art|sculpture|carving|ornament|decor|decoration|traditional|ethnic|brass|copper|silver|cotton|silk|leather|bamboo|jute)\b/.test(t)) return "search";
  
  // Enhanced trending/popular patterns
  if (/\b(trending|popular|best|top|hot|new|latest|featured|bestseller|bestselling|favorite|famous|viral|in demand|most bought|everyone loves|hit|success)\b/.test(t)) return "trending";
  
  // Enhanced comparison patterns
  if (/\b(compare|difference|versus|vs|better|best|recommend|suggest|choose|pick|select|decide|between|or|prefer|contrast|against)\b/.test(t)) return "comparison";
  
  // Enhanced support patterns with Indian context
  if (/\b(support|issue|problem|complaint|return|refund|shipping|delivery|customer care|helpline|assistance|service|trouble|error|bug|not working|broken|damaged|wrong|cancel|exchange)\b/.test(t)) return "support";

  // Size and color queries
  if (/\b(size|colour|color|dimension|height|width|length|big|small|large|medium|red|blue|green|yellow|black|white|brown|golden|silver)\b/.test(t)) return "product_details";

  // Occasion-based queries
  if (/\b(wedding|birthday|anniversary|festival|diwali|christmas|new year|valentine|mother's day|father's day|gift|present|occasion|celebration|party)\b/.test(t)) return "occasion";

  // Location and delivery patterns
  if (/\b(delivery|shipping|location|address|pin|pincode|city|state|country|courier|dispatch|transport|logistics|time|days|fast|quick|express)\b/.test(t)) return "delivery";

  return "unknown";
}

export function extractKeywords(text) {
  if (!text) return [];
  
  // Enhanced cleaning with better unicode support and Indian language detection
  const cleaned = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Enhanced stop words list with Indian context
  const stop = new Set([
    "what","is","the","a","an","of","for","please","show","find","search","do","you","have",
    "any","in","stock","available","price","cost","how","much","this","that","me","on","at",
    "it","and","to","from","with","i","need","want","looking","for","are","is","does","there",
    "can","could","would","should","will","about","also","some","all","your","our","very",
    "just","only","like","good","best","new","get","make","go","see","know","time","way",
    "but","not","no","yes","or","as","be","by","he","she","they","we","us","my","his","her",
    "their","our","its","than","more","most","less","least","really","quite","such","many"
  ]);

  const tokens = cleaned.split(" ").filter(w => w.length > 2 && !stop.has(w));
  
  // Enhanced keyword extraction with comprehensive category mapping
  const categoryMappings = {
    'pottery': ['pottery', 'ceramic', 'clay', 'pot', 'vase', 'ceramics', 'earthen', 'terracotta'],
    'wooden': ['wooden', 'wood', 'carving', 'sculpture', 'teak', 'oak', 'bamboo', 'timber'],
    'jewelry': ['jewelry', 'jewellery', 'ornament', 'accessory', 'necklace', 'bracelet', 'earring', 'ring'],
    'fashion': ['fashion', 'clothing', 'dress', 'shirt', 'saree', 'kurta', 'ethnic', 'traditional'],
    'gifts': ['gift', 'present', 'surprise', 'souvenir', 'memento'],
    'home': ['home', 'living', 'decor', 'decoration', 'furniture', 'interior'],
    'pottery items': ['pottery', 'ceramic', 'clay', 'pottery items', 'ceramics', 'pots', 'vases'],
    'handmade': ['handmade', 'handcrafted', 'artisan', 'craft', 'handicraft', 'traditional'],
    'brass': ['brass', 'bronze', 'copper', 'metal'],
    'textile': ['cotton', 'silk', 'fabric', 'cloth', 'textile', 'jute', 'khadi']
  };

  // Price-related keyword mapping
  const priceKeywords = {
    'budget': ['budget', 'cheap', 'affordable', 'low', 'under', 'below'],
    'premium': ['premium', 'expensive', 'luxury', 'high', 'above', 'costly'],
    'range': ['range', 'between', 'from', 'to']
  };

  // Expand keywords based on category and price mappings
  const expandedTokens = [...tokens];
  tokens.forEach(token => {
    // Category expansion
    Object.entries(categoryMappings).forEach(([category, synonyms]) => {
      if (synonyms.includes(token) && !expandedTokens.includes(category)) {
        expandedTokens.push(category);
      }
    });
    
    // Price expansion
    Object.entries(priceKeywords).forEach(([priceCategory, synonyms]) => {
      if (synonyms.includes(token) && !expandedTokens.includes(priceCategory)) {
        expandedTokens.push(priceCategory);
      }
    });
  });
  
  // Return up to 10 tokens for better matching
  return expandedTokens.slice(0, 10);
}

// Advanced context understanding for better conversations
export function analyzeContext(message, previousMessages = []) {
  const context = {
    hasNumbers: /\d+/.test(message),
    hasPriceIndicators: /₹|rs|rupee|price|cost/i.test(message),
    hasUrgency: /urgent|asap|quickly|fast|immediately/i.test(message),
    hasComparison: /vs|versus|compare|better|best|or/i.test(message),
    hasNegation: /not|no|don't|won't|can't/i.test(message),
    sentiment: analyzeSentiment(message),
    previousContext: extractPreviousContext(previousMessages)
  };
  
  return context;
}

// Simple sentiment analysis for better responses
export function analyzeSentiment(text) {
  const positive = /good|great|excellent|amazing|wonderful|love|like|happy|satisfied|perfect|awesome/i;
  const negative = /bad|terrible|awful|hate|dislike|disappointed|angry|frustrated|worst|horrible/i;
  
  if (positive.test(text)) return 'positive';
  if (negative.test(text)) return 'negative';
  return 'neutral';
}

// Extract context from previous messages for continuity
export function extractPreviousContext(messages) {
  if (!messages || messages.length === 0) return {};
  
  const recentMessages = messages.slice(-3); // Last 3 messages
  const context = {
    discussedCategories: [],
    mentionedPrices: [],
    searchedTerms: []
  };
  
  recentMessages.forEach(msg => {
    if (msg.role === 'user') {
      const keywords = extractKeywords(msg.content);
      context.searchedTerms.push(...keywords);
      
      // Extract price mentions
      const priceMatches = msg.content.match(/₹?\s*\d+/g);
      if (priceMatches) {
        context.mentionedPrices.push(...priceMatches);
      }
    }
  });
  
  return context;
}

// Generate smart follow-up suggestions based on context
export function generateSmartSuggestions(intent, keywords, context) {
  const baseSuggestions = {
    search: [
      "Show me similar items",
      "What's the price range?",
      "Are these available now?",
      "Tell me about the materials"
    ],
    price: [
      "Show me budget options",
      "What's included in the price?",
      "Any discounts available?",
      "Compare with similar products"
    ],
    trending: [
      "Why are these popular?",
      "Show me customer reviews",
      "What makes these special?",
      "Any new arrivals?"
    ]
  };
  
  const contextualSuggestions = [];
  
  // Add category-specific suggestions
  if (keywords.includes('pottery')) {
    contextualSuggestions.push("Show me ceramic alternatives", "Find pottery gift sets");
  }
  
  if (keywords.includes('wooden')) {
    contextualSuggestions.push("Compare wood types", "Show me carved items");
  }
  
  if (keywords.includes('jewelry')) {
    contextualSuggestions.push("Find matching sets", "Show me silver options");
  }
  
  // Add price-based suggestions
  if (context.hasPriceIndicators) {
    contextualSuggestions.push("Show me value deals", "Find bulk discounts");
  }
  
  // Combine and randomize
  const allSuggestions = [...(baseSuggestions[intent] || baseSuggestions.search), ...contextualSuggestions];
  return allSuggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
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
