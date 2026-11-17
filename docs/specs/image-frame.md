# ImageFrame

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas.

## Spec

### Propósito

Moldura de imagem com proporção fixa. Com imagem, mostra a imagem com `alt`. Sem imagem, mostra a hachura do sistema com o rótulo da pendência (`[a confirmar: captura do Nexuscoop]`), para nunca haver espaço vazio nem imagem inventada. A hachura que existia só dentro do `Polaroid` passa a morar aqui, e o `Polaroid` usa este componente.

**Quando não usar:** foto de pessoa com legenda manuscrita (use `Polaroid`, que usa esta moldura por dentro); vídeo (use `VideoClip`); ícone (use `Icon`).

### Anatomia e slots

- Caixa com `aspect-ratio` fixo e `overflow: hidden` (a altura existe antes da imagem: sem CLS).
- `src` + `alt`: `<img>` com `loading="lazy"` e `object-fit: cover`.
- `placeholder`: conteúdo do estado pendente (texto ou `Fact`), centralizado sobre a hachura.

### Variantes e tamanhos

| `ratio`  | Uso                               |
| -------- | --------------------------------- |
| `video`  | 16:9, capturas de tela de projeto |
| `wide`   | 3:2, capturas na ficha de projeto |
| `square` | 1:1, foto do `Polaroid`           |

### Estados

Com imagem e pendente. Hover, foco, ativo, desabilitado, carregando e erro não se aplicam: não é interativo, e as imagens são estáticas do próprio site.

### Teclado

Não é focável.

### ARIA e nome acessível

Com imagem, o `alt` é obrigatório no tipo. Pendente: o rótulo é texto lido normalmente (a pendência é informação para quem revisa a página).

### Irregularidade

Nenhuma forma própria: a moldura fica dentro de um hospedeiro com forma (`Ficha`, `Polaroid`), que dá o contorno. A hachura é um gradiente com os tokens `--hatch-a` e `--hatch-b`.

### Alto contraste e movimento

`forced-colors`: a hachura some (fundo do sistema) e uma borda real de 1 px marca a moldura. Sem movimento.

### Ficha de Texto

1. Quem lê: visitantes (imagem) e Victor ao revisar (pendência).
2. Linha da Grade de Tom: pendência, sistema, `[a confirmar: captura do Nexuscoop]`.
3. Título e subtítulo: não há.
4. Ações e rótulos: não há.
5. Ajuda e placeholders: o rótulo da pendência vem do conteúdo (`pending(...)`).
6. Termos novos: nenhum.
7. Estados: com imagem e pendente; os demais não se aplicam (estático).
8. Erros previstos: nenhum.
9. Confirmações e sucesso: não há.
10. Números e datas: não há.
11. Dados reais evitados: testes e vitrine usam "Projeto fictício".
12. Exceções pedidas: nenhuma.

### Critérios de aceite

- [x] CA-1 Com `src`, renderiza `<img>` com o `alt` (obrigatório no tipo) e `loading="lazy"`.
- [x] CA-2 Sem `src`, renderiza a hachura com o rótulo e nenhuma `<img>`.
- [x] CA-3 A proporção é a do `ratio` (classe `aspect-*`), com ou sem imagem.
- [x] CA-4 jest-axe sem violações nos dois estados.
- [x] CA-5 O `Polaroid` sem foto continua mostrando o rótulo pela moldura.

## Plan

`src/components/ui/image-frame/{image-frame.tsx,image-frame.test.tsx,index.ts}` (Server Component). `Polaroid` troca o bloco interno pela moldura. Vitrine em `/sistema/conteudo`, ao lado do `Polaroid`.

## Tarefas

- [x] Ficha
- [x] Implementação
- [x] Testes (um por critério)
- [x] Seção na vitrine
