// DropdownMenuTime.jsx

import React from "react";
import { Link } from "react-router-dom";

const DropdownMenuTime = ({ time, setSelectedTime }) => {
  const handleClick = () => {
    setSelectedTime(time);
  };

  return (
    <li>
      <Link to={`/ondevaipassar-teste/time/${time.nome}`} onClick={handleClick}>
        <img
          className="size-10"
          src={`/img/times/${time.nome}.svg`}
          alt={`${time.maiusculo}`}
          title={`${time.maiusculo}`}
        />
      </Link>
    </li>
  );
};

export default DropdownMenuTime;
