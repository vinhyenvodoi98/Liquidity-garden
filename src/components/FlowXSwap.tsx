import { useEffect, useState } from "react"
import { Amount, calculateAmountOut, swapExactInput, txBuild, estimateGasFee, getSmartRouting, ISmartPathV3 } from "@flowx-pkg/ts-sdk"
import { FudType, SuiType } from "@/constant"
import { useCurrentAccount, useSignAndExecuteTransactionBlock, useSignTransactionBlock, useSuiClient } from "@mysten/dapp-kit"
import { TransactionBlock } from "@mysten/sui.js/transactions"
import { toast } from "react-toastify"

interface ISmartRouting {
	paths: ISmartPathV3[],
	amountOut:string
}

export default function FlowXSwap() {
  const [inputBalance, setInputBalance] = useState(0)
  const [outputBalance, setOutputBalance] = useState<Amount>()
  const [path, setPath] = useState<any>()
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const account = useCurrentAccount();
  const handleOpenModal = () => {
    // eslint-disable-next-line
    // @ts-ignore
    document.getElementById('open-swap').showModal()
  }

  const handleInput = (number: number) => {
    setInputBalance(number)
    setOutputBalance(undefined)
  }

  const coinIn = {
    type: SuiType,
    symbol: "SUI",
    decimals: 9,
  };

  const coinOut = {
    type: FudType,
    symbol: "FUD",
    decimals: 5,
  };

  useEffect(() => {
    const calculate = async () =>{
      // const data = await calculateAmountOut(inputBalance, coinIn, coinOut);
      // setData(data)

      const smartRouting:ISmartRouting  = await getSmartRouting({
        coinInType: coinIn.type,
        coinOutType: coinOut.type,
        amountIn: (inputBalance*10**(coinIn.decimals)).toString(),
        signal: null,
        insludeSource: false,
        // source,
        // partnerFee
      })
      setOutputBalance({
        amount: (Number(smartRouting.amountOut)/10**(coinOut.decimals)).toString(),
        decimalAmount: smartRouting.amountOut
      })

      setPath(smartRouting.paths)
      console.log(smartRouting)
    }
    if(inputBalance > 0 && account) calculate()
  }, [inputBalance, account])

  const handleSwap = async () => {
    // eslint-disable-next-line
    // @ts-ignore
    const tx: TransactionBlock = await txBuild({
      listSmartPath:path,
      slippage: 0.01,
      tokenIn: {
        type: coinIn.type,
        amount: (inputBalance*10**(coinIn.decimals)).toString()
      },
      tokenOut: {
        type: coinOut.type,
        amount: outputBalance?.decimalAmount as string
      },
      account: account?.address as string
    })

    // swap v2
    // const tx:TransactionBlock = await txBuild({
    //   listSmartPath:path,
    //   slippage: 0.005,
    //   tokenIn: {
    //     type: coinIn.type,
    //     amount: (inputBalance*10**(coinIn.decimals)).toString()
    //   },
    //   tokenOut: {
    //     type: coinOut.type,
    //     amount: result?.amountOut as string
    //   },
    //   account: account?.address as string
    // })

    // const tx: TransactionBlock = await swapExactInput(
    //   false, //it should be false for now
    //   data.amountIn, //amount want to swap
    //   data.amountOut, //amount want to receive
    //   data.trades, //trades from calculate amount
    //   coinIn, //coin In data
    //   coinOut, //coin Out data
    //   account?.address as string,
    //   0.005 //slippage (0.05%)
    // );

    signAndExecute(
      {
        transactionBlock: tx,
        chain: 'sui:mainnet',
      },
      {
        onSuccess: (tx) => {
          console.log('signed transaction block', tx);
          suiClient.waitForTransactionBlock({ digest: tx.digest }).then(() => {
            toast.success(
              `Transaction has been created successfully:
              https://suiscan.xyz/devnet/tx/${tx.digest}`
            );
					});

        },
        onError: (e)=>{
          console.log(e)
        }
      },
    );
  }

  return (
    <div className="">
    <button onClick={()=> handleOpenModal()} className="btn bg-[#4F2B20] w-24 text-white font-bold"> BUY $FUD</button>
    <dialog id="open-swap" className="modal">
      <div className="modal-box bg-[#E3B895] border-[#4F2B20] border-4 grid gap-4">
        <h3 className="font-bold text-lg">Get some $FUD slippage (0.05%)</h3>
        <label className="form-control w-full">
          <div className="w-full border-2 border-[#4F2B20] rounded-lg p-2 grid gap-4">
            <div className="flex gap-2 items-center">
              <img src="/images/coins/sui.webp" className="size-8 rounded-full"/>
              <p className="font-bold">SUI</p>
            </div>
            <input onChange={(e) => handleInput(Number(e.target.value))} type="number" placeholder="Type here" className="bg-[#F9CBA7] input input-bordered w-full" />
          </div>
        </label>

        <div className="flex justify-center">
          <img src="/images/logo/downarrow.png" className="size-12"/>
        </div>

        <label className="form-control w-full">
          <div className="w-full border-2 border-[#4F2B20] rounded-lg p-2 grid gap-4">
            <div className="flex gap-2 items-center">
              <img src="/images/coins/fud.png" className="size-8 rounded-full"/>
              <p className="font-bold">FUD</p>
            </div>
            <div className="bg-[#F9CBA7] input input-bordered w-full flex items-center">
              {outputBalance?
                outputBalance.amount
              :
                <div className="w-24 h-4 skeleton"/>
              }
            </div>
          </div>
        </label>

      <button onClick={() => handleSwap()} className="btn bg-[#4F2B20] text-white font-bold">Swap</button>

      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
  )
}