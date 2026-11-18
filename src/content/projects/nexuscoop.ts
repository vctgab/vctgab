import { review } from "../pending.ts"
import type { CaseFigureData, CaseImage, ProjectCase } from "./types.ts"

/**
 * Caso Nexuscoop (ficha: docs/specs/pages/case.md). O texto é o de
 * `docs/copy/case-nexuscoop.md`, literal (D-1301): não reescreva. Os itens
 * `[validar]` do copy são `review(...)` (D-1305) e entram no
 * `pnpm release:check`. Os prints vêm de build com dados fictícios (D-1311);
 * os `alt` descrevem a tela e dizem que os dados são fictícios.
 */

const DIR = "/projetos/nexuscoop"

function image(
  file: string,
  width: number,
  height: number,
  source: string,
  alt: string,
): CaseImage {
  return { src: `${DIR}/${file}.webp`, width, height, alt, source }
}

function figure(
  id: string,
  variant: CaseFigureData["variant"],
  img: CaseImage,
  caption?: string,
  priority?: boolean,
): CaseFigureData {
  return { id, variant, image: img, caption, priority }
}

const dashboardDesktop = image(
  "dashboard-desktop",
  1920,
  1200,
  "03-dashboard-cooperado-desktop",
  "Painel do cooperado do Nexuscoop, com dados fictícios: no alto, o bruto, o líquido e o total de glosas da produção do mês; abaixo, um gráfico de barras com a tendência dos últimos 12 meses, o Glosômetro (um anel com 94% de aceitação) e o bloco do último extrato.",
)

const dashboardMobile = image(
  "dashboard-mobile",
  780,
  1688,
  "03-dashboard-cooperado-mobile",
  "O painel do cooperado no celular, com dados fictícios: saudação, o selo de status e os valores bruto, líquido e próximo repasse empilhados em uma coluna, com o início do Glosômetro logo abaixo.",
)

const billingMobile = image(
  "billing-accounts-mobile",
  780,
  1688,
  "04-faturamento-contas-mobile",
  "O painel de gestão de contas no celular, com dados fictícios: título, texto de apoio, botões para novo atendimento, importar CSV, imprimir guias e exportar, e os números de contas recebidas, com prazo estourando, pendentes e liberadas no dia.",
)

const billingDesktop = image(
  "billing-accounts-desktop",
  1920,
  4388,
  "04-faturamento-contas-desktop",
  "Painel de gestão de contas no desktop, com dados fictícios: indicadores de hoje e do mês, abas por etapa da esteira, filtros por convênio, setor, analista e prazo, e uma tabela de contas com o farol de prazo em cada linha.",
)

const batchReview = image(
  "batch-review-desktop",
  1920,
  2487,
  "06c-lote-conferencia-fechamento-desktop",
  "Conferência de um lote antes do fechamento, com dados fictícios: um resumo com a soma das guias, a situação do fechamento e um bloqueio e um aviso em aberto, seguido da tabela de guias, em que uma linha marcada como bloqueante mostra uma diferença contra a tabela contratada.",
)

const batchSend = image(
  "batch-send-desktop",
  1920,
  1200,
  "06b-lote-enviar-modal-desktop",
  "Janela de envio de um lote, com dados fictícios, sobre a lista de lotes esmaecida: campos de canal, protocolo da operadora (opcional, com a explicação de que pode chegar depois), evidência em arquivo e pacote de documentos, e os botões de cancelar e registrar o envio.",
)

const onboardingCode = image(
  "onboarding-code-mobile",
  780,
  1688,
  "09b-credenciamento-otp-mobile",
  "Verificação de acesso do credenciamento no celular, com dados fictícios: um campo para o código de 6 dígitos enviado ao e-mail, o botão de verificar e o botão de reenviar, desabilitado com a contagem regressiva.",
)

const onboardingDocuments = image(
  "onboarding-documents-mobile",
  780,
  5506,
  "09d-credenciamento-checklist-documentos-mobile",
  "Etapa de documentos da ficha de matrícula no celular, com dados fictícios: a lista de locais de atendimento, o indicador de etapas, a contagem de 3 de 5 documentos obrigatórios anexados e a lista de anexos, com área para enviar cada arquivo.",
)

const onboardingSignature = image(
  "onboarding-signature-mobile",
  780,
  5868,
  "09e-credenciamento-assinatura-mobile",
  "Etapa de pagamento e assinatura da ficha de matrícula no celular, com dados fictícios: o valor da taxa de integralização, a escolha entre PIX e transferência, a área para anexar o comprovante e o aviso para revisar a ficha antes de assinar.",
)

const payoutSimulation = image(
  "payout-simulation-desktop",
  1920,
  1385,
  "07-simulacao-repasse-desktop",
  "Cálculo de repasse de uma competência, com dados fictícios: uma tabela com uma linha por cooperado, mostrando contrato, valor bruto, taxa administrativa, impostos e valor líquido, antes de processar o lote.",
)

const auditLog = image(
  "audit-log-desktop",
  1920,
  2139,
  "12a-auditoria-logs-desktop",
  "Log de auditoria, com dados fictícios: um aviso de que os registros são imutáveis, filtros por usuário, tipo de ação e período e a trilha em tabela, com data e hora, usuário, ação, IP de origem e detalhes.",
)

const styleguide = image(
  "styleguide-components-desktop",
  1920,
  1200,
  "10b-styleguide-componentes-desktop",
  "Página do style guide do projeto: escalas de cor para erro, atenção e sucesso, com onze passos cada, e o início da seção de componentes, com botões em cinco cores semânticas e em apresentações sólida, suave e contornada.",
)

const loginError = image(
  "login-error-desktop",
  1920,
  1200,
  "11a-erro-login-credenciais-desktop",
  "Tela de login do Nexuscoop, com dados fictícios, depois de credenciais recusadas: um aviso em vermelho, dentro da própria tela, com ícone e a mensagem em português pedindo para verificar os dados.",
)

const emptyClaims = image(
  "empty-claims-desktop",
  1920,
  1200,
  "11b-vazio-glosas-desktop",
  "Listagem de glosas e ocorrências sem resultados, com dados fictícios: depois dos filtros, uma mensagem central diz que nenhuma glosa foi encontrada e explica que não há registros para os filtros selecionados.",
)

export const NEXUSCOOP: ProjectCase = {
  slug: "nexuscoop",
  meta: {
    title: "Caso Nexuscoop",
    description:
      "Como liderei o time que constrói o portal de faturamento, glosas, repasse e credenciamento de uma cooperativa médica, com uma base de código para web, Android e iOS.",
  },

  header: {
    name: "Nexuscoop",
    areas: ["código", "liderança"],
    about:
      "Portal de faturamento, glosas, repasse e credenciamento da Felicoop, a cooperativa médica do Hospital Felício Rocho, em Belo Horizonte",
    facts: {
      project: "Nexuscoop",
      role: "tech lead e dev full stack",
      company: "Entrega Contínua, para a Felicoop",
      period: "mai/2026 – atual",
      team: review("papéis do time, se quiser detalhar", "5 pessoas"),
      status: "em andamento",
      stack: [
        "React 19",
        "TypeScript",
        "Vite",
        "Tailwind CSS 4",
        "Supabase (PostgreSQL, Auth, Edge Functions em Deno)",
        "Capacitor",
        "Vitest",
        "Playwright",
        "GitHub Actions",
      ],
    },
  },

  cover: figure(
    "capa",
    "browser",
    dashboardDesktop,
    "O painel do cooperado, com produção do mês, tendência de 12 meses e o Glosômetro.",
    true,
  ),

  sections: [
    {
      id: "resumo",
      title: "Resumo",
      blocks: [
        {
          type: "list",
          items: [
            {
              label: "O problema",
              content: [
                "Faturar o trabalho de mais de 500 médicos dependia de planilhas, e-mails e sistemas que não conversavam entre si.",
              ],
            },
            {
              label: "O que eu fiz",
              content: [
                "Lidero o time que constrói o portal que junta tudo isso numa esteira só, do atendimento ao repasse, na web e nos apps Android e iOS.",
              ],
            },
            {
              label: "O que mudou",
              content: [
                "Hoje cada guia tem histórico, cada lote é validado antes de sair e cada alteração deixa rastro. E nada vai pra produção sem passar por mais de 6.500 testes.",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "contexto",
      title: "Contexto",
      blocks: [
        {
          type: "text",
          content: [
            "A Felicoop é a cooperativa dos médicos do Hospital Felício Rocho. Quando um médico atende, aquele atendimento vira uma guia. A guia entra num lote, o lote vai pra operadora do plano de saúde, a operadora paga (ou glosa, que é recusar parte do valor) e só no fim o dinheiro chega ao médico como repasse.",
          ],
        },
        {
          type: "text",
          content: [
            "Antes do portal, esse caminho passava por muitas mãos. O faturista montava lotes de cerca de 100 guias numa planilha, gerava o XML e anexava no site de cada operadora. Duplicidade se conferia no olho. As tabelas de preço eram comparadas numa planilha de Excel. O credenciamento de um médico novo envolvia uma plataforma externa de documentos e um checklist marcado à mão.",
          ],
        },
        {
          type: "text",
          content: [
            "O desafio era transformar tudo isso numa esteira única, rastreável e auditável, sem travar a operação de uma cooperativa que não pode parar de faturar. Além disso, o sistema lida com dados de saúde e dinheiro de médicos, então a LGPD estava em todas as decisões.",
          ],
        },
      ],
    },

    {
      id: "o-que-eu-fiz",
      title: "O que eu fiz",
      blocks: [
        { type: "subtitle", text: "Código", level: 3 },

        {
          type: "text",
          content: [
            { strong: "Uma base de código, três plataformas." },
            ' O mesmo build em React atende a web e os apps Android e iOS, empacotados com Capacitor. No app, a sessão sai do armazenamento do navegador e vai pro Keychain/Keystore do aparelho, e a biometria vira o gesto que libera o acesso. O bug mais teimoso dessa parte: o plugin de biometria abre uma tela própria, e o app entendia a volta como "o usuário saiu e voltou", e bloqueava de novo, num laço infinito. A saída foi uma janela de 2,5 segundos que ignora esse retorno.',
          ],
        },
        {
          type: "code",
          language: "ts",
          code: review(
            "permissão para mostrar trechos do código do cliente",
            `// No app, a sessão vai para o Keychain/Keystore em vez do localStorage.
// O deep link de recuperação de senha é tratado à mão no nativo.
const native = isNativePlatform();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "implicit",
    detectSessionInUrl: !native,
    ...(native ? { storage: SecureStorage } : {}),
  },
});`,
            { withhold: true },
          ),
          caption: ["Poucas linhas separam web e app sem duplicar o código."],
        },
        {
          type: "figure-group",
          figures: [
            figure("dashboard-celular", "phone", dashboardMobile),
            figure("contas-celular", "phone", billingMobile),
          ],
          caption: "A mesma base de código, no app.",
        },

        {
          type: "text",
          content: [
            { strong: "A regra mora no banco." },
            " O acesso é controlado por row-level security em mais de 170 tabelas, com perfis configuráveis (faturista, auditor, financeiro, cooperado, admin) e MFA obrigatório pra quem mexe com dinheiro ou com permissões. No back end, 44 Edge Functions cuidam de PDFs, integrações com o hospital e com o sistema de cadastro, leitura de guia física por IA e envio de e-mail e WhatsApp.",
          ],
        },
        {
          type: "figure",
          figure: figure(
            "contas-desktop",
            "browser",
            billingDesktop,
            "A esteira de contas, com farol de prazo e paginação no servidor.",
          ),
        },

        {
          type: "text",
          content: [
            { strong: "Nada some sem deixar rastro." },
            " ",
            review("se pode contar o incidente", [
              "Depois de um susto com uma exclusão em cascata, a gente redesenhou a proteção de dados do banco.",
            ]),
            ' Toda alteração passa a ser registrada numa trilha de auditoria que só aceita inserção, nem o administrador do banco consegue apagar. "Excluir" usuário virou "desativar, com motivo". E o código novo não escapa: um teste no pre-push barra qualquer migration que quebre essas regras.',
          ],
          find: { id: "chave", label: "Algo que abre uma porta, perto do rastro" },
        },
        {
          type: "figure",
          figure: figure(
            "auditoria-desktop",
            "browser",
            auditLog,
            "Uma trilha que só aceita inserção.",
          ),
        },

        {
          type: "text",
          content: [
            { strong: "Fluxos que parecem simples e não são." },
            ' Um exemplo: o lote, depois de fechado, deveria ser imutável. Na vida real, o faturista precisa corrigir guias até depois do envio. A gente conciliou as duas coisas com edição controlada, motivo obrigatório, histórico que não se apaga e um selo de "alterado após o envio" pra ninguém mandar um XML desatualizado. O credenciamento seguiu a mesma linha: o médico candidato preenche a ficha, anexa documentos e assina sem ter conta, com acesso por código enviado ao e-mail e upload por URL assinada.',
          ],
        },
        {
          type: "figure",
          figure: figure(
            "lote-conferencia-desktop",
            "browser",
            batchReview,
            "Uma inconsistência bloqueante impede o fechamento, e cada justificativa fica registrada.",
          ),
        },
        {
          type: "figure",
          figure: figure(
            "lote-envio-desktop",
            "browser",
            batchSend,
            "Envio com canal, evidência e um protocolo que pode chegar depois.",
          ),
        },
        {
          type: "figure-group",
          figures: [
            figure("credenciamento-codigo", "phone", onboardingCode),
            figure("credenciamento-documentos", "phone", onboardingDocuments),
            figure("credenciamento-assinatura", "phone", onboardingSignature),
          ],
          caption: "Do código no e-mail até a assinatura, sem criar conta.",
        },
        {
          type: "figure",
          figure: figure(
            "repasse-desktop",
            "browser",
            payoutSimulation,
            "Uma prévia do repasse antes de processar, com as regras aplicadas guardadas.",
          ),
        },

        {
          type: "text",
          content: [
            { strong: "Qualidade no caminho, não no fim." },
            " Antes de qualquer push rodam formatação, lint, checagem de dependências circulares, os mais de 6.500 testes unitários, o build, o orçamento de tamanho de bundle (212 KB de JS na carga inicial) e um teste end-to-end. A cobertura tem um piso que só sobe: nenhum PR pode baixar a régua.",
          ],
        },
        {
          type: "figure-group",
          figures: [
            figure("erro-login", "browser", loginError),
            figure("vazio-glosas", "browser", emptyClaims),
          ],
          caption: "Toda tela tem estado de erro, de vazio e de carregamento.",
        },

        {
          type: "text",
          content: [
            { strong: "O style guide do time." },
            " Tokens de design, 42 componentes e regras documentadas de interface, linguagem e contraste, com acessibilidade baseada em WCAG. ",
            review("se as regras de UI e linguagem foram escritas por você", [
              "Aqui o designer em mim trabalhou junto com o dev: as regras de UI bloqueiam merge, do mesmo jeito que um teste quebrado.",
            ]),
          ],
        },
        {
          type: "figure",
          figure: figure(
            "styleguide-desktop",
            "browser",
            styleguide,
            "Tokens e componentes usados pelo time e pelos agentes.",
          ),
        },

        { type: "subtitle", text: "Liderança", level: 3 },
        {
          type: "text",
          content: [
            "Assumi a liderança técnica e a conversa com o cliente. Isso significa transformar reunião com a cooperativa em requisito, requisito em tarefa e tarefa em código revisado. Em seis meses foram mais de 1.100 commits e 360 pull requests.",
          ],
        },
        {
          type: "text",
          content: [
            "O time trabalha com Spec-Driven Development. Cada história vira uma spec com objetivo, contrato e casos de borda, depois um plano e, no fim, um registro das decisões. Já são 180 specs. Agentes de IA especializados ajudam em partes do processo (revisão de código, planejamento de testes, revisão de banco), mas dentro do processo, não no lugar dele: a spec vem antes do código, e a revisão humana vem antes do merge.",
          ],
        },
      ],
    },

    {
      id: "problema",
      title: "O problema que mais deu trabalho",
      blocks: [
        {
          type: "text",
          content: [{ strong: "Validar o XML do lote antes que a operadora rejeite." }],
        },
        {
          type: "text",
          content: [
            "O lote vai pra operadora num XML no padrão TISS, da ANS. Se o XML tiver um erro, a operadora rejeita dias depois, o lote volta e o médico recebe mais tarde. A ideia era simples: validar o XML contra o schema oficial antes de enviar. A execução, nem tanto.",
          ],
        },
        {
          type: "list",
          items: [
            {
              content: [
                "Não existe biblioteca madura de validação de XSD pra Deno, o runtime das Edge Functions.",
              ],
            },
            {
              content: [
                "O runtime não deixa ler os arquivos ",
                { code: ".xsd" },
                " do disco.",
              ],
            },
            { content: ["Existem duas versões do padrão em uso, com diferenças sutis."] },
            {
              content: [
                "Tudo isso precisa caber nos limites de memória e tempo de uma Edge Function.",
              ],
            },
          ],
        },
        {
          type: "text",
          content: [
            "A solução foi compilar a libxml2 pra WebAssembly e embutir os schemas oficiais no próprio código, comprimidos e conferidos por hash na carga. O validador só carrega quando alguém gera um XML, então o resto do sistema não paga o custo. As diferenças entre as versões ficam numa tabela, e não em ",
            { code: "if" },
            " espalhado pelo código.",
          ],
        },
        {
          type: "callout",
          label: "A regra mais importante do validador",
          content: [
            "E uma regra que parece detalhe, mas é a mais importante: ",
            {
              strong:
                "se o validador falhar, ele não pode devolver uma lista vazia de erros",
            },
            ', porque lista vazia quer dizer "tudo certo". Ele tem que reclamar alto.',
          ],
        },
        {
          type: "text",
          content: [
            "Resultado: um lote de 99 guias é validado em 9 a 24 milissegundos, e o faturista vê exatamente qual guia tem qual erro antes de enviar.",
          ],
        },
      ],
    },

    {
      id: "resultado",
      title: "Resultado",
      blocks: [
        {
          type: "text",
          content: [
            "O portal está em homologação, sendo usado por médicos de teste, e vai atender mais de 500 médicos da cooperativa.",
          ],
        },
        {
          type: "stats",
          items: [
            {
              value: "1",
              label: "base de código para web, Android e iOS",
              method: "React + Capacitor",
              methodKind: "fonte",
            },
            {
              value: "6.560",
              label: "testes unitários",
              method: "todos passando, mais 132 arquivos de teste de integração",
              methodKind: "fonte",
            },
            {
              value: "44",
              label: "Edge Functions no back end",
              method: "Supabase, em Deno",
              methodKind: "fonte",
            },
            {
              value: "180",
              label: "specs documentando cada decisão",
              method: "uma por história, no SDD",
              methodKind: "fonte",
            },
            {
              value: "9 a 24 ms",
              label: "para validar um lote",
              method: "lote de 99 guias validado contra o schema oficial da ANS (TISS)",
              methodKind: "metodo",
            },
          ],
        },
      ],
    },

    {
      id: "diferente",
      title: "O que eu faria diferente",
      blocks: [
        {
          type: "text",
          content: [
            review("o que eu faria diferente", [
              "Colocaria o piso de cobertura de testes no primeiro dia, não no sexto mês. Subir a régua depois funciona, mas dá mais trabalho do que começar com ela.",
            ]),
          ],
        },
      ],
    },
  ],

  next: { name: "Kasb Health", href: "/projetos/kasb-health" },
}
