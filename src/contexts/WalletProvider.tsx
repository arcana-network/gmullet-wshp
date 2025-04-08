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
import { CAProvider, Network } from "@arcana/ca-wagmi";
// Configure wagmi
const config = createConfig({
  chains: [optimism, scroll, mainnet, base, arbitrum, polygon, linea],
  transports: {
    [scroll.id]: http(),
    [mainnet.id]: http(),
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
        <CAProvider
          config={{
            network: Network.CERISE,
          }}
        >
          {children}
        </CAProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
