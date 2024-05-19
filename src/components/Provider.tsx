"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import Header from "./Header";
const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
  cookie?: string | null;
};

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

export default function Providers({ children, cookie }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
        <WalletProvider autoConnect>
          <Header />
            {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}