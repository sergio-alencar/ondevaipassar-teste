import React from "react";
import { Link } from "react-router-dom";
import times from "../Components/times";
import escudo from "/src/assets/images/icones/escudo.svg";

// Importações das imagens dos times
import atleticomg from "/src/assets/images/times/atleticomg.svg";
import bahia from "/src/assets/images/times/bahia.svg";
import botafogo from "/src/assets/images/times/botafogo.svg";
import bragantino from "/src/assets/images/times/bragantino.svg";
import ceara from "/src/assets/images/times/ceara.svg";
import corinthians from "/src/assets/images/times/corinthians.svg";
import cruzeiro from "/src/assets/images/times/cruzeiro.svg";
import flamengo from "/src/assets/images/times/flamengo.svg";
import fluminense from "/src/assets/images/times/fluminense.svg";
import fortaleza from "/src/assets/images/times/fortaleza.svg";
import gremio from "/src/assets/images/times/gremio.svg";
import internacional from "/src/assets/images/times/internacional.svg";
import juventude from "/src/assets/images/times/juventude.svg";
import mirassol from "/src/assets/images/times/mirassol.svg";
import palmeiras from "/src/assets/images/times/palmeiras.svg";
import santos from "/src/assets/images/times/santos.svg";
import saopaulo from "/src/assets/images/times/saopaulo.svg";
import sport from "/src/assets/images/times/sport.svg";
import vasco from "/src/assets/images/times/vasco.svg";
import vitoria from "/src/assets/images/times/vitoria.svg";

// Mapeamento das imagens dos times (chaves normalizadas e sem hífens)
const imagensTimes = {
  atleticomg, // Chave sem hífen
  bahia,
  botafogo,
  bragantino,
  ceara,
  corinthians,
  cruzeiro,
  flamengo,
  fluminense,
  fortaleza,
  gremio,
  internacional,
  juventude,
  mirassol,
  palmeiras,
  santos,
  saopaulo, // Chave sem hífen
  sport,
  vasco,
  vitoria,
};

const Home = ({ setSelectedTime }) => {
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="py-4">
      <p className="text-4xl font-bold mb-8 pt-8 uppercase justify-self-center max-sm:text-2xl">
        Escolha seu time
      </p>
      <ul className="flex flex-wrap justify-items-center max-w-[1100px] mx-auto justify-center">
        {times.map((time) => {
          // Normalizar nome do time (remover acentos, espaços e hífens)
          const timeKey = time.nome
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/-/g, "");

          // Verificar se a imagem existe no mapeamento
          const imagemTime = imagensTimes[timeKey] || escudo;

          console.log(
            "Time:",
            time.nome,
            "Chave:",
            timeKey,
            "Imagem:",
            imagemTime
          );

          return (
            <li
              key={time.nome}
              className="p-4"
              onClick={() => handleTimeSelect(time)}
            >
              <Link to={`/ondevaipassar-teste/time/${time.nome}`} className="">
                <img
                  src={imagemTime}
                  alt={time.nome}
                  title={time.maiusculo}
                  className="h-42 w-42 px-4 py-2 max-sm:h-18 max-sm:w-18 max-sm:px-2 max-sm:py-0"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
