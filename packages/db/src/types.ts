// Generated via kysely-codegen — run bun run db:codegen to refresh.
// Minimal hand-typed DB for now; codegen overwrites this.
export interface DB {
  users: { id: string; gh_user_id: string; login: string; avatar_url: string | null; created_at: Date };
  wallets: { user_id: string; balance: string; held: string; version: number };
  holds: { id: string; user_id: string; amount: string; reason: string; ref_id: string | null; status: string; created_at: Date };
  creators: { id: string; gh_user_id: string; login: string; tier: string; status: string; opted_out_at: Date | null };
  creator_repos: { creator_id: string; repo_full_name: string; stars: string; last_seen_at: Date };
  creator_markets: { creator_id: string; supply: string; s0: string; v_index: string; v_target: string; updated_at: Date };
  engagement_events: { id: string; creator_id: string; kind: string; weight: number; payload: unknown; occurred_at: Date };
  positions: { user_id: string; creator_id: string; shares: string; avg_cost: string };
  short_positions: { id: string; user_id: string; creator_id: string; shares: string; entry_price: string; collateral: string; hold_id: string | null; liq_price: string | null; status: string; opened_at: Date };
  trades: { id: string; user_id: string; creator_id: string; side: string; shares: string; gross: string; fee: string; exec_price: string; created_at: Date };
  ledger: { id: string; user_id: string; delta: string; reason: string; ref_type: string | null; ref_id: string | null; created_at: Date };
  ipos: { id: string; creator_id: string; shares_offered: string; floor_price: string; opens_at: Date; closes_at: Date; status: string; clearing_price: string | null; settled_at: Date | null };
  ipo_bids: { id: string; ipo_id: string; user_id: string; max_price: string; qty: string; hold_id: string | null; status: string; created_at: Date };
  daily_closes: { creator_id: string; trade_date: string; open_price: string; close_price: string; pct_change: string | null; volume: string };
  portfolio_snapshots: { user_id: string; trade_date: string; total_value: string; pct_change: string | null; rank: number | null };
  game_config: { key: string; value: unknown; updated_at: Date };
}
