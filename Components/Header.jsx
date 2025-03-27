// Header.jsx

import React, { useEffect, useState } from "react";
import DropdownMenu from "../Components/DropdownMenu";
import logoHeader from "/src/assets/images/icones/logo-3.svg";
import escudo from "/src/assets/images/icones/escudo.svg";

const Header = ({ selectedTime, setSelectedTime }) => {
  const headerColor = selectedTime ? selectedTime.cor : "purple-900";
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  console.log("Header Selected Time:", selectedTime);

  useEffect(() => {
    const menuBotao = document.getElementById("menu-botao");
    const menuLeft = document.getElementById("menu-left");

    const handleClickOutside = (event) => {
      if (
        menuLeft &&
        !menuLeft.contains(event.target) &&
        menuBotao &&
        !menuBotao.contains(event.target)
      ) {
        setIsMenuVisible(false);
      }
    };

    const handleMenuClick = () => {
      setIsMenuVisible((prev) => !prev);
    };

    if (menuBotao) {
      menuBotao.addEventListener("click", handleMenuClick);
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      if (menuBotao) {
        menuBotao.removeEventListener("click", handleMenuClick);
      }
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const overlay = document.getElementById("overlay");
    const menuLeft = document.getElementById("menu-left");

    if (overlay && menuLeft) {
      if (isMenuVisible) {
        overlay.classList.remove("hidden");
        overlay.classList.add("block");

        menuLeft.classList.remove(
          "opacity-0",
          "translate-x-[-20px]",
          "animate-slide-out"
        );
        menuLeft.classList.add(
          "opacity-100",
          "translate-x-0",
          "animate-slide-in"
        );
        menuLeft.style.pointerEvents = "auto";
      } else {
        overlay.classList.remove("block");
        overlay.classList.add("hidden");

        menuLeft.classList.remove(
          "opacity-100",
          "translate-x-0",
          "animate-slide-in"
        );
        menuLeft.classList.add(
          "opacity-0",
          "translate-x-[-20px]",
          "animate-slide-out"
        );

        setTimeout(() => {
          menuLeft.style.pointerEvents = "none";
        }, 400);
      }
    }
  }, [isMenuVisible]);

  return (
    <>
      <div
        id="overlay"
        className="fixed inset-0 bg-black opacity-70 hidden z-40"
      ></div>
      <header
        className={`bg-${headerColor} sticky top-0 px-12 max-sm:px-2 z-30`}
      >
        <div className="flex justify-between items-center mx-12 max-sm:mx-4">
          <button
            id="menu-botao"
            className="flex gap-2 items-center cursor-pointer"
          >
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
              src={logoHeader}
              alt="Onde Vai Passar"
            />
          </a>
          <div className="flex gap-4 py-6 hover:*:block">
            <p className="text-white text-xl uppercase font-bold select-none max-sm:hidden">
              times
            </p>
            <img
              className="size-7"
              src={escudo}
              alt="Escolha o time"
              title="Escolha o time"
            />
            <DropdownMenu setSelectedTime={setSelectedTime} />
          </div>
        </div>
      </header>
      <div
        id="menu-left"
        className={`bg-white w-64 h-full z-50 fixed top-0 left-0 shadow transition-all duration-400 ease-in-out ${
          isMenuVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-[-20px]"
        }`}
        style={{ pointerEvents: isMenuVisible ? "auto" : "none" }}
      >
        <ul className="px-8 py-12 *:uppercase *:font-bold *:text-2xl space-y-4">
          <li>
            <a href="">Sobre</a>
          </li>
          <li>
            <a href="">Contato</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
