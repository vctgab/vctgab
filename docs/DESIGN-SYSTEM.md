# Design system

Caderno de campo desenhado à mão para o portfólio de Victor Gabriel. Este documento explica os princípios, onde mora cada token e como criar uma estação ou um componente sem quebrar as regras. A vitrine viva está em `/sistema`.

## Princípios

1. **Irregular, nunca quebrado.** Contornos, fitas, furos e posições são tortos de propósito. Texto, área de toque e contraste nunca são: o texto fica em fluxo normal dentro de padding seguro, a área clicável é o retângulo do elemento e todo par de cor tem contraste calculado.
2. **Determinístico.** Toda forma vem do motor com uma seed. Mesma seed, mesmo contorno, no servidor e no navegador. `Math.random` é proibido.
3. **Geometria, não filtro.** A irregularidade vem de pontos deslocados (SVG vetorial ou `border-radius`), nunca de `feDisplacementMap`. Bordas sempre nítidas, em qualquer densidade de tela.
4. **Tokens semânticos.** Componentes só usam nomes como `primary-fill` ou `surface-raised`. Passo cru de escala e cor literal ficam nos arquivos de tokens.
5. **Movimento com equivalente estático.** Estados mudam em até 200 ms; o decorativo pode durar mais e para com `prefers-reduced-motion`.
6. **Texto em pt-BR com voz definida.** Voz de sistema em erros e formulários; humor leve só na camada de mistério (achados, terminal, anotações). Regras em `docs/RULES.md`.

## Onde mora cada coisa

| O quê                                                                                  | Onde                                                                                |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Escalas, neutros, mapeamento semântico padrão, tipografia, sombras, movimento, camadas | `src/styles/tokens.css`                                                             |
| Sementes e ajustes de cada tema                                                        | `src/styles/themes.css`                                                             |
| Exposição ao Tailwind (`@theme inline`), animações                                     | `src/app/globals.css`                                                               |
| Elementos, foco, movimento reduzido, alto contraste                                    | `src/styles/base.css`                                                               |
| Pares obrigatórios de contraste                                                        | `src/lib/color/pairs.ts`                                                            |
| Validação e relatório (`pnpm tokens:build`)                                            | `scripts/tokens-build.ts` → `src/styles/tokens.generated.json` e `docs/CONTRAST.md` |
| Motor de formas                                                                        | `src/lib/shapes`                                                                    |
| Formatação de números e datas                                                          | `src/lib/format`                                                                    |
| Tema no cliente (script sem flash, store, provider)                                    | `src/lib/theme`                                                                     |
| Componentes                                                                            | `src/components/ui/<componente>/`                                                   |
| Cabeçalho, rodapé, terminal                                                            | `src/components/layout/`                                                            |
| Hero e cena do rodapé                                                                  | `src/components/hero/`, `src/components/footer-scene/`                              |
| Fichas de componente (SDD)                                                             | `docs/specs/`                                                                       |

## Tokens

### Cor

Cada escala tem 11 passos (50 a 950) gerados por `color-mix` em sRGB a partir de uma semente: 50 é 92% de branco, 500 é a semente e 950 é 78% de preto. Escalas: `primary`, `secondary-1`, `secondary-2`, `success`, `warning`, `danger`, mais 12 neutros com 3% a 6% da primária.

Os componentes usam só os tokens semânticos, por exemplo:

- superfícies: `surface-base`, `surface-raised`, `surface-sunken`, `surface-hover`, `surface-active`
- tinta: `ink`, `ink-muted`, `ink-subtle`, `ink-disabled`, `stroke`, `border`, `border-strong`
- primária: `primary-fill` (`-hover`, `-active`), `on-primary`, `primary-text` (`-hover`), `primary-soft` (`-hover`), `primary-decor`, `focus-ring`
- secundárias e estados: `secondary-1-*`, `secondary-2-*`, `success-*`, `warning-*`, `danger-*`
- decoração: `shadow-ink`, `shadow-soft`, `tape`, `hatch-*`, `hole*`, `footer-*`, `hero-*`

Regras do rosa: preenchimento com texto branco no passo 600 (hover 700, ativo 800); texto em primária no 700; passo 500 só para decoração, títulos de 24 px ou mais e anel de foco.

### Tipografia

Fraunces (títulos, `SOFT` fixo em 100 no arquivo, tamanho ótico automático, sem `WONK`), DM Sans (corpo e interface), JetBrains Mono (rótulos e terminal), Caveat (anotações, mínimo 20 px) e Patrick Hand (etiquetas e botões). Escala fluida: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body-lg`, `text-body`, `text-sm`, `text-label`, `text-hand`, `text-marker`.

### Espaço, sombra, movimento e camadas

Espaçamento em base de 4 px (`p-4` = 16 px). Sombras duras sem desfoque: `shadow-sm` (2 px), `shadow-md` (4 px), `shadow-lg` (6 px). Durações: `--duration-instant` (120 ms), `--duration-state` (200 ms), `--duration-slow` (320 ms), `--duration-scene` (600 ms). Easing `ease-hand` (leve overshoot) e `ease-out`. Camadas: `--z-below` a `--z-skip`. Não existe token de raio: o arredondamento vem do motor.

## Motor de formas

`generateShape({ kind, seed, bucket, irregularity, points, rotation })` devolve o caminho normalizado (0 a 1), os pontos, o `border-radius` de 8 valores, a rotação (−1 a 1) e o desalinhamento em px. Tipos: `blob`, `wobblyRect`, `pill`, `tornEdge`, `handLine`, `hole`. O componente `Shape` desenha até 3 camadas SVG (sombra, preenchimento, contorno) e `shapeHostProps` dá ao hospedeiro o `border-radius` da mesma seed, que faz o anel de foco seguir o contorno. Os estados mudam variáveis CSS no hospedeiro (`--shape-fill`, `--shape-stroke`, `--shape-shadow-x/y`, `--shape-dash`). Detalhes em `docs/specs/shape-engine.md`; playground em `/sistema/formas`.

## Temas: estação e modo

O tema tem dois eixos independentes (`docs/specs/themes-seasons.md`): a **estação** (`data-season`: `primavera`, `verao`, `outono`, `inverno`) e o **modo** (`data-mode`: `claro`, `escuro`), os dois no `<html>`. São 8 combinações, de id `estacao-modo` (por exemplo `verao-escuro`).

- **Estação** decide as sementes de cor, a cena do rodapé, a paleta do hero e os dois parâmetros do motor de formas (energia e rotação). Primavera (rosa `#EE2476`, o padrão), verão (verde `#12924E`), outono (laranja `#C5531F`) e inverno (azul `#3B7EA1`).
- **Modo** decide só a polaridade. O claro é o mapeamento base de `tokens.css`; o escuro é um bloco único, `[data-mode="escuro"]` em `themes.css`, derivado das sementes de cada estação: superfícies quase pretas com cerca de 8% da primária, interativos no passo 400, texto de primária no 300, `on-primary` em tinta escura e sombra própria.
- **Tema inicial:** a estação do calendário brasileiro (hemisfério sul) em `America/Sao_Paulo` (primavera de 22/09 a 20/12, verão de 21/12 a 19/03, outono de 20/03 a 20/06, inverno de 21/06 a 21/09) e o modo de `prefers-color-scheme`, os dois calculados no script do `<head>` antes da primeira pintura. A escolha manual de cada eixo prevalece e fica em `vg-estacao` e `vg-modo`; o seletor não tem opção "Automática" nem "Do sistema": quem não escolheu vê marcada a combinação que o calendário e o sistema deram (D-1116). O valor antigo `vg-tema` é migrado e apagado.
- **Elementos aninhados** (a vitrine mostra as 8 combinações lado a lado) sempre levam `data-season` e `data-mode` juntos, e recalculam escalas e tokens a partir das próprias sementes.

## Como criar uma estação

1. Copie um bloco `[data-season="…"]` de `src/styles/themes.css` e troque o nome.
2. Defina `--theme-label`, `--theme-description`, as sementes (`--seed-primary`, `--seed-secondary-1`, `--seed-secondary-2`, `--seed-success`, `--seed-warning`, `--seed-danger`, `--seed-tree` para as árvores do rodapé), `--shape-energy` e `--shape-rotation-max` (abaixo de 1,5). Se a secundária 2 for clara, siga o ajuste do âmbar (preenchimento no 400, tinta escura, texto no 800).
3. O modo escuro vem de graça do bloco `[data-mode="escuro"]`. Só se uma combinação reprovar, ajuste-a em `[data-season="…"][data-mode="escuro"]` (o outono faz isso com o vinho).
4. Rode `pnpm tokens:build`. Ele valida a matriz nas duas polaridades e falha se algum par de contraste reprovar, se o perigo ficar a menos de 12° de matiz da primária ou se o sucesso ficar a menos de 25°; ajuste as sementes até passar e registre em `docs/DECISIONS.md`.
5. Acrescente a cena do rodapé em `src/components/footer-scene/scenes.ts`. O modo escuro leva a mesma cena à noite (lua e estrelas) sem desenho novo.

Nenhum componente muda. A estação aparece sozinha no ThemeSwitcher, na vitrine e no script sem flash, porque todos leem a lista gerada pelo build.

## Como criar um componente

1. **Ficha primeiro.** Copie `docs/specs/_TEMPLATE.md` para `docs/specs/<nome-em-ingles>.md` e preencha Spec (propósito, anatomia, variantes, estados, teclado, ARIA, irregularidade, alto contraste e movimento, Ficha de Texto com a Grade de Tom e critérios de aceite), Plan e Tarefas.
2. **Pasta em inglês.** `src/components/ui/<nome>/` com `<nome>.tsx`, `<nome>.test.tsx` e `index.ts` (e `<nome>.variants.ts` se houver variantes com `cva`).
3. **Copie o padrão do Button.** Hover um passo mais escuro, ativo dois, foco pelo `outline` com o `border-radius` do motor, desabilitado com `disabledReason` obrigatório no tipo, alvo de 44 px.
4. **Forma.** Use `Shape` e `shapeHostProps`; padding maior que a amplitude do bucket; até 3 camadas SVG; nenhum filtro.
5. **Texto.** Verbo + objeto nos botões, erro dizendo o que informar, números por `@/lib/format`, dados fictícios marcados.
6. **Testes.** Um por critério de aceite, mais jest-axe. Registre a pasta no mapa de fichas de `tests/unit/rules.test.ts`.
7. **Vitrine.** Acrescente a seção em `/sistema`.

## Qualidade

- `pnpm check`: lint, tipos, testes unitários e build (com `tokens:build`).
- `pnpm test:e2e`: axe nas páginas da vitrine nas 8 combinações (Chromium; WebKit e Firefox em primavera clara e escura) e na Home nas 8 nos três motores, console limpo, teclado, alvo de toque e movimento reduzido.
- `pnpm screenshots`: capturas em `docs/screenshots/` (Home em 390×844 e 1366×768 nas 8 combinações, rodapé de cada uma, vitrine de temas e recortes 2x das bordas numa combinação clara e numa escura).
- `node tests/tools/axe-audit.mjs`: auditoria axe com repetição, relatório em `docs/qa/axe-report.json`.
