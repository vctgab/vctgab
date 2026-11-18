# Página: caso (molde) e caso Nexuscoop

> Ficha de página. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. O copy é de Victor e é literal (fonte: `docs/copy/case-nexuscoop.md`, D-1301): não se reescreve. Este é o primeiro caso e vira o molde de Kasb Health, Suíte OdiN e Lance!. Decisões: D-1301 a D-1330 em `docs/DECISIONS.md`. Os componentes têm ficha própria: `case-header.md`, `case-figure.md`, `code-block.md`, `callout.md`, `case-toc.md`, `case-footer.md` e `review-mark.md`.

## Spec

### Tipo de página e tarefa

- **Tipo:** página longa e narrativa (um "caso", no glossário).
- **Público:** tech leads e quem recruta dev (leem para decidir se chamam) e fundadores com um projeto parecido.
- **Tarefa do visitante:** em 1 minuto entender o problema, o papel de Victor e o que mudou; em 5 minutos ver como ele pensa (código, decisões, o problema difícil) e seguir para um dos dois CTAs.
- **Quando não usar:** lista de projetos (`/projetos`) e Home.

### Seções (ordem e função)

| #   | Seção                             | Função                                    | Componentes                                                          |
| --- | --------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| A   | Cabeçalho do caso                 | Dizer o que é e dar a ficha técnica       | `CaseHeader` (`Ficha` com fita, `Tag`, `Tag` de status)              |
| B   | Imagem principal                  | Mostrar o produto                         | `CaseFigure` (navegador, prioridade de carga)                        |
| —   | Sumário                           | Navegar e marcar a seção atual            | `CaseToc` (coluna fixa no desktop, bloco recolhível no celular)      |
| C   | Resumo                            | O problema, o que eu fiz, o que mudou     | lista rotulada                                                       |
| D   | Contexto                          | Explicar o domínio                        | texto                                                                |
| E   | O que eu fiz (Código e Liderança) | Mostrar decisões técnicas e de liderança  | texto, `CodeBlock`, `CaseFigure`, `CaseFigureGroup`, achado da chave |
| F   | O problema que mais deu trabalho  | Mostrar raciocínio em um problema difícil | subtítulo, texto, lista, `Callout`                                   |
| G   | Resultado                         | Números com fonte ou método               | `Stat` × 5                                                           |
| H   | O que eu faria diferente          | Honestidade sobre o que aprendeu          | texto (em revisão)                                                   |
| I   | Rodapé do caso                    | Seguir para o próximo projeto ou chamar   | `CaseFooter`                                                         |

O corpo (C a H) vive numa grade: coluna do sumário (14 rem) e coluna de leitura (`max-w-measure`, 65ch). Figuras e grupos podem passar da medida (até 52 rem) para os prints respirarem.

### Esquema de blocos (`src/content/projects/types.ts`)

O conteúdo de um caso é um objeto tipado: `ProjectCase` com `meta`, `header`, `cover` (figura principal), `sections` (cada uma com `id`, `title` e `blocks`), `results` e `next`. Os blocos são uma união discriminada por `type`:

| `type`         | Campos                                                      | Renderiza                                 |
| -------------- | ----------------------------------------------------------- | ----------------------------------------- |
| `text`         | `content: Inline[]`, `find?: { id, label }`                 | parágrafo (e o achado ao lado, se houver) |
| `subtitle`     | `text`, `level?: 3 \| 4`                                    | `h3` ou `h4`                              |
| `code`         | `language`, `code: Reviewable<string>`, `caption: Inline[]` | `CodeBlock`                               |
| `figure`       | `figure: CaseFigureData`                                    | `CaseFigure`                              |
| `figure-group` | `figures: CaseFigureData[]`, `caption: string`              | `CaseFigureGroup`                         |
| `stats`        | `items: { value, label, method, methodKind }[]`             | grade de `Stat`                           |
| `callout`      | `content: Inline[]`, `label: string`                        | `Callout`                                 |
| `list`         | `items: { label?, content: Inline[] }[]`, `ordered?`        | `ul`, `ol` ou `dl` (quando há rótulos)    |

`Inline` é `string`, `{ strong }`, `{ code }`, `{ em }` ou `Review<Inline[]>`. `Reviewable<T>` é `T | Review<T>`: o item em revisão criado por `review("o que validar", conteúdo)` (ver `review-mark.md`). Qualquer campo de texto, o código e a legenda aceitam revisão.

### Itens `[validar]` do copy (D-1305)

| Item                                       | Onde                                   | Efeito até ser resolvido                                                               |
| ------------------------------------------ | -------------------------------------- | -------------------------------------------------------------------------------------- |
| Permissão para mostrar o trecho do cliente | `code` do bloco "Uma base de código"   | `CodeBlock` mostra só a legenda e a marca; o código **não** é renderizado (`withhold`) |
| Se pode contar o incidente da exclusão     | frase em "Nada some sem deixar rastro" | texto aparece com a marca de revisão                                                   |
| Autoria das regras de UI e linguagem       | frase em "O style guide do time"       | texto aparece com a marca de revisão                                                   |
| Papéis do time de 5 pessoas                | campo "Time" da ficha técnica          | valor aparece com a marca de revisão                                                   |
| "O que eu faria diferente"                 | seção H                                | parágrafo aparece com a marca de revisão                                               |

`pnpm release:check` lista cada item e bloqueia a publicação até serem resolvidos.

### Estados das partes com dados

| Parte                 | Carregando                           | Vazio                     | Erro                                                               | Indisponível                                                   | Com dados                         |
| --------------------- | ------------------------------------ | ------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- | --------------------------------- |
| Prints (`CaseFigure`) | Proporção reservada, sem salto       | Não se aplica (estáticos) | Imagem não carrega: a moldura mantém a proporção e o `alt` aparece | Sem print: moldura hachurada `[a confirmar: print: <arquivo>]` | Imagem com `alt` e legenda        |
| Código (`CodeBlock`)  | Não se aplica (realçado no servidor) | Não se aplica             | Falha ao copiar: mensagem inline com o que fazer                   | Em revisão: legenda e marca, sem código                        | Código realçado e botão de copiar |
| Sumário               | Sem JavaScript: links sem marca      | Não se aplica             | Não se aplica                                                      | Não se aplica                                                  | Links e seção atual marcada       |
| Números (`Stat`)      | Não se aplica (estáticos)            | Não se aplica             | Não se aplica                                                      | Método pendente: `[a confirmar: …]`                            | Número, rótulo e fonte ou método  |

### Achado nesta página

**Chave de latão** (`chave`, já listada no caderno): desenho perto do parágrafo "Nada some sem deixar rastro", dentro do bloco `text` (campo `find`). Nome antes de achar: "Algo que abre uma porta, perto do rastro". A dica do caderno muda de "Na página de projetos, algo abre uma porta." para "No caso Nexuscoop, perto de onde nada some sem rastro, algo abre uma porta." (camada de mistério).

### Teclado

Ordem: Pular para o conteúdo → cabeçalho → botão de ampliar da imagem principal → sumário (celular: botão que abre; desktop: links) → botões de ampliar das figuras → botões "Copiar código" → links e CTAs do rodapé do caso. Enter ou Espaço no botão de ampliar abre o diálogo (foco preso, Esc fecha e o foco volta ao botão). Teste: `tests/e2e/case.spec.ts`.

### ARIA e nome acessível

`main#conteudo`; um `h1` (título do caso, no `CaseHeader`); cada seção é `section` nomeada pelo seu `h2`; blocos `subtitle` são `h3`/`h4`. Figuras são `figure` com `figcaption`; o botão de ampliar tem o nome "Ampliar imagem: <alt>". O sumário é `nav` com nome "Sumário", com `aria-current="location"` na seção atual. `Callout` é `role="note"` com nome. A marca de revisão é texto visível `[validar: …]`.

### Irregularidade

Só pelo motor (`src/lib/shapes`); seeds por parte (`caso:nexuscoop:*`). Molduras das figuras: `wobblyRect`; fita da ficha: `tornEdge`. Rotações fixas abaixo de 1,5° (menos que nas fichas da Home, para o print não parecer torto).

### Alto contraste e movimento

Herdados dos componentes: `forced-colors` troca camadas por bordas reais; com movimento reduzido, sem animação no diálogo nem rolagem suave.

### Ficha de Texto

1. **Quem lê:** tech leads, recrutadores e fundadores; leitura mais lenta que a da Home, também no celular.
2. **Grade de Tom** (copy de Victor, literal; só a primeira letra da frase vai para maiúscula quando o copy a escreveu em minúscula depois de um rótulo, D-1302):

| Situação             | Voz              | Texto final                                                                                                       |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Título e "o que é"   | sistema, pessoal | "Nexuscoop" / "Portal de faturamento, glosas, repasse e credenciamento da Felicoop, …"                            |
| Ficha técnica        | sistema          | rótulos "Projeto", "Meu papel", "Empresa", "Período", "Time", "Status", "Stack"; valores do copy                  |
| Legendas das figuras | sistema          | as do copy (tabela "Prints sugeridos"); a da imagem principal é a da seção "Imagem principal"                     |
| Seções               | pessoal          | "Resumo", "Contexto", "O que eu fiz", "O problema que mais deu trabalho", "Resultado", "O que eu faria diferente" |
| Rodapé do caso       | sistema          | "Próximo projeto: Kasb Health →", "tenho uma vaga", "tenho um projeto"                                            |
| Revisão              | sistema          | "[validar: o que validar]"                                                                                        |
| Pendência de print   | sistema          | "[a confirmar: print: <arquivo>]"                                                                                 |
| Achado da chave      | mistério         | "Algo que abre uma porta, perto do rastro" → "Chave de latão, achado"                                             |

3. **Título e subtítulo:** ver a grade.
4. **Ações e rótulos:** "Ampliar imagem: …", "Fechar", "Copiar código", "Código copiado", links do sumário (títulos das seções), "Kasb Health", "tenho uma vaga", "tenho um projeto".
5. **Ajuda e placeholders:** não há campos.
6. **Termos novos ou dúvidas de glossário:** "caso" já existe; "guia", "lote", "glosa", "repasse", "faturista" e "operadora" são termos do domínio do cliente e vêm do copy (explicados no próprio texto de contexto).
7. **Estados:** ver a tabela.
8. **Erros previstos:** falha ao copiar (ver `code-block.md`).
9. **Confirmações e sucesso:** "Código copiado" (região viva, polida).
10. **Números e datas:** os números do copy ("6.560", "9 a 24 ms") são texto de Victor, citados literalmente do conteúdo (D-1206); contagens ao vivo não existem aqui.
11. **Apoio de IA e dados reais evitados:** os prints vêm de um build com Supabase fictício e dados inventados (nomes de pessoas e valores fictícios). Fica de fora a `01-landing` (foto de pessoa do Unsplash). A parte de extrato e repasse do dashboard usa dados de mock: a imagem entra, mas nenhum texto a apresenta como integrada (D-1311). Nenhum texto novo foi escrito: o conteúdo é o do copy, e os `alt` descrevem a tela.
12. **Exceções pedidas:** nenhuma.

### Critérios de aceite

- [ ] CA-1 O conteúdo do caso é o do copy: um teste compara cada trecho de texto com `docs/copy/case-nexuscoop.md` (insensível à primeira letra) e as seções saem na ordem do copy.
- [ ] CA-2 `/projetos/nexuscoop` tem um `h1`, um `h2` por seção na ordem do copy e axe sem violações nas 8 combinações de estação e modo (e2e).
- [ ] CA-3 Cada figura tem a legenda do copy e um `alt` descritivo (não é o nome do arquivo); só a imagem principal tem prioridade e todas declaram largura e altura (teste de conteúdo e e2e de CLS 0).
- [ ] CA-4 Os itens `[validar]` estão como `review(...)` no conteúdo, aparecem com a marca visível e o trecho de código do cliente não é renderizado (teste de componente e e2e).
- [ ] CA-5 `pnpm release:check` lista cada revisão (cinco) e o link para `/projetos/kasb-health`, e continua reprovando enquanto existirem.
- [ ] CA-6 Os cinco números usam o `Stat` com fonte ou método, exatamente como pedido.
- [ ] CA-7 Teclado de ponta a ponta: sumário, ampliar e fechar figura, copiar código (quando liberado) e CTAs (e2e).
- [ ] CA-8 Metadados: título e descrição em pt-BR, imagem Open Graph gerada pelo `next/og` sem print do cliente, entrada no sitemap (teste de unidade e build).
- [ ] CA-9 A Home usa a descrição nova do Nexuscoop e os quatro números novos, sem "8s → quase instantâneo" nem "400+" (teste de conteúdo; D-1303).
- [ ] CA-10 Capturas do caso em 390×844 e 1366×768, em primavera clara e escura, em `docs/screenshots/caso/`.
- [ ] CA-11 Lighthouse mobile nos dois métodos (simulado e devtools) e CLS 0 com as imagens, registrados no relatório.

## Plan

1. **Conteúdo:** `src/content/projects/` (lista, tipos, `nexuscoop.ts`), `review()` ao lado de `pending()`, `release:check` listando revisões.
2. **Componentes** (`src/components/ui/`): `review-mark`, `callout`, `code-block` (servidor, `shiki`), `case-figure` (`CaseFigure` e `CaseFigureGroup`), `case-toc`, `case-header`, `case-footer`. `Dialog` ganha o tamanho `xl`; `ImageFrame` passa a usar `next/image` (D-1309).
3. **Molde:** `src/components/case/` com `CasePage` (compõe tudo a partir de um `ProjectCase`) e o renderizador de blocos. Uma página de caso nova é um arquivo de conteúdo mais `src/app/projetos/<slug>/page.tsx` de poucas linhas.
4. **Prints:** `public/projetos/nexuscoop/*.webp` (largura 1920 no desktop e 780 no celular, nomes em inglês), servidos por `next/image` com AVIF e WebP.
5. **Metadados:** `metadata` da página, `opengraph-image.tsx` do caso (compartilha com a imagem da Home o desenho em `src/lib/og/`), sitemap.
6. **Vitrine:** `/sistema/caso` com cada componente em todos os estados.
7. **Riscos:** (a) prints longos: a moldura corta em 16:10 e o diálogo mostra inteiro, rolando; (b) cor do realce de sintaxe precisa de contraste calculado nas 8 combinações: só tokens já validados, pares novos no `tokens:build`; (c) `shiki` é dependência nova (D-1307); (d) as marcas de revisão nunca podem ir para produção: `release:check` as bloqueia.

## Tarefas

- [x] Ficha
- [ ] Conteúdo tipado e `review()`
- [ ] Componentes (cada um com teste)
- [ ] Molde e página `/projetos/nexuscoop`
- [ ] Prints, metadados, sitemap
- [ ] Seção na vitrine
- [ ] QA (axe, Lighthouse, CLS, teclado, capturas) e relatório
