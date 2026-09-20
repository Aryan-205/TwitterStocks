// k=1 exact integer math. No floats in money path.
// P(s) = V * s / S0
// cost = V_bp * ((s+n)^2 - s^2) / (20000 * S0)
// V_bp in basis points (10000 = 1.0)

export function priceAtSupply(supply: bigint, vBp: bigint, s0: bigint): bigint {
  // V = vBp/10000, P = V*s/S0 = vBp*s / (10000*S0)
  if (s0 === 0n) return 0n;
  return (vBp * supply) / (10000n * s0);
}

export function costToBuy(supply: bigint, n: bigint, vBp: bigint, s0: bigint): bigint {
  if (n <= 0n) throw new Error("n must be > 0");
  if (s0 <= 0n) throw new Error("s0 must be > 0");
  // ceil division to favor house
  const num = vBp * ((supply + n) * (supply + n) - supply * supply);
  const den = 20000n * s0;
  return (num + den - 1n) / den;
}

export function proceedsToSell(supply: bigint, n: bigint, vBp: bigint, s0: bigint): bigint {
  if (n <= 0n) throw new Error("n must be > 0");
  if (n > supply) throw new Error("insufficient supply");
  if (s0 <= 0n) throw new Error("s0 must be > 0");
  // floor division to favor house
  const num = vBp * (supply * supply - (supply - n) * (supply - n));
  const den = 20000n * s0;
  return num / den;
}
