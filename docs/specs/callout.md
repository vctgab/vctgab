# Callout

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. Decisão: D-1306.

## Spec

### Propósito

Destaca uma regra ou uma ideia que o leitor não pode perder, dentro de um texto longo (caso: "se o validador falhar, ele não pode devolver uma lista vazia de erros"). **Quando não usar:** erro, aviso ou confirmação do sistema (use os componentes de feedback); citação de pessoa (use `Quote`).

### Anatomia e slots

`<div role="note">` com camada de papel (`Shape`, `wobblyRect`), uma barra à esquerda e o conteúdo. `label` (obrigatório) é o nome acessível. `children` é o texto, com `<strong>` para o trecho central. Sem título visível: não se inventa texto; o destaque vem da forma e do corpo maior (`text-body-lg`).

### Variantes e tamanhos

| Variante                  | Uso                                           |
| ------------------------- | --------------------------------------------- |
| `tone="primary"` (padrão) | regra central do texto (fundo `primary-soft`) |
| `tone="neutral"`          | observação de apoio (fundo `surface-sunken`)  |

### Estados

Estático: sem hover, foco, ativo, desabilitado, carregando nem erro. Só o estado "com dados"; vazio e indisponível não se aplicam (o conteúdo é texto do autor).

### Teclado

Não é focável. Um link dentro do texto segue o padrão do `LinkText`.

### ARIA e nome acessível

`role="note"` e `aria-label={label}`. Não usa `<aside>` (landmark complementar só no topo da página: axe `landmark-complementary-is-top-level`).

### Irregularidade

`wobblyRect` `md`, seed própria, rotação 0 (texto longo fica reto). A barra à esquerda é um `wobblyRect` estreito em `primary-decor` (uma camada a mais). Até 3 camadas ao todo (SH-03). Padding de segurança `p-6`.

### Alto contraste e movimento

`forced-colors`: camadas somem e entra uma borda sólida real. Sem movimento.

### Ficha de Texto

1. Quem lê: tech leads lendo o caso.
2. Linha da Grade de Tom: destaque no caso, voz pessoal, texto do copy.
3. Título e subtítulo: não há (o nome acessível vem de `label`).
4. Ações e rótulos: não há.
5. Ajuda e placeholders: não há.
6. Termos novos ou dúvidas de glossário: nenhum.
7. Estados: só "com dados".
8. Erros previstos: nenhum.
9. Confirmações e sucesso: nenhuma.
10. Números e datas: não há.
11. Apoio de IA e dados reais evitados: texto do copy.
12. Exceções pedidas: nenhuma.

### Critérios de aceite

- [x] CA-1 Tem `role="note"` com o nome de `label` e mostra o conteúdo (componente).
- [x] CA-2 No máximo 3 camadas SVG, todas `aria-hidden` e sem `pointer-events` (componente).
- [x] CA-3 jest-axe sem violações nos dois tons (componente).
- [x] CA-4 Contraste de `ink` sobre `primary-soft` e `surface-sunken` calculado (`tokens:build`) e axe nas 8 combinações (e2e do caso).
- [x] CA-5 Texto longo com 3 seeds fica dentro do corpo (componente).

## Plan

`src/components/ui/callout/callout.tsx` (servidor), `index.ts`, teste. Risco: contraste do `primary-soft` com `ink` (já no `tokens:build`).

## Tarefas

- [x] Ficha
- [x] Implementação
- [x] Testes (um por critério)
- [x] Seção na vitrine
