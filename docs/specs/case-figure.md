# CaseFigure e CaseFigureGroup

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. Decisões: D-1309, D-1310, D-1311.

## Spec

### Propósito

Mostra um print do produto numa moldura desenhada à mão, com legenda e `alt` descritivo, e o amplia num diálogo acessível ao tocar. `CaseFigureGroup` junta várias figuras (desktop e celular, três celulares, dois desktops) com uma legenda só. **Quando não usar:** foto de pessoa (use `Polaroid`); imagem decorativa sem legenda (use `ImageFrame`).

### Anatomia e slots

`<figure>` com: (1) botão que abre o diálogo, contendo a moldura (`browser` ou `phone`) e a imagem `next/image`; (2) `<figcaption>`. Props de `CaseFigure`: `src`, `width`, `height` (declaradas, para CLS 0), `alt`, `caption`, `variant: "browser" | "phone"`, `priority?`, `sizes`, `seed`, e `source?` (nome do arquivo original, só para a pendência). `CaseFigureGroup`: `figures: CaseFigureProps[]` (sem `caption` individual), `caption`. Sem `src`, a moldura mostra a hachura com `[a confirmar: print: <arquivo>]` (via `pending`).

O diálogo (`Dialog` tamanho `xl`) tem título (a legenda), a imagem inteira com rolagem vertical e "Fechar".

### Variantes e tamanhos

| Variante  | Uso                                                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `browser` | print de desktop: barra de navegador com três pontos; proporção do print, no mínimo 16:10 (corta embaixo) |
| `phone`   | print de celular: moldura de aparelho; proporção 390:844 (corta embaixo se o print for mais alto)         |

A proporção exibida é fixa (a altura existe antes da imagem). Prints mais altos que a proporção mostram o topo (`object-top`); o diálogo os mostra inteiros.

### Estados

Padrão; hover (a ficha sobe 2 px e o selo "ampliar" aparece); foco visível (anel desenhado a 3:1 no botão); ativo (desce 2 px); aberto (diálogo). Desabilitado não se aplica. Carregando: a proporção reservada mostra a cor do papel até a imagem chegar. Vazio não se aplica. Erro de imagem: a moldura mantém o tamanho e o `alt` aparece como texto. Indisponível: hachura com a pendência. Com dados: imagem e legenda.

### Teclado

| Tecla                    | Ação                                              |
| ------------------------ | ------------------------------------------------- |
| Tab                      | foca o botão de ampliar                           |
| Enter ou Espaço          | abre o diálogo (foco preso nele)                  |
| Esc                      | fecha o diálogo; o foco volta ao botão de ampliar |
| Setas, PageUp e PageDown | rolam a imagem ampliada                           |

### ARIA e nome acessível

`<figure>` + `<figcaption>`. O botão tem o nome "Ampliar imagem: <alt>" (texto só para leitores de tela antes do `alt`). A imagem tem `alt` escrito por Victor (o que a tela mostra, nunca o nome do arquivo). A moldura e os pontos do navegador são `aria-hidden`. No diálogo: título e descrição ("Imagem ampliada. Role para ver a tela inteira. Esc fecha."). O selo "ampliar" é texto visível e faz parte do nome.

### Irregularidade

`wobblyRect` `lg` para o navegador e `wobblyRect` `md` mais arredondado (irregularidade menor) para o celular; seed por figura (`caso:<id>`); sem rotação (o print nunca fica torto, só o contorno é irregular). Até três camadas SVG (sombra, preenchimento e contorno); os pontos do navegador e o alto-falante são elementos com `border-radius` do motor, sem SVG. Padding de segurança `p-2` e barra de 2,5 rem.

### Alto contraste e movimento

`forced-colors`: camadas somem, a moldura vira borda sólida e o selo fica com borda. Com movimento reduzido, sem subida no hover e sem animação do diálogo (herdado).

### Ficha de Texto

1. Quem lê: devs e recrutadores, em tela grande e no celular.
2. Linha da Grade de Tom: legenda, voz de sistema, texto do copy.
3. Título e subtítulo: a legenda é o `figcaption`.
4. Ações e rótulos: "Ampliar imagem: …" e "ampliar" (selo), "Fechar".
5. Ajuda e placeholders: descrição do diálogo.
6. Termos novos ou dúvidas de glossário: nenhum.
7. Estados: ver acima.
8. Erros previstos: imagem que não carrega (o `alt` fica visível).
9. Confirmações e sucesso: nenhuma.
10. Números e datas: não há.
11. Apoio de IA e dados reais evitados: só prints de build com dados fictícios; nunca a `01-landing` (foto de pessoa). Texto próximo nunca apresenta mock como integração.
12. Exceções pedidas: nenhuma.

### Critérios de aceite

- [x] CA-1 Com `src`, renderiza `<figure>` com `<img>` de `alt` descritivo, `width` e `height` declarados e `<figcaption>` com a legenda (componente).
- [x] CA-2 Só a figura com `priority` tem prioridade; as demais carregam de forma preguiçosa (componente).
- [x] CA-3 O botão tem o nome "Ampliar imagem: <alt>" e alvo de toque de 44 px ou mais (componente e e2e).
- [x] CA-4 Enter abre o diálogo com a imagem inteira; Esc fecha e devolve o foco ao botão (componente e e2e).
- [x] CA-5 `CaseFigureGroup` mostra todas as figuras com uma legenda só; empilha no celular e fica lado a lado a partir de `md` (componente e e2e).
- [x] CA-6 Sem `src`, mostra a hachura com `[a confirmar: print: <arquivo>]` e nenhuma `<img>` (componente).
- [x] CA-7 No máximo 2 camadas SVG por moldura, `aria-hidden` e sem `pointer-events` (componente).
- [x] CA-8 jest-axe sem violações; axe nas 8 combinações no caso (e2e); CLS 0 (e2e).

## Plan

`src/components/ui/case-figure/`: `case-figure.tsx` (servidor), `figure-dialog.tsx` (cliente, só o `Dialog` e o gatilho), `index.ts`, teste. `Dialog` ganha `size="xl"`. `ImageFrame` passa a usar `next/image` (D-1309). Riscos: prints altos (corte em proporção fixa); peso das imagens (WebP em origem, AVIF e WebP pelo `next/image`, `sizes` por variante).

## Tarefas

- [x] Ficha
- [x] Implementação
- [x] Testes (um por critério)
- [x] Seção na vitrine
