import { liquidity_package_id } from "@/constant";
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

    txb.moveCall({
      arguments: [
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