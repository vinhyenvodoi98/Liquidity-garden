import { liquidity_package_id, oxygen_treasurycap_id } from "@/constant";
import { useSignAndExecuteTransactionBlock, useSuiClient } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useMemo } from "react";
import { toast } from "react-toastify";
import UnstakeLiquidity from "./UnstakeLiquidity";

export default function Plant({plant}:any) {
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const suiClient = useSuiClient();

  function executeMoveCall() {
    const today = new Date()
		const txb = new TransactionBlock();

    // let tokenType = '0x2::token::TokenPolicy<0x785b1d84d8ae9275f5134b1065671da4656c85ae0d7b0555f665e589b49abfe8::oxygen::OXYGEN>';

    // let treasuryCapArg = txb.object('0x368d5ac54627f14fa6d421738e1386454d251b19ff02f8900b6d0dc29d599afb');

    // let token = txb.moveCall({
    //   target: '0x2::token::mint',
    //   arguments: [treasuryCapArg, txb.pure.u64(10)],
    //   typeArguments: [tokenType],
    // });

    txb.moveCall({
      arguments: [
        txb.object(oxygen_treasurycap_id),
        txb.object(plant.data.objectId),
        txb.pure((today.getTime() - (today.getTime()%1000))/1000)
      ],
      target: `${liquidity_package_id}::seed::checkin`,
    });

		signAndExecute(
			{
				transactionBlock: txb,
        chain: 'sui:devnet',
			},
			{
				onSuccess: (tx) => {
					suiClient.waitForTransactionBlock({ digest: tx.digest }).then(() => {
						toast.success(
              `Transaction has been created successfully:
              https://suiscan.xyz/devnet/tx/${tx.digest}`
            );
					});
				},
        onError: (error) => {
          console.log(error)
        }
			},
		);
	}

  const handleWatering = async () => {
    executeMoveCall()
  }

  const PlantURL = useMemo(() => {
    if(Number(plant.data.content.fields.age) < 10){
      return plant.data.content.fields.url[0]
    } else if(Number(plant.data.content.fields.age) >= 10 && Number(plant.data.content.fields.age) < 20) {
      return plant.data.content.fields.url[1]
    } else if(Number(plant.data.content.fields.age) >= 20 && Number(plant.data.content.fields.age) < 30) {
      return plant.data.content.fields.url[2]
    } else {
      return plant.data.content.fields.url[3]
    }
  }, [plant])

  const canWatering = useMemo(() => {
    const today = new Date()
    const epoch = (today.getTime() - (today.getTime()%1000))/1000
    if(epoch > Number(plant.data.content.fields.last_checkin) + 86400) {
      return true
    } else {
      return false
    }
  }, [plant])

  return(
    <div>
      <div className="flex justify-center cursor-pointer">
        {
          canWatering ?
            <button onClick={() => handleWatering()} className="btn h-16 bg-[#9C7251] hover:bg-[#E3B895] border-[#4F2B20] border-4">
              <img src="/images/logo/waterer.png" className="size-16 p-2 rounded-lg"/>
            </button> :
          <div className="h-16"/>
        }
      </div>
      <UnstakeLiquidity plantUrl={PlantURL} plant={plant}/>
    </div>
  )
}