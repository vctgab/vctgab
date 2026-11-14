---
name: archive-spec
description: SDD fase 3 no portfólio vctgab — conferir a implementação contra os critérios da ficha, fechar a ficha em docs/specs/, registrar em docs/specs/HISTORY.md e atualizar o grafo. Use quando o usuário invocar archive-spec com o nome da ficha.
---

# archive-spec

**Fase 3: Fechamento.**

## Workflow

### Step 1: Carregar

1. `CLAUDE.md`
2. `docs/specs/<nome>.md`

### Step 2: Conferir

- Cada critério de aceite tem teste ou captura que o comprova. Critério sem prova continua desmarcado e impede o fechamento, salvo aceite explícito do usuário.
- Todas as tarefas marcadas; a seção da vitrine existe.
- Se a implementação divergir da ficha, **atualizar a ficha para refletir a realidade** (não o código) e registrar o motivo em `docs/DECISIONS.md`.
- `pnpm exec eslint` e `pnpm typecheck` nos arquivos tocados.

### Step 3: Fechar

1. No topo da ficha, acrescentar `> Concluída em AAAA-MM-DD.` (a ficha continua em `docs/specs/`, porque é a documentação viva do componente).
2. Acrescentar a entrada em `docs/specs/HISTORY.md` (criar o arquivo se não existir):

```markdown
## AAAA-MM-DD — <nome>

- **Resumo**: <1–2 linhas: o que foi entregue e o efeito principal>
- **Ficha**: `docs/specs/<nome>.md`
```

O resumo tem no máximo 2 linhas; detalhes ficam na ficha.

3. Se `graphify-out/` existir, rodar `graphify update .`.

## Regras críticas

1. Não fechar com Crítico aberto do `code-reviewer` sem aceite explícito.
2. Resumo do histórico em até 2 linhas.
3. Não alterar código nesta fase.
