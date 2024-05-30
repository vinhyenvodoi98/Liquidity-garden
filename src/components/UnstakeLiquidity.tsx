import { liquidity_package_id } from "@/constant";
import { useSignAndExecuteTransactionBlock, useSuiClient } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { toast } from "react-toastify";

export default function UnstakeLiquidity({plantUrl, plant}:any) {
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const handleOpenModal = () => {
    // eslint-disable-next-line
    // @ts-ignore
    document.getElementById('open-unstake').showModal()
  }

  const handleUnstake = async () => {
    executeMoveCall()
  }

  function executeMoveCall() {
    const today = new Date()
		const txb = new TransactionBlock();
    // const endTime = new Date(today.setDate(today.getDate() - Number(2)))

    txb.moveCall({
      arguments: [
        txb.object(plant.data.objectId),
      ],
      target: `${liquidity_package_id}::seed::burn`,
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
        onError: (e) => {
          console.log("error: ", e)
        }
			},
		);
	}

  return(
    <div className="">
    <button onClick={()=> handleOpenModal()}  className="bg-[#9C7251] border-[#4F2B20] border-4 rounded-lg h-72 w-44 p-2 mt-2 font-bold flex flex-col items-center">
      <p>Age: {plant.data.content.fields.age}</p>
      <div>
        <img src={plantUrl} className="h-60"/>
      </div>
    </button>
    <dialog id="open-unstake" className="modal">
      <div className="modal-box bg-[#E3B895] border-[#4F2B20] border-4 grid gap-4">
        <h3 className="font-bold text-lg">Unstake liquidity</h3>
        <label className="form-control w-full">
          {/*  */}
        </label>
        <button onClick={() => handleUnstake()} className="btn bg-[#4F2B20] text-white font-bold">Unstake</button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
  )
}