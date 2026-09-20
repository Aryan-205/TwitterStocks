-- 001_initial.sql — Social Stock Market schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gh_user_id TEXT UNIQUE NOT NULL,
  login TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallets (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  balance BIGINT NOT NULL DEFAULT 0,
  held BIGINT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 0
);

CREATE TABLE holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount BIGINT NOT NULL,
  reason TEXT NOT NULL,
  ref_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gh_user_id TEXT UNIQUE NOT NULL,
  login TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'active',
  opted_out_at TIMESTAMPTZ
);

CREATE TABLE creator_repos (
  creator_id UUID NOT NULL REFERENCES creators(id),
  repo_full_name TEXT NOT NULL,
  stars BIGINT NOT NULL DEFAULT 0,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (creator_id, repo_full_name)
);

CREATE TABLE creator_markets (
  creator_id UUID PRIMARY KEY REFERENCES creators(id),
  supply BIGINT NOT NULL DEFAULT 0,
  s0 BIGINT NOT NULL DEFAULT 10000,
  v_index NUMERIC(10,4) NOT NULL DEFAULT 1.0,
  v_target NUMERIC(10,4) NOT NULL DEFAULT 1.0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id),
  kind TEXT NOT NULL,
  weight INT NOT NULL DEFAULT 0,
  payload JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON engagement_events(creator_id, occurred_at DESC);

CREATE TABLE positions (
  user_id UUID NOT NULL REFERENCES users(id),
  creator_id UUID NOT NULL REFERENCES creators(id),
  shares BIGINT NOT NULL DEFAULT 0,
  avg_cost BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, creator_id)
);

CREATE TABLE short_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  creator_id UUID NOT NULL REFERENCES creators(id),
  shares BIGINT NOT NULL,
  entry_price BIGINT NOT NULL,
  collateral BIGINT NOT NULL,
  hold_id UUID REFERENCES holds(id),
  liq_price BIGINT,
  status TEXT NOT NULL DEFAULT 'open',
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON short_positions(creator_id, liq_price);

CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  creator_id UUID NOT NULL REFERENCES creators(id),
  side TEXT NOT NULL,
  shares BIGINT NOT NULL,
  gross BIGINT NOT NULL,
  fee BIGINT NOT NULL,
  exec_price BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON trades(creator_id, created_at DESC);

CREATE TABLE ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  delta BIGINT NOT NULL,
  reason TEXT NOT NULL,
  ref_type TEXT,
  ref_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON ledger(user_id);

CREATE TABLE ipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id),
  shares_offered BIGINT NOT NULL,
  floor_price BIGINT NOT NULL,
  opens_at TIMESTAMPTZ NOT NULL,
  closes_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  clearing_price BIGINT,
  settled_at TIMESTAMPTZ
);

CREATE TABLE ipo_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ipo_id UUID NOT NULL REFERENCES ipos(id),
  user_id UUID NOT NULL REFERENCES users(id),
  max_price BIGINT NOT NULL,
  qty BIGINT NOT NULL,
  hold_id UUID REFERENCES holds(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE daily_closes (
  creator_id UUID NOT NULL REFERENCES creators(id),
  trade_date DATE NOT NULL,
  open_price BIGINT NOT NULL,
  close_price BIGINT NOT NULL,
  pct_change NUMERIC(10,4),
  volume BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (creator_id, trade_date)
);

CREATE TABLE portfolio_snapshots (
  user_id UUID NOT NULL REFERENCES users(id),
  trade_date DATE NOT NULL,
  total_value BIGINT NOT NULL,
  pct_change NUMERIC(10,4),
  rank INT,
  PRIMARY KEY (user_id, trade_date)
);

CREATE TABLE game_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO game_config(key, value) VALUES
  ('faucet.signup', '10000'),
  ('faucet.daily_claim', '250'),
  ('faucet.referral', '1000'),
  ('fee.trade_pct', '1'),
  ('fee.short_borrow_pct_per_hr', '0.05'),
  ('market.sell_cooldown_seconds', '600'),
  ('ipo.min_tier', '"standard"');
