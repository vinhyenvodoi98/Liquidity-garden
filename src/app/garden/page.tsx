'use client'

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Garden() {
  const account = useCurrentAccount();
  return (
    <div className="bg-cover bg-center min-h-main bg-[url('/images/bg/myGarden.jpeg')]">
      <div className="grid grid-rows-2 place-items-center min-h-main">
        
      </div>
    </div>
  );
}
