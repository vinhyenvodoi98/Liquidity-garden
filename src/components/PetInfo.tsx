import { useState } from "react";
import FlowXSwap from "./FlowXSwap";
import { pugPrice } from "@/constant";

export default function PetInfo({pugBalance}:{pugBalance:number}) {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleOpenModal = () => {
    // eslint-disable-next-line
    // @ts-ignore
    document.getElementById('pet-info').showModal()
  }

  return(
    <div className="absolute bottom-40 left-6">
      <button className="btn h-16 m-2 bg-[#9C7251] hover:bg-[#E3B895] border-[#4F2B20] border-4" onClick={()=> handleOpenModal()}>
        <img src="/images/logo/petshop.png" className='size-14'/>
      </button>
      <dialog id="pet-info" className="modal">
        <div className="modal-box bg-[#E3B895] border-[#4F2B20] border-4">
          <h3 className="font-bold text-lg">Pet Informations</h3>
          <div >
            <div role="tablist" className="tabs tabs-bordered font-bold">
              <a onClick={() => setCurrentTab(0)} role="tab" className={`tab ${currentTab === 0 && 'tab-active'}`}>Fud the pug</a>
              <a onClick={() => setCurrentTab(1)} role="tab" className={`tab ${currentTab === 1 && 'tab-active'}`}>SuiFrens</a>
            </div>
            {
              currentTab === 0 ? <FudInfo pugBalance={pugBalance}/>: <SuiFrensInfo/>
            }
          </div>

        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

const FudInfo = ({pugBalance}:{pugBalance:number}) =>{
  return(
    <div>
      <div className="flex justify-between">
        <p className="my-2">You can have Pug pets by owned $FUD token</p>
        <p className="my-2 text-end">$FUD Balance: {pugBalance.toString()}</p>
      </div>
      <div className="flex flex-col gap-4">
        {pugPrice.map((pet, index) => (
          <div key={index} className="grid grid-cols-8">
            <img src="/images/coins/fud.png" className="size-8"/>
            <div className="col-span-4 flex items-center">
              <p className="font-bold">
                {`${pet.price} $FUD =`}
              </p>
            </div>
            <img src={pet.image} className="size-10"/>
            <FlowXSwap />
          </div>
        ))}
      </div>
    </div>
  )
}

const SuiFrensInfo = () =>{
  return(
    <div>
      <p className="my-4">You can have Capy pets by owned Capy NFT</p>
      <div className="flex flex-col gap-4">
        <img src="https://suifrens.com/icons/footer_logo.svg" className="h-24"/>
        <img src="https://suifrens.com/images/capy-about.svg" className="h-32"/>
        <a target="_blank"  href="https://suifrens.com/mint" className="w-full" rel="noopener noreferrer">
          <button className="btn w-full">Buy now</button>
        </a>
      </div>
    </div>
  )
}