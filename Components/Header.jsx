// Header.jsx

import React from "react";
import DropdownMenu from "../Components/DropdownMenu";

const Header = ({ selectedTime, setSelectedTime }) => {
  const headerColor = selectedTime ? selectedTime.cor : "purple-900";

  console.log("Header Selected Time:", selectedTime);

  return (
    <header className={`bg-${headerColor} sticky top-0 px-12 max-sm:px-2`}>
      <div className="flex justify-between items-center mx-12 max-sm:mx-4">
        <button className="flex gap-2 items-center">
          <span className="h-5 w-7 flex flex-col justify-between *:h-0.5 *:rounded-md *:bg-white">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <p className="text-white text-xl uppercase font-bold max-sm:hidden">
            menu
          </p>
        </button>
        <a className="" href="/ondevaipassar-teste">
          <img
            className="w-42 py-4 max-sm:w-32"
            src="../img/icones/logo-3.svg"
            alt="Onde Vai Passar"
          />
        </a>
        <div className="flex gap-4 py-6 hover:*:block">
          <p className="text-white text-xl uppercase font-bold select-none max-sm:hidden">
            times
          </p>
          <img
            className="size-7"
            src="../img/icones/escudo.svg"
            alt="Escolha o time"
            title="Escolha o time"
          />
          <DropdownMenu setSelectedTime={setSelectedTime} />
        </div>
      </div>
    </header>
  );
};

export default Header;
