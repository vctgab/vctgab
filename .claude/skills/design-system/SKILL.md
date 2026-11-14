---
name: design-system
description: Use sempre que criar ou editar UI no portfólio vctgab — componente, página, seção, formulário, diálogo, ficha, qualquer JSX com classes Tailwind ou qualquer texto visível. Carrega a linguagem visual (caderno de campo desenhado à mão), o catálogo de componentes, os tokens, o motor de formas e as regras de texto e contraste, para a UI nova seguir a vitrine /sistema em vez de inventar markup ou estilo.
---

# Design system — vctgab

Caderno de campo desenhado à mão. A vitrine viva está em `/sistema`; os detalhes, em `docs/DESIGN-SYSTEM.md`; as regras com ID, em `docs/RULES.md`. **Antes de escrever markup, procure o componente que já existe** — a regra de ouro é nunca recriar em JSX solto algo que já é componente.

## 0. Antes de tudo

1. Leia `docs/RULES.md` e preencha a Ficha de Texto da ficha do componente (`docs/specs/`). Sem ficha, sem componente (PR-01).
2. Liste `src/components/ui/` antes de criar algo novo.
3. Fato ausente vira `[a confirmar: o que falta]`; nunca invente número, cliente ou depoimento.

## 1. Princípios

- **Irregular, nunca quebrado.** Contornos tortos pelo motor (`src/lib/shapes`); texto em fluxo normal com padding maior que a amplitude da forma; área clicável retangular de 44 px ou mais; contraste calculado.
- **Sem filtro em interação e texto.** Proibido `feDisplacementMap`; `feTurbulence` só no grão de papel decorativo. Bordas sempre vetoriais.
- **Sem raio, hex ou espaçamento solto.** Não existe `rounded-*`: o arredondamento vem do `border-radius` gerado pelo motor. Nada de hex fora de `src/styles/tokens.css`, `src/styles/themes.css` e `src/lib/color`. Nada de `p-[13px]`. A varredura `tests/unit/rules.test.ts` falha se aparecer.
- **Cor só por token semântico.** `surface-*`, `ink*`, `stroke`, `border*`, `primary-fill` (`-hover`, `-active`), `on-primary`, `primary-text`, `primary-soft`, `primary-decor`, `focus-ring`, `secondary-1-*`, `secondary-2-*`, `success-*`, `warning-*`, `danger-*`. Nunca passo cru (`primary-500`) em componente (CR-01).
- **Rosa.** Preenchimento com texto branco no passo 600 (hover 700, ativo 800); texto em primária no 700; passo 500 só decoração, títulos de 24 px ou mais e anel de foco.
- **Padrão de estados (copiar do Button).** Hover um passo mais escuro, ativo dois, foco pelo `outline` que segue o `border-radius` do motor, desabilitado com `disabledReason` obrigatório no tipo e texto visível, pressionar desce 2 px e colapsa a sombra.
- **Cor nunca é o único canal.** Erro com ícone e texto; seleção com marca; link com sublinhado.
- **Movimento.** Estados até 200 ms (`--duration-state`), easing `ease-hand`; decorativo pode durar mais e sempre para com `prefers-reduced-motion`. Durações só por token.
- **Tipografia.** Fraunces (títulos, `font-soft`), DM Sans (corpo), JetBrains Mono (rótulos), Caveat (anotações, mínimo 20 px), Patrick Hand (botões e etiquetas). Escala: `text-display`, `text-h1`…`text-h3`, `text-body-lg`, `text-body`, `text-sm`, `text-label`, `text-hand`, `text-marker`. Só a primeira letra maiúscula; nunca `uppercase`.
- **Ícones.** Componente `Icon`, decorativo (`decorative`) ou nomeado (`label`); um significado, um ícone (quadro `ACAO_ICONE`).

## 2. Catálogo (`src/components/ui/`)

| Componente                                                              | Quando usar                                                                       |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Shape`, `shapeHostProps`                                               | Camadas desenhadas atrás de qualquer hospedeiro (sombra, preenchimento, contorno) |
| `Button`                                                                | Toda ação; `asChild` para link com cara de botão                                  |
| `LinkText`                                                              | Navegação (`standalone` com traço de pincel; `inline` em parágrafos)              |
| `Eyebrow`, `Section`, `Container`                                       | Cabeçalho de seção e largura de página                                            |
| `Tag`, `Chip`                                                           | Etiqueta estática; filtro alternável (`aria-pressed`)                             |
| `Ficha` (`card/`)                                                       | Card de papel, com fita, furos e versão clicável de link único                    |
| `TextField`, `Textarea`, `Select`, `field/`                             | Formulários com rótulo, ajuda, erro que diz o que informar e contador             |
| `Checkbox`, `RadioGroup`, `Switch`, `SegmentedControl`                  | Controles de escolha                                                              |
| `Dialog`, `Drawer`, `Tooltip`, `Popover`, `Toast`                       | Sobreposições; toast só para sucesso e informação                                 |
| `Divider`, `ProgressHatch`, `Polaroid`, `Stat`, `Skeleton`, `Spinner`   | Visuais P1; `Stat` exige `method`                                                 |
| `Quote`, `Marquee`, `Reveal`, `LiveClock`, `Accordion`, `TerminalShell` | Conteúdo e movimento                                                              |
| `achados/` (`finds/`)                                                   | `AchadosProvider`, `Achavel`, `AchadosChip`, caderno e aviso da página secreta    |
| `Logo`, `ThemeSwitcher`                                                 | Marca e escolha de tema                                                           |

Layout em `src/components/layout/` (Header, Footer, terminal, página provisória). Hero e cena do rodapé em `src/components/hero/` e `src/components/footer-scene/`.

## 3. Componente novo

Ficha em `docs/specs/<nome-em-ingles>.md`, pasta `src/components/ui/<nome>/` com `<nome>.tsx`, `<nome>.test.tsx` (com jest-axe), `index.ts` e, se houver variantes, `<nome>.variants.ts` com `cva`. Classes por `cn()` de `@/lib/cn`. Registrar a pasta no mapa de fichas de `tests/unit/rules.test.ts` e criar a seção na vitrine.

## 4. Antes de terminar

1. `pnpm exec eslint <arquivos>`, `pnpm typecheck` e `pnpm exec vitest related <arquivos> --run`.
2. Toda cor, sombra, espaçamento e duração vêm de token?
3. Foco visível, hover, ativo, desabilitado com motivo e contraste conferidos?
4. Texto no padrão da Grade de Tom (voz de sistema em erros e formulários)?
5. Seção da vitrine atualizada e capturas olhadas?
