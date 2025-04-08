// scraper_canais.js

import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const config = {
  OUTPUT_DIR: "output/teams",
  SOURCES: {
    GE_GLobo: (team) => {
      const geNames = {
        atletico_mineiro: "atletico-mg",
        sao_paulo: "sao-paulo",
        vasco_da_gama: "vasco",
        sport_recife: "sport",
      };
      const geTeam = geNames[team] || team.replace(/_/g, "-");
      return `https://ge.globo.com/futebol/times/${geTeam}/agenda-de-jogos-do-${geTeam}/#/proximos-jogos`;
    },
    OndeAssistir: (team) => {
      const oaNames = {
        atletico_mineiro: "atletico-mineiro",
        sao_paulo: "sao-paulo",
        vasco_da_gama: "vasco",
        sport_recife: "sport",
        bragantino: "red-bull-bragantino",
      };
      const oaTeam = oaNames[team] || team.replace(/_/g, "-");
      return `https://ondeassistiraojogo.com.br/times/${oaTeam}/`;
    },
    Goal: "https://www.goal.com/br/listas/futebol-programacao-jogos-tv-aberta-fechada-onde-assistir-online-app/bltc0a7361374657315",
    Sportv: "https://canaisglobo.globo.com/programacao/sportv/3180419/",
    SportvGuide: "https://meuguia.tv/programacao/canal/SPO",
    ESPN: "https://meuguia.tv/programacao/canal/ESP",
    ESPN2: "https://meuguia.tv/programacao/canal/ES2",
    ESPN3: "https://meuguia.tv/programacao/canal/ES3",
    ESPN4: "https://meuguia.tv/programacao/canal/ES4",
    ESPN5: "https://meuguia.tv/programacao/canal/ES5",
    Premiere: "https://meuguia.tv/programacao/canal/121",
    Sportv2: "https://meuguia.tv/programacao/canal/SP2",
    Sportv3: "https://meuguia.tv/programacao/canal/SP3",
  },
  CHANNELS: [
    "band",
    "cazétv",
    "disney+",
    "disney_plus",
    "espn",
    "globo",
    "canal goat",
    "goat",
    "canal_goat",
    "nosso futebol",
    "nosso_futebol",
    "paramount+",
    "paramount_plus",
    "premiere",
    "prime video",
    "prime_video",
    "record",
    "sbt",
    "sportv",
    "tnt sports",
    "tnt_sports",
    "youtube",
  ],
  REQUEST_DELAY: 3000,
  TIMEOUT: 15000,
  DEBUG: true,
};

const getHeaders = () => ({
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  Referer: "https://www.google.com/",
  DNT: "1",
  Connection: "keep-alive",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "cross-site",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
});

async function fetchWithRetry(url, retries = 3) {
  try {
    const response = await axios.get(url, {
      timeout: config.TIMEOUT,
      headers: getHeaders(),
      validateStatus: (status) => status < 400 || status === 403,
    });

    const finalUrl = response.request?.res?.responseUrl || url;
    if (
      finalUrl.includes("404") ||
      response.data.includes("Página não encontrada")
    ) {
      throw new Error("Página não encontrada (404)");
    }

    return response.data;
  } catch (error) {
    if (retries > 0) {
      if (config.DEBUG) {
        console.log(`Tentativa ${4 - retries} falhou, tentando novamente...`);
        console.log("URL:", url);
        console.log("Erro:", error.message);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, config.REQUEST_DELAY * 2)
      );
      return fetchWithRetry(url, retries - 1);
    }
    if (config.DEBUG) console.log(`Falha final ao acessar: ${url}`);
    return null;
  }
}

function normalizeTeamName(teamName) {
  return teamName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeChannelName(channel) {
  const channelMap = {
    "disney+": "disney_plus",
    "prime video": "prime_video",
    "paramount+": "paramount_plus",
    "tnt sports": "tnt_sports",
    "canal goat": "canal_goat",
    "nosso futebol": "nosso_futebol",
  };
  return (
    channelMap[channel.toLowerCase()] ||
    channel.toLowerCase().replace(/\s+/g, "_")
  );
}

async function getChannelsFromGE(team, match) {
  try {
    const url = config.SOURCES.GE_GLobo(team);
    if (config.DEBUG) console.log(`Buscando no GE: ${url}`);

    const html = await fetchWithRetry(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const channels = [];

    $(".jogos__agenda-jogo").each((index, element) => {
      const homeTeam = $(element)
        .find(".jogos__time--mandante .jogos__time-nome")
        .text()
        .trim();
      const awayTeam = $(element)
        .find(".jogos__time--visitante .jogos__time-nome")
        .text()
        .trim();

      if (
        homeTeam &&
        awayTeam &&
        (homeTeam.includes(match.timeCasa) ||
          match.timeCasa.includes(homeTeam)) &&
        (awayTeam.includes(match.timeVisitante) ||
          match.timeVisitante.includes(awayTeam))
      ) {
        $(element)
          .find(".jogos__transmissao")
          .each((i, elem) => {
            const channelText = $(elem).text().trim().toLowerCase();
            config.CHANNELS.forEach((channel) => {
              if (channelText.includes(channel)) {
                channels.push(normalizeChannelName(channel));
              }
            });
          });
      }
    });

    return [...new Set(channels)];
  } catch (error) {
    if (config.DEBUG) console.error(`Erro no GE Globo: ${error.message}`);
    return [];
  }
}

async function getChannelsFromOndeAssistir(team, match) {
  try {
    const url = config.SOURCES.OndeAssistir(team);
    if (config.DEBUG) console.log(`Buscando em Onde Assistir: ${url}`);

    const html = await fetchWithRetry(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const channels = [];

    $(".jogo-agenda").each((index, element) => {
      const teamsText = $(element).find(".jogo-times").text().toLowerCase();
      if (
        teamsText.includes(match.timeCasa.toLowerCase()) &&
        teamsText.includes(match.timeVisitante.toLowerCase())
      ) {
        $(element)
          .find(".jogo-canais img")
          .each((i, elem) => {
            const altText = $(elem).attr("alt").toLowerCase();
            config.CHANNELS.forEach((channel) => {
              if (altText.includes(channel)) {
                channels.push(normalizeChannelName(channel));
              }
            });
          });
      }
    });

    return [...new Set(channels)];
  } catch (error) {
    if (config.DEBUG) console.error(`Erro em Onde Assistir: ${error.message}`);
    return [];
  }
}

async function getChannelsFromSportv(match) {
  try {
    const url = config.SOURCES.Sportv;
    const html = await fetchWithRetry(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const channels = [];

    $(".programacao-item").each((index, element) => {
      const programa = $(element).text().toLowerCase();
      if (
        programa.includes(match.timeCasa.toLowerCase()) ||
        programa.includes(match.timeVisitante.toLowerCase())
      ) {
        channels.push("sportv");
      }
    });

    return [...new Set(channels)];
  } catch (error) {
    if (config.DEBUG) console.error(`Erro no Sportv: ${error.message}`);
    return [];
  }
}

async function getChannelsFromMeuGuiaTV(match) {
  try {
    const channels = [];

    const espnHtml = await fetchWithRetry(config.SOURCES.ESPN);
    const espn$ = cheerio.load(espnHtml);
    espn$(".programacao-item").each((index, element) => {
      const programa = espn$(element).text().toLowerCase();
      if (
        programa.includes(match.timeCasa.toLowerCase()) ||
        programa.includes(match.timeVisitante.toLowerCase())
      ) {
        channels.push("espn");
      }
    });

    const sportvHtml = await fetchWithRetry(config.SOURCES.SportvGuide);
    const sportv$ = cheerio.load(sportvHtml);
    sportv$(".programacao-item").each((index, element) => {
      const programa = sportv$(element).text().toLowerCase();
      if (
        programa.includes(match.timeCasa.toLowerCase()) ||
        programa.includes(match.timeVisitante.toLowerCase())
      ) {
        channels.push("sportv");
      }
    });

    return [...new Set(channels)];
  } catch (error) {
    if (config.DEBUG) console.error(`Erro no Meu Guia TV: ${error.message}`);
    return [];
  }
}

async function getChannelsFromESPN(match) {
  try {
    const channels = [];
    const espnUrls = [
      config.SOURCES.ESPN,
      config.SOURCES.ESPN2,
      config.SOURCES.ESPN3,
      config.SOURCES.ESPN4,
      config.SOURCES.ESPN5,
    ];

    for (const url of espnUrls) {
      try {
        const html = await fetchWithRetry(url);
        if (!html) continue;

        const $ = cheerio.load(html);
        $(".programacao-item").each((index, element) => {
          const programa = $(element).text().toLowerCase();
          if (
            programa.includes(match.timeCasa.toLowerCase()) ||
            programa.includes(match.timeVisitante.toLowerCase())
          ) {
            channels.push("espn");
          }
        });
      } catch (error) {
        if (config.DEBUG)
          console.error(`Erro ao acessar ${url}: ${error.message}`);
      }
    }

    return [...new Set(channels)];
  } catch (error) {
    if (config.DEBUG) console.error(`Erro geral ESPN: ${error.message}`);
    return [];
  }
}

async function getChannelsFromPremiere(match) {
  try {
    const url = config.SOURCES.Premiere;
    const html = await fetchWithRetry(url);
    if (!html) return [];

    const $ = cheerio.load(html);
    const channels = [];

    $(".programacao-item").each((index, element) => {
      const programa = $(element).text().toLowerCase();
      if (
        programa.includes(match.timeCasa.toLowerCase()) ||
        programa.includes(match.timeVisitante.toLowerCase())
      ) {
        channels.push("premiere");
      }
    });

    return [...new Set(channels)];
  } catch (error) {
    if (config.DEBUG) console.error(`Erro no Premiere: ${error.message}`);
    return [];
  }
}

async function getChannelsFromSportv23(match) {
  try {
    const channels = [];
    const sportvUrls = [config.SOURCES.Sportv2, config.SOURCES.Sportv3];

    for (const url of sportvUrls) {
      try {
        const html = await fetchWithRetry(url);
        if (!html) continue;

        const $ = cheerio.load(html);
        $(".programacao-item").each((index, element) => {
          const programa = $(element).text().toLowerCase();
          if (
            programa.includes(match.timeCasa.toLowerCase()) ||
            programa.includes(match.timeVisitante.toLowerCase())
          ) {
            channels.push("sportv");
          }
        });
      } catch (error) {
        if (config.DEBUG)
          console.error(`Erro ao acessar ${url}: ${error.message}`);
      }
    }

    return [...new Set(channels)];
  } catch (error) {
    if (config.DEBUG) console.error(`Erro geral Sportv 2/3: ${error.message}`);
    return [];
  }
}

async function getChannelsForMatch(teamName, match) {
  const channels = [];

  const sources = [
    getChannelsFromGE(teamName, match),
    getChannelsFromOndeAssistir(teamName, match),
    getChannelsFromSportv(match),
    getChannelsFromMeuGuiaTV(match),
    getChannelsFromESPN(match),
    getChannelsFromPremiere(match),
    getChannelsFromSportv23(match),
  ];

  const results = await Promise.all(sources);

  for (const result of results) {
    channels.push(...result);
  }

  return [...new Set(channels)];
}

async function tryFallbackSources(match) {
  const channels = [];

  try {
    const searchQuery = `${match.timeCasa} x ${
      match.timeVisitante
    } transmissão ${new Date(match.startTimestamp * 1000).getFullYear()}`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;

    const html = await fetchWithRetry(googleUrl);
    const $ = cheerio.load(html);

    $("div.g").each((index, element) => {
      const text = $(element).text().toLowerCase();
      config.CHANNELS.forEach((channel) => {
        if (text.includes(channel)) {
          channels.push(normalizeChannelName(channel));
        }
      });
    });
  } catch (error) {
    if (config.DEBUG) console.error(`Erro no fallback: ${error.message}`);
  }

  return [...new Set(channels)];
}

async function updateTeamWithChannels(teamFile) {
  try {
    const filePath = path.join(config.OUTPUT_DIR, teamFile);
    const teamData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (config.DEBUG)
      console.log(`\nAtualizando canais para: ${teamData.time}`);

    for (const jogo of teamData.proximosJogos) {
      if (config.DEBUG)
        console.log(
          `Buscando canais para: ${jogo.timeCasa} x ${jogo.timeVisitante}`
        );

      jogo.canais = await getChannelsForMatch(teamData.time, jogo);

      if (config.DEBUG) {
        if (jogo.canais.length > 0) {
          console.log(`Canais encontrados: ${jogo.canais.join(", ")}`);
        } else {
          console.log("Nenhum canal encontrado para este jogo");
        }
      }

      await new Promise((resolve) => setTimeout(resolve, config.REQUEST_DELAY));
    }

    fs.writeFileSync(filePath, JSON.stringify(teamData, null, 2));
    if (config.DEBUG) console.log(`Arquivo atualizado: ${teamFile}`);

    return teamData;
  } catch (error) {
    console.error(`Erro ao atualizar ${teamFile}:`, error.message);
    return null;
  }
}

async function updateAllTeams() {
  try {
    console.time("Tempo total");
    console.log("Iniciando busca por canais de transmissão...");

    const teamFiles = fs
      .readdirSync(config.OUTPUT_DIR)
      .filter((file) => file.endsWith("_proximos_jogos.json"));

    for (const teamFile of teamFiles) {
      await updateTeamWithChannels(teamFile);
    }

    console.log("\n✅ Atualização de canais concluída com sucesso!");
    console.timeEnd("Tempo total");
  } catch (error) {
    console.error("Erro na execução principal:", error);
  }
}

(async () => {
  try {
    console.time("Tempo total");
    console.log("Iniciando busca por canais de transmissão...");

    const teamFiles = fs
      .readdirSync(config.OUTPUT_DIR)
      .filter((file) => file.endsWith("_proximos_jogos.json"));

    for (const teamFile of teamFiles) {
      await updateTeamWithChannels(teamFile);
      await new Promise((resolve) => setTimeout(resolve, config.REQUEST_DELAY));

      console.log("\n✅ Atualização de canais concluída com sucesso!");
      console.timeEnd("Tempo total");
    }
  } catch (error) {
    console.error("Erro na execução principal:", error);
  }
})();
