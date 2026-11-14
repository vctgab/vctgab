# Campos: TextField, Textarea, Select e Label/Hint/FieldError

## Spec

### Propósito

Coletar texto e escolhas em formulários (contato, orçamento, filtros). **Quando não usar:** escolha entre 2 a 5 opções visíveis (use `RadioGroup` ou `SegmentedControl`); liga/desliga (use `Switch`); busca com resultados ao vivo (fora do escopo desta fase).

### Anatomia

1. `Label` (DM Sans 15 px, `ink`), com marca "(opcional)" quando o campo não é obrigatório.
2. Hospedeiro com forma `wobblyRect` bucket `md` (Textarea: `lg`): preenchimento `surface-raised`, contorno `border-strong` 1,75 px (3:1).
3. Controle nativo (`input`, `textarea`) ou gatilho do Radix Select, sem borda própria, texto 16 px (não dá zoom no iOS).
4. `Hint` (ajuda, `ink-muted`, 14 px).
5. `FieldError`: ícone `alerta` + texto `danger-text` que diz o que informar.
6. Contador opcional: "12 de 280 caracteres" por `formatCount`.

### Variantes e tamanhos

| Componente | Props principais                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| TextField  | `type` (`text`, `email`, `tel`, `url`, `search`), `label`, `hint`, `error`, `optional`, `maxLength` + `showCounter`, `iconLeft` |
| Textarea   | igual, com `rows` (padrão 5) e redimensionamento vertical                                                                       |
| Select     | `label`, `options` (`{ value, label }`), `placeholder`, `hint`, `error`, `optional`                                             |

Altura: 48 px (campo), Textarea a partir de 5 linhas.

### Estados (copiado do Button)

| Estado       | Comportamento                                                                                                                                                                                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Padrão       | Contorno `border-strong`.                                                                                                                                                                                                                                                                           |
| Hover        | Contorno `stroke` (um passo mais escuro).                                                                                                                                                                                                                                                           |
| Foco         | Ao focar (também por clique) ou com a lista aberta: preenchimento `primary-soft` e contorno `field-focus-stroke` (passo 950 da primária; 50 no noturno); com erro, o contorno segue `danger-fill`. Sem `outline` (D-901). Lista do Select: forma no tamanho real e margem interna de 16 px × 12 px. |
| Ativo        | Não se aplica a campos de texto; no Select, o gatilho pressionado usa `surface-hover`.                                                                                                                                                                                                              |
| Desabilitado | Motivo obrigatório (`disabledReason`), exibido no lugar da ajuda; preenchimento `surface-sunken`, contorno tracejado, texto `ink-disabled`.                                                                                                                                                         |
| Carregando   | Select com opções vindo de fora: `Spinner` no gatilho e texto "Carregando opções".                                                                                                                                                                                                                  |
| Erro         | Contorno `danger-fill` 2,5 px + ícone + texto; `aria-invalid="true"`. Cor nunca sozinha.                                                                                                                                                                                                            |
| Selecionado  | Select: opção marcada com ícone `check`.                                                                                                                                                                                                                                                            |

### Teclado

| Tecla                        | Ação                                                            |
| ---------------------------- | --------------------------------------------------------------- |
| Tab                          | Foca o controle                                                 |
| Select: Enter, Espaço, setas | Abre a lista; setas navegam; Enter escolhe; Esc fecha sem mudar |

### ARIA e nome acessível

`<label for>` liga o rótulo. `aria-describedby` lista ajuda, erro e contador. Erro: `aria-invalid`. Obrigatório: `required` nativo (sem asterisco; os opcionais são marcados). Select: papéis do Radix (`combobox`, `listbox`, `option`).

### Irregularidade

`wobblyRect` com seed = `name` ou o rótulo. Sem rotação. Padding horizontal 14 px e vertical ≥ 10 px (> amplitude 4 px + traço).

### Alto contraste e movimento

`forced-colors`: borda real `CanvasText`; erro mantém ícone e texto. Movimento: só cor (sem deslocamento).

### Ficha de Texto

1. Quem lê: quem quer pedir um orçamento ou mandar uma mensagem.
2. Grade de Tom: erro de campo, neutro e específico ("Informe um e-mail com @"); contato, objetivo e motivador.
3. Título: no formulário que usa os campos.
4. Rótulos: "Nome", "E-mail", "Mensagem", "Tipo de projeto".
5. Ajuda e placeholders: placeholders só com exemplo fictício ("nome@exemplo.com"), nunca no lugar do rótulo.
6. Termos: "mensagem", "orçamento".
7. Estados: Select carregando ("Carregando opções"), vazio ("Nenhuma opção disponível. Escreva o que precisa na mensagem."), erro ao carregar ("Não foi possível carregar as opções. Escreva o tipo de projeto na mensagem.").
8. Erros previstos: "Informe seu nome.", "Informe um e-mail com @.", "Escreva a mensagem com pelo menos 20 caracteres.", "Escolha o tipo de projeto.". Nunca "inválido" ou "obrigatório" soltos.
9. Sucesso: no formulário ("Mensagem enviada.").
10. Números: contador por `formatCount`.
11. Sem dados reais nos testes.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Rótulo ligado ao controle; ajuda e erro em `aria-describedby`.
- [x] CA-2 Erro mostra ícone e texto e define `aria-invalid`.
- [x] CA-3 Desabilitado exige motivo (tipo) e o exibe.
- [x] CA-4 Contador por `formatCount` atualiza ao digitar.
- [x] CA-5 Opcional mostra "(opcional)".
- [x] CA-6 Select abre com teclado, escolhe com Enter e mostra a escolha.
- [x] CA-7 jest-axe sem violações nos três componentes com erro e sem erro.

## Plan

`src/components/ui/field/*` (Label, Hint, FieldError, `FieldShell`), `text-field`, `textarea`, `select`. Ícone novo `seletor` (lista de opções) no conjunto e no quadro ação → ícone.

## Tarefas

- [x] Ficha
- [x] Primitivos
- [x] TextField, Textarea, Select
- [x] Testes
- [ ] Vitrine
