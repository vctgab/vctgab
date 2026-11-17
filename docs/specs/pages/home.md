# Página: Home (v2)

> Ficha de página. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. A v2 substitui a Home da fase 2 (serviços 01/02, prova com vídeo, sobre com três frases, faixa de projetos); a v1 fica no histórico do git. O copy veio de Victor e é literal: não se reescreve, só se aplica a regra de primeira letra maiúscula onde ele já a segue (D-1201). Decisões: D-1201 a D-1220 em `docs/DECISIONS.md`.

## Spec

### Tipo de página e tarefa

- **Tipo:** página de entrada e de conversão.
- **Público:** quem contrata dev (recrutadores, tech leads) e quem tem um projeto (fundadores, equipes). Os dois CTAs separam os dois caminhos: "tenho uma vaga" e "tenho um projeto".
- **Tarefa do visitante:** em 10 segundos entender que Victor veio do design e hoje constrói e lidera (React e TypeScript), ver projetos reais, números com fonte e chamar pelo caminho certo.
- **Quando não usar este modelo:** páginas de caso (longas, narrativas) e páginas de lista (Projetos).

### Seções (ordem e função)

| #   | Seção                | Função                                   | Componentes                                                                                                          |
| --- | -------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| A   | Cabeçalho            | Orientar, contar achados e trocar o tema | `Header` (Logo, links, `AchadosChip` `header`, botão de estação com `Popover` + `ThemeSwitcher`, `Drawer` no mobile) |
| B   | Hero                 | Dizer quem é e separar vaga de projeto   | `Hero` (placa, `Tag` com ponto, `LiveClock` HH:mm, sublinhado `handLine`, `Button` × 2, esboço, `Achavel` pinha)     |
| C   | Projetos em destaque | Mostrar trabalho real e levar à lista    | `Section`, `Ficha` × 4 com `ImageFrame`, `Tag` de status, `LinkText`                                                 |
| D   | O que eu faço        | Dizer o que Victor faz bem               | `Section`, lista numerada 01 a 04, `Tag`                                                                             |
| E   | Depoimento e números | Prova social e números com fonte         | `Quote` (indisponível, com pendência), `Stat` × 4                                                                    |
| F   | Sobre                | Quem é, com fatos dele                   | `Section`, `Polaroid`, `LinkText`, `Achavel` pena                                                                    |
| G   | Contato              | Chamar de novo, com canais diretos       | `Section`, `Button` × 2, `LinkText`, `Fact`, `Achavel` coruja                                                        |
| H   | Rodapé               | Assinar, contar achados e listar links   | `Footer` com `FooterScene`, contagem de achados ao vivo, `Fact`                                                      |

Sem formulário (não há backend). A página `/contato` mínima tem ficha própria: `docs/specs/pages/contact.md`.

### Componentes que nascem ou mudam

- **`ImageFrame`** (novo, `docs/specs/image-frame.md`): moldura de imagem; sem imagem, hachura com o rótulo da pendência. O `Polaroid` passa a usá-la.
- **`Tag`** ganha `dot` (`success`, `warning`): ponto de status ao lado do texto, nunca no lugar dele (`docs/specs/tag-chip.md`).
- **`Stat`** ganha `label` (o que o número conta), `methodKind` (`metodo` ou `fonte`, rótulo visível "Método" ou "Fonte") e `size` (`lg`, `md`) (`docs/specs/p1-visuals.md`).
- **`Quote`**: o estado indisponível aceita `unavailableMessage` e `note` (a pendência), desenhado na ficha de papel, sem citação inventada (`docs/specs/quote.md`).
- **`AchadosChip`** ganha `placement="header"`; **`AchadosCount`** (novo, no mesmo módulo) mostra "N de 7" ao vivo em texto; desenhos **`Pena`** e **`Mesa`** (`docs/specs/finds.md`).
- **`Header`**: links em minúscula, contador de achados, botão "estação: primavera" com o nome da estação ativa; sem CTA (`docs/specs/header-footer.md`).
- **`Footer`**: textos novos, GitHub, LinkedIn e CV, assinatura com pendência (`docs/specs/header-footer.md`).
- **`Hero`**: textos novos, selo, linha de local com hora HH:mm, dois CTAs e o esboço "do rascunho ao ar" (`docs/specs/hero-footer.md`).
- Saem da Home e de `src/content`: serviços 01/02, prova (Stat 34% → 89% e vídeo), quatro depoentes, faixa de projetos (Marquee), agenda do mês e WhatsApp. `VideoClip`, `Marquee` e o `Quote` com depoentes continuam no design system e na vitrine.

### Estados das partes com dados

| Parte                    | Carregando                                                            | Vazio                                  | Erro                                        | Indisponível                                                                      | Com dados              |
| ------------------------ | --------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------- |
| Relógio (`LiveClock`)    | Antes de montar: espaço reservado "00:00" oculto                      | Não se aplica                          | Não se aplica (sem rede)                    | Sem JavaScript: o espaço fica vazio, o resto da linha segue                       | `HH:mm` de Teresina    |
| Contador de achados      | Antes de ler o caderno: número oculto, largura fixa                   | "achados: 0 de 7"                      | Sem armazenamento: conta na sessão          | Não se aplica                                                                     | "achados: N de 7"      |
| Estação no botão de tema | Não há: o nome vem do CSS sobre `data-season`, já na primeira pintura | Não se aplica                          | Não se aplica                               | Não se aplica                                                                     | "estação: primavera"   |
| Imagens dos projetos     | Não se aplica (estáticas)                                             | Não se aplica                          | Não se aplica                               | Hachura com `[a confirmar: captura do <projeto>]`                                 | Imagem com `alt`       |
| Depoimento (`Quote`)     | Esqueleto (já existe)                                                 | "Ainda não há depoimentos publicados." | "Não foi possível carregar os depoimentos." | "O depoimento entra quando a pessoa autorizar a publicação." + `[a confirmar: …]` | Citação com autor      |
| Números (`Stat`)         | Não se aplica (estáticos)                                             | Não se aplica                          | Não se aplica                               | Método ou fonte pendente: `[a confirmar: …]` no lugar                             | Número, rótulo e fonte |
| Foto (`Polaroid`)        | Não se aplica                                                         | Não se aplica                          | Não se aplica                               | Hachura com `[a confirmar: foto do Victor]`                                       | Foto com `alt`         |

### Achados nesta página

- **Pinha escondida** (já existe): no hero, entre as formas.
- **Pena de escrever** (muda de lugar: sai da futura página Sobre e vem para a seção sobre da Home): ao lado da polaroid. Nome antes de achar: "Algo para escrever perto da foto"; depois: "Pena de escrever, achado". Dica nova em `src/lib/finds/finds.ts`.
- **Coruja do correio** (já existe): ao lado dos canais diretos do contato.
- A **mesa de contato** fica na página `/contato`.

### Teclado

Ordem no desktop: Pular para o conteúdo → Logo → projetos, sobre, contato → achados: N de 7 (abre o caderno; Esc fecha e devolve o foco) → estação: primavera (abre o seletor; setas trocam a estação; Tab vai ao modo; Esc fecha e devolve o foco) → pinha → tenho uma vaga → tenho um projeto → as quatro fichas → ver todos os projetos → pena → mais sobre mim → tenho uma vaga → tenho um projeto → vctgab.ux@gmail.com → coruja → rodapé. No mobile: Logo → contador → estação → Abrir menu (Drawer com os três links, foco preso e Esc).

### ARIA e nome acessível

`main#conteudo`; um `h1` (hero); cada seção é `section` nomeada pelo seu `h2`; a seção E tem `h2` só para leitores de tela ("depoimento e números", D-1211). Botão de tema: nome "estação: primavera" (texto do botão, com o nome da estação ativa), `aria-haspopup="dialog"` pelo Popover. Contador: nome "achados: N de 7", descrição "Abre o caderno de achados". Selo e status das fichas: texto, com o ponto `aria-hidden`. Esboço do hero e sublinhado: `aria-hidden`. Links externos anunciam "(abre em nova aba)". JSON-LD `Person` só com nome, cargo, URL e GitHub.

### Irregularidade

Só pelo motor e pelos componentes; seeds por seção (`home:*`, `hero:*`). O esboço do hero usa `wobblyRect` e `blob` com seeds fixas; rotações fixas abaixo de 3°.

### Alto contraste e movimento

Herdados dos componentes: `forced-colors` troca camadas por bordas e esconde o fundo e o esboço do hero (decorativos); com movimento reduzido, hero parado e `Reveal` desligado.

### Contraste por modo (pedido, conferido pelo `tokens:build`)

Claro: preenchimento no passo 600 com texto branco; texto em primária no 700. Escuro: preenchimento no 400 com tinta escura; texto em primária no 300. O passo 500 nunca é texto no escuro: `primary-decor` (usado no valor do `Stat` e nos sublinhados) é 500 no claro e 400 no escuro.

### Ficha de Texto

1. **Quem lê:** recrutadores e tech leads (vaga) e fundadores e equipes (projeto). Leitura rápida no celular.
2. **Grade de Tom** (copy de Victor, literal):

| Situação                | Voz                | Texto final                                                                                                                                                                                                                                                            |
| ----------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navegação               | sistema            | "projetos", "sobre", "contato" (minúsculas, como no copy)                                                                                                                                                                                                              |
| Contador                | sistema            | "achados: 0 de 7"                                                                                                                                                                                                                                                      |
| Botão de tema           | sistema            | "estação: primavera" (e "verão", "outono", "inverno")                                                                                                                                                                                                                  |
| Selo                    | sistema            | "aberto a vagas e projetos"                                                                                                                                                                                                                                            |
| Linha de local          | personalidade leve | "Teresina, PI · {hora} · provavelmente uns 30 °C"                                                                                                                                                                                                                      |
| Título do hero          | sistema, pessoal   | "Comecei desenhando as telas. Hoje eu coloco elas no ar."                                                                                                                                                                                                              |
| Apoio do hero           | sistema, pessoal   | "Sou o Victor, dev front-end e tech lead. Passei cinco anos desenhando interfaces e conferindo se o que chegava em produção era o que tinha sido desenhado. Hoje eu mesmo construo, em React e TypeScript, e o caminho entre a ideia e o deploy ficou bem mais curto." |
| CTAs                    | sistema            | "tenho uma vaga", "tenho um projeto"                                                                                                                                                                                                                                   |
| Projetos                | sistema            | "o que eu ando construindo"; fichas com meta, status ("em andamento", "no ar"), título e descrição do copy; "ver todos os projetos"                                                                                                                                    |
| O que eu faço           | sistema            | "do layout ao deploy" / "quatro coisas que eu faço bem, de preferência juntas."; itens 01 a 04 do copy                                                                                                                                                                 |
| Depoimento indisponível | sistema            | "O depoimento entra quando a pessoa autorizar a publicação." + `[a confirmar: depoimento voltado a dev, de preferência sobre a atuação como tech lead]`                                                                                                                |
| Números                 | sistema            | "5+" anos em produto digital (fonte: desde 2021); "8s → quase instantâneo" (método pendente); "1 base de código, 3 plataformas" (fonte); "400+" (fonte pendente)                                                                                                       |
| Sobre                   | pessoal            | "prazer, Victor"; dois parágrafos do copy; "mais sobre mim"                                                                                                                                                                                                            |
| Contato                 | sistema            | "bora conversar?" / "Pode ser uma vaga, um projeto ou só uma ideia ainda meio solta. Costumo responder em até um dia útil."                                                                                                                                            |
| Rodapé                  | pessoal            | "Desenhado e codado por mim, em Teresina." / "Achados: N de 7. Tem coisa escondida por aqui." / "© 2026 Victor Barros"                                                                                                                                                 |
| Achado da pena          | mistério           | "Algo para escrever perto da foto" → "Pena de escrever, achado"                                                                                                                                                                                                        |

3. **Título e subtítulo:** ver a grade.
4. **Ações e rótulos:** "tenho uma vaga", "tenho um projeto", "ver todos os projetos", "mais sobre mim", "Abrir menu", "Fechar menu", "achados: N de 7", "estação: …". Links de contato com o próprio endereço.
5. **Ajuda e placeholders:** não há campos.
6. **Termos novos ou dúvidas de glossário:** "achados" e "estação" já estão no glossário; "vaga" (oportunidade de emprego) entra no glossário.
7. **Estados:** ver a tabela de estados.
8. **Erros previstos:** nenhum (página estática).
9. **Confirmações e sucesso:** achar a pena anuncia pelo provider de achados.
10. **Números e datas:** hora por `LiveClock` (`@/lib/format`); contagem de achados por `formatCount`. Os números do copy ("5+", "8s", "400+", "30 °C") são texto de Victor, citado literalmente do conteúdo, não valores calculados (D-1206).
11. **Dados reais evitados:** só o que Victor escreveu. Clientes citados por ele: Felicoop, OdiNetwork, Lance!, Entrega Contínua. Pendências: capturas dos quatro projetos, depoimento, método do 8s, validação do 400+, foto, LinkedIn, CV e sobrenome da assinatura.
12. **Exceções pedidas:** nenhuma.

### Critérios de aceite

- [ ] CA-1 A Home tem as seções na ordem cabeçalho, hero, projetos, o que eu faço, depoimento e números, sobre, contato, rodapé, com um `h1` e um `h2` por seção (e2e de estrutura).
- [ ] CA-2 axe sem violações nas 8 combinações de estação e modo, nos três motores, e console sem erro nem aviso de hidratação (e2e).
- [ ] CA-3 "tenho uma vaga" e "tenho um projeto" (hero e contato) levam a `/contato?aba=vaga` e `/contato?aba=projeto`, e a aba certa aparece marcada (e2e).
- [ ] CA-4 Toda pendência aparece como `[a confirmar: …]` e está na lista do `pnpm release:check`, que também acusa `/projetos`, `/sobre` e `/projetos/<slug>` (script e e2e).
- [ ] CA-5 O contador do cabeçalho mostra "achados: N de 7" ao vivo, abre o caderno e, ao fechar, devolve o foco; o rodapé repete N (e2e).
- [ ] CA-6 O botão de tema mostra o nome da estação ativa já no HTML pintado (sem JavaScript), muda ao trocar a estação e abre o seletor de estação e modo (e2e).
- [ ] CA-7 Teclado de ponta a ponta: pular para o conteúdo, navegação, contador, tema, CTAs, achados (pinha, pena, coruja) e, no mobile, o menu em Drawer (e2e).
- [ ] CA-8 CLS 0 com as fontes sem pré-carga atrasadas, em mobile e desktop (e2e `cls.spec.ts`).
- [ ] CA-9 Metadados: título e descrição novos, Open Graph 1200 × 630 com o título novo, sitemap sem `/sistema`, robots bloqueando `/sistema`, JSON-LD `Person` com os quatro campos (e2e).
- [ ] CA-10 Lighthouse mobile da Home nos dois métodos sem piora em relação à v1 medida na mesma sessão; acessibilidade ≥ 95 (`docs/qa/home-v2/`).
- [ ] CA-11 Capturas em 390×844 e 1366×768 nas 8 combinações, revisadas (`docs/screenshots/home/`).
- [ ] CA-12 Todo controle tem 44 px ou mais; os achados pinha, pena e coruja contam no caderno (e2e).
- [ ] CA-13 O texto da Home é o do copy, sem reescrita (teste de unidade compara `src/content/home.ts` com as frases do pedido).

## Plan

- **Conteúdo:** `src/content/home.ts` (tudo da Home, inclusive cabeçalho e rodapé), `src/content/projects.ts` (os quatro projetos), `src/content/site.ts` (sem WhatsApp e agenda; LinkedIn e CV pendentes; cargo novo), `src/content/contact.ts` (página `/contato`), `src/content/pages.ts` (`contato` deixa de ser provisória). `scripts/release-check.ts` lê também `contact.ts`.
- **Componentes:** `src/components/ui/{image-frame,tag,stat,quote,polaroid,finds}`, `src/components/layout/{header,footer}`, `src/components/hero/{hero,hero-sketch}.tsx`, `src/components/home/*` (seções novas, só composição), `src/lib/contact` (`contactHref`).
- **Desempenho:** seções em Server Components; no cliente só cabeçalho, relógio, achados e o fundo do hero. O esboço do hero é SVG estático do servidor e só aparece a partir de `lg`.
- **Riscos:** o nome da estação no botão precisa estar certo antes da hidratação (resolvido por CSS sobre `data-season`, sem estado no servidor); a largura do botão muda com a estação (só por ação de quem usa, fora do CLS); a imagem Open Graph usa subconjuntos de fonte e precisa dos caracteres do título novo; rotas `/projetos/<slug>` continuam 404 (sem pré-busca).

## Tarefas

- [x] Ficha (esta, `pages/contact.md`, `image-frame.md` e ajustes nas fichas dos componentes)
- [ ] Componentes do design system: `ImageFrame`, `Tag` com ponto, `Stat`, `Quote` indisponível, `AchadosChip` `header`, `AchadosCount`, `Pena`, `Mesa`, com testes e vitrine
- [ ] Conteúdo e Home: cabeçalho, hero, seções, rodapé, metadados e Open Graph
- [ ] Página `/contato` com abas
- [ ] Testes e2e (um por critério), axe nas 8 combinações, Lighthouse e capturas
- [ ] Relatório `docs/REPORT-home-v2.md`
