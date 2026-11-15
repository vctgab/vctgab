# Relatório da fase 2: verificação e Home

## Resumo

- **Etapa 0 (fundação):** CI no GitHub Actions (lint, tipos, testes, build, tokens e e2e com axe em chromium, webkit e firefox, sem novas tentativas); varredura de todas as revisões do histórico com o comando de reescrita pronto e **não executado**; três motores no Playwright com um spec só para os pontos de risco; fontes da primeira dobra com pré-carga que o Firefox reaproveita e CLS 0 sem pré-carregar as outras; todo texto e dado em `src/content/` com pendência tipada e `pnpm release:check`.
- **Etapa 1 (Home):** ficha `docs/specs/pages/home.md`, as nove seções pedidas, `Fact` e `VideoClip` novos (com ficha e vitrine), 404 "Trilha perdida", imagem Open Graph, sitemap, robots e JSON-LD.
- **Etapa 2 (QA):** axe sem violações nos 4 temas e nos três motores, teclado de ponta a ponta, CLS 0, capturas em 4 tamanhos × 4 temas × 3 motores, recortes de borda a 400%.
- **Meta não atingida:** Lighthouse mobile da Home no método padrão ficou em **70** (devtools 68), abaixo de 90. A seção "Lighthouse" diz, com números, o que limita.

Commits da fase (todos sem assinatura de ferramenta): `29e4ede`, `74a5a18` (mudanças que já estavam pendentes na árvore de trabalho antes da fase: regra de não assinar e foco dos campos, D-901 e D-902), `be16fda` (0.1), `9d9f515` (0.2), `592ce7a` (0.3), `b52a9d4` (0.4), `825dc48` (0.5), `1ddb2ae` (Home) e o commit da etapa 2.

## Resultado do CI (0.1)

PENDENTE_CI

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

**O repositório já é público** (conferido com `gh repo view` no fim da fase). Os commits antigos com o trecho do D-801 já estão visíveis; os da fase 2 foram enviados com push normal, sem reescrita.

**O que a reescrita não resolve sozinha:** o `9bcd76a` já foi enviado ao GitHub uma vez. Mesmo fora de qualquer branch, o GitHub pode mantê-lo acessível pelo hash até a coleta de lixo do servidor. Para apagar de vez, abrir um pedido no suporte do GitHub ("remove cached views / unreachable commits") citando `9bcd76a9820347dbcea85330d73a33c5684b0c37` e, depois da reescrita, os hashes antigos dos commits `90a2226` em diante.

## Navegadores (0.3)

Projetos `chromium`, `webkit` e `firefox` no Playwright, para o e2e e para as capturas (D-1003). Os pontos de risco viraram teste em `tests/e2e/engines.spec.ts` (D-1011).

| Ponto de risco                                 | Chromium                     | WebKit                                                   | Firefox                                     | O que foi feito                                                                                                              |
| ---------------------------------------------- | ---------------------------- | -------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `vector-effect` + `preserveAspectRatio="none"` | nítido                       | nítido                                                   | nítido                                      | Recortes 2x a 400% do sublinhado do hero e do link (`docs/screenshots/bordas/<motor>/`): espessura uniforme, sem borrão.     |
| `color-mix()`                                  | bate com o build             | bate com o build                                         | bate com o build                            | Teste compara cada token semântico pintado com o hex do `tokens:build`, nos 4 temas (±1 por canal).                          |
| `text-wrap: pretty`                            | sim                          | sim                                                      | **não**                                     | Sem correção: quebra padrão (NV-01 em `docs/EXCEPTIONS.md`).                                                                 |
| Hifenização pt-BR                              | sim                          | **não** (sem dicionário na build do Playwright)          | sim                                         | Sem correção no código; `overflow-wrap` evita transbordo (NV-02). Conferir num Safari real.                                  |
| Script de tema antes da primeira pintura       | ok                           | ok                                                       | ok                                          | Teste: o `data-theme` salvo já está no `<html>` quando o `<body>` entra; sistema escuro abre no noturno.                     |
| LiveClock                                      | ok                           | ok                                                       | ok                                          | Teste: hora de Teresina (±1 min), avança, nome acessível e console sem aviso.                                                |
| Tab em links                                   | ok                           | **pula links** (padrão do Safari)                        | ok                                          | Comportamento do navegador (NV-03). No WebKit os testes focam o link direto.                                                 |
| Pré-carga de fontes                            | ok                           | ok                                                       | **baixava duas vezes** e avisava no console | Corrigido (D-1010): pré-carga no HTML com `crossorigin="anonymous"`. Agora 4 requisições de fonte nos três motores.          |
| Espelhos nativos do Radix                      | fora da medição              | contavam como alvo de 12 × 12 px                         | fora da medição                             | O teste de alvo ignora `aria-hidden` com `tabindex=-1` (não são alvo).                                                       |
| H1 do hero a 390 px                            | quebrava em "Front-" / "end" | ok                                                       | ok                                          | Corrigido: "Front-end" sem quebra (D-1014).                                                                                  |
| `text-wrap: balance` no H1 do hero (desktop)   | 3 linhas                     | 4 linhas ("Front-end" / "com" / "visão de" / "produto.") | 3 linhas                                    | Sem correção: é o algoritmo de equilíbrio do WebKit; legível e sem transbordo (capturas em `docs/screenshots/home/webkit/`). |

## Fontes e desempenho (0.4)

- **Pré-carga:** só Fraunces e DM Sans (primeira dobra), por `<link rel="preload">` no HTML (D-1006, D-1010). Caveat, Patrick Hand e JetBrains Mono sem pré-carga.
- **Eixos da Fraunces (medido no arquivo latin):** opsz, wght, SOFT e WONK variáveis = 121 KB; WONK custa 0,2 KB; o SOFT variável custa 53 KB. Como SOFT só é usado em 100, o arquivo agora é a instância `SOFT@100` com wght e opsz: **62 KB, mesma aparência** (comparação lado a lado). Sem opsz cairia a 36 KB, mas a fonte troca de tamanho ótico, fica mais larga e muda as quebras; por isso o opsz ficou (D-1007).
- **Sem salto de layout:** o fallback automático da JetBrains Mono errava até 11 px por frase; agora é Courier New com `size-adjust: 100%` (mesmo avanço de 0,6 em). O chip de achados tem caixas de largura fixa. `tests/e2e/cls.spec.ts` atrasa as fontes sem pré-carga e exige **zero** layout-shift na Home e na vitrine, no mobile e no desktop; com todas as fontes atrasadas, o CLS também deu 0 (D-1009).

## Lighthouse (mobile, mediana de 3, servidor de produção local)

Não há preview da Vercel ligado ao repositório nesta máquina (sem `.vercel` e sem acesso à API do GitHub nesta sessão), então todos os números são locais. O job `lighthouse` do CI (D-1031) passa a dar uma medida independente a cada push.

| Página e momento                                                    | Simulado (padrão) | Devtools | FCP sim. | LCP sim. | TBT sim. | TBT devtools | CLS | Acessib. |
| ------------------------------------------------------------------- | ----------------- | -------- | -------- | -------- | -------- | ------------ | --- | -------- |
| `/sistema` antes das fontes                                         | 79                | 73       | 2,12 s   | 3,92 s   | 327 ms   | 1.307 ms     | 0   | 98       |
| `/sistema` depois das fontes                                        | **81**            | **75**   | 1,53 s   | 3,85 s   | 310 ms   | 855 ms       | 0   | 98       |
| Home, primeira versão                                               | 69                | 68       | 1,67 s   | 4,12 s   | 659 ms   | 2.369 ms     | 0   | 100      |
| Home final (morph na interação, caderno sob demanda, temas enxutos) | **70**            | **68**   | 1,69 s   | 4,07 s   | 629 ms   | 2.313 ms     | 0   | 100      |

SEO 60 na `/sistema` é o `noindex` proposital; na Home, SEO e boas práticas dão 100. Uma rodada devtools da Home teve duas execuções com nota 0 (o Lighthouse não terminou; TBT nulo). Foi refeita e é a que está na tabela (instabilidade da máquina, D-701). Resumos em `docs/qa/phase-2/*.summary.json`.

**O que limita, com números:**

1. **LCP simulado de 4,07 s, quase todo "atraso de render" (3,6 s).** O elemento é o parágrafo do hero, pintado junto com o FCP. No traço observado (sem limitação), a primeira pintura acontece em 637 ms, _depois_ de todo o JavaScript local terminar de carregar (574 ms). O Lantern então põe os 208 KB de JS (gzip) e a avaliação deles na cadeia do LCP, com rede de 1,6 Mbps e CPU 4× mais lenta. No devtools, com limitação real, o LCP é 2,4 s. É o mesmo artefato do D-709, e o LCP pesa 25% da nota.
2. **TBT de 629 ms (simulado) e 2,3 s (devtools).** As tarefas longas são a hidratação do React e do roteador do Next (117 KB gzip de framework, fixos) e o parse e layout do documento (444 KB de HTML, 100 KB com gzip; metade da marcação é caminho SVG das formas, que se repete no payload RSC). Desligar todas as animações, o fundo do hero, a faixa ou a cena do rodapé não mudou o bloqueio além do ruído (790 a 1.200 ms entre execuções idênticas a 4× de CPU).
3. **A máquina:** a mesma `/sistema` deu 90 a 92 no devtools na fase 1 e 73 a 75 hoje. O número local oscila mais que o efeito das mudanças.

**O que foi feito:** fontes (FCP simulado da vitrine de 2,12 s para 1,53 s, CLS 0); `tokens.generated.json` fora do cliente (82 KB para 1 KB); caderno de achados sob demanda; toast e terminal fora das páginas públicas; morph do hero só depois da primeira interação. Testado e descartado: `content-visibility` nas seções (D-1030).

**Para chegar a 90:** medir na URL de preview da Vercel (a rede real muda o traço observado e, com ele, o LCP simulado); se ainda faltar, reduzir o HTML das formas (um caminho por forma com `<use>` nas três camadas, em vez de três cópias) e tirar do cliente o que só precisa de CSS (botões que são links).

## Conteúdo e bloqueio de publicação (0.5)

- `src/content/site.ts` (nome, domínio, contatos, redes), `home.ts` (textos da Home) e `projects.ts` (projetos), com tipos estritos (D-1017). Dado ausente é `pending("o que falta")`; a tela mostra `[a confirmar: o que falta]` com fundo e sublinhado tracejado (`Fact`).
- Links de contato montados em `src/lib/contact` a partir do `site.ts`: "Vamos conversar" vai ao WhatsApp quando houver número e, até lá, a `#contato` (ou `/#contato` fora da Home); "Solicitar orçamento" cai para e-mail com assunto "Orçamento" (D-1015).
- `pnpm release:check` lista pendências do conteúdo, marcas `[a confirmar: …]` escritas no código das páginas públicas, links para rotas inexistentes e links para páginas provisórias, e falha se houver algum (D-1018). No CI é um job informativo.

## O que foi construído na Home

Ficha em `docs/specs/pages/home.md` (tipo, tarefa do visitante, seções, estados de relógio e vídeo, Ficha de Texto com a Grade de Tom, achados e 12 critérios). Ordem e função das seções seguindo a referência, sem copiar texto, números, marca ou visual:

- **A. Cabeçalho:** logo, Projetos, Sobre, Contato, botão de tema com ícone novo (`tema`) que abre o popover com as 4 amostras, CTA "Vamos conversar". Sem `cmd`. Menu mobile em Drawer; o CTA do menu leva ao contato sem o foco puxar a página de volta ao topo.
- **B. Hero:** o da vitrine, agora com textos do conteúdo; agenda com o mês pendente; Teresina • Brasil; LiveClock; pinha escondida.
- **C. Faixa:** quatro fichas (01 a 04) com cliente, papel, tipo e entrega conforme o pedido, links para `/projetos/<slug>` sem pré-busca; "Ver todos os projetos".
- **D. Serviços, E. Depoimentos (4 nomes, textos pendentes), F. Prova** (Stat "De 34% para 89%" com método e `VideoClip` pendente, sem player vazio), **G. Sobre** (três fatos verificados em negrito, 4 polaroids pendentes, "Mais sobre mim"), **H. Contato** (sem formulário; e-mail, GitHub, LinkedIn pendente; coruja do correio escondida), **I. Rodapé** da fase 1.
- **404 "Trilha perdida"**, imagem Open Graph 1200 × 630 com as formas do motor, `metadataBase` pela `SITE_URL` (padrão `https://vctgab.com.br`), sitemap sem `/sistema`, robots bloqueando `/sistema`, JSON-LD `Person` com nome, cargo, URL e GitHub.
- **Componentes novos, com ficha, teste e vitrine:** `Fact` e `VideoClip`. Ajustes com ficha atualizada: `Ficha` (`prefetch`), `LinkText` (`mailto:`), `Drawer` (`onCloseAutoFocus`), `Header`, `Hero`, ícone `tema`, desenho `Coruja`.

## QA da Home (etapa 2)

| Porta                                    | Resultado                                                                                                                                                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test:e2e` (3 motores, sem repetir) | **223 aprovados, 0 falhas, 11 pulados** (o CLS só tem API no Chromium; o percurso por Tab é pulado no WebKit pela NV-03). Nenhuma nova tentativa.                                                               |
| axe na Home                              | 0 violação nos 4 temas × 3 motores (WCAG 2.0 a 2.2 A e AA), console sem erro nem aviso de hidratação.                                                                                                           |
| axe na vitrine                           | 0 violação nas 11 páginas × 4 temas × 3 motores.                                                                                                                                                                |
| CLS                                      | 0 na Home e na vitrine, mobile e desktop, com as fontes sem pré-carga atrasadas; 0 também com todas atrasadas; 0 no Lighthouse.                                                                                 |
| Teclado                                  | Percurso completo da Home por Tab (Chromium e Firefox), seletor de tema (abre, seta troca, Esc fecha e devolve o foco, persiste), menu mobile (Esc, foco de volta, CTA para a âncora), pinha e coruja (2 de 7). |
| Alvo de toque                            | Todo controle da Home com 44 px ou mais, a 390 e a 1366 px.                                                                                                                                                     |
| Movimento reduzido                       | Nenhuma animação rodando na Home.                                                                                                                                                                               |
| Capturas                                 | 390×844, 768×1024, 1366×768 e 1440×900, nos 4 temas e nos 3 motores, página inteira (`docs/screenshots/home/<motor>/<tema>/`).                                                                                  |
| Recortes a 400%                          | CTA do hero, ficha da faixa e polaroid da Home, além de botão, chip, ficha e traços da vitrine, nos 3 motores (`docs/screenshots/bordas/<motor>/`): bordas vetoriais nítidas.                                   |

**Olhando as capturas, foi corrigido:** canais de contato que quebravam de jeitos diferentes no mobile (agora empilhados); faixa clara do espaço do chip fixo abaixo do rodapé escuro (agora na cor do rodapé); polaroids enormes no tablet (grade limitada abaixo de 1024 px); "Front-" / "end" no H1 do Chromium; sublinhado longo demais na imagem Open Graph.

**Ficou como está, de propósito:** o chip "Achados" aparece no meio das capturas de página inteira porque é fixo no canto da tela; a primeira ficha da faixa aparece cortada na borda esquerda porque a faixa está em movimento.

## Decisões e desvios

Todas em `docs/DECISIONS.md` (D-1001 a D-1031). As que mudam o que foi pedido:

- **Lighthouse 90 no método padrão: não atingido** (Home 70, devtools 68). Os motivos, com números, estão na seção "Lighthouse"; falta medir num preview real.
- **Nome do relatório:** `docs/REPORT-phase-2.md` em vez de `REPORT-fase-2.md`, pela regra de nomes em inglês; `docs/REGRAS.md` e `docs/EXCECOES.md` do pedido são `docs/RULES.md` e `docs/EXCEPTIONS.md` (D-1004).
- **Reescrita do histórico não executada**, como pedido. A assinatura do `9bcd76a` já tinha saído do `main` antes desta fase; o que sobra é o objeto no reflog local e, possivelmente, no cache do GitHub (precisa de pedido ao suporte).
- **Divergências de navegador sem correção** (NV-01 a NV-03) ficam em `docs/EXCEPTIONS.md` com data limite de 14/05/2027 e aprovação **pendente** de Victor.
- **"Solicitar orçamento"** cai para e-mail com assunto (não para `#contato`, que seria a própria seção) enquanto o WhatsApp estiver pendente (D-1015).
- **Rótulos do hero** continuam como pílulas (`Tag`), em minúsculas como no pedido (D-1020).
- **`release:check`** também acusa links para páginas provisórias (`/projetos`, `/sobre`, `/contato`) e marcas `[a confirmar]` escritas direto no código (D-1018).
- **Vídeo na vitrine:** sem arquivo real no repositório, a vitrine mostra os estados indisponível e vazio; carregando, erro e com vídeo estão cobertos por teste.
- **Pré-carga das fontes** saiu do `next/font` para `<link>` no HTML e `@font-face` próprio, para o Firefox não baixar duas vezes (D-1010).
- **Mudanças pendentes na árvore antes da fase** (regra de não assinar e foco dos campos, D-901 e D-902) foram commitadas em separado, no começo, depois de passar nos testes.

## Lista do release:check

Saída de `pnpm release:check` no fim da fase: **37 itens**.

**Pendências no conteúdo (25):** número do WhatsApp; perfil do LinkedIn; mês da agenda aberta; cargo e empresa, e depoimento, de Natália Oliveira, Diogo Reis, Eduardo Silva e Jecielly Mota (8); vídeo do Nexuscoop (até 30 s, sem som), legenda, quadro de capa e descrição do vídeo (4); fotos 1 a 4 de Victor (4); tipo do projeto Nexuscoop, OIA, Cinnatra e Kasb Health (4); entrega do OIA e do Cinnatra (2).

**Marcas escritas no código (3):** conteúdo das páginas provisórias (`placeholder-page.tsx`); conteúdo da página secreta (`finds-card.tsx` e `secret-page-notice.tsx`).

**Links para rotas inexistentes (4):** `/projetos/nexuscoop`, `/projetos/oia`, `/projetos/cinnatra`, `/projetos/kasb-health` (fichas da faixa; hoje levam à 404 "Trilha perdida").

**Links para páginas provisórias (5):** `/projetos`, `/sobre`, `/contato` (navegação global) e `/projetos`, `/sobre` (Home: "Ver todos os projetos" e "Mais sobre mim").

Observação: o papel no OIA e no Cinnatra não foi informado e não aparece nas fichas (não é pendência listada porque o pedido não pediu esse campo para eles).

## Próximos passos sugeridos

1. **Autorizar (ou não) a reescrita do histórico** com a frase combinada; depois, pedir ao suporte do GitHub a remoção do `9bcd76a` em cache. Se o repositório for público, considerar trocar o e-mail pessoal dos commits pelo `noreply` do GitHub na mesma reescrita.
2. **Ligar a Vercel ao repositório** e medir o Lighthouse na URL de preview; com o número real, atacar o HTML das formas (`<use>`) e os botões que são links, se ainda faltar para 90.
3. **Projetos:** página de lista (`/projetos`) com filtro por tipo e as quatro páginas `/projetos/<slug>`; com elas, o `release:check` deixa de acusar os links. Achados da chave e da bússola.
4. **Caso Nexuscoop:** página longa com o vídeo de 30 s (o `VideoClip` já está pronto) e o resultado do teste de árvore com o método.
5. **Sobre:** texto, fotos e os achados do lápis e da pena.
6. **Contato com o achado da mesa:** formulário quando houver backend (estados de envio, erro que preserva o texto, MS-02).
7. **Terminal `cmd`:** comandos e a volta do botão ao cabeçalho.
8. **Preencher as 25 pendências** em `src/content/` e rodar `pnpm release:check` até aprovar; então tornar o job de release do CI bloqueante.
9. **Máquina local:** diagnóstico de memória do Windows e Node 26 LTS (D-511, D-701).
