# Relatório da Home v2: copy novo

Data: 17/11/2026. Fichas: `docs/specs/pages/home.md`, `docs/specs/pages/contact.md`, `docs/specs/image-frame.md` e os acréscimos "Home v2" nas fichas de `Tag`, `Stat`, `Polaroid`, `Quote`, achados, cabeçalho, rodapé e hero. Decisões: D-1201 a D-1219 em `docs/DECISIONS.md`.

Commits (todos sem assinatura de ferramenta): `c26ca7d` (ficha e decisões), `8cec6e7` (componentes do design system), `efb4f45` (conteúdo e Home), `42a6dc3` (página `/contato`), `ca1ed7a` (testes e2e e duas correções achadas na QA) e o commit deste relatório (QA, pré-busca dos CTAs e capturas).

## Pré-requisito: quatro estações

A mudança para quatro estações, cada uma clara e escura, já estava pronta antes desta fase (commit `2224e73`, relatório `docs/REPORT-seasons.md`): 8 combinações, `tokens:build` com 648 pares aprovados. Não havia nada a terminar antes de começar.

## O que mudou

### Home

Ordem nova, como pedido: cabeçalho, hero, projetos em destaque, o que eu faço, depoimento e números, sobre, contato, rodapé. O copy é literal e mora em `src/content/home.ts`; um teste de unidade compara o conteúdo com as frases do pedido (CA-13).

- **Cabeçalho.** Links "projetos · sobre · contato" em minúscula; contador "achados: N de 7" (abre o caderno, número ao vivo); botão "estação: primavera" com o nome da estação ativa, que abre o seletor de estação e modo. Sem CTA. O nome da estação vem do CSS sobre `html[data-season]`, gerado a partir da lista de estações: já está certo no HTML pintado, sem estado no servidor e sem salto (D-1203). No mobile, os links vão para o Drawer e o botão de estação mostra só o ícone (o nome fica para leitores de tela).
- **Hero.** Selo "aberto a vagas e projetos" (`Tag` com ponto de status e texto), linha "Teresina, PI · HH:mm · provavelmente uns 30 °C" com o `LiveClock` em 24 h após a montagem, título com o sublinhado de pincel sob "no ar", texto de apoio e os CTAs "tenho uma vaga" (primário) e "tenho um projeto" (secundário). Visual: o fundo de formas da estação continua e, a partir de `lg`, entra o esboço "do rascunho ao ar", uma ficha com o wireframe da tela à mão atrás e a mesma tela numa moldura de navegador na frente, nas cores da estação (D-1205). A pinha continua escondida ali.
- **Projetos em destaque.** "o que eu ando construindo", quatro fichas em grade 2×2 (uma coluna no mobile), com captura pendente na moldura hachurada, meta, status ("em andamento", "no ar") como `Tag` com ponto, título, descrição e link para `/projetos/<slug>`. "ver todos os projetos" leva a `/projetos`.
- **O que eu faço.** "do layout ao deploy", quatro itens de 01 a 04 com os chips do pedido.
- **Depoimento e números.** O depoimento é o estado indisponível do `Quote`, com a pendência e sem citação inventada (D-1208). Quatro `Stat` com rótulo e "Método" ou "Fonte" (D-1207); o método do "8s" e a validação do "400+" estão pendentes. A seção tem `h2` só para leitores de tela (D-1211).
- **Sobre.** "prazer, Victor", os dois parágrafos, a polaroid com a foto pendente, "mais sobre mim" e a **pena de escrever** escondida ao lado da foto.
- **Contato.** "bora conversar?", os mesmos CTAs do hero, e-mail (`mailto:`) e LinkedIn pendente, com a coruja do correio.
- **Rodapé.** "Desenhado e codado por mim, em Teresina.", "Achados: N de 7. Tem coisa escondida por aqui." (N ao vivo), links projetos, sobre, contato, GitHub (nova aba), LinkedIn e baixar CV (pendentes, como texto com a marca) e "© 2026 Victor Barros" seguido da pendência do sobrenome (D-1213). A cena da estação, de dia ou de noite, continua.
- **Saíram** da Home e de `src/content`: serviços 01/02, prova (34% → 89% e vídeo), os quatro depoentes, a faixa de projetos, a agenda do mês, o WhatsApp e os projetos OIA e Cinnatra (D-1202). `VideoClip`, `Marquee` e o `Quote` com depoentes continuam no design system e na vitrine. O chip fixo de achados saiu do layout público, porque o contador agora está no cabeçalho de todas as páginas (D-1204).
- **Metadados.** Título "Victor Gabriel, dev front-end e tech lead", descrição nova, cargo novo no JSON-LD e imagem Open Graph com o título novo; os subconjuntos de fonte da imagem foram regerados com os caracteres novos (D-1214, D-1218).

### Página `/contato`

Mínima, para os CTAs terem destino: título "contato", um `SegmentedControl` "Assunto" com "vaga" e "projeto" que lê `?aba=` e escreve com o `history.replaceState` nativo (sem rolar, sem nova entrada no histórico, sem ida ao servidor). Cada aba tem uma frase e os canais diretos, com o e-mail já com assunto "Vaga" ou "Projeto". Sem formulário. A **mesa de contato** fica ali. O controle mora num `Suspense` cujo fallback é a mesma árvore na aba "vaga", e os textos das duas abas ocupam a mesma célula, então a troca na hidratação não move nada (D-1212). A página deixou de ser provisória.

### Design system

- **`ImageFrame`** (novo, com ficha, teste e vitrine): moldura com proporção fixa; sem imagem, a hachura com a pendência. O `Polaroid` passou a usá-lo (D-1209).
- **`Tag`** com `dot` (`success`, `warning`), ponto decorativo ao lado do texto (D-1210).
- **`Stat`** com `label`, `methodKind` ("Método" ou "Fonte") e `size` (`md` em `text-h2`, sem hifenizar, para valores longos como "1 base de código, 3 plataformas").
- **`Quote`**: o estado indisponível aceita frase e pendência próprias e é desenhado na ficha de papel.
- **Achados**: `AchadosChip` `placement="header"`, `AchadosCount` (contagem em texto) e os desenhos `Pena` e `Mesa`; dica da pena reescrita para a nova posição.
- Vitrine atualizada em `/sistema/componentes`, `/sistema/conteudo` e `/sistema/achados`.

## Qualidade

| Porta                                                  | Resultado                                                                                                                                                                                                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint, tipos, testes de unidade e build                 | lint sem avisos, tipos sem erro, **350 testes** e build aprovados; `tokens:build` com os 648 pares aprovados                                                                                                                 |
| e2e (Chromium, WebKit e Firefox), sem novas tentativas | **297 passaram, 0 falhas, 159 puladas pela política de motores** (D-1113), sem novas tentativas, rodado duas vezes do zero com o código final; a Home passa pelas 8 combinações nos três motores                             |
| axe, todas as páginas × 8 combinações (Chromium)       | **120 de 120 auditorias sem violação e sem mensagem de console**, todas de primeira (`docs/qa/axe-report.json`; inclui Home e `/contato`)                                                                                    |
| Home nas 8 combinações (três motores)                  | axe sem violação e console limpo em todas (e2e CA-2)                                                                                                                                                                         |
| `/contato`                                             | 8 combinações no Chromium e primavera clara e escura no WebKit e no Firefox, sem violação (e2e CA-4 da ficha do contato)                                                                                                     |
| Teclado                                                | ponta a ponta no desktop (pular para o conteúdo, navegação, contador, estação, CTAs, pinha, fichas, pena, contato, coruja, rodapé), seletor de tema só pelo teclado, Drawer no mobile, abas do `/contato` por setas e Espaço |
| CLS                                                    | 0 em `/`, `/contato?aba=projeto` e `/sistema`, mobile e desktop, com as fontes sem pré-carga atrasadas                                                                                                                       |
| Alvo de toque                                          | todo controle da Home com 44 px ou mais, em 390 e 1366 px; pinha, pena, coruja e mesa com 44 px                                                                                                                              |

### Lighthouse da Home (mobile)

A meta do pedido é "sem piora" nos dois métodos. Esta máquina varia muito entre execuções (D-701), então medi de três formas e relato todas.

**1. Medianas de 3, em momentos diferentes** (`docs/qa/home-v2/lighthouse-home-v1.summary.json` e `-v2.summary.json`):

| Versão                   | Simulado | Devtools | LCP sim. | TBT sim. | TBT devtools | CLS | Acessib. |
| ------------------------ | -------- | -------- | -------- | -------- | ------------ | --- | -------- |
| v1 (fase 3), medida hoje | 80       | 77       | 4,10 s   | 281 ms   | 791 ms       | 0   | 100      |
| v2, primeira versão      | 81       | 74       | 4,11 s   | 229 ms   | 1.190 ms     | 0   | 100      |

**2. Pares alternados v1 × v2, 5 de cada por método**, com a v1 servida de uma cópia do commit `e8dfd4e` na porta 3101 e a v2 na 3100, ao mesmo tempo (`docs/qa/home-v2/pares/`). Mostrou dois custos: 4 pré-buscas RSC a mais (os CTAs para `/contato?aba=…`) e mais hidratação (cada `Button` recalcula as formas no cliente). Corrigi os dois: CTAs sem pré-busca (D-1219) e o `ButtonLink` de servidor (D-1220).

**3. Pares alternados de novo, com as correções** (`docs/qa/home-v2/pares2/`):

| Método   | v1 (notas)         | v2 (notas)         | Mediana v1 → v2 | TBT mediano v1 → v2 | LCP v1 → v2   |
| -------- | ------------------ | ------------------ | --------------- | ------------------- | ------------- |
| Simulado | 71, 68, 82, 78, 80 | 82, 58, 75, 76, 81 | 78 → 76         | 319 → 397 ms        | 4,11 → 4,08 s |
| Devtools | 78, 78, 74, 76, 78 | 75, 71, 77, 77, 72 | 78 → 75         | 793 → 1.060 ms      | 2,18 → 2,16 s |

Os JSON completos desta rodada estão em `docs/qa/home-v2/pares2/`; das rodadas anteriores (incluindo uma de 5 execuções da v2 sem pares, `-v2b`, que deu 75 e 73 e mostrou o ruído), ficaram só os resumos (em `pares/`, cada resumo guarda só o devtools: a ferramenta grava um arquivo por rótulo, e o segundo método sobrescreveu o primeiro).

Trabalho medido (mediana, simulado): script 636 → 801 ms, thread principal 4,1 → 4,6 s; JavaScript transferido 212 → 211 KB. CLS 0 e acessibilidade 100 em todas as 40 execuções.

**Conclusão: "sem piora" não ficou demonstrado.** O LCP, que limita a nota no simulado, ficou igual; CLS e acessibilidade não mudaram; o JavaScript ficou um pouco menor. Mas a v2 faz cerca de 10% mais trabalho na thread principal, e as medianas ficam de 2 a 3 pontos abaixo da v1 nos dois métodos. Nas execuções isoladas, essa diferença some no ruído (a v1 variou 14 pontos e a v2, 24), mas nas medianas ela aparece de forma consistente, e não a trato como zero. A causa é a própria página: mais conteúdo, mais DOM (829 → 857 nós), contador e estação interativos no cabeçalho, um achado a mais e o esboço do hero. Caminhos para recuperar, se Victor quiser: medir no CI (runner estável); trocar o `Quote` cliente por um bloco de servidor quando o depoimento estiver pendente; tirar o esboço do HTML do mobile (hoje ele vai no HTML e só fica escondido abaixo de `lg`).

## Lista do release:check

`pnpm release:check` reprova, como esperado, com **22 itens**:

**Pendências no conteúdo (14)**

- `site.linkedin`: [a confirmar: URL do LinkedIn]
- `site.cv`: [a confirmar: arquivo do CV em PDF]
- `home.proof.testimonial.text`: [a confirmar: depoimento voltado a dev, de preferência sobre a atuação como tech lead]
- `home.proof.figures[1].method`: [a confirmar: como foi medido e o tempo final em segundos]
- `home.proof.figures[3].method`: [a confirmar: validar: arquivos ou testes]
- `home.about.photo`: [a confirmar: foto do Victor]
- `home.footer.signatureCheck`: [a confirmar: confirmar o sobrenome usado no site]
- `projects[0..3].image`: capturas do Nexuscoop, do Kasb Health, da Suíte OdiN e do Lance!
- `pages.provisional.projetos.content` e `pages.provisional.sobre.content`
- `pages.secret.href`: [a confirmar: página secreta]

**Links para rotas inexistentes (4):** `/projetos/nexuscoop`, `/projetos/kasb-health`, `/projetos/suite-odin`, `/projetos/lance`.

**Links para páginas provisórias (4):** `/projetos` e `/sobre`, a partir de "ver todos os projetos", "mais sobre mim" e da navegação.

Nenhuma marca `[a confirmar: …]` escrita direto no código. `/contato` saiu da lista.

## Decisões e desvios do pedido

- **Minúsculas do copy mantidas** (D-1201): títulos, rótulos e CTAs ficam como Victor escreveu. A TL-11 fala de não pôr maiúscula além da primeira letra; não a usei para "corrigir" o copy.
- **Números do copy como texto** (D-1206): "5+", "8s", "400+" e "30 °C" não passam pelo formatador, para não mudar o que Victor escreveu.
- **"Método" ou "Fonte"** (D-1207): escolhi "Método" para a medição (8s) e "Fonte" para os fatos e contagens. O "400+" ficou com "Fonte" pendente porque o que falta é saber o que foi contado.
- **Título oculto na seção de depoimento e números** (D-1211): o copy não dá título visível; não inventei um.
- **Textos que eu escrevi** (não estavam no pedido): frase do depoimento indisponível, título, apoio e frases das abas do `/contato` ("contato", "sobre a vaga", "sobre o projeto"), a dica nova da pena, os nomes dos achados antes de achar ("Algo para escrever perto da foto", "Algo em cima da mesa") e a descrição dos metadados.
- **Sem CTA no cabeçalho** (D-1203): o copy lista só links, contador e tema.
- **Chip fixo de achados fora do layout** (D-1204).
- **`history.replaceState` em vez de `router.replace`** no `/contato`: o Next integra o nativo ao `useSearchParams`, sem ida ao servidor (D-1212).
- **Pré-busca desligada nos CTAs** (D-1219), achada na medição de desempenho.
- **Assinatura "Victor Barros"** aplicada como pedido, com a pendência visível; o resto do site continua "Victor Gabriel".
- **O pedido cita `docs/REGRAS.md`**; o arquivo do projeto é `docs/RULES.md` (nomes de arquivo em inglês), e foi ele que segui.
- **Dois testes antigos ajustados**: o do `LiveClock` esperava segundos e agora usa relógio controlado para conferir `HH:mm` e a virada do minuto; o de movimento reduzido passou a ignorar transições de 0,01 ms da rede de segurança do `base.css`, que podiam estar "rodando" no instante da hidratação (era a causa do teste instável do WebKit registrado na fase 3).

## Capturas

81 capturas (27 por motor), revisadas, geradas por `pnpm screenshots`:

- Home em 390×844 e 1366×768 nas 8 combinações: `docs/screenshots/home/<motor>/<combinação>/390x844.jpg` e `1366x768.jpg` (motores `chromium`, `webkit`, `firefox`; combinações `primavera-claro`, `primavera-escuro`, `verao-claro`, `verao-escuro`, `outono-claro`, `outono-escuro`, `inverno-claro`, `inverno-escuro`).
- Rodapé de cada combinação: `docs/screenshots/rodape/<motor>/<combinação>.jpg`.
- Vitrine de temas: `docs/screenshots/sistema/<motor>/temas-1600x900.jpg`.
- Recortes 2x ampliados a 400%, em primavera clara e verão escuro, agora com o CTA "tenho uma vaga" e a ficha de projeto da Home v2: `docs/screenshots/bordas/<motor>/*-2x-400.png`. Sem serrilhado.

## Critérios da ficha

Todos atingidos, com teste, exceto o **CA-10** (Lighthouse sem piora), que não ficou demonstrado: ver a seção Lighthouse acima.

## Próximos passos

1. Medir a Home no CI (runner estável) e decidir se os 2 a 3 pontos de mediana pedem as otimizações listadas acima.
2. Resolver as 14 pendências do `release:check`, a começar pelas capturas dos projetos, pelo LinkedIn, pelo CV e pelo sobrenome da assinatura.
3. Páginas `/projetos`, `/projetos/<slug>` e `/sobre`, que hoje são provisórias ou 404.
