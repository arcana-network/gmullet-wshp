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
import { CAProvider } from "@arcana/ca-wagmi";
// Configure wagmi
const config = createConfig({
  chains: [optimism],
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
      <QueryClientProvider client={queryClient}>
        <CAProvider network={"dev"}>{children}</CAProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
