'use client'
import Link from 'next/link';

import { ConnectButton } from '@mysten/dapp-kit';

export default function Header() {
  return (
    <div className='sticky top-0 z-50 h-16'>
      <div className='flex items-center justify-between px-6 h-16'>
        <div className="navbar">
          <div className="navbar-start">
            <Link href='/'>
              <button className="btn btn-ghost text-xl">Home</button>
            </Link>
          </div>
          <div className="navbar-end flex gap-4">
            <Link href='/shop'>
              <button className="btn text-xl">Shop</button>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}
