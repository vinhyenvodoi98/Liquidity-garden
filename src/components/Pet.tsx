import { useEffect, useState } from "react";

export default function Pet ({ image }:{image: string}) {
  const [position, setPosition] = useState({ left: 0 });
  const [speed, setSpeed] = useState("5s");

  useEffect(() => {
    const getRandomPosition = () => {
      if (typeof window !== 'undefined') {
        const randomLeft = Math.floor(Math.random() * window.innerWidth/(1.1));
        return { left: randomLeft };
      } else {
        return { left: 0 };
      }
    };

    const getRandomSpeed = () => {
      return `${Math.random() * 15 + 2}s`;
    };

    setPosition(getRandomPosition())
    setSpeed(getRandomSpeed())
  }, [])

  return (
    <div
      className={`absolute bottom-0 left-0`}
      style={{ left: position.left }}
    >
      <img src={image} className="size-32 animate-move-right"
      style={{
        // eslint-disable-next-line
        // @ts-ignore
        '--animation-duration': speed,
      }}/>
    </div>
  );
};