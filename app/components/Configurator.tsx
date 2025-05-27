import { useState } from "react";
import ThreeDImageRotator from "./ThreeDImageRotator";
import { Check, ChevronRight, Plus } from "./icons";

export default function Configurator({
  prices,
  setCurrentPrice,
}: {
  prices: string[];
  setCurrentPrice: React.Dispatch<React.SetStateAction<string>>;
}) {
  const defaultColor = "black-matte";
  const colors = ["black-matte", "m-package", "style-sport"];
  const names = ["Black Storm Metallic", "M Package", "Style Sport"];
  const descriptions = [
    "The Blackstorm metallic paintwork underlines the powerful character of the bike. The dark look is rounded off by the rear wheel swingarm, wheels and brake calipers in Black. The restrained colors make the S 1000 RR inscription stand out even more clearly.",
    "The M package with Light white/M Motorsport paintwork, M brake calipers in blue and M footrests gives the bike a powerful look. With its particularly non-slip upper material, the M Sport seat gives the rider optimum grip in the chase for the all-important tenths of a second. The weight-optimized M Carbon wheels offer maximum riding dynamics. Alternatively available: M forged wheels.",
    "",
  ];
  const addPrices = ["0.00", "4,995.00", "395.00"];
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [display360, setDisplay360] = useState<boolean>(true);
  const [displayCockpit, setDisplayCockpit] = useState<boolean>(false);

  const setDisplay360Active = () => {
    setDisplayCockpit(false);
    setDisplay360(true);
  };

  const setDisplayCockpitActive = () => {
    setDisplay360(false);
    setDisplayCockpit(true);
  };

  const selectColor = (idx: number) => {
    setSelectedColor(colors[idx]);
    setCurrentPrice(prices[idx]);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center bg-linear-to-r from-gray-100 to-gray-200 select-none">
      <div className="w-full lg:w-[65%] h-[320px] md:h-[480px] lg:h-[60vh] xl:h-[70vh] relative">
        {selectedColor && (
          <ThreeDImageRotator
            colors={colors}
            basePath={`/${selectedColor}/`}
            frameCount={36}
            rotationSensitivity={6}
            display360={display360}
            displayCockpit={displayCockpit}
            setDisplay360Active={setDisplay360Active}
            setDisplayCockpitActive={setDisplayCockpitActive}
          />
        )}
      </div>

      <div className="w-full lg:w-[35%] h-[60vh] xl:h-[70vh] ml-auto float-right px-10 py-4 overflow-y-auto">
        <span className="flex text-left items-center mb-4 font-semibold">
          Selected Color{" "}
          <img
            className="w-8 h-5 ml-2"
            src={selectedColor + ".jpg"}
            alt={selectedColor}
          />
        </span>
        <p className="text-xs mb-4">
          BMW Motorrad NA reserves the right to alter prices and specification
          without notice. BMW Motorrad NA has made every effort to ensure the
          accuracy of information but does not accept liability for any errors
          or omissions. All equipment and packs are subject to model year
          changes.
        </p>
        <span className="font-semibold">Colors & Packages</span>
        <div className="flex flex-col">
          {colors.map((_, idx: number) => (
            <div
              key={idx}
              onClick={() => selectColor(idx)}
              className="h-26 w-full mt-3 flex cursor-pointer"
            >
              {selectedColor === colors[idx] ? (
                <span className="h-full w-[10%] px-1 bg-[#D9D9D9] flex items-center justify-center">
                  <Check className="text-xl text-white font-bold" />
                </span>
              ) : (
                <span className="h-full w-[10%] px-1 bg-[#16171a] hover:bg-blue-500 flex items-center justify-center">
                  <Plus className="text-xl text-white font-bold" />
                </span>
              )}
              <img
                className="w-[10%] lg:w-[30%] h-full ml-1"
                src={colors[idx] + ".jpg"}
                alt={selectedColor}
              />
              <div className="w-[80%] lg:w-[60%] flex h-full bg-white p-2">
                <div className="w-[70%]">
                  <p className="font-bold text-sm">{names[idx]}</p>
                  <p className="truncate text-xs">{descriptions[idx]}</p>
                  <p className="mt-6 font-bold text-sm">$ {addPrices[idx]}</p>
                </div>
                <div className="h-[80%] w-[20%] my-2 border-l-1 border-slate-300 ml-auto flex items-center justify-center">
                  <ChevronRight className="text-xl text-[#16171a]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="md:mt-[10%] border-t-1 border-slate-300 w-full">
          <button className="mt-4 font-black bg-[#16171a] text-white text-center w-full p-2 cursor-pointer border-none outline-none focus:outline-none">
            NEXT STEP
          </button>
        </div>
      </div>
    </div>
  );
}
