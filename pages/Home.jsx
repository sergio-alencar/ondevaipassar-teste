import React from "react";
import { Link } from "react-router-dom";
import times from "../Components/times";

const Home = ({ setSelectedTime }) => {
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="py-4 ">
      <p className="text-4xl font-bold mb-8 pt-8 uppercase justify-self-center max-sm:text-2xl">
        Escolha seu time
      </p>
      <ul className="flex flex-wrap justify-items-center max-w-[1100px] mx-auto justify-center">
        {times.map((time) => (
          <li
            key={time.nome}
            className="p-4"
            onClick={() => handleTimeSelect(time)}
          >
            <Link to={`/ondevaipassar-teste/time/${time.nome}`} className="">
              <img
                src={`/ondevaipassar-teste/assets/images/times/${time.nome}.svg`}
                alt={`${time.nome}`}
                title={`${time.maiusculo}`}
                className="h-42 w-42 px-4 py-2 max-sm:h-18 max-sm:w-18 max-sm:px-2 max-sm:py-0"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
