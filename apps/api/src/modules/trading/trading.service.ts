// Trading: lock order is creator_markets -> wallets, ALWAYS. See spec.
// This comment is load-bearing — reversing it causes deadlocks under contention.

// import { costToBuy, proceedsToSell, feeFor } from "@repo/core"; // uncomment after `bun run build`

/**
 * Pseudocode for buy (READ COMMITTED):
 *   BEGIN
 *     SELECT supply,s0,v_index FROM creator_markets WHERE creator_id=$1 FOR UPDATE  -- 1. market first
 *     SELECT balance,held FROM wallets WHERE user_id=$2 FOR UPDATE                  -- 2. then wallet
 *     cost = costToBuy(...)
 *     fee = ceil(cost/100)
 *     if (balance-held) < cost+fee: ROLLBACK
 *     UPDATE wallets SET balance=balance-cost-fee
 *     UPDATE creator_markets SET supply=supply+n
 *     UPSERT positions (weighted avg cost)
 *     INSERT trades, ledger
 *   COMMIT
 */
export function placeholder() {}
