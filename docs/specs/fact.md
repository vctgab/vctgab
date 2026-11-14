# Fact

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas.

## Spec

### Propósito

Mostrar um valor que vem de `src/content` e pode estar pendente (`Maybe<string>`). Pronto, sai como texto comum; pendente, sai como a marca exata `[a confirmar: o que falta]`, destacada para ninguém confundir com conteúdo (DD-01). **Quando não usar:** texto fixo da interface (vai direto no JSX ou no conteúdo); valores que não podem faltar (use `string`, não `Maybe`).

### Anatomia e slots

- `value`: `Maybe<string>`.
- `as`: `span` (padrão) ou `strong`.
- Pendente: `<span data-pendente>` com fundo `primary-soft`, sublinhado tracejado `primary-decor` (segundo indicador além da cor) e o texto da marca.

### Variantes e tamanhos

| Variante | Uso                                    |
| -------- | -------------------------------------- |
| `span`   | Texto corrido, status, rótulos         |
| `strong` | Valor em destaque (ex.: mês da agenda) |

Herda tamanho e fonte do contexto.

### Estados

Com dados (texto comum) e indisponível (pendente). Os demais não se aplicam: o valor é estático, não carrega nem falha.

### Teclado

Não recebe foco.

### ARIA e nome acessível

Texto lido como está; a marca pendente é lida por extenso ("a confirmar: mês da agenda aberta").

### Irregularidade

Nenhuma forma; só sublinhado tracejado nativo.

### Alto contraste e movimento

Em `forced-colors`, o sublinhado tracejado continua (o fundo some). Sem movimento.

### Ficha de Texto

1. Quem lê: visitante; na prática, Victor durante o desenvolvimento.
2. Grade de Tom: pendência, voz de sistema, `[a confirmar: o que falta]` (texto exato da regra DD-01).
3. Título e subtítulo: não se aplica.
4. Ações e rótulos: não se aplica.
5. Ajuda e placeholders: não se aplica.
6. Termos: nenhum novo.
7. Estados: com dados e indisponível (pendente).
8. Erros previstos: nenhum.
9. Confirmações: não se aplica.
10. Números e datas: o valor chega já formatado.
11. Dados reais evitados: o componente nunca inventa; mostra a pendência.
12. Exceções: nenhuma.

### Critérios de aceite

- [ ] CA-1 Valor pronto sai como texto comum, sem marca.
- [ ] CA-2 Valor pendente sai exatamente como `[a confirmar: o que falta]`, com `data-pendente` e sublinhado tracejado.
- [ ] CA-3 Sem violação no jest-axe.

## Plan

`src/components/ui/fact/fact.tsx` (Server Component), `index.ts`, `fact.test.tsx`. Usa `isPending` e `pendingLabel` de `src/content/pending.ts`. Seção na vitrine em `/sistema/conteudo`.

## Tarefas

- [x] Ficha
- [x] Implementação
- [x] Testes (um por critério)
- [x] Seção na vitrine
