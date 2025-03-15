// Footer.jsx

import React from "react";

const Footer = ({ selectedTime }) => {
  const footerColor = selectedTime ? selectedTime.cor : "purple-900";

  console.log("Footer Selected Time:", selectedTime);

  return (
    <footer className={`bg-${footerColor} px-12 max-sm:px-2`}>
      <div className="flex justify-between items-center py-6 mx-12 max-sm:mx-4 max-sm:py-2">
        {/* email e copy */}
        <p className="font-bold uppercase text-xs text-white">
          Onde Vai Passar &copy; 2025
        </p>

        <a href="/ondevaipassar-teste">
          <img
            className="size-16 max-sm:size-12"
            src="/img/icones/logo-2.svg"
            alt="Onde Vai Passar"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
