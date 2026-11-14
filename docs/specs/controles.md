# Controles: Checkbox, RadioGroup, Switch e SegmentedControl

## Spec

### Propósito

- **Checkbox:** marcar itens independentes ou aceitar algo; suporta indeterminado.
- **RadioGroup:** escolher uma opção entre 2 a 6, com descrição.
- **Switch:** ligar e desligar algo que vale na hora (ex.: "Animações do hero").
- **SegmentedControl:** alternar entre visões curtas e equivalentes (ex.: "Lista" e "Grade").

**Quando não usar:** Switch em formulário que só vale ao enviar (use Checkbox); SegmentedControl com mais de 4 opções ou rótulos longos (use RadioGroup ou Select).

### Anatomia

- Checkbox: caixa 22 px (`wobblyRect`, 2 camadas), marca `check` ou `menos` desenhada, rótulo e descrição opcional. A linha inteira (rótulo incluso) é o alvo de 44 px.
- RadioGroup: `fieldset` + `legend`; cada opção com círculo irregular (`hole`) e miolo `blob` preenchido quando marcada.
- Switch: trilho `pill` 44 × 26, botão `blob` que desliza, ícone `check` no botão quando ligado; texto "Ligado"/"Desligado" opcional ao lado.
- SegmentedControl: trilho `wobblyRect` com segmentos de largura igual e um indicador próprio (`pill`) que desliza por `translate` (sem medir).

### Variantes

| Componente       | Props                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| Checkbox         | `checked` (`true`, `false`, `"indeterminate"`), `label`, `description` |
| RadioGroup       | `legend`, `options` (`value`, `label`, `description`), `orientation`   |
| Switch           | `checked`, `label`, `showState`                                        |
| SegmentedControl | `options` (2 a 4), `value`, `label`                                    |

### Estados (copiado do Button)

| Estado           | Comportamento                                                                                                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hover            | Caixa, círculo ou trilho em `surface-hover`.                                                                                                                                                                                                              |
| Foco visível     | `outline` `focus-ring` seguindo o raio da forma.                                                                                                                                                                                                          |
| Ativo            | `surface-active`.                                                                                                                                                                                                                                         |
| Selecionado      | `primary-fill` com marca `on-primary` (Checkbox), miolo `primary-fill` (Radio), trilho `primary-fill` + ícone (Switch), indicador `primary-soft` com contorno 2,5 px (Segmented). Sempre um segundo indicador além da cor (marca, miolo, posição, ícone). |
| Indeterminado    | Checkbox com marca `menos`.                                                                                                                                                                                                                               |
| Desabilitado     | Motivo obrigatório visível; tracejado; `ink-disabled`.                                                                                                                                                                                                    |
| Carregando, erro | RadioGroup e Checkbox aceitam `error` (ícone + texto no grupo). Carregando não se aplica.                                                                                                                                                                 |

### Teclado

| Componente       | Teclas                                              |
| ---------------- | --------------------------------------------------- |
| Checkbox         | Espaço alterna                                      |
| RadioGroup       | Tab entra no grupo; setas mudam e marcam            |
| Switch           | Espaço e Enter alternam                             |
| SegmentedControl | Tab entra; setas movem o foco; Espaço/Enter escolhe |

### ARIA e nome acessível

Papéis do Radix: `checkbox` (com `aria-checked="mixed"`), `radiogroup`/`radio`, `switch`, `group` com `radio` (ToggleGroup em modo único). Nomes vêm dos rótulos visíveis.

### Irregularidade

Seeds por rótulo. Formas pequenas usam bucket `sm` com irregularidade 0,35. Sem rotação.

### Alto contraste e movimento

`forced-colors`: bordas reais; marca e miolo em `CanvasText`. Movimento reduzido: botão do Switch e indicador do Segmented mudam de lugar sem transição.

### Ficha de Texto

1. Quem lê: visitantes ajustando preferências e formulários.
2. Grade de Tom: rótulos, voz de sistema, objetiva.
3. Títulos: legend do grupo ("Tipo de projeto").
4. Rótulos: substantivos curtos; Switch descreve o que liga ("Animações do hero").
5. Ajuda: descrição curta abaixo do rótulo.
6. Termos: "tema".
7. Estados: não exibem dados próprios.
8. Erros: "Escolha um tipo de projeto." (RadioGroup); "Aceite os termos para enviar." (Checkbox).
9. Sucesso: não se aplica.
10. Números: não se aplica.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Checkbox alterna com Espaço e expõe `mixed` no indeterminado.
- [x] CA-2 RadioGroup marca com as setas e expõe `radiogroup` nomeado pela legend.
- [x] CA-3 Switch alterna com Espaço e mostra o ícone quando ligado.
- [x] CA-4 SegmentedControl escolhe com teclado; o indicador usa `translate` calculado pelo índice.
- [x] CA-5 Desabilitado exige motivo nos quatro.
- [x] CA-6 Alvo de 44 px nas linhas e segmentos.
- [x] CA-7 jest-axe sem violações.

## Plan

`src/components/ui/{checkbox,radio-group,switch,segmented-control}/*` com Radix `Checkbox`, `RadioGroup`, `Switch`, `ToggleGroup`.

## Tarefas

- [x] Ficha
- [x] Componentes
- [x] Testes
- [ ] Vitrine
