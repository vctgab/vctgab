# Página: Contato (mínima)

> Ficha de página. Escrita antes do código. Existe para os CTAs da Home ("tenho uma vaga", "tenho um projeto") chegarem a um destino real. Sem formulário, porque não há backend. Decisão: D-1212.

## Spec

### Tipo de página e tarefa

- **Tipo:** página de conversão curta.
- **Tarefa do visitante:** escolher o assunto (vaga ou projeto) e abrir um canal direto já com o assunto certo.
- **Quando não usar:** quando houver backend e formulário; esta página vira a base dele.

### Anatomia

1. `h1` "contato" e um parágrafo de apoio.
2. `SegmentedControl` "Assunto" com "vaga" e "projeto". Lê `?aba=` por `useSearchParams` e escreve com o `history.replaceState` nativo, que o Next integra ao roteador: sem rolar a página, sem nova entrada no histórico e sem ida ao servidor.
3. Painel da aba: uma frase curta e os canais diretos: e-mail (`mailto:` com assunto "Vaga" ou "Projeto") e LinkedIn (pendente: `[a confirmar: URL do LinkedIn]`).
4. Achado: **mesa de contato**, ao lado dos canais.

### Estados

| Estado                  | O que aparece                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| Sem `?aba=`             | Aba "vaga" marcada (padrão).                                                                                   |
| `?aba=` desconhecida    | Aba "vaga" marcada; a URL não é reescrita até a pessoa escolher.                                               |
| Antes da hidratação     | HTML estático com a aba "vaga" (fallback do `Suspense`); a aba da URL entra na hidratação, sem mudar a altura. |
| LinkedIn pendente       | Texto `[a confirmar: URL do LinkedIn]`, não um link quebrado.                                                  |
| Carregando, vazio, erro | Não se aplicam: conteúdo estático, sem rede.                                                                   |

### Teclado

Tab até o controle (cai na aba marcada); setas movem o foco entre "vaga" e "projeto"; Espaço ou Enter marca. Tab segue para o e-mail e para a mesa.

### ARIA e nome acessível

`main#conteudo`, um `h1`. O controle é o `SegmentedControl` (`radiogroup` nomeado "Assunto"). O painel é uma `section` nomeada pelo seu `h2` ("sobre a vaga" ou "sobre o projeto"), com `aria-live="polite"` para anunciar a troca. O e-mail tem nome com o endereço; o achado "Algo em cima da mesa" → "Mesa de contato, achado".

### Irregularidade

Só pelos componentes (`SegmentedControl`, `Ficha`, `Achavel`). Seeds `contato:*`.

### Alto contraste e movimento

Herdados dos componentes.

### Ficha de Texto

1. **Quem lê:** quem clicou num dos CTAs da Home (recrutador, tech lead, fundador).
2. **Grade de Tom:**

| Situação    | Voz      | Texto final                                                                                                                 |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| Título      | sistema  | "contato"                                                                                                                   |
| Apoio       | sistema  | "Escolha o assunto e fale direto comigo. Costumo responder em até um dia útil."                                             |
| Controle    | sistema  | "Assunto" (nome acessível); opções "vaga" e "projeto"                                                                       |
| Aba vaga    | sistema  | "sobre a vaga" / "Mande a descrição da vaga e como é o processo. Se tiver, inclua o modelo de trabalho e a faixa salarial." |
| Aba projeto | sistema  | "sobre o projeto" / "Conte o que você quer construir, para quando e se já existe algo desenhado."                           |
| Canais      | sistema  | "E-mail", "LinkedIn"; e-mail com o próprio endereço                                                                         |
| Achado      | mistério | "Algo em cima da mesa" → "Mesa de contato, achado"                                                                          |

3. **Título e subtítulo:** ver a grade.
4. **Ações e rótulos:** opções do controle; links com o endereço.
5. **Ajuda e placeholders:** não há campos.
6. **Termos novos:** "vaga" (glossário).
7. **Estados:** ver a tabela.
8. **Erros previstos:** nenhum.
9. **Confirmações e sucesso:** achar a mesa anuncia pelo provider.
10. **Números e datas:** nenhum.
11. **Dados reais evitados:** só o e-mail confirmado; LinkedIn pendente.
12. **Exceções pedidas:** nenhuma.

### Critérios de aceite

- [x] CA-1 `/contato?aba=projeto` abre com "projeto" marcado e o e-mail com assunto "Projeto"; sem `?aba=`, "vaga" marcado e assunto "Vaga" (e2e).
- [x] CA-2 Trocar a aba reescreve `?aba=` sem rolar a página nem criar entrada no histórico (e2e).
- [x] CA-3 Teclado: Tab até o controle, setas e Espaço trocam a aba (e2e).
- [x] CA-4 axe sem violações nas 8 combinações; console sem aviso de hidratação (e2e).
- [x] CA-5 A mesa conta no caderno; alvo de 44 px (e2e).
- [x] CA-6 A página deixa de ser provisória e sai da lista do `release:check` (o LinkedIn continua lá).

## Plan

`src/app/contato/page.tsx` (Server: título, apoio e `Suspense`), `src/components/contact/contact-tabs.tsx` (cliente: `useSearchParams` e `history.replaceState`), `src/content/contact.ts`. Desenho `Mesa` em `src/components/ui/finds/drawings.tsx`. Risco: `useSearchParams` sem `Suspense` quebra o build com `cacheComponents`; o fallback renderiza a mesma árvore com a aba "vaga" para não haver salto.

## Tarefas

- [x] Ficha
- [x] Conteúdo e página
- [x] Testes e2e
