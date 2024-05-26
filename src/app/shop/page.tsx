'use client'

import FlowXLiquidity from "@/components/FlowXLiquidity";
import StakeLiquidity from "@/components/StakeLiquidity";

export default function Garden() {
  const list = [
    {
      image: "/images/seeds/seeds1.png",
      name: "SUI+FlX",
      lqName: "LP-0000000000000000000000000000000000000000000000000000000000000002::sui::SUI-6dae8ca14311574fdfe555524ea48558e3d1360d1607d1c7f98af867e3b7976c::flx::FLX",
      coinX:{
        decimals: 9,
        iconUrl: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg?1683114182",
        name: "Sui",
        symbol: "SUI",
        type: "0x2::sui::SUI"
      },
      coinY:{
        decimals:8,
        iconUrl:"https://ipfs.io/ipfs/bafkreig53olo3ewrkph3hfrhjuwvuj53pmbntl2cwxd4zlyfnj5eznoxcu",
        name:"FlowX Token",
        symbol:"FLX",
        type:"0x6dae8ca14311574fdfe555524ea48558e3d1360d1607d1c7f98af867e3b7976c::flx::FLX"
      }
    },
    {
      image: "/images/seeds/seeds2.png",
      name: "SUI+FUD",
      lqName: "LP-0000000000000000000000000000000000000000000000000000000000000002::sui::SUI-0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
      coinX:{
        decimals: 9,
        iconUrl: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg?1683114182",
        name: "Sui",
        symbol: "SUI",
        type: "0x2::sui::SUI"
      },
      coinY:{
        decimals:5,
        iconUrl: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/fud.png/public",
        name: "Fud the Pug",
        symbol: "FUD",
        type: "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD"
      }
    },]

  // // Coins
  // useEffect(() => {
  //   const getCoin = async() =>{
  //     const data = await fetchCoins(account?.address as string)
  //     console.log({data})
  //   }

  //   if(account !== null && account?.address) getCoin()
  // }, [account])

  // NFTs

  return (
    <div className="bg-cover bg-center min-h-main bg-[url('/images/bg/rack.jpeg')]">
      <div className="w-screen grid grid-cols-4">
        <div>
          <FlowXLiquidity />
        </div>
        <div className="flex items-center justify-center w-full min-h-main col-span-2">
          <div className="gap-4 grid grid-cols-4">
            {list.map(seed => (
              <div key={seed.lqName} className={`relative rounded-lg w-full`}>
                <StakeLiquidity liquidity={seed}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
