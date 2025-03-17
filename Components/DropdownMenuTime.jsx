// DropdownMenuTime.jsx

import React from "react";
import { Link } from "react-router-dom";

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

const DropdownMenuTime = ({ time, setSelectedTime }) => {
  const handleClick = () => {
    setSelectedTime(time);
  };

  // Normalizar o nome do time (remover acentos, espaços e hífens)
  const timeKey = time.nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");

  // Verificar se a imagem existe no mapeamento
  const imagemTime = imagensTimes[timeKey];

  return (
    <li>
      <Link to={`/ondevaipassar-teste/time/${time.nome}`} onClick={handleClick}>
        <img
          className="size-10"
          src={imagemTime}
          alt={`${time.maiusculo}`}
          title={`${time.maiusculo}`}
        />
      </Link>
    </li>
  );
};

export default DropdownMenuTime;
