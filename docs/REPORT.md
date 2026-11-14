# Relatório da fase 1: design system e vitrine

## O que foi construído

- **Ambiente:** Next.js 16.4 (App Router, Cache Components), React 19, TypeScript estrito, Tailwind v4 CSS-first, Radix só para comportamento, pnpm, ESLint com jsx-a11y, Prettier, Vitest com Testing Library e jest-axe, Playwright com axe.
- **Tokens e temas:** escalas de 11 passos por `color-mix` em sRGB, neutros com a primária, tokens semânticos e quatro temas (ipê, noturno, outono, inverno) por `data-theme`, sem flash. `pnpm tokens:build` avalia o próprio CSS e calcula 304 pares de contraste (todos aprovados); falha o build se algum reprovar.
- **Motor de formas** (`src/lib/shapes`): determinístico (PRNG com seed e trigonometria própria), seis tipos, `Shape` com até 3 camadas SVG e `border-radius` da mesma seed para o anel de foco, `useShapeMorph`, playground em `/sistema/formas`.
- **Componentes P0:** Icon, Spinner, Button, LinkText, Eyebrow, Section, Tag, Chip, Ficha, campos (TextField, Textarea, Select), Checkbox, RadioGroup, Switch, SegmentedControl, Dialog e Drawer, Tooltip, Popover, Toast, Logo, ThemeSwitcher, Header e Footer.
- **Componentes P1:** Divider, ProgressHatch, Polaroid, Stat (método obrigatório), Skeleton, Quote (cinco estados), Marquee, Reveal, LiveClock, Accordion, TerminalShell e o sistema de achados (provider, Achavel, chip, caderno e aviso da página secreta).
- **Hero dinâmico** em `/sistema/hero` e **cena do rodapé** com árvores por tema.
- **Vitrine** `/sistema`: visão geral, cores (escalas, tokens e matriz de contraste do build), tipografia, espaço e movimento, formas, componentes, conteúdo e movimento, achados, hero, temas lado a lado e acessibilidade.
- **Documentação:** `CLAUDE.md`, `docs/DESIGN-SYSTEM.md`, `docs/RULES.md` (regras com ID e teste), `docs/DECISIONS.md`, `docs/GLOSSARY.md`, `docs/EXCEPTIONS.md`, `docs/CONTRAST.md` (gerado), 20 fichas em `docs/specs/` e o histórico em `docs/specs/HISTORY.md`.
- **Pasta `.claude`:** skills e agentes adaptados ao projeto (SDD com fichas, design system, proteção de dados, revisão de PR).

## Como rodar

```bash
corepack enable pnpm
pnpm install
pnpm dev                 # http://localhost:3000/sistema
pnpm check               # lint, tipos, testes e build
pnpm build && pnpm start --port 3100   # servidor de produção para o e2e
pnpm test:e2e            # axe nos 4 temas, console, teclado, alvo, movimento
pnpm screenshots         # capturas em docs/screenshots/
node tests/tools/axe-audit.mjs          # auditoria axe com repetição
node tests/tools/lighthouse.mjs /sistema devtools
```

Reinicie o servidor de produção depois de cada build.

## Evidências

| Porta                                                | Resultado                                                                                                                     |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                                         | lint sem avisos, tipos, 274 testes e build aprovados                                                                          |
| `tokens:build`                                       | 304 pares de contraste aprovados nos 4 temas                                                                                  |
| axe                                                  | 44 de 44 combinações de página e tema sem violação (`docs/qa/axe-report.json`)                                                |
| Lighthouse mobile em `/sistema` (limitação aplicada) | desempenho 90 a 92, acessibilidade 98, CLS 0, LCP perto de 2 s                                                                |
| Capturas                                             | 390×844, 768×1024 e 1366×768 nos 4 temas, mais recortes 2x a 400% de botão, chip e ficha sem serrilhado (`docs/screenshots/`) |

## Decisões e desvios do briefing

- **Node 24.21 no `.nvmrc`** em vez do Node 26 (LTS atual): era o que estava instalado e verificado nesta máquina (D-001).
- **Texto em primária no passo 700** (não 600): com o 600, reprovava sobre `surface-sunken` no ipê e no inverno (D-104).
- **Passo 300 do rosa é `#F792BB`**, não `#F692BA`: arredondamento de canais exatos em ,5 (D-105). Os outros dez batem.
- **Noturno:** hover e ativo ficam mais claros, não mais escuros, para não perder contraste com a tinta escura (D-106).
- **Energia do tema** muda deslocamentos, sombra e rotação por CSS; a geometria dos componentes não depende do tema, para não haver risco de hidratação. Hero e rodapé usam a energia também na geometria (D-203).
- **Nomes de arquivo em inglês** a pedido de Victor; segmentos de rota em português (`/sistema`, `/projetos`) e nomes de componentes do briefing (`Ficha`, `Achavel`) mantidos (D-501 a D-503).
- **Fraunces sem itálico** e fontes sem preload, exceto DM Sans e Patrick Hand, por desempenho (D-113, D-710).
- **Rotas provisórias** `/projetos`, `/sobre` e `/contato` com estado indisponível, para os links globais não darem 404 (D-310).
- **Lighthouse com limitação aplicada** (`devtools`): a simulação padrão inflava o LCP para 4 s num servidor local (D-709).
- **E2E com novas tentativas** e ferramentas de auditoria com repetição, por instabilidade da máquina (D-701).

## Sementes ajustadas para passar no contraste

| Tema   | Semente | Antes              | Depois    | Motivo                                                      |
| ------ | ------- | ------------------ | --------- | ----------------------------------------------------------- |
| outono | perigo  | `#C93A1F` (Tijolo) | `#B81D2E` | A 9,27° de matiz do laranja da primária; agora acima de 12° |

As demais sementes sugeridas passaram sem ajuste; os outros acertos foram de mapeamento (D-104, D-106, D-107).

## Limitações conhecidas

- **Máquina instável:** quedas intermitentes do Node (ESLint, `tsc`, Vitest, servidor do Next) e corrupção de mensagens entre Playwright e Chromium, inclusive um bit trocado (`thys` no lugar de `this`). O padrão sugere defeito de memória. Vale rodar o diagnóstico de memória do Windows e atualizar o Node (D-701, D-511).
- **Só Chromium testado.** Firefox e Safari não foram verificados; o sistema usa `color-mix`, `round()`, `:has()` e `hyphenate-limit-chars`.
- **Lighthouse medido só em `/sistema`.** A página de cores é pesada, porque traz as tabelas dos 4 temas.
- **Seis achados** ainda não têm lugar: só a pinha está escondida (no hero); os outros dependem das páginas reais.
- **Terminal** só com a moldura; os comandos ficam para depois.
- **`origin/main`** ainda tem o commit `9bcd76a` com assinatura; a limpeza remota exige `git push --force-with-lease`, que depende de autorização.
- **A confirmar:** domínio do site, mês da agenda, depoimentos, cargos, fotos, e-mail, WhatsApp, LinkedIn e o conteúdo da página secreta.

## Próximos passos

1. Páginas reais (Home, Projetos, caso Nexuscoop, Sobre, Contato), compondo os componentes.
2. Comandos do terminal `cmd`.
3. Página secreta liberada em 7 de 7 e os seis achados restantes.
4. Tema Floresta: um bloco em `themes.css` e uma cena em `scenes.ts`.
5. Testes em Firefox e WebKit; Lighthouse nas páginas reais.
6. Node 26 LTS e diagnóstico da memória desta máquina.
