# Quote (depoimento)

## Spec

### Propósito

Mostrar depoimentos com troca entre depoentes. **Quando não usar:** citações de terceiros sem autorização; depoimento inventado (use `[a confirmar: texto do depoimento]`).

### Anatomia

1. Lista de depoentes (radiogroup) à esquerda (desktop) ou acima (mobile).
2. Ficha com aspas grandes, texto em Fraunces (`SOFT 100`), autor, cargo e empresa.
3. Controle "Pausar troca automática" / "Retomar troca automática" quando `autoAdvance` está ligado.

### Variantes

| Prop            | Valores                                                 |
| --------------- | ------------------------------------------------------- |
| `items`         | `{ id, author, role, text }[]`                          |
| `autoAdvanceMs` | desligado (padrão) ou intervalo (mín. 6000 ms)          |
| `status`        | `carregando`, `vazio`, `erro`, `indisponivel`, `pronto` |

### Estados (cinco, MS-04)

| Estado       | O que aparece                                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Carregando   | Skeleton da ficha e da lista; `aria-busy`.                                                                              |
| Vazio        | "Ainda não há depoimentos publicados." (primeiro uso).                                                                  |
| Erro         | "Não foi possível carregar os depoimentos. Recarregue a página para tentar de novo." + botão "Tentar carregar de novo". |
| Indisponível | "Os depoimentos voltam quando cada pessoa autorizar a publicação."                                                      |
| Com dados    | Lista + ficha.                                                                                                          |

Lista: hover `surface-hover`, selecionado com fundo `ink` e texto `surface-base` (como no layout) + marca à esquerda; foco do padrão.

### Teclado

Tab entra na lista; setas trocam o depoente; Tab segue para o botão de pausa. A troca automática para enquanto houver foco ou ponteiro dentro do componente.

### ARIA e nome acessível

Lista: `radiogroup` "Escolher quem fala". A ficha é `figure` com `aria-live="polite"` só quando a troca vem de quem usa (desligado na automática, para não interromper leitores de tela).

### Irregularidade

Ficha `wobblyRect` lg com furos e fita; lista em `wobblyRect` sm. Troca com esmaecimento de 200 ms (nenhum com movimento reduzido).

### Alto contraste e movimento

Selecionado mantém a marca à esquerda além da cor. Movimento reduzido: sem esmaecimento e sem troca automática.

### Ficha de Texto

1. Quem lê: fundadores e equipes avaliando trabalho.
2. Grade de Tom: prova social, objetiva; estados em voz de sistema.
3. Título: "Depoimento" (eyebrow).
4. Ações: "Pausar troca automática", "Retomar troca automática", "Tentar carregar de novo".
5. Ajuda: não se aplica.
6. Termos: "depoimento".
7. Estados: tabela acima.
8. Erros: falha ao carregar (MS-02).
9. Sucesso: não se aplica.
10. Números: não se aplica.
11. Texto real ausente: `[a confirmar: texto do depoimento]`; na vitrine, nomes fictícios.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Cinco estados renderizam o texto previsto.
- [x] CA-2 Escolher um depoente troca a ficha; setas funcionam.
- [x] CA-3 Troca automática pausa com foco e tem botão de pausa nomeado.
- [x] CA-4 jest-axe sem violações.
- [x] CA-5 (Home v2) No estado indisponível, `unavailableMessage` troca a frase padrão e `note` mostra a pendência; com `note`, o estado é desenhado na ficha de papel com furos, sem `blockquote` (nada de citação inventada).

## Plan

`src/components/ui/quote/*` (cliente). Radix RadioGroup para a lista.

### Home v2

- Estado indisponível com `unavailableMessage?: ReactNode` e `note?: ReactNode` (D-1208). A Home usa "O depoimento entra quando a pessoa autorizar a publicação." e `[a confirmar: depoimento voltado a dev, de preferência sobre a atuação como tech lead]`.

## Tarefas

- [x] Ficha
- [x] Componente
- [x] Testes
- [x] Vitrine
