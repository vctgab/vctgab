# Relatório da fase 2: verificação e Home

> Em construção durante a fase. As seções são preenchidas ao fim de cada etapa.

## Varredura do histórico (0.2)

### Como foi feita

- **Revisões varridas:** as 15 que existem no repositório local, não só as alcançáveis pelo `main`: as do `git rev-list --all`, as do reflog e as inalcançáveis listadas pelo `git fsck --unreachable` (`9bcd76a`, `a6450b3`, `e85729c`). Em cada uma, `git grep` no conteúdo inteiro do commit (o lockfile ficou de fora por ser gerado) e leitura da mensagem do commit.
- **Termos do outro projeto:** `supabase`, `azure`, `devops`, `cooperad*`, `convênio`/`convenio`, `operadora`, `faturament*`, `/painel`, `valentim`.
- **Nomes de pessoas:** extração de todas as palavras e sequências com inicial maiúscula de todas as revisões; ficaram para leitura as que nunca aparecem em minúscula (candidatas a nome próprio). Também busca direta por e-mails e telefones.
- **Segredos:** `api_key`, `secret`, `password`/`senha`, `token =`, `bearer`, chaves privadas (`BEGIN … KEY`), padrões de chave (`sk-`, `ghp_`, `AKIA`, JWT `eyJ…`) e qualquer arquivo `.env*`, `.pem`, `.key` ou `credentials` em qualquer revisão.

### Achados

| #   | Commit(s)                                             | Arquivo             | Trecho                                                                                                                        | Situação                                                                                                                                                                                                           |
| --- | ----------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `90a2226`, `edcea8d`, `29e4ede`, `74a5a18`, `be16fda` | `docs/DECISIONS.md` | D-801: "Saíram `mcp-workflow` e `database-advisor` e toda referência a **Azure DevOps, Supabase**, banco e ao outro projeto." | Nomes de ferramentas do outro projeto, citados como coisa removida. Corrigido na revisão atual (commit desta etapa); o comando de reescrita abaixo apaga dos commits antigos.                                      |
| 2   | `9bcd76a` (inalcançável)                              | mensagem do commit  | `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`                                                                     | Já reescrito antes desta fase: o `main` traz `2dd06ad` no lugar, sem a linha. O `9bcd76a` só existe no reflog local e foi enviado ao GitHub uma vez (`origin/main@{1}`), então pode seguir acessível lá pelo hash. |
| 3   | `e85729c` (inalcançável, nunca enviado)               | mensagem do commit  | `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`                                                                     | Substituído por `341636f` com `commit --amend`; só existe no reflog local.                                                                                                                                         |
| 4   | todos                                                 | metadados do commit | e-mail pessoal do autor (o do `git config`)                                                                                   | Não é resíduo nem segredo, mas fica público junto com o repositório. Opcional: trocar pelo e-mail `noreply` do GitHub na mesma reescrita (linha comentada no comando).                                             |

**Sem achados:**

- **Nomes de pessoas:** nenhum além de Victor Gabriel. Os candidatos a nome próprio são de tecnologia ou de lugar (Catmull, Taylor, Horner, Fortaleza, Teresina, Piauí, Georgia, Arial). "Nome fictício Ltda." é placeholder da vitrine.
- **Segredos:** nenhum. As ocorrências de "senha"/"secret" são falsos positivos ("desenha", "página secreta").
- **Arquivos `.env`:** só o `.env.example`, com `SITE_URL=[a confirmar: …]`. Nenhum `.pem`, `.key` ou credencial.
- **Pasta `reference/`** (protótipo com nomes de clientes): nunca entrou em nenhum commit.
- **Termos `cooperado`, `convênio`, `operadora`, `faturamento`, `/painel`, `Valentim`:** zero ocorrências em qualquer revisão.
- **Nomes autorizados** (Felicoop, Nexuscoop, Houer Tecnologia, OIA): aparecem só onde previsto. Os nomes de depoentes desta fase (seção E da Home) entram por pedido de Victor.

### Comando de reescrita (preparado, NÃO executado)

Só rodar depois de Victor escrever "Autorizo reescrever o histórico e fazer push --force-with-lease". Faz backup, reescreve num clone novo e envia com proteção de concorrência.

```bash
# 0. Ferramenta (não vem com o Git)
python -m pip install --user git-filter-repo

# 1. Backup completo do remoto
git clone --mirror git@github-personal:vctgab/vctgab.git vctgab-backup.git

# 2. Clone novo para a reescrita (o filter-repo exige clone recém-feito)
git clone git@github-personal:vctgab/vctgab.git vctgab-rewrite
cd vctgab-rewrite
REMOTE_SHA=$(git rev-parse origin/main)   # o lease protege contra push alheio

# 3. Troca do trecho do D-801 em todos os commits
cat > ../replacements.txt <<'EOF'
regex:Azure DevOps, Supabase, banco e ao outro projeto==>ferramentas, banco e termos do outro projeto
EOF

# 4. Reescrita: conteúdo + mensagens sem linha de coautoria
git filter-repo \
  --replace-text ../replacements.txt \
  --message-callback '
import re
return re.sub(rb"(?im)^\s*co-authored-by:.*$\n?", b"", message).rstrip() + b"\n"
'
# Opcional (achado 4): trocar o e-mail pessoal pelo noreply do GitHub
#   acrescente ao comando acima:
#   --email-callback 'return email.replace(b"<e-mail pessoal>", b"<id>+vctgab@users.noreply.github.com")'

# 5. Conferência antes de enviar (as duas buscas devem sair vazias)
git log --all --format=%B | grep -i "co-authored-by"
git grep -i -E "supabase|azure" $(git rev-list --all)

# 6. Envio com lease (o filter-repo remove o remoto; volta a apontar)
git remote add origin git@github-personal:vctgab/vctgab.git
git push --force-with-lease=main:$REMOTE_SHA origin main

# 7. No clone de trabalho (c:\Personal\vctgab), depois do envio:
#    git fetch origin && git reset --hard origin/main
#    git reflog expire --expire=now --all && git gc --prune=now
#    (apaga do disco os inalcançáveis 9bcd76a, a6450b3 e e85729c)
```

**O que a reescrita não resolve sozinha:** o `9bcd76a` já foi enviado ao GitHub uma vez. Mesmo fora de qualquer branch, o GitHub pode mantê-lo acessível pelo hash até a coleta de lixo do servidor. Para apagar de vez, abrir um pedido no suporte do GitHub ("remove cached views / unreachable commits") citando `9bcd76a9820347dbcea85330d73a33c5684b0c37` e, depois da reescrita, os hashes antigos dos commits `90a2226` em diante.
