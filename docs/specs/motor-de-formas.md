# Motor de formas (`src/lib/shapes`) e `Shape`

> Ficha de Componente. Spec, Plan e Tarefas.

## Spec

### Propósito

Gerar contornos irregulares, determinísticos e vetoriais para todo o sistema (botões, fichas, campos, chips, fitas, furos, divisores, hero e rodapé), sem que nada mude entre carregamentos e sem serrilhado. **Quando não usar:** texto (nunca deformado), áreas de clique (sempre o retângulo do elemento), ícones (desenhados à mão em grade 24, ver `Icon`).

### Anatomia

- `generateShape(opções)`: função pura, memoizada por `(kind, seed, bucket, irregularity, points, edges)`.
- `Shape` (`src/components/ui/shape`): desenha até 3 camadas SVG atrás do conteúdo, dentro de um hospedeiro com `position: relative`.
  1. Sombra dura: o mesmo caminho do preenchimento, deslocado pelo token de sombra.
  2. Preenchimento: caminho variante `f`, deslocado de 1 a 3 px (× energia do tema).
  3. Contorno: caminho variante `o` (outra amostra de ruído da mesma seed), traço de 2 px com `vector-effect: non-scaling-stroke`.
- `shapeHostProps(forma)`: devolve `data-shape-host` e `border-radius` (8 valores) para o hospedeiro. O anel de foco (`outline`) segue esse raio, então acompanha o contorno; em `forced-colors` vira borda real.
- `useShapeMorph`: interpola 2 ou 3 conjuntos de pontos de mesma contagem, até 30 fps, pausado fora da tela e estático com movimento reduzido.

### Tipos (`kind`)

| Tipo         | Uso                              | Construção                                                                                                                        |
| ------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `blob`       | Hero, amostras de tema, copas    | Pontos numa elipse com deslocamento radial suave; spline fechada convertida em Bézier (tangentes proporcionais ao trecho, D-202). |
| `wobblyRect` | Botões, fichas, campos, diálogos | Retângulo de cantos assimétricos amostrado no perímetro, deslocado na normal por ruído de baixa frequência; Catmull-Rom fechada.  |
| `pill`       | Chips, switches, botões pequenos | `wobblyRect` com raio igual à metade da altura nominal e amplitude menor.                                                         |
| `tornEdge`   | Fitas, fichas rasgadas           | Polígono com as bordas escolhidas em zigue-zague de dentes irregulares e micro-ruído.                                             |
| `handLine`   | Sublinhados, divisores, setas    | Traço aberto com ondulação suave (opcionalmente uma onda regular para o divisor tracejado).                                       |
| `hole`       | Furos de caderno                 | Círculo irregular com poucos pontos.                                                                                              |

### Tamanhos (`bucket`)

| Bucket | Tamanho nominal | Pontos | Amplitude máx. | Raios    |
| ------ | --------------- | ------ | -------------- | -------- |
| `sm`   | 140 × 44        | 16     | 1,4 px         | 6–11 px  |
| `md`   | 320 × 56        | 22     | 2 px           | 7–13 px  |
| `lg`   | 360 × 240       | 30     | 2,8 px         | 9–18 px  |
| `xl`   | 960 × 420       | 44     | 4 px           | 12–24 px |

O caminho é normalizado de 0 a 1 e desenhado com `preserveAspectRatio="none"`. As amplitudes em pixels usam o tamanho nominal do bucket, então não há medição (nada de `ResizeObserver`) e a primeira pintura é igual no servidor e no cliente.

### Determinismo

- PRNG `mulberry32` semeado por hash de string (`cyrb53` truncado em 32 bits). Mesma seed, mesmo resultado.
- Seno e cosseno próprios (redução de faixa + série de Taylor), só com `+ − × ÷`. `Math.sin` pode diferir no último bit entre motores JavaScript; operações IEEE básicas não. Caminhos com 4 casas decimais.
- Proibido `Math.random` (lint e varredura).

### Parâmetros do tema

`--shape-energy` multiplica o desalinhamento entre preenchimento e contorno; `--shape-rotation-max` multiplica a rotação de cada elemento (`rotation` vai de −1 a 1). Ambos são aplicados em CSS, então o caminho não depende do tema e não há risco de hidratação. Rotação sempre abaixo de 1,5 grau. O hero e o rodapé, que já animam no cliente, também usam a energia na geometria.

### Estados, teclado e ARIA

`Shape` não é interativo: camadas com `aria-hidden`, `focusable="false"` e `pointer-events: none`. Estados (hover, ativo, foco) pertencem ao hospedeiro. A área clicável é sempre o retângulo do hospedeiro (SH-04).

### Irregularidade e segurança de texto

O conteúdo fica em fluxo normal, acima das camadas, com padding maior que a amplitude máxima mais a espessura do traço. A forma é recuada para dentro de [0, 1], então nunca invade o padding.

### Alto contraste e movimento

`forced-colors`: camadas ocultas e borda real de 2 px em `CanvasText`/`ButtonText`, com o mesmo `border-radius`. Movimento reduzido: nada anima; `useShapeMorph` devolve a primeira pose.

### Ficha de Texto

1. Quem lê: ninguém (decorativo); a vitrine de formas é lida por quem desenvolve.
2. Grade de Tom: vitrine, voz de sistema, objetiva.
3. Título do playground: "Formas"; subtítulo: "O motor que desenha os contornos. Mesma seed, mesma forma, sempre."
4. Ações: "Copiar código de uso"; confirmação "Código copiado."; falha "Não foi possível copiar o código. Selecione o trecho e copie manualmente."
5. Rótulos: "Tipo", "Seed", "Irregularidade", "Pontos", "Tamanho".
6. Termos: "seed" (mantido em inglês por ser o nome do parâmetro no código; explicado no subtítulo).
7. Estados: com dados (sempre); o playground não carrega dados.
8. Erros previstos: falha da área de transferência.
9. Sucesso: "Código copiado." em região `aria-live`.
10. Números: valores dos controles por `formatNumber`.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Mesma seed gera o mesmo caminho (todos os tipos).
- [x] CA-2 Seeds diferentes geram caminhos diferentes.
- [x] CA-3 Nenhum `NaN` ou `Infinity` em caminho ou pontos.
- [x] CA-4 Todos os pontos dentro do viewBox [0, 1] com tolerância de 1e-6.
- [x] CA-5 Snapshot de 5 seeds por tipo.
- [x] CA-6 Caminho válido pelo parser (comandos M, C, L, Z com a contagem certa de números).
- [x] CA-7 Seno e cosseno próprios com erro abaixo de 1e-9.
- [x] CA-8 `Shape` desenha no máximo 3 SVGs, todos com `aria-hidden` e sem filtro.
- [x] CA-9 `border-radius` de 8 valores válido para cada forma.
- [x] CA-10 `useShapeMorph` devolve a pose inicial com movimento reduzido.
- [x] CA-11 Playground em `/sistema/formas` com os controles, a grade de 24 seeds por tipo e a cópia do código.
- [ ] CA-12 Captura 2x com recorte ampliado das bordas sem serrilhado (etapa 7).

## Plan

Arquivos: `src/lib/shapes/{prng,trig,noise,path,generate,morph,index}.ts`, `src/lib/shapes/use-shape-morph.ts`, `src/components/ui/shape/*`, `src/app/sistema/formas/*`. Riscos: distorção de cantos em elementos muito mais largos que o nominal (mitigado por raios pequenos e buckets); custo de memória do cache (limitado a 800 entradas).

## Tarefas

- [x] Ficha
- [x] PRNG, trigonometria e ruído
- [x] Geradores dos seis tipos e `border-radius`
- [x] `Shape` e `shapeHostProps`
- [x] `useShapeMorph`
- [x] Testes CA-1 a CA-10
- [x] Playground
