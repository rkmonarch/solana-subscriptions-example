"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RPC_URL } from "@/lib/solana/constants";

import { ThemeProvider } from "@/components/theme-provider";

import "@solana/wallet-adapter-react-ui/styles.css";

/**
 * No explicit wallet list — `wallets={[]}` plus `autoConnect` is intentional. Every modern
 * Solana wallet (Phantom, Solflare, Backpack, ...) registers itself via the Wallet Standard, so
 * `@solana/wallet-adapter-react` auto-detects whatever's installed without us needing the old
 * (and dependency-heavy) `@solana/wallet-adapter-wallets` catch-all package.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      <ConnectionProvider endpoint={RPC_URL}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <TooltipProvider delay={150}>
              {children}
              <Toaster richColors position="bottom-right" theme="light" />
            </TooltipProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}
