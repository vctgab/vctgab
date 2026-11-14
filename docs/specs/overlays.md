# Sobreposições: Dialog, Drawer, Tooltip, Popover e Toast

## Spec

### Propósito

- **Dialog:** tarefa focada que interrompe (caderno de achados, terminal, confirmação).
- **Drawer:** painel lateral (menu mobile).
- **Tooltip:** nome curto de um controle só com ícone, para quem usa mouse; nunca informação essencial.
- **Popover:** conteúdo complementar ancorado num controle (ex.: detalhes de um token na vitrine).
- **Toast:** confirmação curta de sucesso ou informação. **Nunca erro** (MS-03): erro é inline.

**Quando não usar:** Dialog para mensagens que cabem inline; Tooltip para motivo de desabilitado (que é texto visível); Toast para algo que precisa de ação.

### Anatomia

- Dialog: overlay `overlay` + painel `wobblyRect` `xl` com sombra `lg`, título (`h2`), descrição opcional, conteúdo, ações; botão "Fechar" só com ícone no canto.
- Drawer: painel em altura total, borda do lado de dentro rasgada (`tornEdge`), mesmo cabeçalho do Dialog.
- Tooltip: papel `pill` pequeno, texto 14 px.
- Popover: papel `wobblyRect` `lg`, sem seta.
- Toast: papel `wobblyRect` `md` com ícone (`check` ou `info`), texto e botão "Fechar aviso".

### Variantes

| Componente | Props                                                                               |
| ---------- | ----------------------------------------------------------------------------------- |
| Dialog     | `title`, `description`, `size` (`sm`, `md`, `lg`), `trigger`                        |
| Drawer     | `side` (`right`, `left`), `title`                                                   |
| Tooltip    | `content`, `side`                                                                   |
| Popover    | `trigger`, `title`                                                                  |
| Toast      | `tone`: `sucesso` ou `informacao` (o tipo não aceita erro), `duration` (padrão 5 s) |

### Estados

| Estado                          | Comportamento                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| Abrindo                         | Opacidade e 8 px de deslocamento, 200 ms, `ease-out`. Drawer desliza do lado, 200 ms. |
| Aberto                          | Foco preso dentro (Dialog, Drawer); Esc fecha.                                        |
| Fechando                        | Inverso, 120 ms. Foco volta ao gatilho.                                               |
| Hover/foco/ativo                | Nos controles internos, padrão do Button.                                             |
| Desabilitado, erro, selecionado | Não se aplicam ao contêiner.                                                          |
| Carregando                      | Conteúdo interno com `Spinner` ou `Skeleton`.                                         |

### Teclado

| Tecla | Ação                                          |
| ----- | --------------------------------------------- |
| Esc   | Fecha Dialog, Drawer, Popover, Tooltip, Toast |
| Tab   | Circula dentro do Dialog/Drawer               |
| F6    | Leva ao viewport de toasts (Radix)            |

### ARIA e nome acessível

Dialog/Drawer: `role="dialog"`, `aria-modal`, nomeados pelo título, descritos pela descrição. Tooltip: `role="tooltip"` ligado ao gatilho. Popover: `dialog` não modal. Toast: `role="status"` (polite).

### Irregularidade

Seeds pelo título. Dialog com rotação 0 (texto longo); Popover e Tooltip sem rotação. Padding ≥ 24 px no Dialog, 12 px no Tooltip.

### Alto contraste e movimento

`forced-colors`: bordas reais, overlay continua. Movimento reduzido: aparecem e somem só com opacidade.

### Ficha de Texto

1. Quem lê: visitantes em tarefas focadas.
2. Grade de Tom: sucesso de rotina, curto ("Código copiado."); confirmações com verbos espelhados ("Descartar rascunho" / "Continuar editando").
3. Títulos: o que o painel faz ("Caderno de achados", "Menu").
4. Ações: "Fechar" (ícone, nome acessível), "Fechar aviso" (toast).
5. Ajuda: descrição curta.
6. Termos: "caderno de achados", "terminal".
7. Estados: carregando dentro do conteúdo.
8. Erros: nunca em toast; dentro do Dialog, inline.
9. Sucesso: toast curto, sem exclamação.
10. Números: pelo formatador.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Dialog nomeado pelo título, prende o foco, fecha com Esc e devolve o foco ao gatilho.
- [x] CA-2 Botão de fechar tem nome "Fechar".
- [x] CA-3 Drawer abre do lado escolhido com o mesmo comportamento de foco.
- [x] CA-4 Tooltip aparece no foco do gatilho com `role="tooltip"`.
- [x] CA-5 Popover abre e fecha pelo gatilho e com Esc.
- [x] CA-6 Toast só aceita `sucesso` e `informacao` (tipo) e aparece em `role="status"`.
- [x] CA-7 jest-axe sem violações com os painéis abertos.

## Plan

`src/components/ui/{dialog,tooltip,popover,toast}/*` (o Drawer mora em `dialog`). Radix cuida de foco, portal e Esc. Com Cache Components as rotas ficam ocultas por `Activity`: diálogos se fecham ao esconder a rota (guia "Preserving UI state").

## Tarefas

- [x] Ficha
- [x] Componentes
- [x] Testes
- [ ] Vitrine
