# P1 visuais: Divider, ProgressHatch, Polaroid e Stat

## Spec

### Propósito

- **Divider:** separar blocos com um traço à mão (ondulado tracejado) ou sólido.
- **ProgressHatch:** progresso de 0 a 100 em hachura, com valor anunciado (ex.: achados).
- **Polaroid:** moldura de foto torta com legenda manuscrita.
- **Stat:** número grande com a legenda do método, **obrigatória** (sem `method` não compila).

**Quando não usar:** Divider entre itens de lista (use espaço); ProgressHatch para espera indefinida (use Spinner); Polaroid para ícones; Stat sem fonte ou método conhecido (escreva `[a confirmar: …]`).

### Anatomia

- Divider: `<hr>` com SVG `handLine` (ondas regulares + tracejado) ou traço sólido; `role="separator"` implícito.
- ProgressHatch: trilho `wobblyRect` + barra com hachura em `repeating-linear-gradient` de tokens; texto opcional "3 de 7".
- Polaroid: `figure` com moldura `wobblyRect` (sombra suave), área da foto (imagem ou hachura com `[a confirmar: foto]`), `figcaption` em Caveat (mín. 20 px), fita opcional e rotação por seed.
- Stat: valor (Fraunces display), valor anterior opcional com seta ("34% → 89%"), rótulo mono "Método" e texto do método.

### Variantes

| Componente    | Props                                                   |
| ------------- | ------------------------------------------------------- |
| Divider       | `variant`: `wave` (padrão) ou `solid`                   |
| ProgressHatch | `value`, `max`, `label` (nome acessível), `showValue`   |
| Polaroid      | `src`/`alt` ou `placeholder`, `caption`, `tape`, `seed` |
| Stat          | `value`, `from?`, `method` (obrigatório), `label?`      |

### Estados

Estáticos. ProgressHatch: 0 (trilho vazio), parcial, completo (hachura cheia + ícone `check` no texto). Polaroid sem foto: hachura + texto `[a confirmar: foto N]`. Stat com dado ausente: o valor vira `[a confirmar: …]`. Hover, foco, ativo, desabilitado, carregando e erro não se aplicam (não são interativos).

### Teclado

Não recebem foco.

### ARIA e nome acessível

Divider: `<hr>` (separador). ProgressHatch: `role="progressbar"` com `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` ("3 de 7") e `aria-label`. Polaroid: `figure` + `figcaption`; imagem com `alt`. Stat: o par "de/para" é lido como frase ("De 34% para 89%"), os números visuais ficam `aria-hidden`.

### Irregularidade

Divider: `handLine` com `waves` e seed. ProgressHatch: trilho `wobblyRect` sm. Polaroid: `wobblyRect` lg com raios pequenos, rotação × `--shape-rotation-max`. Stat: sem forma.

### Alto contraste e movimento

Hachura vira borda; ProgressHatch mantém o texto do valor. Sem movimento (a largura da barra muda sem animação com movimento reduzido).

### Ficha de Texto

1. Quem lê: visitantes e quem avalia resultados.
2. Grade de Tom: dados e prova, objetiva; legendas de polaroid, personalidade leve (Caveat).
3. Título: não se aplica.
4. Rótulos: "Método", "Progresso dos achados".
5. Ajuda: o texto do método explica como o número foi medido.
6. Termos: "achados".
7. Estados: dado ausente vira `[a confirmar: …]`.
8. Erros: não se aplica.
9. Sucesso: ProgressHatch completo ("7 de 7").
10. Números: por `formatPercent` e `formatCount`.
11. Números de exemplo marcados como fictícios na vitrine.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Divider renderiza `<hr>` com o traço decorativo `aria-hidden`.
- [x] CA-2 ProgressHatch expõe `progressbar` com valor, mínimo, máximo e texto.
- [x] CA-3 Polaroid sem foto mostra `[a confirmar: …]`; com foto exige `alt`.
- [x] CA-4 Stat sem `method` não compila; o par de/para é lido como frase.
- [x] CA-5 Números passam pelo formatador.
- [x] CA-6 jest-axe sem violações.
- [x] CA-7 (Home v2) `Stat` mostra `label` (o que o número conta) e o rótulo do método conforme `methodKind`: "Método" (padrão) ou "Fonte"; `method` continua obrigatório e aceita a pendência por `Fact`.
- [x] CA-8 (Home v2) `Stat` `size="md"` usa `text-h1` no valor (grade de quatro números); `lg` mantém `text-display`.
- [x] CA-9 (Home v2) `Polaroid` usa o `ImageFrame` por dentro e aceita `placeholder` como texto ou `Fact`.

## Plan

`src/components/ui/{divider,progress-hatch,polaroid,stat}/*`, todos Server Components.

### Home v2

- `Stat`: `label?`, `methodKind?: "metodo" | "fonte"`, `size?: "lg" | "md"` (D-1207). O valor continua em `primary-decor` (500 no claro, 400 no escuro; título de 24 px ou mais).
- `Polaroid`: a hachura sai para o `ImageFrame` (`docs/specs/image-frame.md`); `placeholder` passa a aceitar `ReactNode`.

## Tarefas

- [x] Ficha
- [x] Componentes
- [x] Testes
- [x] Vitrine
