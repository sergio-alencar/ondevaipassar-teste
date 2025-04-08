import React from "react";

const Sobre = () => {
  return (
    <div className="flex flex-col container max-w-6xl justify-self-center mx-auto max-sm:px-4">
      <h1 className="text-4xl font-bold uppercase mb-6">Sobre</h1>
      <h2 className="font-bold text-3xl mb-4">Quem sou eu?</h2>
      <p className="text-xl mb-10">
        Meu nome é Sérgio. Sou estudante de Sistemas de Informação, engenheiro
        de software e torcedor do Cruzeiro. Se quiser conhecer mais sobre mim,
        acesse meu{" "}
        <a
          href="https://www.linkedin.com/in/sergio-alencar/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-purple-900 hover:text-purple-600"
        >
          LinkedIn
        </a>
        ,{" "}
        <a
          href="https://github.com/sergio-alencar"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-purple-900 hover:text-purple-600"
        >
          GitHub
        </a>{" "}
        ou me mande um{" "}
        <a
          href="mailto:sergiofalencar@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-purple-900 hover:text-purple-600"
        >
          email
        </a>
        .
      </p>
      <h2 className="font-bold text-3xl mb-4">O que é o Onde Vai Passar?</h2>
      <p className="text-xl">
        É uma tentativa de resolver um problema pelo qual muitos torcedores já
        passaram: tentar descobrir onde conseguir assistir ao jogo do seu time.
        As informações estão disponíveis na internet, mas de maneira pulverizada
        e pouco estruturada. O <i>Onde Vai Passar</i> busca esses dados por meio
        de webscraping e os disponibiliza em um só lugar.
      </p>
    </div>
  );
};

export default Sobre;
