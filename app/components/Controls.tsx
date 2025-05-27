import { useState } from "react";

export default function Controls({
  display360,
  displayCockpit,
  setDisplay360Active,
  setDisplayCockpitActive,
}: {
  display360: boolean;
  displayCockpit: boolean;
  setDisplay360Active: () => void;
  setDisplayCockpitActive: () => void;
}) {
  const [isHovering, setIsHovering] = useState(false); // New state for hover

  return (
    <div className="flex flex-col absolute top-1/2 left-0 z-50">
      {
        <button
          onClick={() => setDisplay360Active()}
          className={
            display360
              ? "text-xs font-semibold px-4 py-3 bg-[#16171a] text-white focus:outline-none"
              : "text-xs font-semibold px-4 py-3 bg-white hover:bg-blue-500 text-[#16171a] hover:text-white cursor-pointer focus:outline-none"
          }
        >
          360°
        </button>
      }

      {
        <button
          onClick={() => setDisplayCockpitActive()}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={
            displayCockpit
              ? "text-xs font-semibold px-4 py-3 bg-[#16171a] text-white focus:outline-none"
              : "text-xs font-semibold px-4 py-3 bg-white hover:bg-blue-500 text-[#16171a] hover:text-white cursor-pointer focus:outline-none"
          }
        >
          <img
            className="w-6 h-6"
            src={
              displayCockpit
                ? "cockpit-white.svg"
                : isHovering
                ? "cockpit-white.svg"
                : "cockpit.svg"
            }
            alt=""
          />
        </button>
      }
    </div>
  );
}
