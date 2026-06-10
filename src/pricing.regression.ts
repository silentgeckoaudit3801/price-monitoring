import assert from "node:assert/strict";
import { computePricing } from "./pricing.js";
import type { Ticker } from "./types.js";

const ticker = (pool_id: string, target_currency: string, price: number): Ticker => ({
    ticker_id: pool_id, base_currency: "STX", target_currency,
    last_price: String(price * 1e8), base_volume: "100", target_volume: "100",
    pool_id, liquidity_in_usd: "1000", bid: "0", ask: "0", high: "0", low: "0",
});

const circular = computePricing([ticker("stx-usdcx", "SP.usdcx", 2.5)], {});
assert.equal(circular.aggregated.find(p => p.symbol === "USDCx")?.internal_price_usd, null);

const routed = computePricing([
    ticker("stx-aeusdc", "SP.token-aeusdc", 2),
    ticker("stx-usdcx", "SP.usdcx", 2.5),
  ], {});
const usdcx = routed.aggregated.find(p => p.symbol === "USDCx");
assert.equal(usdcx?.internal_price_usd, 0.8);
assert.equal(usdcx?.is_divergent, true);
