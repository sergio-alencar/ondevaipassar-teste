// TimePage.jsx

import React, { useEffect, useState } from "react";
import times from "../Components/times";
import { useParams } from "react-router-dom";
import escudo from "/src/assets/images/icones/escudo-cinza.svg";
import versus from "/src/assets/images/icones/versus.svg";
import canais from "../Components/canais";

const MAPEAMENTO_ARQUIVOS = {
  atletico_mineiro: "atletico_mineiro",
  "atletico-mineiro": "atletico_mineiro",
  atleticomg: "atletico_mineiro",
  "atlético-mg": "atletico_mineiro",
  atléticomg: "atletico_mineiro",
  atlético_mg: "atletico_mineiro",
  atletico_mg: "atletico_mineiro",
  "atletico mg": "atletico_mineiro",
  "atlético mg": "atletico_mineiro",
  sao_paulo: "sao_paulo",
  "sao-paulo": "sao_paulo",
  saopaulo: "sao_paulo",
};

const formatarNomeTime = (nomeCompleto) => {
  const casosEspeciais = {
    "Atlético Mineiro": "Atlético-MG",
    "Red Bull Bragantino": "Bragantino",
    "Vasco da Gama": "Vasco",
    "Estudiantes de La Plata": "Estudiantes",
    "Racing Club de Montevideo": "Racing-URU",
    "Academia Puerto Cabello": "Puerto Cabello",
    "Universidad Catolica del Ecuador": "Univ. Cat. Ecuador",
    Ceara: "Ceará",
    Gremio: "Grêmio",
    "Sao Paulo": "São Paulo",
    Vitoria: "Vitória",
    "Central Cordoba SdE": "Central Córdoba",
    "LDU Quito": "LDU",
    "Gualberto Villarroel": "GV San José",
    "San Jose de Oruro": "GV San José",
    "Atletico Nacional Medellin": "Atl. Nacional",
    "Nacional De Football": "Nacional",
    "Atletico Mineiro": "Atlético-MG",
    "Cerro Porteno": "Cerro Porteño",
    "CA Talleres de Córdoba": "Talleres",
    "Libertad Asuncion": "Libertad",
    "Universidad de Chile": "Univ. Chile",
    "Estudiantes LP": "Estudiantes",
    Huracan: "Huracán",
    "Central Cordoba": "Central Córdoba",
    "Union Espanola": "Unión Española",
    Bolivar: "Bolívar",
    "FBC Melgar": "Melgar",
  };

  if (casosEspeciais[nomeCompleto]) {
    return casosEspeciais[nomeCompleto];
  }

  const regras = [
    {
      regex: /^(?:Club|Clube)\s+Atlético\s+(.+)/i,
      substituicao: "$1",
    },
    { regex: /^Club (.*)/i, substituicao: "$1" },
    { regex: /^EC (.*)/i, substituicao: "$1" },
    { regex: /^Atlético (.*)/i, substituicao: "Atl. $1" },
    { regex: /^Atletico (.*)/i, substituicao: "Atl. $1" },
    { regex: /^America (.*)/i, substituicao: "América $1" },
    { regex: /^Union (.*)/i, substituicao: "Unión $1" },
    { regex: /(.*) F\.?C\.?$/i, substituicao: "$1" },
    {
      regex: /^Universidad\s+Católica\s+(.+)/i,
      substituicao: "Univ. Cat. $1",
    },
    {
      regex: /^(?:Deportes|Deportivo)\s+(.+)/i,
      substituicao: "Dep. $1",
    },
    {
      regex: /^Universidad\s+(.+)/i,
      substituicao: "Univ. $1",
    },
  ];

  let nomeSimplificado = nomeCompleto.trim();

  for (const regra of regras) {
    if (new RegExp(regra.regex).test(nomeSimplificado)) {
      nomeSimplificado = nomeSimplificado.replace(
        new RegExp(regra.regex),
        regra.substituicao
      );
      break;
    }
  }

  return nomeSimplificado;
};

const separarCanais = (str) => {
  return str
    .replace(/\s+e\s+/gi, ",")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
};

const MAPEAMENTO_CANAIS = {
  band: "band",
  bandeirantes: "band",
  "band sports": "band",
  cazetv_youtube: "cazetv",
  disney: "disneyplus",
  "disney+": "disneyplus",
  disney_plus: "disneyplus",
  "disney-plus": "disneyplus",
  "star+": "disneyplus",
  espn: "espn",
  "espn brasil": "espn",
  "espn+": "espn",
  globo: "globo",
  globoplay: "globoplay",
  goat: "goat",
  "nosso futebol": "nossofutebol",
  "nosso-futebol": "nossofutebol",
  nosso_futebol: "nossofutebol",
  paramount: "paramountplus",
  paramountplus: "paramountplus",
  "paramount-plus": "paramountplus",
  "paramount plus": "paramountplus",
  paramount_plus: "paramountplus",
  "paramount+": "paramountplus",
  premiere: "premiere",
  "premiere fc": "premiere",
  "premiere canal": "premiere",
  premiere_canal: "premiere",
  prime: "primevideo",
  "prime-video": "primevideo",
  prime_video: "primevideo",
  "prime video": "primevideo",
  "record-tv": "record",
  "record tv": "record",
  record_tv: "record",
  recordtv: "record",
  record: "record",
  sbt: "sbt",
  "sbt tv": "sbt",
  "sportv 2": "sportv",
  "sportv 3": "sportv",
  tnt: "tntsports",
  tnt_sports: "tntsports",
  "tnt-sports": "tntsports",
  "tnt sports": "tntsports",
  youtube: "youtube",
};

const obterImagemCanal = (nomeCanal) => {
  if (!nomeCanal) return null;

  const nomeLimpado = nomeCanal
    .replace(/\(.*?\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const nomeChave = nomeLimpado.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");

  const chaveFinal = MAPEAMENTO_CANAIS[nomeChave] || nomeChave;

  const baseUrl =
    "https://raw.githubusercontent.com/sergio-alencar/ondevaipassar-teste/main/public/images/canais/";

  return `${baseUrl}${chaveFinal}.svg`;
};

const formatarNomeCampeonato = (nomeCompleto) => {
  const padroes = [
    { regex: /brasileirão.*/i, substituicao: "Brasileirão" },
    { regex: /brazil serie a.*/i, substituicao: "Brasileirão" },
    { regex: /conmebol libertadores/i, substituicao: "Libertadores" },
    { regex: /copa libertadores/i, substituicao: "Libertadores" },
    { regex: /conmebol sudamericana/i, substituicao: "Sul-Americana" },
    { regex: /copa sudamericana/i, substituicao: "Sul-Americana" },
    { regex: /copa do brasil/i, substituicao: "Copa do Brasil" },
    { regex: /(.*?)(?:,| -| –| \()/i, substituicao: "$1" },
    {
      regex: /^(.*?)(?: serie | group| playoff| fase| temporada).*/i,
      substituicao: "$1",
    },
  ];

  let nomeSimplificado = nomeCompleto.trim();
  for (const padrao of padroes) {
    nomeSimplificado = nomeSimplificado.replace(
      padrao.regex,
      padrao.substituicao
    );
  }

  return nomeSimplificado;
};

const TimePage = () => {
  const { nome } = useParams();
  const time = times.find((t) => t.nome === nome);
  const [jogosExibidos, setJogosExibidos] = useState(3);
  const [proximosJogos, setProximosJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const normalizarNomeParaImagem = (nomeTime) => {
    const nomeFormatado = formatarNomeTime(nomeTime);

    return nomeFormatado
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[-\s]/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .replace(/_+/g, "_")
      .replace(/(^_|_$)/g, "");
  };

  const normalizarNomeTime = (nomeTime) => {
    return nomeTime
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/-/g, "_")
      .replace("atlético_mg", "atletico_mineiro")
      .replace("são_paulo", "sao_paulo")
      .replace("paramount+", "paramountplus")
      .replace("disney+", "disneyplus")
      .replace("premiere_canal", "premiere")
      .replace("premiere_", "premiere")
      .replace("tv_globo", "globo")
      .replace("tv globo", "globo");
  };

  const prepararNomeParaExibicao = (nomeTime) => {
    const nomeFormatado = formatarNomeTime(nomeTime);

    const ajustesManuais = {
      "Atl. Mineiro": "Atlético-MG",
      "Atl. Nacional": "Atl. Nacional",
      "Univ. Cat. Ecuador": "Univ. Católica-EQU",
      "Sport Recife": "Sport",
    };

    return ajustesManuais[nomeFormatado] || nomeFormatado;
  };

  useEffect(() => {
    const carregarJogos = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const normalizarNomeArquivo = (nomeTime) => {
          const nomePadronizado = nomeTime
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/(\s+|[-–])/g, "_")
            .replace(/[^a-z0-9_]/g, "")
            .replace(/_+/g, "_")
            .replace(/(^_|_$)/g, "");

          return MAPEAMENTO_ARQUIVOS[nomePadronizado] || nomePadronizado;
        };

        const nomeFormatado = normalizarNomeArquivo(nome);

        const basePath =
          process.env.NODE_ENV === "development"
            ? "/output/teams"
            : "https://sergio-alencar.github.io/ondevaipassar-teste/output/teams";

        const url = `${basePath}/${nomeFormatado}_proximos_jogos.json`;

        const response = await fetch(url);

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error("O servidor retornou uma página HTML em vez de JSON");
        }

        if (!response.ok) {
          throw new Error(
            `Erro HTTP: ${response.status} - ${response.statusText}`
          );
        }

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("Erro ao parsear JSON:", parseError);
          console.error("Conteúdo recebido:", text);
          throw new Error("Resposta inválida do servidor - não é JSON válido");
        }

        if (!data.proximosJogos || data.proximosJogos.length === 0) {
          throw new Error("Nenhum jogo encontrado no arquivo.");
        }

        const jogosOrdenados = data.proximosJogos.sort((a, b) => {
          return new Date(a.data) - new Date(b.data);
        });

        setProximosJogos(jogosOrdenados);
      } catch (error) {
        console.error("Erro detalhado:", error);
        setErro(`Erro ao carregar os jogos: ${error.message}`);
        setProximosJogos([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarJogos();
  }, [nome]);

  if (!time) {
    return (
      <h2 className="text-red-600 text-center text-2xl">
        Time não encontrado.
      </h2>
    );
  }

  if (carregando) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Erro ao carregar os jogos:</p>
        <p className="text-gray-600">{erro}</p>
        <p className="text-gray-500 mt-4">
          Verifique se os dados foram gerados corretamente pelo scraper.
        </p>
      </div>
    );
  }

  const obterImagemTime = (nomeTime) => {
    try {
      const chave = normalizarNomeParaImagem(nomeTime);
      const baseUrl =
        "https://raw.githubusercontent.com/sergio-alencar/ondevaipassar-teste/main/public/images/times/";
      const urlFinal = `${baseUrl}${chave}.svg`;

      console.log(`Tentando carregar imagem para: ${nomeTime} -> ${chave}`);

      return urlFinal;
    } catch (error) {
      console.error(`Erro ao processar nome do time ${nomeTime}:`, error);
      return escudo;
    }
  };

  const formatarTimestamp = (timestamp) => {
    if (!timestamp) return "Data não disponível";

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

    const diasDaSemana = [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sábado",
    ];

    const date = new Date(timestamp * 1000);

    const dia = date.getDate().toString().padStart(2, "0");
    const mes = mesesAbreviados[date.getMonth()];
    const diaSemana = diasDaSemana[date.getDay()];
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");

    return `${dia}/${mes}, ${diaSemana}, ${horas}:${minutos}`;
  };

  return (
    <div className="grid grid-cols-1 items-center">
      <p
        className={`text-4xl max-sm:text-2xl font-bold uppercase text-${time.cor} justify-self-center pt-8 max-sm:py-4`}
      >
        {time.maiusculo}
      </p>

      <ul className="divide-y divide-gray-300">
        {proximosJogos.length > 0 ? (
          proximosJogos.slice(0, jogosExibidos).map((jogo, index) => (
            <li key={`${jogo.id}-${index}`} className="py-6 max-sm:py-0">
              <div className="grid grid-cols-[1fr_400px_1fr] gap-2 py-8 px-4 max-lg:grid-cols-3 max-lg:py-2 max-lg:px-2 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-2 max-sm:py-4">
                <div className="flex items-center justify-self-end gap-4 max-lg:gap-2 max-lg:justify-self-center">
                  <img
                    crossOrigin="anonymous"
                    className="size-32 max-lg:size-20 max-sm:size-18"
                    src={obterImagemTime(jogo.timeCasa)}
                    alt={prepararNomeParaExibicao(jogo.timeCasa)}
                    title={prepararNomeParaExibicao(jogo.timeCasa)}
                    onError={(e) => {
                      console.error(`Erro ao carregar: ${e.target.src}`);
                      e.target.src = escudo;
                      e.target.onerror = null;
                    }}
                    loading="lazy"
                  />
                  <img
                    className="size-6 max-lg:size-4"
                    src={versus}
                    alt="versus"
                  />
                  <img
                    crossOrigin="anonymous"
                    className="size-32 max-lg:size-20 max-sm:size-18"
                    src={obterImagemTime(jogo.timeVisitante)}
                    alt={prepararNomeParaExibicao(jogo.timeVisitante)}
                    title={prepararNomeParaExibicao(jogo.timeVisitante)}
                    onError={(e) => {
                      console.error(`Erro ao carregar: ${e.target.src}`);
                      e.target.src = escudo;
                      e.target.onerror = null;
                    }}
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <ul className="justify-items-center space-y-2 *:text-xl *:text-center max-lg:*:text-base max-sm:*:text-lg max-sm:space-y-0.5">
                    <li className={`text-${time.cor} uppercase font-bold`}>
                      {prepararNomeParaExibicao(jogo.timeCasa)}{" "}
                      <span className="lowercase">x</span>{" "}
                      {prepararNomeParaExibicao(jogo.timeVisitante)}
                    </li>
                    <li className={`text-${time.cor} uppercase font-bold`}>
                      {formatarTimestamp(jogo.startTimestamp)}
                    </li>
                    <li className={`text-${time.cor} uppercase font-bold`}>
                      {formatarNomeCampeonato(jogo.campeonato)}
                    </li>
                  </ul>
                </div>

                <div className="overflow-x-auto whitespace-nowrap">
                  <div
                    className="flex justify-self-start items-center gap-6 max-lg:gap-2 max-lg:justify-self-center max-lg:justify-items-center overflow-y-hidden"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {jogo.canais && jogo.canais.length > 0 ? (
                      separarCanais(jogo.canais).map((canal, idx) => {
                        const imagemCanal = obterImagemCanal(canal);
                        const nomeNormalizado = normalizarNomeTime(canal);
                        const url = canais[nomeNormalizado]?.url;
                        const alt = canais[nomeNormalizado]?.nome;
                        const title = canais[nomeNormalizado]?.nome;
                        return (
                          imagemCanal && (
                            <a
                              key={`${canal}-${idx}`}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={imagemCanal}
                                alt={alt}
                                title={title}
                                className="w-32 mr-2 shrink-0 hover:scale-105 transition max-lg:mr-1 max-sm:w-28"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            </a>
                          )
                        );
                      })
                    ) : (
                      <p
                        className={`text-${time.cor} uppercase font-bold text-lg max-lg:text-base`}
                      >
                        Transmissão a confirmar
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhum jogo agendado para os próximos dias.
          </p>
        )}
      </ul>

      {proximosJogos.length > jogosExibidos && (
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
