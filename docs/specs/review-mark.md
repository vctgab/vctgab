# ReviewMark e review()

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. Decisões: D-1304, D-1305.

## Spec

### Propósito

Marca visível de "isto ainda precisa de validação de Victor". Dois pedaços: `review("o que validar", conteúdo)` em `src/content/pending.ts` (ao lado de `pending()`), que embrulha qualquer valor do conteúdo, e o componente `ReviewMark`, que mostra o conteúdo com a marca `[validar: o que validar]`. **Quando não usar:** dado que falta por inteiro (use `pending()` e `Fact`); aqui o texto existe, falta a confirmação.

### Anatomia e slots

- `review(what, content, { withhold? })` devolve um objeto simples `{ review: true, what, content, withhold }` (atravessa a fronteira servidor e cliente, como `pending()`). `isReview()` e `reviewLabel()` acompanham.
- `ReviewMark`: `what: string`, `children?: ReactNode`, `as?: "span" | "div"`. Com `children`, envolve o conteúdo com fundo suave e sublinhado tracejado e acrescenta a marca depois dele. Sem `children`, mostra só a marca (uso de `withhold`).

### Variantes e tamanhos

| Variante        | Uso                                                                |
| --------------- | ------------------------------------------------------------------ |
| inline (`span`) | frase dentro de um parágrafo                                       |
| bloco (`div`)   | parágrafo, figura ou código inteiro em revisão                     |
| só a marca      | conteúdo retido (`withhold`): o `CodeBlock` mostra legenda e marca |

### Estados

Só um estado visual, sempre visível (não é interativo): sem hover, foco, ativo nem desabilitado. Não há carregando, vazio nem erro. Segundo indicador além da cor: sublinhado tracejado e o texto `[validar: …]`.

### Teclado

Não é focável.

### ARIA e nome acessível

Texto puro, lido na ordem. Sem `role` próprio. A marca fica em `<span data-review>`; o texto `[validar: …]` é o que leitores de tela ouvem.

### Irregularidade

Nenhuma forma do motor: fundo `warning-soft` retangular e sublinhado tracejado de texto.

### Alto contraste e movimento

`forced-colors`: o fundo some e o sublinhado tracejado e o texto bastam. Sem movimento.

### Ficha de Texto

1. Quem lê: Victor, ao revisar; qualquer pessoa que veja a página antes da liberação.
2. Linha da Grade de Tom: revisão, voz de sistema, "[validar: o que validar]".
3. Título e subtítulo: não há.
4. Ações e rótulos: não há ação.
5. Ajuda e placeholders: não há.
6. Termos novos ou dúvidas de glossário: "revisão" (item `[validar]` do copy), entra no glossário.
7. Estados: ver acima.
8. Erros previstos: nenhum.
9. Confirmações e sucesso: nenhuma.
10. Números e datas: não há.
11. Apoio de IA e dados reais evitados: o conteúdo em revisão é do copy; nada novo.
12. Exceções pedidas: nenhuma.

### Critérios de aceite

- [ ] CA-1 `review()` devolve um objeto simples e `isReview()` o reconhece; texto comum e `pending()` não são revisão (unidade).
- [ ] CA-2 `ReviewMark` mostra o conteúdo e a marca `[validar: o que validar]` com `data-review` (componente).
- [ ] CA-3 Sem `children`, mostra só a marca (componente).
- [ ] CA-4 jest-axe sem violações; os pares `ink`/`warning-soft` e `warning-text`/`warning-soft` já estão no `tokens:build`.
- [ ] CA-5 `pnpm release:check` lista cada `review()` do conteúdo e reprova enquanto existir um (script e teste do coletor).

## Plan

`pending.ts` ganha `Review`, `Reviewable`, `review`, `isReview`, `reviewLabel`. `ReviewMark` em `src/components/ui/review-mark/`. `scripts/release-check.ts` coleta `review` dos casos. Risco: a marca aparecer em produção por engano; o `release:check` a bloqueia.

## Tarefas

- [x] Ficha
- [ ] Implementação
- [ ] Testes (um por critério)
- [ ] Seção na vitrine
