import { useEffect, useState } from "react";

const Equalizer = ({ isLoading }) => {
  const [bars, setBars] = useState(new Array(20).fill(50));

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setBars(bars.map(() => Math.random() * 80 + 20));
    }, 200);

    return () => clearInterval(interval);
  }, [bars, isLoading]);

  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 flex gap-1 items-end justify-center bg-gray-900 p-4 overflow-hidden">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-2 bg-green-500 rounded-md transition-all duration-200 ease-in-out shadow-lg shadow-green-500/30"
          style={{ height: `${height}%` }}
        ></div>
      ))}
    </div>
  );
};

export default Equalizer;
