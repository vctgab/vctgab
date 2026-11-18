# Relatório: caso Nexuscoop, molde de casos e ajustes da Home

Data: 17/11/2026. Fichas: `docs/specs/pages/case.md`, `review-mark.md`, `callout.md`, `code-block.md`, `case-figure.md`, `case-header.md`, `case-toc.md`, `case-footer.md` e o acréscimo na `pages/home.md`. Decisões: D-1301 a D-1320 em `docs/DECISIONS.md`. Copy de Victor, como fonte da verdade e literal: `docs/copy/home-copy.md` e `docs/copy/case-nexuscoop.md`.

Commits (todos sem assinatura de ferramenta): `3145c61` (copy, fichas e decisões), `241b9b4` (Home), `904c990` (conteúdo tipado, `review()`, `release:check`, prints), `42f244d` (componentes, molde, rota, metadados, Open Graph, sitemap) e o commit deste relatório (vitrine, testes e2e, QA, capturas e correções da QA).

## O que foi feito

### Home

- A ficha do Nexuscoop usa a descrição nova ("…com mais de 500 médicos, com uma base de código só pra web, Android e iOS.") e o link para `/projetos/nexuscoop`, que agora existe. A captura do Nexuscoop deixou de ser pendência: o card usa o print principal do caso (D-1309).
- Os números são quatro, cada um com a linha de fonte pedida: "5+" (desde 2021), "1 base de código, 3 plataformas" (React + Capacitor), "6.500+" (testes unitários no Vitest, todos passando) e "44" (Supabase, em Deno). Saíram "8s → quase instantâneo" e "400+".
- O "8s → quase instantâneo" ficou como pendência futura em `docs/DECISIONS.md` (D-1320) e num comentário em `src/content/home.ts`; não aparece no site.

### Caso em `/projetos/nexuscoop` e o molde

Ordem do copy: ficha técnica, imagem principal, resumo, contexto, o que eu fiz (Código e Liderança), o problema que mais deu trabalho, resultado, o que eu faria diferente, rodapé. O texto é o do copy: um teste (`src/content/projects/nexuscoop.test.ts`) confere cada trecho contra `docs/copy/case-nexuscoop.md`, ignorando só a caixa da primeira letra (D-1302).

Componentes novos, cada um com ficha, teste e seção na vitrine (`/sistema/caso`):

| Componente                       | Pasta             | Resumo                                                                                                                                                                                                                                                              |
| -------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CaseHeader`                     | `ui/case-header`  | Áreas, `h1`, "o que é" e a ficha técnica (`dl`) numa `Ficha` com fita. Status como `Tag` com ponto e texto; stack em `Tag` (o detalhe entre parênteses de "Supabase (…)" fica ao lado do chip).                                                                     |
| `CaseFigure` e `CaseFigureGroup` | `ui/case-figure`  | Moldura de navegador ou de celular desenhada pelo motor, `next/image` com largura e altura declaradas, legenda do copy, `alt` descritivo e ampliação num `Dialog` (tamanho novo `xl`). Grupo: desktop e celular lado a lado, empilhados no celular, uma legenda só. |
| `CodeBlock`                      | `ui/code-block`   | Realce no servidor com `shiki` (zero JavaScript de realce no cliente), legenda e botão "Copiar código".                                                                                                                                                             |
| `Callout`                        | `ui/callout`      | `role="note"` com nome; usado na regra "se o validador falhar, ele não pode devolver uma lista vazia de erros".                                                                                                                                                     |
| `CaseToc`                        | `ui/case-toc`     | Coluna `sticky` a partir de `lg`; no celular, `<details>` no topo (funciona sem JavaScript). Marca a seção atual com `aria-current="location"`.                                                                                                                     |
| `CaseFooter`                     | `ui/case-footer`  | "Próximo projeto: Kasb Health →" (sem pré-busca) e os dois CTAs.                                                                                                                                                                                                    |
| `ReviewMark`                     | `ui/review-mark`  | A marca visível `[validar: …]` (item 3 do pedido).                                                                                                                                                                                                                  |
| `CasePage`                       | `components/case` | O molde: compõe tudo a partir de um `ProjectCase`.                                                                                                                                                                                                                  |

Justificativa da dependência `shiki` (PR-02, D-1307): o pedido exige destaque de sintaxe sem JavaScript no cliente. `prism` e `highlight.js` realçam no cliente ou não têm tema por variáveis CSS; o `shiki` gera HTML estático com o tema `css-variables`, ligado aos nossos tokens (`--shiki-*` em `src/styles/base.css`, só tokens que o `tokens:build` já valida sobre `surface-raised`: nenhum par novo, 648 pares aprovados). Roda no servidor e em cache (`"use cache"` em `highlight()`), com o motor JavaScript e só as linguagens usadas.

### Esquema de blocos (o molde dos próximos casos)

Em `src/content/projects/types.ts`. Um caso é um `ProjectCase`: `slug`, `meta` (título, descrição, linha do Open Graph), `header`, `cover`, `sections` (cada uma com `id`, `title` e `blocks`) e `next`.

| `type`         | Campos                                            | Renderiza                                   |
| -------------- | ------------------------------------------------- | ------------------------------------------- |
| `text`         | `content: Inline[]`, `find?`                      | parágrafo (com o achado ao lado, se houver) |
| `subtitle`     | `text`, `level?`                                  | `h3` ou `h4`                                |
| `code`         | `language`, `code: Reviewable<string>`, `caption` | `CodeBlock`                                 |
| `figure`       | `figure`                                          | `CaseFigure`                                |
| `figure-group` | `figures[]`, `caption`                            | `CaseFigureGroup`                           |
| `stats`        | `items[]` (valor, rótulo, método ou fonte)        | grade de `Stat`                             |
| `callout`      | `label`, `content`                                | `Callout`                                   |
| `list`         | `items[]` (com `label?`), `ordered?`              | `ul`, `ol` ou `dl`                          |

`Inline` é texto, `{ strong }`, `{ code }`, `{ em }` ou um `review(...)`. Um caso novo é um arquivo em `src/content/projects/`, uma linha em `CASES` e `src/app/projetos/<slug>/page.tsx` de poucas linhas (`<CasePage project={…} />` mais `metadata`); o sitemap inclui cada caso de `CASES` sozinho.

### `review()` e o `release:check`

`review("o que validar", conteúdo, { withhold? })` mora em `src/content/pending.ts`, ao lado de `pending()`. O `release:check` ganhou a seção "Itens em revisão" e a rota inexistente do próximo projeto. Cinco itens do copy são `review()` (D-1305):

- código do cliente (`withhold`: o código **não** é renderizado nem vai ao HTML; o teste e2e confere que `isNativePlatform` não aparece na resposta);
- incidente da exclusão em cascata;
- autoria das regras de UI e linguagem;
- papéis do time de 5 pessoas;
- o parágrafo de "O que eu faria diferente".

### Prints, metadados, achado

- 14 prints (a tabela "Prints sugeridos"), em `public/projetos/nexuscoop/*.webp` (1920 px no desktop e 780 px no celular, nomes em inglês, 1,6 MB no total), servidos pelo `next/image` em AVIF e WebP. Só a imagem principal tem `preload`; as outras 13 são `lazy`. Fora: `01-landing`. O dashboard (extrato e repasse com mock) entra como imagem, e nenhum texto o apresenta como integrado. Os `alt` descrevem a tela e dizem "dados fictícios".
- Metadados em pt-BR ("Caso Nexuscoop · Victor Gabriel"), imagem Open Graph do caso pelo `next/og` na linguagem do site (placa, formas do motor, sem print do cliente; o desenho comum com a Home foi para `src/lib/og/og-kit.tsx` e as fontes foram regeradas com Basic Latin e Latin-1) e entrada no sitemap.
- Achado: **chave de latão**, no parágrafo "Nada some sem deixar rastro" (desenho novo `Chave`, dica do caderno atualizada, D-1319).

## Qualidade

| Porta                                        | Resultado                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testes de unidade                            | 38 arquivos, **423 testes** aprovados (inclui as varreduras de regras e o teste de literalidade do copy)                                                                                                                                                                                                                                                                                          |
| `tokens:build`                               | 8 combinações, **648 pares** aprovados                                                                                                                                                                                                                                                                                                                                                            |
| Tipos e build                                | `pnpm typecheck` sem erro; `pnpm build` aprovado (`/projetos/nexuscoop` e sua imagem Open Graph estáticas)                                                                                                                                                                                                                                                                                        |
| Lint                                         | **Pré-existente, fora desta entrega:** `pnpm lint` falha com 1 aviso em `vctgab.com.br/js/main.js` (site antigo, ignorado pelo git no commit `b14c12c`, mas não pelo ESLint). Nada do que foi escrito aqui tem aviso nem erro (`eslint src tests scripts` limpo)                                                                                                                                  |
| axe, `/projetos/nexuscoop` nas 8 combinações | **sem violações e console limpo**: Chromium nas 8; WebKit e Firefox em primavera clara e escura (política D-1113). A vitrine `/sistema/caso` entrou em `SYSTEM_PAGES` (8 combinações)                                                                                                                                                                                                             |
| CLS                                          | **0** em 390 e 1366 px, com imagens e fontes atrasadas e a página rolada de ponta a ponta (e2e, Chromium) e **0** nas seis execuções do Lighthouse                                                                                                                                                                                                                                                |
| Teclado                                      | de ponta a ponta no Chromium e no Firefox: imagem principal com Enter, foco preso no diálogo, Esc fecha e devolve o foco; sumário; "Kasb Health" e os dois CTAs; bloco do sumário no celular (Enter, Esc). WebKit: ver "Desvios"                                                                                                                                                                  |
| Copiar código                                | testado na vitrine (`/sistema/caso`): Enter copia, o botão vira "Código copiado" e volta; no caso, o código está retido (sem botão)                                                                                                                                                                                                                                                               |
| Alvo de toque                                | todo link, botão e `summary` do caso com 44 px ou mais em 390 e 1366 px                                                                                                                                                                                                                                                                                                                           |
| Sem rolagem horizontal                       | 390 px, sem excesso                                                                                                                                                                                                                                                                                                                                                                               |
| e2e completo (3 motores)                     | rodada antes das correções abaixo: **357 passaram, 191 puladas pela política de motores, 7 falhas**; as 6 falhas da Home eram testes que esperavam o Nexuscoop pendente e a 404 do Nexuscoop (corrigidos, 9 testes passam) e 1 era um `networkidle` que estourou o tempo sob carga (D-701; passa isolado). Depois: `case.spec.ts` no Chromium e no Firefox, **40 passaram, 10 puladas, 0 falhas** |

### Lighthouse mobile (`/projetos/nexuscoop`, mediana de 3, nos dois métodos)

Arquivos em `docs/qa/case/` (`lighthouse-projetos-nexuscoop-caso.summary.json` e as seis execuções).

| Método   | Desempenho | Acessib. | Boas práticas | SEO | FCP    | LCP    | TBT    | CLS |
| -------- | ---------- | -------- | ------------- | --- | ------ | ------ | ------ | --- |
| Simulado | 69         | 100      | 100           | 100 | 1,97 s | 4,54 s | 519 ms | 0   |
| Devtools | 75         | 100      | 100           | 100 | 2,12 s | 2,48 s | 909 ms | 0   |

**A meta de desempenho (90 ou mais) não foi atingida**, e relato assim mesmo. Para comparar, a Home medida nesta mesma máquina na fase anterior deu 81 (simulado) e 74 (devtools) (`docs/qa/home-v2/`); a máquina varia muito entre execuções (D-701): as três execuções simuladas do caso foram 69, 77 e 61. O que o relatório do Lighthouse mostra: o LCP é um **texto** (o parágrafo "o que é"), não uma imagem; a espera é de renderização (3,9 s no simulado) por CSS e JavaScript que bloqueiam, na mesma base de código e no mesmo pacote de 771 ms de script do restante do site, e não pelos prints (que são `lazy`, não entram no LCP e não deslocam nada). Acessibilidade, boas práticas, SEO e CLS estão no máximo. Fica como pendência de desempenho do site inteiro, não do caso.

## Capturas

390×844 e 1366×768, primavera clara e escura, página inteira e topo, nos três motores, em `docs/screenshots/caso/<motor>/<combinação>/`; mais a figura ampliada (1366×768) e o sumário aberto (390×844) em primavera clara.

- Desktop, claro: [`1366x768.jpg`](screenshots/caso/chromium/primavera-claro/1366x768.jpg), [`1366x768-topo.jpg`](screenshots/caso/chromium/primavera-claro/1366x768-topo.jpg), [`1366x768-ampliada.jpg`](screenshots/caso/chromium/primavera-claro/1366x768-ampliada.jpg)
- Desktop, escuro: [`1366x768.jpg`](screenshots/caso/chromium/primavera-escuro/1366x768.jpg), [`1366x768-topo.jpg`](screenshots/caso/chromium/primavera-escuro/1366x768-topo.jpg)
- Celular, claro: [`390x844.jpg`](screenshots/caso/chromium/primavera-claro/390x844.jpg), [`390x844-topo.jpg`](screenshots/caso/chromium/primavera-claro/390x844-topo.jpg), [`390x844-sumario-aberto.jpg`](screenshots/caso/chromium/primavera-claro/390x844-sumario-aberto.jpg)
- Celular, escuro: [`390x844.jpg`](screenshots/caso/chromium/primavera-escuro/390x844.jpg), [`390x844-topo.jpg`](screenshots/caso/chromium/primavera-escuro/390x844-topo.jpg)

A revisão visual achou e corrigiu dois defeitos antes do fechamento: o chip "Supabase (PostgreSQL, Auth, Edge Functions em Deno)" vazava da forma (agora o chip é "Supabase" e o detalhe fica ao lado) e o sumário mantinha a última seção marcada ao voltar ao topo (agora nada fica marcado sem seção na faixa de leitura).

## Lista do `release:check` (reprova com 24 itens, como esperado)

**Revisões `[validar]` (5):**

- `cases.nexuscoop.header.facts.team`: [validar: papéis do time, se quiser detalhar]
- `cases.nexuscoop.sections[2].blocks[2].code`: [validar: permissão para mostrar trechos do código do cliente]
- `cases.nexuscoop.sections[2].blocks[6].content[2]`: [validar: se pode contar o incidente]
- `cases.nexuscoop.sections[2].blocks[15].content[2]`: [validar: se as regras de UI e linguagem foram escritas por você]
- `cases.nexuscoop.sections[5].blocks[0].content[0]`: [validar: o que eu faria diferente]

**Pendências de conteúdo (11):** URL do LinkedIn, arquivo do CV em PDF, depoimento voltado a dev, foto do Victor, sobrenome da assinatura, capturas de Kasb Health, Suíte OdiN e Lance!, conteúdo das páginas `projetos` e `sobre` e a página secreta. (A captura do Nexuscoop saiu da lista.)

**Links para rotas inexistentes (4):** `/projetos/kasb-health` (da lista de projetos e do "Próximo projeto" do caso), `/projetos/suite-odin` e `/projetos/lance`.

**Links para páginas provisórias (4):** `/projetos` e `/sobre` (Home e cabeçalho).

**Marcas `[a confirmar]` escritas no código das páginas:** 0.

## Decisões e desvios

- **Seis blocos em "Código", não cinco.** O copy tem seis parágrafos (uma base de código, a regra mora no banco, nada some, fluxos, qualidade, style guide). Todos entram, na ordem (D-1317).
- **Capitalização.** Frase que o copy escreveu em minúscula depois de um rótulo de campo ("O problema: faturar…", "Legenda: o painel…") ganhou a maiúscula da primeira letra ao virar frase na página (D-1302). Nenhuma palavra mudou; o teste de literalidade só ignora essa caixa.
- **Legenda da imagem principal.** Usei a da seção "Imagem principal" ("O painel do cooperado, com produção do mês, tendência de 12 meses e o Glosômetro."), não a versão curta da tabela de prints.
- **Marca de revisão em qualquer build.** O pedido diz "em desenvolvimento"; a marca aparece em todos os builds (só o código do cliente é retido), porque as capturas e o e2e rodam em `next start` e porque assim é impossível publicar sem ver (D-1305).
- **Um arquivo por caso, não rota `[slug]`.** Para o `release:check` enxergar rota inexistente (D-1315). `src/content/projects.ts` virou a pasta `src/content/projects/`.
- **Nomes dos prints em inglês** (regra de nomes de arquivo); o nome original fica em `source` no conteúdo (D-1316).
- **Sumário no celular é `<details>`**: abre e fecha sem JavaScript; Esc fecha e devolve o foco (D-1313).
- **Tamanho `xl` no `Dialog`, `next/image` no `ImageFrame`, `prefetch` no `LinkText`** (mudanças pequenas em componentes existentes, registradas em D-1309 e D-1314).
- **WebKit e Tab em links.** O Safari não põe links na ordem do Tab por padrão; o teste de teclado do caso percorre botões em todos os motores e o trecho de links (sumário e CTAs) só no Chromium e no Firefox, com a nota registrada na própria anotação do teste.
- **Rodapé do caso fora do `Footer` do site.** `CaseFooter` é o rodapé do conteúdo; o `Footer` com a cena das estações continua o mesmo.
- **Fora do pedido, feito por necessidade:** o desenho `Chave`, os subconjuntos de fonte do Open Graph regerados (Latin-1) e a seção "revisão" no glossário.

## O que depende de Victor

1. Resolver os cinco `[validar]`: ao liberar o código do cliente, trocar o `review(..., { withhold: true })` por `review(..., código)` sem `withhold` e, depois da confirmação, pelo código puro; os outros quatro viram texto comum.
2. Criar os casos de Kasb Health, Suíte OdiN e Lance! (o molde está pronto) e o conteúdo de `/projetos` e `/sobre`.
3. Decidir sobre o desempenho do site (LCP por CSS e JavaScript que bloqueiam), que afeta a Home e o caso.
4. O aviso de lint em `vctgab.com.br/js/main.js` (ignorar a pasta no ESLint ou apagá-la).
