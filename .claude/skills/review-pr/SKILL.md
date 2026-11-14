---
name: review-pr
description: >-
  Revisão de entrega de terceiros (PR do GitHub, branch ou patch) no portfólio
  vctgab. Busca o diff com gh/git, monta o pacote de contexto, roda o subagente
  pr-reviewer e entrega rascunhos de comentário para o usuário colar. SOMENTE
  LEITURA: nunca publica nada. Use quando o usuário pedir "revisar PR", "review
  da PR #N", "revisar branch X" ou colar link de PR. Para mudanças locais
  pós-tarefas, use o agente code-reviewer (continue-spec).
---

# review-pr

## Papéis

| Camada            | Responsabilidade                                                          |
| ----------------- | ------------------------------------------------------------------------- |
| Esta skill        | Coletar entradas, montar o pacote, lançar o subagente, entregar rascunhos |
| Agente pai (você) | Adaptador `gh`/`git` para obter PR e diff                                 |
| `pr-reviewer`     | Julga a entrega contra as regras do repositório; sem escrita              |

## Somente leitura (regra fixa)

- **Permitido:** `gh pr view`, `gh pr diff`, `gh pr list`, `gh pr checks`, `gh pr status`, `git diff`, `git log`, `git show`.
- **Proibido:** `gh pr review|comment|merge|close|reopen|edit|ready|create`, `gh issue` de escrita, `gh api` (qualquer método), `git push`.
- Se o usuário pedir para publicar, recusar e entregar o texto para colar.

## Step 1 — Entradas

1. **Entrega** (obrigatório): URL ou número da PR, nome da branch ou caminho local.
2. **Ficha** (opcional): `docs/specs/<nome>.md` que a entrega implementa. Sem ficha → modo **rules-only**.

## Step 2 — Buscar o diff

- GitHub: `gh pr view <n> --json title,body,baseRefName,headRefName,files` e `gh pr diff <n>` (por arquivo se for grande).
- Branch ou local: `git diff <base>...<branch>` e `git log <base>..<branch> --oneline`.

Sem diff acessível → parar e reportar. Não revisar de memória.

## Step 3 — Pacote

```text
## Mode
spec-backed | rules-only

## Repository root
<caminho absoluto>

## Spec
<conteúdo da ficha (critérios de aceite) — ou: none — rules-only review>

## Delivery
- Reference: <link ou id>
- Summary: <o que mudou>
- Changes:
<diff por arquivo>
```

## Step 4 — Subagente

Uma chamada `Agent` com `subagent_type: pr-reviewer`, o pacote completo e o pedido do formato de saída de `.claude/agents/pr-reviewer.md`. Falhou → tentar uma vez; persistindo, reportar.

## Step 5 — Entregar

Contagem por severidade, seções do relatório e a tabela de rascunhos. Cada texto sugerido sai pronto para colar, em tom de engenheiro, sem menção a ferramenta de IA e sem trailers de coautoria. O usuário decide o que publicar.
