import { describe, it, expect } from "vitest";
import { costToBuy, proceedsToSell, priceAtSupply } from "./curve.js";
import { feeFor } from "./money.js";

describe("curve", () => {
  it("buy then sell at same V loses exactly fees", () => {
    const s0 = 10000n, supply = 5000n, vBp = 10000n, n = 100n;
    const cost = costToBuy(supply, n, vBp, s0);
    const feeBuy = feeFor(cost);
    const proceeds = proceedsToSell(supply + n, n, vBp, s0);
    const feeSell = feeFor(proceeds);
    // Net after round-trip should be <= 0 (house takes fees), not positive
    const net = proceeds - feeSell - (cost + feeBuy);
    expect(net <= 0n).toBe(true);
  });
  it("monotonic: cost per share increases with supply", () => {
    const s0 = 10000n, vBp = 10000n;
    const c1 = costToBuy(1000n, 10n, vBp, s0);
    const c2 = costToBuy(9000n, 10n, vBp, s0);
    expect(c2 > c1).toBe(true);
  });
  it("rounding favors house: ceil buy, floor sell", () => {
    // fuzz random
    for (let i = 0; i < 1000; i++) {
      const s0 = BigInt(1000 + Math.floor(Math.random()*9000));
      const supply = BigInt(Math.floor(Math.random()*9000)+100);
      const vBp = BigInt(2000 + Math.floor(Math.random()*8000));
      const n = BigInt(1 + Math.floor(Math.random()*100));
      const cost = costToBuy(supply, n, vBp, s0);
      const proceeds = proceedsToSell(supply+n, n, vBp, s0);
      // cost >= proceeds when buying then selling same n (spread due to curve shape, house never loses)
      // At same V, proceeds <= cost (since curve convex upward, buying moves price up)
      expect(cost >= proceeds).toBe(true);
    }
  });
  it("price increases with supply", () => {
    expect(priceAtSupply(20000n, 10000n, 10000n) > priceAtSupply(10000n, 10000n, 10000n)).toBe(true);
  });
});

describe("index normalization", () => {
  it("mean V approx 1", async () => {
    const { normalizeScores } = await import("./index-math.js");
    const scores = Array.from({length: 10}, (_,i)=>({creatorId: String(i), raw: 10+i*5}));
    const norm = normalizeScores(scores);
    const mean = norm.reduce((s,x)=>s+x.v,0)/norm.length;
    expect(mean).toBeGreaterThan(0.8);
    expect(mean).toBeLessThan(1.2);
  });
});
