# Página: Home

> Ficha de página. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. A ordem e a função das seções seguem a home de referência (jonasmilan.cc), sem copiar texto, números, marca ou visual dela. Tudo vem do design system.

## Spec

### Tipo de página e tarefa

- **Tipo:** página de entrada e de conversão (portfólio de serviço).
- **Público principal:** clientes freelance (fundadores e equipes que precisam de produto no ar). **Secundário:** tech leads e recrutadores.
- **Tarefa do visitante:** em 10 segundos entender o que Victor faz (front-end com visão de produto, React e Next.js), ver prova real (projetos, resultado com método, depoimentos) e chamar (WhatsApp ou e-mail).
- **Quando não usar este modelo:** páginas de caso (longas, narrativas) e páginas de lista (Projetos).

### Seções (ordem e função)

| #   | Seção      | Função                                          | Componentes                                                                                               |
| --- | ---------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| A   | Cabeçalho  | Orientar e oferecer a chamada em qualquer ponto | `Header` (Logo, links, `ThemeSwitcher` compacto em `Popover` com botão de ícone, CTA, `Drawer` no mobile) |
| B   | Hero       | Dizer o que Victor faz e chamar                 | `Hero` (placa, `Tag`, `Button`, `LiveClock`, `Fact`, `Achavel` pinha)                                     |
| C   | Faixa      | Mostrar que há projetos reais, levar à lista    | `Marquee`, `Ficha` com link, `LinkText`                                                                   |
| D   | Serviços   | Dizer o que é contratável                       | `Section`, lista numerada, `Tag`                                                                          |
| E   | Depoimento | Prova social                                    | `Quote`                                                                                                   |
| F   | Prova      | Resultado medido e produto em uso               | `Stat`, `VideoClip` (nasce nesta fase)                                                                    |
| G   | Sobre      | Quem é, com fatos verificados                   | `Section`, `Polaroid` × 4, `Button`                                                                       |
| H   | Contato    | Chamar de novo, com canais                      | `Section`, `Button`, `LinkText`, `Fact`, `Achavel` coruja                                                 |
| I   | Rodapé     | Encerrar com marca, links e achados             | `Footer` com `FooterScene` e `AchadosChip`                                                                |

Sem formulário nesta fase (não há backend). O botão `cmd` do terminal fica fora até o terminal existir.

### Componentes que nascem ou mudam

- **`Fact`** (novo, `docs/specs/fact.md`): mostra um valor do conteúdo ou a marca `[a confirmar: …]` destacada.
- **`VideoClip`** (novo, `docs/specs/video-clip.md`): vídeo curto sem som, com legenda e controles; enquanto pendente, uma `Ficha` marcada como pendência, sem player vazio.
- **Ícone `tema`** (`docs/specs/icon.md`): botão do seletor de tema no cabeçalho.
- **`Ficha`** ganha `prefetch` (`docs/specs/card.md`): links para rotas que ainda não existem não fazem pré-busca (evita 404 no console).
- **`LinkText`** trata `mailto:` e `tel:` como link simples, sem nova aba (`docs/specs/link-text.md`).
- **`Header`**: tema por botão de ícone; sem `cmd`; CTA pelo `talkHref` (`docs/specs/header-footer.md`).
- **`Hero`**: textos de `src/content/home.ts`; mês da agenda por `Fact` (`docs/specs/hero-footer.md`).
- **Desenho `Coruja`** para o achado do contato (`docs/specs/finds.md`).
- **404 "Trilha perdida"** (`src/app/not-found.tsx`), camada de mistério.

### Estados das partes com dados

| Parte                 | Carregando                                               | Vazio                                  | Erro                                                                            | Indisponível                                                  | Com dados                     |
| --------------------- | -------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------- |
| Relógio (`LiveClock`) | Antes de montar: espaço reservado sem número (sem salto) | Não se aplica (sempre há hora)         | Não se aplica (relógio local; sem rede)                                         | Sem JavaScript: o espaço fica vazio, o resto da linha segue   | `HH:mm:ss` de Teresina        |
| Vídeo (`VideoClip`)   | Capa e "Carregando vídeo" até o primeiro quadro          | "Este projeto ainda não tem vídeo."    | "Não foi possível carregar o vídeo. Verifique a conexão e recarregue a página." | Ficha "Vídeo do Nexuscoop" com `[a confirmar: …]`, sem player | Vídeo com controles e legenda |
| Depoimentos (`Quote`) | Esqueleto (já existe)                                    | "Ainda não há depoimentos publicados." | "Não foi possível carregar os depoimentos." (já existe)                         | Já existe; não usado: nomes confirmados, textos pendentes     | Troca entre os 4 depoentes    |
| Agenda (`Fact`)       | Não se aplica (conteúdo estático)                        | Não se aplica                          | Não se aplica                                                                   | `[a confirmar: mês da agenda aberta]` destacado               | "Agenda de dezembro aberta"   |

### Achados nesta página

- **Pinha escondida** (já existe, no hero, entre as formas).
- **Coruja do correio** (nova): pousada ao lado dos canais de contato. Botão de 44 px, nome acessível "Algo pousado perto do correio"; ao achar, "Coruja do correio, achado".

### Teclado

Ordem: Pular para o conteúdo → Logo → Projetos, Sobre, Contato → Escolher tema (abre o popover; setas trocam o tema; Esc fecha e devolve o foco) → Vamos conversar → pinha → CTA do hero → fichas da faixa (só as originais; a cópia é `inert`) → Ver todos os projetos → depoentes (setas) → Mais sobre mim → Solicitar orçamento → e-mail, GitHub → coruja → rodapé → chip de achados. No mobile, o menu abre em `Drawer` com foco preso e Esc.

### ARIA e nome acessível

`main#conteudo`; um `h1` (hero); cada seção é `section` nomeada pelo seu `h2`; a faixa tem `h2` só para leitores de tela ("Projetos em destaque") e a região `Marquee` com `aria-label`. Botão de tema: `aria-label="Escolher tema"`. Links externos anunciam "(abre em nova aba)". JSON-LD `Person` em `<script type="application/ld+json">`.

### Irregularidade

Só pelo motor e pelos componentes; seeds por seção (`home:*`). Nenhuma forma nova fora dos componentes.

### Alto contraste e movimento

Herdados dos componentes: `forced-colors` troca camadas por bordas; com movimento reduzido, hero parado, faixa vira rolagem manual, `Reveal` desligado, vídeo sem reprodução automática.

### Ficha de Texto

1. **Quem lê:** fundadores e equipes que contratam front-end (principal); tech leads e recrutadores (secundário). Leitura rápida no celular.
2. **Grade de Tom:**

| Situação          | Voz            | Texto final                                                                                                                                                            |
| ----------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Título do hero    | sistema, sério | "Front-end com visão de produto."                                                                                                                                      |
| Parágrafo do hero | sistema        | "Desenvolvo interfaces em React e Next.js para fundadores e equipes que precisam de produto no ar, com design que o código aguenta."                                   |
| Rótulos do hero   | sistema        | "desenvolvedor front-end", "react e next.js" (minúsculas, como pedido)                                                                                                 |
| Chamada principal | sistema        | "Vamos conversar"                                                                                                                                                      |
| Status            | sistema        | "Agenda de [mês] aberta", "Teresina • Brasil", hora                                                                                                                    |
| Faixa             | sistema        | "Projetos em destaque" (leitor de tela), "Ver todos os projetos"; fichas "01 · para a Felicoop", "Papel", "Tipo", "Entrega"                                            |
| Serviços          | sistema        | "serviços" / "O que eu faço"; itens 01 e 02 com os textos do pedido; tags em minúsculas                                                                                |
| Depoimentos       | sistema        | "depoimentos" / "O que dizem sobre o trabalho"                                                                                                                         |
| Prova             | sistema        | "prova" / "Resultado medido"; "De 34% para 89%", método "Teste de árvore no OdiN Docs."; "Nexuscoop em 30 segundos"                                                    |
| Sobre             | sistema        | "sobre" / "Desenvolvedor que veio do design de produto"; três frases só com fatos verificados; "Mais sobre mim"                                                        |
| Contato           | sistema        | "Vamos trabalhar no seu projeto" / "Conte o que você precisa e para quando." / "Solicitar orçamento"                                                                   |
| Erro do vídeo     | sistema        | "Não foi possível carregar o vídeo. Verifique a conexão e recarregue a página. Nada do que você fez nesta página se perdeu."                                           |
| 404               | mistério leve  | "Trilha perdida" / "Esta página não existe ou mudou de endereço." / "Voltar para a página inicial" / anotação: "Até quem anda com caderno de campo se perde às vezes." |
| Achado do contato | mistério       | "Algo pousado perto do correio" → "Coruja do correio, achado"                                                                                                          |

3. **Título e subtítulo:** ver a grade.
4. **Ações e rótulos:** "Vamos conversar", "Ver todos os projetos", "Mais sobre mim", "Solicitar orçamento", "Escolher tema", "Abrir menu", "Fechar menu", "Voltar para a página inicial". Links de contato com o próprio endereço ("vctgab.ux@gmail.com", "github.com/vctgab").
5. **Ajuda e placeholders:** não há campos.
6. **Termos novos ou dúvidas de glossário:** "projeto" (fichas da faixa), "achado". Nenhum termo novo.
7. **Estados:** ver a tabela de estados.
8. **Erros previstos:** vídeo que não carrega (inline, no lugar do vídeo). Nenhum outro: a página é estática.
9. **Confirmações e sucesso:** achar a coruja anuncia pelo provider de achados (já existe).
10. **Números e datas:** percentuais por `formatPercent`; hora por `LiveClock` (`@/lib/format`).
11. **Dados reais evitados:** só fatos confirmados por Victor; clientes autorizados (Felicoop, Houer Tecnologia); depoentes com nome confirmado e texto, cargo e empresa pendentes. Nada inventado: tipo, entrega, papel do OIA e do Cinnatra, fotos, vídeo, WhatsApp, LinkedIn e mês da agenda ficam `[a confirmar: …]`.
12. **Exceções pedidas:** nenhuma.

### Critérios de aceite

- [x] CA-1 A Home tem as seções A a I nesta ordem, com um `h1` e um `h2` por seção (e2e de estrutura).
- [x] CA-2 axe sem violações nos 4 temas, nos três motores, e console sem erro nem aviso de hidratação (e2e).
- [x] CA-3 "Vamos conversar" (cabeçalho e hero) leva a `#contato` enquanto o WhatsApp estiver pendente, nunca a link quebrado; "Solicitar orçamento" leva a `mailto:` com assunto (unidade de `src/lib/contact` e e2e).
- [x] CA-4 Toda pendência aparece como `[a confirmar: …]` e está na lista do `pnpm release:check`, que também acusa `/projetos/<slug>` (script e e2e).
- [x] CA-5 Clicar numa ficha da faixa leva à 404 "Trilha perdida" com link de volta à Home; a resposta tem status 404 (e2e).
- [x] CA-6 Teclado de ponta a ponta: pular para o conteúdo, menu (Drawer no mobile, com Esc), seletor de tema (abre, troca, fecha, persiste), CTA, achado da pinha e da coruja (e2e).
- [x] CA-7 CLS 0 com as fontes sem pré-carga atrasadas, em mobile e desktop (e2e `cls.spec.ts`).
- [x] CA-8 Vídeo pendente vira Ficha marcada, sem `<video>` na página; o `VideoClip` cobre os cinco estados (unidade).
- [x] CA-9 Metadados: `metadataBase` da `SITE_URL`, título e descrição em pt-BR, imagem Open Graph 1200 × 630 gerada por `next/og`, `sitemap.xml` sem `/sistema`, `robots.txt` bloqueando `/sistema`, JSON-LD `Person` só com nome, cargo, URL e GitHub (e2e).
- [ ] CA-10 (não atingido: Home 70 no simulado e 68 no devtools; ver docs/REPORT-phase-2.md) Lighthouse mobile no método padrão ≥ 90, relatado com o devtools ao lado; acessibilidade ≥ 95 (`docs/qa/phase-2/`).
- [x] CA-11 Capturas em 390×844, 768×1024, 1366×768 e 1440×900 nos 4 temas, nos três motores, revisadas (`docs/screenshots/home/`).
- [x] CA-12 Achados: a pinha e a coruja contam no caderno; a coruja tem alvo de 44 px (e2e).

## Plan

- **Conteúdo:** `src/content/{site,home,projects}.ts` (etapa 0.5). A página só compõe.
- **Arquivos:** `src/app/page.tsx` (Home), `src/app/not-found.tsx`, `src/app/opengraph-image.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx` (metadados, `ToastProvider` sai do raiz e vai para a vitrine), `src/app/sistema/layout.tsx`; `src/components/home/*` (seções da Home, só composição); `src/components/ui/fact/`, `src/components/ui/video-clip/`; ajustes em `header`, `hero`, `card`, `link-text`, `icon`, `finds/drawings`.
- **Desempenho:** menos JavaScript no layout público (sem terminal e sem toast); faixa e seções em Server Components; só hero, relógio, depoimentos, vídeo, achados e cabeçalho no cliente.
- **Riscos:** a faixa com links para rotas inexistentes gera pré-busca com 404 (mitigado com `prefetch={false}`); a 404 com `cacheComponents`; `next/og` não lê `woff2` (a imagem usa formas do motor e fonte carregada em TTF com alternativa padrão se a rede falhar); Lighthouse simulado limitado pelo JavaScript.

## Tarefas

- [x] Ficha
- [x] Conteúdo e links (etapa 0.5)
- [x] `Fact`, `VideoClip`, ícone `tema`, `Coruja`, ajustes de `Ficha`, `LinkText`, `Header`, `Hero`
- [x] Seções da Home e página
- [x] 404 "Trilha perdida"
- [x] Metadados, Open Graph, sitemap, robots, JSON-LD
- [x] Testes (um por critério)
- [x] Seção na vitrine (`Fact`, `VideoClip`, ícone `tema`)
