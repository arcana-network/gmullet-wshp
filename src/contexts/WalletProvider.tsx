"use client";

import { http } from "viem";
import {
  mainnet,
  scroll,
  base,
  arbitrum,
  optimism,
  polygon,
  linea,
} from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

// Configure wagmi
const config = createConfig({
  chains: [scroll],
  transports: {
    [mainnet.id]: http(),
    [scroll.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [linea.id]: http(),
  },
  connectors: [injected()],
});

// Create a client for react-query
const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
