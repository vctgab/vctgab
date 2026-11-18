# CodeBlock

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. Decisões: D-1307 (dependência `shiki`), D-1308.

## Spec

### Propósito

Mostra um trecho de código com realce de sintaxe feito no servidor (zero JavaScript de realce no cliente), com legenda e botão de copiar. **Quando não usar:** comando curto no meio do texto (use `<code>` inline); captura de tela (use `CaseFigure`).

### Anatomia e slots

`<figure>`: (1) cabeçalho com o nome da linguagem em mono e o botão "Copiar código"; (2) região rolável com o `<pre><code>` realçado; (3) `<figcaption>` com a legenda. Props: `code: string | Review<string>`, `language: "ts" | "tsx" | "json" | "bash"`, `caption: ReactNode`. Se `code` for um `review(…, { withhold: true })`, o componente **não renderiza o código**: mostra a legenda e `ReviewMark` com o motivo, e nenhum botão de copiar.

### Variantes e tamanhos

| Variante   | Uso                                        |
| ---------- | ------------------------------------------ |
| realçado   | padrão, com código                         |
| em revisão | `withhold`: só legenda e marca, sem código |

### Estados

Padrão; foco visível na região rolável e no botão; hover e ativo do botão (padrão do `Button`); botão "Copiar código" → "Código copiado" por 2 s depois de copiar (região viva, polida); erro de cópia inline; "em revisão". Carregando e vazio não se aplicam (realçado no build); indisponível é o estado em revisão.

### Teclado

| Tecla                   | Ação                                       |
| ----------------------- | ------------------------------------------ |
| Tab                     | vai ao botão, depois à região de código    |
| Enter ou Espaço (botão) | copia o código                             |
| Setas (região focada)   | rolam o código na horizontal e na vertical |

### ARIA e nome acessível

Região rolável: `tabIndex={0}`, `role="region"`, `aria-label="Código <linguagem>"` (para rolar com o teclado, regra `scrollable-region-focusable`). Botão: nome visível "Copiar código". Confirmação em `role="status"`. Realce: só cor de `<span>`; o texto e o `<pre>` são o portador do significado, e comentários também em itálico (segundo canal).

### Irregularidade

Moldura `wobblyRect` `md` (preenchimento `surface-raised`, contorno `stroke`), rotação 0. Sombra suave e contorno: 2 camadas. Padding `p-4 md:p-5`.

### Alto contraste e movimento

`forced-colors`: borda sólida real e as cores de realce caem para as do sistema. Sem movimento além da troca do rótulo do botão.

### Realce e contraste

`shiki` com tema `css-variables`: os tokens usam `--shiki-token-*`, definidos em `src/styles/base.css` com tokens semânticos já validados em `surface-raised`: palavra-chave `primary-text`, texto `ink`, pontuação `ink-muted`, comentário `ink-subtle`, texto entre aspas `secondary-1-text`, função `secondary-2-text`, constante `danger-text`. Todos esses pares já estão no `tokens:build` sobre `surface-raised` (8 combinações); nenhum par novo foi preciso.

### Ficha de Texto

1. Quem lê: devs avaliando o nível do trabalho.
2. Linha da Grade de Tom: código, voz de sistema; legenda do copy.
3. Título e subtítulo: nome da linguagem em mono ("TypeScript").
4. Ações e rótulos: "Copiar código" (verbo + objeto), "Código copiado".
5. Ajuda e placeholders: não há.
6. Termos novos ou dúvidas de glossário: nenhum.
7. Estados: ver acima.
8. Erros previstos: copiar falha (sem permissão da área de transferência).
9. Confirmações e sucesso: "Código copiado".
10. Números e datas: não há.
11. Apoio de IA e dados reais evitados: o trecho do cliente só aparece depois da liberação.
12. Exceções pedidas: nenhuma.

Erro (MS-02): "Não foi possível copiar o código. O navegador não liberou a área de transferência. Selecione o trecho e copie com o teclado; nada foi alterado."

### Critérios de aceite

- [x] CA-1 Com `code`, renderiza `<pre><code>` com `<span>` realçados e nenhum JavaScript de realce no cliente (componente de servidor, sem `"use client"` no realce).
- [x] CA-2 Com `review(…, { withhold: true })`, o texto do código não aparece no DOM; aparecem a legenda e a marca (componente).
- [x] CA-3 "Copiar código" tem nome acessível, copia exatamente o código, anuncia "Código copiado" e volta ao rótulo inicial (componente, `userEvent`).
- [x] CA-4 Falha de cópia mostra a mensagem inline do padrão MS-02 e mantém o botão utilizável (componente).
- [x] CA-5 A região de código é focável e tem nome (componente e e2e de teclado).
- [x] CA-6 Contraste dos pares de realce calculado nas 8 combinações (`tokens:build`).
- [x] CA-7 jest-axe sem violações nos dois estados (componente).

## Plan

`shiki` (núcleo e motor JavaScript, só as linguagens usadas) em `src/components/ui/code-block/highlight.ts` (servidor, em cache). `code-block.tsx` (servidor) e `copy-button.tsx` (cliente). Variáveis `--shiki-*` em `src/styles/base.css`. Riscos: peso da dependência no servidor (não vai ao cliente, D-1307); contraste (pares já validados).

## Tarefas

- [x] Ficha
- [x] Implementação
- [x] Testes (um por critério)
- [x] Seção na vitrine
