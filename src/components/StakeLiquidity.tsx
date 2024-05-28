import { useEffect, useState } from "react"
import { useCurrentAccount, useSignTransactionBlock } from "@mysten/dapp-kit"
import { TransactionBlock } from "@mysten/sui.js/transactions"

export default function StakeLiquidity({liquidity}:{liquidity:any}) {
  const [inputBalance, setInputBalance] = useState(0)
  const [data, setData] = useState<any>()
  const { mutate: signTransactionBlock } = useSignTransactionBlock();
  const [signature, setSignature] = useState('');
  const account = useCurrentAccount();
  const handleOpenModal = () => {
    // eslint-disable-next-line
    // @ts-ignore
    document.getElementById('open-swap').showModal()
  }

  const handleInput = (number: number) => {
    setInputBalance(number)
  }

  const handleMint = async () => {
    // eslint-disable-next-line
    // @ts-ignore

  }

  return (
    <div className="">
    <button onClick={()=> handleOpenModal()}  className="btn h-[160px] w-full bg-[#9C7251] hover:bg-[#E3B895] border-[#4F2B20] border-4">
      <div className="flex flex-col items-center justify-center py-2">
        <div className="grid grid-cols-2 place-items-center">
          <div className="relative w-14">
            <img src={liquidity.coinX?.iconUrl} className="size-7 rounded-full"/>
            <img src={liquidity.coinY?.iconUrl} className="size-7 rounded-full absolute top-0 left-4"/>
          </div>
          <div className="flex">
            <p className="badge bg-info/50 font-bold">{`${liquidity.coinX?.symbol} + ${liquidity.coinY?.symbol}`}</p>
          </div>
        </div>
        <div>
          <img src={`${liquidity.image}`} className="p-2 h-[120px]"/>
        </div>
      </div>
    </button>
    <dialog id="open-swap" className="modal">
      <div className="modal-box bg-[#E3B895] border-[#4F2B20] border-4 grid gap-4">
        <h3 className="font-bold text-lg">Stake liquidity token and get plant</h3>
        <label className="form-control w-full">
          <div className="w-full border-2 border-[#4F2B20] rounded-lg p-2 grid gap-4">
          <div className="grid grid-cols-8 place-items-center">
            <div className="relative w-14">
              <img src={liquidity.coinX?.iconUrl} className="size-7 rounded-full"/>
              <img src={liquidity.coinY?.iconUrl} className="size-7 rounded-full absolute top-0 left-4"/>
            </div>
            <div className="flex col-span-2">
              <p className="badge bg-info/50 font-bold">{`${liquidity.coinX?.symbol} + ${liquidity.coinY?.symbol}`}</p>
            </div>
          </div>
            <input onChange={(e) => handleInput(Number(e.target.value))} type="number" placeholder="Number of Liquidity token here" className="bg-[#F9CBA7] input input-bordered w-full" />
          </div>
        </label>

        <button onClick={() => handleMint()} className="btn bg-[#4F2B20] text-white font-bold">Mint</button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
  )
}