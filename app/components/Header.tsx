import { CircleAlert } from "./icons";

export default function Header({ currentPrice }: { currentPrice: string }) {
  return (
    <div className="flex flex-col md:flex-row py-8 px-10">
      <h1 className="text-xl md:text-4xl font-bold">2025 S1000RR</h1>
      <div className="flex md:ml-auto md:float-end">
        <div className="flex flex-col cursor-pointer mr-20">
          <div className="flex hover:text-blue-500">
            <h2 className="text-xl font-bold mr-1">$ {currentPrice}</h2>
            <CircleAlert className="hidden md:inline-block text-current w-5 h-5 mt-[4px] rotate-180" />
          </div>
          <div className="hidden md:flex flex-col text-xs">
            <p>MRSP</p>
            <p>*Estimated EasyRide™: $338.71</p>
          </div>
        </div>

        <a className="hidden md:inline-block focus:outline-none" href="/">
          <img src="/logo.svg" alt="BMW Logo" />
        </a>
      </div>
    </div>
  );
}
