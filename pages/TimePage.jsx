// TimePage.jsx

import React, { useEffect, useState } from "react";
import times from "../Components/times";
import { useParams } from "react-router-dom";
import canais from "../Components/canais";
import escudo from "/src/assets/images/icones/escudo.svg";
import versus from "/src/assets/images/icones/versus.svg";

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

import band from "/src/assets/images/canais/band.svg";
import cazetv from "/src/assets/images/canais/cazetv.svg";
import disneyplus from "/src/assets/images/canais/disneyplus.svg";
import espn from "/src/assets/images/canais/espn.svg";
import globo from "/src/assets/images/canais/globo.svg";
import goat from "/src/assets/images/canais/goat.svg";
import nossofutebol from "/src/assets/images/canais/nossofutebol.svg";
import paramountplus from "/src/assets/images/canais/paramountplus.svg";
import premiere from "/src/assets/images/canais/premiere.svg";
import primevideo from "/src/assets/images/canais/primevideo.svg";
import record from "/src/assets/images/canais/record.svg";
import sbt from "/src/assets/images/canais/sbt.svg";
import sportv from "/src/assets/images/canais/sportv.svg";
import tntsports from "/src/assets/images/canais/tntsports.svg";
import youtube from "/src/assets/images/canais/youtube.svg";

const imagensTimes = {
  atleticomg,
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
  saopaulo,
  sport,
  vasco,
  vitoria,
};

const imagensCanais = {
  band,
  cazetv,
  disneyplus,
  espn,
  globo,
  goat,
  nossofutebol,
  paramountplus,
  premiere,
  primevideo,
  record,
  sbt,
  sportv,
  tntsports,
  youtube,
};

const TimePage = () => {
  const { nome } = useParams();
  const time = times.find((t) => t.nome === nome);
  const [jogosExibidos, setJogosExibidos] = useState(3);
  const [jogosDoTime, setJogosDoTime] = useState([]);

  useEffect(() => {
    const carregarJogos = async () => {
      try {
        const nomeFormatado = nome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, "-");
        console.log("Nome formatado:", nomeFormatado);

        const response = await fetch(
          `https://sergio-alencar.github.io/ondevaipassar-api/${nomeFormatado}.json`
        );
        const data = await response.json();
        console.log("Dados da API:", data);

        const jogosDoTime = data[nomeFormatado] || [];
        setJogosDoTime(jogosDoTime);
      } catch (error) {
        console.error("Erro ao carregar os jogos:", error);
        setJogosDoTime([]);
      }
    };

    carregarJogos();
  }, [nome]);

  if (!time) {
    return <h2 className="text-red-600">Time não encontrado.</h2>;
  }

  const formatarData = (data) => {
    let dia, mes, ano;

    if (data.includes("/")) {
      [dia, mes, ano] = data.split("/");
    } else if (data.includes(" ")) {
      const partes = data.split(" ");
      dia = partes[0];
      mes = partes[1];
      ano = partes[2];

      const meses = {
        jan: "01",
        fev: "02",
        mar: "03",
        abr: "04",
        mai: "05",
        jun: "06",
        jul: "07",
        ago: "08",
        set: "09",
        out: "10",
        nov: "11",
        dez: "12",
      };
      mes = meses[mes.toLowerCase()] || "01";
    } else {
      return data;
    }

    const dataObj = new Date(ano, mes - 1, dia);

    const mesesAbreviados = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];

    const diasDaSemanaAbreviados = [
      "dom",
      "seg",
      "ter",
      "qua",
      "qui",
      "sex",
      "sáb",
    ];

    const mesAbreviado = mesesAbreviados[dataObj.getMonth()];
    const diaDaSemana = diasDaSemanaAbreviados[dataObj.getDay()];

    return `${dia}/${mesAbreviado}, ${diaDaSemana}`;
  };

  console.log("Jogos do time:", jogosDoTime);

  return (
    <div className="grid grid-cols-1 items-center">
      <p
        className={`text-4xl max-sm:text-2xl font-bold uppercase text-${time.cor} justify-self-center pt-8`}
      >
        {time.maiusculo}
      </p>
      <ul className="divide-y divide-gray-300">
        {jogosDoTime.length > 0 ? (
          jogosDoTime.slice(0, jogosExibidos).map((jogo, index) => {
            const timeCasaKey = jogo.timeCasa
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/-/g, "");
            const timeVisitanteKey = jogo.timeVisitante
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/-/g, "");

            const imagemTimeCasa = imagensTimes[timeCasaKey] || escudo;
            const imagemTimeVisitante =
              imagensTimes[timeVisitanteKey] || escudo;

            console.log(
              "Time Casa:",
              jogo.timeCasa,
              "Chave:",
              timeCasaKey,
              "Imagem:",
              imagemTimeCasa
            );
            console.log(
              "Time Visitante:",
              jogo.timeVisitante,
              "Chave:",
              timeVisitanteKey,
              "Imagem:",
              imagemTimeVisitante
            );

            return (
              <li key={index} className="py-6">
                <div className="grid grid-cols-[1fr_400px_1fr] py-8 px-4 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-6 max-sm:py-4">
                  <div className="flex items-center justify-self-end gap-4">
                    <img
                      className="size-32 max-sm:size-18"
                      src={imagemTimeCasa}
                      alt={jogo.timeCasa}
                    />
                    <img className="size-6" src={versus} alt="versus" />
                    <img
                      className="size-32 max-sm:size-18"
                      src={imagemTimeVisitante}
                      alt={jogo.timeVisitante}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <ul className="justify-items-center space-y-2 *:text-xl max-sm:*:text-lg">
                      <li className={`text-${time.cor} uppercase font-bold`}>
                        {jogo.timeCasa} x {jogo.timeVisitante}
                      </li>
                      <li className={`text-${time.cor} uppercase font-bold`}>
                        {formatarData(jogo.data)}, {jogo.horario}
                      </li>
                      <li className={`text-${time.cor} uppercase font-bold`}>
                        {jogo.campeonato}
                      </li>
                    </ul>
                  </div>
                  {jogo.transmissao.length ? (
                    <div className="flex justify-self-start items-center gap-8 *:*:size-24">
                      {jogo.transmissao.map((canal, i) => {
                        const canalKey = canal
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .toLowerCase()
                          .replace(/\s+/g, "")
                          .replace(/-/g, "");

                        const imagemCanal = imagensCanais[canalKey] || escudo;

                        return (
                          <a
                            className="relative z-20"
                            key={i}
                            href={canais[canal]?.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              className="max-sm:size-18"
                              src={imagemCanal}
                              alt={canal}
                            />
                            {canais[canal].nome == "Globo" && (
                              <span className="!w-8 !h-8 bg-yellow-400 rounded-full absolute inset-0 justify-self-end self-start text-center font-bold flex items-center justify-center text-sm z-10">
                                MG
                              </span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <p
                      className={`text-${time.cor} uppercase font-bold text-2xl self-center`}
                    >
                      A definir
                    </p>
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhum jogo disponível para esse time.
          </p>
        )}
      </ul>
      {jogosDoTime.length > jogosExibidos && (
        <button
          className="bg-black w-auto justify-self-center text-white uppercase rounded-full font-bold px-4 py-2 mb-12 cursor-pointer"
          onClick={() => setJogosExibidos((prev) => prev + 3)}
        >
          Ver mais jogos
        </button>
      )}
    </div>
  );
};

export default TimePage;
