# Movimento: Marquee, Reveal e LiveClock

## Spec

### Propósito

- **Marquee:** faixa de fichas em laço horizontal (projetos em destaque).
- **Reveal:** entrada suave de um bloco ao rolar.
- **LiveClock:** hh:mm:ss de Teresina, atualizado a cada segundo.

**Quando não usar:** Marquee para conteúdo essencial único (ele precisa existir também como lista navegável); Reveal em conteúdo acima da dobra (atrasa o LCP); LiveClock em qualquer lugar que não seja decoração de status.

### Anatomia

- Marquee: região rotulada → trilho com o conteúdo + cópia `aria-hidden` (e `inert`) → máscara de bordas.
- Reveal: wrapper que recebe `data-visivel` quando entra na tela.
- LiveClock: `<time>` com reserva de largura (`00:00:00` invisível) e o valor real só após montar.

### Variantes

| Componente | Props                                        |
| ---------- | -------------------------------------------- |
| Marquee    | `label`, `durationS` (padrão 52), `children` |
| Reveal     | `delay` (0, 1, 2 × 80 ms), `as`              |
| LiveClock  | `seconds` (padrão `true`), `label`           |

### Estados

- Marquee: rodando; pausado com hover, foco dentro ou toque; com movimento reduzido vira rolagem horizontal manual e a cópia some.
- Reveal: oculto (opacidade 0, 12 px abaixo) → visível; sem JavaScript ou com movimento reduzido, visível desde o início.
- LiveClock: antes de montar, reserva o espaço sem número (sem erro de hidratação); depois, a hora.

### Teclado

Marquee: os links do conteúdo original recebem foco; a cópia não. Reveal e LiveClock não recebem foco.

### ARIA e nome acessível

Marquee: `section` com `aria-label` ("Projetos em destaque"). LiveClock: `<time dateTime>` com `aria-label` "Horário em Teresina: 05:11"; sem `aria-live` (anunciar a cada segundo atrapalha).

### Irregularidade

Marquee herda a rotação das fichas. Reveal entra com 0,4° de rotação que se desfaz. LiveClock em JetBrains Mono, números tabulares.

### Alto contraste e movimento

Todos têm equivalente estático em `prefers-reduced-motion` (descrito acima). Duração decorativa da faixa: 52 s; entrada do Reveal: 320 ms.

### Ficha de Texto

1. Quem lê: visitantes.
2. Grade de Tom: boas-vindas, acolhedor.
3. Título: "Projetos em destaque" (rótulo da faixa).
4. Rótulos: "Horário em Teresina".
5. a 9. Não se aplicam.
6. Hora por `formatTimeWithSeconds` e `formatTime`, fuso de Teresina.
7. Sem dados reais.
8. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Marquee com cópia `aria-hidden` e `inert`, pausa em hover e foco, e rolagem manual com movimento reduzido.
- [x] CA-2 Reveal aplica o estado visível ao entrar na tela e já começa visível com movimento reduzido.
- [x] CA-3 LiveClock renderiza a reserva no servidor e a hora no cliente, pelo formatador.
- [x] CA-4 jest-axe sem violações.

## Plan

`src/components/ui/{marquee,reveal,live-clock}/*`. Marquee em CSS puro (Server Component). Reveal com IntersectionObserver. LiveClock com `useSyncExternalStore` (servidor devolve `null`).

## Tarefas

- [x] Ficha
- [x] Componentes
- [x] Testes
- [x] Vitrine
