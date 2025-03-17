import React, { useEffect, useState } from "react";
import times from "../Components/times";
import { useParams } from "react-router-dom";
import canais from "../Components/canais";

const TimePage = ({ setSelectedTime }) => {
  const { nome } = useParams();
  const time = times.find((t) => t.nome === nome);
  const [jogosExibidos, setJogosExibidos] = useState(3);
  const [jogosDoTime, setJogosDoTime] = useState([]);

  useEffect(() => {
    if (time) {
      setSelectedTime(time);
    }
  }, [time, setSelectedTime]);

  useEffect(() => {
    const carregarJogos = async () => {
      try {
        const nomeArquivo = nome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, "-");

        console.log(`Carregando jogos para o time: ${nomeArquivo}`);
        const { jogosTime } = await import(
          `../Components/jogos/${nomeArquivo}.jsx`
        );
        console.log("Jogos carregados:", jogosTime);
        setJogosDoTime(jogosTime || []);
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

  const normalizarNome = (nome) => {
    return nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/-/g, "");
  };

  const formatarData = (data) => {
    try {
      if (data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [dia, mes] = data.split("/");
        const meses = [
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
        const mesAbreviado = meses[parseInt(mes) - 1];
        return `${dia}/${mesAbreviado}`;
      } else if (data.match(/^\d{2} \w{3} \d{4}$/)) {
        const [dia, mes] = data.split(" ");
        return `${dia}/${mes.toLowerCase()}`;
      }
      return data;
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return data;
    }
  };

  const carregarMaisJogos = () => {
    try {
      setJogosExibidos((prev) => prev + 3);
    } catch (error) {
      console.error("Erro ao carregar mais jogos:", error);
    }
  };

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
            const nomeTimeCasa = normalizarNome(jogo.timeCasa);
            const nomeTimeVisitante = normalizarNome(jogo.timeVisitante);

            console.log(
              `Caminho da imagem do time da casa: ../img/times/${nomeTimeCasa}.svg`
            );
            console.log(
              `Caminho da imagem do time visitante: ../img/times/${nomeTimeVisitante}.svg`
            );

            return (
              <li
                key={`${jogo.timeCasa}-${jogo.timeVisitante}-${index}`}
                className="py-6"
              >
                <div className="grid grid-cols-[1fr_400px_1fr] py-8 px-4 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-6 max-sm:py-4">
                  <div className="flex items-center justify-self-end gap-4">
                    <img
                      className="size-32 max-sm:size-18"
                      src={`/ondevaipassar-teste/assets/images/times/${nomeTimeCasa}.svg`}
                      alt={jogo.timeCasa}
                      title={jogo.timeCasa}
                      onError={(e) => {
                        e.target.src = "../img/icones/escudo.svg";
                      }}
                    />
                    <img
                      className="size-6"
                      src="/ondevaipassar-teste/assets/images/icones/versus.svg"
                      alt="versus"
                    />
                    <img
                      className="size-32 max-sm:size-18"
                      src={`/ondevaipassar-teste/assets/images/times/${nomeTimeVisitante}.svg`}
                      alt={jogo.timeVisitante}
                      title={jogo.timeVisitante}
                      onError={(e) => {
                        e.target.src =
                          "/ondevaipassar-teste/assets/images/icones/escudo.svg";
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <ul className="justify-items-center space-y-2 *:text-xl max-sm:*:text-lg">
                      <li className={`text-${time.cor} uppercase font-bold`}>
                        {jogo.timeCasa} x {jogo.timeVisitante}
                      </li>
                      <li className={`text-${time.cor} uppercase font-bold`}>
                        {formatarData(jogo.data)} | {jogo.horario}
                      </li>
                      <li className={`text-${time.cor} uppercase font-bold`}>
                        {jogo.campeonato}
                      </li>
                    </ul>
                  </div>

                  {jogo.transmissao.length ? (
                    <div className="flex justify-self-start items-center gap-8 *:*:size-24">
                      {jogo.transmissao.map((canal, i) => {
                        if (canais[canal]) {
                          return (
                            <a key={i} href={canais[canal].url} target="_blank">
                              <img
                                className="max-sm:size-18"
                                src={`/ondevaipassar-teste/assets/images/canais/${canal}.svg`}
                                alt={canal}
                                title={canais[canal].nome}
                              />
                            </a>
                          );
                        } else {
                          console.warn(
                            `Canal "${canal}" não encontrado no objeto canais.`
                          );
                          return null;
                        }
                      })}
                    </div>
                  ) : (
                    <p
                      className={`text-${time.cor} uppercase font-bold text-2xl self-center`}
                    >
                      a definir
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
          onClick={carregarMaisJogos}
        >
          Ver mais jogos
        </button>
      )}
    </div>
  );
};

export default TimePage;
