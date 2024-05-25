'use client'
import Link from 'next/link';

import { ConnectButton } from '@mysten/dapp-kit';

export default function Header() {
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
