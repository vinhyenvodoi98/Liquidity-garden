import { useEffect, useState } from "react";

export default function PetInfo() {
  const pets = [
    {price: 10000000,image: "/images/pugmeme/pug1.webp"},
    {price: 100000000,image: "/images/pugmeme/pug2.webp"},
    {price: 1000000000,image: "/images/pugmeme/pug3.webp"},
    {price: 10000000000,image: "/images/pugmeme/pug4.webp"},
    {price: 100000000000,image: "/images/pugmeme/pug5.webp"},
    {price: 1000000000000,image: "/images/pugmeme/pug6.webp"},
    {price: 10000000000000,image: "/images/pugmeme/pug7.webp"},
    {price: 100000000000000,image: "/images/pugmeme/pug8.webp"},
  ]

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
          <h3 className="font-bold text-lg">Pet Information</h3>
          <p className="my-4">You can have Pug pets by owned $FUD token</p>
          <div className="flex flex-col gap-4">
            {pets.map((pet, index) => (
              <div key={index} className="grid grid-cols-8">
                <img src="/images/coins/fud.png" className="size-8"/>
                <div className="col-span-4 flex items-center">
                  <p className="font-bold">
                    {`${pet.price} $FUD =`}
                  </p>
                </div>
                <img src={pet.image} className="size-10"/>
                <button className="btn btn-primary w-24"> BUY $FUD</button>
              </div>
            ))}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}