'use client'

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function Garden() {

  const account = useCurrentAccount();
  const list = ["/images/seeds/seeds.png","/images/seeds/seeds1.png","/images/seeds/seeds2.png","/images/seeds/seeds3.png","/images/seeds/seeds4.png","/images/seeds/seeds5.png","/images/seeds/seeds6.png","/images/seeds/seeds7.png","/images/seeds/seeds8.png"]
  return (
    <div className="bg-cover bg-center min-h-main bg-[url('/images/bg/rack.jpeg')]">
      <div className="flex items-center justify-center w-full min-h-main">
        <div className="gap-4 w-1/3 h-1/3 grid grid-cols-4">
          {list.map(seed => (
            <div key={seed} className={`relative rounded-lg w-full`}>
              <button className="btn h-[160px] w-full">
                <p className="font-bold text-center">USDT-PUG</p>
                <img src={`${seed}`} className="p-2"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
