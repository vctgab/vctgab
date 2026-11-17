# Header, Footer, Logo e ThemeSwitcher

## Spec

### Propósito

- **Header:** identificação e navegação global: logo, Projetos, Sobre, Contato, seletor de tema (botão com ícone `tema` que abre Popover com o seletor de estação e de modo), CTA "Vamos conversar" e link para pular ao conteúdo. No mobile, menu em Drawer. Fase 2: o botão `cmd` sai até o terminal existir; o CTA vai ao WhatsApp ou, com o número pendente, a `#contato` (`/#contato` fora da Home).
- **Footer:** logo, "Victor Gabriel © 2026", links, chip de achados e a cena de árvores (etapa 5).
- **Logo:** pinheiro desenhado num círculo irregular + nome em Fraunces.
- **ThemeSwitcher:** escolher a estação (4 amostras desenhadas) e o modo (claro e escuro). Modelo e regras em `themes-seasons.md`.
- **PaginaProvisoria:** estado indisponível das rotas Projetos, Sobre e Contato até as páginas reais existirem: diz o que falta e oferece um caminho, para os links globais nunca darem 404.

**Quando não usar:** o Header não leva ações de página (essas ficam no conteúdo).

### Anatomia

Header: link "Pular para o conteúdo" (primeiro focável, visível no foco) → Logo → `nav` "Principal" com `LinkText` → ThemeSwitcher compacto (Popover aberto por botão de ícone, `aria-label` "Escolher tema") → CTA. (O botão `cmd` volta quando o terminal existir.) Mobile (< 768 px): Logo + botão "Abrir menu" (ícone) → Drawer com os mesmos itens.

Footer: faixa `footer-bg` com borda de cima rasgada (`clip-path` do motor) → Logo invertido → texto de direitos → `nav` "Rodapé" → slot `achados` → slot `scene`.

ThemeSwitcher: `radiogroup` "Estação" com uma amostra por estação; cada amostra é um `blob` pintado com as cores da própria estação no modo atual (`data-season` e `data-mode` locais) e o nome visível. Abaixo, `SegmentedControl` "Modo" (Claro e Escuro).

### Variantes

| Componente    | Props                                                       |
| ------------- | ----------------------------------------------------------- |
| Header        | `current` (rota ativa), `onOpenTerminal` (etapa 4)          |
| Footer        | `achados`, `scene` (slots)                                  |
| ThemeSwitcher | `layout`: `grid` (vitrine) ou `compact` (Popover do Header) |

### Estados

Links: padrão do LinkText; rota atual com `aria-current="page"` e traço sempre mais grosso. ThemeSwitcher: amostra marcada com contorno 3 px e ícone `check` (segundo indicador); hover/foco/ativo do padrão. Desabilitado, carregando e erro não se aplicam.

### Teclado

Tab percorre na ordem visual. ThemeSwitcher: setas mudam de estação (radiogroup) e de modo (segmentado). Drawer: Esc fecha e devolve o foco a "Abrir menu".

### ARIA e nome acessível

`header` (banner), `nav` com `aria-label` ("Principal", "Rodapé"), `footer` (contentinfo). Logo: link "Victor Gabriel, início". ThemeSwitcher: `radiogroup` "Estação", cada `radio` com o nome da estação; grupo "Modo" com os três segmentos.

### Irregularidade

Logo: círculo `blob` com seed fixa. Footer: borda rasgada `tornEdge` em `clip-path`. Amostras de estação: `blob` com seed `estacao:<id>`.

### Alto contraste e movimento

`forced-colors`: amostras ganham borda real e o nome do tema continua visível. Movimento reduzido: o Drawer não desliza.

### Ficha de Texto

1. Quem lê: todo visitante.
2. Grade de Tom: boas-vindas, acolhedor com entusiasmo baixo; CTA de contato, objetivo e motivador.
3. Título: não se aplica.
4. Rótulos: "Projetos", "Sobre", "Contato", "Vamos conversar", "Abrir o terminal", "Abrir menu", "Fechar menu", "Pular para o conteúdo", "Escolher tema".
5. Ajuda: descrição de cada estação no ThemeSwitcher em grade.
6. Termos: "tema", "terminal".
7. Estados: não exibe dados.
8. Erros: não se aplica.
9. Sucesso: não se aplica (a troca de tema é visível).
10. Números: o ano do direito autoral é texto fixo do conteúdo.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 "Pular para o conteúdo" é o primeiro focável e aponta para `#conteudo`.
- [x] CA-2 `nav` "Principal" com os três links e o atual com `aria-current`.
- [x] CA-3 No mobile, "Abrir menu" abre o Drawer com os mesmos links; Esc fecha.
- [x] CA-4 ThemeSwitcher tem um `radiogroup` "Estação" e um grupo "Modo"; escolher grava a preferência e muda `data-season` ou `data-mode` (CA-8 de `themes-seasons.md`).
- [x] CA-5 Footer com `nav` "Rodapé", direitos e slots.
- [x] CA-6 jest-axe sem violações.
- [x] CA-7 Projetos, Sobre e Contato respondem 200 com a página provisória (sem 404 no prefetch).
- [x] CA-8 (Home v2) Cabeçalho sem CTA: links "projetos", "sobre", "contato", contador "achados: N de 7" e botão "estação: <nome>" com o nome da estação ativa vindo do CSS sobre `data-season` (certo antes da hidratação). No mobile, links no Drawer; contador e botão de estação continuam no cabeçalho.
- [x] CA-9 (Home v2) Rodapé com "Desenhado e codado por mim, em Teresina.", "Achados: N de 7. Tem coisa escondida por aqui." (N ao vivo), links projetos, sobre, contato, GitHub (nova aba), LinkedIn e baixar CV (pendentes, como texto com `[a confirmar: …]`) e a assinatura "© 2026 Victor Barros" com a pendência do sobrenome.

## Plan

`src/components/ui/logo/*`, `src/components/layout/{header,footer}/*`, `src/components/ui/theme-switcher/*`. Os links de Projetos, Sobre e Contato apontam para rotas futuras; até lá, a vitrine usa âncoras.

### Fase 2

- Botão de tema com ícone `tema`; sem `cmd`; CTA por `talkHref`; menu que fecha indo para uma âncora não devolve o foco ao botão (a página não volta ao topo). Testes em `tests/e2e/home.spec.ts`.

### Home v2

- Textos em `src/content/home.ts` (`header`, `footer`). Sem CTA no cabeçalho (D-1203). Nome da estação: um `<span data-season-only>` por estação, com a regra de exibição gerada a partir de `SEASONS` (uma estação nova não pede CSS à mão). No mobile o nome fica só para leitores de tela e o ícone da estação aparece.
- O chip fixo `dock` sai do layout (D-1204).

## Tarefas

- [x] Ficha
- [x] Componentes
- [x] Testes
- [ ] Vitrine
