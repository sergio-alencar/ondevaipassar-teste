import React from "react";

const Footer = ({ selectedTime }) => {
  const footerColor = selectedTime ? selectedTime.cor : "purple-900";

  return (
    <footer className={`bg-${footerColor} px-12 max-sm:px-4`}>
      <div className="grid py-6 mx-12 max-sm:mx-4 max-sm:py-4">
        <p className="font-bold uppercase text-xs justify-self-center text-white">
          Onde Vai Passar &copy; 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
