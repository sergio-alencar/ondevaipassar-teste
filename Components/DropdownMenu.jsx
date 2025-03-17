// DropdownMenu.jsx

import React from "react";
import DropdownMenuTime from "./DropdownMenuTime";
import times from "./times";

const DropdownMenu = ({ setSelectedTime }) => {
  return (
    <div className="last:hidden h-104 w-96 absolute inset-x top-19 right-12">
      <div className="size-8 bg-[url('assets/images/icones/triangulo.svg')] bg-contain bg-center bg-no-repeat z-50 absolute -top-4 right-12"></div>
      <div className="bg-white shadow p-4 rounded-lg">
        <ul className="grid grid-cols-4 gap-6">
          {times.map((time) => (
            <DropdownMenuTime
              key={time.nome}
              time={time}
              setSelectedTime={setSelectedTime}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
