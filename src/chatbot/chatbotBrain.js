// Lightweight rule-based intent & keywords extractor.
// Keeps everything local (no LLM). Export small helpers.

export function classifyIntent(text) {
  if (!text) return "unknown";
  const t = text.toLowerCase();

  // price related
  if (/\b(price|cost|how much|rupee|rs\.?|₹)\b/.test(t)) return "price";
  // availability related
  if (/\b(available|availability|in stock|stock|out of stock|have|qty|quantity)\b/.test(t)) return "availability";
  // search / browse
  if (/\b(show|find|search|looking for|recommend|browse|list)\b/.test(t)) return "search";
  // greeting
  if (/\b(hi|hello|hey|good morning|good afternoon|good evening|help)\b/.test(t)) return "greeting";

  return "unknown";
}

export function extractKeywords(text) {
  if (!text) return [];
  // keep letters/numbers/hyphen, normalize spacing
  const cleaned = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const stop = new Set([
    "what","is","the","a","an","of","for","please","show","find","search","do","you","have",
    "any","in","stock","available","price","cost","how","much","this","that","me","on","at",
    "it","and","to","from","with","i","need","want","looking","for","are","is","does","there"
  ]);

  const tokens = cleaned.split(" ").filter(w => w && !stop.has(w));
  // return up to first 6 tokens
  return tokens.slice(0, 6);
}

export function formatINR(n) {
  if (n == null) return "N/A";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
  } catch {
    return `₹${n}`;
  }
}
