# Relatório da fase 3: quatro estações, cada uma clara e escura

Data: 16/11/2026. Ficha: `docs/specs/themes-seasons.md`. Decisões: D-1101 a D-1115 em `docs/DECISIONS.md`.

## O que mudou

- **Modelo de tema.** Os temas `ipe`, `noturno`, `outono` e `inverno` deram lugar a dois eixos independentes: a **estação** (`data-season`: `primavera`, `verao`, `outono`, `inverno`) e o **modo** (`data-mode`: `claro`, `escuro`), os dois no `<html>`. São 8 combinações, com `color-scheme` e `<meta name="theme-color">` por combinação. `ipe` e `noturno` saíram de código, testes, fichas vivas, vitrine e documentação viva; uma varredura (TM-01) impede a volta. Os relatórios das fases 1 e 2 mantêm os nomes antigos, como registro.
- **Sementes por estação.** Primavera é o antigo ipê (rosa `#EE2476`, Pinheiro, Âmbar). Verão: verde `#12924E`, Mar `#1D7FB3`, Sol `#F2B53A`. Outono e inverno como estavam. A energia e a rotação do motor de formas ficaram por estação (primavera 1 / 1,2; verão 1,1 / 1,3; outono 1,25 / 1,4; inverno 0,7 / 0,8); a paleta do hero deriva das sementes.
- **Modo escuro generalizado.** Um bloco só, `[data-mode="escuro"]`, derivado das sementes de cada estação: superfícies quase pretas com cerca de 8% da primária, interativos no passo 400, texto de primária no 300, `on-primary` em tinta escura, sombra própria. Um ajuste de uma combinação (outono escuro) mora em `[data-season="outono"][data-mode="escuro"]`.
- **Tema inicial.** Estação pelo calendário brasileiro (hemisfério sul) em `America/Sao_Paulo`, modo por `prefers-color-scheme`, os dois no script bloqueante do `<head>`, antes da primeira pintura. A escolha manual de cada eixo prevalece e é salva em `vg-estacao` e `vg-modo` (com `try/catch`). o seletor não tem opção "Automática" nem "Do sistema" (D-1116). `vg-tema` é migrado: `ipe` para primavera clara, `noturno` para primavera escura, `outono` e `inverno` para a estação no modo claro.
- **Seletor.** O ThemeSwitcher tem a estação (`radiogroup` "Estação": quatro amostras desenhadas pelo motor de formas) e o modo (`SegmentedControl` "Modo": Claro e Escuro). A combinação em vigor, vinda do calendário e do sistema ou da escolha salva, aparece marcada; a retirada das opções "Automática" e "Do sistema" é a D-1116. Três formatos: `grid`, `compact` (Popover e Drawer) e `bar` (barra fixa da vitrine).
- **Rodapé.** Uma cena por estação (primavera: ipê florido; verão: copas cheias e sol; outono: copas e folhas; inverno: neve e flocos). No escuro é a mesma cena, à noite: as cores `footer-*` escurecem e entram lua e estrelas, uma só vez para as quatro estações, sem duplicar o desenho; o sol some.
- **Vitrine.** `/sistema/temas` mostra as 8 combinações lado a lado, com os mesmos componentes e a **matriz de contraste de cada uma** (81 pares, com amostras e resultado). A página de cores e a de acessibilidade foram adaptadas.

## Contagem de pares de contraste

`pnpm tokens:build` valida **648 pares aprovados**: 81 por combinação, nas 8. Ele falha a build se algum par reprovar, se o perigo ficar a menos de 12° de matiz da primária ou (novo) se o sucesso ficar a menos de 25°. O menor contraste entre todos os pares é 3,18:1 (texto desabilitado, piso de 3:1 com outro indicador). Botão primário (`on-primary` sobre `primary-fill`):

| Combinação       | Razão  | Matiz sucesso × primária |
| ---------------- | ------ | ------------------------ |
| primavera-claro  | 5,10:1 | 171,36°                  |
| primavera-escuro | 6,03:1 | 171,36°                  |
| verão-claro      | 5,01:1 | 27,21°                   |
| verão-escuro     | 6,70:1 | 27,21°                   |
| outono-claro     | 5,61:1 | 128,20°                  |
| outono-escuro    | 6,16:1 | 128,20°                  |
| inverno-claro    | 5,51:1 | 53,59°                   |
| inverno-escuro   | 6,42:1 | 53,59°                   |

O passo 600 do verde do verão é `#108045` e dá 5,01:1 com texto branco, como o pedido previa. Os onze passos do rosa continuam idênticos aos da fase 1 (teste).

## Sementes ajustadas (antes e depois)

Nenhuma semente do pedido precisou de ajuste: o rosa `#EE2476`, o verde `#12924E` e as demais passaram como vieram. O que mudou:

| Onde                              | Antes                                                                     | Depois                                                                                              | Motivo                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Sucesso do verão (semente nova)   | não existia; o pinheiro `#2F6B4A` ficaria a 0° da primária verde          | `#0F766E` (verde-azulado), a 27,21° da primária                                                     | Sucesso não pode se confundir com a primária verde. Ícone e texto continuam obrigatórios. |
| Outono escuro: `secondary-2-fill` | vinho no passo 400: `on-secondary-2` dava 3,93:1 (mínimo 4,5:1), reprovou | passo 300 (7,24:1) e hover no 200 (10,50:1), num bloco `[data-season="outono"][data-mode="escuro"]` | Único par reprovado pelo `tokens:build`. É ajuste de mapeamento, não de semente.          |
| Árvores do rodapé (token novo)    | derivavam de `--seed-secondary-1`                                         | `--seed-tree` por estação                                                                           | No verão a secundária 1 é o mar (azul); sem o token o verão teria árvores azuis.          |

## Qualidade

| Porta                                           | Resultado                                                                                                                                                                                                       |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check` (lint, tipos, testes e build)      | lint sem avisos, tipos sem erro, **327 testes** e build aprovados                                                                                                                                               |
| Regra de estação (CA-2)                         | teste unitário nos dias de virada e perto da meia-noite (23:59:59 e 00:00:00 em São Paulo), em 2026 a 2028, e equivalência entre a regra em TypeScript e o script do `<head>` dia a dia                         |
| axe, Chromium, todas as páginas × 8 combinações | **120 de 120 auditorias sem violação e sem mensagem de console**, todas de primeira (`docs/qa/axe-report.json`; 15 páginas: Home, Projetos, Sobre, Contato e as 11 da vitrine)                                  |
| e2e (Chromium, WebKit e Firefox)                | **264 passaram, 143 puladas por política, 1 instável (passou na repetição), 0 falhas finais.** Home nas 8 combinações nos três motores; vitrine nas 8 no Chromium e em primavera clara e escura nos outros dois |
| CLS                                             | 0 em `/` e `/sistema`, mobile e desktop, com as fontes sem pré-carga atrasadas                                                                                                                                  |
| Capturas                                        | 81 (27 por motor): Home em 390×844 e 1366×768 nas 8 combinações, rodapé de cada uma, vitrine de temas e recortes 2x a 400% em primavera clara e verão escuro, sem serrilhado                                    |

### Lighthouse da Home (mobile, mediana de 3, servidor de produção local)

Mesmos dois métodos da fase 2 (D-1008). A combinação medida é a padrão (primavera clara), a mesma do ipê na fase 2.

| Momento                    | Simulado (padrão) | Devtools | LCP sim. | TBT sim. | TBT devtools | CLS | Acessib. |
| -------------------------- | ----------------- | -------- | -------- | -------- | ------------ | --- | -------- |
| Fase 2, local (Home final) | 70                | 68       | 4,07 s   | 629 ms   | 2.313 ms     | 0   | 100      |
| Fase 2, CI (runner Linux)  | 85                | 88       | 3,40 s   | 298 ms   | 422 ms       | 0   | 100      |
| **Fase 3, local**          | **82**            | **75**   | 4,10 s   | 215 ms   | 1.106 ms     | 0   | 100      |

Sem piora: a nota sobe nesta máquina (70 para 82 e 68 para 75), o LCP simulado, que é o que limita a nota, fica igual (4,10 s contra 4,07 s), e a acessibilidade e o CLS não mudam. Uma parte da alta é variação desta máquina (D-701); não afirmo ganho. A meta de 90 no método padrão **continua não atingida**, como na fase 2 (a medição independente de referência é a do CI, que ainda não foi refeita com este código). Os resumos estão em `docs/qa/seasons/`.

## Decisões e desvios do pedido

- **Migração de `outono` e `inverno`.** O pedido só definia `ipe` e `noturno`. Eu os mapeei para a estação de mesmo nome no modo claro (eram temas claros), para quem já tinha salvo não perder o que via (D-1105).
- **Energia do noturno.** O noturno tinha energia 0,8 e rotação 0,9, diferentes do ipê. Como o modo agora é só polaridade, esse ajuste desapareceu; a energia e a rotação vêm só da estação (D-1106).
- **Margem do sucesso no verão.** A matiz do sucesso fica a 27,21° da primária, acima do mínimo de 25° que criei, mas com pouca folga. Um verde-azulado mais azul daria mais margem e se aproximaria do azul do Mar.
- **Capturas antigas removidas.** As das fases 1 e 2 (pastas `ipe`, `noturno`) foram substituídas pelas desta fase; ficam no histórico do git. O relatório da fase 2 cita caminhos que deixaram de existir (D-1114).
- **Escopo das capturas.** Foram as do pedido (Home em 2 tamanhos nas 8 combinações, recortes), mais o rodapé de cada combinação e a vitrine de temas. As capturas de 768×1024 e 1440×900 da fase 2 não foram refeitas.
- **Política de motores no e2e** (D-1113): páginas da vitrine só em primavera clara e escura fora do Chromium, como pedido. A estação do calendário é testada nos três motores com `page.clock.setFixedTime`, sem depender da data de hoje.
- **Formato `bar` do seletor e `block` do `SegmentedControl`** (D-1112), criados porque o seletor de 5 opções ficou alto demais na barra fixa da vitrine e "Do sistema" quebrava de linha no Popover.
- **Correção de CLS descoberta na QA.** O segmento marcado do `SegmentedControl` fica em negrito e mais largo; na hidratação isso movia o controle 4 px (CLS de 0,00005, que o teste de CLS acusa). O componente passou a reservar a largura do negrito com uma cópia invisível do texto.

## Limitações conhecidas

- **Um teste instável (WebKit).** `system.spec.ts` › "movimento reduzido › hero e rodapé ficam parados" falhou uma vez (três animações ainda "rodando" ao medir) e passou na repetição. Não investiguei a causa; a hipótese é a rede de segurança de movimento reduzido de `base.css`, que encurta as animações em vez de removê-las, mas não a verifiquei. Convém acompanhar.
- **Lighthouse.** Meta de 90 no método padrão não atingida (82 local); só se confirma num preview real ou no CI. O Lighthouse mediu apenas a combinação padrão; as outras não foram medidas.
- **Máquina instável** (D-701): as medições locais variam; o e2e rodou com novas tentativas.
- **Vitrine de cores mais pesada.** A página mostra só a combinação ativa por CSS, mas o HTML traz as 8 (o dobro da fase 2); não medi o custo.
- **Estação não se atualiza sozinha** se a página ficar aberta na virada do dia: vale na próxima carga.
- **Safari e Firefox na vitrine:** só primavera clara e escura.
- **A confirmar** (herdado): domínio, WhatsApp, depoimentos, cargos, fotos, e-mail e conteúdo da página secreta.

## Próximos passos

1. Refazer a medição do CI com este código e, se ainda faltar para 90, atacar o HTML das formas e os botões que são links (fase 2).
2. Investigar o teste instável do WebKit.
3. Páginas reais (Projetos, caso Nexuscoop, Sobre, Contato) compondo os componentes, já com as 8 combinações cobertas por axe.
4. Terminal `cmd`, página secreta e os seis achados restantes.
5. Node 26 LTS e diagnóstico da memória desta máquina.

## Capturas

`docs/screenshots/home/<motor>/<combinação>/390x844.jpg` e `1366x768.jpg` (combinações: `primavera-claro`, `primavera-escuro`, `verao-claro`, `verao-escuro`, `outono-claro`, `outono-escuro`, `inverno-claro`, `inverno-escuro`), `docs/screenshots/rodape/<motor>/<combinação>.jpg`, `docs/screenshots/sistema/<motor>/temas-1600x900.jpg` e `docs/screenshots/bordas/<motor>/*-2x-400.png`.
