import { useEffect, useState } from "react"
import { useCurrentAccount, useSignAndExecuteTransactionBlock, useSignTransactionBlock, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit"
import { TransactionBlock } from "@mysten/sui.js/transactions"

export default function StakeLiquidity({liquidity}:{liquidity:any}) {
  const [inputBalance, setInputBalance] = useState(0)
  const [data, setData] = useState<any>()
  const suiClient = useSuiClient();
  const { mutate: signTransactionBlock } = useSignTransactionBlock();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  // const { data: seeds, refetch } = useSuiClientQuery('getObject', {
	// 	id,
	// 	options: {
	// 		showContent: true,
	// 	},
	// });

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

  function executeMoveCall() {
    const today = new Date()
		const txb = new TransactionBlock();

    txb.moveCall({
      arguments: [
        txb.pure.string("LQG"),
        txb.pure.string("Liquidity Garden 1"),
        [
          txb.pure.string("url1"),
          txb.pure.string("url2")
        ],
        txb.pure.u64(today.getTime()/1000)
      ],
      target: `0x90a6148db82f9b8e39daca2bf1398173e9dfcbbb05ab0ee08dec43f7ba9b57d5::seed::mint`,
    });

		signAndExecute(
			{
				transactionBlock: txb,
        chain: 'sui:devnet',
			},
			{
				onSuccess: (tx) => {
					suiClient.waitForTransactionBlock({ digest: tx.digest }).then(() => {
						// refetch();
            console.log("done")
					});
				},
			},
		);
	}

  const handleMint = async () => {
    // eslint-disable-next-line
    // @ts-ignore
    executeMoveCall()
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