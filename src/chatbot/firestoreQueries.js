import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  startAt,
  endAt,
  where,
} from "firebase/firestore";

/**
 * Search Firestore products collection:
 * 1) Try prefix search on 'nameLowercase' field using startAt/endAt (requires index if asked)
 * 2) Fallback: 'tags' array-contains-any
 *
 * db: Firestore instance (imported from your firebaseConfig)
 * options.keywords: array of tokens (lowercase)
 */
export async function searchProducts(db, { keywords = [], topK = 6 } = {}) {
  const ref = collection(db, "products");
  const results = [];

  // 1) prefix phrase search
  const phrase = keywords.join(" ").trim();
  if (phrase.length > 0) {
    try {
      // orderBy("nameLowercase") required for startAt/endAt
      const q1 = query(ref, orderBy("nameLowercase"), startAt(phrase), endAt(phrase + "\uf8ff"), limit(topK));
      const snap1 = await getDocs(q1);
      snap1.forEach((d) => results.push({ id: d.id, ...d.data() }));
    } catch (err) {
      // If Firestore requires index, console will show a link. We'll fallback later.
      // Don't throw here; continue to fallback search.
      // console.warn("prefix search failed", err);
    }
  }

  // 2) fallback: tags (array-contains-any)
  if (results.length === 0 && keywords.length > 0) {
    const tokens = keywords.slice(0, 10); // array-contains-any supports up to 10
    try {
      const q2 = query(ref, where("tags", "array-contains-any", tokens), limit(topK));
      const snap2 = await getDocs(q2);
      snap2.forEach((d) => results.push({ id: d.id, ...d.data() }));
    } catch (err) {
      // console.warn("tags search failed", err);
    }
  }

  return results;
}

/**
 * Pick best match from results using simple scoring:
 * - +1 for each keyword found in name/tags/description
 * - small boost if stock > 0
 */
export function pickBestMatch(results = [], keywords = []) {
  if (!results || results.length === 0) return null;

  const scored = results.map((p) => {
    const hay = ((p.name || "") + " " + (Array.isArray(p.tags) ? p.tags.join(" ") : "") + " " + (p.description || "")).toLowerCase();
    let score = 0;
    for (const k of keywords) {
      if (!k) continue;
      if (hay.includes(k)) score += 1;
    }
    if ((p.stock ?? 0) > 0) score += 0.1;
    return { item: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.item ?? null;
}
