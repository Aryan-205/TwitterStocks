// Engagement index: raw -> normalized V

export interface RawScores { creatorId: string; raw: number }
export interface Normalized { creatorId: string; v: number }

export function normalizeScores(scores: RawScores[]): Normalized[] {
  if (scores.length === 0) return [];
  const mean = scores.reduce((s, x) => s + x.raw, 0) / scores.length;
  if (mean === 0) return scores.map(s => ({ creatorId: s.creatorId, v: 1.0 }));
  return scores.map(s => ({
    creatorId: s.creatorId,
    v: Math.min(5.0, Math.max(0.2, s.raw / mean)),
  }));
}

// Compute raw per spec: weighted sum of deltas
export function computeRaw(input: {
  deltaStars: number; deltaFollowers: number; mergedPRs: number;
  commits: number; releases: number; issuesClosed: number;
  weights: { w1: number; w2: number; w3: number; w4: number; w5: number; w6: number };
}): number {
  const { w1, w2, w3, w4, w5, w6 } = input.weights;
  return w1*input.deltaStars + w2*input.deltaFollowers + w3*input.mergedPRs + w4*input.commits + w5*input.releases + w6*input.issuesClosed;
}
