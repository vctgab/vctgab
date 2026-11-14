# Achados (sistema de encontráveis)

> Camada de mistério: dicas com humor leve. Estado, erros e contagem em voz de sistema.

## Spec

### Propósito

Sete achados escondidos pelo site, que liberam a página secreta ao chegar a 7 de 7: pinha escondida, coruja do correio, mesa de contato, lápis fossilizado, pena de escrever, chave de latão e bússola. **Quando não usar:** para conteúdo essencial (achado nunca esconde informação necessária); em fluxos de formulário.

### Anatomia

- `AchadosProvider`: store com `useSyncExternalStore`, persistência em `localStorage["vg-achados"]` (try/catch). Sem armazenamento, funciona na sessão e avisa.
- `Achavel`: envolve qualquer elemento e o torna descobrível; botão com alvo de 44 px ou mais; ao achar, animação curta (pulo de 200 ms) e anúncio em `aria-live`.
- `AchadosChip`: chip fixo "Achados: 0 de 7" (no mobile, barra inferior que não cobre conteúdo: o `body` ganha `padding-bottom`). Abre o `AchadosCard`.
- `AchadosCard`: Dialog "Caderno de achados" com `ProgressHatch`, a lista dos sete (achados riscados com o nome; não achados com dica em Caveat) e as mensagens de estado.
- `AvisoPaginaSecreta`: estado indisponível da página secreta ("Esta página abre com 7 achados. Você tem 3.").
- Evento `vg:achados-completos` no `window` ao chegar a 7 de 7, e `unlocked` no hook.

### Variantes

| Componente  | Props                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------- |
| Achavel     | `id` (um dos sete), `children`, `label` (nome antes de achar, ex.: "Algo entre os pinheiros") |
| AchadosChip | `placement`: `dock` (fixo) ou `inline` (rodapé)                                               |

### Estados (cinco, MS-04, no AchadosCard)

| Estado               | O que aparece                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Carregando           | Antes de ler o armazenamento (render do servidor e hidratação): "Lendo o caderno" com Skeleton das linhas.                 |
| Vazio (primeiro uso) | "Nenhum achado ainda. As dicas abaixo ajudam a começar."                                                                   |
| Erro                 | Armazenamento indisponível: "Não foi possível guardar os achados neste navegador. Eles valem até você fechar esta página." |
| Indisponível         | Página secreta antes de 7 de 7: "Esta página abre com 7 achados. Você tem N."                                              |
| Com dados            | Lista com achados riscados e dicas; em 7 de 7: "Sete de sete. Página secreta liberada: [a confirmar: página secreta]".     |

Achavel: padrão (discreto), hover (gira 8°), foco do padrão, achado (marca tracejada ao redor + `aria-pressed="true"`, nome acessível muda para o nome do achado).

### Teclado

Achavel: Tab foca, Enter/Espaço acha. Chip: Enter abre o caderno. Caderno: Dialog (Esc fecha, foco volta ao chip).

### ARIA e nome acessível

Achavel: `button` com `aria-label` em português ("Algo entre os pinheiros"; depois de achado, "Pinha escondida, achada"). Região `aria-live="polite"` única no provider: "Achado: pinha escondida. 1 de 7.". Chip: `aria-haspopup="dialog"`. Lista do caderno: `ol`; achados com "(achado)" oculto; não achados com "Ainda não achado:" oculto antes da dica.

### Irregularidade

Chip: `wobblyRect` sm com sombra. Caderno: Dialog com furos e fita. Achavel: marca `hole` tracejada.

### Alto contraste e movimento

Chip e caderno com bordas reais; achados riscados (texto) além da cor. Movimento reduzido: sem pulo nem giro.

### Ficha de Texto

1. Quem lê: curiosos que exploram o site.
2. Grade de Tom: dicas e títulos do caderno, camada de mistério (humor leve); contagem, erros e indisponível, voz de sistema.
3. Título: "Caderno de achados"; subtítulo em Caveat "Sete coisas escondidas pelo site."
4. Ações: "Abrir o caderno de achados" (nome do chip, que mostra "Achados: 3 de 7"), "Fechar o caderno".
5. Dicas (mistério): pinha "Lá no fundo do hero, entre as formas que flutuam."; coruja "Alguém vigia o correio, perto do contato."; mesa "Na página de contato tem uma mesa."; lápis "Entre as polaroids, algo bem antigo para escrever."; pena "Ainda na página sobre, outra coisa para escrever."; chave "Na página de projetos, algo abre uma porta."; bússola "Também nos projetos, algo aponta o caminho."
6. Termos: "achado", "caderno de achados", "dica", "página secreta" (glossário).
7. Estados: tabela acima.
8. Erros: armazenamento indisponível (texto acima).
9. Sucesso: anúncio "Achado: <nome>. N de 7."
10. Números: `formatCount`.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Achar um item atualiza a contagem, persiste no `localStorage` e anuncia "Achado: … N de 7.".
- [x] CA-2 Sem armazenamento, funciona na sessão e o caderno mostra o aviso de erro.
- [x] CA-3 Em 7 de 7 dispara `vg:achados-completos` e `unlocked` vira verdadeiro.
- [x] CA-4 O chip abre o caderno; Esc fecha e devolve o foco.
- [x] CA-5 Cinco estados com os textos previstos.
- [x] CA-6 Achavel tem alvo de 44 px, nome acessível e `aria-pressed`.
- [x] CA-7 jest-axe sem violações.

## Plan

`src/lib/finds/*` (dados e store), `src/components/achados/*` (componentes). O store lê o armazenamento só no cliente; o servidor renderiza o estado "carregando" do caderno e o chip sem número (reserva de largura) para não haver erro de hidratação.

### Fase 2

- Coruja do correio escondida na Home, ao lado dos canais de contato (desenho `Coruja` em `drawings.tsx`, nome "Algo pousado perto do correio"). Teste em `tests/e2e/home.spec.ts` (CA-12).
- Chip com duas caixas de largura fixa para a troca de fonte não deslocar o conteúdo (D-1009).

## Tarefas

- [x] Ficha
- [x] Store e dados
- [x] Componentes
- [x] Testes
- [x] Vitrine
