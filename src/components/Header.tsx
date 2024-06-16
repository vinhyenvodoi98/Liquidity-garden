'use client'
import Link from 'next/link';

import { ConnectButton, useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { useMemo, useState } from 'react';
import { oxygen_type } from '@/constant';

export default function Header() {
  const account = useCurrentAccount();
  // Coins
  const { data: balance } = useSuiClientQuery('getAllBalances', {
    owner: account?.address as string,
	});

  const oxyBalance = useMemo(() => balance ? balance.filter((coin:any) => coin.coinType === oxygen_type) : [], [balance])

  return (
    <div className='sticky top-0 z-50'>
      <div className='flex items-center justify-between px-6 h-32'>
        <div className="navbar">
          <div className="navbar-start">
            <Link href='/garden'>
              <button className="btn h-16 bg-[#9C7251] hover:bg-[#E3B895] border-[#4F2B20] border-4">
                <img src="/images/logo/home.png" className='size-14'/>
              </button>
            </Link>
          </div>
          <div className="navbar-end flex gap-4">
            <div className='h-16 bg-[#9C7251] border-[#4F2B20] border-4 flex gap-4 rounded-lg p-3 w-40 items-end'>
              <img src="/images/logo/oxygen.webp" className='rounded-full h-8' />
              <p className='font-bold text-2xl'>{oxyBalance[0] ? (Number(oxyBalance[0].totalBalance)/10**6) :"0"}</p>
            </div>
            <Link href='/shop'>
              <button className="btn h-16 bg-[#9C7251] hover:bg-[#E3B895] border-[#4F2B20] border-4">
                <img src="/images/logo/shop.png" className='size-14'/>
              </button>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}
