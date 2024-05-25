import {ILiquidity, getLiquidity} from "@flowx-pkg/ts-sdk"
import { useEffect, useState } from "react"

export default function FlowXLiquidity() {
  const [liquidityList, setLiquidityList] = useState<ILiquidity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getUserLiquidity = async () =>{
      let address: string = "0xde8159d463efd76a5c4e684672e795d4516d46e30ad2b9907fdc2ff929d4278a" //required: user address
      let sortType: string = "lpValue" //optional (lpValue, userLpBalance, totalLpSupply)
      let sortOrder: string = "ascending" //optional (ascending , descending)
      let userLiquidity: ILiquidity[] = await getLiquidity(address, sortType, sortOrder)
      setLiquidityList(userLiquidity)
      setIsLoading(false)
    }

    getUserLiquidity()
  }, [])

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
            <div className="mt-7">
              {liquidityList.map(liquidity => (
                <div key={liquidity.lpObjectId} className="grid grid-cols-5">
                  <div className="relative w-14">
                    <img src={liquidity.coinX?.iconUrl} className="size-7 rounded-full"/>
                    <img src={liquidity.coinY?.iconUrl} className="size-7 rounded-full absolute top-0 left-4"/>
                  </div>
                  <div className="col-span-2">
                    <p className="badge bg-info/50 font-bold">{`${liquidity.coinX?.symbol} + ${liquidity.coinY?.symbol}`}</p>
                  </div>
                  <div className="col-span-2">
                    <p>{liquidity.userLpBalance}</p>
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