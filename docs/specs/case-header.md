# CaseHeader

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. Decisão: D-1312.

## Spec

### Propósito

Abre um caso: título (`h1`), "o que é" e a ficha técnica numa `Ficha` com fita. **Quando não usar:** cabeçalho de página comum (use `Section`).

### Anatomia e slots

`<header>`: (1) linha de `Tag` com as áreas ("código", "liderança"); (2) `h1` com o nome; (3) parágrafo "o que é" (`text-body-lg`); (4) `Ficha` com fita e `dl` da ficha técnica: Projeto, Meu papel, Empresa, Período, Time, Status (`Tag` com ponto e texto), Stack (`Tag` em lista). Cada valor é `Reviewable<string>` ou `Maybe<string>` (revisão e pendência aparecem com a marca).

### Variantes e tamanhos

| Variante | Uso                                                                                       |
| -------- | ----------------------------------------------------------------------------------------- |
| padrão   | título e "o que é" à esquerda e a ficha à direita a partir de `lg`; empilhados no celular |

### Estados

Estático: sem hover, foco, ativo, desabilitado nem carregando. Vazio não se aplica (todo campo é obrigatório no tipo). Erro não se aplica. Indisponível: campo `pending(...)` mostra `[a confirmar: …]`. Revisão: campo `review(...)` mostra a marca. Com dados: valores do copy.

### Teclado

Sem controles. A ordem de leitura é a do DOM: áreas, título, "o que é", ficha.

### ARIA e nome acessível

`<header>` dentro do `main` (sem landmark `banner`). `h1` único da página. A ficha técnica é `dl` com `dt` e `dd` (relações de leitura corretas). O ponto do status é `aria-hidden`; o texto carrega o significado. A lista de stack é `ul` com nome "Stack".

### Irregularidade

`Ficha` (`wobblyRect` `lg`, fita `tornEdge`), seed `caso:<slug>:ficha`, rotação -0,8°. Camadas: as da `Ficha` (sombra e contorno) mais a fita em `clip-path` (sem SVG).

### Alto contraste e movimento

Herdados da `Ficha` e da `Tag`. Sem movimento.

### Ficha de Texto

1. Quem lê: quem chega ao caso, vindo da Home ou da lista.
2. Linha da Grade de Tom: ficha técnica, voz de sistema, rótulos curtos.
3. Título e subtítulo: nome do projeto; "o que é" do copy.
4. Ações e rótulos: não há ação.
5. Ajuda e placeholders: não há.
6. Termos novos ou dúvidas de glossário: nenhum.
7. Estados: ver acima.
8. Erros previstos: nenhum.
9. Confirmações e sucesso: nenhuma.
10. Números e datas: o período é texto do copy ("mai/2026 – atual"), não valor calculado.
11. Apoio de IA e dados reais evitados: só o que o copy afirma; "Time" fica em revisão.
12. Exceções pedidas: nenhuma.

### Critérios de aceite

- [ ] CA-1 Mostra `h1`, "o que é" e a ficha como `dl` com os sete rótulos na ordem (componente).
- [ ] CA-2 O status é uma `Tag` com ponto e texto; a stack é uma lista de `Tag` (componente).
- [ ] CA-3 Campo em revisão mostra a marca `[validar: …]`; campo pendente mostra `[a confirmar: …]` (componente).
- [ ] CA-4 jest-axe sem violações (componente) e axe nas 8 combinações (e2e do caso).
- [ ] CA-5 Texto longo ("o que é" e a stack) com 3 seeds não vaza da ficha, em 390 px (componente e e2e).

## Plan

`src/components/ui/case-header/case-header.tsx` (servidor), `index.ts`, teste. Usa `Ficha`, `Tag`, `ReviewMark`, `Fact`. Risco: stack longa quebrando em várias linhas no celular (as `Tag` quebram em linha).

## Tarefas

- [x] Ficha
- [ ] Implementação
- [ ] Testes (um por critério)
- [ ] Seção na vitrine
