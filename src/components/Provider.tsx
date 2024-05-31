"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import 'react-toastify/ReactToastify.min.css';
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

const blockedenApi = process.env.NEXT_PUBLIC_BLOCKEDEN_API

const { networkConfig } = createNetworkConfig({
  devnet: { url: blockedenApi ? `https://api.blockeden.xyz/sui/devnet/${blockedenApi}` : getFullnodeUrl("devnet") },
  testnet: { url: blockedenApi ? `https://api.blockeden.xyz/sui/testnet/${blockedenApi}` : getFullnodeUrl("testnet") },
  mainnet: { url: blockedenApi ? `https://api.blockeden.xyz/sui/${blockedenApi}`: getFullnodeUrl("mainnet") },
});

export default function Providers({ children, cookie }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
        <WalletProvider autoConnect>
          <div className="relative">
            <div className="absolute w-screen">
              <Header />
            </div>
            <ToastContainer position="bottom-right" newestOnTop />
            {children}
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}