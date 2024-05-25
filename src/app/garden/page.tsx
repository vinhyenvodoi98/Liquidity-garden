'use client'

import Pet from "@/components/Pet";
import PetInfo from "@/components/PetInfo";
import { SuiFrensCollection } from "@/constant";
import { fetchNFTs } from "@/tools/sui-indexer";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Garden() {
  const account = useCurrentAccount();

  const [nfts, setNfts] = useState<any>([])

  const plants = [
    "/images/plants/plant0.png",
    "/images/plants/plant1.png",
    "/images/plants/plant2.png",
    "/images/plants/plant3.png",
  ]
  const pets = [
    "/images/pugmeme/pug1.webp",
    "/images/pugmeme/pug2.webp",
    "/images/pugmeme/pug3.webp",
    "/images/pugmeme/pug4.webp",
    "/images/pugmeme/pug5.webp",
    "/images/pugmeme/pug6.webp",
    "/images/pugmeme/pug7.webp",
    "/images/pugmeme/pug8.webp",
  ]

  // useEffect(() => {
  //   const getNFT = async() =>{
  //     const data = await fetchNFTs(account?.address as string, "kiosk")
  //     setNfts(data.result.data)
  //   }

  //   if(account !== null && account?.address) getNFT()
  // }, [account])

  const suifrens = useMemo(() => nfts.filter((nft:any) => nft.collection === SuiFrensCollection), [nfts])

  return (
    <div className="bg-cover relative bg-center min-h-main bg-[url('/images/bg/myGarden1.jpeg')]">
      <div className="flex items-center justify-center w-full min-h-main">
        <div className="flex justify-center gap-4">
          {plants.map(plant => (
            <div key={plant}>
              <div className="flex justify-center cursor-pointer">
                <button className="btn h-16 bg-[#9C7251] hover:bg-[#E3B895] border-[#4F2B20] border-4">
                  <img src="/images/logo/waterer.png" className="size-16 p-2 rounded-lg"/>
                </button>
              </div>
              <img src={plant} className="h-60"/>
            </div>
          ))}
        </div>
      </div>
      {
        pets.map(pet => (
          <Pet key={pet} image={pet}/>
        ))
      }
      {
        suifrens.map((suifrens:any) => (
          <Pet key={suifrens.objectId} image={suifrens.image}/>
        ))
      }
      <PetInfo />
    </div>
  );
}
