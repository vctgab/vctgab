@AGENTS.md

# Portfólio de Victor Gabriel: design system

Portfólio de desenvolvimento de Victor Gabriel (front-end/full stack, Teresina, PI, vindo do design de produto). Esta fase entrega o ambiente, o design system completo, a vitrine `/sistema`, o hero dinâmico e o rodapé com árvores. As páginas reais (Home, Projetos, Nexuscoop, Sobre, Contato) serão montadas depois apenas compondo estes componentes.

## Conceito

Caderno de campo desenhado à mão. Contornos, formas e posições nunca são retos nem perfeitamente alinhados. A irregularidade **nunca** atrapalha a função: texto nítido e dentro de áreas seguras, áreas de toque retangulares de 44 px ou mais, contraste intacto.

- Primária rosa `#EE2476` (tema `ipe`). Escalas de 11 passos derivadas por `color-mix` em sRGB. Componentes só usam tokens semânticos.
- Quatro temas por `data-theme` no `<html>`: `ipe` (padrão), `noturno`, `outono`, `inverno`. Um tema novo é um bloco em `src/styles/themes.css` mais uma cena em `src/components/footer-scene/scenes.ts`.
- Proibido: relevo topográfico, curvas de nível, mapas de trilha, shadcn/ui, gradientes roxos, emoji, pixel art, nomes ou personagens de franquias.
- Irregularidade vem do motor `src/lib/shapes` (geometria determinística). Nunca `feDisplacementMap` nem filtro em contorno, interação ou texto. Nunca `Math.random` (use o PRNG com seed).

## Comandos

```bash
pnpm dev            # servidor de desenvolvimento
pnpm tokens:build   # valida tokens e gera matriz de contraste (falha se reprovar)
pnpm lint           # ESLint (next + jsx-a11y), zero avisos
pnpm typecheck      # tsc estrito
pnpm test           # Vitest + Testing Library + jest-axe + varreduras de regra
pnpm build          # tokens:build + next build
pnpm test:e2e       # Playwright + axe em /sistema nos 4 temas e capturas (precisa do build)
pnpm check          # lint + typecheck + test + build
```

## Método (SDD)

Nenhum componente sem ficha. Antes do código, escreva `docs/specs/<componente>.md` a partir de `docs/specs/_MODELO.md`: Spec (o quê, por quê, critérios de aceite), Plan (como, arquivos, riscos) e Tarefas, com Ficha de Texto e Grade de Tom. Pronto só quando cada critério tiver teste ou captura. Toda decisão e toda dependência nova vão para `docs/DECISIONS.md`.

## Regras de texto (resumo; a fonte é `docs/REGRAS.md`)

- Português do Brasil. Só a primeira letra maiúscula em títulos, botões e rótulos (exceto siglas e nomes próprios).
- Voz de sistema (erro, formulário, confirmação, vazio, carregando): sem "Ops", "Uau", gíria, humor, emoji, caixa-alta ou exclamação. Nunca culpar quem usa: diga o que informar.
- Camada de mistério (dicas dos achados, terminal, 404, anotações em Caveat) pode ter humor leve. Erros e formulários nunca.
- Botões com verbo + objeto. Links que se entendem fora do contexto. Botão desabilitado mostra o motivo em texto visível.
- Falha: "Não foi possível <verbo> <objeto>", causa, o que fazer, o que houve com os dados. Nada técnico. Erro inline, nunca toast.
- Cinco estados em todo componente com dados: carregando, vazio (primeiro uso, filtro, falha), erro, indisponível, com dados.
- Números e datas só por `@/lib/format`. Dados fictícios marcados; fato ausente vira `[a confirmar: o que falta]`.
- Termos: ver `docs/GLOSSARIO.md` ("achados", "tema", "projeto", "caso").

## Regras de qualidade

- Contraste calculado: texto 4,5:1, componentes e foco 3:1, todos os estados e temas (`pnpm tokens:build`).
- Rosa: preenchimento com texto branco no passo 600 (hover 700, ativo 800); texto em primária no 600+; passo 500 só decoração, títulos 24 px+ e foco.
- Sem hex nem espaçamento arbitrário (`p-[13px]`) fora de `src/styles/tokens.css`, `src/styles/themes.css` e `src/lib/color`. Varredura em `tests/unit/regras.test.ts`.
- Padrão de estados copiado do Button: hover um passo mais escuro, ativo dois, foco desenhado a 3:1, desabilitado com motivo. Movimento de estado até 200 ms; decorativo sempre com equivalente estático em `prefers-reduced-motion`.
- Até 3 camadas SVG por componente; nenhum filtro SVG em elemento interativo; `forced-colors` troca camadas por bordas reais.
- Next 16 com `cacheComponents`: nada de valor aleatório ou relógio no render do servidor; relógio só após montar.
