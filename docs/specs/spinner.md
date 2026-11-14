# Spinner e Skeleton

## Spec

### Propósito

**Spinner:** indicar que uma ação está em andamento num ponto específico (botão, campo). **Skeleton:** reservar o espaço de um conteúdo que ainda vai chegar, sem salto de layout. **Quando não usar:** para esperas acima de 10 s sem explicação (diga o que está acontecendo); Skeleton nunca para conteúdo que já está disponível no servidor.

### Anatomia

- Spinner: SVG 24 com um traço à mão (arco aberto de três quartos, desenhado com leve irregularidade) que gira; texto opcional ao lado.
- Skeleton: bloco com forma `wobblyRect` (ou `pill` para linhas de texto) preenchido com hachura `hatch-a`/`hatch-b`, sem contorno.

### Variantes e tamanhos

| Componente | Prop    | Valores                                                      |
| ---------- | ------- | ------------------------------------------------------------ |
| Spinner    | `size`  | 16, 20 (padrão), 24                                          |
| Spinner    | `label` | texto visível opcional; sem ele, nome acessível "Carregando" |
| Skeleton   | `shape` | `bloco` (wobblyRect), `linha` (pill)                         |
| Skeleton   | `lines` | número de linhas para `linha`                                |

### Estados

Só "carregando". Ao terminar, quem usa troca o Spinner/Skeleton pelo conteúdo.

### Teclado

Não recebe foco.

### ARIA e nome acessível

- Spinner sozinho: `role="status"` com texto oculto "Carregando" ou o `label` visível. Dentro de um botão: `decorative` (o botão já tem `aria-busy` e o texto de carregando).
- Skeleton: `aria-hidden="true"`; a região que carrega usa `aria-busy="true"` no contêiner.

### Irregularidade

Spinner: arco com raio levemente variável, desenhado à mão. Skeleton: `Shape` com seed por instância, sem contorno, sem sombra.

### Alto contraste e movimento

Spinner com `prefers-reduced-motion`: não gira; o arco fica parado e o texto "Carregando" continua (equivalente estático). Skeleton com movimento reduzido: hachura parada (sem brilho deslizante). `forced-colors`: traço em `CanvasText`.

### Ficha de Texto

1. Quem lê: qualquer pessoa esperando uma ação.
2. Grade de Tom: carregando, voz de sistema, curto e neutro.
3. Título: não se aplica.
4. Rótulos: "Carregando" (padrão); em ações, o gerúndio da ação ("Enviando mensagem").
5. Ajuda: não se aplica.
6. Termos: nenhum.
7. Estados: carregando (único).
8. Erros: não se aplica (o erro é do componente que carrega).
9. Sucesso: não se aplica.
10. Números: não se aplica.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Spinner sozinho expõe `role="status"` com nome "Carregando" ou o rótulo dado.
- [x] CA-2 Spinner decorativo tem `aria-hidden`.
- [x] CA-3 Com movimento reduzido não há animação (classe `motion-safe:` apenas).
- [ ] CA-4 Skeleton é `aria-hidden` e reserva a altura pedida.
- [x] CA-5 jest-axe sem violações.

## Plan

`src/components/ui/spinner/*` e `src/components/ui/skeleton/*`. Animação em CSS (`animate-spin` do Tailwind foi removido junto com `--animate-*`; usamos `@keyframes` próprio em `base.css`).

## Tarefas

- [x] Ficha
- [x] Spinner
- [ ] Skeleton (etapa 4)
- [x] Testes
- [ ] Vitrine
