# Ficha

## Spec

### Propósito

Card de papel do sistema: projetos, serviços, citações, contato. **Quando não usar:** para conteúdo que precisa de várias ações independentes dentro (a versão clicável tem um único link); para listas densas (use lista simples).

### Anatomia e slots

1. `<article>` hospedeiro, rotação fixa por seed (até `--shape-rotation-max`).
2. Camadas `Shape`: sombra dura `shadow-soft` (lg), preenchimento `surface-raised` desalinhado, contorno 2 px.
3. Fita adesiva opcional: `div` com `clip-path` gerado por `tornEdge` (bordas esquerda e direita rasgadas), cor `tape`, rotação própria. CSS, sem SVG.
4. Furos de caderno opcionais: coluna à esquerda com gradientes radiais (`hole`, `hole-rim`), posições e tamanhos variando por seed. CSS, sem SVG.
5. Slots: `media`, `eyebrow`, `title`, `children` (corpo), `footer`.

### Variantes e tamanhos

| Prop      | Valores                                                                             |
| --------- | ----------------------------------------------------------------------------------- |
| `edge`    | `wobbly` (padrão, `wobblyRect`) ou `torn` (`tornEdge` com a borda de baixo rasgada) |
| `tape`    | `false` (padrão), `left`, `right`                                                   |
| `holes`   | `false` (padrão), `true`                                                            |
| `href`    | torna a ficha clicável: um link único no título cobrindo o card                     |
| `titleAs` | `h2`, `h3` (padrão), `h4`                                                           |
| `padding` | `md` (padrão), `lg`                                                                 |
| `rotate`  | `true` (padrão) ou `false`                                                          |

### Estados

| Estado                    | Comportamento                                                                    |
| ------------------------- | -------------------------------------------------------------------------------- |
| Padrão                    | Papel com sombra suave.                                                          |
| Hover (clicável)          | Sobe 2 px e a sombra cresce para `lg` + 2 px; título em `primary-text-hover`.    |
| Foco visível (clicável)   | O `outline` vai para a ficha inteira (`:has(a:focus-visible)`), seguindo o raio. |
| Ativo (clicável)          | Volta à posição e a sombra encolhe.                                              |
| Desabilitado, selecionado | Não se aplicam.                                                                  |
| Carregando                | Use `Skeleton` com a mesma forma no lugar da ficha.                              |
| Erro                      | Mensagem inline no corpo, no padrão MS-02.                                       |

### Teclado

Clicável: Tab foca o link do título, Enter navega. Não há outros focáveis dentro (sem links aninhados).

### ARIA e nome acessível

`<article>` com o título como cabeçalho. Clicável: o nome do link é o título (que precisa se entender sozinho, ex.: "Nexuscoop"); a pseudo-camada `::after` amplia a área de clique sem duplicar o link. Fita e furos são `aria-hidden`.

### Irregularidade

`wobblyRect` bucket `lg` (ou `tornEdge`), seed = `seed` ou título. Rotação −1 a 1 × `--shape-rotation-max`. Fita: seed + `:fita`, rotação de −4° a 4° (decoração, fora do limite de 1,5° que vale para elementos com texto). Padding interno ≥ 24 px (> amplitude 5,6 px + traço); com furos, padding esquerdo ≥ 52 px.

### Alto contraste e movimento

`forced-colors`: camadas somem, borda real com o raio; fita e furos somem. Movimento reduzido: sem subir no hover; a rotação fixa continua (não é movimento).

### Ficha de Texto

1. Quem lê: visitantes escaneando projetos e serviços.
2. Grade de Tom: boas-vindas, acolhedor com entusiasmo baixo.
3. Título: nome do projeto ou do serviço; subtítulo curto ("Projeto para a [a confirmar: cliente]").
4. Ações: o link é o título; rodapé com `LinkText` só na versão não clicável.
5. Ajuda: não se aplica.
6. Termos: "projeto", "caso".
7. Estados: carregando (Skeleton), com dados; vazio e erro ficam na lista que contém as fichas.
8. Erros: não se aplica.
9. Sucesso: não se aplica.
10. Números: eyebrow numérica ("01") é rótulo, não quantidade.
11. Dados fictícios nos testes ("Projeto fictício A").
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Renderiza `article` com título, corpo, eyebrow, mídia e rodapé nos slots.
- [x] CA-2 Clicável tem exatamente um link, com o nome do título, e nenhum link aninhado.
- [x] CA-3 No máximo 3 SVGs; fita e furos sem SVG.
- [x] CA-4 Título longo com acentos e duas linhas não é cortado (padding ≥ amplitude) com 3 seeds.
- [x] CA-5 Mesma seed, mesma rotação e contorno.
- [x] CA-6 jest-axe sem violações.

## Plan

`src/components/ui/card/*`. Server Component (`useId` no servidor). Risco: rotação deixa texto levemente inclinado; mantido abaixo de 1,5° e sem `will-change`.

## Tarefas

- [x] Ficha
- [x] Componente e testes
- [ ] Vitrine
