# CaseToc (sumário)

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. Decisão: D-1313.

## Spec

### Propósito

Sumário do caso: links para as seções, com a seção atual marcada. No desktop é uma coluna lateral fixa durante a rolagem; no celular é um bloco recolhível no topo. **Quando não usar:** navegação entre páginas (use o `Header`).

### Anatomia e slots

`items: { id: string; title: string }[]`. Desktop (a partir de `lg`): `<nav aria-label="Sumário">` `sticky` com a lista de links. Celular: `<nav aria-label="Sumário do caso">` com um botão "Sumário" que abre e fecha a lista (`aria-expanded`, `aria-controls`). Os dois compartilham o estado da seção atual (um `IntersectionObserver` observa as seções).

### Variantes e tamanhos

| Variante   | Uso                                                        |
| ---------- | ---------------------------------------------------------- |
| coluna     | `lg` e acima: fixa em `top-24`, 14 rem de largura          |
| recolhível | abaixo de `lg`: bloco no topo do corpo, fechado por padrão |

### Estados

Link: padrão, hover (um passo mais escuro), foco visível (anel a 3:1), ativo (dois passos), atual (`aria-current="location"`, barra desenhada à esquerda, texto em primária e peso médio: três indicadores além da cor). Bloco recolhível: fechado, aberto. Sem JavaScript: o bloco recolhível fica aberto e os links funcionam; nenhuma seção marcada. Carregando e vazio não se aplicam; erro não se aplica; indisponível: sem observador (navegador antigo), nenhuma seção marcada.

### Teclado

| Tecla           | Ação                                                   |
| --------------- | ------------------------------------------------------ |
| Tab             | percorre os links (celular: primeiro o botão do bloco) |
| Enter           | segue o link para a seção (o foco vai ao título dela)  |
| Enter ou Espaço | no botão do bloco: abre e fecha                        |
| Esc             | no bloco aberto: fecha e devolve o foco ao botão       |

### ARIA e nome acessível

`nav` nomeado; `aria-current="location"` no link da seção atual; botão com `aria-expanded` e `aria-controls`. Só uma das duas navegações existe para tecnologias assistivas por vez (a outra fica `display: none`).

### Irregularidade

Barra da seção atual: `handLine` vertical do motor, seed por item (`caso:toc:<id>`). Fundo do bloco recolhível: `wobblyRect` `md`. Um SVG por barra marcada e uma camada de fundo no bloco: até 2 por parte (SH-03).

### Alto contraste e movimento

`forced-colors`: a seção atual ganha sublinhado real. A rolagem para a âncora é instantânea com movimento reduzido.

### Ficha de Texto

1. Quem lê: quem quer pular para uma parte do caso.
2. Linha da Grade de Tom: navegação, voz de sistema, títulos das seções do copy.
3. Título e subtítulo: "Sumário".
4. Ações e rótulos: "Sumário" (botão), links com o título de cada seção.
5. Ajuda e placeholders: não há.
6. Termos novos ou dúvidas de glossário: nenhum.
7. Estados: ver acima.
8. Erros previstos: nenhum.
9. Confirmações e sucesso: a mudança da seção atual é visual e em `aria-current`, sem anúncio.
10. Números e datas: não há.
11. Apoio de IA e dados reais evitados: não há.
12. Exceções pedidas: nenhuma.

### Critérios de aceite

- [ ] CA-1 Um link por item, com `href="#<id>"` e o título da seção (componente).
- [ ] CA-2 O item passado em `current` (e depois o observado) leva `aria-current="location"` e não os demais (componente).
- [ ] CA-3 No celular, o botão "Sumário" tem `aria-expanded` e abre e fecha a lista; Esc fecha e devolve o foco (componente).
- [ ] CA-4 No desktop a coluna é `sticky` e fica visível ao rolar; no celular, o bloco recolhível está no topo (e2e).
- [ ] CA-5 Rolar até uma seção marca o item dela como atual (e2e).
- [ ] CA-6 Todo link e o botão têm alvo de 44 px ou mais (e2e).
- [ ] CA-7 jest-axe sem violações; axe nas 8 combinações (e2e do caso).

## Plan

`src/components/ui/case-toc/case-toc.tsx` (cliente: observador e estado) e `index.ts`, teste. Usa `Button` e `Icon`. Riscos: dois `nav` no DOM (um escondido por CSS: nomes diferentes e `display: none` evitam `landmark-unique`); marcação errada em seções curtas (o observador usa uma faixa de 20% a 30% da tela).

## Tarefas

- [x] Ficha
- [ ] Implementação
- [ ] Testes (um por critério)
- [ ] Seção na vitrine
