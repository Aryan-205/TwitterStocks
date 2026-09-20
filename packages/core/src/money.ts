// All amounts BIGINT minor units. 1 CLOUT = 100 units.

// Rounding favors house: buys ceil, sells floor.
export function feeFor(amount: bigint): bigint {
  // 1% fee, ceil
  return (amount + 99n) / 100n;
}
export function feeForSell(amount: bigint): bigint {
  // 1% fee also ceil per spec (burned) — but sell proceeds fee ceil too
  return (amount + 99n) / 100n;
}
export function assertSpendable(balance: bigint, held: bigint, cost: bigint): void {
  if (balance - held < cost) throw new Error("INSUFFICIENT_FUNDS");
}
export function spendable(balance: bigint, held: bigint): bigint {
  return balance - held;
}
