const STOPWORDS = new Set([
  "and", "for", "the", "with", "that", "this", "from", "into", "your", "our",
  "are", "was", "were", "has", "have", "will", "not", "all", "any", "may",
]);

export function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 3 && !STOPWORDS.has(t))
  );
}

export function tokenizeAll(texts: string[]): Set<string> {
  const out = new Set<string>();
  for (const t of texts) for (const tok of tokenize(t)) out.add(tok);
  return out;
}

/** Overlap coefficient: |A ∩ B| / min(|A|, |B|). More forgiving than Jaccard
 * for short phrase lists where one side is naturally much larger. */
export function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const tok of a) if (b.has(tok)) intersection++;
  return intersection / Math.min(a.size, b.size);
}
