---
name: start-spec
description: SDD fase 1 no portfólio vctgab — entender o pedido, escrever a Ficha de Componente (Spec, Plan e Tarefas, com Ficha de Texto e Grade de Tom) em docs/specs/<nome-em-ingles>.md e aguardar aprovação. Use ao iniciar um componente, página ou mudança de comportamento, ou quando o usuário invocar start-spec. Não implementa.
---

# start-spec

**Fase 1: Planejamento.** Sem ficha, sem componente (regra PR-01).

## Propósito

Transformar um pedido em uma ficha completa e aprovável. **Não escrever código.** No vctgab a ficha é o spec e o plano ao mesmo tempo: um arquivo com as seções Spec, Plan e Tarefas, nesta ordem.

## Workflow

### Step 1: Carregar contexto

Ler, nesta ordem:

1. `CLAUDE.md` (raiz)
2. `docs/RULES.md` (regras com ID e teste)
3. `docs/DESIGN-SYSTEM.md` (princípios, tokens, como criar tema e componente)
4. `docs/GLOSSARY.md` (um termo por conceito)
5. `docs/specs/HISTORY.md` (se existir) e fichas parecidas em `docs/specs/`

Se o pedido tocar UI ou texto visível, carregar também a skill `design-system`. Se tocar dados de pessoas, clientes, contato ou formulários, carregar a skill `data-protection`.

### Step 2: Reaproveitar

- Procurar componente existente em `src/components/ui/` e seção da vitrine em `src/app/sistema/` que já resolva o pedido.
- Se o grafo existir (`graphify-out/graph.json`), usar `graphify query` / `path` / `explain` antes de Grep amplo.
- Se uma ficha parecida existir, partir dela em vez de reinventar.

### Step 3: Entender o pedido

- Esclarecer só o que faltar para >90% de certeza. Sem pessoa na sessão: decidir, registrar em `docs/DECISIONS.md` e seguir.
- Fato ausente nunca é inventado: vira exatamente `[a confirmar: o que falta]` (DD-01).
- Comunicar em português (PT-BR).

### Step 4: Escrever a ficha

Copiar `docs/specs/_TEMPLATE.md` para `docs/specs/<nome-em-ingles>.md` (nome de arquivo sempre em inglês; conteúdo em português) e preencher:

- **Spec:** propósito e quando não usar; anatomia e slots; variantes e tamanhos; estados (padrão, hover, foco visível, ativo, desabilitado com motivo, carregando, erro, selecionado); teclado; ARIA e nome acessível; irregularidade (tipo de forma, seeds, rotação, camadas, padding de segurança); alto contraste e movimento reduzido; **Ficha de Texto** (os 12 itens, com a linha da Grade de Tom); critérios de aceite verificáveis (CA-1…).
- **Plan:** como, arquivos tocados (pastas e arquivos em inglês), riscos.
- **Tarefas:** checklist que termina em "Testes (um por critério)" e "Seção na vitrine".

Componentes que exibem dados definem os **cinco estados** (carregando, vazio nos três casos, erro, indisponível, com dados — MS-04/MS-06).

### Step 5: Quality gate do plano

Chamar o agente `quality-gate` em modo `plan` sobre a ficha. Se houver critério testável, chamar o agente `tester` (readonly) para o plano de testes e anexá-lo ao Plan.

### Step 6: Aguardar aprovação

Apresentar um resumo da ficha (propósito, critérios, riscos) e **aguardar aprovação** antes do `continue-spec`. Sem pessoa na sessão: registrar a decisão em `docs/DECISIONS.md` e seguir.

## Regras críticas

1. Nenhum código nesta fase.
2. Ficha antes do código; nome de arquivo em inglês.
3. Ficha de Texto e Grade de Tom sempre que houver texto visível ou audível.
4. Critério de aceite sempre verificável por teste ou captura.
5. Nada de dado real de cliente; `[a confirmar: …]` no lugar de fato ausente.
