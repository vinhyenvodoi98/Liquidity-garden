import { fetchNFTs } from "@/tools/sui-indexer";
import {ILiquidity, getLiquidity, getUserLiquidityV3, IUserLiquidV3Position, getTickClmm, IGetClmmTicks} from "@flowx-pkg/ts-sdk"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react"

export default function FlowXLiquidity() {
  const [liquidityList, setLiquidityList] = useState<ILiquidity[]>([])
  const [liquidityListV3, setLiquidityListV3] = useState<IUserLiquidV3Position[]>([])
  const [liquidityNft, setliquidityNft] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const account = useCurrentAccount();

  useEffect(() => {
    // V2
    const getUserLiquidity = async () =>{
      let address: string = account?.address as string //required: user address
      let sortType: string = "lpValue" //optional (lpValue, userLpBalance, totalLpSupply)
      let sortOrder: string = "ascending" //optional (ascending , descending)
      let userLiquidity: ILiquidity[] = await getLiquidity(address, sortType, sortOrder)
      setLiquidityList(userLiquidity)

      // V3
      // @ts-ignore
      const liquidityV3: IUserLiquidV3Position = await getUserLiquidityV3(account?.address as string)
      // @ts-ignore
      setLiquidityListV3(liquidityV3)
    }

    if(account !== null && account?.address !== undefined) getUserLiquidity()
  }, [account])

  useEffect(() => {
    const getNFT = async() =>{
      const data = await fetchNFTs(account?.address as string)

      const liquidity = data.result.data.filter((data:any) => data.objectId == liquidityListV3[0].positionId)
      setliquidityNft( data.result.data)
      setIsLoading(false)
    }

    if(account !== null && account?.address && liquidityListV3.length > 0) getNFT()
  }, [account, liquidityListV3])

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-[400px] h-[600px] flex flex-col gap-4">
        <img src="/images/bg/board.png" className="top-0 absolute" />
        <div className="px-20 pt-[135px] z-20">
          <p className="font-bold text-center text-xl">FlowX Liquidity Info</p>
          {isLoading ?
            <div className="mt-7 flex gap-2 w-full px-2">
              <div className="skeleton w-9 h-7 rounded-full"/>
              <div className="skeleton h-7 w-full"></div>
            </div>
          :
            <div className="mt-7 ml-4">
              <p className="my-2 font-bold badge">FlowX pool V2</p>
              {liquidityList.map(liquidity => (
                <div key={liquidity.lpObjectId} className="grid grid-cols-5">
                  <div className="relative w-14">
                    <img src={liquidity.coinX?.iconUrl} className="size-7 rounded-full"/>
                    <img src={liquidity.coinY?.iconUrl} className="size-7 rounded-full absolute top-0 left-4"/>
                  </div>
                  <div className="col-span-2">
                    <p className="badge bg-info/50 font-bold">{`${liquidity.coinX?.symbol} + ${liquidity.coinY?.symbol}`}</p>
                  </div>
                  <div className="col-span-2 font-bold">
                    <p>{liquidity.userLpBalance}</p>
                  </div>
                </div>
              ))}

              <p className="my-2 mt-4 font-bold badge">FlowX pool V3</p>
              {liquidityListV3.map(liquidity => (
                <div key={liquidity.positionId} className="grid grid-cols-5">
                  <div className="relative w-14">
                    <img src={liquidity.coinX?.iconUrl} className="size-7 rounded-full"/>
                    <img src={liquidity.coinY?.iconUrl} className="size-7 rounded-full absolute top-0 left-4"/>
                  </div>
                  <div className="col-span-2">
                    <p className="badge bg-info/50 font-bold">{`${liquidity.coinX?.symbol} + ${liquidity.coinY?.symbol}`}</p>
                  </div>
                  <div className="col-span-2 font-bold">
                    {liquidityNft.filter((data:any) => data.objectId == liquidity.positionId).map((data:any) =>
                      <div key={data.collection} className="flex">
                        <div className="tooltip" data-tip={data.name}>
                          <p className="h-6 overflow-hidden" >{data.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  )
}