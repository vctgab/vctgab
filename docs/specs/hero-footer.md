# Hero dinâmico e FooterScene

## Spec

### Propósito

- **Hero:** abertura com o conteúdo da home sobre uma composição de 5 a 9 formas que derivam devagar, com paralaxe ao rolar e resposta leve ao ponteiro no desktop. Prova do sistema em `/sistema/hero`; não é a home final.
- **FooterScene:** cena baixa de árvores no fim do rodapé, que muda com o tema. As árvores existem só aqui.

**Quando não usar:** a composição nunca fica atrás de texto sem a placa de apoio (CR-02); a cena nunca leva informação.

### Anatomia

Hero:

1. `HeroBackdrop` (`aria-hidden`): formas `blob` e `tornEdge` em camadas, cores `hero-shape-1` a `-5` do tema, cada uma com profundidade (0 a 1) para a paralaxe.
2. Placa de apoio `wobblyRect` `hero-plate` (contraste calculado com `ink` e `ink-muted`) sob o texto.
3. Eyebrows ("Desenvolvedor front-end", "React e Next.js") como `Tag`.
4. `h1` "Front-end com visão de produto." com traço à mão sob "visão de produto.".
5. Parágrafo de apoio.
6. Botão "Vamos conversar" (`Button asChild` para o contato).
7. Linha de status: ponto de agenda, "Agenda de [a confirmar: mês] aberta", "Teresina • Brasil" e `LiveClock`.
8. Anotação em Caveat "design que o código aguenta" (decorativa, a partir de 1024 px).
9. `Achavel` da pinha, escondido entre as formas.

FooterScene: um SVG `aria-hidden` com três planos de pinheiros (triângulos empilhados irregulares; o do fundo mais claro), copas `blob` e os extras da cena do tema. A cena de cada tema mora em `src/components/footer-scene/scenes.ts`.

| Tema    | Cena                                                         |
| ------- | ------------------------------------------------------------ |
| ipe     | pinheiros e um ipê florido (copa com flores `footer-accent`) |
| noturno | lua, estrelas e silhuetas                                    |
| outono  | árvores alaranjadas e folhas caindo                          |
| inverno | pinheiros com neve e flocos                                  |

### Variantes

| Componente   | Props                                                 |
| ------------ | ----------------------------------------------------- |
| Hero         | `seed` (por página), `title`, `lead`, `cta`, `status` |
| HeroBackdrop | `seed`, `count` (5 a 9)                               |
| FooterScene  | `seed`                                                |

### Estados

Hero: parado (movimento reduzido), animando (deriva + morph a até 30 fps), pausado fora da tela, aba oculta. O botão segue o padrão do Button. FooterScene: balanço leve, folhas e flocos em CSS; pausado fora da tela; estático com movimento reduzido. Desabilitado, erro, carregando e selecionado não se aplicam.

### Teclado

Hero: Tab passa pelo CTA e pelo Achavel. A composição não recebe foco. FooterScene não recebe foco.

### ARIA e nome acessível

Composição e cena `aria-hidden`. `h1` único da página. A linha de status é uma lista (`ul`). O Achavel tem nome "Algo entre as formas do hero".

### Irregularidade

Formas pelo motor com seed `hero:<página>:<i>`. A energia do tema multiplica a irregularidade das poses e a amplitude da deriva (ipê 1, noturno 0,8, outono 1,25, inverno 0,7). A paleta vem dos tokens `hero-shape-*` do tema. Pinheiros com vértices deslocados por PRNG (seed `rodape:<plano>`).

### Alto contraste e movimento

`forced-colors`: composição e cena somem (decorativas); a placa vira borda real. Movimento reduzido: sem deriva, morph, paralaxe, ponteiro, balanço, folhas ou flocos; a primeira pose fica parada (equivalente estático). Animação só com `transform`/`opacity` (e o `d` do morph em até 3 formas), pausada fora da tela e com a aba oculta.

### Ficha de Texto

1. Quem lê: fundadores e equipes que chegam ao portfólio.
2. Grade de Tom: boas-vindas, acolhedor com entusiasmo baixo; CTA objetivo e motivador.
3. Título: "Front-end com visão de produto."; subtítulo: "Desenvolvo interfaces em React e Next.js para fundadores e equipes que precisam de produto no ar, com design que o código aguenta."
4. Ações: "Vamos conversar".
5. Ajuda: não se aplica.
6. Termos: nenhum novo.
7. Estados: "Agenda de [a confirmar: mês] aberta".
8. Erros: não se aplica.
9. Sucesso: não se aplica.
10. Números: hora por `formatTimeWithSeconds` (fuso de Teresina).
11. Texto vindo do layout aprovado da home; sem dados de clientes.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Hero tem um `h1`, o CTA "Vamos conversar" e a linha de status com o relógio.
- [x] CA-2 Composição com 5 a 9 formas, `aria-hidden`, determinística pela seed.
- [ ] CA-3 Texto sobre a placa de apoio: axe sem violação de contraste nos 4 temas (e2e).
- [ ] CA-4 Movimento reduzido: nenhuma animação nem paralaxe (e2e com `reducedMotion: "reduce"`).
- [x] CA-5 FooterScene tem 3 planos de árvores e os extras só do tema ativo.
- [x] CA-6 Links do rodapé com contraste aprovado contra o fundo e os três planos (`tokens:build`).
- [x] CA-7 Pausa fora da tela (IntersectionObserver marca `data-pausado`).
- [x] CA-8 Sem curvas de nível, mapa ou relevo (varredura de nomes e revisão das capturas).

## Plan

`src/components/hero/*` (Hero, HeroBackdrop) e `src/components/footer-scene/*` (FooterScene, scenes.ts, geometria das árvores). Hero em `/sistema/hero`; FooterScene no Footer do layout. Risco: custo de pintura do morph em formas grandes; limitado a 3 formas e 24 fps.

### Fase 2

- O hero vai para a Home e lê os textos de `src/content/home.ts`; o mês da agenda vem de `site.ts` por `Fact`. CTA por `talkHref` (WhatsApp ou `#contato`). "Front-end" sem quebra no hífen (D-1014).

## Tarefas

- [x] Ficha
- [x] FooterScene e cenas
- [x] Hero e composição
- [x] Testes
- [ ] Vitrine e capturas
