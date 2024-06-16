'use client'

import Pet from "@/components/Pet";
import PetInfo from "@/components/PetInfo";
import Plant from "@/components/Plant";
import PugPets from "@/components/PugPets";
import { FudType, SuiFrensCollection, liquidity_garden_type } from "@/constant";
import { fetchCoins, fetchNFTs } from "@/tools/sui-indexer";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useMemo, useState } from "react";

export default function Garden() {
  const account = useCurrentAccount();

  const [nfts, setNfts] = useState<any>([])
  const [coins, setCoins] = useState<any>([])

  const { data: seeds, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address as string,
		options: {
			showContent: true,
		},
	});

  // eslint-disable-next-line
  // @ts-ignore
  const plants = useMemo(() => seeds?.data.filter(nft => nft.data && nft.data.content && (nft.data.content.type as any) === liquidity_garden_type), [seeds])

  useEffect(() => {
    const getNFT = async() =>{
      const data = await fetchNFTs(account?.address as string, "kiosk")
      setNfts(data.result.data)
    }

    if(account !== null && account?.address) getNFT()
  }, [account])

  // Coins
  useEffect(() => {
    const getCoin = async() =>{
      const data = await fetchCoins(account?.address as string)
      setCoins(data.result.coins)
    }

    if(account !== null && account?.address) getCoin()
  }, [account])

  const suifrens = useMemo(() => nfts.filter((nft:any) => nft.collection === SuiFrensCollection), [nfts])

  const fudBalance = useMemo(() => coins.filter((coin:any) => coin.coinType === FudType), [coins])

  return (
    <div className="bg-cover relative bg-center min-h-main bg-[url('/images/bg/myGarden1.jpeg')]">
      <div className="flex items-center justify-center w-full min-h-main">
        <div className="flex justify-center gap-4">
          {plants && plants.map(plant => (
            <Plant key={plant.data?.objectId} plant={plant}/>
          ))}
        </div>
      </div>
      <PugPets pugBalance={fudBalance.length !==0 ? fudBalance[0].balance/(10*fudBalance[0].decimals) : 0}/>
      {
        suifrens.map((suifrens:any) => (
          <Pet key={suifrens.objectId} image={suifrens.image}/>
        ))
      }
      <PetInfo pugBalance={fudBalance.length !==0 ? fudBalance[0].balance/(10*fudBalance[0].decimals) : 0}/>
    </div>
  );
}
