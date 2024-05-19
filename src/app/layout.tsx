import type { Metadata } from "next";

import "./globals.css";
import "@mysten/dapp-kit/dist/index.css";
import Providers from "@/components/Provider";

export const metadata: Metadata = {
  title: "Liquidity Garden",
  description: "Stake your liquidity and play game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
