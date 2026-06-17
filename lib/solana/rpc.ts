/**
 * Shared Kit RPC clients. One HTTP client for reads/sends, one WebSocket client for
 * confirmations — created lazily and reused everywhere (browser + server) so the whole app
 * really does run on "one connection, many event streams".
 */
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

import { RPC_URL, RPC_WS_URL } from "./constants";

let rpcSingleton: ReturnType<typeof createSolanaRpc> | undefined;
let rpcSubscriptionsSingleton:
  | ReturnType<typeof createSolanaRpcSubscriptions>
  | undefined;

export function getRpc() {
  if (!rpcSingleton) {
    rpcSingleton = createSolanaRpc(RPC_URL);
  }
  return rpcSingleton;
}

export function getRpcSubscriptions() {
  if (!rpcSubscriptionsSingleton) {
    rpcSubscriptionsSingleton = createSolanaRpcSubscriptions(RPC_WS_URL);
  }
  return rpcSubscriptionsSingleton;
}
