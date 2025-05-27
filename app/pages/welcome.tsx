import Footer from "~/components/Footer";
import { Fragment, useState } from "react";
import Header from "../components/Header";
import Configurator from "../components/Configurator";

export default function Welcome() {
  const prices = ["19,680.00", "24,675.00", "20,075.00"];
  const [currentPrice, setCurrentPrice] = useState<string>(prices[0]);

  return (
    <Fragment>
      <div className="flex flex-col md:px-4 lg:px-10 xl:px-40">
        {currentPrice && <Header currentPrice={currentPrice} />}
        <Configurator prices={prices} setCurrentPrice={setCurrentPrice} />
      </div>
      <Footer />
    </Fragment>
  );
}
