# Temas: quatro estações, cada uma clara e escura

> Ficha de mudança de modelo. Substitui os temas `ipe`, `noturno`, `outono` e `inverno` por dois eixos independentes. Escrita antes do código.

## Spec

### Propósito

O tema deixa de ser uma lista de quatro nomes e passa a ter dois eixos: **estação** (primavera, verão, outono, inverno) e **modo** (claro, escuro). São 8 combinações. A estação decide as sementes de cor, a cena do rodapé, a paleta do hero e os dois parâmetros do motor de formas (energia e rotação). O modo decide só a polaridade: superfícies, tinta e estados. O modo escuro de cada estação deriva das mesmas sementes.

**Quando não usar:** um ajuste de cor de um componente não cria tema; componentes só usam tokens semânticos.

### Modelo

- Dois atributos no `<html>`: `data-season` (`primavera`, `verao`, `outono`, `inverno`) e `data-mode` (`claro`, `escuro`). Valores sem acento, porque viram atributo e armazenamento. Os rótulos ("Verão") ficam no CSS e na interface.
- `color-scheme` e `<meta name="theme-color">` por combinação. A combinação tem id `estacao-modo` (por exemplo `verao-escuro`) nos relatórios, nas capturas e nos testes.
- Os ids `ipe` e `noturno` deixam de existir em código, testes, fichas, vitrine e documentação viva. Os documentos de histórico (relatórios das fases 1 e 2, `DECISIONS.md` anterior a D-1100) mantêm o registro do que foi.
- Aninhamento: um elemento com os dois atributos recalcula escalas e mapeamento a partir das próprias sementes, como o `[data-theme]` fazia. A vitrine usa isso para mostrar as 8 combinações lado a lado.

### Sementes por estação

| Estação   | Primária               | Secundária 1              | Secundária 2         | Sucesso                                | Aviso     | Perigo           |
| --------- | ---------------------- | ------------------------- | -------------------- | -------------------------------------- | --------- | ---------------- |
| primavera | `#EE2476` (antigo ipê) | Pinheiro `#2F6B4A`        | Âmbar `#E3A21A`      | `#2F6B4A`                              | `#E3A21A` | Tijolo `#C93A1F` |
| verão     | `#12924E` (verde)      | Mar `#1D7FB3`             | Sol `#F2B53A`        | a definir (matiz afastada da primária) | `#E3A21A` | Tijolo `#C93A1F` |
| outono    | `#C5531F`              | Oliva `#6B7A2F`           | Vinho `#7A2E4B`      | `#2F6B4A`                              | `#E3A21A` | `#B81D2E`        |
| inverno   | `#3B7EA1`              | Pinheiro nevado `#2F5A4B` | Lilás frio `#6B5B95` | `#2F6B4A`                              | `#E3A21A` | Tijolo `#C93A1F` |

- O rosa `#EE2476` e o verde `#12924E` não mudam. O `#12924E` vale por ter o passo 600 (`#108045`) com 5,0:1 contra branco; o `#00A343` dava 4,2:1.
- As demais sementes podem ser ajustadas para passar no contraste; cada ajuste entra em `DECISIONS.md` com antes e depois.
- **Verão:** sucesso não pode se confundir com a primária verde. A matiz da semente de sucesso fica a pelo menos 25° da matiz da primária (verificação nova no `tokens:build`), e o sucesso continua sempre com ícone e texto, nunca só cor.

### Modo escuro (generalizado do antigo noturno)

Um bloco `[data-mode="escuro"]` serve às quatro estações: superfícies quase pretas com cerca de 8% da primária da estação, interativos no passo 400 (estados ficam mais claros), texto de primária no passo 300, `on-primary` em tinta escura, sombra dura com cor própria para fundo escuro, contorno de campo em foco no passo 50. Ajustes só de uma estação ficam em `[data-season="x"][data-mode="escuro"]`.

### Cena do rodapé

A mesma cena da estação nos dois modos. No escuro, a cena vira noite: as cores `footer-*` escurecem (silhuetas) e entram lua e estrelas, sem duplicar o desenho das árvores. Extras: primavera (ipê florido), verão (copas cheias e sol, que some à noite), outono (copas alaranjadas e folhas), inverno (neve e flocos).

### Tema inicial

1. **Estação**: a escolha manual salva; sem ela, a do calendário brasileiro (hemisfério sul) na data de hoje no fuso `America/Sao_Paulo`: primavera de 22/09 a 20/12, verão de 21/12 a 19/03, outono de 20/03 a 20/06, inverno de 21/06 a 21/09. Calculada no script bloqueante do `<head>`, antes da primeira pintura.
2. **Modo**: a escolha manual salva; sem ela, `prefers-color-scheme` do sistema.
3. Duas chaves de `localStorage`, separadas, sempre em `try/catch`: `vg-estacao` e `vg-modo`. Sem chave, vale o automático (calendário ou sistema). O seletor não oferece "Automática" nem "Do sistema" (D-1116); o store ainda aceita `null` para apagar a chave.
4. Migração de `vg-tema`: `ipe` vira primavera clara, `noturno` vira primavera escura, `outono` e `inverno` viram a estação de mesmo nome no modo claro (eram temas claros). A chave antiga é apagada.

### Seletor de tema (ThemeSwitcher)

Dois controles:

- **Estação:** `radiogroup` "Estação" com 4 amostras desenhadas pelo motor de formas, cada uma pintada com as cores reais da estação no modo atual, sem opção "Automática": a estação em vigor (do calendário ou salva) aparece marcada.
- **Modo:** `SegmentedControl` "Modo" com Claro e Escuro; o modo em vigor aparece marcado.

Teclado completo (setas no radiogroup e no segmentado), estado marcado com ícone além da cor, alvos de 44 px.

### Estados

Cinco estados não se aplicam (não há dados): o seletor é sempre local. Estados do controle: padrão, hover, foco, ativo, marcado, desabilitado (não ocorre). Antes da hidratação o seletor mostra o estado neutro (nada marcado), como o anterior.

### Teclado

| Tecla  | Ação                                                          |
| ------ | ------------------------------------------------------------- |
| Setas  | Movem entre estações (radiogroup) e entre modos (segmentado). |
| Espaço | Marca a estação ou o modo em foco.                            |
| Tab    | Vai do grupo de estações para o de modo.                      |

### ARIA e nome acessível

`radiogroup` "Estação" com `radio` "Primavera", "Verão", "Outono" e "Inverno". Grupo "Modo" com os dois segmentos. Amostras `aria-hidden`; o nome vem do texto.

### Irregularidade

Amostras: `blob` do motor com seed `estacao:<id>`. Cada estação define `--shape-energy` e `--shape-rotation-max` (primavera 1 / 1,2; verão 1,1 / 1,3; outono 1,25 / 1,4; inverno 0,7 / 0,8). O modo não muda a geometria.

### Alto contraste e movimento

`forced-colors`: as amostras ganham borda real e os nomes continuam visíveis. A transição de cor na troca (até 300 ms) não ocorre com `prefers-reduced-motion`.

### Ficha de Texto

1. Quem lê: qualquer visitante, em qualquer página.
2. Linha da Grade de Tom: controle de interface, voz de sistema, sem humor.
3. Título e subtítulo: "Estação" e "Modo" (rótulos dos grupos).
4. Ações e rótulos: "Primavera", "Verão", "Outono", "Inverno", "Claro", "Escuro"; botão do cabeçalho "Escolher tema".
5. Ajuda: descrição curta de cada estação na vitrine.
6. Termos: "tema" passa a significar estação mais modo (ver `docs/GLOSSARY.md`).
7. Estados: não se aplica (controle local).
8. Erros previstos: sem armazenamento, o tema vale até sair da página; nada a mostrar.
9. Confirmações: a própria troca é visível; sem aviso.
10. Números e datas: a regra de estação usa só dia e mês no fuso `America/Sao_Paulo`; nenhuma data é exibida.
11. Apoio de IA e dados reais evitados: nenhum dado de pessoa.
12. Exceções pedidas: nenhuma.

### Critérios de aceite

- [x] CA-1 `data-season` e `data-mode` existem no `<html>` antes da primeira pintura, com `color-scheme` e `theme-color` da combinação. (teste do script e e2e)
- [x] CA-2 A estação inicial segue o calendário brasileiro no fuso `America/Sao_Paulo`, inclusive nos dias de virada e perto da meia-noite. (teste unitário da regra e do script)
- [x] CA-3 O modo inicial segue `prefers-color-scheme`; a escolha manual de estação e de modo prevalece e fica salva em chaves separadas. (teste do store e e2e)
- [x] CA-4 Sem escolha salva, valem o calendário e o sistema, e o seletor mostra marcada a combinação em vigor; `setSeason(null)` e `setMode(null)` apagam a chave (D-1116). (teste do store e de componente)
- [x] CA-5 `vg-tema` antigo migra: `ipe` para primavera clara, `noturno` para primavera escura. (teste do script e do store)
- [x] CA-6 `pnpm tokens:build` valida a matriz de contraste nas 8 combinações e falha se algum par reprovar; sucesso e primária do verão ficam a 25° ou mais. (`tokens:build`, `color.test.ts`)
- [x] CA-7 Os ids `ipe` e `noturno` não aparecem em código nem testes. (varredura em `rules.test.ts`)
- [x] CA-8 O seletor tem `radiogroup` "Estação" (4 estações) e `SegmentedControl` "Modo"; operável só pelo teclado. (teste de componente e e2e)
- [x] CA-9 O rodapé mostra a cena da estação, com lua e estrelas no escuro e o sol só no claro. (teste da regra de visibilidade e captura)
- [x] CA-10 axe sem violação em todas as páginas da vitrine nas 8 combinações (Chromium); Home nas 8 combinações em WebKit e Firefox; demais páginas em primavera clara e escura. (e2e)
- [x] CA-11 A vitrine mostra as 8 combinações lado a lado, com a matriz de contraste de cada uma. (teste da vitrine e captura)
- [x] CA-12 Lighthouse da Home sem piora em relação à fase 2, nos dois métodos. (relatório)

## Plan

**Arquivos.**

- CSS: `src/styles/tokens.css` (seletor base por `data-season` e `data-mode`), `src/styles/themes.css` (4 blocos de estação, 1 bloco de modo escuro, ajustes por estação no escuro).
- Avaliador de cor: `src/lib/color/css-eval.ts` e `report.ts` resolvem a combinação (estação, modo) por especificidade e ordem; `pairs.ts` ganha a distância de matiz de sucesso.
- Script e geração: `scripts/tokens-build.ts` grava `tokens.generated.json` (8 combinações) e `themes.generated.json` (lista enxuta para o cliente) e a matriz em `docs/CONTRAST.md`.
- Runtime: `src/lib/theme/{season,themes,theme-script,theme-store,theme-provider}.ts(x)`. A regra de estação existe em TypeScript (store) e em ES5 dentro do script bloqueante; um teste compara as duas em todos os dias de dois anos e nos instantes de virada.
- Interface: `theme-switcher.tsx` redesenhado; `footer-scene` (cena por estação, extras noturnos); `hero` (paleta por estação); `sistema/temas` e `ThemeOnly` (8 combinações).
- Testes e ferramentas: `tests/e2e/helpers.ts` e specs, `tests/tools/*`, `tests/unit/rules.test.ts`.

**Riscos.**

- O CSS aninhado precisa de `data-season` e `data-mode` juntos para recalcular tudo; a vitrine sempre coloca os dois.
- Duplicação da regra de estação no script e no TypeScript: mitigada por teste de equivalência.
- Verão: sucesso e primária ambos verdes; mitigado pela matiz de sucesso afastada e por ícone mais texto.
- Contraste do modo escuro em estações com primária de matiz fria ou quente: o `tokens:build` acusa; ajustes registrados.
- Máquina instável (D-701): e2e e Lighthouse com repetição.

**Ordem (um commit por etapa).** 1 ficha; 2 tokens, temas e validação de contraste; 3 runtime; 4 seletor; 5 rodapé e hero; 6 vitrine; 7 QA; 8 documentação e relatório.

## Tarefas

- [x] Ficha
- [x] Tokens, temas e validação de contraste nas 8 combinações
- [x] Runtime (regra de estação, script, store, migração)
- [x] ThemeSwitcher com estação e modo
- [x] Rodapé e hero por estação, com noite
- [x] Vitrine com as 8 combinações e a matriz de cada uma
- [x] Testes (um por critério)
- [x] QA: axe, três motores, capturas, Lighthouse
- [x] `docs/REPORT-seasons.md`, `DESIGN-SYSTEM.md`, `CLAUDE.md`
