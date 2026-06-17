/**
 * Tiny app-wide store. Wallet connection state already lives in
 * `@solana/wallet-adapter-react`'s own context — this store only holds the cross-component
 * "something changed on-chain, please refetch" signal plus a running log of the demo's own
 * transactions (separate from each subscription's full history) for the activity feed.
 */
import { create } from "zustand";

export interface ActivityEntry {
  id: string;
  label: string;
  signature: string;
  timestamp: number;
}

interface AppState {
  /** Bumped after every successful transaction so data-fetching components know to refetch. */
  refreshKey: number;
  refresh: () => void;
  activity: ActivityEntry[];
  logActivity: (label: string, signature: string) => void;
  clearActivity: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  refreshKey: 0,
  refresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
  activity: [],
  logActivity: (label, signature) =>
    set((state) => ({
      activity: [
        { id: `${signature}-${Date.now()}`, label, signature, timestamp: Date.now() },
        ...state.activity,
      ].slice(0, 25),
    })),
  clearActivity: () => set({ activity: [] }),
}));
