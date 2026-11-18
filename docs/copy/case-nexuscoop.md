# Case: Nexuscoop

Regra geral: só a primeira letra da frase em maiúscula (exceto siglas e nomes próprios).
Itens marcados com **[validar]** precisam de confirmação antes de publicar.

---

## Ficha técnica

- **Projeto:** Nexuscoop
- **O que é:** portal de faturamento, glosas, repasse e credenciamento da Felicoop, a cooperativa médica do Hospital Felício Rocho, em Belo Horizonte
- **Tags:** código · liderança
- **Status:** em andamento
- **Período:** mai/2026 – atual
- **Meu papel:** tech lead e dev full stack
- **Empresa:** Entrega Contínua, para a Felicoop
- **Time:** 5 pessoas **[validar: papéis do time, se quiser detalhar]**
- **Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · Supabase (PostgreSQL, Auth, Edge Functions em Deno) · Capacitor · Vitest · Playwright · GitHub Actions

---

## Imagem principal

`03-dashboard-cooperado-desktop.png`
Legenda: o painel do cooperado, com produção do mês, tendência de 12 meses e o Glosômetro.

---

## Resumo

- **O problema:** faturar o trabalho de mais de 500 médicos dependia de planilhas, e-mails e sistemas que não conversavam entre si.
- **O que eu fiz:** lidero o time que constrói o portal que junta tudo isso numa esteira só, do atendimento ao repasse, na web e nos apps Android e iOS.
- **O que mudou:** hoje cada guia tem histórico, cada lote é validado antes de sair e cada alteração deixa rastro. E nada vai pra produção sem passar por mais de 6.500 testes.

---

## Contexto

A Felicoop é a cooperativa dos médicos do Hospital Felício Rocho. Quando um médico atende, aquele atendimento vira uma guia. A guia entra num lote, o lote vai pra operadora do plano de saúde, a operadora paga (ou glosa, que é recusar parte do valor) e só no fim o dinheiro chega ao médico como repasse.

Antes do portal, esse caminho passava por muitas mãos. O faturista montava lotes de cerca de 100 guias numa planilha, gerava o XML e anexava no site de cada operadora. Duplicidade se conferia no olho. As tabelas de preço eram comparadas numa planilha de Excel. O credenciamento de um médico novo envolvia uma plataforma externa de documentos e um checklist marcado à mão.

O desafio era transformar tudo isso numa esteira única, rastreável e auditável, sem travar a operação de uma cooperativa que não pode parar de faturar. Além disso, o sistema lida com dados de saúde e dinheiro de médicos, então a LGPD estava em todas as decisões.

---

## O que eu fiz

### Código

**Uma base de código, três plataformas.** O mesmo build em React atende a web e os apps Android e iOS, empacotados com Capacitor. No app, a sessão sai do armazenamento do navegador e vai pro Keychain/Keystore do aparelho, e a biometria vira o gesto que libera o acesso. O bug mais teimoso dessa parte: o plugin de biometria abre uma tela própria, e o app entendia a volta como "o usuário saiu e voltou", e bloqueava de novo, num laço infinito. A saída foi uma janela de 2,5 segundos que ignora esse retorno.

```ts
// No app, a sessão vai para o Keychain/Keystore em vez do localStorage.
// O deep link de recuperação de senha é tratado à mão no nativo.
const native = isNativePlatform();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "implicit",
    detectSessionInUrl: !native,
    ...(native ? { storage: SecureStorage } : {}),
  },
});
```

_Poucas linhas separam web e app sem duplicar o código._ **[validar: permissão para mostrar trechos do código do cliente]**

**A regra mora no banco.** O acesso é controlado por row-level security em mais de 170 tabelas, com perfis configuráveis (faturista, auditor, financeiro, cooperado, admin) e MFA obrigatório pra quem mexe com dinheiro ou com permissões. No back end, 44 Edge Functions cuidam de PDFs, integrações com o hospital e com o sistema de cadastro, leitura de guia física por IA e envio de e-mail e WhatsApp.

**Nada some sem deixar rastro.** Depois de um susto com uma exclusão em cascata, a gente redesenhou a proteção de dados do banco. **[validar: se pode contar o incidente]** Toda alteração passa a ser registrada numa trilha de auditoria que só aceita inserção, nem o administrador do banco consegue apagar. "Excluir" usuário virou "desativar, com motivo". E o código novo não escapa: um teste no pre-push barra qualquer migration que quebre essas regras.

**Fluxos que parecem simples e não são.** Um exemplo: o lote, depois de fechado, deveria ser imutável. Na vida real, o faturista precisa corrigir guias até depois do envio. A gente conciliou as duas coisas com edição controlada, motivo obrigatório, histórico que não se apaga e um selo de "alterado após o envio" pra ninguém mandar um XML desatualizado. O credenciamento seguiu a mesma linha: o médico candidato preenche a ficha, anexa documentos e assina sem ter conta, com acesso por código enviado ao e-mail e upload por URL assinada.

**Qualidade no caminho, não no fim.** Antes de qualquer push rodam formatação, lint, checagem de dependências circulares, os mais de 6.500 testes unitários, o build, o orçamento de tamanho de bundle (212 KB de JS na carga inicial) e um teste end-to-end. A cobertura tem um piso que só sobe: nenhum PR pode baixar a régua.

**O style guide do time.** Tokens de design, 42 componentes e regras documentadas de interface, linguagem e contraste, com acessibilidade baseada em WCAG. Aqui o designer em mim trabalhou junto com o dev: as regras de UI bloqueiam merge, do mesmo jeito que um teste quebrado. **[validar: se as regras de UI e linguagem foram escritas por você]**

### Liderança

Assumi a liderança técnica e a conversa com o cliente. Isso significa transformar reunião com a cooperativa em requisito, requisito em tarefa e tarefa em código revisado. Em seis meses foram mais de 1.100 commits e 360 pull requests.

O time trabalha com Spec-Driven Development. Cada história vira uma spec com objetivo, contrato e casos de borda, depois um plano e, no fim, um registro das decisões. Já são 180 specs. Agentes de IA especializados ajudam em partes do processo (revisão de código, planejamento de testes, revisão de banco), mas dentro do processo, não no lugar dele: a spec vem antes do código, e a revisão humana vem antes do merge.

---

## O problema que mais deu trabalho

**Validar o XML do lote antes que a operadora rejeite.**

O lote vai pra operadora num XML no padrão TISS, da ANS. Se o XML tiver um erro, a operadora rejeita dias depois, o lote volta e o médico recebe mais tarde. A ideia era simples: validar o XML contra o schema oficial antes de enviar. A execução, nem tanto.

- Não existe biblioteca madura de validação de XSD pra Deno, o runtime das Edge Functions.
- O runtime não deixa ler os arquivos `.xsd` do disco.
- Existem duas versões do padrão em uso, com diferenças sutis.
- Tudo isso precisa caber nos limites de memória e tempo de uma Edge Function.

A solução foi compilar a libxml2 pra WebAssembly e embutir os schemas oficiais no próprio código, comprimidos e conferidos por hash na carga. O validador só carrega quando alguém gera um XML, então o resto do sistema não paga o custo. As diferenças entre as versões ficam numa tabela, e não em `if` espalhado pelo código.

E uma regra que parece detalhe, mas é a mais importante: **se o validador falhar, ele não pode devolver uma lista vazia de erros**, porque lista vazia quer dizer "tudo certo". Ele tem que reclamar alto.

Resultado: um lote de 99 guias é validado em 9 a 24 milissegundos, e o faturista vê exatamente qual guia tem qual erro antes de enviar.

---

## Resultado

O portal está em homologação, sendo usado por médicos de teste, e vai atender mais de 500 médicos da cooperativa.

- **1 base de código** para web, Android e iOS
- **6.560 testes unitários**, todos passando, além de 132 arquivos de teste de integração
- **44 Edge Functions** no back end
- **180 specs** documentando cada decisão
- **9 a 24 ms** para validar um lote de 99 guias contra o schema oficial da ANS

---

## O que eu faria diferente

Colocaria o piso de cobertura de testes no primeiro dia, não no sexto mês. Subir a régua depois funciona, mas dá mais trabalho do que começar com ela. **[validar]**

---

## Prints sugeridos ao longo do case

| Seção                      | Print                                                                                                                       | Legenda                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Imagem principal           | `03-dashboard-cooperado-desktop`                                                                                            | O painel do cooperado, com produção, tendência e Glosômetro.                             |
| Uma base, três plataformas | `03-dashboard-cooperado-mobile` + `04-faturamento-contas-mobile`                                                            | A mesma base de código, no app.                                                          |
| A regra mora no banco      | `04-faturamento-contas-desktop`                                                                                             | A esteira de contas, com farol de prazo e paginação no servidor.                         |
| Fluxos que parecem simples | `06c-lote-conferencia-fechamento-desktop`                                                                                   | Uma inconsistência bloqueante impede o fechamento, e cada justificativa fica registrada. |
| Fluxos que parecem simples | `06b-lote-enviar-modal-desktop`                                                                                             | Envio com canal, evidência e um protocolo que pode chegar depois.                        |
| Credenciamento             | `09b-credenciamento-otp-mobile` + `09d-credenciamento-checklist-documentos-mobile` + `09e-credenciamento-assinatura-mobile` | Do código no e-mail até a assinatura, sem criar conta.                                   |
| Fluxos que parecem simples | `07-simulacao-repasse-desktop`                                                                                              | Uma prévia do repasse antes de processar, com as regras aplicadas guardadas.             |
| Nada some sem rastro       | `12a-auditoria-logs-desktop`                                                                                                | Uma trilha que só aceita inserção.                                                       |
| Style guide                | `10b-styleguide-componentes-desktop`                                                                                        | Tokens e componentes usados pelo time e pelos agentes.                                   |
| Qualidade                  | `11a-erro-login-credenciais-desktop` + `11b-vazio-glosas-desktop`                                                           | Toda tela tem estado de erro, de vazio e de carregamento.                                |

Fora do case: `01-landing` (tem foto de pessoa tirada do Unsplash). No dashboard, a parte de extrato e repasse ainda usa dados de mock no sistema: a imagem pode entrar, mas o texto não apresenta essa parte como integrada.

---

## Rodapé do case

**Próximo projeto:** Kasb Health →
**CTAs:** tenho uma vaga · tenho um projeto
