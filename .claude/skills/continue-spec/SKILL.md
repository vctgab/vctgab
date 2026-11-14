---
name: continue-spec
description: SDD fase 2 no portfólio vctgab — executar as tarefas de uma ficha aprovada em docs/specs/, validar cada passo (lint, tipos, testes, tokens:build), revisar e deixar a vitrine em dia. Use quando o usuário invocar continue-spec com o nome da ficha.
---

# continue-spec

**Fase 2: Execução.**

## Propósito

Implementar o que a ficha aprovou, como gerente de sessão: delegar tarefas, validar de forma escopada e só dar por pronto o que tem teste ou captura.

## Workflow

### Step 1: Carregar contexto

1. `CLAUDE.md`
2. `docs/specs/<nome>.md` (a ficha)
3. `docs/RULES.md` e `docs/DESIGN-SYSTEM.md`
4. Skill `design-system` (UI ou texto) e `data-protection` (dados de pessoas)

### Step 2: Pré-requisitos

- A ficha existe e tem Spec, Plan e Tarefas. Senão: "Rode start-spec primeiro."
- Se o grafo existir, usar `graphify query` / `path` / `explain` antes de Grep amplo.

### Step 3: Executar tarefas

Para cada tarefa pendente da ficha:

1. Delegar ao agente `implementer` (ou `sisyphus-junior` se for mecânica), com a tarefa, os critérios relacionados e o lembrete:

```
Ficha: docs/specs/<nome>.md
Seguir a ficha à risca. Padrão de estados do Button; tokens semânticos; forma pelo motor;
texto pela Grade de Tom; números por @/lib/format; nomes de arquivo em inglês.
Handoff: Decisão, Racional, Alterações, Verificação. Responder em PT-BR.
```

2. Validar **escopado** aos arquivos tocados:
   - `pnpm exec eslint <arquivos>`
   - `pnpm typecheck`
   - `pnpm exec vitest related <arquivos> --run`
   - `pnpm tokens:build` se mexeu em `src/styles/` ou em `src/lib/color/`
3. Agente `quality-gate` modo `fix` no escopo da tarefa.
4. Marcar a tarefa e os critérios comprovados na ficha.

### Step 4: Validação completa (uma vez)

- `pnpm check` (lint, tipos, testes, build)
- Servidor de produção na porta 3100 **reiniciado depois do build** (servidor velho serve CSS de outro build): `pnpm test:e2e`
- Mudança visual: `pnpm screenshots` e **olhar as capturas** (torto de propósito é bom; quebrado não)

Esta máquina já teve quedas intermitentes do Node e corrupção de mensagens entre Playwright e Chromium (`docs/DECISIONS.md`, D-511 e D-701). Se uma falha não se repetir ao rodar de novo e não apontar para o código, registrar como instabilidade, não como violação.

### Step 5: Revisão

Agente `code-reviewer` (readonly) sobre o diff. Apresentar Críticos, Importantes e Nits; não aplicar correções sem aprovação.

### Step 6: Parar

Não fechar a ficha aqui: aguardar `archive-spec`.

## Regras críticas

1. Ficha é a fonte da verdade; não expandir escopo.
2. Validação escopada por tarefa; suíte completa uma vez no fim.
3. Componente novo ganha seção na vitrine `/sistema`.
4. Commits convencionais, sem assinatura de ferramenta.
