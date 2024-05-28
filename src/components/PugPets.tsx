import { pugPrice } from "@/constant"
import Pet from "./Pet"
import { useMemo } from "react"

export default function PugPets({pugBalance}:{pugBalance: number}) {
  const pugs = useMemo(() => pugPrice.filter(pug => pug.price <= pugBalance) , [pugBalance])

  return (
    <div>
      {
        pugs.map(pet => (
          <Pet key={pet.image} image={pet.image}/>
        ))
      }
    </div>
  )
}